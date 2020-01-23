<template>
  <div>
    <logout></logout>
    <header>
      <div class="container">
        <div class="login-form">
          <h3>Login-Demo</h3>
          <h1>Anmeldung</h1>
          <p>Mit Google-Konto anmelden.</p>
          <oauth2></oauth2>
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
import oauth2 from 'src/components/google-login.vue'
import logout from 'src/components/logout.vue'

export default {
  components: {
    oauth2,
    logout
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
  padding: 110px 60px;
}

/deep/ .google-login {
  margin-top: 30px;
  margin-bottom: 30px; // optical center
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
