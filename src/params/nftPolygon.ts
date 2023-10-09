import {
	Opt, ic, match, float32
} from 'azle';
import {
	managementCanister,
} from 'azle/canisters/management';
import decodeUtf8 from 'decode-utf8';
import { getBaseLog } from '../lib/helpers/getBaseLog';


export const nftPolygon = async (address: string): Promise<float32> => {
    const response = await managementCanister
		.http_request({
			url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON}/getNFTs?owner=${address}&withMetadata=false&pageSize=1`,
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
    
    const decodedData = response.Ok?.body && JSON.parse(decodeUtf8(response.Ok?.body));

	return match(response, {
		Ok: (response) => (getBaseLog(1.5, decodedData.totalCount) * 0.5),
		Err: (err) => 0
	});
}