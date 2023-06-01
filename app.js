//-- Edit Accordingly, refer to appOld.js

const express = require('express');
const path = require('path');
const createHttpError = require('http-errors');
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('./errors');
const app = express();



module.exports = app;
