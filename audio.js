/* ── AUDIO ───────────────────────────────────────── */
let audioCtx = null;
let musicNextTime = 0;
let melodyIdx = 0;
let musicTimer = null;

const MELODY = [
  [523,0.25],[659,0.25],[784,0.25],[880,0.5],
  [784,0.25],[659,0.25],[523,0.25],[392,0.5],
  [440,0.25],[523,0.25],[659,0.5],[523,0.25],
  [392,0.25],[440,0.25],[523,0.75]
];

function ensureAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  musicNextTime = audioCtx.currentTime + 0.1;
  scheduleMusicBatch();
}

function scheduleMusicBatch() {
  if (!audioCtx) return;
  const ahead = 2.5;
  while (musicNextTime < audioCtx.currentTime + ahead) {
    const [freq, dur] = MELODY[melodyIdx % MELODY.length];
    playTone(freq, musicNextTime, dur * 0.82, 0.06, 'triangle');
    if (melodyIdx % 4 === 0) playTone(freq / 2, musicNextTime, dur * 0.5, 0.04, 'sine');
    musicNextTime += dur;
    melodyIdx++;
  }
  musicTimer = setTimeout(scheduleMusicBatch, 600);
}

function playTone(freq, start, dur, vol, type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function sfxCollect() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(880, t, 0.1, 0.22, 'sine');
  playTone(1108, t + 0.07, 0.12, 0.18, 'sine');
  playTone(1318, t + 0.14, 0.1, 0.14, 'sine');
}

function sfxLoseLife() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(300, t, 0.12, 0.28, 'sawtooth');
  playTone(200, t + 0.1, 0.2, 0.22, 'sawtooth');
  playTone(150, t + 0.22, 0.2, 0.18, 'sawtooth');
}

function sfxGameOver() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  [440,330,220,165].forEach((f,i) => playTone(f, t + i*0.22, 0.28, 0.2, 'sawtooth'));
}

function sfxWin() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  [523,659,784,1047,1319,1047,784,659,523].forEach((f,i) => {
    playTone(f, t + i*0.14, 0.18, 0.18, 'triangle');
  });
}
