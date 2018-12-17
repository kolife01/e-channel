<template>
  <v-content>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex>
                <v-card>
                    <v-card-text>
                        <v-flex> 
                            <v-avatar>
                                <img src="~/assets/img/avatar1.png" alt="avatar">
                            </v-avatar>
                            {{ $store.state.questions[$route.params.id].pub_key }}
                        </v-flex>
                        <v-flex>{{ $store.state.questions[$route.params.id].time_stamp }}</v-flex>
                        <v-flex>
                            {{ $store.state.questions[$route.params.id].view }}
                            <v-icon small>remove_red_eye</v-icon>
                        </v-flex>
                        <v-flex>{{ $store.state.questions[$route.params.id].title }}</v-flex>    
                        <v-flex>{{ $store.state.questions[$route.params.id].body }}</v-flex>                  
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap  v-for="answer in $store.state.answers" :key="answer.answer_key">
            <v-flex v-if="answer.question_key == $route.params.id">
                   <v-card>
                        <v-card-text>
                            <v-flex> 
                                <v-avatar>
                                    <img src="~/assets/img/avatar1.png" alt="avatar">
                                </v-avatar>
                                {{ answer.pub_key }}
                            </v-flex>
                            <v-flex>{{ answer.allpoint }} <v-icon small>attach_money</v-icon></v-flex>
                            <v-flex>{{ answer.time_stamp }}</v-flex>
                            <v-flex>{{ answer.answer }}</v-flex>  
                        </v-card-text>
                    </v-card>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex>
                <v-textarea label="You Answer" id="input_answer" rows="10"></v-textarea>
                <v-btn id="add_answer" v-on:click="addanswer">Add Answer</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
  </v-content>

</template>

<script>

import EosManager from '~/assets/js/eos'
import IpfsManager from '~/assets/js/ipfs';
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'

const eosManager = new EosManager('https://kylin.eoscanada.com')

export default {

methods: {

    async addanswer(){

      var param = {
            scope: "eosqarecove5",
            code: "eosqarecove5",
            table: 'user',
            json: true,
            limit: 100
      }

      var answer = document.getElementById('input_answer').value;
      var question_key = Number(this.$route.params.id)
      console.log(question_key)

      var hash = await IpfsManager.add(answer);
      console.log(hash);
      

      var pub_key = localStorage.getItem('eosclip_account');
      var nonce = await eosManager.nonce(param, pub_key)
      console.log(nonce)

      var prive_key = localStorage.getItem('eosclip_priveKey');  
     
      var message = hash + nonce  
      var sig = eosjs_ecc.sign(message, prive_key);
      
      var self = this

      //入力文字が消えない 保留
      document.getElementById('input_answer').value = "";

      const res = await axios.post('/api/addanswer', {
        question_key: question_key,
        answer: hash,
        sig: sig,
        pub_key: pub_key
      }).then(async function (response){
          if(response.data.status){
              
              var answerParam = {
                    scope: "eosqarecove5",
                    code: "eosqarecove5",
                    table: 'answer',
                    json: true,
                    limit: 100
                    }

            var answers = await eosManager.readans(answerParam);  
            self.$store.commit("setAnswers", answers)

          }
         
      })
      
    }
  }

}
</script>

<style>

</style>
