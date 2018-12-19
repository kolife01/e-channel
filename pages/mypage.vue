<template>

    <v-content>
    <v-container grid-list-md>
      <v-layout
        row
        wrap
        v-for="user in users"
        :key="user.user_key"
      >
        <v-flex>
          <div class="display-1 font-italic font-weight-thin">{{JSON.parse(user.meta).name}}</div>
          <br>
          <div>POINT: {{ user.point }}</div>
          <div>PUBLICK KEY : {{ user.pub_key }}</div>
        </v-flex>
        <v-btn dark color="red" id="add_answer" v-on:click="export_key" large>Export PrivateKey</v-btn>
      </v-layout>
    </v-container>
  </v-content>

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
      alert("DO NOT share this key with anybody! Your PrivateKey: " + prive_key)
    },
  },
  
}

</script>

