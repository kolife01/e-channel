const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

function IpfsManager(){

}

IpfsManager.add = function(title,body){
    return new Promise(resolve => {
        ipfs.add(Buffer.from(
            JSON.stringify({
                title: title,
                body: body
                })
            )
        ).then(async result => {
            resolve(result[0].hash)
        }).catch(err =>
            console.log(err)
        )
    })
}

IpfsManager.convertQuestion = async function(rows){
    var outputs = []
    for (let i = 0; i < rows.length; i++) {
        await axios.get('https://cloudflare-ipfs.com/ipfs/' + rows[i].body)
            .then(response => {
                outputs.push({title:response.data.title, body:response.data.body})
            }).catch(err => {
                //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                // console.log('err:', err);
            });
    }
    return outputs
}

IpfsManager.convertAnswer = function(title,body){
    var outputs = []
    for (let i = 0; i < rows.length; i++) {
        await axios.get('https://cloudflare-ipfs.com/ipfs/' + rows[i].body)
            .then(response => {
                outputs.push({body:response.data.body})
            }).catch(err => {
                //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                // console.log('err:', err);
            });
    }
    return outputs
}

for (let i = 0; i < result.rows.length; i++) {
    axios.get('https://cloudflare-ipfs.com/ipfs/' + result.rows[i].title)
        .then(response => {
            result.rows[i].title = response.data.title;
            result.rows[i].body = response.data.body;
        }).catch(err => {
            //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
            // console.log('err:', err);
        });
}

export default IpfsManager;
// export default ipfs;