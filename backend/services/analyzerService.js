const { isMatch } = require("../utils/fieldMatcher");

const MOCK_GETS_KEYS = [
  "invoice.id",
  "invoice.issue_date",
  "invoice.currency",
  "invoice.total_excl_vat",
  "invoice.vat_amount",
  "invoice.total_incl_vat",
  "seller.name",
  "seller.trn",
  "seller.country",
  "seller.city",
  "buyer.name",
  "buyer.trn",
  "buyer.country",
  "buyer.city",
  "lines.sku",
  "lines.description",
  "lines.qty",
  "lines.unit_price",
  "lines.line_total",
];

const analyzeData = (data, questionnaire = {}) => {
  const matched = [];
  const close = [];
  const missing = [];

  MOCK_GETS_KEYS.forEach((key) => {
    const parts = key.split(".");
    let found = false;
    data.forEach((row) => {
      let value = row;
      for (let part of parts) {
        if (value && part in value) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      if (value !== null) found = true;
    });
    if (found) matched.push(key);
    else missing.push(key);
  });

  const ruleFindings = data.map((row, idx) => {
    const findings = [];

    const totalCheck =
      Math.abs(
        (row.total_excl_vat || 0) +
          (row.vat_amount || 0) -
          (row.total_incl_vat || 0)
      ) < 0.01;
    findings.push({ rule: "TOTALS_BALANCE", ok: totalCheck });

    const lineCheck =
      Math.abs((row.qty || 0) * (row.unit_price || 0) - (row.line_total || 0)) <
      0.01;
    findings.push({
      rule: "LINE_MATH",
      ok: lineCheck,
      exampleLine: idx + 1,
      expected: (row.qty || 0) * (row.unit_price || 0),
      got: row.line_total,
    });

    const dateCheck = /^\d{4}-\d{2}-\d{2}$/.test(row.issue_date || "");
    findings.push({ rule: "DATE_ISO", ok: dateCheck });

    const currencyCheck = ["AED", "SAR", "MYR", "USD"].includes(row.currency);
    findings.push({
      rule: "CURRENCY_ALLOWED",
      ok: currencyCheck,
      value: row.currency,
    });

    const trnCheck = row?.buyer?.trn && row?.seller?.trn ? true : false;
    findings.push({ rule: "TRN_PRESENT", ok: trnCheck });

    return findings;
  });

  const scores = {
    data: 100,
    coverage: Math.round((matched.length / MOCK_GETS_KEYS.length) * 100),
    rules: 100,
    posture: 100,
  };
  scores.overall =
    0.25 * scores.data +
    0.35 * scores.coverage +
    0.3 * scores.rules +
    0.1 * scores.posture;

  return {
    reportId: "r_" + Date.now(),
    scores,
    coverage: { matched, close, missing },
    ruleFindings: ruleFindings.flat(),
    gaps: missing,
    meta: {
      rowsParsed: data.length,
      linesTotal: data.length,
      country: "UAE",
      erp: "SAP",
      db: "mongodb",
    },
  };
};

module.exports = { analyzeData };
