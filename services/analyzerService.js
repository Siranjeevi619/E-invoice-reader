const getV01Schema = {
  version: "0.1",
  fields: [
    { path: "invoice.id", type: "string", required: true },
    {
      path: "invoice.issue_date",
      type: "date",
      format: "YYYY-MM-DD",
      required: true,
    },
    {
      path: "invoice.currency",
      type: "enum",
      enum: ["AED", "SAR", "MYR", "USD"],
      required: true,
    },
    { path: "invoice.total_excl_vat", type: "number", required: true },
    { path: "invoice.vat_amount", type: "number", required: true },
    { path: "invoice.total_incl_vat", type: "number", required: true },
    { path: "seller.name", type: "string", required: true },
    { path: "seller.trn", type: "string", required: true },
    {
      path: "seller.country",
      type: "string",
      pattern: "^[A-Z]{2}$",
      required: true,
    },
    { path: "seller.city", type: "string", required: false },
    { path: "buyer.name", type: "string", required: true },
    { path: "buyer.trn", type: "string", required: true },
    {
      path: "buyer.country",
      type: "string",
      pattern: "^[A-Z]{2}$",
      required: true,
    },
    { path: "buyer.city", type: "string", required: false },
    { path: "lines[].sku", type: "string", required: true },
    { path: "lines[].description", type: "string", required: false },
    { path: "lines[].qty", type: "number", required: true },
    { path: "lines[].unit_price", type: "number", required: true },
    { path: "lines[].line_total", type: "number", required: true },
  ],
};

function normalizeData(rawData) {
  return rawData.map((row) => ({
    invoice: {
      id: row.inv_id,
      issue_date: row.date,
      currency: row.currency,
      total_excl_vat: row.total_excl_vat,
      vat_amount: row.vat_amount,
      total_incl_vat: row.total_incl_vat,
    },
    seller: {
      name: row.seller_name,
      trn: row.seller_trn,
      country: row.seller_country,
      city: row.seller_city,
    },
    buyer: {
      name: row.buyer_name,
      trn: row.buyer_trn,
      country: row.buyer_country,
      city: row.buyer_city,
    },
    lines: row.lines || [],
  }));
}

const analyzeData = (data) => {
  const schemaFields = getV01Schema.fields.map((f) => f.path);
  const matched = [];
  const close = [];
  const missing = [];

  schemaFields.forEach((key) => {
    const parts = key.replace("[]", "").split(".");
    let found = false;

    data.forEach((row) => {
      let value = row;
      for (let part of parts) {
        if (value && part in value) value = value[part];
        else {
          value = null;
          break;
        }
      }
      if (value !== null && value !== undefined) found = true;
    });

    if (found) matched.push(key);
    else missing.push(key);
  });

  const ruleFindings = [];

  data.forEach((row, idx) => {
    const findings = [];

    const totalCheck =
      Math.abs(
        (row.invoice?.total_excl_vat || 0) +
          (row.invoice?.vat_amount || 0) -
          (row.invoice?.total_incl_vat || 0)
      ) < 0.01;
    findings.push({ rule: "TOTALS_BALANCE", ok: totalCheck });

    row.lines?.forEach((line, lineIdx) => {
      const lineCheck =
        Math.abs(
          (line.qty || 0) * (line.unit_price || 0) - (line.line_total || 0)
        ) < 0.01;
      findings.push({
        rule: "LINE_MATH",
        ok: lineCheck,
        exampleLine: lineIdx + 1,
        expected: (line.qty || 0) * (line.unit_price || 0),
        got: line.line_total,
      });
    });

    const dateCheck = /^\d{4}-\d{2}-\d{2}$/.test(row.invoice?.issue_date || "");
    findings.push({ rule: "DATE_ISO", ok: dateCheck });

    const currencyCheck = ["AED", "SAR", "MYR", "USD"].includes(
      row.invoice?.currency
    );

    
    findings.push({ rule: "CURRENCY_ALLOWED", ok: currencyCheck });

    const trnCheck = row?.buyer?.trn && row?.seller?.trn ? true : false;
    findings.push({ rule: "TRN_PRESENT", ok: trnCheck });

    ruleFindings.push(...findings);
  });

  const scores = {
    data: 100,
    coverage: Math.round((matched.length / schemaFields.length) * 100),
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
    ruleFindings,
    gaps: missing,
    meta: {
      rowsParsed: data.length,
      linesTotal: data.reduce(
        (acc, cur) => acc + (cur.lines ? cur.lines.length : 0),
        0
      ),
      country: data[0]?.seller?.country || "N/A",
      erp: "SAP",
      db: "mongodb",
    },
  };
};
module.exports = { analyzeData, normalizeData };
