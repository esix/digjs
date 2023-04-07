import * as Sprite from "./Sprite";
import * as Digger from "./Digger";
import * as Main from "./Main";

var field1 = [	// [150]
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var field2 = [	// [150]
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export var field = [	// [150]
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var diggerbuf = new Array(480),	// short
    bagbuf1 = new Array(480),
    bagbuf2 = new Array(480),
    bagbuf3 = new Array(480),
    bagbuf4 = new Array(480),
    bagbuf5 = new Array(480),
    bagbuf6 = new Array(480),
    bagbuf7 = new Array(480),
    monbuf1 = new Array(480),
    monbuf2 = new Array(480),
    monbuf3 = new Array(480),
    monbuf4 = new Array(480),
    monbuf5 = new Array(480),
    monbuf6 = new Array(480),
    bonusbuf = new Array(480),
    firebuf = new Array(128);

var bitmasks = [0xfffe, 0xfffd, 0xfffb, 0xfff7, 0xffef, 0xffdf, 0xffbf, 0xff7f, 0xfeff, 0xfdff, 0xfbff, 0xf7ff];	// [12]

var monspr = [0, 0, 0, 0, 0, 0];	// [6]
var monspd = [0, 0, 0, 0, 0, 0];	// [6]

var digspr = 0, digspd = 0, firespr = 0, fireheight = 8;

export function createdbfspr() {
  digspd = 1;
  digspr = 0;
  firespr = 0;
  Sprite.createspr(0, 0, diggerbuf, 4, 15, 0, 0);
  Sprite.createspr(14, 81, bonusbuf, 4, 15, 0, 0);
  Sprite.createspr(15, 82, firebuf, 2, fireheight, 0, 0);
}

export function creatembspr() {
  var i;
  Sprite.createspr(1, 62, bagbuf1, 4, 15, 0, 0);
  Sprite.createspr(2, 62, bagbuf2, 4, 15, 0, 0);
  Sprite.createspr(3, 62, bagbuf3, 4, 15, 0, 0);
  Sprite.createspr(4, 62, bagbuf4, 4, 15, 0, 0);
  Sprite.createspr(5, 62, bagbuf5, 4, 15, 0, 0);
  Sprite.createspr(6, 62, bagbuf6, 4, 15, 0, 0);
  Sprite.createspr(7, 62, bagbuf7, 4, 15, 0, 0);
  Sprite.createspr(8, 71, monbuf1, 4, 15, 0, 0);
  Sprite.createspr(9, 71, monbuf2, 4, 15, 0, 0);
  Sprite.createspr(10, 71, monbuf3, 4, 15, 0, 0);
  Sprite.createspr(11, 71, monbuf4, 4, 15, 0, 0);
  Sprite.createspr(12, 71, monbuf5, 4, 15, 0, 0);
  Sprite.createspr(13, 71, monbuf6, 4, 15, 0, 0);
  createdbfspr();
  for (i = 0; i < 6; i++) {
    monspr[i] = 0;
    monspd[i] = 1;
  }
}

export async function drawbackg(l) {
  var x, y;
  for (y = 14; y < 200; y += 4) {
    for (x = 0; x < 320; x += 20)
      Sprite.drawmiscspr(x, y, 93 + l, 5, 4);
    Digger.newframe(); //js
    await sleep(12);
  }
}

export function drawbonus(x, y) {
  Sprite.initspr(14, 81, 4, 15, 0, 0);
  Sprite.movedrawspr(14, x, y);
}

export function drawbottomblob(x, y) {
  Sprite.initmiscspr(x - 4, y + 15, 6, 6);
  Sprite.drawmiscspr(x - 4, y + 15, 105, 6, 6);
  Sprite.getis();
}

export function drawdigger(t, x, y, f) {	// r: int
  digspr += digspd;
  if (digspr == 2 || digspr == 0)
    digspd = -digspd;
  if (digspr > 2)
    digspr = 2;
  if (digspr < 0)
    digspr = 0;
  if (t >= 0 && t <= 6 && !((t & 1) != 0)) {
    Sprite.initspr(0, (t + (f ? 0 : 1)) * 3 + digspr + 1, 4, 15, 0, 0);
    return Sprite.drawspr(0, x, y);
  }
  if (t >= 10 && t <= 15) {
    Sprite.initspr(0, 40 - t, 4, 15, 0, 0);
    return Sprite.drawspr(0, x, y);
  }
  return 0;
}

export function drawemerald(x, y) {
  Sprite.initmiscspr(x, y, 4, 10);
  Sprite.drawmiscspr(x, y, 108, 4, 10);
  Sprite.getis();
}

export async function drawfield() {
  var x, y, xp, yp;
  for (x = 0; x < 15; x++)
    for (y = 0; y < 10; y++) {
      if ((field[y * 15 + x] & 0x2000) == 0) {
        xp = x * 20 + 12;
        yp = y * 18 + 18;
        if ((field[y * 15 + x] & 0xfc0) != 0xfc0) {
          field[y * 15 + x] &= 0xd03f;
          drawbottomblob(xp, yp - 15);
          drawbottomblob(xp, yp - 12);
          drawbottomblob(xp, yp - 9);
          drawbottomblob(xp, yp - 6);
          drawbottomblob(xp, yp - 3);
          drawtopblob(xp, yp + 3);
        }
        if ((field[y * 15 + x] & 0x1f) != 0x1f) {
          field[y * 15 + x] &= 0xdfe0;
          drawrightblob(xp - 16, yp);
          drawrightblob(xp - 12, yp);
          drawrightblob(xp - 8, yp);
          drawrightblob(xp - 4, yp);
          drawleftblob(xp + 4, yp);
        }
        if (x < 14)
          if ((field[y * 15 + x + 1] & 0xfdf) != 0xfdf)
            drawrightblob(xp, yp);
        if (y < 9)
          if ((field[(y + 1) * 15 + x] & 0xfdf) != 0xfdf)
            drawbottomblob(xp, yp);
        Digger.newframe(); //js
        await sleep(18);
      }

    }
}

export function drawfire(x, y, t) {
  if (t == 0) {
    firespr++;
    if (firespr > 2)
      firespr = 0;
    Sprite.initspr(15, 82 + firespr, 2, fireheight, 0, 0);
  } else
    Sprite.initspr(15, 84 + t, 2, fireheight, 0, 0);
  return Sprite.drawspr(15, x, y);
}

export function drawfurryblob(x, y) {
  Sprite.initmiscspr(x - 4, y + 15, 6, 8);
  Sprite.drawmiscspr(x - 4, y + 15, 107, 6, 8);
  Sprite.getis();
}

export function drawgold(n, t, x, y) {
  Sprite.initspr(n, t + 62, 4, 15, 0, 0);
  return Sprite.drawspr(n, x, y);
}

export function drawleftblob(x, y) {
  Sprite.initmiscspr(x - 8, y - 1, 2, 18);
  Sprite.drawmiscspr(x - 8, y - 1, 104, 2, 18);
  Sprite.getis();
}

export function drawlife(t, x, y) {
  Sprite.drawmiscspr(x, y, t + 110, 4, 12);
}

export function drawlives() {
  var l, n;
  n = Main.getlives(1) - 1;
  for (l = 1; l < 5; l++) {
    drawlife(n > 0 ? 0 : 2, l * 20 + 60, 0);
    n--;
  }
  if (Main.getnplayers() == 2) {
    n = Main.getlives(2) - 1;
    for (l = 1; l < 5; l++) {
      drawlife(n > 0 ? 1 : 2, 244 - l * 20, 0);
      n--;
    }
  }
}

export function drawmon(n, nobf, dir, x, y) {
  monspr[n] += monspd[n];
  if (monspr[n] == 2 || monspr[n] == 0)
    monspd[n] = -monspd[n];
  if (monspr[n] > 2)
    monspr[n] = 2;
  if (monspr[n] < 0)
    monspr[n] = 0;
  if (nobf)
    Sprite.initspr(n + 8, monspr[n] + 69, 4, 15, 0, 0);
  else
    switch (dir) {
      case 0:
        Sprite.initspr(n + 8, monspr[n] + 73, 4, 15, 0, 0);
        break;
      case 4:
        Sprite.initspr(n + 8, monspr[n] + 77, 4, 15, 0, 0);
    }
  return Sprite.drawspr(n + 8, x, y);
}

export function drawmondie(n, nobf, dir, x, y) {
  if (nobf)
    Sprite.initspr(n + 8, 72, 4, 15, 0, 0);
  else
    switch (dir) {
      case 0:
        Sprite.initspr(n + 8, 76, 4, 15, 0, 0);
        break;
      case 4:
        Sprite.initspr(n + 8, 80, 4, 14, 0, 0);
    }
  return Sprite.drawspr(n + 8, x, y);
}

export function drawrightblob(x, y) {
  Sprite.initmiscspr(x + 16, y - 1, 2, 18);
  Sprite.drawmiscspr(x + 16, y - 1, 102, 2, 18);
  Sprite.getis();
}

export function drawsquareblob(x, y) {
  Sprite.initmiscspr(x - 4, y + 17, 6, 6);
  Sprite.drawmiscspr(x - 4, y + 17, 106, 6, 6);
  Sprite.getis();
}

export async function drawstatics() {
  var x, y;
  for (x = 0; x < 15; x++)
    for (y = 0; y < 10; y++)
      if (Main.getcplayer() == 0)
        field[y * 15 + x] = field1[y * 15 + x];
      else
        field[y * 15 + x] = field2[y * 15 + x];
  Sprite.setretr(true);
  Pc.gpal(0);
  Pc.ginten(0);
  await drawbackg(Main.levplan());
  await drawfield();
}

export function drawtopblob(x, y) {
  Sprite.initmiscspr(x - 4, y - 6, 6, 6);
  Sprite.drawmiscspr(x - 4, y - 6, 103, 6, 6);
  Sprite.getis();
}

export function eatfield(x, y, dir) {
  var h = Math.floor((x - 12) / 20), xr = Math.floor(((x - 12) % 20) / 4), v = Math.floor((y - 18) / 18),
      yr = Math.floor(((y - 18) % 18) / 3);
  Main.incpenalty();
  switch (dir) {
    case 0:
      h++;
      field[v * 15 + h] &= bitmasks[xr];
      if ((field[v * 15 + h] & 0x1f) != 0)
        break;
      field[v * 15 + h] &= 0xdfff;
      break;
    case 4:
      xr--;
      if (xr < 0) {
        xr += 5;
        h--;
      }
      field[v * 15 + h] &= bitmasks[xr];
      if ((field[v * 15 + h] & 0x1f) != 0)
        break;
      field[v * 15 + h] &= 0xdfff;
      break;
    case 2:
      yr--;
      if (yr < 0) {
        yr += 6;
        v--;
      }
      field[v * 15 + h] &= bitmasks[6 + yr];
      if ((field[v * 15 + h] & 0xfc0) != 0)
        break;
      field[v * 15 + h] &= 0xdfff;
      break;
    case 6:
      v++;
      field[v * 15 + h] &= bitmasks[6 + yr];
      if ((field[v * 15 + h] & 0xfc0) != 0)
        break;
      field[v * 15 + h] &= 0xdfff;
  }
}

export function eraseemerald(x, y) {
  Sprite.initmiscspr(x, y, 4, 10);
  Sprite.drawmiscspr(x, y, 109, 4, 10);
  Sprite.getis();
}

export function initdbfspr() {
  digspd = 1;
  digspr = 0;
  firespr = 0;
  Sprite.initspr(0, 0, 4, 15, 0, 0);
  Sprite.initspr(14, 81, 4, 15, 0, 0);
  Sprite.initspr(15, 82, 2, fireheight, 0, 0);
}

export function initmbspr() {
  Sprite.initspr(1, 62, 4, 15, 0, 0);
  Sprite.initspr(2, 62, 4, 15, 0, 0);
  Sprite.initspr(3, 62, 4, 15, 0, 0);
  Sprite.initspr(4, 62, 4, 15, 0, 0);
  Sprite.initspr(5, 62, 4, 15, 0, 0);
  Sprite.initspr(6, 62, 4, 15, 0, 0);
  Sprite.initspr(7, 62, 4, 15, 0, 0);
  Sprite.initspr(8, 71, 4, 15, 0, 0);
  Sprite.initspr(9, 71, 4, 15, 0, 0);
  Sprite.initspr(10, 71, 4, 15, 0, 0);
  Sprite.initspr(11, 71, 4, 15, 0, 0);
  Sprite.initspr(12, 71, 4, 15, 0, 0);
  Sprite.initspr(13, 71, 4, 15, 0, 0);
  initdbfspr();
}

export function makefield() {
  var c, x, y;
  for (x = 0; x < 15; x++)
    for (y = 0; y < 10; y++) {
      field[y * 15 + x] = -1;
      c = Main.getlevch(x, y, Main.levplan());
      if (c == 'S' || c == 'V')
        field[y * 15 + x] &= 0xd03f;
      if (c == 'S' || c == 'H')
        field[y * 15 + x] &= 0xdfe0;
      if (Main.getcplayer() == 0)
        field1[y * 15 + x] = field[y * 15 + x];
      else
        field2[y * 15 + x] = field[y * 15 + x];
    }
}

/*function outtext (p,x,y,c) {
	outtext (p,x,y,c,false);
}*/
export function outtext(p, x, y, c, b = false) {
  var i, rx = x;
  for (i = 0; i < p.length; i++) {
    Pc.gwrite(x, y, p.charAt(i), c);
    x += 12;
  }
}

export function savefield() {
  var x, y;
  for (x = 0; x < 15; x++)
    for (y = 0; y < 10; y++)
      if (Main.getcplayer() == 0)
        field1[y * 15 + x] = field[y * 15 + x];
      else
        field2[y * 15 + x] = field[y * 15 + x];
}
