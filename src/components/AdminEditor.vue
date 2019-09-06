<template>
  <main id="admin-editor" :class="{ darkmode, preview, 'with-header': header }">
    <div class="content-pane">
      <label
        id="masthead"
        for="header-image"
        @drop="setHeader"
        :style="{ backgroundImage: header ? `url(${header})` : null }"
      >
        <input
          type="file"
          id="header-image"
          class="hidden"
          @change="setHeader"
        />
      </label>
      <!-- <header id="masthead"></header> -->

      <div class="text-wrapper">
        <section class="raw">
          <textarea placeholder="Lesson text..." v-model="body"></textarea>
        </section>

        <section class="parsed" v-if="preview">
          <div id="preview">
            <content-block
              v-for="(block, index) in parsed"
              :key="`block-${index}`"
              :content="block.content"
              :revealed="block.revealed"
              :darkMode="darkmode"
              @toggleVisibility="onToggleVisibility(index)"
            ></content-block>
          </div>
        </section>
      </div>
    </div>

    <nav id="side-menu">
      <a role="button" @click="save">
        <save-icon></save-icon>
      </a>
      <a role="button" @click="reveal">
        <eye-icon></eye-icon>
      </a>
      <a role="button" @click="hide">
        <trash-icon></trash-icon>
      </a>
      <a
        role="button"
        @click="darkmode = !darkmode"
        :class="{ active: darkmode }"
      >
        <bulb-icon></bulb-icon>
      </a>
      <a role="button" @click="preview = !preview" :class="{ active: preview }">
        <preview-icon></preview-icon>
      </a>
    </nav>
  </main>
</template>
<script>
import { markdown } from 'markdown';

// import SimpleMDE from 'simplemde';
import io from 'socket.io-client';
import eyeIcon from '../assets/icons/Eye.vue';
import saveIcon from '../assets/icons/Save.vue';
import bulbIcon from '../assets/icons/Bulb.vue';
import previewIcon from '../assets/icons/Preview.vue';
import trashIcon from '../assets/icons/Trash.vue';
import contentBlock from '../components/ContentBlock.vue';

export default {
  components: {
    saveIcon,
    bulbIcon,
    previewIcon,
    eyeIcon,
    contentBlock,
    trashIcon,
  },
  data: () => ({
    body: null,
    socket: null,
    html: '',
    darkmode: false,
    preview: false,
    raw: [],
    parsed: [],
    header: null,
  }),
  methods: {
    save() {},
    reveal() {
      this.parsed = this.parsed.map(block => ({ ...block, revealed: true }));
      this.socket.emit('text:update', JSON.stringify(this.parsed));
    },
    hide() {
      this.parsed = this.parsed.map(block => ({ ...block, revealed: false }));
      this.socket.emit('text:update', JSON.stringify(this.parsed));
    },
    onToggleVisibility(index) {
      this.parsed[index].revealed = !this.parsed[index].revealed;
      this.socket.emit('text:update', JSON.stringify(this.parsed));
    },
    setHeader(event) {
      event.preventDefault();
      const blob = URL.createObjectURL(event.target.files[0]);
      this.socket.emit('header:update', blob);
      this.header = blob;
    },
    packageUploads(event) {
      let fileData = new FormData();

      fileData.append(this.send, event.target.files[0]);

      return fileData;
    },
  },
  watch: {
    body() {
      this.raw = this.body.split('\n');

      this.parsed = this.raw
        .map((block, index) => ({
          revealed: this.parsed[index] ? this.parsed[index].revealed : false,
          content: markdown.toHTML(block),
        }))
        .filter(block => block.content.length);

      this.socket.emit('text:update', JSON.stringify(this.parsed));
    },
  },
  mounted() {
    // Let's start a connection
    this.socket = io('http://localhost:8001');

    // // Let's kick up our editor
    // this.body = new SimpleMDE({
    //   status: false,
    //   toolbar: false,
    //   el: this.$refs.body,
    //   placeholder: 'Lesson text...',
    // });
  },
};
</script>
<style scoped>
#admin-editor {
  display: flex;
  height: 100vh;
  transition: 0.6s;
  overflow: hidden;
  position: relative;
  align-items: stretch;
}

#side-menu {
  width: 5rem;
  height: 100%;
  border-color: #000;
  border-left: 1px solid #252525;
}
#side-menu a {
  height: 5rem;
  display: flex;
  transition: 0.3s;
  border-bottom: 1px solid;
  border-color: inherit;
}
#side-menu a:hover,
#side-menu a.active {
  color: #fff;
  background: #000;
}
#side-menu svg {
  width: 40%;
  height: auto;
  margin: auto;
}
#masthead {
  width: 100%;
  display: flex;
  height: 2.5rem;
  background: #222;
  align-items: center;
  background-size: cover;
  justify-content: center;
  background-position: center;
  color: rgba(255, 255, 255, 0);
  transition: height 1s, color 2s;
}
#masthead:hover {
  color: #fff;
  height: 10rem;
}
#masthead::after {
  content: 'Drag image here';
}

.with-header #masthead {
  height: 20rem;
}
.text-wrapper {
  width: 100%;
  display: flex;
  height: 100%;
  padding-left: 5rem;
  align-items: stretch;
  justify-content: center;
}
.text-wrapper section {
  width: 43rem;
  max-width: 50%;
  padding: 2rem 2rem;
}
textarea {
  width: 100%;
  height: 100%;
  border: none;
  color: inherit;
  background: none;
  font-family: inherit;
}
.parsed {
  border-left: 1px dashed;
}

.content-pane {
  width: calc(100% - 5rem);
}
.hidden {
  /* visibility: hidden; */
  opacity: 0;
  height: 0;
  width: 0;
  position: absolute;
  z-index: -10000;
}

#admin-editor.darkmode {
  color: #fff;
  background: #222;
}
#admin-editor.darkmode #masthead {
  background: #f2f2f2;
}
#admin-editor.darkmode #masthead:hover {
  color: #000;
}
#admin-editor.darkmode #side-menu {
  color: #fff;
  border-color: #fff;
}

#main-body {
  height: 100%;
  cursor: edit;
  border-top: 10vh solid transparent;
}

#admin-editor:not(.preview) .parsed {
  display: none;
}

#preview p {
  display: block;
}
p {
  display: block;
}
</style>
