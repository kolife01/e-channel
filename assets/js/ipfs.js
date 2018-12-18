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

export default IpfsManager;
// export default ipfs;