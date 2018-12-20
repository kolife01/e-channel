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
              <h2 class="display-3 blue--text">E-Channel</h2>
              <span class="subheading">
                ウォレット、ガス代、アカウント不要、1分で始められるブロックチェーンサービス
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
                      <div class="headline text-xs-center">ウォレット不要</div>
                    </v-card-title>
                    <v-card-text>
                      アプリやブラウザーエクステンションのウォレットをインストールすることなく、すぐにサービスを利用することができます。
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">flash_on</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">ガス代不要</div>
                    </v-card-title>
                    <v-card-text>
                      すべてのトランザクションの手数料は運営が負担しているため、ユーザーはトランザクションの手数料を支払う必要がありません。
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">account_box</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">アカウント不要</div>
                    </v-card-title>
                    <v-card-text>
                      運営はユーザーの個人情報と秘密鍵を一切管理しません。ユーザーは生成された秘密鍵のみを管理することでサービスを利用できます。
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>

          <v-flex xs12 sm4 class="my-2">
            <div class="text-xs-center">
              <span class="subheading display-3 blue--text">
                質問、回答をするとEOSトークンと交換可能なポイントがインセンティブとして発生します。
              </span>
            </div>
          </v-flex>
          <v-flex xs12 sm4 class="my-3">
            <v-btn dark color="teal lighten-2" to="/tutorial">Getting Started</v-btn>
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

