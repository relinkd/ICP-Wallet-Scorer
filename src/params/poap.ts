import {
	Opt, ic, match, float64
} from 'azle';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import decodeUtf8 from 'decode-utf8';
import {
	managementCanister,
} from 'azle/canisters/management';
import { Buffer } from 'buffer';


export const poap = async (address: string): Promise<float64> => {
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
                    value: Buffer.from(process.env.POAP_API_KEY!!, 'base64').toString('utf-8'),
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

	console.log(response.status)


	return match(response, {
		Ok: (responseOk) => {
			console.log(responseOk.status);
                        console.log(JSON.stringify(responseOk.body));
                        const log = Buffer.from(responseOk.body).toString();
                        console.log(JSON.stringify(log))
                        const decodedData = JSON.parse(log);
			return getBaseLog(1.5, 1)

		},
		Err: (err) => {
			console.log("test")
			console.log(JSON.stringify(err));

			return 0
		}
	});
}
