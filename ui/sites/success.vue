<template>
  <div></div>
</template>



<script>
export default {
  async mounted() {
    await this.$cubic.get('/success')
    window.close()
  }
}
</script>
