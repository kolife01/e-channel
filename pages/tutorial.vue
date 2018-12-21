<template>
<v-content>
    <v-container>
        <v-card-text color="teal">
        <div class="display-1 text-md-center" color="teal">E-Channelの使い方</div>
        <br>
        <p class="text-md-center">
        E-channelとは質問、回答をすると褒賞がもらえるサービスです。<br>
        全てのデータをEOSのパブリックブロックチェーンで管理しています。
        </p>
        <br>
        <div class="display-1" color="teal">質問方法</div>
        <p>左上のMenuバーをクリック、Askを選択します。<br>
            質問のタイトル、本文を入力し、Ask Questionボタンを押すと質問が投稿できます。
        </p>
        
        <img class="text-md-center" src="~/assets/img/tutorial/e1.png" alt="">
        <br>
        <div class="display-1" color="teal">回答方法</div>
        <p>左上のMenuバーをクリック、Questionを選択します。<br>
            質問一覧が表示されるので、回答したい質問を選択します。<br>
            一番下のYou Answerに回答を入力し、ADD Answerボタンを押すと投稿できます。
        </p>
        <img class="text-md-center" src="~/assets/img/tutorial/e2.png" alt="">
            <br>
            <br>
            
        <br>
        <div class="display-1" color="teal">投げ銭機能</div>
        <p>
            質問、回答に投げ銭することが出来ます。<br>
            質問や回答のTipボタンを押し、Point額を選択し、Sendを押すと<br>
            その質問、回答の投稿者に投げ銭することが出来ます。<br>   
        </p>
        <img class="text-md-center" src="~/assets/img/tutorial/e3.png" alt="">
        <br>
        <br>
        <div class="display-1" color="teal">褒賞について</div>
        <p>
            質問一件に付き200Point、回答一件に付き300Point付与されます。
            マイページからポイントを確認することが出来ます。
            1000Pointからご自身のEOSアカウントに出金することが出来ます。
            レートは100Point = 0.00035EOS相当です。
            注意)Point付与額、レートは予告なく変更する可能性があります。
            <nuxt-link to="/terms">利用規約</nuxt-link>
        </p>
        <img class="text-md-center" src="~/assets/img/tutorial/e4.png" alt="">
        <br>
        <br>
        <div class="display-1" color="teal">引き出し方法について</div>
        <p>irex等でEOSアカウントを作成します。<a href="https://irex.io/ja">https://irex.io/ja</a></p>
        
        <p>
            マイページからWithdraw EOSを選択し、作成したアカウント、金額を入力しsendボタンを押すとEOSを引き出すことが出来ます。
        </p>
        <img class="text-md-center" src="~/assets/img/tutorial/e5.png" alt="">
        <br>
        <br>


       
        <div class="display-1" color="teal">実装技術について</div>
        <p>
            ブロックチェーンはEOSを採用しています。
            ユーザー登録後、秘密鍵、公開鍵を生成し、ユーザーの投稿が出来るようにしています。
            詳細はこちらの記事をご覧ください。
        </p>
        <br>
        <div class="title text-md-center font-weight-bold" color="teal">まずは質問、回答をしてPointをゲットしてみましょう。</div>


        
        </v-card-text>
       



        
    </v-container>
  </v-content>

    
</template>

<script>
export default {

}
</script>

<style scooped>

img{
    width: 700px;
    height: auto;
    padding: 0 0 0 0;
  }

@media (max-width: 700px){
  img{
    width: 300px;
    height: auto;
    padding: 0 0 0 0;
  }
}

</style>
