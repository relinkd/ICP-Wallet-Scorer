import { icpRequest } from '../lib/request/icpRequest';
import {
	$update,
} from 'azle';

$update;
export const guild = async (address: string) => {
    const response = await icpRequest({
        method: 'get',
        url: `https://api.guild.xyz/v1/user/membership/${address}`,
        headers: [],
        body: null,
    })

    return response;
}