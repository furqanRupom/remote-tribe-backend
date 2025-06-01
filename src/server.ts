import { createServer } from 'http'
import app from './app'
import client from './app/redis/redis.config'
import { config } from './app/config'

const main = async () => {
    await client.connect()
    console.log('Redis client connected successfully.')
    const server = createServer(app)

    server.listen(config.port, () => {
        console.log(`Server is running on HTTP, port ${config.port}`)
    })
}

main().catch(console.error)