import Vuex from 'vuex'

import EosManager from '~/assets/js/eos'
const eosManager = new EosManager('https://kylin.eoscanada.com')

const createStore = () => {
    return new Vuex.Store({
      state: () => ({
        questions: [],
        answers: []
      }),

      mutations: {

        setQuestions (state, questions) {
            state.questions = questions
        },

        setAnswers (state, answers) {
          state.answers = answers
        },
              
      },

      actions: {
        async nuxtServerInit ({ commit }, { req }) {

          var questionParam = {
            scope: "eosqarecove5",
            code: "eosqarecove5",
            table: 'question',
            json: true,
            limit: 100
        }
  
        var questions = await eosManager.read(questionParam);       
        commit("setQuestions", questions)         
        
        var answerParam = {
          scope: "eosqarecove5",
          code: "eosqarecove5",
          table: 'answer',
          json: true,
          limit: 100
        }

        var answers = await eosManager.readans(answerParam);        
        commit("setAnswers", answers) 

        }
      }

    })
  }

export default createStore

export const getters = {
    
};
