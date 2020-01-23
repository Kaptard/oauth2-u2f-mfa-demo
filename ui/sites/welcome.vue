<template>
  <div>
    <logout></logout>
    <header>
      <div class="container">
        <div class="image">
          <img :src="img" alt="">
        </div>
        <h1>Glückwunsch {{ name }}, du bist nun auf dieser Seite authentifiziert!</h1>
        <div class="legal">
          <a href="/datenschutz">Datenschutz</a>
          <a href="/impressum">Impressum</a>
        </div>
      </div>
    </header>
  </div>
</template>



<script>
import logout from 'src/components/logout.vue'

export default {
  components: {
    logout
  },

  computed: {
    name() {
      return this.$store.state.user.name
    },
    img() {
      return this.$store.state.user.img
    }
  },

  async asyncData() {
    const user = await this.$cubic.get('/userdata')
    if (user.error) return

    this.$store.commit('setUserName', user.given_name)
    this.$store.commit('setUserImage', user.picture)
  },

  mounted() {
    // key check
  },

  storeModule: {
    name: 'user',
    state: {
      name: '',
      img: ''
    },

    mutations: {
      setUserName(state, name) {
        state.name = name
      },
      setUserImage(state, url) {
        state.img = url
      }
    }
  }
}
</script>



<style lang="scss" scoped>
@import '~src/styles/partials/importer';

header {
  display: flex;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  text-align: center;

  .container {
    position: relative;
    z-index: 1;
  }
  h3 {
    color: $color-font-body-light;
    font-family: 'Uni Sans';
    margin-bottom: 20px;
  }
}

  h1 {
    max-width: 600px;
    font-size: 1.25em;
    margin-top: 20px;
  }

.login-form {
  width: 275px;
  border: 1px solid $color-accent;
  border-radius: 8px;
  padding: 110px 60px;
}

/deep/ .google-login {
  margin-top: 30px;
  margin-bottom: 30px; // optical center
}

.legal {
  text-align: center;
  margin-top: 40px;
  margin-right: 8px;

  a {
    color: $color-font-body-light;
    margin-left: 10px;
    font-size: 0.8em;
    font-weight: 500;
  }
}
.image {
  position: relative;
  overflow: hidden;
  width: 64px;
  height: 64px;
  margin: auto;
  border-radius: 9999px;

  img {
    height: 100%;
  }
}
</style>
