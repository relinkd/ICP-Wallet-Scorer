import {
	update,
    text,
    ic,
    None,
    Principal,
    Some,
} from 'azle';
import {
	managementCanister,
} from 'azle/canisters/management';

export const guild = async (address: text) => {
    const response = await ic.call(managementCanister.http_request, {
        args: [
            {
                url: `https://api.guild.xyz/v1/user/membership/${address}`,
                max_response_bytes: Some(2_000n),
                method: {
                  'get': null
                },
                headers: [],
                body: None,
                transform: Some({
                    function: [ic.id(), 'xkcdTransform'] as [
                        Principal,
                        string
                    ],
                    context: Uint8Array.from([])
                })
            }
        ],
        cycles: 50_000_000n
    });
    
    return response;
};

