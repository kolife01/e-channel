<template>
  <v-content>
    <v-container>
      <v-form>
        <v-text-field label="Title" id="input_question_title"></v-text-field>
        <v-textarea
          label="Question"
          id="input_question_body"
          rows="10"
        ></v-textarea>
        <v-btn dark color="teal lighten-1" id="add_question" v-on:click="addquestion">Ask Question</v-btn>
      </v-form>
    </v-container>
  </v-content>
</template>

<script>
import EosManager from '~/assets/js/eos'
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'
import IpfsManager from '../assets/js/ipfs';

const eosManager = new EosManager('https://kylin.eoscanada.com')

export default {

  methods: {
    async addquestion() {
      this.$nuxt.$loading.start()
      var question = JSON.stringify({
        title:document.getElementById('input_question_title').value,
        body:document.getElementById('input_question_body').value
      })

      document.getElementById('input_question_title').value = ""
      document.getElementById('input_question_body').value = ""

      //var hash = await IpfsManager.add(question);

      var pub_key = localStorage.getItem('eosclip_account')

      var param = {
        scope: 'eosqatest334',
        code: 'eosqatest334',
        table: 'user',
        json: true,
        limit: 100
      }

      var nonce = await eosManager.nonce(param, pub_key)
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
          if(response.data.status){

            var questionParam = {
              scope: 'eosqatest334',
              code: 'eosqatest334',
              table: 'question',
              json: true,
              limit: 100
            }

            var questions = await eosManager.read(questionParam)

            for (var i = questions.length - 1; i >= 0; i--) {
              if (questions[i].pub_key == pub_key) {
                self.$store.$router.push({ path: `/questions/${i}` })
                break
              }
            }
          }
        })
    }
  }
}
</script>

<style></style>
