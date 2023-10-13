import { ic, Manual, match, Opt, Principal, $query, $update, text, float32 } from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
    managementCanister
} from 'azle/canisters/management';
import { evaluateScore } from './lib/helpers/evaluateScore';

import { params } from './params';

$update;
export async function xkcd(address: text): Promise<Manual<float32>> {
    let score = 0;

    const requests = params.map(async (param) => {
        const scoreLocal = await param(address);
        score += scoreLocal;
    })

    await Promise.all(requests);

    ic.reply(score);
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
        Ok: (httpResponse) => ic.reply(ic.candidDecode(httpResponse)),
        Err: (err) => ic.reply('Error'),
    });
}

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
    return {
        ...args.response,
        headers: []
    };
}
