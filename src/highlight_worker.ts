onmessage = (event) => {
  importScripts("/js/highlight.min.js");
  const result = self.hljs.highlight(event.data.code, {
    language: event.data.extension,
    ignoreIllegals: true,
  });
  postMessage(result.value);
};
