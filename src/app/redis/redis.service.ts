import client from "./redis.config";

export async function setCache(
    key: string,
    value: any,
    expiry: number,
): Promise<void> {
    await client.setEx(key, expiry, JSON.stringify(value))
}

export async function getCacheData<T>(key: string): Promise<T | null>  {
    const data = await client.get(key)
    return data ? JSON.parse(data) as T : null
}


export function getCache(key: string) {
    return getCacheData<{ name: string; email: string; password : string }>(key)
}

export async function deleteCache(key: string) {
    return await client.del(key)
}