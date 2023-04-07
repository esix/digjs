import * as Input from "./Input";
import * as Main from "./Main";
import * as Pc from "./Pc";
import * as Sprite from "./Sprite";
import * as Drawing from "./Drawing";

var dctx, dcnv;

var MAX_RATE = 200, MIN_RATE = 40;

var width = 320, height = 200, frametime = 66;

var gctx, gcnv, gcty, gimg, gpix, dcont, dwadj = 0, dhadj = 0;

var diggerx = 0, diggery = 0, diggerh = 0, diggerv = 0, diggerrx = 0, diggerry = 0, digmdir = 0,
    digdir = 0, digtime = 0, rechargetime = 0, firex = 0, firey = 0, firedir = 0, expsn = 0,
    deathstage = 0, deathbag = 0, deathani = 0, deathtime = 0, startbonustimeleft = 0,
    bonustimeleft = 0, eatmsc = 0, emocttime = 0, emn = 0;

var emmask = 0;

var emfield = [	//[150]
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

var digonscr = false, notfiring = false, bonusvisible = false, bonusmode = false, diggervisible = false;

var curtime, ftime = 50;
var embox = [8, 12, 12, 9, 16, 12, 6, 9];	// [8]
var deatharc = [3, 5, 6, 6, 5, 3, 0];			// [7]

/*
var Bags = new DBags ();  // new not needed
var Main = new DMain ();
var Sound = new DSound ();
var Monster = new DMonster ();
var Scores = new DScores ();
var Sprite = new DSprite ();
var Drawing = new DDrawing ();
var Input = new DInput ();
var Pc = new DPc ();
*/

export function checkdiggerunderbag(h, v) {
  if (digmdir == 2 || digmdir == 6)
    if (Math.floor((diggerx - 12) / 20) == h)
      if (Math.floor((diggery - 18) / 18) == v || Math.floor((diggery - 18) / 18) + 1 == v)
        return true;
  return false;
}

export function countem() {
  var x, y, n = 0;
  for (x = 0; x < 15; x++)
    for (y = 0; y < 10; y++)
      if ((emfield[y * 15 + x] & emmask) != 0)
        n++;
  return n;
}

export function createbonus() {
  bonusvisible = true;
  Drawing.drawbonus(292, 18);
}

export function diggerdie() {
  var clbits;
  switch (deathstage) {
    case 1:
      if (Bags.bagy(deathbag) + 6 > diggery)
        diggery = Bags.bagy(deathbag) + 6;
      Drawing.drawdigger(15, diggerx, diggery, false);
      Main.incpenalty();
      if (Bags.getbagdir(deathbag) + 1 == 0) {
        Sound.soundddie();
        deathtime = 5;
        deathstage = 2;
        deathani = 0;
        diggery -= 6;
      }
      break;
    case 2:
      if (deathtime != 0) {
        deathtime--;
        break;
      }
      if (deathani == 0)
        Sound.music(2);
      clbits = Drawing.drawdigger(14 - deathani, diggerx, diggery, false);
      Main.incpenalty();
      if (deathani == 0 && ((clbits & 0x3f00) != 0))
        Monster.killmonsters(clbits);
      if (deathani < 4) {
        deathani++;
        deathtime = 2;
      } else {
        deathstage = 4;
        if (Sound.getmusicflag())
          deathtime = 60;
        else
          deathtime = 10;
      }
      break;
    case 3:
      deathstage = 5;
      deathani = 0;
      deathtime = 0;
      break;
    case 5:
      if (deathani >= 0 && deathani <= 6) {
        Drawing.drawdigger(15, diggerx, diggery - deatharc[deathani], false);
        if (deathani == 6)
          Sound.musicoff();
        Main.incpenalty();
        deathani++;
        if (deathani == 1)
          Sound.soundddie();
        if (deathani == 7) {
          deathtime = 5;
          deathani = 0;
          deathstage = 2;
        }
      }
      break;
    case 4:
      if (deathtime != 0)
        deathtime--;
      else
        Main.setdead(true);
  }
}

export function dodigger() {
  newframe();
  if (expsn != 0)
    drawexplosion();
  else
    updatefire();
  if (diggervisible)
    if (digonscr)
      if (digtime != 0) {
        Drawing.drawdigger(digmdir, diggerx, diggery, notfiring && rechargetime == 0);
        Main.incpenalty();
        digtime--;
      } else
        updatedigger();
    else
      diggerdie();
  if (bonusmode && digonscr) {
    if (bonustimeleft != 0) {
      bonustimeleft--;
      if (startbonustimeleft != 0 || bonustimeleft < 20) {
        if (startbonustimeleft)
          startbonustimeleft--;
        if ((bonustimeleft & 1) != 0) {
          Pc.ginten(0);
          Sound.soundbonus();
        } else {
          Pc.ginten(1);
          Sound.soundbonus();
        }
        if (startbonustimeleft == 0) {
          Sound.music(0);
          Sound.soundbonusoff();
          Pc.ginten(1);
        }
      }
    } else {
      endbonusmode();
      Sound.soundbonusoff();
      Sound.music(1);
    }
  }
  if (bonusmode && !digonscr) {
    endbonusmode();
    Sound.soundbonusoff();
    Sound.music(1);
  }
  if (emocttime > 0)
    emocttime--;
}

export async function drawemeralds() {
  var x, y;
  emmask = 1 << Main.getcplayer();
  for (x = 0; x < 15; x++) {
    for (y = 0; y < 10; y++) {
      if ((emfield[y * 15 + x] & emmask) != 0)
        Drawing.drawemerald(x * 20 + 12, y * 18 + 21);
    }
    newframe();  //js
    await sleep(12);
  }
}

export function drawexplosion() {
  switch (expsn) {
    case 1:
      Sound.soundexplode();
    case 2:
    case 3:
      Drawing.drawfire(firex, firey, expsn);
      Main.incpenalty();
      expsn++;
      break;
    default:
      killfire();
      expsn = 0;
  }
}

export function endbonusmode() {
  bonusmode = false;
  Pc.ginten(0);
}

export function erasebonus() {
  if (bonusvisible) {
    bonusvisible = false;
    Sprite.erasespr(14);
  }
  Pc.ginten(0);
}

export function erasedigger() {
  Sprite.erasespr(0);
  diggervisible = false;
}

export function hitemerald(x, y, rx, ry, dir) {
  var hit = false;
  var r;
  if (dir < 0 || dir > 6 || ((dir & 1) != 0))
    return hit;
  if (dir == 0 && rx != 0)
    x++;
  if (dir == 6 && ry != 0)
    y++;
  if (dir == 0 || dir == 4)
    r = rx;
  else
    r = ry;
  if ((emfield[y * 15 + x] & emmask) != 0) {
    if (r == embox[dir]) {
      Drawing.drawemerald(x * 20 + 12, y * 18 + 21);
      Main.incpenalty();
    }
    if (r == embox[dir + 1]) {
      Drawing.eraseemerald(x * 20 + 12, y * 18 + 21);
      Main.incpenalty();
      hit = true;
      emfield[y * 15 + x] &= ~emmask;
    }
  }
  return hit;
}


export function digadj() {
  if (!dcont || !dcnv) return;

  var dpr = window.devicePixelRatio || 1;

  var dw = dcont.offsetWidth, dh = dcont.offsetHeight;
  if (dw > 320) dw = Math.floor(dw / 160) * 160;
  if (dh == 320) dh = 300;

  if (dh > dw * 200 / 320)
    dh = Math.round(dw * 200 / 320);
  if (dw > dh * 320 / 200)
    dw = Math.round(dh * 320 / 200);

  dcnv.style.marginTop = ((dcont.offsetHeight - dh) >> 1) + 'px';

  if (dwadj == dw && dhadj == dh) return;

  dwadj = dw;
  dhadj = dh;

  dcnv.width = Math.round(dw * dpr);
  dcnv.height = Math.round(dh * dpr);
  dcnv.style.width = dw + 'px';
  dcnv.style.height = dh + 'px';

  dctx.imageSmoothingEnabled = false;

}


export function init() {
  document.onkeydown = function (e) {
    if (typeof (fuinput) == 'function') fuinput();
    keyDown(e);
  }
  document.onkeyup = keyUp;
  document.onkeypress = keyPress;
  document.ontouchmove = function (e) {
    e.preventDefault();
  }

  var tt = {
    af: [0x3b, 0xbb], ag: [0x3b, 0xbb],   // fire x2
    al: [0x4b, 0xcb], ar: [0x4d, 0xcd],
    au: [0x48, 0xc8], ad: [0x50, 0xd0],
    arev1: null, arev2: null
  };

  var ttrev = {al: "ar", ar: "al", au: "ad", ad: "au"};

  for (var i in tt) {
    var el = document.getElementById(i);
    if (!el)
      continue;
    var irev = ttrev[i];
    dotouch(el, tt[i], irev ? tt[irev] : null);
  }

  var arlast = null;

  function dotouch(el, kpair, krev) {
    var rkpair = null;
    el.ontouchstart = function (e) {
      if (!e.targetTouches.length) return;
      if (krev)
        arlast = krev;
      if (!kpair) {
        if (!arlast) return;
        rkpair = arlast;
      }
      Input.processkey(rkpair ? rkpair[0] : kpair[0]);
    }
    el.ontouchend = function (e) {
      Input.processkey(rkpair ? rkpair[1] : kpair[1]);
    }
  }

  if (!Date.now)
    Date.now = function () {
      return +new Date();
    }

  dcont = document.getElementById("dcont");
  if (!dcont)
    return;

  dcnv = document.createElement("canvas");
  dcont.appendChild(dcnv);

  dctx = dcnv.getContext("2d");

  window.digsnd = function (s) {
    Sound.setaudio(!!s);
  }

  digadj();

  gcnv = document.createElement("canvas");
  gcnv.width = width;
  gcnv.height = height;
  gcty = gcnv.getContext("2d");
  gimg = gcty.getImageData(0, 0, width, height);
  gpix = gimg.data;
  for (var i = 3; i < gpix.length; i += 4)
    gpix[i] = 0xff;

  Main.main();
}

export function initbonusmode() {
  bonusmode = true;
  erasebonus();
  Pc.ginten(1);
  bonustimeleft = 250 - Main.levof10() * 20;
  startbonustimeleft = 20;
  eatmsc = 1;
}

export function initdigger() {
  diggerv = 9;
  digmdir = 4;
  diggerh = 7;
  diggerx = diggerh * 20 + 12;
  digdir = 0;
  diggerrx = 0;
  diggerry = 0;
  digtime = 0;
  digonscr = true;
  deathstage = 1;
  diggervisible = true;
  diggery = diggerv * 18 + 18;
  Sprite.movedrawspr(0, diggerx, diggery);
  notfiring = true;
  emocttime = 0;
  emn = 0;
  bonusvisible = bonusmode = false;
  Input.firepressed_w(false);
  expsn = 0;
  rechargetime = 0;
}

function keyDown(e) {
  e = e || window.event;
  var key = e.keyCode;
  switch (key) {
    case 37 /*1006*/
    :
      Input.processkey(0x4b);
      break;
    case 39 /*1007*/
    :
      Input.processkey(0x4d);
      break;
    case 38 /*1004*/
    :
      Input.processkey(0x48);
      break;
    case 40 /*1005*/
    :
      Input.processkey(0x50);
      break;
    case 32 /*1008*/
    :
      Input.processkey(0x3b);
      break;
    default:
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
}

function keyUp(e) {
  e = e || window.event;
  var key = e.keyCode;
  switch (key) {
    case 37 /*1006*/
    :
      Input.processkey(0xcb);
      break;
    case 39 /*1007*/
    :
      Input.processkey(0xcd);
      break;
    case 38 /*1004*/
    :
      Input.processkey(0xc8);
      break;
    case 40 /*1005*/
    :
      Input.processkey(0xd0);
      break;
    case 32 /*1008*/
    :
      Input.processkey(0xbb);
      break;
    default:
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
}

function keyPress(e) {
  e = e || window.event;
  switch (e.keyCode) {
    case 37:
    case 38:
    case 39:
    case 40:
    case 32:
      break;
    default:
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
}

export function killdigger(stage, bag) {
  if (deathstage < 2 || deathstage > 4) {
    digonscr = false;
    deathstage = stage;
    deathbag = bag;
  }
}

export function killemerald(x, y) {
  if ((emfield[y * 15 + x + 15] & emmask) != 0) {
    emfield[y * 15 + x + 15] &= ~emmask;
    Drawing.eraseemerald(x * 20 + 12, (y + 1) * 18 + 21);
  }
}

export function killfire() {
  if (!notfiring) {
    notfiring = true;
    Sprite.erasespr(15);
    Sound.soundfireoff();
  }
}

export function makeemfield() {
  var x, y;
  emmask = 1 << Main.getcplayer();
  for (x = 0; x < 15; x++)
    for (y = 0; y < 10; y++)
      if (Main.getlevch(x, y, Main.levplan()) == 'C')
        emfield[y * 15 + x] |= emmask;
      else
        emfield[y * 15 + x] &= ~emmask;
}

export function newframe() {
  Input.checkkeyb();
  curtime += frametime;
  /*  var l = time - Pc.gethrt ();
    if (l>0) try { Thread.sleep ((int)l); } catch (Exception e) { } */
  gcty.putImageData(gimg, 0, 0);
  dctx.drawImage(gcnv, 0, 0, dcnv.width, dcnv.height);
}

export function reversedir(dir) {
  switch (dir) {
    case 0:
      return 4;
    case 4:
      return 0;
    case 2:
      return 6;
    case 6:
      return 2;
  }
  return dir;
}

export function updatedigger() {
  var dir, ddir, clbits, diggerox, diggeroy, nmon;
  var push = false;
  Input.readdir();
  dir = Input.getdir();
  if (dir == 0 || dir == 2 || dir == 4 || dir == 6)
    ddir = dir;
  else
    ddir = -1;
  if (diggerrx == 0 && (ddir == 2 || ddir == 6))
    digdir = digmdir = ddir;
  if (diggerry == 0 && (ddir == 4 || ddir == 0))
    digdir = digmdir = ddir;
  if (dir == -1)
    digmdir = -1;
  else
    digmdir = digdir;
  if ((diggerx == 292 && digmdir == 0) || (diggerx == 12 && digmdir == 4) ||
      (diggery == 180 && digmdir == 6) || (diggery == 18 && digmdir == 2))
    digmdir = -1;
  diggerox = diggerx;
  diggeroy = diggery;
  if (digmdir != -1)
    Drawing.eatfield(diggerox, diggeroy, digmdir);
  switch (digmdir) {
    case 0:
      Drawing.drawrightblob(diggerx, diggery);
      diggerx += 4;
      break;
    case 4:
      Drawing.drawleftblob(diggerx, diggery);
      diggerx -= 4;
      break;
    case 2:
      Drawing.drawtopblob(diggerx, diggery);
      diggery -= 3;
      break;
    case 6:
      Drawing.drawbottomblob(diggerx, diggery);
      diggery += 3;
      break;
  }
  if (hitemerald(Math.floor((diggerx - 12) / 20), Math.floor((diggery - 18) / 18),
      (diggerx - 12) % 20, (diggery - 18) % 18, digmdir)) {
    if (emocttime == 0)
      emn = 0;
    Scores.scoreemerald();
    Sound.soundem();
    Sound.soundemerald(emn); //emocttime);
    emn++;
    if (emn == 8) {
      emn = 0;
      Scores.scoreoctave();
    }
    emocttime = 9;
  }
  clbits = Drawing.drawdigger(digdir, diggerx, diggery, notfiring && rechargetime == 0);
  Main.incpenalty();
  if ((Bags.bagbits() & clbits) != 0) {
    if (digmdir == 0 || digmdir == 4) {
      push = Bags.pushbags(digmdir, clbits);
      digtime++;
    } else if (!Bags.pushudbags(clbits))
      push = false;
    if (!push) { /* Strange, push not completely defined */
      diggerx = diggerox;
      diggery = diggeroy;
      Drawing.drawdigger(digmdir, diggerx, diggery, notfiring && rechargetime == 0);
      Main.incpenalty();
      digdir = reversedir(digmdir);
    }
  }
  if (((clbits & 0x3f00) != 0) && bonusmode)
    for (nmon = Monster.killmonsters(clbits); nmon != 0; nmon--) {
      Sound.soundeatm();
      Scores.scoreeatm();
    }
  if ((clbits & 0x4000) != 0) {
    Scores.scorebonus();
    initbonusmode();
  }
  diggerh = Math.floor((diggerx - 12) / 20);
  diggerrx = (diggerx - 12) % 20;
  diggerv = Math.floor((diggery - 18) / 18);
  diggerry = (diggery - 18) % 18;
}

export function updatefire() {
  var clbits, b, mon, pix = 0;
  if (notfiring) {
    if (rechargetime != 0)
      rechargetime--;
    else if (Input.getfirepflag())
      if (digonscr) {
        rechargetime = Main.levof10() * 3 + 60;
        notfiring = false;
        switch (digdir) {
          case 0:
            firex = diggerx + 8;
            firey = diggery + 4;
            break;
          case 4:
            firex = diggerx;
            firey = diggery + 4;
            break;
          case 2:
            firex = diggerx + 4;
            firey = diggery;
            break;
          case 6:
            firex = diggerx + 4;
            firey = diggery + 8;
        }
        firedir = digdir;
        Sprite.movedrawspr(15, firex, firey);
        Sound.soundfire();
      }
  } else {
    switch (firedir) {
      case 0:
        firex += 8;
        pix = Pc.ggetpix(firex, firey + 4) | Pc.ggetpix(firex + 4, firey + 4);
        break;
      case 4:
        firex -= 8;
        pix = Pc.ggetpix(firex, firey + 4) | Pc.ggetpix(firex + 4, firey + 4);
        break;
      case 2:
        firey -= 7;
        pix = (Pc.ggetpix(firex + 4, firey) | Pc.ggetpix(firex + 4, firey + 1) |
            Pc.ggetpix(firex + 4, firey + 2) | Pc.ggetpix(firex + 4, firey + 3) |
            Pc.ggetpix(firex + 4, firey + 4) | Pc.ggetpix(firex + 4, firey + 5) |
            Pc.ggetpix(firex + 4, firey + 6)) & 0xc0;
        break;
      case 6:
        firey += 7;
        pix = (Pc.ggetpix(firex, firey) | Pc.ggetpix(firex, firey + 1) |
            Pc.ggetpix(firex, firey + 2) | Pc.ggetpix(firex, firey + 3) |
            Pc.ggetpix(firex, firey + 4) | Pc.ggetpix(firex, firey + 5) |
            Pc.ggetpix(firex, firey + 6)) & 3;
        break;
    }
    clbits = Drawing.drawfire(firex, firey, 0);
    Main.incpenalty();
    if ((clbits & 0x3f00) != 0)
      for (mon = 0, b = 256; mon < 6; mon++, b <<= 1)
        if ((clbits & b) != 0) {
          Monster.killmon(mon);
          Scores.scorekill();
          expsn = 1;
        }
    if ((clbits & 0x40fe) != 0)
      expsn = 1;
    switch (firedir) {
      case 0:
        if (firex > 296)
          expsn = 1;
        else if (pix != 0 && clbits == 0) {
          expsn = 1;
          firex -= 8;
          Drawing.drawfire(firex, firey, 0);
        }
        break;
      case 4:
        if (firex < 16)
          expsn = 1;
        else if (pix != 0 && clbits == 0) {
          expsn = 1;
          firex += 8;
          Drawing.drawfire(firex, firey, 0);
        }
        break;
      case 2:
        if (firey < 15)
          expsn = 1;
        else if (pix != 0 && clbits == 0) {
          expsn = 1;
          firey += 7;
          Drawing.drawfire(firex, firey, 0);
        }
        break;
      case 6:
        if (firey > 183)
          expsn = 1;
        else if (pix != 0 && clbits == 0) {
          expsn = 1;
          firey -= 7;
          Drawing.drawfire(firex, firey, 0);
        }
    }
  }
}


/*Bags: Bags,
	Main: Main,
	Sound: Sound,
	Monster: Monster,
	Scores: Scores,
	Sprite: Sprite,
	Drawing: Drawing,
	Input: Input,
	Pc: Pc,*/
export const bonusmode_r = function() { return bonusmode; }
export const bonusvisible_w = function(x) { bonusvisible = x; }
export const diggerx_r = function() { return diggerx; }
export const diggery_r = function() { return diggery; }
export const digonscr_r = function() { return digonscr; }
export const digtime_w = function(x) { digtime = x; }
export const atmsc_r = function() { return eatmsc; }
export const eatmsc_w = function(x) { eatmsc = x; }
export const time_w = function(x) { curtime = x; }

export const getgpix = function() { return gpix; }
