const audio = document.getElementById("audio");
const lyricsContainer = document.getElementById("lyrics-container");

// Define the lyrics and when they should appear (in seconds)
const lyrics = [
  { time: 0.2, text: "Woah" },
  { time: 1.6, text: "Maison Margiela" },
  { time: 3.2, text: "All I see is: " },
  { time: 5.0, text: "Rain on my umbrella" },
  { time: 6.5, text: "Them 808's like thunder" },
  { time: 8.0, text: "Yeah" }
];
setTimeout(() => {
  const img = document.getElementById('lyricImage');
  img.classList.remove('hidden');
  img.classList.add('visible');
}, 3500); // Show at 6 seconds (6000 ms)


// Function to show lyric
function showLyric(text) {
  const div = document.createElement("div");
  div.classList.add("lyrics");
  div.innerText = text;
  lyricsContainer.appendChild(div);

  // Trigger fade-in
  setTimeout(() => {
    div.classList.add("visible");
  }, 50);
}

// Sync lyrics to audio playback
audio.addEventListener("play", () => {
  lyrics.forEach((line) => {
    setTimeout(() => {
      showLyric(line.text);
    }, line.time * 1000);
  });
});
audio.volume = 0.07;
// Auto-play audio when page loads
window.onload = () => {
  audio.play();
};
