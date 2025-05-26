import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function setInCache(key, value, ttl) {
  const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value)
  if (ttl) {
    await redis.setex(key, ttl, stringifiedValue)
  } else {
    await redis.set(key, stringifiedValue)
  }
}

export async function getFromCache(key) {
  const data = await redis.get(key)

  if (!data) return null

  try {
    // Try parsing only if it's a string
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch (e) {
    console.error(`Failed to parse cached data for key "${key}"`, e)
    return data // return raw if not JSON
  }
}


export async function deleteFromCache(key) {
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error)
    return false
  }
}

export async function clearCache() {
  try {
    let cursor = '0'
    do {
      const reply = await redis.scan(cursor, { match: '*', count: 100 })
      cursor = reply.cursor
      const keys = reply.keys
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } while (cursor !== '0')
    return true
  } catch (error) {
    console.error('Redis CLEAR error:', error)
    return false
  }
}


export async function getAllKeys(pattern = '*') {
  try {
    const keys = []
    let cursor = '0'
    do {
      const reply = await redis.scan(cursor, { match: pattern, count: 100 })
      cursor = reply.cursor
      keys.push(...reply.keys)
    } while (cursor !== '0')

    return keys
  } catch (error) {
    console.error('Redis GET ALL KEYS error:', error)
    return []
  }
}
export default redis