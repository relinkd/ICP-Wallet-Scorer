import {
    blob,
    bool,
    Canister,
    Func,
    nat16,
    None,
    Opt,
    query,
    Record,
    text,
    Tuple,
    Variant,
    Vec
} from 'azle';

const Token = Record({
    // add whatever fields you'd like
    arbitrary_data: text
});

const StreamingCallbackHttpResponse = Record({
    body: blob,
    token: Opt(Token)
});

export const Callback = Func([text], StreamingCallbackHttpResponse, 'query');

const CallbackStrategy = Record({
    callback: Callback,
    token: Token
});

const StreamingStrategy = Variant({
    Callback: CallbackStrategy
});

type HeaderField = [text, text];
const HeaderField = Tuple(text, text);

export const HttpResponse = Record({
    status_code: nat16,
    headers: Vec(HeaderField),
    body: blob,
    streaming_strategy: Opt(StreamingStrategy),
    upgrade: Opt(bool)
});

export const HttpRequest = Record({
    method: text,
    url: text,
    headers: Vec(HeaderField),
    body: blob,
    certificate_version: Opt(nat16)
});