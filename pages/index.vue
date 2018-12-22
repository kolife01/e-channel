<template>
  <v-content>
    <v-container>

      <section>
        <v-layout
          column
          wrap
          align-center
        >
          <v-flex xs12 sm4 class="my-5">
            <div class="text-xs-center">
              <h2 class="display-3 blue--text">EOSのエアドロ質問箱</h2>
              <span class="subheading">
                質問、回答をするだけでEOSトークンが簡単に手に入る質問箱サービス
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
                      質問や質問に対する回答を行うと、投稿した人にEOSトークンがエアドロップされます。
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">flash_on</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">投げ銭(メンテナンス中)</div>
                    </v-card-title>
                    <v-card-text>
                      ユーザー間で投げ銭を行うことで、投稿への評価と感謝の気持ちを表現することができます
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">nature_people</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">分散化</div>
                    </v-card-title>
                    <v-card-text>
                      E-Channel上に自分のdAppsを開発することで、エアドロップを受けることができます。
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>

          <v-flex xs12 sm4 class="my-5">
            <div class="text-xs-center">
              <span class="subheading blue--text">
                ウォレット、ガス代、アカウント不要で始められる新感覚のEOSフルオンチェーンの質問箱サービス
              </span>
            </div>
          </v-flex>
        </v-layout>
      </section>

        <v-layout
          column
          wrap
          align-center
        >
          <v-flex xs12 sm4 class="my-5">
            <v-btn dark color="blue lighten-2" to="/field">質問を見る</v-btn>
            <v-btn dark color="blue lighten-2" to="/ask">質問をする</v-btn>
          </v-flex>
        
      </v-layout>

      <section>
      <v-timeline>
        <v-timeline-item
          color="red lighten-2"
          large
        >
          <span slot="opposite">2018 December</span>
          <v-card class="elevation-2">
            <v-card-title class="headline">α版リリース</v-card-title>
            <v-card-text>
               - EOSのフルオンチェーンで実装<br>
               - 利用のためにウォレット、ガス代、アカウントのいらない設計<br>
               - 既存クラウドDBとの使用感や運用コストの比較
            </v-card-text>
          </v-card>
        </v-timeline-item>
                <v-timeline-item
          color="red lighten-2"
          large
        >
          <span slot="opposite">2018 December - 2019 - January</span>
          <v-card class="elevation-2">
            <v-card-title class="headline">フィードバック収集 & アップデート</v-card-title>
            <v-card-text>
               - パブリックチェーンのメリット、ユースケースの模索<br>
               - β版の仕様確定<br>
               - β版の開発<br>
            </v-card-text>
          </v-card>
        </v-timeline-item>
                <v-timeline-item
          color="red lighten-2"
          large
        >
          <span slot="opposite">2019 - January</span>
          <v-card class="elevation-2">
            <v-card-title class="headline">β版リリース</v-card-title>
            <v-card-text>
              - α版のフィードバックをもとにアップデートしたβ版のリリース
            </v-card-text>
          </v-card>
        </v-timeline-item>
                <v-timeline-item
          color="red lighten-2"
          large
        >
          <span slot="opposite">2019 - Spring</span>
          <v-card class="elevation-2">
            <v-card-title class="headline">dAppsへのアップデート</v-card-title>
            <v-card-text>
              - 運営の分散化<br>
              - dApps開発のプラットフォームとしての拡張
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      </section>

        <v-layout
          column
          wrap
          align-center
        >
          <v-flex xs12 sm4 class="my-5">
            <v-btn dark color="blue lighten-2" to="/field">質問を見る</v-btn>
            <v-btn dark color="blue lighten-2" to="/ask">質問をする</v-btn>
          </v-flex>
        
      </v-layout>

   </v-container>
  </v-content>




</template>

<script>
export default {




}
</script>

<style scoped>



</style>

