<template>
<v-content>
    <v-container grid-list-md>
      <!-- <input type="text" id="input_name"> -->
      <v-form v-model="valid">
        <v-text-field
          id="input_name"
          v-model="name"
          :error-messages="nameErrors"
          :counter="10"
          label="UserName"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>
          <v-checkbox
            v-model="checkbox"
            :error-messages="checkboxErrors"
            label="Do you agree terms?"
            required
            @change="$v.checkbox.$touch()"
            @blur="$v.checkbox.$touch()"
          ></v-checkbox>
          <nuxt-link to="/terms">Terms</nuxt-link>
          <v-btn v-on:click="submit">Create</v-btn>
        </v-form>
    </v-container>
  </v-content>
    
</template>

<script>
import EosManager from '~/assets/js/eos'
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'


export default {

  mixins: [validationMixin],
    validations: {
      name: { required, maxLength: maxLength(10) },
      checkbox: {
        checked (val) {
          return val
        }
      }
    },

    data: () => ({
      name: '',
      checkbox: false
    }),

    computed: {
      checkboxErrors () {
        const errors = []
        if (!this.$v.checkbox.$dirty) return errors
        !this.$v.checkbox.checked && errors.push('You must agree to continue!')
        return errors
      },
      
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
    },

    methods: {
      async submit () {
        this.$v.$touch()
        var name = document.getElementById('input_name').value;

        var pub_key = localStorage.getItem('eosclip_account')
        var meta = JSON.stringify({name: name})
        console.log(meta)
        

        const res = await axios.post('/api/registeruser', {
          pub_key: pub_key,
          meta: meta
        }).then(async function (response){
            if(response.data.status){
              
              
              window.location.href = 'field'
              alert('Welcome! You get 500 POINT!!')
              
            }
        })
      }
    }

}
</script>

<style>

</style>
