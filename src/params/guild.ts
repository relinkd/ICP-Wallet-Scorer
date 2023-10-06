import {
	$update, $query, Opt, ic, match, Manual
} from 'azle';
import {
	HttpResponse,
	HttpTransformArgs,
	managementCanister,
} from 'azle/canisters/management';


export const guild = async (address: string): Promise<HttpResponse> => {
    const response = await managementCanister
		.http_request({
			url: `https://api.guild.xyz/v1/user/membership/${address}`,
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
		Ok: (response) => response,
		Err: (err) => ic.trap(err)
	});
}