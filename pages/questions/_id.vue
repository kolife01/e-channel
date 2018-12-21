<template>
  <v-content>
    <v-container grid-list-md v-if="question != null">
      <v-layout row wrap>
        <v-flex>
          <v-card>
            <v-card-title>
              <div style = "width:100%">
                <div class="headline"><nuxt-link color="blue" :to="`/questions/${question.question_key}`">{{ question.title }}</nuxt-link></div>
                <div style="float: left;" class="grey--text" >ID: {{ question.pub_key.substring(4, 18) }}</div>
                <div style="text-align:right;" class="grey--text"> {{ question.time_stamp.substring(0, 10) }} {{ question.time_stamp.substring(11, 19) }}</div>
                <v-divider></v-divider>
                <br>
                <div>{{question.body}}</div>
              </div>
            </v-card-title > 
            <v-card-actions>
                <v-chip disabled>
                <v-icon dark color="grey">insert_comment</v-icon>
                {{ question.answer_count }} 
                &nbsp;
                <v-icon dark color="grey">star</v-icon>
                {{ question.allpoint }}
                </v-chip>
                <v-spacer></v-spacer>
                <a :href="'https://twitter.com/share?url=http://localhost:3000/questions/' + question.question_key + '&text=Check out this post!&hashtags=E-Channel'" class="twitter-share-button" data-size="large" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                &nbsp;  &nbsp;                
                <v-btn dark small color="teal lighten-1" @click="set2('question',question.question_key)" >

                  <v-icon dark>attach_money</v-icon>
                  TIP
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout
        row
        wrap
        v-for="answer in answers"
        :key="answer.answer_key"
      >
        <v-flex>
          <v-card>

            <v-card-title>
              <div style = "width:100%">
                <div style="float: left;" class="grey--text" >ID: {{ answer.pub_key.substring(4, 18) }}</div>
                <div style="text-align:right;" class="grey--text"> {{ answer.time_stamp.substring(0, 10) }} {{ answer.time_stamp.substring(11, 19) }}</div>
                <v-divider></v-divider>
                <br>
                <div>{{answer.body}}</div>
              </div>
            </v-card-title > 

            <v-card-actions>
                <v-chip disabled>
                <v-icon dark color="grey">star</v-icon>
                {{ answer.point }}
                </v-chip>
                <v-spacer></v-spacer>
                <!-- <a :href="'https://twitter.com/share?url=http://localhost:3000/questions/' + question.question_key + '&text=Check out this post!&hashtags=E-Channel'" class="twitter-share-button" data-size="large" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> -->
                &nbsp;  &nbsp;                
                <v-btn dark small color="teal lighten-1" @click="set2('answer', answer.answer_key)" >
                  <v-icon dark>attach_money</v-icon>
                  TIP
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-layout>
        <v-flex>
          <v-textarea
            label="You Answer"
            id="input_answer"
            rows="10"
            model="answer"
            :rules="answerRules"
            :counter="140"
            required
          ></v-textarea>
        <v-flex right>
          <v-btn 
          dark 
          color="teal lighten-1" 
          id="add_answer"
          :disabled="!valid"
          @click="addanswer" 
          large>Add Answer</v-btn>
        </v-flex>

        </v-flex>
        </v-layout>
        </v-form>
      
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

  data: () => ({
      dialog: false,
      point: 0,
      index: 0,
      table:"",

      valid: true,
      answer: '',
      answerRules: [
        v => !!v || 'Answer is required',
        v => (v && v.length <= 140) || 'Answer must be less than 140 characters'
      ],
      
    }),
  

  async asyncData({ store, params }) {
    await Promise.all(
      [store.dispatch('questions/fetchQuestionsByQuestionKey', params.id),
      store.dispatch('answers/fetchAnswersByQuestionKey', params.id)]
    )
  },



  mounted: async function() {
    
    /*
    this.$nextTick(async () => {
      this.$nuxt.$loading.start()
      await Promise.all(
        [this.$store.dispatch('questions/fetchQuestionsByQuestionKey', this.$route.params.id),
        this.$store.dispatch('answers/fetchAnswersByQuestionKey', this.$route.params.id)]
      )
      this.$nuxt.$loading.finish()      
    })
    */
    

  },

  

  computed: {
    question() {
      return this.$store.getters['questions/questions'][0]
    },
    answers() {
      return this.$store.getters['answers/answers'] 
    },
    mypub() {
      return localStorage.getItem('eosclip_account')
    }


  },

  methods: {
    async addanswer() {

    if (localStorage.getItem('eosclip_account') == null || localStorage.getItem('eosclip_priveKey') == null ) {
        window.location.href = window.location.origin + '/create'
    } else {
        var param = {
          scope: process.env.CONTRACT,
          code: process.env.CONTRACT,
          table: 'user',
          json: true,
          limit: 100
        }
      
        nonce = await eosManager.nonce(param, pub_key)
        if(nonce > 0){
          window.location.href = window.location.origin + '/create'
        }
    }

      if (this.$refs.form.validate()) {
    this.$nuxt.$loading.start()
    var question_key = Number(this.$route.params.id)

    var answer = JSON.stringify({body: document.getElementById('input_answer').value})
    document.getElementById('input_answer').value = ""
    document.getElementById('input_answer').disabled = true
    document.getElementById('add_answer').disabled = true
    document.getElementById('add_answer').innerHTML = "Broadcasting..."

    var hash = await IpfsManager.add(answer);

    var pub_key = localStorage.getItem('eosclip_account')

    var param = {
        scope: process.env.CONTRACT,
        code: process.env.CONTRACT,
        table: 'user',
        json: true,
        limit: 100
    }

    var nonce = await eosManager.nonce(param, pub_key)

    var prive_key = localStorage.getItem('eosclip_priveKey');

    //var message = hash + nonce
    var message = answer + nonce
    var sig = eosjs_ecc.sign(message, prive_key);

    var self = this
    
    const res = await axios.post('/api/addanswer', {
        question_key: question_key,
        //body: hash,
        body: answer,
        sig: sig,
        pub_key: pub_key
    }).then(async function (response) {
        if (response.data.status == true) {
            await self.$store.dispatch('answers/fetchAnswersByQuestionKey', self.$route.params.id)
            this.$nuxt.$loading.finish()
            document.getElementById('input_answer').disabled = false
            document.getElementById('add_answer').disabled = false
            document.getElementById('add_answer').innerHTML = "Add Answer"
        } else {
          alert(JSON.parse(response.data.msg).error.details[0].message)
          // alert("Error: Please try again")
        }

      })
      }
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

        this.$nuxt.$loading.start()

    if (localStorage.getItem('eosclip_account') == null || localStorage.getItem('eosclip_priveKey') == null ) {
        window.location.href = window.location.origin + '/create'
    } else {
        var param = {
          scope: process.env.CONTRACT,
          code: process.env.CONTRACT,
          table: 'user',
          json: true,
          limit: 100
        }
      
        nonce = await eosManager.nonce(param, pub_key)
        if(nonce > 0){
          window.location.href = window.location.origin + '/create'
        }
    }

        var table = this.table
        var qa_key = this.index;
        var point = this.point;
        var pub_key = localStorage.getItem('eosclip_account')
        var prive_key = localStorage.getItem('eosclip_priveKey');  


        var param = {
            scope: process.env.CONTRACT,
            code: process.env.CONTRACT,
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
        }).then(async function (response){
              if(response.data.status){
                
                window.location.reload(true)
                
              }else{
                
                alert(JSON.parse(response.data.msg).error.details[0].message)
                
              }
        })
        
        this.$nuxt.$loading.finish()

    }
  }
}
</script>

<style></style>
