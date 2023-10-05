import {
	ic, match, Opt, $query, $update,
} from 'azle';
import {
	HttpResponse,
	HttpTransformArgs,
	managementCanister,
} from 'azle/canisters/management';
import { HttpRequest } from '../../types/HttpRequest';
import { decodeResponse } from '../helpers/decodeResponse';

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
	
	const decodedResponse = httpResult.Ok?.body && ic.candidDecode(httpResult.Ok?.body);

	return match(httpResult, {
		Ok: () => decodedResponse,
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
