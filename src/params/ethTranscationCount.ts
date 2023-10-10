import {
	Opt, ic, match, int16, float32
} from 'azle';
import decodeUtf8 from 'decode-utf8';
import { Buffer } from 'buffer';
import {
	managementCanister,
} from 'azle/canisters/management';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import { formatEther } from '@ethersproject/units';

export const ethTransactionCount = async (address: string): Promise<float32> => {

    const response = await managementCanister
		.http_request({
			url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ETH}`,
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
                params: [address, 'latest'],
                method: 'eth_getTransactionCount'
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
	
	return match(response, {
		Ok: (response) => getBaseLog(1.5, parseInt(decodedData?.result, 16)),
		Err: (err) => 0
	});
}
