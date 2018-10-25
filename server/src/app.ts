import express from 'express';
import * as fs from 'fs';
import * as util from 'util';
import {
    numberOrDie,
    stringOrDie
} from '../../shared/do-or-die';

import {
    writeFileAsync,
    appendFileAsync
} from '../../shared/async-fs';



const conf = {
    port: numberOrDie('PORT'),
    uploadFile: stringOrDie('UPLOADFILE')
};

const app = express();

app.post('/', async (req, res) => {
    let counter = 0;
    let firstWrite = true;
    const ws = fs.createWriteStream(conf.uploadFile);
    console.log('Started /');

    ws.on('drain', () => {
        console.log('drain');
        if (req.isPaused()) {
            req.resume();
        }
    });
    req.on('data', async (data: Buffer) => {
        if (!ws.write(data)) {
            console.log('Wait for drain');
            req.pause();
        }
        counter += data.length;
        const counterMb = (counter / 1024 / 1024) | 0;
        if (counter % 10 === 0) {
            console.log('Wrote ' + counterMb + 'Mb');
        }
    });

    req.once('end', () => {
        ws.end();
        res.sendStatus(201);
    });

    req.on('error', (err) => {
        res.status(500);
        res.send(err.toString());
    });
});

console.log('I am glad to serve you on port :' + conf.port);
app.listen(conf.port);
