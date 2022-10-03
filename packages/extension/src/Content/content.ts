
import browser from "webextension-polyfill";
import { sendMessageFromСsToBackground, initWindowBridge, CS_WINDOW_BRIDGE, } from "../lib/message-bridge/bridge";
import { PostMessageDestination, RuntimePostMessagePayload, WindowPostMessagePayload, WindowPostMessagePayloadType, } from "../lib/message-bridge/types";

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

const onWindowMessage = async (...args: any[]) => {
  const payload = args[0] as WindowPostMessagePayload;

  console.log('onWindowMessage', args);


  if (
    !payload ||
    payload.type !== WindowPostMessagePayloadType.REQUEST
  ) {
    console.debug('CS onWindowMessage: unsatisfied payload');
    return;
  }

  // console.log('CS msg handle: ', msg);
  const resp = await sendMessageFromСsToBackground(payload.msg);

  console.log('WindowToCS Request', resp);

  window.postMessage(new WindowPostMessagePayload({
    msg: resp,
    type: WindowPostMessagePayloadType.RESPONSE,
    reqUid: payload.reqUid
  }).toJson());
}

initWindowBridge('content-script');

CS_WINDOW_BRIDGE.windowSubscribeRequest(onWindowMessage)

injectScript();