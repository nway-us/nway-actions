import  axios from 'axios';

export default class ConsulHelper {
    private config: {
        host: string,
        token: string,
    };

    constructor (config: {host: string, token: string}) {
        this.config = config;
    }

    async DownloadFromConsul(path: string): Promise<string> {
        const request = await axios({
            method: 'get',
            url: `${this.config.host}/${path}`,
            headers: {
                'X-Consul-Token': this.config.token
            }
        });

        let buff = Buffer.from(request.data[0]['Value'], 'base64');

        return buff.toString('ascii');
    }
}
