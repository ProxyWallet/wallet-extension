
import browser from "webextension-polyfill";

function injectScript() {
  try {
    console.log('inject script');
    const injectURL = browser.runtime.getURL("inject.bundle.js");
    console.log('url', injectURL)
    console.log('inject script2');

    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("async", "false");
    scriptTag.src = `${injectURL}`;
    scriptTag.id = 'undas-inject'
    console.log('inject script21');

    // scriptTag.onload = function () {
    // console.log('onload');
      
    //   console.info("Hello from the content-script");
    //   container.removeChild(scriptTag);
    // };
    console.log('inject script3');

    container.insertBefore(scriptTag, container.children[0]);
    console.log('inject script4');

  } catch (error) {
    console.error("Undas: Provider injection failed.", error);
  }
}

injectScript();