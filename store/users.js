import EosManager from '~/assets/js/eos'
const eosManager = new EosManager('https://kylin.eoscanada.com')

export const state = () => ({
  users: [],
  user_pubkey: ""
})

export const getters = {
    users: state => state.users
}

export const mutations = {
  setUsers(state, users) {
    state.users = users
  }
}

export const actions = {
  async fetchUsers({ state, commit }) {
    var userParam = {
      scope: 'eosqatest333',
      code: 'eosqatest333',
      table: 'user',
      json: true,
      limit: 100
    }
    
    var users = await eosManager.read(userParam)
    
    // var user = localStorage.getItem('eosclip_account')
    // for( let i =0; i > users.length; i++ ){
    //     if()
    // }

    commit('setUsers', users)
  }

}
