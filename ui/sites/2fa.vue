<template>
  <div>
    <logout></logout>
    <header>
      <div class="container">
        <div class="login-form">
          <h3>Login-Demo</h3>
          <h1>Hallo, {{ name }}!</h1>
          <p>Nutze nun deinen Security Key um den Vorgang abzuschließen</p>
          <img src="/img/seckey.png" alt="">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <g transform="translate(20 50)">
          <circle cx="0" cy="0" r="6" fill="#4e7cfb" transform="scale(0.929007 0.929007)">
            <animateTransform attributeName="transform" type="scale" begin="-0.6355932203389829s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1.6949152542372878s" repeatCount="indefinite"></animateTransform>
          </circle>
          </g><g transform="translate(40 50)">
          <circle cx="0" cy="0" r="6" fill="#246dff" transform="scale(0.636184 0.636184)">
            <animateTransform attributeName="transform" type="scale" begin="-0.42372881355932196s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1.6949152542372878s" repeatCount="indefinite"></animateTransform>
          </circle>
          </g><g transform="translate(60 50)">
          <circle cx="0" cy="0" r="6" fill="#92baff" transform="scale(0.285817 0.285817)">
            <animateTransform attributeName="transform" type="scale" begin="-0.21186440677966098s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1.6949152542372878s" repeatCount="indefinite"></animateTransform>
          </circle>
          </g><g transform="translate(80 50)">
          <circle cx="0" cy="0" r="6" fill="#5062ff" transform="scale(0.0299873 0.0299873)">
            <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1.6949152542372878s" repeatCount="indefinite"></animateTransform>
          </circle>
          </g>
          </svg>
        </div>
        <div class="legal">
          <a href="/datenschutz">Datenschutz</a>
          <a href="/impressum">Impressum</a>
        </div>
      </div>
    </header>
  </div>
</template>



<script>
try {
  window
  require('u2f-api-polyfill')
} catch (err) {
  // ssr
}
import logout from 'src/components/logout.vue'

export default {
  components: {
    logout
  },

  computed: {
    name() {
      return this.$store.state.google.name
    }
  },

  async mounted() {
    const challenge = await this.$cubic.get('/u2f-challenge')
    if (challenge === 'not logged in') return this.$router.push('/')

    if (challenge.type === 'register') {
      window.u2f.register(challenge.request.appId, [challenge.request], [], async registrationResponse => {
        const verification = await this.$cubic.post('/u2f-challenge', { registrationResponse })

        if (verification === 'ok') {
          this.$router.push('/welcome')
        } else {
          this.$router.push('/')
        }
      })
    }

    else if (challenge.type === 'regular') {
      window.u2f.sign(challenge.request.appId, challenge.request.challenge, [challenge.request], async authResponse => {
        const verification = await this.$cubic.post('/u2f-challenge', { authResponse })

        if (verification === 'ok') {
          this.$router.push('/welcome')
        } else {
          this.$router.push('/')
        }
      })
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

.login-form {
  width: 275px;
  border: 1px solid $color-accent;
  border-radius: 8px;
  padding: 60px 60px 0;

  img {
    margin-top: 40px;
    height: 125px;
  }
}

.legal {
  text-align: right;
  margin-top: 10px;
  margin-right: 8px;

  a {
    color: $color-font-body-light;
    margin-left: 10px;
    font-size: 0.8em;
    font-weight: 500;
  }
}
</style>
