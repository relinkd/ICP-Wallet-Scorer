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


export const lens = async (address: string): Promise<float64> => {
    const query =  `query DefaultProfile {
        defaultProfile(request: { ethereumAddress: "${address}"}) {
          id
          name
          bio
          isDefault
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          handle
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              chainId
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
          }
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              chainId
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
          }
          ownedBy
          dispatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              contractAddress
              amount {
                asset {
                  name
                  symbol
                  decimals
                  address
                }
                value
              }
              recipient
            }
            ... on ProfileFollowModuleSettings {
             type
            }
            ... on RevertFollowModuleSettings {
             type
            }
          }
        }
      }`;


    const response = await managementCanister
		.http_request({
			url: `https://api.lens.dev`,
			max_response_bytes: Opt.Some(4_000n),
			method: {
				'post': null,
			},
			headers: [
        {
          name: 'Content-Type',
          value: 'application/json',
      },
      ],
			body: Opt.Some(
          Buffer.from(
            JSON.stringify({ query }),
            'utf-8'
          )
      ),
			transform: Opt.None,
		})
		.cycles(100_000_000n)
		.call();
	console.log(response)

	return match(response, {
		Ok: (responseOk) => {
			console.log(responseOk.status);
 			console.log(JSON.stringify(responseOk.body));
 		 	const log = Buffer.from(responseOk.body).toString();
			console.log(JSON.stringify(log))
 			const decodedData = JSON.parse(log);

			return decodedData?.data?.defaultProfile ? 5 : 0
  		},
		Err: (err) => 0
	});
}
