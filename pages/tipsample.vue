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
          <v-card flat :to="`/questions/${index}`">
            <v-card-text>
              <v-flex>
                {{ question.pub_key }}
              </v-flex>
              <v-flex> {{ question.time_stamp }}</v-flex>
              <v-flex>
                {{ question.view }}
                <v-icon small>remove_red_eye</v-icon>
              </v-flex>
              <v-flex>{{ question.title }}</v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
         <v-btn
            color="primary"
            @click="dialog = true"
            >
            Tip
        </v-btn>
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
            @click="sent"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      </v-layout>
    </v-container>
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
      async sent(){
        //answerkeyあとで変更
        var question_key = 1;
        var point = this.point;
        var pub_key = localStorage.getItem('eosclip_account')
        var prive_key = localStorage.getItem('eosclip_priveKey');  

        console.log(point)
        console.log(pub_key)
        console.log(prive_key)

        var param = {
            scope: 'eosqatest334',
            code: 'eosqatest334',
            table: 'user',
            json: true,
            limit: 100
        }
        console.log(param)
        var nonce = await eosManager.nonce(param, pub_key)
        console.log("nonce:" + nonce)

        var message = String(question_key) + String(point) +String(nonce)
        var sig = eosjs_ecc.sign(message, prive_key);
        
        console.log(typeof message)
        console.log("sig:" + sig)

        const res = await axios.post('/api/tipquestion', {
            question_key: question_key,
            point: point,
            sig: sig,
            pub_key: pub_key
        })

          this.dialog = false
      }

  }
}
</script>
