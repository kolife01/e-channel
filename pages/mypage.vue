<template>

    <v-content>
    <v-container>
      <v-layout
        v-for="user in users"
        :key="user.user_key"
      >
        <v-card style = "width:100%"> 
          <v-card-title>
            <div class="headline">{{JSON.parse(user.meta).name}}</div> 
          </v-card-title>
          <v-card-text>
            <div class="grey--text">{{ user.pub_key }}</div>
            <p>POINT: {{ user.point }}</p>

            <v-btn dark color="blue" id="withdraw_eos" @click="dialog = true" large>Withdraw EOS</v-btn>   
            <v-btn dark color="red" id="add_answer" v-on:click="export_key" large>Export SecretKey</v-btn> 
            <v-btn dark color="black" id="add_answer" v-on:click="logout" large>Logout</v-btn>        

          </v-card-text>
          <v-card-actions>
     
          </v-card-actions>
        </v-card>
      </v-layout>
      
    </v-container>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Withdraw EOS</v-card-title>

        <v-card-text>

        <v-text-field 
          id="sendto_account" 
          label="Account" 
          required >
        </v-text-field> 

        <v-text-field 
          id="input_amount" 
          label="Amount of point" 
          required >
        </v-text-field>       

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-spacer></v-spacer>
          <br>

          <v-btn
            color="teal darken-1"
            flat="flat"
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="teal darken-1"
            flat="flat"
            @click="send"
          >
            Send
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-content>

</template>

<script>
import { mapGetters } from 'vuex'
import EosManager from '~/assets/js/eos'
const eosManager = new EosManager(process.env.ENDPOINT)
import eosjs_ecc from 'eosjs-ecc'
const Eos = require('eosjs')
import axios from 'axios'

export default {
  
  data: () => ({
      dialog: false
    }),

  // async asyncData(context) {
  //   const { store } = context
  //   await store.dispatch('users/fetchUsers')
  // },
  computed: {
    ...mapGetters('users', ['users'])

  },
  methods: {
    async export_key() {
      var prive_key = localStorage.getItem('eosclip_priveKey');
      
      alert("この秘密鍵は次回ログイン時に必要になります。誰にも見られないように安全に保管してください。紛失した場合、復元することはできません。" + prive_key)
    },

    async logout() {
      var result = confirm("ログアウトする前に秘密鍵をEXPORT SECRETKEYから保存してください。 秘密鍵を保存せずにログアウトするとアカウントを復元することはできません。ログアウトする場合はOKをクリックしてください。\n");
      if(result){
        localStorage.clear();
      alert("ログアウトしました。")
      window.location.href = window.location.origin + '/'

      }
      
    },   

    async send() {

      this.$nuxt.$loading.start()

        var sendto_account = document.getElementById("sendto_account").value;
        var input_amount = document.getElementById("input_amount").value;

        var pub_key = localStorage.getItem('eosclip_account')

        var param = {
            scope: process.env.CONTRACT,
            code: process.env.CONTRACT,
            table: 'user',
            json: true,
            limit: 100
        }

        var nonce = await eosManager.nonce(param, pub_key)
        console.log(pub_key)
        console.log(nonce)
       
        var prive_key = localStorage.getItem('eosclip_priveKey');


        var sendto_account_encode = Eos.modules.format.encodeName(sendto_account, false)
        var message = sendto_account_encode.toString() + input_amount.toString() + nonce

        console.log(message)

        var sig = eosjs_ecc.sign(message, prive_key);

        var self = this

        console.log(sendto_account)
        console.log(input_amount)
        console.log(sig)
        console.log(pub_key)

        const res = await axios.post('/api/exchange', {
            username:sendto_account,
            point:input_amount,
            sig: sig,
            pub_key: pub_key
        }).then(async function (response) {
            if (response.data.status == true) {
              this.dialog = false
              this.$nuxt.$loading.finish()
            } else {
              alert(JSON.parse(response.data.msg).error.details[0].message)
              // alert("Error: Please try again")
            }

          })       
    }
  },

    mounted:function(){
      if(localStorage.getItem('eosclip_priveKey') == null) {
          window.location.href = window.location.origin + '/create'
      }
  } 


}

</script>

