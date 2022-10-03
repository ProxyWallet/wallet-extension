import { EventEmitter } from "eventemitter3";
import { windowOnMessage } from "./bridge";

export enum WindowPostMessagePayloadType {
    REQUEST = 'request',
    RESPONSE = 'response'
}

export enum PostMessageDestination {
    BACKGROUND = 'background',
    CONTENT_SCRIPT = 'content-script',
    POPUP = 'popup'
}

export class WindowPostMessagePayload {
    public type: WindowPostMessagePayloadType = WindowPostMessagePayloadType.REQUEST;
    public msg?: string = undefined;
    public reqUid?: string = undefined;

    constructor(
        init: Partial<WindowPostMessagePayload>
    ) {
        Object.assign(this, init);
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    public static fromJson(json: string): WindowPostMessagePayload | undefined {
        try {
            return <WindowPostMessagePayload>JSON.parse(json)
        } catch (er) {
            return undefined;
        }
    }
}

export class RuntimePostMessagePayload<TMsg = any> {
    public destination?: PostMessageDestination = PostMessageDestination.CONTENT_SCRIPT;
    public msg?: TMsg = undefined;

    constructor(
        init: Partial<RuntimePostMessagePayload>
    ) {
        Object.assign(this, init);
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    public static fromJson(json: string): RuntimePostMessagePayload | undefined {
        try {
            return <RuntimePostMessagePayload>JSON.parse(json)
        } catch (er) {
            return undefined;
        }
    }
}


export const WINDOW_CS_REQUEST_EN = 'window.cs.request';
export const WINDOW_CS_RESPONSE_EN = 'window.cs.response';

export class WindowCSMessageBridge {
    private readonly WINDOW_MSG_EE = new EventEmitter();

    constructor(
        public readonly prefix?: string) {
        windowOnMessage(
            async (msg) => {
                console.log(`${this.prefix} BRIDGE:`, msg)
                // console.log('inner handler', msg)
                this.WINDOW_MSG_EE.emit(
                    msg.type == WindowPostMessagePayloadType.REQUEST ?
                        WINDOW_CS_REQUEST_EN : WINDOW_CS_RESPONSE_EN,
                    msg);
            }
        )
    }

    windowSubscribeRequest(callback: (...args: any[]) => void, content?: any) {
        console.log('Sub Req')
        this.WINDOW_MSG_EE.addListener(WINDOW_CS_REQUEST_EN, callback, content)
        console.log('count', this.WINDOW_MSG_EE.listenerCount(WINDOW_CS_REQUEST_EN));
    }

    windowSubscribeResponse(callback: (...args: any[]) => void, content?: any) {
        console.log('Sub Resp')
        this.WINDOW_MSG_EE.addListener(WINDOW_CS_RESPONSE_EN, callback, content)
        console.log('count', this.WINDOW_MSG_EE.listenerCount(WINDOW_CS_RESPONSE_EN));
    }

    windowUnSubscribeRequest(callback: (...args: any[]) => void, content?: any) {
        console.log('UnSub Req', this.WINDOW_MSG_EE.listenerCount(WINDOW_CS_REQUEST_EN))
        this.WINDOW_MSG_EE.removeListener(WINDOW_CS_REQUEST_EN, callback, content)
        console.log(this.WINDOW_MSG_EE.listenerCount(WINDOW_CS_REQUEST_EN))

    }

    windowUnSubscribeResponse(callback: (...args: any[]) => void, content?: any) {
        console.log('UnSub Resp', this.WINDOW_MSG_EE.listenerCount(WINDOW_CS_RESPONSE_EN))
        this.WINDOW_MSG_EE.removeListener(WINDOW_CS_RESPONSE_EN, callback, content)
        console.log(this.WINDOW_MSG_EE.listenerCount(WINDOW_CS_RESPONSE_EN))
    }

}

