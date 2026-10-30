// =====================================
// ZOHRAN MUSIC 1.0
// Free Music Search & Player
// =====================================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

const trackName = document.getElementById("trackName");
const artistName = document.getElementById("artistName");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let songs = [];
let currentSong = 0;
let audio = new Audio();
let isPlaying = false;

// =====================================
// SEARCH MUSIC
// =====================================

async function searchMusic(query) {

    if (!query.trim()) return;

    results.innerHTML = "<h3>Searching for music...</h3>";

    try {

        const url =
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=25`;

        const response = await fetch(url);
        const data = await response.json();

        songs = data.results.filter(song => song.previewUrl);

        displaySongs();

    } catch (error) {

        results.innerHTML =
            "<h3>Something went wrong. Please try again.</h3>";

        console.error(error);

    }
}

// =====================================
// DISPLAY SEARCH RESULTS
// =====================================

function displaySongs() {

    results.innerHTML = "";

    if (songs.length === 0) {

        results.innerHTML = "<h3>No songs with previews found.</h3>";
        return;

    }

    songs.forEach((song, index) => {

        const row = document.createElement("div");
        row.className = "result-row";

        const image = document.createElement("img");
        image.src = song.artworkUrl100;
        image.alt = "Album artwork";

        const info = document.createElement("div");
        info.className = "song-info";

        const title = document.createElement("h3");
        title.textContent = song.trackName;

        const artist = document.createElement("p");
        artist.textContent = song.artistName;

        const button = document.createElement("button");
        button.textContent = "▶ Play Preview";

        button.addEventListener("click", () => {
            playSong(index);
        });

        info.appendChild(title);
        info.appendChild(artist);

        row.appendChild(image);
        row.appendChild(info);
        row.appendChild(button);

        results.appendChild(row);

    });

}

// =====================================
// PLAY SONG
// =====================================

function playSong(index) {

    if (!songs[index]) return;

    currentSong = index;

    const song = songs[index];

    audio.pause();

    audio.src = song.previewUrl;

    trackName.textContent = song.trackName;
    artistName.textContent = song.artistName;

    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.textContent = "⏸";
        })
        .catch(error => {
            console.error("Playback error:", error);
            isPlaying = false;
            playBtn.textContent = "▶";
        });

}

// =====================================
// PLAY / PAUSE
// =====================================

playBtn.addEventListener("click", () => {

    if (!audio.src) {

        if (songs.length > 0) {
            playSong(0);
        }

        return;

    }

    if (isPlaying) {

        audio.pause();
        isPlaying = false;
        playBtn.textContent = "▶";

    } else {

        audio.play();
        isPlaying = true;
        playBtn.textContent = "⏸";

    }

});

// =====================================
// NEXT SONG
// =====================================

nextBtn.addEventListener("click", () => {

    if (songs.length === 0) return;

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    playSong(currentSong);

});

// =====================================
// PREVIOUS SONG
// =====================================

prevBtn.addEventListener("click", () => {

    if (songs.length === 0) return;

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    playSong(currentSong);

});

// =====================================
// SEARCH BUTTON
// =====================================

searchBtn.addEventListener("click", () => {

    searchMusic(searchInput.value);

});

searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        searchMusic(searchInput.value);
    }

});

// =====================================
// AUDIO EVENTS
// =====================================

audio.addEventListener("ended", () => {

    isPlaying = false;
    playBtn.textContent = "▶";

});

// =====================================
// WELCOME
// =====================================

console.log("ZOHRAN MUSIC 1.0 is ready!");

searchMusic("The Weeknd");
