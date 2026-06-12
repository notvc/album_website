let albumName = ""
let Artist = ""

const searchAlbum = document.getElementById("searchAlbum")
const searchArtist = document.getElementById("searchArtist")

searchAlbum.addEventListener("input",
    async(e) => {
        albumName = e.target.value;
        console.log(albumName);
        await getArtistAlbumDetails()
        await getAlbumPic()
        await getTracklist()
    }
)

searchArtist.addEventListener("input",
    async(e) => {
        Artist = e.target.value;
        console.log(Artist);
        await getArtistAlbumDetails()
        await getAlbumPic()
        await getTracklist()
    }
)

document.body.addEventListener("dblclick", () => {
    document.documentElement.classList.toggle("dark");
});

let albumID = ""
let albumTitle = ""
async function getArtistAlbumDetails() {

    if (!albumName.trim()) return;
    if (!Artist.trim()) return;

    const res = await fetch(`https://musicbrainz.org/ws/2/release?query=artist:${Artist} AND release:"${albumName}"&fmt=json`)
    const data = await res.json()

    const album = data.releases[0];

    albumTitle = album.title
    console.log(albumTitle)
    const albumTitleContainer = document.querySelector(".album-title")
    albumTitleContainer.innerHTML = ""
    const h1 = document.createElement("h1")
    h1.textContent = `${albumTitle}`
    albumTitleContainer.appendChild(h1)

    albumID = album.id
    console.log(albumID)
    
}

async function getTracklist() {
    const res = await fetch(`https://musicbrainz.org/ws/2/release/${albumID}?inc=recordings&fmt=json`)
    const data = await res.json()
    
    const tracks = data.media[0].tracks
    
    const trackList = document.createElement("div")
    trackList.className = "tracklist"
    tracks.forEach(track => {
        console.log(track.number, track.title)
        const p = document.createElement("p")
        p.textContent = `${track.number}. ${track.title}`
        trackList.appendChild(p)
    });
    const trackListContainer = document.querySelector(".track-list-container")
    trackListContainer.innerHTML = ""
    trackListContainer.appendChild(trackList)
}

async function getAlbumPic() {

    if (!albumID.trim()) return;

    const coverUrl = `https://coverartarchive.org/release/${albumID}/front`;

    const vinylLabel = document.querySelector(".vinyl-label")
    const coverImage = document.querySelector(".cover-image")

    coverImage.src = coverUrl
    vinylLabel.style.setProperty("--label-image", `url("${coverUrl}")`)
    console.log(coverUrl)

    if (!window.Vibrant) {
        console.warn("Vibrant is not loaded")
        return
    }

    window.Vibrant.from(coverUrl)
        .getPalette()
        .then(palette => {
            console.log(palette);

            const vibrant = palette.Vibrant?.hex || "#ff4168";
            const darkVibrant = palette.DarkVibrant?.hex || palette.DarkMuted?.hex || "#161616";
            const lightVibrant = palette.LightVibrant?.hex || palette.LightMuted?.hex || "#f8f8f5";
            const muted = palette.Muted?.hex || palette.LightMuted?.hex || "#53a6a0";
            const lightMuted = palette.LightMuted?.hex || lightVibrant;
            const darkMuted = palette.DarkMuted?.hex || darkVibrant;

            console.log("Vibrant:", vibrant);
            console.log("Dark Vibrant:", darkVibrant);
            console.log("Light Vibrant:", lightVibrant);
            console.log("Muted:", muted);
            console.log("Light Muted:", lightMuted);
            console.log("Dark Muted:", darkMuted);

            applyPaletteColors(vibrant, darkVibrant, lightVibrant, muted, lightMuted, darkMuted)
        })
        .catch(error => {
            console.error("Could not create color palette:", error)
        });
}

function applyPaletteColors(vibrant, darkVibrant, lightVibrant, muted, lightMuted, darkMuted) {
    const root = document.documentElement

    root.style.setProperty("--palette-vibrant", vibrant)
    root.style.setProperty("--palette-dark-vibrant", darkVibrant)
    root.style.setProperty("--palette-light-vibrant", lightVibrant)
    root.style.setProperty("--palette-muted", muted)
    root.style.setProperty("--palette-light-muted", lightMuted)
    root.style.setProperty("--palette-dark-muted", darkMuted)
}
