import {
	Opt, ic, match, float32
} from 'azle';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import decodeUtf8 from 'decode-utf8';
import {
	managementCanister,
} from 'azle/canisters/management';
import { Buffer } from 'buffer';


export const poap = async (address: string): Promise<float32> => {
    const response = await managementCanister
		.http_request({
			url: `https://api.poap.tech/actions/scan/${address}`,
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
                    value: process.env.POAP_API_KEY!,
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
	
	
	const decodedData = response.Ok?.body && JSON.parse(decodeUtf8(response.Ok?.body));

	console.log(JSON.stringify(response))

	return match(response, {
		Ok: (response) => getBaseLog(1.5, decodedData.length),
		Err: (err) => 0
	});
}
