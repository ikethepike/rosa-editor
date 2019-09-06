<template>
  <div
    class="content-block"
    :class="{ revealed, 'dark-mode': darkMode }"
    @click="toggleVisibility"
  >
    <!-- <button class="visibility"></button> -->
    <div class="content" v-html="content"></div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    revealed: {
      type: Boolean,
      required: true,
    },
    darkMode: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toggleVisibility() {
      this.$emit('toggleVisibility');

      // this.socket.emit(`section:${this.revealed ? 'hide' : 'show'}`, {});
    },
  },
};
</script>
<style scoped>
p {
  margin: 0;
}
.content-block {
  cursor: pointer;
  position: relative;
  transition: background 0.3s, opacity 0.4s;
}
.content-block:hover {
  background: #f2f2f2;
}
.content-block.dark-mode:hover {
  background: #252525;
}
.content-block:not(.revealed) {
  opacity: 0.5;
}
/* button {
  top: -0.25rem;
  padding: 0;
  left: -0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  border: none;
  display: none;
  cursor: pointer;
  background: none;
  appearance: none;
  border-radius: 50%;
  position: absolute;
  transition: background 0.3s;
}
.content-block:hover button {
  display: block;
  background: tomato;
}
.content-block.revealed button {
  background: green;
} */
</style>
