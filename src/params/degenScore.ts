import {
	Opt, ic, match, int16, float32
} from 'azle';
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

	return match(response, {
		Ok: (response) => 15,
		Err: (err) => 0
	});
}