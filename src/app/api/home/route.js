import { homePageData } from '@/app/controllers/MusicController'
import { getFromCache, setInCache } from '@/app/libs/Redis'
import { NextResponse } from 'next/server'

const CACHE_KEY = 'homepage';
const CACHE_TTL = 300;

export async function GET() {
    try {
        const cachedData = await getFromCache(CACHE_KEY)
        if (cachedData) {
            return NextResponse.json({ cached:"cacheddata" ,data: cachedData  }, { status: 200 })
        }
        const freshData = await homePageData()
        await setInCache(CACHE_KEY, freshData, CACHE_TTL)
        return NextResponse.json({ data: freshData }, { status: 200 })
    } catch (error) {
        console.error('Error fetching or caching homepage data:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}