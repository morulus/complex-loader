/* Reduce hightlight bundle size */
/* Template: https://www.npmjs.com/package/vue-highlightjs */
/* Article: https://bjacobel.com/2016/12/04/highlight-bundle-size/ */
import hljs from 'highlight.js/lib/highlight';

['javascript', 'json', 'bash'].forEach((langName) => {
  // Using require() here because import() support hasn't landed in Webpack yet
  const lang = require(
     /* webpackMode: "eager" */
    `highlight.js/lib/languages/${langName}.js`,
  );
  hljs.registerLanguage(langName, lang);
});

const vueHighlightJS = {};
vueHighlightJS.install = function install(Vue) {
  Vue.directive(`highlightjs`, {
    deep: true,
    bind: function bind(el, binding) {
      let target;
      let i;

      const targets = el.querySelectorAll(`code`);


      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];

        if (typeof binding.value === `string`) {
          /* If a value is directly assigned to the directive, use this
             instead of the element content. */
          target.textContent = binding.value;
        }

        hljs.highlightBlock(target);
      }
    },
    componentUpdated: function componentUpdated(el, binding) {
      // After an update, re-fill the content and then highlight
      const targets = el.querySelectorAll(`code`);
      let target;
      let i;

      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];
        if (typeof binding.value === `string`) {
          target.textContent = binding.value;
        }
        hljs.highlightBlock(target);
      }
    }
  });
};

export default vueHighlightJS;
