import express from 'express';
import * as fs from 'fs';

function numberOrDie(key: string): number {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`process.env.${key} (number) is undefined.`);
    }
    return +(process.env[key]);
}

function stringOrDie(key: string): string {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`process.env.${key} (string) is undefined.`);
    }
    return process.env[key];
}

const conf = {
    port: numberOrDie('PORT'),
    uploadFile: stringOrDie('UPLOADFILE')
};

const app = express();

app.post('/', async (req, res) => {
    try {
        req.pipe(fs.createWriteStream(conf.uploadFile));
        const waitNext = new Promise((resolve, reject) => {
            req.on('end', resolve);
            req.on('error', reject);
        });
        await waitNext;
        res.sendStatus(201);

    } catch (err) {
        res.status(500);
        res.send(err.toString());
    }
});

console.log('I am glad to serve you on port :' + conf.port);
app.listen(conf.port);
