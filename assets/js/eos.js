import Eos from 'eosjs-api'

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