const { v4: uuid } = require("uuid");

const normalizeKey = (key) => key.toLowerCase().replace(/[\s_]/g, "");

const setValueByPath = (obj, path, value) => {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (part.endsWith("[]")) {
      const arrKey = part.replace("[]", "");
      if (!current[arrKey]) current[arrKey] = [{}];
      if (!current[arrKey][0]) current[arrKey][0] = {};
      current = current[arrKey][0];
    } else if (i === parts.length - 1) {
      current[part] = value;
    } else {
      if (!current[part]) current[part] = {};
      current = current[part];
    }
  }
};

const getValueByPath = (obj, path) => {
  const parts = path.split(".");
  let current = obj;
  for (let part of parts) {
    if (!current) return undefined;
    if (part.endsWith("[]")) {
      const key = part.replace("[]", "");
      if (!Array.isArray(current[key])) return undefined;
      current = current[key][0];
    } else {
      current = current[part];
    }
  }
  return current;
};

const inferType = (val) => {
  if (!val) return "string";
  if (!isNaN(Number(val))) return "number";
  if (/^\d{4}(-|\/)\d{2}(-|\/)\d{2}$/.test(val)) return "date";
  return "string";
};

const normalizeDataDynamic = (rawData) => {
  if (!Array.isArray(rawData)) return [];
  return rawData.map((row) => {
    const obj = {};
    Object.entries(row).forEach(([key, value]) => {
      const pathParts = key.split(".");
      setValueByPath(obj, pathParts.join("."), value);
    });
    return obj;
  });
};

const analyzeDataDynamic = (data, uploadDoc = {}) => {
  if (!Array.isArray(data) || data.length === 0)
    return {
      reportId: `r_${uuid()}`,
      scores: { data: 0, coverage: 0, rules: 0, posture: 0, overall: 0 },
      coverage: { matched: [], missing: [] },
      ruleFindings: [],
      gaps: [],
      meta: {
        rowsParsed: 0,
        linesTotal: 0,
        country: uploadDoc?.country || "N/A",
      },
    };

  const fieldSet = new Set();
  const traverse = (obj, prefix = "") => {
    Object.entries(obj || {}).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object"
      ) {
        traverse(value[0], `${path}[]`);
      } else if (value && typeof value === "object") {
        traverse(value, path);
      } else {
        fieldSet.add(path);
      }
    });
  };
  data.forEach((row) => traverse(row));

  const allFields = Array.from(fieldSet);
  const coverageScore = Math.round(
    (allFields.length / (allFields.length + 1)) * 100
  );

  const ruleFindings = [];
  data.forEach((item) => {
    allFields.forEach((field) => {
      const value = getValueByPath(item, field);
      if (value === undefined || value === "")
        ruleFindings.push({ rule: `${field}_REQUIRED`, ok: false });
      else ruleFindings.push({ rule: `${field}_REQUIRED`, ok: true });
    });
  });

  const validRules = ruleFindings.filter((r) => r.ok).length;
  const ruleScore = Math.round((validRules / ruleFindings.length) * 100);
  const postureScore = 100;
  const dataScore = 100;
  const overall = Math.round(
    (dataScore + coverageScore + ruleScore + postureScore) / 4
  );

  return {
    reportId: `r_${uuid()}`,
    scores: {
      data: dataScore,
      coverage: coverageScore,
      rules: ruleScore,
      posture: postureScore,
      overall,
    },
    coverage: { matched: allFields, missing: [] },
    ruleFindings,
    gaps: [],
    meta: {
      rowsParsed: data.length,
      linesTotal: data.reduce((acc, cur) => acc + (cur.lines?.length || 0), 0),
      country: uploadDoc?.country || data[0]?.seller?.country || "N/A",
      erp: uploadDoc?.erp || data[0]?.erp || "Unknown",
      db: process.env.DB_NAME || "mongodb",
    },
  };
};

module.exports = {
  analyzeDataDynamic,
  normalizeDataDynamic,
  normalizeKey,
  setValueByPath,
  getValueByPath,
};
