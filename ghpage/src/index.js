import Vue from 'vue'
import VueHighlightJS from './directives/highlightjs.js'
import 'github-markdown-css/github-markdown.css'
import readme from './README.md'
import webpackConfig from '../config/markdown.rule.js'
import template from './templates/content.html'
import './style.css'
import './highlight.css'

// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS)

console.log('readme', readme)

new Vue({
  el: '#root',
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
    exampleImport: `import readme from './README.md'`,
    title: readme.metadata.heading,
  },
  template
})
