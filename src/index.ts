import { ic, Manual, match, Opt, Principal, $query, $update, text, float64, StableBTreeMap } from 'azle';
import {
    HttpResponse,
    HttpTransformArgs,
    managementCanister
} from 'azle/canisters/management';
import { evaluateScore } from './lib/helpers/evaluateScore';

import { params } from './params';


const scores = new StableBTreeMap<text, float64>(0, 50, 100);

$update;
export async function countScore(address: text): Promise<Manual<float64>> {
    let score = 0;

    const requests = params.map(async (param) => {
        const scoreLocal = await param(address);
        score += scoreLocal;
    })

    scores.insert(address, score);

    await Promise.all(requests);

    ic.reply(score);
}

$query
export function getScore(address: text): Manual<float64> {
    ic.reply(scores.get(address));
}

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
    return {
        ...args.response,
        headers: []
    };
}
