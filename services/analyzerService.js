const schema = require("../schema/gets_v0_1_schema.json");

const normalize = (key) => key.toLowerCase().replace(/[\s_]/g, "");

const isMatch = (sourceKey, targetKey) => {
  sourceKey = normalize(sourceKey);
  targetKey = normalize(targetKey);
  return sourceKey === targetKey || targetKey.includes(sourceKey);
};

const normalizeData = (rawData) => {
  return rawData.map((row) => ({
    invoice: {
      id: row.inv_id || row.invoice?.id,
      issue_date: row.date || row.invoice?.issue_date,
      currency: row.currency || row.invoice?.currency,
      total_excl_vat: row.total_excl_vat || row.invoice?.total_excl_vat,
      vat_amount: row.vat_amount || row.invoice?.vat_amount,
      total_incl_vat: row.total_incl_vat || row.invoice?.total_incl_vat,
    },
    seller: {
      name: row.seller_name || row.seller?.name,
      trn: row.seller_trn || row.seller?.trn,
      country: row.seller_country || row.seller?.country,
      city: row.seller_city || row.seller?.city,
    },
    buyer: {
      name: row.buyer_name || row.buyer?.name,
      trn: row.buyer_trn || row.buyer?.trn,
      country: row.buyer_country || row.buyer?.country,
      city: row.buyer_city || row.buyer?.city,
    },
    lines: row.lines || [],
  }));
};

const analyzeData = (data, uploadDoc = {}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      reportId: `r_${Date.now()}`,
      scores: { data: 0, coverage: 0, rules: 0, posture: 0, overall: 0 },
      coverage: { matched: [], close: [], missing: [] },
      ruleFindings: [],
      gaps: [],
      meta: {
        rowsParsed: 0,
        linesTotal: 0,
        country: uploadDoc?.country || "N/A",
        erp: uploadDoc?.erp || "Unknown",
        db: process.env.DB_NAME || "mongodb",
      },
    };
  }

  const requiredFields = schema.fields.map((f) => f.path);
  const presentFields = new Set();

  const traverse = (obj, prefix = "") => {
    Object.entries(obj || {}).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(value)) {
        presentFields.add(`${path}[]`);
        if (value.length > 0 && typeof value[0] === "object")
          traverse(value[0], `${path}[]`);
      } else if (value && typeof value === "object") {
        traverse(value, path);
      } else {
        presentFields.add(path);
      }
    });
  };
  data.forEach((row) => traverse(row));

  const matched = requiredFields.filter((f) => presentFields.has(f));
  const missing = requiredFields.filter((f) => !presentFields.has(f));
  const coverageScore = Math.round(
    (matched.length / requiredFields.length) * 100
  );

  const ruleFindings = [];
  data.forEach((invoice) => {
    if (invoice.lines && Array.isArray(invoice.lines)) {
      invoice.lines.forEach((line, lineIdx) => {
        const expected = line.qty * line.unit_price;
        ruleFindings.push({
          rule: "LINE_MATH",
          ok: expected === line.line_total,
          exampleLine: lineIdx + 1,
          expected,
          got: line.line_total,
        });
      });
    }
    ruleFindings.push({
      rule: "DATE_ISO",
      ok: /^\d{4}-\d{2}-\d{2}$/.test(invoice.invoice.issue_date || ""),
    });
    ruleFindings.push({
      rule: "CURRENCY_ALLOWED",
      ok: ["AED", "SAR", "MYR", "USD"].includes(invoice.invoice.currency),
    });
    ruleFindings.push({
      rule: "TRN_PRESENT",
      ok: !!invoice.seller.trn && !!invoice.buyer.trn,
    });
    ruleFindings.push({
      rule: "TOTALS_BALANCE",
      ok:
        invoice.invoice.total_incl_vat ===
        invoice.invoice.total_excl_vat + invoice.invoice.vat_amount,
    });
  });

  const rulesOk = ruleFindings.filter((r) => r.ok).length;
  const ruleScore = Math.round((rulesOk / ruleFindings.length) * 100);
  const dataScore = 100;
  const postureScore = 100;
  const overall = Math.round(
    dataScore * 0.25 +
      coverageScore * 0.35 +
      ruleScore * 0.3 +
      postureScore * 0.1
  );

  return {
    reportId: `r_${Date.now()}`,
    scores: {
      data: dataScore,
      coverage: coverageScore,
      rules: ruleScore,
      posture: postureScore,
      overall,
    },
    coverage: { matched, close: [], missing },
    ruleFindings,
    gaps: missing,
    meta: {
      rowsParsed: data.length,
      linesTotal: data.reduce((acc, cur) => acc + (cur.lines?.length || 0), 0),
      country: uploadDoc?.country || data[0]?.seller?.country || "N/A",
      erp: uploadDoc?.erp || data[0]?.erp || "Unknown",
      db: process.env.DB_NAME || "mongodb",
    },
  };
};

module.exports = { analyzeData, normalizeData, normalize, isMatch };
