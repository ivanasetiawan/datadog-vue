<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button
      @click="handleClick('info', { function: 'triggerInfo' }, 'info')"
    >
      Click me for Info!
    </button>
    <button
      @click="handleClick('warn', { function: 'triggerWarn' }, 'warn')"
    >
      Click me for Warn!
    </button>
    <button
      @click="handleClick('error', { function: 'triggerError' }, 'error')"
    >
      Click me for Error!
    </button>
    <button
      @click="handleClick('debug', { function: 'triggerDebug' }, 'debug')"
    >
      Click me for Debug!
    </button>
  </div>
</template>

<script>
import Vue from "vue";
import ddLog from "datadog-vue";

new Vue.use(ddLog, {
  clientToken: "1342889190",
  service: "venopi",
});

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    handleClick(message, messageContext, status) {
      ddLog.$log(message, messageContext, status);
    },
  },
};
</script>