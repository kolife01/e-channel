<template>
  <v-content>

    <v-container grid-list-md>
       <v-card height="80px" flat>

    <v-bottom-nav
    :active.sync="bottomNav"
      :value="true"
      absolute
      color="transparent"
    >

      <v-btn
        color="teal"
        flat
        value="recent"
        @click="resent"
      >
        <span>Recent</span>
        <v-icon>history</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="favorites"
        @click="trend"
      >
        <span>Trend</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="nearby"
        @click="point1"
      >
        <span>Point</span>
        <v-icon>star</v-icon>
      </v-btn>

    </v-bottom-nav>
    </v-card>

      <v-layout
        row
        wrap
        v-for="question in questions"
        :key="question.question_key"
      >
        <v-flex>
          <v-card >
            <v-card-title>
              <div style = "width:100%">
                <div class="headline"><nuxt-link color="blue" :to="`/questions/${question.question_key}`">{{ question.title }}</nuxt-link></div>
                <div style="float: left;" class="grey--text" >ID: {{ question.pub_key.substring(4, 18) }}</div>
                <div style="text-align:right;" class="grey--text"> {{ getTime(question.time_stamp) }}</div>
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

import { mapGetters, mapActions } from 'vuex'
import EosManager from '~/assets/js/eos'
import eosjs_ecc from 'eosjs-ecc'
import axios from 'axios'

const eosManager = new EosManager(process.env.ENDPOINT)

export default {

  data () {
        return {
        dialog: false,
        point: 0,
        index: 0,
        table:"",
        bottomNav: 'recent'
        }
    },
  async asyncData(context) {
    const { store } = context
    await store.dispatch('questions/fetchQuestions')
  },
  computed: {
    questions() {
      return this.$store.getters['questions/questions']
    },

  },
  methods: {

    ...mapActions({
      resent: ('questions/fetchQuestions')
    }),

    ...mapActions({
      trend: ('questions/fetchQuestionsTrend')
    }),

    ...mapActions({
      point1: ('questions/fetchQuestionsPoint')
    }),

    getTime(time){
      var dt = new Date(time)
      //console.log("before" + dt)
      var dif = dt.getTimezoneOffset() * -1
      dt.setMinutes(dt.getMinutes() + dif)
      var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];

      var day = dt.getDate();
      var monthIndex = dt.getMonth();
      var year = dt.getFullYear();

      return year + ' ' + monthNames[monthIndex] + ' ' + day + ' - ' +  dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() ;

    },


      set(value){
          this.point = value
      },
      set2(table,index){
        this.table = table
        this.dialog = true
        this.index = index
      },

      async send(){
        this.$nuxt.$loading.start()

    if (localStorage.getItem('eosclip_account') == null || localStorage.getItem('eosclip_priveKey') == null ) {
        window.location.href = window.location.origin + '/create'
    } else {
        var param = {
          scope:  process.env.CONTRACT,
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
            limit: 10000
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
        this.dialog = false

        this.$nuxt.$loading.finish()

    }
  }

}
</script>

