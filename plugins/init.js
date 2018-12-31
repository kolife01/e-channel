import eosjs_ecc from 'eosjs-ecc'
import EosManager from '~/assets/js/eos'
import ScatterJS from 'scatterjs-core';

const eosManager = new EosManager(process.env.ENDPOINT)
const public_key = localStorage.getItem('eosclip_account')

async function usercheck(){
    var param = {
        scope: 'eosqatest334',
        code: 'eosqatest334',
        table: 'user',
        json: true,
        limit: 100
      }
    
    nonce = await eosManager.nonce(param, pub_key)
    console.log(nonce)



    if(nonce == 0 && window.location.href != window.location.origin + '/create'){
        console.log(window.location.origin)
        window.location.href = window.location.origin + '/create'
    }


} 

if (process.browser) {

    // ScatterJS.scatter.connect("e-channel", connectionOptions).then(connected => {
    //     if(!connected) {
    //         // User does not have Scatter installed/unlocked.
    //         return false;
    //     }
    // })

    var pub_key = localStorage.getItem('eosclip_account')
    var nonce = ""

    if (localStorage.getItem('eosclip_account') == null || localStorage.getItem('eosclip_priveKey') == null ) {
    
        /*

            eosjs_ecc.randomKey().then(privateKey => {
                var publicKey = eosjs_ecc.privateToPublic(privateKey);
                console.log('Public Key: ' +  publicKey) // EOSkey...
                localStorage.setItem("eosclip_priveKey", privateKey);
                localStorage.setItem("eosclip_account", publicKey);
    
            })

        */

            //window.location.href = window.location.origin + '/create'
          
    } else {

        //usercheck();
        console.log("Your Account: " + localStorage.getItem('eosclip_account'))
        
    }




    window.onNuxtReady(async ({$store}) => {

        $store.dispatch('users/fetchUsers', localStorage.getItem('eosclip_account'))
        $store.dispatch('myquestions/fetchMyquestions', localStorage.getItem('eosclip_account'))
        $store.dispatch('myquestions/fetchMyanswers', localStorage.getItem('eosclip_account'))

    })

}