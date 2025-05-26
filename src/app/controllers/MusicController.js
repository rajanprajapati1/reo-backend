const BASE_URL = process.env.API_URL1;
const BASE_URL_HOME = process.env.API_URL


export async function homePageData(language = 'english,punjabi,hindi') {
    try {
        const response = await fetch(
            `${BASE_URL_HOME}/modules?language=${language.toString()}`
        );
        const data = await response.json();
        return data?.data;
    } catch (error) {
        console.log(error);
    }
}

// get song data
export async function getSongData(id) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/songs/${id}`
        );
        const data = await response.json();
        if (Array.isArray(data?.data)) {
            return data.data[0] || null;
        } else if (typeof data?.data === 'object' && data?.data !== null) {
            return data.data;
        }
    } catch (error) {
        console.log(error);
    }
}

// get album data
export async function getAlbumData(id) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/albums?id=${id}`
        );
        const data = await response.json();
        return data?.data;
    } catch (error) {
        console.log(error);
    }
}

// get playlist data
export async function getplaylistData(id) {
    try {
        const response = await fetch(
            `${BASE_URL_HOME}/playlists?id=${id}`
        );
        const data = await response.json();
        return data?.data;
    } catch (error) {
        console.log(error);
    }
}


// get artist data
export async function getArtistData(id) {
    try {
        const response = await fetch(
            `${BASE_URL_HOME}/artists?id=${id}`
        );
        const data = await response.json();
        return data?.data;
    } catch (error) {
        console.log(error);
    }
}

// get artist songs
export async function getArtistSongs(id, page) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/artists/${id}/songs?page=${page}&`
        );
        const data = await response.json();
        return data?.data;
    } catch (error) {
        console.log(error);
    }
}

// get artist albums
export async function getArtistAlbums(id, page) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/artists/${id}/albums?page=${page}`
        );
        const data = await response.json();
        return data?.data;
    } catch (error) {
        console.log("album error", error);
    }
}

// get search data
export async function getSearchedData(type = "songs", query) {
    try {
        // search/songs?query
        const response = await fetch(
            `${BASE_URL_HOME}/search/${type}?query=${query}&limit=100`
        );
        const data = await response.json();
        return data?.data?.results
    } catch (error) {
        console.log(error);
    }
}

export async function getSearchAlbum(query) {
    try {
        const response = await fetch(
            `${BASE_URL}/search/albums?query=${query}`
        );
        const data = await response.json();
        return data?.data?.results[0];
    } catch (error) {
        console.log(error);
    }
}

export async function getRealAlbum(id) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/albums?id=${id}`
        );
        const data = await response.json();
        return data?.data;
    } catch (error) {
        console.log(error);
    }
}