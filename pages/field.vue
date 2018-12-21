<template>
  <v-content>
    <v-container grid-list-md>
      <v-layout
        row
        wrap
        v-for="(question, index) in questions"
        :key="question.question_key"
      >
        <v-flex>
          <v-card >
            <v-card-title>
              <div style = "width:100%">
                <div class="headline"><nuxt-link color="blue" :to="`/questions/${question.question_key}`">{{ question.title }}</nuxt-link></div>
                <div style="float: left;" class="grey--text" >ID: {{ question.pub_key.substring(4, 18) }}</div>
                <div style="text-align:right;" class="grey--text"> {{ question.time_stamp.substring(0, 10) }} {{ question.time_stamp.substring(11, 19) }}</div>
                <v-divider></v-divider>
                <br>
                <div>{{question.body.substring(0, 130)}}<span v-if="question.body.length > 130">...</span><nuxt-link :to="`/questions/${question.question_key}`"><v-icon color="teal" small>expand_more</v-icon></nuxt-link></div>
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
                <v-btn dark small color="teal lighten-1" @click="set2('question', question.question_key)" >
                  <v-icon dark>attach_money</v-icon>
                  TIP
                </v-btn>
            </v-card-actions>
                <!-- <v-btn color="info" dark
                @click="set2(index)"
                >Tip
                  <v-icon dark right>attach_money</v-icon>
                </v-btn> -->
                

          </v-card>
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

import { mapGetters } from 'vuex'
import EosManager from '~/assets/js/eos'
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'

const eosManager = new EosManager('https://kylin.eoscanada.com')

export default {

  data () {
        return {
        dialog: false,
        point: 0,
        index: 0,
        table:"",
        }
    },
  async asyncData(context) {
    const { store } = context
    await store.dispatch('questions/fetchQuestions')
  },
  computed: {
    // ...mapGetters('questions', ['questions'])
    questions() {
      return this.$store.getters['questions/questions']
    }
  },
  methods: {
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
          scope: 'eosqatest334',
          code: 'eosqatest334',
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
        console.log(table)

        // const res = await axios.post("`/api/${api}`", {
          const res = await axios.post(`/api/${endpoint}`, {
            question_key: qa_key,
            answer_key: qa_key,
            point: point,
            sig: sig,
            pub_key: pub_key
        })
        this.dialog = false
        
        this.$nuxt.$loading.finish()

        window.location.reload(true)

    }
  }

}
</script>

