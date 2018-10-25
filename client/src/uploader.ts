import * as net from 'net';
import * as util from 'util';
import * as fs from 'fs';
import {
    connectAsync
} from '../../shared/async-net'

const conf = {
    port: 3000,
    host: '127.0.0.1',
    file: '../../PUBG.tar'
};



(async function main() {

    try {
        const client = await connectAsync(conf.port, conf.host);
        console.log('connected!')



    } catch (err) {
        console.error('Err');
        console.error(err && (err.stack || err.toString()));
    }

})();