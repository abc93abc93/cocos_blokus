import GameConfig from '../../configs/GameConfig';

class ApiServer {
    #config

    /**
     *
     * @param {SkwTokenApiConfig} config
     */
    constructor(config) {
        this.#config = config;

    }

    /** 驗證回傳code */
    checkReturnCode(resData) {
        if (!resData.code || resData.code !== '0001') {
            console.log(`ApiServer error_code not 0001, ${JSON.stringify({ errCode: resData.code, msg: resData.msg })}`);
            return false
        }
        return true
    }

    /**
     *
     * @param {string} uri
     * @param {"get", "post"} method
     * @param data
     * @param params
     * @param headers
     * @return {Promise<*>}
     */
    async callApi(uri, method = 'get', data = null, params = null, headers = null) {
        if (typeof method !== 'string' || !['get', 'post'].includes(method.toLowerCase())) {
            method = 'get';
        } else {
            method = method.toLowerCase();
        }
        const requestHeaders = {
            "Content-Type": "application/json",
            "Platform": this.#config.Platform,
            "Secret": this.#config.Secret,
            ...headers,
        }


        const sendRequest = {
            method: method,
            headers: requestHeaders,
        }
        if (method === "post") sendRequest["body"] =  JSON.stringify(data);

        try {
            const response = await fetch(`${this.#config.apiUrl}/${uri}`, sendRequest).then(res => res.json()).catch(e => console.log(e));
            console.log("response", response);

            if (this.checkReturnCode(response)) {
                return response.data
            } else {
                return false
            }
        } catch (error) {
            console.log("ApiServer callApi error", error);
            return false
        }

    }

}
export default {
    apiServer: new ApiServer(GameConfig.apiServer),
    ApiServer,
};

