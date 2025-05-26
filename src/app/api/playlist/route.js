import { getplaylistData } from '@/app/controllers/MusicController'
import { getFromCache, setInCache } from '@/app/libs/Redis'
import { NextResponse } from 'next/server'

const CACHE_TTL = 200;

export async function POST(req) {
    const { PlaylistId } = await req.json();
    const CACHE_KEY = 'playlist/' + PlaylistId;
    try {
        const cachedData = await getFromCache(CACHE_KEY)
        if (cachedData) {
            return NextResponse.json({ cached: "cacheddata", data: cachedData }, { status: 200 })
        }
        console.log(PlaylistId ,"PlaylistId")
        const freshData = await getplaylistData(PlaylistId);
        console.log(freshData , "freshData")
        await setInCache(CACHE_KEY, freshData, CACHE_TTL)
        return NextResponse.json({ data: freshData }, { status: 200 })
    } catch (error) {
        console.error('Error fetching or caching data:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
