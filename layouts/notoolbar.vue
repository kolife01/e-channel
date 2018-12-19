<template>
<v-app>

    <v-toolbar fixed app dark color="teal lighten-1">
      <v-toolbar-title class="display-1 font-weight-thin" >E-Channel</v-toolbar-title>
    </v-toolbar>

  <nuxt />
  <Footer />    
</v-app>
</template>

<script>

import Footer from '~/components/Footer.vue'
  export default {
    components:{
    
      Footer
    }
  }




</script>
