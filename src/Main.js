import * as Pc from "./Pc";
import * as Sprite from "./Sprite";
import * as Input from "./Input";
import * as Scores from "./Scores";
import * as Drawing from "./Drawing";
import * as Sound from "./Sound";
import * as Digger from "./Digger";
import * as Bags from "./Bags";
import * as Monster from "./Monster";


export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}


function _game() {
  this.lives = this.level = 0;
  this.dead = this.levdone = false;
}


var digsprorder = [14, 13, 7, 6, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8, 15, 0];	// [16]

var gamedat = [new _game(), new _game()];

var pldispbuf = "";

var curplayer = 0, nplayers = 0, penalty = 0;
var levnotdrawn = false, flashplayer = false;

var levfflag = false;
var biosflag = false;
var speedmul = 40;
var delaytime = 0;

var randv;

var leveldat =		// [8][10][15]
    [["S   B     HHHHS",
      "V  CC  C  V B  ",
      "VB CC  C  V    ",
      "V  CCB CB V CCC",
      "V  CC  C  V CCC",
      "HH CC  C  V CCC",
      " V    B B V    ",
      " HHHH     V    ",
      "C   V     V   C",
      "CC  HHHHHHH  CC"],
      ["SHHHHH  B B  HS",
        " CC  V       V ",
        " CC  V CCCCC V ",
        "BCCB V CCCCC V ",
        "CCCC V       V ",
        "CCCC V B  HHHH ",
        " CC  V CC V    ",
        " BB  VCCCCV CC ",
        "C    V CC V CC ",
        "CC   HHHHHH    "],
      ["SHHHHB B BHHHHS",
        "CC  V C C V BB ",
        "C   V C C V CC ",
        " BB V C C VCCCC",
        "CCCCV C C VCCCC",
        "CCCCHHHHHHH CC ",
        " CC  C V C  CC ",
        " CC  C V C     ",
        "C    C V C    C",
        "CC   C H C   CC"],
      ["SHBCCCCBCCCCBHS",
        "CV  CCCCCCC  VC",
        "CHHH CCCCC HHHC",
        "C  V  CCC  V  C",
        "   HHH C HHH   ",
        "  B  V B V  B  ",
        "  C  VCCCV  C  ",
        " CCC HHHHH CCC ",
        "CCCCC CVC CCCCC",
        "CCCCC CHC CCCCC"],
      ["SHHHHHHHHHHHHHS",
        "VBCCCCBVCCCCCCV",
        "VCCCCCCV CCBC V",
        "V CCCC VCCBCCCV",
        "VCCCCCCV CCCC V",
        "V CCCC VBCCCCCV",
        "VCCBCCCV CCCC V",
        "V CCBC VCCCCCCV",
        "VCCCCCCVCCCCCCV",
        "HHHHHHHHHHHHHHH"],
      ["SHHHHHHHHHHHHHS",
        "VCBCCV V VCCBCV",
        "VCCC VBVBV CCCV",
        "VCCCHH V HHCCCV",
        "VCC V CVC V CCV",
        "VCCHH CVC HHCCV",
        "VC V CCVCC V CV",
        "VCHHBCCVCCBHHCV",
        "VCVCCCCVCCCCVCV",
        "HHHHHHHHHHHHHHH"],
      ["SHCCCCCVCCCCCHS",
        " VCBCBCVCBCBCV ",
        "BVCCCCCVCCCCCVB",
        "CHHCCCCVCCCCHHC",
        "CCV CCCVCCC VCC",
        "CCHHHCCVCCHHHCC",
        "CCCCV CVC VCCCC",
        "CCCCHH V HHCCCC",
        "CCCCCV V VCCCCC",
        "CCCCCHHHHHCCCCC"],
      ["HHHHHHHHHHHHHHS",
        "V CCBCCCCCBCC V",
        "HHHCCCCBCCCCHHH",
        "VBV CCCCCCC VBV",
        "VCHHHCCCCCHHHCV",
        "VCCBV CCC VBCCV",
        "VCCCHHHCHHHCCCV",
        "VCCCC V V CCCCV",
        "VCCCCCV VCCCCCV",
        "HHHHHHHHHHHHHHH"]];


export function addlife(pl) {
  gamedat[pl - 1].lives++;
  Sound.sound1up();
}

export function calibrate() {
  /*  Sound.setvolume(Math.floor(Pc.getkips()/291));
    if (Sound.getvolume()==0)
    Sound.setvolume(1);
  */
}

export function checklevdone() {
  if ((Digger.countem() == 0 || Monster.monleft() == 0) && Digger.digonscr_r())
    gamedat[curplayer].levdone = true;
  else
    gamedat[curplayer].levdone = false;
}

export function cleartopline() {
  Drawing.outtext("                          ", 0, 0, 3);
  Drawing.outtext(" ", 308, 0, 3);
}

export async function drawscreen() {
  Drawing.creatembspr();
  await Drawing.drawstatics();
  await Bags.drawbags();
  await Digger.drawemeralds();
  Digger.initdigger();
  Monster.initmonsters();
}

export function getnplayers() {
  return nplayers;
}

export function getcplayer() {
  return curplayer;
}

export function getlevch(x, y, l) {
  if (l == 0)
    l++;
  return leveldat[l - 1][y].charAt(x);
}

export function getlives(pl) {
  return gamedat[pl - 1].lives;
}

export function incpenalty() {
  penalty++;
}

export function initchars() {
  Drawing.initmbspr();
  Digger.initdigger();
  Monster.initmonsters();
}

export function initlevel() {
  gamedat[curplayer].levdone = false;
  Drawing.makefield();
  Digger.makeemfield();
  Bags.initbags();
  levnotdrawn = true;
}

export function levno() {
  return gamedat[curplayer].level;
}

export function levof10() {
  if (gamedat[curplayer].level > 10)
    return 10;
  return gamedat[curplayer].level;
}

export function levplan() {
  var l = levno();
  if (l > 8)
    l = (l & 3) + 5; /* Level plan: 12345678, 678, (5678) 247 times, 5 forever */
  return l;
}


var INT = Math.floor(1000 / 13);

export async function main() {

  var frame, t, x = 0;
  var start;

  randv = Pc.gethrt();

  calibrate();
  // parsecmd(argc,argv);
  // Digger.ftime=speedmul*2000;
  Sprite.setretr(false);
  Pc.ginit();
  Sprite.setretr(true);
  Pc.gpal(0);
  Input.initkeyb();
  Input.detectjoy();
  Scores.loadscores();

  Sound.initsound();

  nplayers = 1;

  do {

    Sound.soundstop();
    Sprite.setsprorder(digsprorder);
    Drawing.creatembspr();
    Input.detectjoy();
    Pc.gclear();
    Pc.gtitle();
    Drawing.outtext("D I G G E R", 100, 0, 3);
    shownplayers();
    Scores.showtable();
    start = false;
    frame = 1;

    Digger.time_w(Pc.gethrt());

    await new Promise(resolve => {
      var intv = setInterval(function () {

        //while (!start) {
        if (!start) {
          start = Input.teststart();
          if (Input.akeypressed_r() == 27) {  //	esc
            switchnplayers();
            shownplayers();
            Input.akeypressed_w(0);
            Input.keypressed_w(0);
          }
          if (frame == 0)
            for (t = 54; t < 174; t += 12)
              Drawing.outtext("            ", 164, t, 0);
          if (frame == 50) {
            Sprite.movedrawspr(8, 292, 63);
            x = 292;
          }
          if (frame > 50 && frame <= 77) {
            x -= 4;
            Drawing.drawmon(0, true, 4, x, 63);
          }
          if (frame > 77)
            Drawing.drawmon(0, true, 0, 184, 63);
          if (frame == 83)
            Drawing.outtext("NOBBIN", 216, 64, 2);
          if (frame == 90) {
            Sprite.movedrawspr(9, 292, 82);
            Drawing.drawmon(1, false, 4, 292, 82);
            x = 292;
          }
          if (frame > 90 && frame <= 117) {
            x -= 4;
            Drawing.drawmon(1, false, 4, x, 82);
          }
          if (frame > 117)
            Drawing.drawmon(1, false, 0, 184, 82);
          if (frame == 123)
            Drawing.outtext("HOBBIN", 216, 83, 2);
          if (frame == 130) {
            Sprite.movedrawspr(0, 292, 101);
            Drawing.drawdigger(4, 292, 101, true);
            x = 292;
          }
          if (frame > 130 && frame <= 157) {
            x -= 4;
            Drawing.drawdigger(4, x, 101, true);
          }
          if (frame > 157)
            Drawing.drawdigger(0, 184, 101, true);
          if (frame == 163)
            Drawing.outtext("DIGGER", 216, 102, 2);
          if (frame == 178) {
            Sprite.movedrawspr(1, 184, 120);
            Drawing.drawgold(1, 0, 184, 120);
          }
          if (frame == 183)
            Drawing.outtext("GOLD", 216, 121, 2);
          if (frame == 198)
            Drawing.drawemerald(184, 141);
          if (frame == 203)
            Drawing.outtext("EMERALD", 216, 140, 2);
          if (frame == 218)
            Drawing.drawbonus(184, 158);
          if (frame == 223)
            Drawing.outtext("BONUS", 216, 159, 2);
          Digger.newframe();
          frame++;
          if (frame > 250)
            frame = 0;
        } else {
          clearInterval(intv);
          resolve();
        }

      }, INT);
    });  // interval + promise


    gamedat[0].level = 1;
    gamedat[0].lives = 3;
    if (nplayers == 2) {
      gamedat[1].level = 1;
      gamedat[1].lives = 3;
    } else
      gamedat[1].lives = 0;
    Pc.gclear();
    curplayer = 0;
    initlevel();
    curplayer = 1;
    initlevel();
    Scores.zeroscores();
    Digger.bonusvisible_w(true);
    if (nplayers == 2)
      flashplayer = true;
    curplayer = 0;
//	if (Input.escape_r())
//	  break;
//    if (recording)
//	  recputinit();


    while ((gamedat[0].lives != 0 || gamedat[1].lives != 0) && !Input.escape_r()) {
      gamedat[curplayer].dead = false;
      while (!gamedat[curplayer].dead && gamedat[curplayer].lives != 0 && !Input.escape_r()) {
        Drawing.initmbspr();
        await play();
      }
      if (gamedat[1 - curplayer].lives != 0) {
        curplayer = 1 - curplayer;
        flashplayer = levnotdrawn = true;
      }
    }


    //Input.escape_w(false);

  } while (!false); //Input.escape_r());

//  Sound.soundoff();  // not reachable in js
//  restorekeyb();
//  graphicsoff();
}


export async function play() {
  var t, c;

  /*  if (playing)
    randv=recgetrand();
    else
    randv=getlrt();
    if (recording)
    recputrand(randv); */

  if (levnotdrawn) {
    levnotdrawn = false;
    await drawscreen();
    Digger.time_w(Pc.gethrt());
    if (flashplayer) {
      flashplayer = false;
      pldispbuf = "PLAYER ";
      if (curplayer == 0)
        pldispbuf += "1";
      else
        pldispbuf += "2";
      cleartopline();
      for (t = 0; t < 15; t++)
        for (c = 1; c <= 3; c++) {
          Drawing.outtext(pldispbuf, 108, 0, c);
          Scores.writecurscore(c);
          /* olddelay(20); */
          Digger.newframe();
          if (Input.escape_r())
            return;
        }
      Scores.drawscores();
      Scores.addscore(0);
    }
  } else
    initchars();

//await Sound.soundlevdone();

  Input.keypressed_w(0);
  Drawing.outtext("        ", 108, 0, 3);
  Scores.initscores();
  Drawing.drawlives();
  Sound.music(1);
  Input.readdir();
  Digger.time_w(Pc.gethrt());

//console.log("play-part1");

  await new Promise(resolve => {
    var intv = setInterval(function () {

      //while (!gamedat[curplayer].dead && !gamedat[curplayer].levdone && !Input.escape_r()) {
      if (!gamedat[curplayer].dead && !gamedat[curplayer].levdone && !Input.escape_r()) {

        penalty = 0;
        Digger.dodigger();
        Monster.domonsters();
        Bags.dobags();
        /*  if (penalty<8)
            for (t=(8-penalty)*5;t>0;t--)
            olddelay(1); */
        if (penalty > 8)
          Monster.incmont(penalty - 8);
        testpause();
        checklevdone();
      } else {
        clearInterval(intv);
        resolve();
      }

    }, INT);
  });

  Digger.erasedigger();
  Sound.musicoff();
  t = 20;

//console.log("play-part2");

  await new Promise(resolve => {
    var intv = setInterval(function () {

      //while ((Bags.getnmovingbags()!=0 || t!=0) && !Input.escape_r()) {
      if ((Bags.getnmovingbags() != 0 || t != 0) && !Input.escape_r()) {
        if (t != 0)
          t--;
        penalty = 0;
        Bags.dobags();
        Digger.dodigger();
        Monster.domonsters();
        if (penalty < 8)
            /*    for (t=(8-penalty)*5;t>0;t--)
                 olddelay(1); */
          t = 0;
      } else {
        clearInterval(intv);
        resolve();
      }

    }, INT);
  });

//console.log("play-done");

  Sound.soundstop();
  Digger.killfire();
  Digger.erasebonus();
  Bags.cleanupbags();
  Drawing.savefield();
  Monster.erasemonsters();
  Digger.newframe();  //js
  if (gamedat[curplayer].levdone)
    await sleep(12 * INT);
  //await Sound.soundlevdone();  // FIX, sounds odd
  if (Digger.countem() == 0) {
    gamedat[curplayer].level++;
    if (gamedat[curplayer].level > 1000)
      gamedat[curplayer].level = 1000;
    initlevel();
  }
  if (gamedat[curplayer].dead) {
    gamedat[curplayer].lives--;
    Drawing.drawlives();
    if (gamedat[curplayer].lives == 0 && !Input.escape_r())
      Scores.endofgame();
  }
  if (gamedat[curplayer].levdone) {
    gamedat[curplayer].level++;
    if (gamedat[curplayer].level > 1000)
      gamedat[curplayer].level = 1000;
    initlevel();
  }
}

export function randno(n) {
  randv = (randv * 0x15a4e35 + 1) & 0x7fffffff;
  return (randv & 0x7fffffff) % n;
}

export function setdead(bp6) {
  gamedat[curplayer].dead = bp6;
}

export function shownplayers() {
  if (nplayers == 1) {
    Drawing.outtext("ONE", 220, 25, 3);
    Drawing.outtext(" PLAYER ", 192, 39, 3);
  } else {
    Drawing.outtext("TWO", 220, 25, 3);
    Drawing.outtext(" PLAYERS", 184, 39, 3);
  }
}

export function switchnplayers() {
  nplayers = 3 - nplayers;
}

export function testpause() {
  if (Input.akeypressed_r() == 32) { /* Space bar */
    Input.akeypressed_w(0);
    Sound.soundpause();
    Sound.sett2val(40);
    Sound.setsoundt2();
    cleartopline();
    Drawing.outtext("PRESS ANY KEY", 80, 0, 1);
    Digger.newframe();  //js
    Input.keypressed_w(0);
    while (true) {
      /*		try { Thread.sleep (50); } catch (Exception e) { } */
      if (Input.keypressed_r() != 0)
        break;
    }
    cleartopline();
    Scores.drawscores();
    Scores.addscore(0);
    Drawing.drawlives();
    Digger.newframe();  //js
    Digger.time_w(Pc.gethrt() - Digger.frametime);
//	olddelay(200);
    Input.keypressed_w(0);
  } else
    Sound.soundpauseoff();
}
