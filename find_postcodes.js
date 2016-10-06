#!/usr/bin/env node

'use strict';

var fileName = process.argv[3];
var apiKey = process.argv[2];
var google = require('./lib/google.js')(apiKey);
var csv = require('csv');
var fs = require('fs');

function parseCSV(fileName, callback) {

    console.log('Reading file '+fileName);
    fs.readFile(fileName, function (err, data) {
        if (err) throw err;
        csv.parse(data, {columns: true}, callback);
    });
}

parseCSV(fileName, function (err, array) {
    if (err) throw err;
    array.forEach(function (row) {
        let postCode = row.Postcode;
        google.getAddress(postCode,function (err, address) {
            if (err) throw err;
            console.log(`Postcode: ${postCode} => address: ${address}`);
        });
    });
});

