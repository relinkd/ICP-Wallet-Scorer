import { ic, Manual, match, Opt, Principal, $query, $update, text, float64, float32, StableBTreeMap } from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
    managementCanister
} from 'azle/canisters/management';
import { evaluateScore } from './lib/helpers/evaluateScore';

import { params } from './params';


const scores = new StableBTreeMap<text, float32>(0, 50, 100);

$update;
export async function countScore(address: text): Promise<Manual<float64>> {
    let score: float64 = 0;

    const requests = params.map(async (param) => {
        const scoreLocal = await param(address);
        score += scoreLocal;
    })

    await Promise.all(requests);

    scores.insert(address, score);

    ic.reply(score);
}

$query
export function getScore(address: text): float32 {
    return match(scores.get(address), {
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
