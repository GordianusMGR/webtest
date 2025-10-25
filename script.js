// === 🎵 AUDIO & LYRICS SYNC ===
const audio = document.getElementById('song');
const lyrics = document.querySelectorAll('.lyrics');
const container = document.getElementById('lyricsContainer');
audio.volume = 0.04;

const lyricTimes = [10, 15, 17.5, 21, 25]; // adjust to your timestamps
let currentLine = -1;
let redirecting = false; // ensures redirect runs only once

function showLyric(index) {
  lyrics.forEach(line => line.classList.remove('visible'));
  if (lyrics[index]) lyrics[index].classList.add('visible');
}

function syncLyrics() {
  const t = audio.currentTime;

  // If past last lyric, fade out and redirect
  if (t > lyricTimes[lyricTimes.length - 1] + 2 && !redirecting) {
    redirecting = true;
    audio.pause();
    lyrics.forEach(line => line.classList.remove('visible'));
    currentLine = -1;

    // Fade out lyrics container
    if (container) {
      container.style.transition = "opacity 1.5s ease";
      container.style.opacity = 0;
    }

    // Fade out canvas gradient
    if (canvas) {
      canvas.style.transition = "opacity 1.5s ease";
      canvas.style.opacity = 0;
    }

    // Redirect after fade
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

    return;
  }

  // Show the current lyric
  for (let i = 0; i < lyricTimes.length; i++) {
    const next = lyricTimes[i + 1] || Infinity;
    if (t >= lyricTimes[i] && t < next) {
      if (currentLine !== i) {
        currentLine = i;
        showLyric(i);
      }
      break;
    }
  }
}

// Event listeners for syncing lyrics
audio.addEventListener('timeupdate', syncLyrics);
audio.addEventListener('ended', () => {
  lyrics.forEach(line => line.classList.remove('visible'));
  currentLine = -1;
});

// Autoplay on page load
window.addEventListener('load', async () => {
  try {
    await audio.play();
  } catch(err) {
    console.warn("Autoplay blocked. Please interact with the page.");
  }
});

// === 🌊 SMOOTH RESPONSIVE WAVE GRADIENT ===
const canvas = document.getElementById('gradient');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, time = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    const vh = window.innerHeight;
    height = canvas.height = Math.min(Math.max(vh * 0.5, vh * 0.3), vh * 0.7);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawNaturalWave() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < 3; i++) {
      const amplitude = 10 + i * 5;
      const wavelength = 200 + i * 150;
      const speed = 0.0002 + i * 0.0001;
      const yOffset = height - height * 0.15 - i * (height * 0.03);

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x++) {
        const y = yOffset + Math.sin((x + time * 100 * speed) / wavelength * Math.PI * 2) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `rgba(80,0,0,0.4)`);
      gradient.addColorStop(1, `rgba(0,0,0,1)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    time += 2;
    requestAnimationFrame(drawNaturalWave);
  }

  drawNaturalWave();
}
