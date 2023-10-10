import {
	Opt, ic, match, float32
} from 'azle';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import decodeUtf8 from 'decode-utf8';
import {
	managementCanister,
} from 'azle/canisters/management';


export const gitcoinTag = async (address: string): Promise<float32> => {
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
                    value: process.env.GITCOIN_KEY!,
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

	console.log(JSON.stringify(response), JSON.stringify({headers: [
        {
            name: 'X-API-KEY',
            value: process.env.GITCOIN_KEY!,
        }
    ]}))

	return match(response, {
		Ok: (response) => decodedData?.items?.length * 0.5,
		Err: (err) => 0
	});
}
