export enum WindowPostMessagePayloadType {
    REQUEST = 'request',
    RESPONSE = 'response'
}

export class WindowPostMessagePayload {
    public type: WindowPostMessagePayloadType = WindowPostMessagePayloadType.REQUEST;
    public msg?: string = undefined;

    constructor(
        init: Partial<WindowPostMessagePayload>
    ) {
        Object.assign(this, init);
    }

    public toJson(): string {
        return JSON.stringify(this);
    }

    public static fromJson(json: string): WindowPostMessagePayload {
        return <WindowPostMessagePayload>JSON.parse(json)
    }
}
