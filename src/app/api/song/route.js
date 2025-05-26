import { getSongData } from '@/app/controllers/MusicController'
import { formatTrack } from '@/app/helper/SongFormatter';
import { getFromCache, setInCache } from '@/app/libs/Redis'
import { NextResponse } from 'next/server'

const CACHE_TTL = 200;

export async function POST(req) {
    const { SongId } = await req.json();
    const CACHE_KEY = 'song/' + SongId;
    try {
        console.log(SongId, "SongId")
        const cachedData = await getFromCache(CACHE_KEY)
        if (cachedData) {
            return NextResponse.json({ cached: "cacheddata", data: cachedData }, { status: 200 })
        }
        const data = await getSongData(SongId);
        const freshData = formatTrack(data)
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