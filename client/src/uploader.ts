import * as path from 'path';
import * as fs from 'fs';
import { Socket } from 'net';
import {
    connectAsync
} from '../../shared/async-net'

import {
    statsAsync
} from '../../shared/async-fs';

import {printError} from '../../shared/log';

const conf = {
    port: 3000,
    host: '127.0.0.1',
    file: path.resolve(__dirname, '../../../PUBG.tar'),
    readBlockSize: 100 * 1024 * 1024
};


(async function main() {
    let client: Socket = null;
    try {
        const client = await connectAsync(conf.port, conf.host);
        const stream = fs.createReadStream(conf.file);


        console.log('connected!')
        client.on('data', data => {
            console.log('Received ' + data);
        });

        client.on('drain', () => {
            console.log('drained');
            if (stream.isPaused) {
                stream.resume();
            }
        });

        const { host, port, file } = conf;
        const requestHeader = await makePostHeaderForFile(file, host, port);
        client.write(requestHeader);
        stream.on('data', data => {
            client.write(data);
            stream.pause();
        });
        stream.once('end', data => {
            console.log('End of stream');
        });
        stream.read(conf.readBlockSize);
        //client.end();

    } catch (err) {
        console.log("Oh!");
        printError(err);
        if (client) {
            client.end();
        }
    }
})();

async function makePostHeaderForFile(filePath: string, host: string, port: number): Promise<string> {
    const fileStats = await statsAsync(filePath);
    const fileSize = fileStats.size;
    return (
`POST / HTTP/1.1
Host: ${host}:${port}
Content-Length: ${fileSize}
Origin: http://localhost:3000
Content-Type: application/octet-stream

`);
}