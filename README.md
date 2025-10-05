# E-Invoice Report Viewer

A full-stack application to upload, analyze, and view e-invoice reports. Supports both **JSON** and **CSV** file formats, validates data against a schema, and generates a report with coverage, rule findings, and scores.

---

## Features

- Upload invoices as JSON or CSV
- Normalize and validate data against schema
- Generate reports with:
  - Matched fields
  - Missing fields (gaps)
  - Rule findings (totals, line math, date format, currency, TRN presence)
  - Coverage score
  - Overall score
- Search, sort, and paginate reports in the frontend
- Simple and responsive UI using Tailwind CSS

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **File Handling:** JSON and CSV support
- **Data Validation:** Custom analyzerService.js

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
```

Run the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend development server:

```bash
npm run dev
```

---

## Backend API

### Upload API

**POST /api/upload**

- Upload a file or paste JSON/CSV text
- Request body options:
  - `file` (multipart/form-data)
  - `text` (raw JSON/CSV text)
  - `country` (optional)
  - `erp` (optional)

**Response:**

```json
{
  "uploadId": "64f0b5f8a4d3c1b2e1234567"
}
```

---

### Analyze API

**POST /api/analyze**

- Request body:

```json
{
  "uploadId": "<uploadId>"
}
```

- Response example:

```json
{
  "reportId": "r_1759570951306",
  "scores": {
    "data": 100,
    "coverage": 90,
    "rules": 100,
    "posture": 100,
    "overall": 95
  },
  "coverage": {
    "matched": ["invoice.id", "seller.name"],
    "close": [],
    "missing": ["buyer.city", "lines[].description"]
  },
  "ruleFindings": [
    { "rule": "TOTALS_BALANCE", "ok": true },
    { "rule": "LINE_MATH", "ok": false, "exampleLine": 1 }
  ],
  "gaps": ["buyer.city", "lines[].description"],
  "meta": {
    "rowsParsed": 10,
    "linesTotal": 25,
    "country": "AE",
    "erp": "SAP",
    "db": "mongodb"
  }
}
```

---

## Data Normalization

Before analysis, CSV and JSON data is normalized to match the schema:

```json
{
  "invoice": {
    "id": "INV-1001",
    "issue_date": "2025-01-15",
    "currency": "AED",
    "total_excl_vat": 1000,
    "vat_amount": 50,
    "total_incl_vat": 1050
  },
  "seller": {
    "name": "Alpha LLC",
    "trn": "100200300",
    "country": "AE",
    "city": "Dubai"
  },
  "buyer": {
    "name": "Beta FZ-LLC",
    "trn": "700800900",
    "country": "AE",
    "city": "Abu Dhabi"
  },
  "lines": [
    {
      "sku": "A1",
      "description": "Widget A",
      "qty": 5,
      "unit_price": 100,
      "line_total": 500
    }
  ]
}
```

---

## Frontend

- **File:** `Report.jsx`
- Features:

  - List all reports
  - Search by Report ID
  - Sort by date ascending/descending
  - Pagination with configurable limit
  - Navigate to detailed report page

- **File:** `TablePreview.jsx`
  - Simple, responsive table to preview JSON or CSV data
  - Shows first 20 rows
  - Columns auto-detected from data keys

---

## Folder Structure

```
backend/
├─ controllers/
│  └─ uploadController.js
├─ models/
│  └─ Upload.js
│  └─ Report.js
├─ services/
│  └─ analyzerService.js
├─ routes/
│  └─ uploadRouter.js
│  └─ reportRouter.js
├─ server.js
├─ package.json
frontend/
├─ src/
│  ├─ components/
│  │  └─ TablePreview.jsx
│  ├─ pages/
│  │  └─ Report.jsx
│  ├─ App.jsx
│  └─ main.jsx
├─ package.json
```

---

## Dependencies

### Backend

```bash
npm install express mongoose multer csv-parser dotenv
```

### Frontend

```bash
npm install react react-dom react-router-dom lucide-react
```

---

## License

MIT License

### developed by Siranjeevi P
