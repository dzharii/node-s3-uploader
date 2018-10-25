export function numberOrDie(key: string): number {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`process.env.${key} (number) is undefined.`);
    }
    return +(process.env[key]);
}

export function stringOrDie(key: string): string {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`process.env.${key} (string) is undefined.`);
    }
    return process.env[key];
}
