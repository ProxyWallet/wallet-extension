import { backgroundOnMessage } from "../lib/message-bridge/bridge";
import { handleBackgroundMessage } from "../lib/message-handlers/background-message-handler";

backgroundOnMessage(handleBackgroundMessage)