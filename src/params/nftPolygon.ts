import {
	Opt, ic, match, float64
} from 'azle';
import {
	managementCanister,
} from 'azle/canisters/management';
import decodeUtf8 from 'decode-utf8';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import { Buffer } from 'buffer';


export const nftPolygon = async (address: string): Promise<float64> => {
    const response = await managementCanister
		.http_request({
			url: `https://eth-mainnet.g.alchemy.com/v2/${Buffer.from(process.env.ALCHEMY_POLYGON!, 'base64').toString('utf-8')}/getNFTs?owner=${address}&withMetadata=false&pageSize=1`,
			max_response_bytes: Opt.Some(4_000n),
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
		.cycles(70_000_000n)
		.call();

	return match(response, {
		Ok: (responseOk) => {
			const decodedData = JSON.parse(decodeUtf8(responseOk.body));
			return (getBaseLog(1.5, decodedData.totalCount) * 0.5)
		},
		Err: (err) => 0
	});
}