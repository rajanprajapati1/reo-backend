export function formatTrack(song) {
    if (!song) return
    // Extract primary artist name
    const artist = song?.artists?.primary?.[0]?.name || "Unknown Artist";

    // Find best download URL (prefer 320kbps)
    const downloadUrl = song?.downloadUrl?.find(d => d?.quality === "320kbps") || song?.downloadUrl?.[0];
    const uri = downloadUrl ? downloadUrl?.url : null;

    // Get best artwork available (500x500 → 150x150 → 50x50)
    let artwork = null;
    const imageQualities = song?.image || [];

    const highRes = imageQualities?.find(img => img?.quality === "500x500");
    if (highRes) {
        artwork = highRes?.url;
    } else {
        const medRes = imageQualities?.find(img => img?.quality === "150x150");
        if (medRes) {
            artwork = medRes?.url;
        } else {
            const lowRes = imageQualities?.find(img => img?.quality === "50x50");
            if (lowRes) {
                artwork = lowRes?.url;
            }
        }
    }

    return {
        id: song?.id,
        title: song?.name,
        artist: artist,
        uri: uri,
        artwork: artwork
    };
}