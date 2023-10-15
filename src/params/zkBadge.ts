import {
	Opt, ic, match, int16, float64
} from 'azle';
import decodeUtf8 from 'decode-utf8';
import { Buffer } from 'buffer';
import {
	HttpResponse,
	HttpTransformArgs,
	managementCanister,
} from 'azle/canisters/management';


export const zkBadge = async (address: string): Promise<float64> => {
    const query = `
    query getAllMintedBadgesForAccount {
        mintedBadges (where: {owner: "${address}"} 
      ) {
          id
          level
          network
          owner {
            id
          }
          badge {
            tokenId
          }
          issuer
          mintedAt
          transaction {
            id
          }
          rawAttestation {
            id
            extraData
          }
        }
    }`;


    const response = await managementCanister
		.http_request({
			url: 'https://api.sismo.io',
			max_response_bytes: Opt.Some(4_000n),
			method: {
				'post': null,
			},
			headers: [],
			body: Opt.Some(
          Buffer.from(
            JSON.stringify({ query }),
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
	
	console.log(JSON.stringify(response))
	console.log(decodedData);

	return match(response, {
		Ok: (response) => decodedData?.data?.mintedBadges,
		Err: (err) => 0
	});
}
