/* ── COLOR HELPERS ───────────────────────────────── */
function dimHex(hex, b) {
  let r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), bl=parseInt(hex.slice(5,7),16);
  return `rgb(${~~(r*b)},${~~(g*b)},${~~(bl*b)})`;
}
function dimRGB(r,g,b,a,bright) { return `rgba(${~~(r*bright)},${~~(g*bright)},${~~(b*bright)},${a})`; }

/* ── DRAW BACKGROUND ─────────────────────────────── */
function drawBg() {
  const W=canvas.width, H=canvas.height, cfg=TOD[tod], sc=SEASONS[season];
  const gH = H*0.72;

  const sg = ctx.createLinearGradient(0,0,0,gH);
  cfg.sky.forEach((c,i) => sg.addColorStop(i/(cfg.sky.length-1), c));
  ctx.fillStyle = sg; ctx.fillRect(0,0,W,gH);

  if (tod==='night'||tod==='dusk') {
    const sa = tod==='night'?0.88:0.38;
    for (let i=0;i<130;i++) {
      const sx=(Math.sin(i*127.1+3)*0.5+0.5)*W;
      const sy=(Math.cos(i*89.7+1)*0.5+0.5)*H*0.52;
      const sr=(Math.sin(i*53)*0.5+0.5)*1.5+0.3;
      const tw=tod==='night'?(Math.sin(frame*0.04+i)*0.4+0.6):1;
      ctx.fillStyle=`rgba(255,255,240,${sa*tw})`;
      ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fill();
    }
  }

  const SUNS = {
    dawn: {x:0.12,y:0.26,r:28,c:'#FFB347',g:'#FF6B9D'},
    day:  {x:0.76,y:0.09,r:40,c:'#FFE066',g:'#FFD700'},
    dusk: {x:0.89,y:0.34,r:36,c:'#FF6B35',g:'#FF4500'}
  };
  if (tod!=='night') {
    const sp=SUNS[tod];
    ctx.save();
    ctx.shadowBlur=45; ctx.shadowColor=sp.g;
    ctx.fillStyle=sp.c;
    ctx.beginPath(); ctx.arc(W*sp.x,H*sp.y,sp.r,0,Math.PI*2); ctx.fill();
    if (tod==='day') {
      ctx.strokeStyle='rgba(255,224,0,0.28)'; ctx.lineWidth=2.5;
      for (let r=0;r<8;r++) {
        const a=(r/8)*Math.PI*2+frame*0.006;
        ctx.beginPath();
        ctx.moveTo(W*sp.x+Math.cos(a)*52,H*sp.y+Math.sin(a)*52);
        ctx.lineTo(W*sp.x+Math.cos(a)*72,H*sp.y+Math.sin(a)*72);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  if (tod==='night') {
    ctx.save();
    ctx.shadowBlur=35; ctx.shadowColor='#FFFACD';
    ctx.fillStyle='#FFFACD';
    ctx.beginPath(); ctx.arc(W*0.82,H*0.11,40,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=cfg.sky[1]; ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(W*0.82+20,H*0.11-9,32,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  const gg=ctx.createLinearGradient(0,gH,0,H);
  gg.addColorStop(0,sc.gTop); gg.addColorStop(1,sc.gBot);
  ctx.fillStyle=gg; ctx.fillRect(0,gH,W,H-gH);
  ctx.fillStyle=season==='winter'?'#D0E8F0':'#5DBE4A';
  ctx.beginPath(); ctx.ellipse(W/2,gH+4,W*0.53,H*0.018,0,0,Math.PI*2); ctx.fill();
}

/* ── DRAW TREE ───────────────────────────────────── */
function drawTree(x,gy,scale,li) {
  const sc=SEASONS[season], b=TOD[tod].amb;
  ctx.save(); ctx.translate(x,gy); ctx.scale(scale,scale);
  ctx.fillStyle=dimHex(sc.trunk,b);
  ctx.beginPath(); ctx.moveTo(-13,0); ctx.lineTo(-9,-88); ctx.lineTo(9,-88); ctx.lineTo(13,0); ctx.fill();
  ctx.fillStyle=dimHex(sc.leaves[li%sc.leaves.length],b);
  [[0,-118,54],[-38,-94,38],[38,-94,38],[-20,-152,36],[20,-152,36],[0,-175,30]].forEach(([cx,cy,cr])=>{
    ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.fill();
  });
  if (season==='winter') {
    ctx.fillStyle=`rgba(210,235,250,${0.72*b})`;
    [[0,-118,54],[-38,-94,38],[38,-94,38],[-20,-152,36],[20,-152,36],[0,-175,30]].forEach(([cx,cy,cr])=>{
      ctx.beginPath(); ctx.arc(cx,cy-cr*0.08,cr*0.88,Math.PI,Math.PI*2); ctx.fill();
    });
  }
  ctx.restore();
}

/* ── DRAW PALM ───────────────────────────────────── */
function drawPalm(x,gy) {
  const b=TOD[tod].amb;
  const sway=Math.sin(frame*0.018)*10;
  ctx.save(); ctx.translate(x,gy);
  ctx.strokeStyle=dimRGB(100,65,30,1,b); ctx.lineWidth=16; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(18,-52,-8,-105,6,-142); ctx.stroke();
  const lc = season==='winter'?[90,115,100]:[40,155,45];
  ctx.strokeStyle=dimRGB(lc[0],lc[1],lc[2],1,b); ctx.lineWidth=7;
  [[ 65,-28],[-65,-18],[ 45,-65],[-42,-58],[  8,-72]].forEach(([dx,dy])=>{
    ctx.beginPath();
    ctx.moveTo(6,-142); ctx.quadraticCurveTo(dx/2+sway/2,-142+dy/2,dx+sway,-142+dy); ctx.stroke();
  });
  ctx.restore();
}

/* ── DRAW BUSH ───────────────────────────────────── */
function drawBush(x,gy,w) {
  const sc=SEASONS[season], b=TOD[tod].amb;
  ctx.save(); ctx.translate(x,gy); ctx.scale(w,1);
  ctx.fillStyle=dimHex(sc.leaves[1],b);
  [[0,0,27],[-24,7,21],[24,7,21],[-11,-16,17],[11,-16,17]].forEach(([cx,cy,cr])=>{
    ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.fill();
  });
  ctx.restore();
}

/* ── DRAW JUNGLE ─────────────────────────────────── */
function drawJungle() {
  const W=canvas.width, H=canvas.height, gy=H*0.72;
  [[0.04,0.52,2],[0.16,0.57,0],[0.30,0.55,1],[0.48,0.60,2],
   [0.63,0.53,0],[0.77,0.56,1],[0.93,0.54,2]].forEach(([rx,s,li])=>drawTree(W*rx,gy,s*0.88,li));
  [[0.01,0.84,1],[0.12,0.90,0],[0.24,0.82,2],[0.37,0.88,1],
   [0.54,0.85,0],[0.68,0.92,2],[0.84,0.83,1],[0.97,0.87,0]].forEach(([rx,s,li])=>drawTree(W*rx,gy,s,li));
  if (season!=='winter') { drawPalm(W*0.43,gy); drawPalm(W*0.61,gy); }
  [[0.06,1.2],[0.19,0.9],[0.32,1.1],[0.47,0.85],[0.57,1.15],[0.71,0.9],[0.83,1.05],[0.96,0.95]]
    .forEach(([rx,w])=>drawBush(W*rx,gy,w));

  if (season==='winter') {
    ctx.fillStyle='rgba(255,255,255,0.75)';
    for (let i=0;i<70;i++) {
      const sx=(Math.sin(i*137.5+frame*0.008)*0.5+0.5)*W;
      const sy=((Math.cos(i*97.3)*0.5+0.5+(frame*0.0018*(0.4+(i%3)*0.22)))%1)*H;
      ctx.beginPath(); ctx.arc(sx,sy,1.8,0,Math.PI*2); ctx.fill();
    }
  }
}

/* ── DRAW HAMSTER ────────────────────────────────── */
function drawHamster(x,y,sleeping,dir) {
  const b=TOD[tod].amb;
  const S=0.55;
  ctx.save(); ctx.translate(x,y); ctx.scale(dir*S,S);
  const bob=sleeping?0:-Math.abs(Math.sin(frame*0.13))*8;
  ctx.translate(0,bob);

  if (sleeping) {
    ctx.fillStyle=dimRGB(218,172,108,1,b);
    ctx.beginPath(); ctx.ellipse(0,0,44,25,0.25,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(248,228,200,1,b);
    ctx.beginPath(); ctx.ellipse(8,6,24,15,0.25,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(218,172,108,1,b);
    ctx.beginPath(); ctx.arc(35,-8,20,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(218,172,108,1,b);
    ctx.beginPath(); ctx.arc(28,-26,11,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(255,155,170,1,b);
    ctx.beginPath(); ctx.arc(28,-26,7,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=dimRGB(60,35,15,1,b); ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(40,-11,5,0,Math.PI); ctx.stroke();
    ctx.font='18px Arial'; ctx.fillText('💤',42,-26);
  } else {
    const walk=Math.sin(frame*0.13)*9;
    ctx.fillStyle=dimRGB(218,172,108,1,b);
    ctx.beginPath(); ctx.ellipse(0,0,44,29,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(248,228,200,1,b);
    ctx.beginPath(); ctx.ellipse(0,9,25,17,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(200,155,90,1,b);
    ctx.beginPath(); ctx.arc(-42,-1,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(218,172,108,1,b);
    ctx.beginPath(); ctx.arc(38,-14,29,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(234,188,130,1,b);
    ctx.beginPath(); ctx.arc(54,-7,16,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(37,-4,13,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(218,172,108,1,b);
    ctx.beginPath(); ctx.arc(24,-37,13,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(255,155,170,1,b);
    ctx.beginPath(); ctx.arc(24,-37,8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(218,172,108,1,b);
    ctx.beginPath(); ctx.arc(41,-40,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(255,155,170,1,b);
    ctx.beginPath(); ctx.arc(41,-40,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(25,14,5,1,b);
    ctx.beginPath(); ctx.arc(48,-21,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(50,-23,2.4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(255,130,148,1,b);
    ctx.beginPath(); ctx.arc(63,-11,5.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(200,75,95,1,b);
    ctx.beginPath(); ctx.arc(63,-11,2.8,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=dimRGB(180,160,130,0.7,b); ctx.lineWidth=1.1;
    [[63,-8,84,-5],[63,-11,86,-11],[63,-14,84,-17]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });
    ctx.fillStyle=dimRGB(196,150,88,1,b);
    [-21,-7,8,22].forEach((lx,i)=>{
      const la=walk*(i%2===0?1:-1)*0.055;
      ctx.save(); ctx.translate(lx,23); ctx.rotate(la);
      ctx.beginPath(); ctx.roundRect(-5,0,11,17,4); ctx.fill(); ctx.restore();
    });
  }
  ctx.restore();
}

/* ── DRAW ELEPHANT ───────────────────────────────── */
function drawElephant(x,y,sleeping,dir) {
  const b=TOD[tod].amb;
  const BASE=dimRGB(115,132,148,1,b), DARK=dimRGB(75,90,108,1,b), LIGHT=dimRGB(158,172,186,1,b);
  const SKIN=dimRGB(192,160,148,1,b);
  const S=0.50;
  ctx.save(); ctx.translate(x,y); ctx.scale(dir*S,S);
  const bob=sleeping?0:-Math.abs(Math.sin(frame*0.075))*7;
  ctx.translate(0,bob);

  if (sleeping) {
    ctx.fillStyle=BASE;
    ctx.beginPath(); ctx.ellipse(0,4,88,44,0.12,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(74,-16,46,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=DARK;
    ctx.beginPath(); ctx.ellipse(56,-9,33,52,-0.2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=LIGHT;
    ctx.beginPath(); ctx.ellipse(56,-9,22,38,-0.2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=SKIN;
    ctx.beginPath(); ctx.ellipse(56,-9,14,24,-0.2,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=DARK; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(90,-22,6,0,Math.PI); ctx.stroke();
    ctx.fillStyle=BASE;
    ctx.beginPath();
    ctx.moveTo(108,-8); ctx.quadraticCurveTo(134,16,118,34);
    ctx.quadraticCurveTo(107,40,100,33); ctx.quadraticCurveTo(114,18,88,-4); ctx.fill();
    ctx.font='22px Arial'; ctx.fillText('💤',112,-42);
  } else {
    const walk=Math.sin(frame*0.075)*11;
    ctx.fillStyle=DARK;
    [-58,-26].forEach((lx,i)=>{
      const la=walk*(i%2===0?1:-1)*0.042;
      ctx.save(); ctx.translate(lx,50); ctx.rotate(la);
      ctx.beginPath(); ctx.roundRect(-15,0,30,62,10); ctx.fill();
      ctx.fillStyle=LIGHT;
      ctx.beginPath(); ctx.ellipse(0,62,17,8,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle=BASE;
    ctx.beginPath(); ctx.ellipse(0,0,86,58,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=LIGHT;
    ctx.beginPath(); ctx.ellipse(0,19,54,34,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=BASE;
    [14,46].forEach((lx,i)=>{
      const la=walk*(i%2===0?-1:1)*0.042;
      ctx.save(); ctx.translate(lx,50); ctx.rotate(la);
      ctx.beginPath(); ctx.roundRect(-15,0,30,62,10); ctx.fill();
      ctx.fillStyle=LIGHT;
      ctx.beginPath(); ctx.ellipse(0,62,17,8,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle=BASE;
    ctx.beginPath(); ctx.arc(78,-22,52,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=DARK;
    ctx.beginPath(); ctx.ellipse(58,-11,35,54,-0.22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=BASE;
    ctx.beginPath(); ctx.ellipse(58,-11,25,40,-0.22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=SKIN;
    ctx.beginPath(); ctx.ellipse(58,-11,16,27,-0.22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=dimRGB(20,12,5,1,b);
    ctx.beginPath(); ctx.arc(98,-33,8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(100,-35,3,0,Math.PI*2); ctx.fill();
    const ts=Math.sin(frame*0.065)*14;
    ctx.fillStyle=BASE;
    ctx.beginPath();
    ctx.moveTo(115,-10);
    ctx.bezierCurveTo(148+ts,18,140+ts,60,114,74);
    ctx.bezierCurveTo(102,80,91,68,104,64);
    ctx.bezierCurveTo(122,54,128+ts*0.5,18,97,-6);
    ctx.fill();
    ctx.fillStyle=DARK; ctx.beginPath(); ctx.ellipse(108,70,11,7,0.3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=dimRGB(255,252,210,0.92,b); ctx.lineWidth=7; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(100,-5); ctx.quadraticCurveTo(138,10,130,30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(94,-2); ctx.quadraticCurveTo(132,16,124,36); ctx.stroke();
    ctx.strokeStyle=BASE; ctx.lineWidth=6;
    ctx.beginPath(); ctx.moveTo(-84,-5); ctx.quadraticCurveTo(-112,-24,-104,12); ctx.stroke();
  }
  ctx.restore();
}

/* ── DRAW SUGAR CUBE ─────────────────────────────── */
function drawCube(c) {
  let alpha=1;
  if (c.landed) {
    const landAge=(Date.now()-c.landTime)/c.life;
    alpha=landAge>0.6?1-(landAge-0.6)/0.4:1;
  }
  const pulse=c.landed?(1+Math.sin(frame*0.14+c.id*8)*0.055):1;
  ctx.save();
  ctx.translate(c.x,c.y); ctx.rotate(c.rot); ctx.scale(pulse,pulse);
  ctx.globalAlpha=alpha;
  ctx.shadowBlur=18; ctx.shadowColor='#80C8F0';
  ctx.fillStyle='#FFFFFF'; ctx.strokeStyle='#B8D4E8'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(-22,-22,44,44,7); ctx.fill(); ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle='#C0DCF0';
  [[-9,-9],[9,-9],[-9,9],[9,9],[0,0],[-9,0],[9,0],[0,-9],[0,9]].forEach(([dx,dy])=>{
    ctx.beginPath(); ctx.arc(dx,dy,2,0,Math.PI*2); ctx.fill();
  });
  const sa=Math.sin(frame*0.16+c.id*12)*0.5+0.5;
  ctx.fillStyle=c.landed?`rgba(80,160,255,${sa})`:`rgba(150,210,255,0.8)`;
  ctx.font='bold 14px Arial';
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✦',0,0);
  ctx.restore();
}

/* ── DRAW BALL (pułapka) ─────────────────────────── */
function drawBall(b) {
  const age = (Date.now() - b.spawn) / b.life;
  const alpha = age > 0.7 ? 1 - (age - 0.7) / 0.3 : 1;
  const bounce = Math.abs(Math.sin(frame * 0.12 + b.id * 7)) * 14;
  const wobble = Math.sin(frame * 0.18 + b.id * 4) * 2;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(b.x, b.y);

  const shadowY = bounce + 32;
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(wobble, shadowY, 20 - bounce * 0.3, 7, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.translate(wobble, -bounce);

  const grad = ctx.createRadialGradient(-9, -10, 3, 0, 0, 26);
  grad.addColorStop(0, '#FF8844');
  grad.addColorStop(0.45, '#DD2200');
  grad.addColorStop(1, '#880000');
  ctx.shadowBlur = 14;
  ctx.shadowColor = '#FF4400';
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.ellipse(-8, -9, 8, 5, -0.5, 0, Math.PI*2); ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.arc(6, 8, 4, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

/* ── DRAW FOX ────────────────────────────────────── */
function drawFox(cx, cy, happy) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.save();
  const tailWag = happy ? Math.sin(frame * 0.15) * 18 : Math.sin(frame * 0.04) * 5;
  ctx.translate(-55, 30);
  ctx.rotate((-0.5 + tailWag * 0.015));
  ctx.fillStyle = '#E06010';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-40, -20, -80, 10, -70, 50);
  ctx.bezierCurveTo(-60, 80, -20, 70, 0, 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#F5F0E8';
  ctx.beginPath();
  ctx.ellipse(-55, 42, 22, 18, 0.4, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#E06010';
  ctx.beginPath();
  ctx.ellipse(0, 30, 55, 42, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#F5F0E8';
  ctx.beginPath();
  ctx.ellipse(0, 40, 32, 26, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#E06010';
  ctx.beginPath();
  ctx.ellipse(0, -28, 50, 44, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#E06010';
  ctx.beginPath();
  ctx.moveTo(-30, -55);
  ctx.lineTo(-58, -105);
  ctx.lineTo(-6, -78);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FF8888';
  ctx.beginPath();
  ctx.moveTo(-30, -60);
  ctx.lineTo(-52, -98);
  ctx.lineTo(-12, -78);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#E06010';
  ctx.beginPath();
  ctx.moveTo(30, -55);
  ctx.lineTo(58, -105);
  ctx.lineTo(6, -78);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FF8888';
  ctx.beginPath();
  ctx.moveTo(30, -60);
  ctx.lineTo(52, -98);
  ctx.lineTo(12, -78);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F5F0E8';
  ctx.beginPath();
  ctx.ellipse(0, -14, 28, 22, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#C04808';
  ctx.beginPath();
  ctx.ellipse(-20, -38, 14, 10, -0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(20, -38, 14, 10, 0.3, 0, Math.PI*2);
  ctx.fill();

  if (happy) {
    ctx.strokeStyle = '#1A0A00';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-20, -38, 9, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(20, -38, 9, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-14, -44, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(26, -44, 3, 0, Math.PI*2); ctx.fill();
  } else {
    ctx.fillStyle = '#1A0A00';
    ctx.beginPath(); ctx.ellipse(-20, -36, 7, 8, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(20, -36, 7, 8, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(-17, -39, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(23, -39, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#1A0A00';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-30, -48); ctx.lineTo(-12, -44); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, -48); ctx.lineTo(12, -44); ctx.stroke();
    ctx.fillStyle = 'rgba(100,160,255,0.8)';
    const tearDrop = (tx, ty) => {
      ctx.beginPath();
      ctx.arc(tx, ty, 4, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(tx - 4, ty);
      ctx.lineTo(tx, ty + 10);
      ctx.lineTo(tx + 4, ty);
      ctx.fill();
    };
    const tearOff = (frame * 0.04) % 1;
    tearDrop(-20, -26 + tearOff * 20);
    tearDrop(20, -26 + ((tearOff + 0.5) % 1) * 20);
  }

  ctx.fillStyle = '#1A0A00';
  ctx.beginPath();
  ctx.ellipse(0, -18, 7, 5, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.arc(-2, -20, 2, 0, Math.PI*2); ctx.fill();

  ctx.strokeStyle = '#1A0A00';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  if (happy) {
    ctx.beginPath();
    ctx.moveTo(-12, -9);
    ctx.quadraticCurveTo(-6, -2, 0, -4);
    ctx.quadraticCurveTo(6, -2, 12, -9);
    ctx.stroke();
    ctx.fillStyle = '#FF6688';
    ctx.beginPath();
    ctx.ellipse(0, -1, 8, 6, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#CC4466';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 3);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-14, -6);
    ctx.quadraticCurveTo(-6, -14, 0, -12);
    ctx.quadraticCurveTo(6, -14, 14, -6);
    ctx.stroke();
  }

  ctx.restore();
}

/* ── DRAW EFFECTS ────────────────────────────────── */
function drawEffects() {
  effects=effects.filter(e=>{
    e.life++;
    const t=e.life/e.max;
    ctx.save(); ctx.globalAlpha=1-t;
    ctx.fillStyle=e.col; ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=3;
    ctx.font=`bold ${28+t*12}px Arial`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.strokeText(e.txt,e.x,e.y-e.life*1.9);
    ctx.fillText(e.txt,e.x,e.y-e.life*1.9);
    ctx.restore();
    return e.life<e.max;
  });
}

/* ── GAME OVER SCREEN ────────────────────────────── */
function drawGameOver() {
  const W=canvas.width, H=canvas.height;
  ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';

  drawFox(W/2, H/2 - 60, false);

  ctx.shadowBlur=25; ctx.shadowColor='#FF4444';
  ctx.fillStyle='#FF6B6B'; ctx.font='bold 64px Arial';
  ctx.fillText('KONIEC GRY!',W/2,H/2+100);
  ctx.shadowColor='#FFD700'; ctx.fillStyle='#FFD700'; ctx.font='bold 38px Arial';
  ctx.fillText(`⭐ Wynik: ${score}`,W/2,H/2+158);
  ctx.shadowBlur=0; ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.font='22px Arial';
  ctx.fillText('Kliknij, aby zagrać ponownie',W/2,H/2+210);
  ctx.restore();
}

/* ── WIN SCREEN ──────────────────────────────────── */
function drawWin() {
  const W=canvas.width, H=canvas.height;
  ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,W,H);

  for (let i=0;i<60;i++) {
    const cf=['#FFD700','#FF6B9D','#00E5FF','#69FF47','#FF9500'];
    ctx.fillStyle = cf[i%cf.length];
    const cx=(Math.sin(i*137.5+frame*0.04)*0.5+0.5)*W;
    const cy=((frame*0.006*(0.5+(i%5)*0.15)+i*0.13)%1)*H;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(frame*0.05+i);
    ctx.fillRect(-5,-3,10,6);
    ctx.restore();
  }

  ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';

  drawFox(W/2, H/2 - 60, true);

  ctx.shadowBlur=30; ctx.shadowColor='#FFD700';
  ctx.fillStyle='#FFD700'; ctx.font='bold 68px Arial';
  ctx.fillText('WYGRAŁEŚ! 🎉',W/2,H/2+110);
  ctx.shadowColor='#FFF'; ctx.fillStyle='#FFF'; ctx.font='bold 36px Arial';
  ctx.fillText(`⭐ Zebrałeś ${score} kostek!`,W/2,H/2+168);
  ctx.shadowBlur=0; ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.font='22px Arial';
  ctx.fillText('Kliknij, aby zagrać ponownie',W/2,H/2+216);
  ctx.restore();
}
