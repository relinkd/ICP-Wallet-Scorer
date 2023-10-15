import {
	Opt, ic, match, float64
} from 'azle';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import decodeUtf8 from 'decode-utf8';
import {
	managementCanister,
} from 'azle/canisters/management';
import { Buffer } from 'buffer';


export const ethCC = async (address: string): Promise<float64> => {
    const response = await managementCanister
		.http_request({
			url: `https://api.poap.tech/actions/scan/${address}/141910`,
			max_response_bytes: Opt.Some(4_000n),
			method: {
				'get': null,
			},
			headers: [
                {
                    name: 'accept',
                    value: 'application/json',
                },
                {
                    name: 'x-api-key',
                    value: Buffer.from(process.env.POAP_API_KEY!, 'base64').toString('utf-8'),
                }
            ],
			body: Opt.None,
			transform: Opt.Some({
				function: [ic.id(), 'xkcdTransform'],
				context: Uint8Array.from([]),
			}),
		})
		.cycles(50_000_000n)
		.call();

	return match(response, {
		Ok: (response) => 2,
		Err: (err) => 0
	});
}
