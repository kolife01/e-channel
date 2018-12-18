import Eos from 'eosjs-api'
import axios from 'axios'

function EosManager(httpEndpoint) {

    var options = {
        httpEndpoint: httpEndpoint
    }

    this.eos = Eos(options);

}

EosManager.prototype.read = function (param) {

    return new Promise(resolve => {
        this.eos.getTableRows(
            param
        ).then(async result => {
            for (let i = 0; i < result.rows.length; i++) {
                axios.get('https://cloudflare-ipfs.com/ipfs/' + result.rows[i].title)

                    .then(response => {
                        result.rows[i].title = response.data.title;
                        result.rows[i].body = response.data.body;

                        // console.log('answer:', response.data.answer); 
                        // console.log('body:', response.data.body);

                    }).catch(err => {
                        //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                        // console.log('err:', err);
                    });
            }
            resolve(result.rows)
        }).catch(err =>
            console.log(err)
        );
    })
}


EosManager.prototype.readans = function (param) {

    return new Promise(resolve => {
        this.eos.getTableRows(
            param
        ).then(async result => {
            for (let i = 0; i < result.rows.length; i++) {
                axios.get('https://cloudflare-ipfs.com/ipfs/' + result.rows[i].answer)

                    .then(response => {
                        result.rows[i].answer = response.data.title;

                        console.log('answer:', response.data.title); 
                        // console.log('body:', response.data.body);

                    }).catch(err => {
                        //IPFS化前のデータがあり、エラーが多いので一時的にコメントアウト
                        // console.log('err:', err);
                    });
            }
            resolve(result.rows)
        }).catch(err =>
            console.log(err)
        );
    })
}

EosManager.prototype.read = function (param, index) {
    
    console.log("index: " + index)

    return new Promise(resolve => {
        this.eos.getTableRows(
            param
        ).then(async result => {
            resolve(result.rows)
        }).catch(err =>
            console.log(err)
        );
    })
    
}

EosManager.prototype.nonce = function (param, pub_key) {
    return new Promise(resolve => {
        this.eos.getTableRows(
            param
        ).then(async result => {
            var count = 0
            for(let i = 0; i< result.rows.length; i++){
                if(pub_key == result.rows[i].pub_key){
                    count = result.rows[i].count
                }
            }
            resolve(count)
        }).catch(err =>
            console.log(err)
        );
    })    
    
}

export default EosManager