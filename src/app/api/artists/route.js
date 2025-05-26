import { getArtistData, getSearchedData } from '@/app/controllers/MusicController'
import { getFromCache, setInCache } from '@/app/libs/Redis'
import { NextResponse } from 'next/server'

const CACHE_TTL = 200;

export async function POST(req) {
    const { ArtistsId } = await req.json();
    const CACHE_KEY = 'artists/' + ArtistsId;
    try {
        const cachedData = await getFromCache(CACHE_KEY)
        if (cachedData) {
            return NextResponse.json({ cached: "cacheddata", data: cachedData }, { status: 200 })
        }
        console.log(ArtistsId, "ArtistsId")
        const freshData = await getArtistData(ArtistsId);
        const songs = await getSearchedData('songs', freshData?.name);
        await setInCache(CACHE_KEY, freshData, CACHE_TTL)
        return NextResponse.json({ data: freshData,  songs }, { status: 200 })
    } catch (error) {
        console.error('Error fetching or caching data:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
