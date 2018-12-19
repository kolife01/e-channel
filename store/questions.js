import IpfsManager from '~/assets/js/ipfs'
import EosManager from '~/assets/js/eos'

const eosManager = new EosManager('https://kylin.eoscanada.com')

export const state = () => ({
  questions: []
})

export const getters = {
  questions: state => state.questions
}

export const mutations = {
  setQuestions(state, questions) {
    state.questions = questions
  },
  clearQuestions(state) {
    state.questions = []
  }
}

export const actions = {
  async fetchQuestions({ state, commit }) {
    var questionParam = {
      scope: 'eosqatest333',
      code: 'eosqatest333',
      table: 'question',
      json: true,
      limit: 100
    }

    var questions = await eosManager.read(questionParam)
    questions = await IpfsManager.convertQuestions(questions)
     
    console.log("update")
    commit('setQuestions', questions)

  },

  async fetchQuestionsByQuestionKey({ state, commit }, index) {
    var questionParam = {
      scope: 'eosqatest333',
      code: 'eosqatest333',
      table: 'question',
      json: true,
      limit: 100
    }

    var questions = await eosManager.readByQuestionKey(questionParam, index)
    questions = await IpfsManager.convertQuestions(questions)
     
    console.log("update")
    commit('setQuestions', questions)

  }  

}
