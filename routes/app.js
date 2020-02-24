var express = require('express');

var app = express();

// var Usuario = require('../models/usuario');

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'app routes'
    });
});

module.exports = app;
