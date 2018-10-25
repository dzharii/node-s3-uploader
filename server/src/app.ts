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
    console.log('Started /');
    req.on('data', async (data: Buffer) => {
        req.pause();
        if (firstWrite) {
            await writeFileAsync(conf.uploadFile, "");
            firstWrite = false;
            console.log('Created new file');
        }
        await appendFileAsync(conf.uploadFile, data);
        counter += data.length;
        const counterMb = (counter / 1024 / 1024) | 0;
        if (counter % 10 === 0) {
            console.log('Wrote ' + counterMb + 'Mb');
        }
        req.resume();
    });

    req.once('end', () => {
        res.sendStatus(201);
    });

    req.on('error', (err) => {
        res.status(500);
        res.send(err.toString());
    });
});

console.log('I am glad to serve you on port :' + conf.port);
app.listen(conf.port);
