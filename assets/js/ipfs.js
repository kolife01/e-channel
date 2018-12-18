const axios = require('axios');
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

function IpfsManager(){

}

IpfsManager.add = function(data){
    return new Promise(resolve => {
        ipfs.add(Buffer.from(data)
        ).then(async result => {
            resolve(result[0].hash)
        }).catch(err =>
            console.log(err)
        )
    })
}

IpfsManager.convertQuestions = function(rows){
    return new Promise(async resolve => {
        var outputs = []
        for (let i = 0; i < rows.length; i++) {
            await axios.get('https://cloudflare-ipfs.com/ipfs/' + rows[i].body)
                .then(response => {
                    var output = {}
                    output.title = response.data.title
                    output.body = response.data.body
                    output.question_key = rows[i].question_key
                    output.pub_key = rows[i].pub_key
                    output.time_stamp = rows[i].time_stamp
                    output.view = rows[i].view
                    outputs.push(output)
                }).catch(err => {
                    //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                    // console.log('err:', err);
                });
        }

        resolve(outputs)
    })
}

IpfsManager.convertAnswers = function(rows){
    return new Promise(async resolve => {
        var outputs = []
        for (let i = 0; i < rows.length; i++) {
            await axios.get('https://cloudflare-ipfs.com/ipfs/' + rows[i].body)
                .then(response => {
                    var output = {}
                    output.body = response.data.body
                    output.answer_key = rows[i].answer_key
                    output.question_key = rows[i].question_key
                    output.pub_key = rows[i].pub_key
                    output.time_stamp = rows[i].time_stamp
                    output.point = rows[i].point
                    outputs.push(output)
                }).catch(err => {
                    //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                    // console.log('err:', err);
                });
        }
        console.log(outputs)
        resolve(outputs)
    })
}

export default IpfsManager;
// export default ipfs;