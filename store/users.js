import EosManager from '~/assets/js/eos'
const eosManager = new EosManager(process.env.ENDPOINT)

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
  async fetchUsers({ state, commit }, pub_key) {
    var userParam = {
      scope: process.env.CONTRACT,
      code: process.env.CONTRACT,
      table: 'user',
      json: true,
      limit: 10000
    }


    var users = await eosManager.read(userParam)    
    var user = [];
    
    
    for(let i = 0; i < users.length; i++ ){
        if(users[i].pub_key == pub_key){
            user.push(users[i])
            break;
        }
    }
    
    commit('setUsers', user)
  }

}
