<template>
  <v-content>
    <v-container>

      <section>
        <v-layout
          column
          wrap
          align-center
        >
          <v-flex xs12 sm4 class="my-3">
            <div class="text-xs-center">
              <h2 class="display-3 blue--text">EOSのエアドロ質問箱</h2>
              <span class="subheading">
                質問、回答をするだけでEOSトークンが手に入る質問箱サービス
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">account_balance_wallet</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">エアドロ</div>
                    </v-card-title>
                    <v-card-text>
                      質問と回答のインセンティブとして、運営からEOSトークンをエアドロップします。
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">flash_on</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">投げ銭</div>
                    </v-card-title>
                    <v-card-text>
                      ユーザー間で投げ銭を行うことで、P2Pでインセンティブを発生させることが可能です。
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">account_box</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">分散化</div>
                    </v-card-title>
                    <v-card-text>
                      E-Channel上に自分のdAppsを開発することでインセンティブを受け取ることが可能です。
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>

          <v-flex xs12 sm4 class="my-2">
            <div class="text-xs-center">
              <span class="subheading display-3 blue--text">
                ウォレット、ガス代、アカウント不要で始められる新感覚のEOSフルチェーン質問箱サービス
              </span>
            </div>
          </v-flex>
          <v-flex xs12 sm4 class="my-3">
            <v-btn dark color="teal lighten-2" to="/field">Getting Started</v-btn>
          </v-flex>
        </v-layout>
      </section>


   </v-container>
  </v-content>
</template>

<script>
export default {}
</script>

<style scoped>



</style>

