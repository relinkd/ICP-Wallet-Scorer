import {
	Opt, ic, match, int16, float64
} from 'azle';
import decodeUtf8 from 'decode-utf8';
import { Buffer } from 'buffer';
import {
	managementCanister,
} from 'azle/canisters/management';
import { getBaseLog } from '../lib/helpers/getBaseLog';

export const tokenEth = async (address: string): Promise<float64> => {

    const response = await managementCanister
		.http_request({
			url: `https://eth-mainnet.g.alchemy.com/v2/${Buffer.from(process.env.ALCHEMY_ETH!, 'base64').toString('utf-8')}`,
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
                method: 'alchemy_getTokenBalances',
                params: [
                  address,
                  'erc20'
                ]
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
	
	return match(response, {
		Ok: (responseOk) => {
			const decodedData = JSON.parse(decodeUtf8(responseOk.body));
			
			return getBaseLog(1.5, decodedData?.result?.tokenBalances?.length)
		},
		Err: (err) => 0
	});
}
