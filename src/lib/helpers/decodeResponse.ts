export const decodeResponse = (body: Uint8Array) => {
    return new TextDecoder().decode(body);
}