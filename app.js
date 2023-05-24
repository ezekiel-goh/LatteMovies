//-- Edit Accordingly, refer to appOld.js

const express = require('express');
const path = require('path');
const createHttpError = require('http-errors');
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('./errors');
const app = express();
const pool = require('./database');
const { insertData, generateHistogramData } = require('./public/histogram/histogram.js');

app.use(express.json()); // to process JSON in request body

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'histogram.html'));
})
,
app.post('/insertData', async (req, res) => {
    try {
      const data = req.body;
      await insertData(data);
      res.status(200).send('Data inserted successfully!');
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('Error inserting data');
    }
  })
,
app.get('/histogramData', async (req, res) => {
    try {
      const histogramData = await generateHistogramData();
      res.status(200).json(histogramData);
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Error retrieving data');
    }
})


module.exports = app;
