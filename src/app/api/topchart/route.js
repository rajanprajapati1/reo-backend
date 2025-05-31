import { NextResponse } from "next/server";
import { getFromCache, setInCache } from '@/app/libs/Redis'

const CACHE_TTL = 300;

export async function POST(req, res) {
    const { Id } = await req.json()
    try {
        const CACHE_KEY = 'homepage/topchart' + Id;
        const cachedData = await getFromCache(CACHE_KEY)
        if (cachedData) {
            return NextResponse.json({ cached: "cacheddata", data: cachedData }, { status: 200 })
        }
        const response = await fetch(`https://www.jiosaavn.com/api.php?__call=webapi.get&token=${Id}&type=playlist&p=1&n=50&
includeMetaTags=0&ctx=wap6dot0&api_version=4&_format=json&_marker=0`, {
            method: "GET",
            headers: {
                "Referer": "https://www.jiosaavn.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9",
                "Origin": "https://www.jiosaavn.com",
                "Connection": "keep-alive",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch JioSaavn data" });
        }

        const data = await response.json();
        await setInCache(CACHE_KEY, data, CACHE_TTL)
        return NextResponse.json({ data: data }, { status: 200 })

    } catch (error) {
        console.error("Error fetching JioSaavn data:", error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
