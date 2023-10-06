import {
	$update, Opt, ic, match, Manual
} from 'azle';
import {
	HttpResponse,
	HttpTransformArgs,
	managementCanister,
} from 'azle/canisters/management';


export const guild = async (address: string) => {
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

    return response;
}