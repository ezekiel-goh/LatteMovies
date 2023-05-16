//-- Edit Accordingly, refer to appOld.js

const express = require('express');
const createHttpError = require('http-errors');

const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('./errors');
const modulesModel = require('./models/modules');

const app = express();
app.use(express.json()); // to process JSON in request body

app.use(express.static('public'));

module.exports = app;
