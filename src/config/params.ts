import { getBaseLog } from "../lib/helpers/getBaseLog";

const params = {
    guild: (param: number) => {
        return getBaseLog(1.5, param);
    }
};