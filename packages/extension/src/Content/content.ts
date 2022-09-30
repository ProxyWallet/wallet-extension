
import browser from "webextension-polyfill";
import { windowOnMessage, sendMessageFromСsToBackground } from "../lib/message-bridge/bridge";
import { WindowPostMessagePayload, WindowPostMessagePayloadType } from "../lib/message-bridge/types";

function injectScript() {
  try {
    console.log('inject script');
    const injectURL = browser.runtime.getURL("inject.bundle.js");
    console.log('url', injectURL)
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("async", "false");
    scriptTag.src = `${injectURL}`;
    scriptTag.id = 'undas-inject'

    scriptTag.onload = function () {
      console.info("Hello from the content-script");
      container.removeChild(scriptTag);
    };

    container.insertBefore(scriptTag, container.children[0]);
  } catch (error) {
    console.error("Undas: Provider injection failed.", error);
  }
}

windowOnMessage(
  async (msg) => {
    // console.log('CS msg handle: ', msg);
    const resp = await sendMessageFromСsToBackground(msg);
    // console.log('CS msg response', resp);

    window.postMessage(new WindowPostMessagePayload({
      msg: resp,
      type: WindowPostMessagePayloadType.RESPONSE
    }).toJson());
  },
  WindowPostMessagePayloadType.REQUEST
)

injectScript();