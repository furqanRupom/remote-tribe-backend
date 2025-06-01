import { createClient, RedisClientType } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const client: RedisClientType = createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    password: process.env.REDIS_PASSWORD || undefined,
})

client.on('connect', () => {
    console.log('Connected to Redis')
})

client.on('error', (err: Error) => {
    console.error('Redis connection error:', err)
})

export default client