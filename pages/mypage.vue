<template>
  <div>
    <v-content>
    <v-container grid-list-md>
      <v-layout
        row
        wrap
        v-for="user in users"
        :key="user.user_key"
      >
      
        <v-flex>
          <div>NAME: {{ JSON.parse(user.meta).name }}</div>
          <div>POINT: {{ user.point }}</div>
          <div>PUBLICK KEY : {{ user.pub_key }}</div>
        </v-flex>
        
      </v-layout>
      <v-btn id="add_question" v-on:click="export_key">Export PrivateKey</v-btn>
    </v-container>
  </v-content>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  
  // async asyncData(context) {
  //   const { store } = context
  //   await store.dispatch('users/fetchUsers')
  // },
  computed: {
    ...mapGetters('users', ['users'])
  },
  methods: {
    async export_key() {
      var prive_key = localStorage.getItem('eosclip_priveKey');
      alert("DO NOT share this key with anyone! Your PrivateKey: " + prive_key)
    },
  },
  
}

</script>

