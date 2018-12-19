import IpfsManager from '~/assets/js/ipfs'
import EosManager from '~/assets/js/eos'

const eosManager = new EosManager('https://kylin.eoscanada.com')

export const state = () => ({
  answers: []
})

export const getters = {
  answers: state => state.answers
}

export const mutations = {
  setAnswers(state, answers) {
    state.answers = answers
  },
  clearAnswers(state) {
    state.answers = []
  }
}

export const actions = {
  async fetchAnswers({ state, commit }) {
    var answerParam = {
      scope: 'eosqatest334',
      code: 'eosqatest334',
      table: 'answer',
      json: true,
      limit: 100
    }

    var answers = await eosManager.read(answerParam)
    //answers = await IpfsManager.convertAnswers(answers)
    for(var i=0; i<answers.length; i++){
      var meta = JSON.parse(answers[i].body)
      answers[i].body = meta.body
    }

    commit('setAnswers', answers)
  },

  async fetchAnswersByQuestionKey({ state, commit }, index) {
    var answerParam = {
      scope: 'eosqatest334',
      code: 'eosqatest334',
      table: 'answer',
      json: true,
      limit: 100
    }

    var answers = await eosManager.readByQuestionKey(answerParam, index)
    //answers = await IpfsManager.convertAnswers(answers)
    for(var i=0; i<answers.length; i++){
      var meta = JSON.parse(answers[i].body)
      answers[i].body = meta.body
    }

    commit('setAnswers', answers)
  }  

}
