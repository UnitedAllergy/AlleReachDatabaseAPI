// Import required packages
const express = require('express');
const mssql = require('mssql');

// Create Express application
const app = express();
const port = process.env.PORT || 1443;

// Define valid API keys (replace with your actual API keys)
const validApiKeys = ['e511b839-3986-470c', '0c02c658-5190-4256'];

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Apply API key validation middleware to all routes
app.use(validateApiKey);

// SQL Server configuration
const config = {
  user: 'allereach.admin',
  password: 'Jhx59h*jSivGYCQ2',
  server: 'allereachsqlserver.database.windows.net', //fix this
  database: 'allereachsqldb',
  options: {
    encrypt: true, // Use encryption
    enableArithAbort: true // Enable ArithAbort
  }
};

// API routes
app.get('/orders', async (req, res) => {
  try {
    const pool = await new mssql.ConnectionPool(config).connect();
    const result = await pool.request().query('SELECT TOP 1 PERCENT * FROM dbo.Prescriptions WHERE Rx_Fill_Detail_Current_State <> \'Cancelled\'');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
