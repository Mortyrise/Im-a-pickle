import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

const getRedisClient = async (): Promise<RedisClientType | null> => {
    if (!client) {
        try {
            client = createClient({
                url: 'redis://redis:6379',
                socket: {
                    reconnectStrategy: false
                }
            });

            client.on('error', (err) => {
                console.error(`Redis connection error: ${err}`);
                client = null;
            });

            await client.connect();
        } catch (error) {
            console.error(`Failed to connect to Redis: ${error}`);
            client = null;
        }
    }
    return client;
}

export const getRedisKey = async (key: string) => {
    let result = null;
    if(process.env.IGNORE_REDIS === 'true') {
        return result;
    }

    try {
        const redisClient = await getRedisClient();
        if (redisClient) {
            result = await redisClient.get(key);
        }
    } catch (error) {
        console.error(`Error while trying to get key from Redis: ${error}`);
    }
    return result;
}

export const setRedisKey = async (key: string, value: any, ttl?: number) => {
    let result = null;
    if(process.env.IGNORE_REDIS === 'true') {
        return result;
    }
    
    if (value) {
        try {
            const redisClient = await getRedisClient();
            if (redisClient) {
                if (ttl) {
                    result = await redisClient.setEx(key, ttl, value);
                } else {
                    result = await redisClient.set(key, value)
                }
            }
        } catch (error) {
            console.error(`Error while trying to set key in Redis. Key: ${key}. Error: ${error}`);
        }
    }
    return result;
}

export const deleteRedisKey = async (key: string) => {
    let result = null;
    if(process.env.IGNORE_REDIS === 'true') {
        return result;
    }

    try {
        const redisClient = await getRedisClient();
        if (redisClient) {
            result = await redisClient.del(key);
        }
    } catch (error) {
        console.error(`Error while trying to delete key from Redis. key: ${key}. Error ${error}`);
    }
    return result;
}