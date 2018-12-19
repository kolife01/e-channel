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
        <v-btn id="add_question" v-on:click="addquestion">Ask Question</v-btn>
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

      var question = JSON.stringify({
        title:document.getElementById('input_question_title').value,
        body:document.getElementById('input_question_body').value
      })

      var hash = await IpfsManager.add(question);

      var pub_key = localStorage.getItem('eosclip_account')

      var param = {
        scope: 'eosqatest333',
        code: 'eosqatest333',
        table: 'user',
        json: true,
        limit: 100
      }

      var nonce = await eosManager.nonce(param, pub_key)

      var prive_key = localStorage.getItem('eosclip_priveKey');  
     
      var message = hash + nonce  
      var sig = eosjs_ecc.sign(message, prive_key);

      var self = this

      const res = await axios.post('/api/addquestion', {
        body: hash,
        sig: sig,
        pub_key: pub_key
      }).then(async function (response){
          console.log(response.data.status)
          
          if(response.data.status){

            await self.$store.dispatch('questions/fetchQuestions')
            var quesions = self.$store.state.questions.questions

            console.log(quesions)
            console.log(quesions.length)

            for (var i = questions.length - 1; i >= 0; i--) {
              console.log(i)
              console.log(questions[i].pub_key)
              if (questions[i].pub_key == pub_key) {
                var id = i + 1
                console.log(id)
                console.log(self.$store.$router)
                self.$store.$router.push({ path: `/questions/${id}` })
                
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
