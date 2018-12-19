<template>
<v-content>
    <v-container grid-list-md>
      <!-- <input type="text" id="input_name"> -->
      
    <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      id="input_name"
      v-model="name"
      :rules="nameRules"
      :counter="10"
      label="UserName"
      required
    ></v-text-field>
    
    <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree terms?"
      required
    >
    </v-checkbox>
    <span @click="dialog = true">Open Terms</span>
    

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Terms</v-card-title>

        <v-card-text>
          aaaaaaaaaaaaaaaaaaaaaaaaaaa
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

    <v-btn
      :disabled="!valid"
      @click="submit"
    >
      submit
    </v-btn>
  </v-form>
    </v-container>
  </v-content>
    
</template>

<script>
import EosManager from '~/assets/js/eos'
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'


export default {
  layout: 'notoolbar',

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
      async submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported



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
                alert('Welcome! You get 500 POINT!!')
                
              }else{
                console.log(response.data.msg)
                alert("error")
              }
          })
          
      }else{
        console.log("error")
      }
        
      }
    }

}
</script>

<style>

</style>
