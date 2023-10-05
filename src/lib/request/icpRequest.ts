import {
	ic, match, Opt, $query, $update,
} from 'azle';
import {
	HttpResponse,
	HttpTransformArgs,
	managementCanister,
} from 'azle/canisters/management';
import { HttpRequest } from '../../types/HttpRequest';

$update;
export const icpRequest = async (request: HttpRequest) => {
	const httpResult = await managementCanister
		.http_request({
			url: request.url,
			max_response_bytes: Opt.Some(2_000n),
			method: {
				[request.method]: null,
			},
			headers: request.headers,
			body: Opt.None,
			transform: Opt.Some({
				function: [ic.id(), 'xkcdTransform'],
				context: Uint8Array.from([]),
			}),
		})
		.cycles(50_000_000n)
		.call();

	return match(httpResult, {
		Ok: (httpResponse) => httpResponse,
		Err: (err) => ic.trap(err),
	});
};

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
	return {
		...args.response,
		headers: [],
	};
}
