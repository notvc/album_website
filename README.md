<div align="center">

# Album Viewer

A responsive album search page with animated vinyl artwork, live tracklists, cover-art colors, album summaries, and a double-click dark mode.

</div>

## Overview

Album Viewer lets you search for an album and artist, fetches release data from MusicBrainz, loads the front cover from Cover Art Archive, and uses Node Vibrant to pull colors from the artwork. Those colors drive the page background, search controls, album title, vinyl label, tracklist, and album details modal.

The app also follows MusicBrainz release-group links to Wikidata, then uses the linked English Wikipedia page to show an album summary inside a modal.

## Features

- Search by album title and artist name.
- Display the album title from the selected MusicBrainz release.
- Show a spinning vinyl record beside the album jacket.
- Place the cover art in the middle label of the vinyl.
- Load the release tracklist dynamically.
- Show a styled `Tracklist` heading above the song list.
- Open an album details modal with a Wikipedia summary when available.
- Show `NO SUMMARY FOUND` in the modal when no Wikipedia summary is found.
- Generate a page theme from the album cover palette.
- Toggle an album-colored dark mode with a double-click.
- Adapt the vinyl and tracklist layout for desktop, tablet, and mobile screens.
- Use the local `OldHaroldRee Bold.ttf` font for album-style headings.

## Tech Used

- HTML for the app structure.
- CSS for the responsive layout, vinyl animation, palette variables, and dark mode.
- JavaScript for API calls, DOM updates, and applying cover-art colors.
- MusicBrainz API for album and track metadata.
- Cover Art Archive for album artwork.
- Wikidata for finding the linked English Wikipedia article.
- Wikipedia REST API for album summary text.
- Node Vibrant for extracting `Vibrant`, `DarkVibrant`, `LightVibrant`, `Muted`, `LightMuted`, and `DarkMuted` colors.

## File Structure

```text
album_website/
|-- index.html
|-- style.css
|-- script.js
|-- README.md
|-- vinyl-icon.svg
|-- music-note-circle-svgrepo-com.svg
`-- OldHaroldRee Bold.ttf
```

## How To Use

1. Open `index.html` in a browser.
2. Enter an album name in the first search field.
3. Enter an artist name in the second search field.
4. When the album data loads, the cover art, vinyl label, title, tracklist, and theme colors update.
5. Click `Album Details` to open the summary modal.
6. Click the close button in the modal to hide it.
7. Double-click anywhere on the page to toggle dark mode.

## How It Works

`script.js` searches MusicBrainz for a matching release, stores the release ID, then requests the full tracklist. The cover image URL is sent to the album jacket and the vinyl label.

For album details, the app requests the release group from MusicBrainz, looks for a Wikidata relationship, reads the linked English Wikipedia title from Wikidata, and fetches the page summary from Wikipedia. The `Album Details` button opens the `#albumdetails` modal with the summary text, or a `NO SUMMARY FOUND` message if no summary has been loaded.

After the cover loads, Node Vibrant extracts the artwork palette. `applyPaletteColors()` saves those colors as CSS variables on `:root`, and `style.css` uses them to remix the light and dark themes.

## Theme Variables

The palette is stored in these CSS variables:

```css
--palette-vibrant
--palette-dark-vibrant
--palette-light-vibrant
--palette-muted
--palette-light-muted
--palette-dark-muted
```

Light mode and `:root.dark` both read from the same palette, so every album keeps its own visual identity in both themes.

## Notes

This project uses browser `fetch()` requests to public music APIs, so an internet connection is required for album data, cover art, Wikipedia summaries, and the Vibrant CDN script.

Some albums may not have a MusicBrainz Wikidata relationship. In that case, the app still opens the album details modal and shows `NO SUMMARY FOUND`.
