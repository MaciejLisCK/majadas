const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize();
addEventListener('resize', resize);

/* ── CONTROLS ────────────────────────────────────── */
const TOD_LABELS = { dawn:'🌅 Świt', day:'☀️ Dzień', dusk:'🌆 Zmierzch', night:'🌙 Noc' };
function setTOD(t) {
  tod = t;
  document.getElementById('timeLabel').textContent = TOD_LABELS[t];
  document.querySelectorAll('.btn').forEach(b => { if (b.id.startsWith('btn-') && ['dawn','day','dusk','night'].includes(b.id.slice(4))) b.classList.remove('active'); });
  document.getElementById('btn-'+t).classList.add('active');
  if (t === 'night') cubes = [];
}
function setSeason(s) {
  season = s;
  document.querySelectorAll('.btn').forEach(b => { if (['btn-spring','btn-summer','btn-autumn','btn-winter'].includes(b.id)) b.classList.remove('active'); });
  document.getElementById('btn-'+s).classList.add('active');
}
function updateHUD() {
  document.getElementById('hearts').textContent = '❤️'.repeat(Math.max(0,lives)) + '🖤'.repeat(Math.max(0,10-lives));
  document.getElementById('score').textContent = score;
}
function addFx(x, y, txt, col) { effects.push({x,y,txt,col,life:0,max:58}); }

/* ── MAIN LOOP ───────────────────────────────────── */
function loop(ts) {
  requestAnimationFrame(loop);
  frame++;
  const W=canvas.width, H=canvas.height, gy=H*0.72;
  const sleeping=tod==='night';

  drawBg();
  drawJungle();

  if (!sleeping) {
    hamster.x+=hamster.dir*hamster.speed;
    if (hamster.x>W*0.52||hamster.x<W*0.08) hamster.dir*=-1;
    elephant.x+=elephant.dir*elephant.speed;
    if (elephant.x>W*0.88||elephant.x<W*0.44) elephant.dir*=-1;
    drawElephant(elephant.x,gy-31,false,elephant.dir);
    drawHamster(hamster.x,gy-16,false,hamster.dir);
  } else {
    drawElephant(W*0.64,gy-31,true,1);
    drawHamster(W*0.23,gy-16,true,1);
  }

  if (!sleeping && !gameOver && !gameWon) {
    if (ts-lastSpawn>spawnDelay) {
      cubes.push({
        x:100+Math.random()*(W-200), y:-30,
        vy:2.2+Math.random()*1.4,
        rot:Math.random()*Math.PI*2, spawn:Date.now(),
        life:4000+Math.random()*2000, id:Math.random(),
        landed:false, landTime:0
      });
      lastSpawn=ts;
      spawnDelay=Math.max(1000,spawnDelay-18);
    }

    if (ts - lastBallSpawn > 9000 + Math.random()*3000) {
      balls.push({
        x: 120 + Math.random()*(W-240),
        y: H*0.1 + Math.random()*H*0.48,
        spawn: Date.now(),
        life: 3500 + Math.random()*2000,
        id: Math.random()
      });
      lastBallSpawn = ts;
    }
  }

  const now=Date.now();

  cubes=cubes.filter(c=>{
    if (!c.landed) {
      c.vy+=GRAVITY;
      c.y+=c.vy;
      c.rot+=0.07;
      if (c.y>=gy-22) {
        c.y=gy-22; c.landed=true; c.landTime=Date.now();
      }
    } else {
      const landAge=now-c.landTime;
      if (landAge>c.life) {
        if (!gameOver && !gameWon && !sleeping) {
          lives=Math.max(0,lives-1); updateHUD();
          addFx(c.x,c.y,'💔','#FF5555');
          sfxLoseLife();
          if (lives<=0) { gameOver=true; sfxGameOver(); }
        }
        return false;
      }
      const hDist=Math.abs(c.x-hamster.x);
      const eDist=Math.abs(c.x-elephant.x);
      if (hDist<50||eDist<75) {
        addFx(c.x,c.y,'+1 ⭐','#FFD700');
        score++; updateHUD(); sfxCollect();
        if (score>=WIN_SCORE) { gameWon=true; sfxWin(); }
        return false;
      }
    }
    drawCube(c); return true;
  });

  balls=balls.filter(b=>{
    const age=now-b.spawn;
    if (age>b.life) return false;
    drawBall(b); return true;
  });

  drawEffects();

  const fog=TOD[tod].fog;
  if (fog) { ctx.fillStyle=fog; ctx.fillRect(0,0,W,H); }

  if (gameOver) drawGameOver();
  else if (gameWon) drawWin();
}

/* ── INPUT ───────────────────────────────────────── */
canvas.addEventListener('click',e=>{
  ensureAudio();

  if (gameOver || gameWon) {
    lives=10; score=0; cubes=[]; balls=[]; spawnDelay=2500; lastSpawn=0; lastBallSpawn=0;
    gameOver=false; gameWon=false; updateHUD(); return;
  }

  const {left,top}=canvas.getBoundingClientRect();
  const mx=e.clientX-left, my=e.clientY-top;

  for (let i=balls.length-1;i>=0;i--) {
    if (Math.hypot(mx-balls[i].x,my-balls[i].y)<26) {
      const bx=balls[i].x, by=balls[i].y;
      balls.splice(i,1);
      lives=Math.max(0,lives-1); updateHUD();
      addFx(bx,by,'💔 -1 życie','#FF3333');
      sfxLoseLife();
      if (lives<=0) { gameOver=true; sfxGameOver(); }
      return;
    }
  }

  for (let i=cubes.length-1;i>=0;i--) {
    if (Math.hypot(mx-cubes[i].x,my-cubes[i].y)<30) {
      addFx(cubes[i].x,cubes[i].y,'+1 ⭐','#FFD700');
      cubes.splice(i,1); score++; updateHUD();
      sfxCollect();
      if (score >= WIN_SCORE) { gameWon=true; sfxWin(); }
      break;
    }
  }
});

// init
elephant.x = canvas.width * 0.66;
updateHUD();
requestAnimationFrame(loop);
