import {
	Opt, ic, match, int16, float64
} from 'azle';
import decodeUtf8 from 'decode-utf8';
import { Buffer } from 'buffer';
import {
	managementCanister,
} from 'azle/canisters/management';
import { formatEther } from '@ethersproject/units';


export const polygonBalance = async (address: string): Promise<float64> => {

    const response = await managementCanister
		.http_request({
			url: `https://eth-mainnet.g.alchemy.com/v2/${Buffer.from(process.env.ALCHEMY_POLYGON!, 'base64').toString('utf-8')}`,
			max_response_bytes: Opt.Some(4_000n),
			method: {
				'post': null,
			},
			headers: [],
			body: Opt.Some(
          Buffer.from(
            JSON.stringify({
                id: 1,
                jsonrpc: '2.0',
                params: [
                  address,
                  'latest'
                ],
                method: 'eth_getBalance'
            }),
            'utf8'
          )
      ),
			transform: Opt.Some({
				function: [ic.id(), 'xkcdTransform'],
				context: Uint8Array.from([]),
			}),
		})
		.cycles(100_000_000n)
		.call();
	
	const decodedData = response.Ok?.body && JSON.parse(decodeUtf8(response.Ok?.body));

	let score = 0

	switch (true) {
		case +formatEther(decodedData.result || 0) > 500:
			score = 4;
		case +formatEther(decodedData.result || 0) > 100:
			score = 2;
		case +formatEther(decodedData.result || 0) > 50:
			score = 1;
	}
	
	return match(response, {
		Ok: (response) => score,
		Err: (err) => 0
	});
}
