<template>
  <div class="dialog-container" v-shortkey="['esc']" @shortkey="handleClose">
    <div class="dialog-header">
      <slot name="header"></slot>
      <a class="close" @click="handleClose">&times;</a>
    </div>
    <div class="dialog-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    name: 'dialog',
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    methods: {
      handleClose() {
        this.$emit('close');
      },
    },
  };
</script>

<style>
  .dialog-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: #333;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }

  .dialog-container .dialog-header {
    min-height: 40px;
    width: 100%;
    padding: 12px 30px;
    background: #333;
    border-bottom: solid 1px #3a3a3a;
  }

  .dialog-header .close {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    -webkit-app-region: no-drag;
  }

  .dialog-container .dialog-body {
    flex: 1;
    padding: 12px 30px;
    overflow-y: auto;
  }
</style>
