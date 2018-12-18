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
  }
}

export const actions = {
  async fetchQuestions({ state, commit }) {
    var questionParam = {
      scope: 'eosqarecove5',
      code: 'eosqarecove5',
      table: 'question',
      json: true,
      limit: 100
    }

    var questions = await eosManager.read(questionParam)
    commit('setQuestions', questions)
  }

}
