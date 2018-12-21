<template>
  <div>
    <v-navigation-drawer
      class="teal lighten-5"
      v-model="drawer"
      disable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile to="/" >
          <v-list-tile-action>
            <v-icon >home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title >Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/field">
          <v-list-tile-action>
            <v-icon>question_answer</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Questions</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/ask">
          <v-list-tile-action>
            <v-icon>help</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Ask</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/tutorial">
          <v-list-tile-action>
            <v-icon>description</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Tutorial</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>        
        <v-list-tile to="/mypage">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Mypage</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app dark color="teal lighten-2">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="display-1 font-weight-thin" >E-Channel</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat to="/">Home</v-btn>
      <v-btn flat to="/field">Questions</v-btn>
      <v-btn flat to="/ask">Ask</v-btn>
      <v-btn flat to="/tutorial">Tutorial</v-btn>
      <v-btn flat to="/mypage">Mypage</v-btn>
    </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {

    data: () => ({
      drawer: false
    }),

}
</script>

<style>

</style>
