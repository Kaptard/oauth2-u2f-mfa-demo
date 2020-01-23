<template>
  <div class="google-login" @click="login">
    <img src="/img/google.svg" alt="" class="google-login-logo">
    <p class="google-login-text">Anmelden mit Google</p>
  </div>
</template>



<script>
export default {
  methods: {
    async login() {
      const auth = await this.$cubic.get('/oauth2')

      if (auth.url) {
        const x = screen.width/2 - 520/2
        const y = screen.height/2 - 570/2
        window.open(
          auth.url,
          '_blank',
          'height=570,width=520,scrollbars=yes,left=' + x + ',top=' + y
        )
        this.$cubic.subscribe('/success', data => {
          if (data.user === this.$store.state.$user.uid) {
            this.$cubic.unsubscribe('/success')
            this.login() // this time the token will be present
          }
        })
      } else {
        const userData = await this.$cubic.get('/google-userdata')
        this.$store.commit('setToken', auth.token)
        this.$store.commit('setName', userData.given_name)
        this.$router.push('/2fa')
      }
    }
  },

  storeModule: {
    name: 'google',
    state: {
      token: '',
      name: ''
    },

    mutations: {
      setToken(state, token) {
        state.token = token
      },
      setName(state, name) {
        state.name = name
      }
    }
  }
}
</script>



<style lang="scss" scoped>
@import '~src/styles/partials/importer';

.google-login {
  display: inline-flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 2px;
  background: $color-primary;
  color: white;
  cursor: pointer;
  @include shadow-0;
  @include ease(0.25s);

  &:hover {
    @include shadow-1;
    background: rgb(95, 151, 241);
  }
}

.google-login-logo {
  height: 22px;
}
.google-login-text {
  padding: 0 20px;
}
</style>
