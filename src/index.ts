import { ic, Manual, match, Opt, Principal, $query, $update, text } from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
    managementCanister
} from 'azle/canisters/management';
import { decodeResponse } from './lib/helpers/decodeResponse';

import { guild as guildRequest } from './params/guild';

$update;
export async function xkcd(): Promise<HttpResponse> {
    const guild = await guildRequest('0xDD6BFbe9EC414FFABBcc80BB88378c0684e2Ad9c');

    return guild;
}

// TODO the replica logs give some concerning output: https://forum.dfinity.org/t/fix-me-in-http-outcalls-call-raw/19435
$update;
export async function xkcdRaw(): Promise<Manual<text>> {
    const httpResult = await ic.callRaw(
        Principal.fromText('aaaaa-aa'),
        'http_request',
        ic.candidEncode(`
            (
                record {
                    url = "https://xkcd.com/642/info.0.json";
                    max_response_bytes = 2_000 : nat64;
                    method = variant { get };
                    headers = vec {};
                    body = null;
                    transform = record { function = func "${ic
                        .id()
                        .toString()}".xkcdTransform; context = vec {} };
                }
            )
        `),
        50_000_000n
    );

    match(httpResult, {
        Ok: (httpResponse) => ic.candidDecode(httpResponse),
        Err: (err) => 'Error'
    });
}

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
    return {
        ...args.response,
        headers: []
    };
}