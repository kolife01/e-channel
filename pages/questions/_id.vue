<template>
  <v-content>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex>
          <v-card>
            <v-card-text>
              <v-flex>
                <v-avatar>
                  <img src="~/assets/img/avatar1.png" alt="avatar" />
                </v-avatar>
                {{ question.pub_key }}
              </v-flex>
              <v-flex>{{ question.time_stamp }}</v-flex>
              <v-flex>
                {{ question.view }}
                <v-icon small>remove_red_eye</v-icon>
              </v-flex>
              <v-flex>{{ question.title }}</v-flex>
              <v-flex>{{ question.body }}</v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout
        row
        wrap
        v-for="answer in answers"
        :key="answer.answer_key"
      >
        <v-flex v-if="answer.question_key == $route.params.id">
          <v-card>
            <v-card-text>
              <v-flex>
                <v-avatar>
                  <img src="~/assets/img/avatar1.png" alt="avatar" />
                </v-avatar>
                {{ answer.pub_key }}
              </v-flex>
              <v-flex
                >{{ answer.allpoint }}
                <v-icon small>attach_money</v-icon></v-flex
              >
              <v-flex>{{ answer.time_stamp }}</v-flex>
              <v-flex>{{ answer.body }}</v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-textarea
            label="You Answer"
            id="input_answer"
            rows="10"
          ></v-textarea>
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
  async asyncData({ store, params }) {
    // try {
    // if (!store.getters['questions/questions'].length) {

      console.log(params.id)
    await store.dispatch('questions/fetchQuestionsByQuestionKey', params.id)

    // }
    await store.dispatch('answers/fetchAnswersByQuestionKey', params.id)
    // // } catch(e) {}
    // return {

    // }
  },
  computed: {
    question() {
      return this.$store.getters['questions/questions'][this.$route.params.id]
    },
    answers() {
      return this.$store.getters['answers/answers'] 
    }
  },

  methods: {
    async addanswer() {

    var question_key = Number(this.$route.params.id)

    var answer = JSON.stringify({body: document.getElementById('input_answer').value})
    var hash = await IpfsManager.add(answer);

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
    
    const res = await axios.post('/api/addanswer', {
        question_key: question_key,
        body: hash,
        sig: sig,
        pub_key: pub_key
    }).then(async function (response) {
        if (response.data.status) {

            var answerParam = {
                scope: "eosqatest333",
                code: "eosqatest333",
                table: 'answer',
                json: true,
                limit: 100
            }

            var answers = await eosManager.read(answerParam);
            answers = await IpfsManager.convertAnswers(answers)


            console.log("update")
            await self.$store.dispatch('answers/fetchAnswersByQuestionKey', this.$route.params.id)
            
        }
      })
    }
  }

}
</script>

<style></style>
