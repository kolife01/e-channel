<template>
  <v-content>
    <v-container>
      <div>{{ $store.state.userAccount }}</div>
      <div>{{ $store.state.balance }}</div>
      <div>{{ $store.state.pub_key }}</div>
      <div>{{ $store.state.prive_key }}</div>
    </v-container>
  </v-content>
</template>

<script>
export default {}
</script>

<style></style>
