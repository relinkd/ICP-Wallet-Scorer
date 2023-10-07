import {
	Opt, ic, match, int16, float32
} from 'azle';
import decodeUtf8 from 'decode-utf8';
import {
	managementCanister,
} from 'azle/canisters/management';


export const degenScore = async (address: string): Promise<float32> => {
    const response = await managementCanister
		.http_request({
			url: `https://beacon.degenscore.com/v1/beacon/${address}`,
			max_response_bytes: Opt.Some(2_000n),
			method: {
				'get': null,
			},
			headers: [],
			body: Opt.None,
			transform: Opt.Some({
				function: [ic.id(), 'xkcdTransform'],
				context: Uint8Array.from([]),
			}),
		})
		.cycles(50_000_000n)
		.call();
    
    const decodedData = response.Ok?.body && JSON.parse(decodeUtf8(response.Ok?.body));

	return match(response, {
		Ok: (response) => decodedData.code !== 5 ? 15 : 0,
		Err: (err) => 0
	});
}