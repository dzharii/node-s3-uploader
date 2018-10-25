export function printError(err:any) {
    console.error(err && (err.stack || err.toString()));
}