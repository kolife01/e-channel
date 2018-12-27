
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs'


ScatterJS.plugins( new ScatterEOS() );

var options = {
    blockchain: 'eos',
    host: process.env.HOST,
    port: 443,
    protocol: 'https',
    chainId: process.env.CHAINID
}


  
const eos = ScatterJS.scatter.eos(options, Eos, { expireInSeconds: 60 });

export default {
    eos : eos,
    scatter : ScatterJS.scatter,
    options : options
}
    

