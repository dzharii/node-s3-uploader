import * as net from 'net';
import * as util from 'util';
import * as fs from 'fs';

export async function connectAsync(port: number, host: string): Promise<net.Socket> {
    const client = new net.Socket();
    const connected = new Promise<net.Socket>((resolve, reject) => {
        client.connect(port, host, () => {
            resolve(client);
        });
        client.once('error', err => reject(err));
    });
    return connected;
}