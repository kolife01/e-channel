const express = require('express')
var router = express.Router();
const Eos = require('eosjs')
const { GoogleApis } = require('googleapis');


router.get("/views", (req, res) => {

    const google = new GoogleApis();
    var analytics = google.analyticsreporting('v4');      //準備時に生成したJSONファイルを指定
    var viewId = process.env.ANALYTICS_VIEWID;                           //GoogleAnalyticsのビューidを指定
    var startDate = "2018-01-01";
    var endDate = "2019-04-01";

    var jwtClient = new google.auth.JWT(process.env.ANALYTICS_EMAIL, null, process.env.ANALYTICS_KEY.replace(/\\n/g, '\n'), ["https://www.googleapis.com/auth/analytics.readonly"], null);

    jwtClient.authorize((error, tokens) => {
        if (error) {
            console.log(error);
            return;
        }
        analytics.reports.batchGet({
            resource: {
                "reportRequests": [
                    {
                        "dateRanges": [
                            {
                                "startDate": startDate,
                                "endDate": endDate
                            }
                        ],
                        "viewId": viewId,
                        "dimensions": [
                            {
                                "name": "ga:pagePath"
                            }
                        ],
                        "dimensionFilterClauses": [
                            {
                                "filters": [
                                    {
                                        "dimensionName": "ga:pagePath",
                                        "operator": "BEGINS_WITH",
                                        "expressions": ["/questions/"]
                                    }
                                ]
                            }
                        ],
                        "metrics": [
                            {
                                "expression": "ga:pageviews"
                            }
                        ],
                        "orderBys": [
                            {
                                "fieldName": 'ga:pagePath',
                                "orderType": 'VALUE',
                                "sortOrder": 'ASCENDING'
                            }
                        ],
                    }
                ]
            },
            auth: jwtClient
        }, (error, response) => {
            if (error) {
                console.log(error);
            }
    
            var result = [];
    
            for (var i = 0; i < response.data.reports[0].data.rows.length; i++) {
                var index = response.data.reports[0].data.rows[i].dimensions[0].substring(11, 20)
                var views = response.data.reports[0].data.rows[i].metrics[0].values[0]
                if (!isNaN(index)) {
                    var jsonVariable = {}
                    jsonVariable[index] = views
                    result.push(jsonVariable)
                }
            }
    
            res.json({views: result})
    
        });
    });
})



router.post("/addanswer", (req, res) => {

    var options = {
        httpEndpoint: process.env.ENDPOINT,
        keyProvider: process.env.PRIV_KEY,
        chainId: process.env.CHAINID
    }

    const eos = Eos(options)

    options = {
        authorization: process.env.ACCOUNT + '@' + 'active',
        broadcast: true,
        sign: true
    }

    const param = req.body;

    eos.contract(process.env.CONTRACT).then(contract => {
        contract.addanswer(param.question_key, param.answer, process.env.ACCOUNT, param.sig, param.pub_key, options).then(response => {
            res.json({status: true})
            console.log("success");
        }).catch(err => {
            console.log(err);
        });
    });    


})

router.post("/addquestion", (req, res) => {

    var options = {
        httpEndpoint: process.env.ENDPOINT,
        keyProvider: process.env.PRIV_KEY,
        chainId: process.env.CHAINID
    }

    const eos = Eos(options)

    options = {
        authorization: process.env.ACCOUNT + '@' + 'active',
        broadcast: true,
        sign: true
    }

    const param = req.body;

    eos.contract(process.env.CONTRACT).then(contract => {
        contract.addquestion(param.question_title, param.question_body, process.env.ACCOUNT, param.sig, param.pub_key, options).then(response => {
            res.json({status: true})
            console.log("success");
        }).catch(err => {
            console.log(err);
        });
    });    

})

module.exports = router