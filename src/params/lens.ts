import {
	Opt, ic, match, int16, float32
} from 'azle';
import { getBaseLog } from '../lib/helpers/getBaseLog';
import decodeUtf8 from 'decode-utf8';
import {
	HttpResponse,
	HttpTransformArgs,
	managementCanister,
} from 'azle/canisters/management';


export const lens = async (address: string): Promise<float32> => {
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
			max_response_bytes: Opt.Some(2_000n),
			method: {
				'post': null,
			},
			headers: [],
			body: Opt.Some(
                Buffer.from(
                    query,
                    'utf-8'
                )
            ),
			transform: Opt.Some({
				function: [ic.id(), 'xkcdTransform'],
				context: Uint8Array.from([]),
			}),
		})
		.cycles(50_000_000n)
		.call();
	
	const decodedData = response.Ok?.body && JSON.parse(decodeUtf8(response.Ok?.body));

	return match(response, {
		Ok: (response) => decodedData?.data?.defaultProfile ? 5 : 0,
		Err: (err) => 0
	});
}