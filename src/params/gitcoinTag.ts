import {
	Opt, ic, match, float64
} from 'azle';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import decodeUtf8 from 'decode-utf8';
import {
	managementCanister,
} from 'azle/canisters/management';
import { Buffer } from 'buffer';


export const gitcoinTag = async (address: string): Promise<float64> => {
    const response = await managementCanister
		.http_request({
			url: `https://api.scorer.gitcoin.co/registry/stamps/${address}?include_metadata=false`,
			max_response_bytes: Opt.Some(4_000n),
			method: {
				'get': null,
			},
			headers: [
                {
                    name: 'X-API-KEY',
                    value: Buffer.from(process.env.GITCOIN_KEY!, 'base64').toString('utf-8'),
                }
            ],
			body: Opt.None,
			transform: Opt.Some({
				function: [ic.id(), 'xkcdTransform'],
				context: Uint8Array.from([]),
			}),
		})
		.cycles(70_000_000n)
		.call();

	return match(response, {
		Ok: (responseOk) => {
			const decodedData = JSON.parse(decodeUtf8(responseOk.body));

			return decodedData?.items?.length * 0.5
		},
		Err: (err) => 0
	});
}
