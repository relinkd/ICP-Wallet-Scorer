import { ic, Manual, match, Opt, Principal, $query, $update, text, float32, StableBTreeMap } from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
    managementCanister
} from 'azle/canisters/management';
import { evaluateScore } from './lib/helpers/evaluateScore';

import { params } from './params';


const scores = new StableBTreeMap<text, float32>(0, 50, 100);

$update;
export async function xkcd(address: text): Promise<Manual<float32>> {
    let score = 0;

    const requests = params.map(async (param) => {
        const scoreLocal = await param(address);
        score += scoreLocal;
    })

    scores.insert(address, score);

    await Promise.all(requests);

    ic.reply(score);
}

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
    return {
        ...args.response,
        headers: []
    };
}
