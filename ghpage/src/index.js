import Vue from 'vue'
import VueHighlightJS from './directives/highlightjs.js'
import 'github-markdown-css/github-markdown.css'
import readme from './README.md'
import webpackConfig from '../config/markdown.rule.js'
import './style.css'
import './highlight.css'

// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS)

new Vue({
  el: '#slides',
  data: {
    markdownSource: readme.content,
    metadata: JSON.stringify(
      {
        ...readme,
        content: '...'
      },
      null,
      2
    ),
    webpackConfig,
    sections: readme.metadata.sections
      .map(text => ({
        href: '#' + text.toLowerCase()
          .replace(/[\s]+/g, '-'),
        text
      })),
    exampleImport: `import readme from '../../README.md'`
  },
})

new Vue({
  el: '#header',
  data: {
    title: readme.heading,
  },
})
