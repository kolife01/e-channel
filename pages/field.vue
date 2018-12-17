<template>
  <v-content>
    <v-container grid-list-md>   
        <v-layout row wrap v-for="(question, index) in $store.state.questions" :key="question.question_key">
            <v-flex>
                <v-card flat :to="`/questions/${index}`">
                    <v-card-text>
                        <v-flex> 
                            <v-avatar>
                                <img src="~/assets/img/avatar1.png" alt="avatar">
                            </v-avatar>
                            {{ question.pub_key }}
                        </v-flex>
                        <v-flex> {{ question.time_stamp }}</v-flex>
                        <v-flex>
                            {{ question.view }}
                            <v-icon small>remove_red_eye</v-icon>
                        </v-flex>
                        <v-flex>{{ question.title }}</v-flex>          
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
  </v-content>
 
</template>

<script>


export default {

}
</script>