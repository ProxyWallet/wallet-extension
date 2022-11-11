export const normalizeURL = (url: string) => {
    const _url = new URL(url)
    const baseUrl = `${_url.protocol}//${_url.hostname}`
    return baseUrl;
}