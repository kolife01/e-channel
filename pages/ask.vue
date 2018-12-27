<template>
  <v-content>
    <v-container>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field 
        label="Title" 
        id="input_question_title"
        model="title"
        :rules="titleRules"
        :counter="40"
        required
        
        
        ></v-text-field>
        <v-textarea
          label="Question"
          id="input_question_body"
          rows="10"
          model="question"
          :rules="questionRules"
          :counter="140"
          required
        ></v-textarea>
        <v-flex right>
          <v-btn dark 
          color="light-blue accent-2" 
          :disabled="!scatter || !valid"
          id="add_question_scatter" 
          large 
          @click="addquestionScatter"
          >Use Scatter</v-btn>


          <v-btn dark 
          color="teal lighten-1" 
          id="add_question" 
          :disabled="!valid"
          large 
          @click="addquestion"
          >Ask Question</v-btn>

          
        </v-flex>
      </v-form>
    </v-container>
  </v-content>
</template>

<script>
import EosManager from '~/assets/js/eos'
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'
import IpfsManager from '../assets/js/ipfs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Eos from 'eosjs'
import scatterManager from '~/assets/js/scatter'

const eosManager = new EosManager(process.env.ENDPOINT)


export default {

  data: () => ({
      dialog: false,
      valid: true,
      title: '',
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length <= 40) || 'title must be less than 40 characters'
      ],
      question: '',
      questionRules: [
        v => !!v || 'Question is required',
        v => (v && v.length <= 140) || 'Question must be less than 140 characters'
      ],
      scatter: false
      
    }),
  
  created: async function () {
    this.scatter =  await scatterManager.scatter.connect("e-channel",{initTimeout:10000})
    console.log(this.scatter)

  },

  methods: {
    async addquestion() {

    if (localStorage.getItem('eosclip_account') == null || localStorage.getItem('eosclip_priveKey') == null ) {
        window.location.href = window.location.origin + '/create'
    } else {
        var param = {
          scope: process.env.CONTRACT,
          code: process.env.CONTRACT,
          table: 'user',
          json: true,
          limit: 10000
        }
        
        nonce = await eosManager.nonce(param, localStorage.getItem('eosclip_account'))
        if(nonce == 0){
          window.location.href = window.location.origin + '/create'
        }
    }

      if (this.$refs.form.validate()) {
       
      this.$nuxt.$loading.start()
      var question = JSON.stringify({
        title:document.getElementById('input_question_title').value,
        body:document.getElementById('input_question_body').value
      })

      document.getElementById('input_question_title').value = ""
      document.getElementById('input_question_body').value = ""
      document.getElementById('input_question_title').disabled = true
      document.getElementById('input_question_body').disabled = true    
      document.getElementById('add_question').disabled = true
      document.getElementById('add_question').innerHTML = "Broadcasting..."

      //var hash = await IpfsManager.add(question);

      var pub_key = localStorage.getItem('eosclip_account')

      var param = {
        scope: process.env.CONTRACT,
        code: process.env.CONTRACT,
        table: 'user',
        json: true,
        limit: 10000
      }

      var nonce = await eosManager.nonce(param, pub_key)
      console.log(nonce)
      var prive_key = localStorage.getItem('eosclip_priveKey');  
     
      //var message = hash + nonce  
      var message = question + nonce  
      var sig = eosjs_ecc.sign(message, prive_key);

      var self = this

      const res = await axios.post('/api/addquestion', {
        //body: hash,
        body: question,
        sig: sig,
        pub_key: pub_key
      }).then(async function (response){          
          if(response.data.status == true){
            this.$nuxt.$loading.finish()

            var questionParam = {
              scope: process.env.CONTRACT,
              code: process.env.CONTRACT,
              table: 'question',
              json: true,
              limit: 10000
            }

            var questions1 = await eosManager.read(questionParam)
            var questions = questions1.reverse()

            for (var i = questions.length - 1; i >= 0; i--) {
              if (questions[i].pub_key == pub_key) {
                self.$store.$router.push({ path: `/questions/${i}` })
                break
              }
            }
          } else {
            alert(JSON.parse(response.data.msg).error.details[0].message)
            // alert("Error: Please try again.")
          }
        })
    }
  },

  async addquestionScatter() {

    if (localStorage.getItem('eosclip_account') == null || localStorage.getItem('eosclip_priveKey') == null ) {
        window.location.href = window.location.origin + '/create'
    } else {
        var param = {
          scope: process.env.CONTRACT,
          code: process.env.CONTRACT,
          table: 'user',
          json: true,
          limit: 10000
        }
        
        nonce = await eosManager.nonce(param, localStorage.getItem('eosclip_account'))
        if(nonce == 0){
          window.location.href = window.location.origin + '/create'
        }
    }
       
    if (ScatterJS.scatter.identity == null) {
        alert("Attach Scatter first");
        return;
    }

    if (this.$refs.form.validate()) {
       
      
    var account = scatterManager.scatter.identity.accounts.find(x => x.blockchain === 'eos')
    var options = {
        authorization: account.name + '@' + account.authority,
        broadcast: true,
        sign: true
    }

    console.log(account.name)
    console.log(account.authority)
      
    var question = JSON.stringify({
      title:document.getElementById('input_question_title').value,
      body:document.getElementById('input_question_body').value
    })

    document.getElementById('input_question_title').value = ""
    document.getElementById('input_question_body').value = ""
    document.getElementById('input_question_title').disabled = true
    document.getElementById('input_question_body').disabled = true    
    document.getElementById('add_question').disabled = true
    document.getElementById('add_question').innerHTML = "Broadcasting..."
    document.getElementById('add_question_scatter').disabled = true
    document.getElementById('add_question_scatter').innerHTML = "Broadcasting..."

    var pub_key = localStorage.getItem('eosclip_account')
    var param = {
                  scope: process.env.CONTRACT,
                  code: process.env.CONTRACT,
                  table: 'user',
                  json: true,
                  limit: 10000
                }


        var nonce =  await eosManager.nonce(param, pub_key)

        console.log('nonce'+ nonce)
        var prive_key = localStorage.getItem('eosclip_priveKey');  
      
        //var message = hash + nonce  
        var message = question + nonce  
        var sig = eosjs_ecc.sign(message, prive_key);
        var self = this

        scatterManager.eos.contract(process.env.CONTRACT).then(contract => {
          //TODO
          //Scatterチェックしてからloadingスタートしたい
          this.$nuxt.$loading.start()
          console.log("start")
          contract.addquestion(question, account.name, sig, pub_key, options).then(async function(response){
              // res.json({status: true})
              console.log("suc")
              this.$nuxt.$loading.finish()

              var questionParam = {
              scope: process.env.CONTRACT,
              code: process.env.CONTRACT,
              table: 'question',
              json: true,
              limit: 10000
            }

            var questions1 = await eosManager.read(questionParam)
            var questions = questions1.reverse()
            console.log(questions)

            for (var i = questions.length - 1; i >= 0; i--) {
              if (questions[i].pub_key == pub_key) {
                self.$store.$router.push({ path: `/questions/${i}` })
                break
              }
            }

          }).catch(err => {
              alert(JSON.parse(err).error.details[0].message)
              console.log(err)
          });
        });
    }
    },
   
  }
  
}
</script>

<style></style>
