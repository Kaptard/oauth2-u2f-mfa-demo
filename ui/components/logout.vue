<template>
  <div @click="logout" class="logout">
    <a>Abmelden</a>
  </div>
</template>



<script>
export default {
  methods: {
    async logout() {
      await this.$cubic.get('/logout')
      this.$router.push('/')
    }
  }
}
</script>



<style lang="scss" scoped>
@import '~src/styles/partials/importer';

.logout {
  text-align: right;
  margin-bottom: -50px;
  margin-right: 20px;
  margin-top: 10px;
  position: relative;
  z-index: 1;

  a {
    display: inline-block;
    padding: 8px;
    cursor: pointer;
    color: $color-font-body-light;
    font-size: 0.8em;
    font-weight: 500;
  }
}
</style>
