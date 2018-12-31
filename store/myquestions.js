import EosManager from '~/assets/js/eos'
const eosManager = new EosManager(process.env.ENDPOINT)

export const state = () => ({
  myquestions: [],
  myanswers:[],
})

export const getters = {
    myquestions: state => state.myquestions,
    myanswers: state => state.myanswers
}

export const mutations = {
  setMyquestions(state, myquestions) {
    state.myquestions = myquestions
  },
  setMyanswers(state, myanswers) {
    state.myanswers = myanswers
  },

}

export const actions = {
  async fetchMyquestions({ state, commit }, pub_key){
    var userParam = {
      scope: process.env.CONTRACT,
      code: process.env.CONTRACT,
      table: 'user',
      json: true,
      limit: 10000
    }

    var user_key = await eosManager.user_key(userParam, pub_key)
    console.log(user_key) 

    var questionParam = {
        scope: process.env.CONTRACT,
        code: process.env.CONTRACT,
        table: 'question',
        json: true,
        limit: 10000
      }
  
      var questions = await eosManager.read(questionParam)
      //questions = await IpfsManager.convertQuestions(questions)
      for(var i=0; i<questions.length; i++){
        var meta = JSON.parse(questions[i].body)
        questions[i].title = meta.title
        questions[i].body = meta.body
      }


    const myquestions = questions.filter(x => x.user_key === user_key)

    
    commit('setMyquestions', myquestions)
  },

  async fetchMyanswers({ state, commit }, pub_key){
    var userParam = {
      scope: process.env.CONTRACT,
      code: process.env.CONTRACT,
      table: 'user',
      json: true,
      limit: 10000
    }

    var user_key = await eosManager.user_key(userParam, pub_key)
    
    var answerParam = {
      scope: process.env.CONTRACT,
      code: process.env.CONTRACT,
      table: 'answer',
      json: true,
      limit: 10000
    }

    var answers = await eosManager.read(answerParam)
    //answers = await IpfsManager.convertAnswers(answers)
    for(var i=0; i<answers.length; i++){
      var meta = JSON.parse(answers[i].body)
      answers[i].body = meta.body
    }


    const myanswers = answers.filter(x => x.user_key === user_key)

    
    commit('setMyanswers', myanswers)
  }

}
