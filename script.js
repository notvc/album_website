let albumName = ""
let Artist = ""

const searchAlbum = document.getElementById("searchAlbum")
searchAlbum.focus()
const searchArtist = document.getElementById("searchArtist")
searchArtist.focus()
const searchBtn = document.getElementById("search")
const openAlbumDetails = document.getElementById("openalbumdetail")

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

searchBtn.addEventListener("click",
    async () =>{
        await getArtistAlbumDetails()
        await getAlbumPic()
        await getTracklist()
    }
)

const albumDetails = document.getElementById("albumdetails")
openAlbumDetails.addEventListener("click",
    () => {
        if (summary){
            albumDetails.innerHTML = ""
            albumDetails.style.display = "flex"
            // albumDetails.classList.add("open")

            const albumDetailsContent = document.createElement("div")
            albumDetailsContent.className = "albumdetailscontent"
            albumDetails.appendChild(albumDetailsContent)

            const closeAlbumDetails = document.createElement("span")
            closeAlbumDetails.textContent = "✕";
            closeAlbumDetails.id = "closemodal"
            albumDetailsContent.appendChild(closeAlbumDetails)

            const h1AlbumDetail = document.createElement("h1")
            h1AlbumDetail.id = "h1AlbumDetail"
            h1AlbumDetail.textContent = `${albumTitle}`
            albumDetailsContent.appendChild(h1AlbumDetail)

            const pAlbumDetail = document.createElement("p")
            pAlbumDetail.textContent = `${summary.extract}`
            albumDetailsContent.appendChild(pAlbumDetail)

            closeAlbumDetails.addEventListener("click", () => {
                albumDetails.innerHTML = "";
                albumDetails.style.display = "none";
                // albumDetails.classList.remove("open")
            });
        }
        else{
            albumDetails.innerHTML = ""
            albumDetails.style.display = "flex"

            const albumDetailsContent = document.createElement("div")
            albumDetailsContent.className = "albumdetailscontent"
            albumDetails.appendChild(albumDetailsContent)
            
            const closeAlbumDetails = document.createElement("span")
            closeAlbumDetails.textContent = "✕";
            closeAlbumDetails.id = "closemodal"
            albumDetailsContent.appendChild(closeAlbumDetails)
            
            const h1AlbumDetail = document.createElement("h1")
            h1AlbumDetail.id = "h1AlbumDetail"
            h1AlbumDetail.textContent = `NO SUMMARY FOUND`
            albumDetailsContent.appendChild(h1AlbumDetail)

            closeAlbumDetails.addEventListener("click", () => {
                albumDetails.innerHTML = "";
                albumDetails.style.display = "none";
                // albumDetails.classList.remove("open")
            })
        }
    })

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
    await getAlbumReleaseGroupID()
}

let summary = ""
async function getAlbumReleaseGroupID() {
        const res = await fetch(`https://musicbrainz.org/ws/2/release/${albumID}?inc=release-groups&fmt=json`);

        const data = await res.json();

        const releaseGroupID = data["release-group"].id;
        console.log(releaseGroupID);

        await getWikiUrl()
        // MusicBrainz
        //     ↓
        // Find Wikidata URL
        //     ↓
        // https://www.wikidata.org/wiki/Q5104794
        //     ↓
        // Extract Q5104794
        //     ↓
        // Fetch Wikidata JSON
        //     ↓
        // Get Wikipedia title
        //     ↓
        // "Take Care"
        //     ↓
        // Fetch Wikipedia Summary
        //     ↓
        // summary.extract
        //     ↓
        // "Take Care is the second studio album..."
        async function getWikiUrl() {
            const res = await fetch(`https://musicbrainz.org/ws/2/release-group/${releaseGroupID}?inc=url-rels&fmt=json`);

            const data = await res.json();

            console.log(data.relations);

            const wikidataRelation = data.relations.find(rel => rel.type === "wikidata");
            console.log(wikidataRelation);

            if (wikidataRelation) {
                const qid = wikidataRelation.url.resource.split("/").pop();

                const wikidataRes = await fetch(
                    `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`
                );

                const wikidata = await wikidataRes.json();

                const wikiTitle =
                    wikidata.entities[qid].sitelinks.enwiki.title;

                const summaryRes = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
                );

                summary = await summaryRes.json();

                console.log(summary.extract);
            }
        }
    }

let p = ""
async function getTracklist() {
    const res = await fetch(`https://musicbrainz.org/ws/2/release/${albumID}?inc=recordings&fmt=json`)
    const data = await res.json()
    
    const tracks = data.media[0].tracks
    
    const trackList = document.createElement("div")
    trackList.className = "tracklist"
    const h1 = document.createElement("h1")
    h1.classList.add("tracklist-title")
    h1.textContent = "Tracklist"
    trackList.appendChild(h1)
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
