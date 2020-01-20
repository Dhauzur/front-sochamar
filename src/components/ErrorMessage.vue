<template lang="html">
  <b-alert
    :show="dismissCountDown"
    dismissible
    variant="warning"
    @dismissed="dismissCountDown=0"
    @dismiss-count-down="countDownChanged"
  >
    <p>{{ msj }}</p>
    <b-progress
      variant="warning"
      :max="dismissSecs"
      :value="dismissCountDown"
      height="4px"
    ></b-progress>
  </b-alert>
</template>

<script>
  export default {
    props: ['msj'],
    data() {
      return {
        dismissSecs: 25,
        dismissCountDown: 0,
        showDismissibleAlert: false
      }
    },
    mounted() {
      this.dismissCountDown = this.dismissSecs
    },
    methods: {
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
    }
  }
</script>

<style lang="css" scoped>
</style>
