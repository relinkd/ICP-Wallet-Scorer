import { ic, Manual, match, Opt, Principal, $query, $update, text, float64, float32, StableBTreeMap } from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
    managementCanister
} from 'azle/canisters/management';
import { evaluateScore } from './lib/helpers/evaluateScore';

import { params } from './params';
import { lens } from './params/lens';

const scores = new StableBTreeMap<text, float32>(0, 50, 100);

$update;
export async function countScore(address: text): Promise<float64> {
    let score: float64 = 0;

    const requests = params.map(async (param) => {
        const scoreLocal = await param(address);
        score += scoreLocal;
    })

    await Promise.all(requests);

    scores.insert(address.toLowerCase(), score);

    // ic.reply(score);
    return score
}

$update;
export async function countLens(address: text): Promise<float64> {
    const lensresponse = await lens(address);

    return lensresponse;
}

$query
export function getScore(address: text): float32 {
    return match(scores.get(address.toLowerCase()), {
        Some: (result) => result,
        None: () => -1
    });
}

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
    return {
        ...args.response,
        headers: []
    };
}
