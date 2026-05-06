/* ── STATE ───────────────────────────────────────── */
let lives = 10, score = 0, tod = 'day', season = 'summer';
let gameOver = false, gameWon = false, frame = 0;
let cubes = [], balls = [], effects = [], lastSpawn = 0, spawnDelay = 2500;
let lastBallSpawn = 0;
let hamster = { x: 150, dir: 1, speed: 1.3 };
let elephant = { x: 0,   dir: 1, speed: 0.75 };

const WIN_SCORE = 40;

/* ── CONFIG ──────────────────────────────────────── */
const TOD = {
  dawn:  { sky: ['#1a1540','#FF6B9D','#FFB347'], amb: 0.68, fog: 'rgba(255,90,40,0.10)' },
  day:   { sky: ['#1E90FF','#87CEEB','#C8EDFF'], amb: 1.00, fog: null },
  dusk:  { sky: ['#6B0A00','#DD3A00','#FF7043'], amb: 0.50, fog: 'rgba(90,0,0,0.15)' },
  night: { sky: ['#010210','#08082a','#0d0d3e'], amb: 0.22, fog: 'rgba(0,0,50,0.45)' }
};
const SEASONS = {
  spring: { leaves:['#A8E063','#56C22A','#90EE90'], trunk:'#8B5E3C', gTop:'#5DBE4A', gBot:'#3D9A2F' },
  summer: { leaves:['#228B22','#1B7A1B','#2E8B57'], trunk:'#6B3A2A', gTop:'#4CAF50', gBot:'#2E7D32' },
  autumn: { leaves:['#D2691E','#FF8C00','#A0522D'], trunk:'#8B4513', gTop:'#8B7355', gBot:'#6B5B3E' },
  winter: { leaves:['#9BB8CC','#7A9EB5','#B0C8D8'], trunk:'#696969', gTop:'#E0EEF5', gBot:'#B8D4E0' }
};
