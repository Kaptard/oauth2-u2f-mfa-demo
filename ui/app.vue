<template>
  <div id='app'>
    <router-view></router-view>
  </div>
</template>



<script>
export default {
  head: {
    title: 'Login-Demo',
    link: [
      { rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500', as: 'font' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500' }
    ],
  }
}
</script>



<style lang='scss'>
@import '~src/styles/partials/importer';
@import '~src/styles/reset.scss';
@import '~src/styles/grid.scss';

// Make hover state on links more noticable since default styles are resetted.
a {
  opacity: 0.8;
  @include ease(0.2s);

  &:hover {
    opacity: 1 !important;
  }
}

#app {
  background: $color-bg;
}
</style>
