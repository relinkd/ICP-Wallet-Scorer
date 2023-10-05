import {
	blob,
	Func,
	nat16,
	Opt,
	Query,
	Record,
	Variant,
	Vec,
} from 'azle';

export type Header = { name: string; value: string; };

type Token = Record<{
    arbitrary_data: string;
}>;

type StreamingCallbackHttpResponse = Record<{
    body: blob;
    token: Opt<Token>;
}>;

type Callback = Func<Query<(t: Token) => StreamingCallbackHttpResponse>>;

type CallbackStrategy = Record<{
    callback: Callback;
    token: Token;
}>;

type StreamingStrategy = Variant<{
    Callback: CallbackStrategy;
}>;

export type HttpRequest = Record<{
    method: 'get';
    url: string;
    headers: Vec<Header>;
    body: blob | null;
}>;

export type HttpResponse = Record<{
    status_code: nat16;
    headers: Vec<Header>;
    body: blob;
    streaming_strategy: Opt<StreamingStrategy>;
    upgrade: Opt<boolean>;
}>;
