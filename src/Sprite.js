var retrflag = true;

var sprrdrwf = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];	// [17]
var sprrecf = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];	// [17]
var sprenf = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];	// [16]

var sprch = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]

var sprmov = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];	// [16], short

var sprx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
var spry = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
var sprwid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
var sprhei = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [17]
var sprbwid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
var sprbhei = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
var sprnch = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
var sprnwid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
var sprnhei = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
var sprnbwid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]
var sprnbhei = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [16]

var defsprorder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];	// [16]
var sprorder = defsprorder;


export function bcollide(bx, si) {
  if (sprx[bx] >= sprx[si]) {
    if (sprx[bx] + sprbwid[bx] > sprwid[si] * 4 + sprx[si] - sprbwid[si] - 1)
      return false;
  } else if (sprx[si] + sprbwid[si] > sprwid[bx] * 4 + sprx[bx] - sprbwid[bx] - 1)
    return false;
  if (spry[bx] >= spry[si]) {
    if (spry[bx] + sprbhei[bx] <= sprhei[si] + spry[si] - sprbhei[si] - 1)
      return true;
    return false;
  }
  if (spry[si] + sprbhei[si] <= sprhei[bx] + spry[bx] - sprbhei[bx] - 1)
    return true;
  return false;
}

export function bcollides(bx) {
  var si = bx, ax = 0, dx = 0;
  bx = 0;
  do {
    if (sprenf[bx] && bx != si) {
      if (bcollide(bx, si))
        ax |= 1 << dx;
      sprx[bx] += 320;
      spry[bx] -= 2;
      if (bcollide(bx, si))
        ax |= 1 << dx;
      sprx[bx] -= 640;
      spry[bx] += 4;
      if (bcollide(bx, si))
        ax |= 1 << dx;
      sprx[bx] += 320;
      spry[bx] -= 2;
    }
    bx++;
    dx++;
  } while (dx != 16);
  return ax;
}

export function clearrdrwf() {
  var i;
  clearrecf();
  for (i = 0; i < 17; i++)
    sprrdrwf[i] = false;
}

export function clearrecf() {
  var i;
  for (i = 0; i < 17; i++)
    sprrecf[i] = false;
}

export function collide(bx, si) {
  if (sprx[bx] >= sprx[si]) {
    if (sprx[bx] > sprwid[si] * 4 + sprx[si] - 1)
      return false;
  } else if (sprx[si] > sprwid[bx] * 4 + sprx[bx] - 1)
    return false;
  if (spry[bx] >= spry[si]) {
    if (spry[bx] <= sprhei[si] + spry[si] - 1)
      return true;
    return false;
  }
  if (spry[si] <= sprhei[bx] + spry[bx] - 1)
    return true;
  return false;
}

export function createspr(n, ch, mov, wid, hei, bwid, bhei) {
  sprnch[n & 15] = sprch[n & 15] = ch;
  sprmov[n & 15] = mov;
  sprnwid[n & 15] = sprwid[n & 15] = wid;
  sprnhei[n & 15] = sprhei[n & 15] = hei;
  sprnbwid[n & 15] = sprbwid[n & 15] = bwid;
  sprnbhei[n & 15] = sprbhei[n & 15] = bhei;
  sprenf[n & 15] = false;
}

export function drawmiscspr(x, y, ch, wid, hei) {
  sprx[16] = x & -4;
  spry[16] = y;
  sprch[16] = ch;
  sprwid[16] = wid;
  sprhei[16] = hei;
  Pc.gputim(sprx[16], spry[16], sprch[16], sprwid[16], sprhei[16]);
}

export function drawspr(n, x, y) {
  var bx, t1, t2, t3, t4;
  bx = n & 15;
  x &= -4;
  clearrdrwf();
  setrdrwflgs(bx);
  t1 = sprx[bx];
  t2 = spry[bx];
  t3 = sprwid[bx];
  t4 = sprhei[bx];
  sprx[bx] = x;
  spry[bx] = y;
  sprwid[bx] = sprnwid[bx];
  sprhei[bx] = sprnhei[bx];
  clearrecf();
  setrdrwflgs(bx);
  sprhei[bx] = t4;
  sprwid[bx] = t3;
  spry[bx] = t2;
  sprx[bx] = t1;
  sprrdrwf[bx] = true;
  putis();
  sprx[bx] = x;
  spry[bx] = y;
  sprch[bx] = sprnch[bx];
  sprwid[bx] = sprnwid[bx];
  sprhei[bx] = sprnhei[bx];
  sprbwid[bx] = sprnbwid[bx];
  sprbhei[bx] = sprnbhei[bx];
  Pc.ggeti(sprx[bx], spry[bx], sprmov[bx], sprwid[bx], sprhei[bx]);
  putims();
  return bcollides(bx);
}

export function erasespr(n) {
  var bx = n & 15;
  Pc.gputi(sprx[bx], spry[bx], sprmov[bx], sprwid[bx], sprhei[bx], true);
  sprenf[bx] = false;
  clearrdrwf();
  setrdrwflgs(bx);
  putims();
}

export function getis() {
  var i;
  for (i = 0; i < 16; i++)
    if (sprrdrwf[i])
      Pc.ggeti(sprx[i], spry[i], sprmov[i], sprwid[i], sprhei[i]);
  putims();
}

export function initmiscspr(x, y, wid, hei) {
  sprx[16] = x;
  spry[16] = y;
  sprwid[16] = wid;
  sprhei[16] = hei;
  clearrdrwf();
  setrdrwflgs(16);
  putis();
}

export function initspr(n, ch, wid, hei, bwid, bhei) {
  sprnch[n & 15] = ch;
  sprnwid[n & 15] = wid;
  sprnhei[n & 15] = hei;
  sprnbwid[n & 15] = bwid;
  sprnbhei[n & 15] = bhei;
}

export function movedrawspr(n, x, y) {
  var bx = n & 15;
  sprx[bx] = x & -4;
  spry[bx] = y;
  sprch[bx] = sprnch[bx];
  sprwid[bx] = sprnwid[bx];
  sprhei[bx] = sprnhei[bx];
  sprbwid[bx] = sprnbwid[bx];
  sprbhei[bx] = sprnbhei[bx];
  clearrdrwf();
  setrdrwflgs(bx);
  putis();
  Pc.ggeti(sprx[bx], spry[bx], sprmov[bx], sprwid[bx], sprhei[bx]);
  sprenf[bx] = true;
  sprrdrwf[bx] = true;
  putims();
  return bcollides(bx);
}

export function putims() {
  var i, j;
  for (i = 0; i < 16; i++) {
    j = sprorder[i];
    if (sprrdrwf[j])
      Pc.gputim(sprx[j], spry[j], sprch[j], sprwid[j], sprhei[j]);
  }
}

export function putis() {
  var i;
  for (i = 0; i < 16; i++)
    if (sprrdrwf[i])
      Pc.gputi(sprx[i], spry[i], sprmov[i], sprwid[i], sprhei[i]);
}

export function setrdrwflgs(n) {
  var i;
  if (!sprrecf[n]) {
    sprrecf[n] = true;
    for (i = 0; i < 16; i++)
      if (sprenf[i] && i != n) {
        if (collide(i, n)) {
          sprrdrwf[i] = true;
          setrdrwflgs(i);
        }
        sprx[i] += 320;
        spry[i] -= 2;
        if (collide(i, n)) {
          sprrdrwf[i] = true;
          setrdrwflgs(i);
        }
        sprx[i] -= 640;
        spry[i] += 4;
        if (collide(i, n)) {
          sprrdrwf[i] = true;
          setrdrwflgs(i);
        }
        sprx[i] += 320;
        spry[i] -= 2;
      }
  }
}

export function setretr(f) {
  retrflag = f;
}

export function setsprorder(newsprorder) {
  if (newsprorder == null)
    sprorder = defsprorder;
  else
    sprorder = newsprorder;
}


