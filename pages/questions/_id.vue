<template>
  <v-content>
    <v-container grid-list-md v-if="question != null">
      <v-layout row wrap>
        <v-flex>
          <v-card>
            <v-card-text>
              
              <v-flex class="headline">{{ question.title }}</v-flex> 
              <v-flex class="caption"> {{ question.time_stamp }}</v-flex>
              <v-flex class="caption"> Post by {{ question.pub_key }}</v-flex>
              <v-flex>
                <v-icon dark right color="grey">insert_comment</v-icon>
                {{ question.answer_count }}
                <v-icon dark right color="grey">star</v-icon>
                {{ question.allpoint }}
                
              </v-flex>
                <v-btn fab dark small color="teal" @click="set2('question', question.question_key)">
                  <v-icon dark>attach_money</v-icon>
                </v-btn>
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
              <v-flex class="headline">{{ answer.body }}</v-flex> 
              <v-flex class="caption"> {{ answer.time_stamp }}</v-flex>
              <v-flex class="caption"> Post by {{ answer.pub_key }}</v-flex>
              <v-flex>
                <v-icon dark right color="grey">star</v-icon>
                {{ answer.point }}
                
              </v-flex>
              <v-flex class="caption"> answer_key {{ answer.answer_key }}</v-flex>
              <v-btn fab dark small color="teal" @click="set2('answer', answer.answer_key)">
                  <v-icon dark>attach_money</v-icon>
                </v-btn>

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

    <v-dialog
      v-model="dialog"
      max-width="350"
    >
      <v-card>
        <v-card-title class="headline">Let's send a tip to favorite post</v-card-title>

        <v-card-text>
        <v-text-field 
        id="input_amount" 
        label="Tip Amount*" 
        v-model="point"
        required >
        </v-text-field>
          <v-btn @click="set(1)">1 POINT</v-btn>
          <v-btn @click="set(10)">10 POINT</v-btn>
          <v-btn @click="set(100)">100 POINT</v-btn>
          <v-btn @click="set(1000)">1000 POINT</v-btn>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-spacer></v-spacer>
          <br>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
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
import EosManager from '~/assets/js/eos'
import IpfsManager from '~/assets/js/ipfs';
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'

const eosManager = new EosManager('https://kylin.eoscanada.com')

export default {

  data () {
        return {
        dialog: false,
        point: 0,
        index: 0,
        table:""
        }
    },

  async asyncData({ store, params }) {
    await Promise.all(
      [store.dispatch('questions/fetchQuestionsByQuestionKey', params.id),
      store.dispatch('answers/fetchAnswersByQuestionKey', params.id)]
    )
  },

  /*

  mounted: async function() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await Promise.all(
        [this.$store.dispatch('questions/fetchQuestionsByQuestionKey', this.$route.params.id),
        this.$store.dispatch('answers/fetchAnswersByQuestionKey', this.$route.params.id)]
      )
      this.$nuxt.$loading.finish()      
    })

  },

  */

  computed: {
    question() {
      return this.$store.getters['questions/questions'][0]
    },
    answers() {
      return this.$store.getters['answers/answers'] 
    }
  },

  methods: {
    async addanswer() {
    this.$nuxt.$loading.start()
    var question_key = Number(this.$route.params.id)

    var answer = JSON.stringify({body: document.getElementById('input_answer').value})
    document.getElementById('input_answer').value = ""

    var hash = await IpfsManager.add(answer);

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
            await self.$store.dispatch('answers/fetchAnswersByQuestionKey', self.$route.params.id)
            this.$nuxt.$loading.finish()
        }
      })
    },

      set(value){
          this.point = value
          console.log(this.point)
      },
      set2(table,index){
        this.table = table
        this.dialog = true
        this.index = index
        console.log("index:" + this.index)
      },
      async send(){
        var table = this.table
        var qa_key = this.index;
        var point = this.point;
        var pub_key = localStorage.getItem('eosclip_account')
        var prive_key = localStorage.getItem('eosclip_priveKey');  


        var param = {
            scope: 'eosqatest334',
            code: 'eosqatest334',
            table: 'user',
            json: true,
            limit: 100
        }
  
        var nonce = await eosManager.nonce(param, pub_key)
        var message = String(qa_key) + String(point) +String(nonce)
        var sig = eosjs_ecc.sign(message, prive_key);
        

        var endpoint = "tip" + table

        // const res = await axios.post("`/api/${api}`", {
          const res = await axios.post(`/api/${endpoint}`, {
            question_key: qa_key,
            answer_key: qa_key,
            point: point,
            sig: sig,
            pub_key: pub_key
        }).then(async function (response) {
        if (response.data.status) {
            // await self.$store.dispatch('answers/fetchAnswersByQuestionKey', self.$route.params.id)
            // this.$nuxt.$loading.finish()
            this.dialog = false
        }
        
      })
    }
  }
}
</script>

<style></style>
