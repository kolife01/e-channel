import EosManager from '~/assets/js/eos'
const eosManager = new EosManager('https://kylin.eoscanada.com')

export const state = () => ({
  answers: []
})

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
      scope: 'eosqarecove5',
      code: 'eosqarecove5',
      table: 'question',
      json: true,
      // offset: page * 10,
      limit: 10
    }

    var answers = await eosManager.read(answerParam)
    commit('setAnswers', answers)
  },

  async fetchAnswers({ state, commit }, index) {

    var answerParam = {
      scope: 'eosqarecove5',
      code: 'eosqarecove5',
      table: 'question',
      json: true,
      // offset: page * 10,
      limit: 10
    }

    var answers = await eosManager.read(answerParam, index)
    commit('setAnswers', answers)
  }

}
