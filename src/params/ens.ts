import {
	Opt, ic, match, float32
} from 'azle';
import {
	managementCanister,
} from 'azle/canisters/management';
import decodeUtf8 from 'decode-utf8';


export const ens = async (address: string): Promise<float32> => {
    const response = await managementCanister
		.http_request({
			url: `https://eth-mainnet.g.alchemy.com/v2/${Buffer.from(process.env.ALCHEMY_ETH!, 'base64').toString('utf-8')}/getNFTs?owner=${address}&contractAddresses[]=0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85&withMetadata=false&pageSize=1`,
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
		Ok: (response) => decodedData.totalCount * 2,
		Err: (err) => 0
	});
}