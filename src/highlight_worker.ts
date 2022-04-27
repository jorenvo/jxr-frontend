onmessage = (event) => {
  importScripts("/js/highlight.min.js");
  const result = self.hljs.highlightAuto(event.data);
  postMessage(result.value);
};
