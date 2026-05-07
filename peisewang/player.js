// 音乐播放器模块

const PLAYLIST_ID = "4898125089";

let audio = new Audio();
let currentIndex = 0;
let playlist = [];
let isPlaying = false;
let progressInterval = null;
let currentLyrics = [];
let activeLyricIdx = -1;

let expandTimer = null;
let customPlayer = null;

export function initPlayer() {
  customPlayer = document.getElementById("customPlayer");
  if (!customPlayer) return;

  const coverEl = document.getElementById("customCover");
  const songTitle = document.getElementById("songTitle");
  const songArtist = document.getElementById("songArtist");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const volumeBtn = document.getElementById("volumeBtn");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeFill = document.getElementById("volumeFill");
  const menuBtn = document.getElementById("menuBtn");
  const playlistPanel = document.getElementById("playlistPanel");
  const playlistItemsDiv = document.getElementById("playlistItems");
  const lyricsWrap = document.getElementById("lyricsWrap");

  function updateVerticalLyric() {
    if (!lyricsWrap) return;
    if (!currentLyrics.length) {
      lyricsWrap.innerHTML = `
                <div class="lyrics-line">🎵 无歌词 (纯音乐)</div>
                <div class="lyrics-line"></div>
                <div class="lyrics-line"></div>
            `;
      activeLyricIdx = -1;
      return;
    }
    const now = audio.currentTime;
    let currIdx = -1;
    for (let i = currentLyrics.length - 1; i >= 0; i--) {
      if (currentLyrics[i].time <= now) {
        currIdx = i;
        break;
      }
    }
    if (currIdx === activeLyricIdx) return;
    activeLyricIdx = currIdx;

    let prevLine = currIdx > 0 ? currentLyrics[currIdx - 1].text : "";
    let currLine = currIdx >= 0 ? currentLyrics[currIdx].text : "♪";
    let nextLine =
      currIdx < currentLyrics.length - 1 ? currentLyrics[currIdx + 1].text : "";

    lyricsWrap.innerHTML = `
            <div class="lyrics-line">${prevLine || ""}</div>
            <div class="lyrics-line active">${currLine || "♪ 间奏 ♪"}</div>
            <div class="lyrics-line">${nextLine || ""}</div>
        `;
  }

  function updateTimeDisplay() {
    if (!customPlayer) return;
    const current = audio.currentTime || 0;
    const duration = audio.duration || 0;
    let percent = duration ? (current / duration) * 100 : 0;
    customPlayer.style.setProperty("--progress", `${percent}%`);
  }

  function parseLrc(lrcText) {
    if (!lrcText) return [];
    const lines = lrcText.split(/\r?\n/);
    const lyricMap = new Map();
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
    lines.forEach((line) => {
      let times = [];
      let match;
      while ((match = timeRegex.exec(line))) {
        const m = parseInt(match[1]),
          s = parseInt(match[2]);
        const ms = match[3]
          ? match[3].length === 2
            ? parseInt(match[3]) * 10
            : parseInt(match[3])
          : 0;
        times.push(m * 60 + s + ms / 1000);
      }
      const text = line.replace(timeRegex, "").trim();
      if (times.length && text) times.forEach((t) => lyricMap.set(t, text));
    });
    return Array.from(lyricMap.entries())
      .map(([time, text]) => ({ time, text }))
      .sort((a, b) => a.time - b.time);
  }

  async function fetchLyrics(lrcUrl) {
    if (!lrcUrl) return [];
    try {
      const { data } = await axios.get(lrcUrl);
      const lrc =
        typeof data === "string"
          ? data
          : data.lrc || data.data?.lrc || data.lyric || "";
      return parseLrc(lrc);
    } catch (e) {
      return [];
    }
  }

  function loadSong(index) {
    if (!playlist.length) return;
    const song = playlist[index];
    if (!song?.url) return;
    const wasPlaying = isPlaying;
    audio.pause();
    audio.src = song.url;
    if (songTitle) songTitle.innerText = song.name;
    if (songArtist) songArtist.innerText = song.artist || "";
    if (coverEl)
      coverEl.style.backgroundImage = song.cover
        ? `url('${song.cover}')`
        : "none";
    audio.load();
    fetchLyrics(song.lrcUrl).then((lyrics) => {
      currentLyrics = lyrics;
      updateVerticalLyric();
    });
    if (wasPlaying) audio.play().catch(() => {});
    updateTimeDisplay();
    renderPlaylist();
    if (coverEl) coverEl.classList.toggle("cover-spin", isPlaying);
  }

  function play() {
    audio.play().then(() => {
      isPlaying = true;
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      startProgress();
      if (coverEl) coverEl.classList.add("cover-spin");
    });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    if (progressInterval) clearInterval(progressInterval);
    if (coverEl) coverEl.classList.remove("cover-spin");
  }

  function togglePlay() {
    isPlaying ? pause() : play();
  }

  function next() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    if (isPlaying) play();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
    if (isPlaying) play();
  }

  function startProgress() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (isPlaying) {
        updateTimeDisplay();
        updateVerticalLyric();
      }
    }, 200);
  }

  function setVolume(v) {
    const vol = Math.min(1, Math.max(0, v));
    audio.volume = vol;
    if (volumeFill) volumeFill.style.width = vol * 100 + "%";
    if (volumeBtn) {
      volumeBtn.innerHTML =
        vol === 0
          ? '<i class="fas fa-volume-off"></i>'
          : vol < 0.5
          ? '<i class="fas fa-volume-down"></i>'
          : '<i class="fas fa-volume-up"></i>';
    }
  }

  function renderPlaylist() {
    if (!playlistItemsDiv) return;
    playlistItemsDiv.innerHTML = "";
    playlist.forEach((song, idx) => {
      const item = document.createElement("div");
      item.classList.add("playlist-item");
      if (idx === currentIndex) item.classList.add("active");
      item.innerHTML = `
                <i class="fas fa-music"></i>
                <span class="song-name">${song.name}</span>
                <span class="song-artist">${
                  song.artist?.slice(0, 12) || ""
                }</span>
            `;
      item.onclick = () => {
        currentIndex = idx;
        loadSong(idx);
        play();
        if (playlistPanel) playlistPanel.style.display = "none";
      };
      playlistItemsDiv.appendChild(item);
    });
  }

  async function loadPlaylist() {
    try {
      const { data } = await axios.get(
        `https://api.injahow.cn/meting/?server=netease&type=playlist&id=${PLAYLIST_ID}`
      );
      playlist = data
        .map((i) => ({
          name: i.name || i.title || "未知歌曲",
          artist: i.artist || i.author || "未知歌手",
          url: i.url,
          cover: i.cover || i.pic,
          lrcUrl: i.lrc,
        }))
        .filter((i) => i.url);
      if (playlist.length) {
        loadSong(0);
        renderPlaylist();
      }
    } catch (e) {
      if (songTitle) songTitle.innerText = "歌单加载失败";
      if (songArtist) songArtist.innerText = "检查网络或ID";
    }
  }

  function bindEvents() {
    if (playPauseBtn) playPauseBtn.onclick = togglePlay;
    if (prevBtn) prevBtn.onclick = prev;
    if (nextBtn) nextBtn.onclick = next;

    if (volumeBtn) {
      volumeBtn.onclick = () => setVolume(audio.volume > 0 ? 0 : 0.7);
    }
    if (volumeSlider) {
      volumeSlider.onclick = (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        setVolume((e.clientX - rect.left) / rect.width);
      };
    }

    if (menuBtn && playlistPanel) {
      menuBtn.onclick = (e) => {
        e.stopPropagation();
        playlistPanel.style.display =
          playlistPanel.style.display === "block" ? "none" : "block";
        if (customPlayer) {
          customPlayer.classList.remove("collapsed");
          customPlayer.classList.add("expanded");
        }
        if (expandTimer) clearTimeout(expandTimer);
      };
    }

    document.onclick = (e) => {
      if (
        playlistPanel &&
        menuBtn &&
        !menuBtn.contains(e.target) &&
        !playlistPanel.contains(e.target)
      ) {
        playlistPanel.style.display = "none";
      }
    };

    audio.onended = next;
    audio.ontimeupdate = updateTimeDisplay;
    setVolume(0.7);
  }

  function bindExpandCollapse() {
    if (!customPlayer) return;

    // 判断是否为移动端
    const isMobile = window.innerWidth <= 860;
    let mobileAutoCloseTimer = null;

    function closeMobilePlayer() {
      customPlayer.classList.remove("expanded");
      customPlayer.classList.add("collapsed");
      if (playlistPanel) playlistPanel.style.display = "none";
      if (mobileAutoCloseTimer) {
        clearTimeout(mobileAutoCloseTimer);
        mobileAutoCloseTimer = null;
      }
    }

    function openMobilePlayer() {
      customPlayer.classList.remove("collapsed");
      customPlayer.classList.add("expanded");
      if (mobileAutoCloseTimer) {
        clearTimeout(mobileAutoCloseTimer);
      }
      mobileAutoCloseTimer = setTimeout(() => {
        closeMobilePlayer();
      }, 5000);
    }

    function resetMobileTimer() {
      if (customPlayer.classList.contains("expanded")) {
        if (mobileAutoCloseTimer) {
          clearTimeout(mobileAutoCloseTimer);
        }
        mobileAutoCloseTimer = setTimeout(() => {
          closeMobilePlayer();
        }, 5000);
      }
    }

    if (isMobile) {
      // 移动端：点击播放器区域切换
      customPlayer.addEventListener("click", (e) => {
        e.stopPropagation();
        if (customPlayer.classList.contains("expanded")) {
          closeMobilePlayer();
        } else {
          openMobilePlayer();
        }
      });

      // 点击控件重置计时器
      const controls = customPlayer.querySelectorAll(
        ".ctrl-btn, .volume-wrap, #menuBtn"
      );
      controls.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          resetMobileTimer();
        });
      });

      // 点击外部关闭
      document.addEventListener("click", (e) => {
        if (
          window.innerWidth <= 860 &&
          customPlayer.classList.contains("expanded")
        ) {
          if (!customPlayer.contains(e.target)) {
            closeMobilePlayer();
          }
        }
      });
    } else {
      // PC端：鼠标悬停
      customPlayer.onmouseenter = () => {
        customPlayer.classList.remove("collapsed");
        customPlayer.classList.add("expanded");
        if (expandTimer) clearTimeout(expandTimer);
      };
      customPlayer.onmouseleave = () => {
        expandTimer = setTimeout(() => {
          customPlayer.classList.remove("expanded");
          customPlayer.classList.add("collapsed");
          if (playlistPanel) playlistPanel.style.display = "none";
        }, 2800);
      };
    }
  }

  loadPlaylist();
  bindEvents();
  bindExpandCollapse();
}

export function updatePlayerHighlightClass() {
  const player = document.getElementById("customPlayer");
  if (!player) return;
  const selectedColorId = document.body.dataset.selectedColorId;
  if (selectedColorId && selectedColorId !== "null") {
    player.classList.add("highlight-mode");
  } else {
    player.classList.remove("highlight-mode");
  }
}
