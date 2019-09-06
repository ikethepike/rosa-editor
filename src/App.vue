<template>
  <div id="app">
    <template v-if="chosen === null">
      <section id="choice">
        <a role="button" @click="choose('admin')">Admin</a>
        <a role="button" @click="choose('student')">Student</a>
      </section>
    </template>

    <template v-if="chosen === 'admin'">
      <admin-editor></admin-editor>
    </template>

    <template v-if="chosen === 'student'">
      <student-view></student-view>
    </template>
  </div>
</template>

<script>
// Imports
import 'url-search-params-polyfill';
import adminEditor from './components/AdminEditor.vue';
import studentView from './components/StudentView.vue';

export default {
  components: { adminEditor, studentView },
  data: () => ({
    chosen: null,
  }),
  methods: {
    choose(view) {
      this.chosen = view;
    },
  },
  mounted() {
    const url = new URL(window.location);

    if (url.search.includes('view=')) {
      const adminView = url.search.includes('admin');
      this.chosen = adminView ? 'admin' : 'student';
    }
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
#app {
  color: #2c3e50;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

/* Flows */
.reading-flow {
  width: 43rem;
  max-width: 95%;
  margin-left: auto;
  margin-right: auto;
}

a {
  color: inherit;
  cursor: pointer;
}
#choice {
  display: flex;
  height: 100vh;
  align-items: stretch;
}
#choice a {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}
#choice a:hover {
  background: #ccc;
}
#choice a:nth-child(1) {
  border-right: 1px solid #000;
}
#choice a:nth-child(2) {
  border-left: 1px solid #000;
}
</style>
