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
            var output = result.rows.reverse(); 
            resolve(output)
        }).catch(err =>
            console.log(err)
        );
    })
}

EosManager.prototype.readTrend = function (param) {
    return new Promise(resolve => { 
        this.eos.getTableRows(
            param
        ).then(async result => {
            
            var output = result.rows
            output.sort(function(a,b){
                if(a.answer_count < b.answer_count) return -1;
                if(a.answer_count > b.answer_count) return 1;
                return 0;
            });

            var output = output.reverse(); 
            resolve(output)
            }).catch(err =>
                console.log(err)
            );
        })
    }

EosManager.prototype.readPoint = function (param) {
    return new Promise(resolve => { 
        this.eos.getTableRows(
            param
        ).then(async result => {
            
            var output = result.rows
            output.sort(function(a,b){
                if(a.allpoint < b.allpoint) return -1;
                if(a.allpoint > b.allpoint) return 1;
                return 0;
            });

            var output = output.reverse(); 
            resolve(output)
            }).catch(err =>
                console.log(err)
            );
        })
    }


EosManager.prototype.readByQuestionKey = function (param, index) {
    return new Promise(resolve => {
        this.eos.getTableRows(
            param
        ).then(async result => {
            var output = []
            for(var i=0; i<result.rows.length; i++){
                if(result.rows[i].question_key == index){
                    output.push(result.rows[i])
                }
            }
            // var output = output.reverse(); 
            resolve(output)
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