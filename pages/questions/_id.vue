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
                {{ activeQuestion.pub_key }}
              </v-flex>
              <v-flex>{{ activeQuestion.time_stamp }}</v-flex>
              <v-flex>
                {{ activeQuestion.view }}
                <v-icon small>remove_red_eye</v-icon>
              </v-flex>
              <v-flex>{{ activeQuestion.title }}</v-flex>
              <v-flex>{{ activeQuestion.body }}</v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout
        row
        wrap
        v-for="answer in $store.state.answers"
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
              <v-flex>{{ answer.answer }}</v-flex>
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
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'

// const eosManager = new EosManager('https://api.kylin.alohaeos.com')
const eosManager = new EosManager('https://kylin.eoscanada.com')

export default {
  async asyncData({ store, params }) {
    // try {
    // if (!store.getters['questions/questions'].length) {
    await store.dispatch('questions/fetchQuestions')
    // }
    await store.dispatch('answers/fetchAnswers', params.id)
    // // } catch(e) {}
    // return {

    // }
  },
  computed: {
    activeQuestion() {
      console.log(this.$store.getters['questions/questions'])
      return this.$store.getters['questions/questions'][this.$route.params.id]
    }
  },

  methods: {
    async addanswer() {
      var param = {
        scope: 'eosqarecove5',
        code: 'eosqarecove5',
        table: 'user',
        json: true,
        limit: 100
      }

      var answer = document.getElementById('input_answer').value
      var question_key = Number(this.$route.params.id)
      console.log(question_key)

      var pub_key = localStorage.getItem('eosclip_account')
      var nonce = await eosManager.nonce(param, pub_key)
      console.log(nonce)

      var prive_key = localStorage.getItem('eosclip_priveKey')

      var message = answer + nonce
      var sig = eosjs_ecc.sign(message, prive_key)

      var self = this

      const res = await axios
        .post('/api/addanswer', {
          question_key: question_key,
          answer: answer,
          sig: sig,
          pub_key: pub_key
        })
        .then(async function(response) {
          if (response.data.status) {
            var answerParam = {
              scope: 'eosqarecove5',
              code: 'eosqarecove5',
              table: 'answer',
              json: true,
              limit: 100
            }

            var answers = await eosManager.read(answerParam)
            self.$store.commit('setAnswers', answers)
            console.log(self.$store)
          }
        })
    }
  }
}
</script>

<style></style>
