
require('dotenv').config()
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const axios = require('axios');
const EosApi = require('eosjs-api') 

const options = {
    httpEndpoint: 'http://mainnet.eoscalgary.io',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' // default, null for cold-storage
}

eos = EosApi(options)

const contract = "echanneldtio";

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/status", async (req, res) => {
    var point = 0;
    var userCount;
    var questionCount;
    var answerCount;

    await eos.getTableRows({
        scope: contract,
        code: contract,
        table: "user",
        json: true,
        limit: 10000,
    }).then(async result => {
        for(var i=0; i<result.rows.length; i++){
            point = point + result.rows[i].point
        }
        userCount = result.rows.length
    }).catch(err =>
        console.log(err)
    );

    await eos.getTableRows({
        scope: contract,
        code: contract,
        table: "question",
        json: true,
        limit: 10000,
    }).then(async result => {
        questionCount = result.rows.length;
    }).catch(err =>
        console.log(err)
    );

    await eos.getTableRows({
        scope: contract,
        code: contract,
        table: "answer",
        json: true,
        limit: 10000,
    }).then(async result => {
        for(var i=0; i<result.rows.length; i++){
            answerCount = result.rows.length;
        }
    }).catch(err =>
        console.log(err)
    );

    res.json({
        totalSupply: point,
        userCount: userCount,
        questionCount: questionCount,
        answerCount: answerCount
    })

});

var listener = app.listen(3001, function() {
    console.log('Your app is listening on port ' + listener.address().port);
  });