<template>
  <div id="student-view" :class="{ empty, 'with-header': header }">
    <header
      class="student-masthead"
      :style="{ backgroundImage: header ? `url(${header})` : null }"
    ></header>

    <article class="reading-flow">
      <template v-if="empty">
        <span class="empty"
          >Looks like the teacher hasn't added anything yet...</span
        >
      </template>

      <template v-else>
        <section
          class="block"
          v-for="(block, index) in parsed"
          :key="index"
          v-show="block.revealed"
          v-html="block.content"
        ></section>
      </template>
    </article>
  </div>
</template>
<script>
import io from 'socket.io-client';

export default {
  data: () => ({
    socket: null,
    header: null,
    parsed: [],
  }),
  computed: {
    empty() {
      return this.parsed.every(block => block.revealed === false);
    },
  },
  mounted() {
    this.socket = io('http://localhost:8001');
    this.socket.on('text:update', data => {
      this.parsed = JSON.parse(data);
    });

    this.socket.on('header:update', blob => {
      this.header = blob;
    });
  },
};
</script>
<style>
#student-view header {
  height: 2.5rem;
  background-color: #000;
  background-size: cover;
  transition: height 0.8s;
  background-position: center;
}
#student-view.with-header header {
  height: 20rem;
}
#student-view article {
  padding: 5rem 0;
}
#student-view:not(.empty) .reading-flow::after {
  width: 60%;

  height: 1px;
  content: '';
  display: block;
  background: #ccc;
}
/* Formatting */
blockquote {
  color: #000;
  margin-left: 0;
  font-weight: 500;
  font-size: 1.2rem;
  padding-left: 1rem;
  border-left: 2px solid #ccc;
}

span.empty {
  color: rgba(0, 0, 0, 0.5);
}
.block {
  animation: fade-up 0.8s 1;
}

@keyframes fade-up {
  0% {
    opacity: 0;
    transform: translateY(4rem);
  }
}
</style>
