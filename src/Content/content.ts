
import browser from "webextension-polyfill";

function injectScript() {
  try {
    const injectURL = browser.runtime.getURL("inject.bundle.js");
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("async", "false");
    scriptTag.src = `${injectURL}`;
    scriptTag.id = 'enkrypt-inject'
    scriptTag.onload = function () {
      console.info("Hello from the content-script");
      container.removeChild(scriptTag);
    };
    container.insertBefore(scriptTag, container.children[0]);
  } catch (error) {
    console.error("Undas: Provider injection failed.", error);
  }
}

injectScript();