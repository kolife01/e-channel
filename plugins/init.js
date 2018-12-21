import eosjs_ecc from 'eosjs-ecc'
import EosManager from '~/assets/js/eos'

const eosManager = new EosManager('https://kylin.eoscanada.com')

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

    var pub_key = localStorage.getItem('eosclip_account')
    var nonce = ""

    if (localStorage.getItem('eosclip_account') == null || localStorage.getItem('eosclip_priveKey') == null ) {
    
            eosjs_ecc.randomKey().then(privateKey => {
                var publicKey = eosjs_ecc.privateToPublic(privateKey);
                console.log('Public Key: ' +  publicKey) // EOSkey...
                localStorage.setItem("eosclip_priveKey", privateKey);
                localStorage.setItem("eosclip_account", publicKey);
    
            })

            window.location.href = 'create'
          
    } else {
        usercheck();
    
        console.log("Your Account: " + localStorage.getItem('eosclip_account'))
        
    }

    window.onNuxtReady(async ({$store}) => {
        $store.dispatch('users/fetchUsers', localStorage.getItem('eosclip_account'))
    })

}