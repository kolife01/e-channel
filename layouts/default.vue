<template>
<v-app>
  <Header />
  <nuxt />
  <Footer />    
</v-app>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
  export default {
    components:{
      Header,
      Footer
    },

    mounted: function (){

      $(function() {
        $(document).on("keypress", "input:not(.allow_submit)", function(event) {
          return event.which !== 13;
        });
      });

    }
  }


</script>