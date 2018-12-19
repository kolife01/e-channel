const axios = require('axios');
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

function IpfsManager() {

}

IpfsManager.add = function (data) {
    return new Promise(resolve => {
        ipfs.add(Buffer.from(data)
        ).then(async result => {
            resolve(result[0].hash)
        }).catch(err =>
            console.log(err)
        )
    })
}

IpfsManager.convertQuestions = function (rows) {

    return new Promise(async resolve => {
        var outputs = []
        await Promise.all(rows.map(async element => {
            await axios.get('https://cloudflare-ipfs.com/ipfs/' + element.body)
                .then(response => {
                    var output = {}
                    output.title = response.data.title
                    output.body = response.data.body
                    output.question_key = element.question_key
                    output.pub_key = element.pub_key
                    output.time_stamp = element.time_stamp
                    output.point = element.point
                    output.answer_count = element.answer_count
                    output.allpoint = element.allpoint
                    outputs.push(output)
                }).catch(err => {
                    //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                    // console.log('err:', err);
                });
        })
        )
        console.log(outputs)
        resolve(outputs)
    })
}

IpfsManager.convertAnswers = function (rows) {
    return new Promise(async resolve => {
        var outputs = []
        await Promise.all(rows.map(async element => {
            await axios.get('https://cloudflare-ipfs.com/ipfs/' + element.body)
                .then(response => {
                    var output = {}
                    output.body = response.data.body
                    output.answer_key = element.answer_key
                    output.question_key = element.question_key
                    output.pub_key = element.pub_key
                    output.time_stamp = element.time_stamp
                    output.point = element.point
                    outputs.push(output)
                }).catch(err => {
                    //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                    // console.log('err:', err);
                });
        })
        )
        console.log(outputs)
        resolve(outputs)
    })
}

export default IpfsManager;
// export default ipfs;