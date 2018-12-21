<template>
<v-content>
    <v-container >
      <!-- <input type="text" id="input_name"> -->
    <div>投稿、回答、Tipにはユーザー名の登録が必要です。登録時に500ポイントもらえるキャンペーン開催中です！</div>
    <br>
    <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      id="input_name"
      v-model="name"
      :rules="nameRules"
      :counter="10"
      label="UserName"
      required
    ></v-text-field>

    <br>

    <v-flex left>

    <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'Please agree to the terms to continue!']"
      label="I agree to the terms of service"
      required
    >
    </v-checkbox>
        <a @click="dialog = true">Terms of Service</a>
    </v-flex>

    <v-flex right>
    &nbsp;
    <v-btn
      @click="import_account"
      dark large color="grey lighten-1">
      Import Account
    </v-btn>    
    &nbsp;  
    <v-btn
      @click="submit"
      dark large color="teal lighten-1">
      submit
    </v-btn>
    &nbsp;  
    </v-flex>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Terms of Service</v-card-title>

        <v-card-text>
          Terms of Service will be displayed here.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-form>
    </v-container>
  </v-content>
    
</template>

<script>
import EosManager from '~/assets/js/eos'
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'


export default {
  //layout: 'notoolbar',

  data: () => ({
      dialog: false,
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      
      checkbox: false
    }),

    methods: {

      async import_account () {
         var privateKey = prompt("以前に作成した秘密鍵をインポートすることができます", "秘密鍵を入力してください")
         console.log(privateKey)
         
         var publicKey = eosjs_ecc.privateToPublic(privateKey);
         console.log('Public Key: ' +  publicKey) // EOSkey...
         localStorage.setItem("eosclip_priveKey", privateKey);
         localStorage.setItem("eosclip_account", publicKey);
         window.location.href = '/'      
         alert("ログインしました。")
      },
 

      async submit () {

        if (this.$refs.form.validate()) {

          // Native form submission is not yet supported
          this.$nuxt.$loading.start()

          localStorage.clear();

          await eosjs_ecc.randomKey().then(privateKey => {
              var publicKey = eosjs_ecc.privateToPublic(privateKey);
              console.log('Public Key: ' +  publicKey) // EOSkey...
              localStorage.setItem("eosclip_priveKey", privateKey);
              localStorage.setItem("eosclip_account", publicKey);
          })

          var name = document.getElementById('input_name').value;

          var pub_key = localStorage.getItem('eosclip_account')
          var meta = JSON.stringify({name: name})
          console.log(meta)

          var prive_key = localStorage.getItem('eosclip_priveKey');  
          var sig = eosjs_ecc.sign(meta, prive_key);
          
          const res = await axios.post('/api/registeruser', {
            pub_key: pub_key,
            meta: meta,
            sig: sig
          }).then(async function (response){
              if(response.data.status){
                
                window.location.href = '/'
                alert('E-Channelをお楽しみいただくために500ポイントが付与されました！ アカウントにアクセスするためには、この秘密鍵が必要になりますので、大切に保存してください。秘密鍵: ' + prive_key)
              }else{
                alert(JSON.parse(response.data.msg).error.details[0].message)
                
              }
          })
          this.$nuxt.$loading.finish()
          
      }
        
      }
    },

    mounted:function(){
        if(localStorage.getItem('eosclip_priveKey') != null) {
            window.location.href = window.location.origin + '/'
        }
    }

}
</script>

<style>

</style>
