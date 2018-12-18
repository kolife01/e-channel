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
      scope: 'eosqatest333',
      code: 'eosqatest333',
      table: 'answer',
      json: true,
      limit: 100
    }

    var answers = await eosManager.read(answerParam)
    answers = await IpfsManager.convertAnswers(answers)

    commit('setAnswers', answers)
  }

}
