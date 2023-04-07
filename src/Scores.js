var highbuf = new Array(10);	// char
var scorehigh = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// [12]
var scoreinit = new Array(11);	//string
var scoret = 0, score1 = 0, score2 = 0, nextbs1 = 0, nextbs2 = 0;
var hsbuf;
var scorebuf = new Array(512);	//char
var bonusscore = 20000;
var gotinitflag = false;


export function addscore(score) {
  if (Main.getcplayer() == 0) {
    score1 += score;
    if (score1 > 999999)
      score1 = 0;
    writenum(score1, 0, 0, 6, 1);
    if (score1 >= nextbs1) {
      if (Main.getlives(1) < 5) {
        Main.addlife(1);
        Drawing.drawlives();
      }
      nextbs1 += bonusscore;
    }
  } else {
    score2 += score;
    if (score2 > 999999)
      score2 = 0;
    if (score2 < 100000)
      writenum(score2, 236, 0, 6, 1);
    else
      writenum(score2, 248, 0, 6, 1);
    if (score2 > nextbs2) {   /* Player 2 doesn't get the life until >20,000 ! */
      if (Main.getlives(2) < 5) {
        Main.addlife(2);
        Drawing.drawlives();
      }
      nextbs2 += bonusscore;
    }
  }
  Main.incpenalty();
  Main.incpenalty();
  Main.incpenalty();
}

export function drawscores() {
  writenum(score1, 0, 0, 6, 3);
  if (Main.getnplayers() == 2)
    if (score2 < 100000)
      writenum(score2, 236, 0, 6, 3);
    else
      writenum(score2, 248, 0, 6, 3);
}

export function endofgame() {
  var i, j, z;
  addscore(0);
  if (Main.getcplayer() == 0)
    scoret = score1;
  else
    scoret = score2;
  if (scoret > scorehigh[11]) {
    Pc.gclear();
    drawscores();
    Drawing.outtext("PLAYER " + (Main.getcplayer() + 1), 108, 0, 2, true);
    Drawing.outtext(" NEW HIGH SCORE ", 64, 40, 2, true);
    getinitials();
    shufflehigh();
    savescores();
  } else {
    Main.cleartopline();
    Drawing.outtext("GAME OVER", 104, 0, 3, true);
    Sound.killsound();
    for (j = 0; j < 20; j++) /* Number of times screen flashes * 2 */
      for (i = 0; i < 2; i++) { //i<8;i++) {
        Sprite.setretr(true);
//		Pc.ginten(1-(j&1));
        Pc.gpal(1 - (j & 1));
        Sprite.setretr(false);
        //for (z=0;z<111;z++); /* A delay loop */
        Pc.gpal(0);
//		Pc.ginten(0);
        Pc.ginten(1 - i & 1);
        Digger.newframe();
      }
    Sound.setupsound();
    Drawing.outtext("         ", 104, 0, 3, true);
    Sprite.setretr(true);
  }
}

export function flashywait(n) {
  /*  int i,gt,cx,p=0,k=1;
    int gap=19;
    Sprite.setretr(false);
    for (i=0;i<(n<<1);i++) {
    for (cx=0;cx<Sound.getvolume();cx++) {
      Pc.gpal(p=1-p);
      for (gt=0;gt<gap;gt++);
    }
    } */
}

export function getinitial(x, y) {
  var i, j;
  Input.keypressed_w(0);
  Pc.gwrite(x, y, '_', 3, true);
  for (j = 0; j < 5; j++) {
    for (i = 0; i < 40; i++) {
      if ((Input.keypressed_r() & 0x80) == 0 && Input.keypressed_r() != 0)
        return Input.keypressed_r();
      flashywait(15);
    }
    for (i = 0; i < 40; i++) {
      if ((Input.keypressed_r() & 0x80) == 0 && Input.keypressed_r() != 0) {
        Pc.gwrite(x, y, '_', 3, true);
        return Input.keypressed_r();
      }
      flashywait(15);
    }
  }
  gotinitflag = true;
  return 0;
}

export function getinitials() {
  var k, i;
  Drawing.outtext("ENTER YOUR", 100, 70, 3, true);
  Drawing.outtext(" INITIALS", 100, 90, 3, true);
  Drawing.outtext("_ _ _", 128, 130, 3, true);
  scoreinit[0] = "...";
  Sound.killsound();
  gotinitflag = false;
  for (i = 0; i < 3; i++) {
    k = 0;
    while (k == 0 && !gotinitflag) {
      k = getinitial(i * 24 + 128, 130);
      if (i != 0 && k == 8)
        i--;
      k = Input.getasciikey(k);
    }
    if (k != 0) {
      Pc.gwrite(i * 24 + 128, 130, k, 3, true);
      //scoreinit[0].setCharAt(i, String.fromCharCode(k));
    }
  }
  Input.keypressed_w(0);
  for (i = 0; i < 20; i++)
    flashywait(15);
  Sound.setupsound();
  Pc.gclear();
  Pc.gpal(0);
  Pc.ginten(0);
  Digger.newframe();	// needed by Java version!!
  Sprite.setretr(true);
}

export function initscores() {
  addscore(0);
}

export function loadscores() {
  var p = 1, i, x;
  //readscores();
  for (i = 1; i < 11; i++) {
    for (x = 0; x < 3; x++)
      scoreinit[i] = "..."; //  scorebuf[p++];
    p += 2;
    for (x = 0; x < 6; x++)
      highbuf[x] = scorebuf[p++];
    scorehigh[i + 1] = 0; //atol(highbuf);
  }
  if (scorebuf[0] != 's')
    for (i = 0; i < 11; i++) {
      scorehigh[i + 1] = 0;
      scoreinit[i] = "...";
    }
  var ds = null;
  if (ds = window.localStorage.getItem("ds")) {
    var st = ds.split(' ');
    for (i = 0; i < st.length && i < 11; i++)
      scorehigh[i + 2] = st[i];
  }
}

function savescores() {
  var i, st = '';
  for (i = 0; i < 10; i++)
    st += (i > 0 ? ' ' : '') + scorehigh[i + 2];
  window.localStorage.setItem("ds", st);
}

function numtostring(n) {
  var x;
  var p = "";
  for (x = 0; x < 6; x++) {
    p = String(n % 10) + p;
    n = Math.floor(n / 10);
    if (n == 0) {
      x++;
      break;
    }
  }
  for (; x < 6; x++)
    p = ' ' + p;
  return p;
}

function scorebonus() {
  addscore(1000);
}

function scoreeatm() {
  addscore(Digger.eatmsc_r() * 200);
  Digger.eatmsc_w(Digger.eatmsc_r() << 1);
}

function scoreemerald() {
  addscore(25);
}

function scoregold() {
  addscore(500);
}

function scorekill() {
  addscore(250);
}

function scoreoctave() {
  addscore(250);
}

export function showtable() {
  var i, col;
  Drawing.outtext("HIGH SCORES", 16, 25, 3);
  col = 2;
  for (i = 1; i < 11; i++) {
    hsbuf = scoreinit[i] + "  " + numtostring(scorehigh[i + 1]);
    Drawing.outtext(hsbuf, 16, 31 + 13 * i, col);
    col = 1;
  }
}

function shufflehigh() {
  var i, j;
  for (j = 10; j > 1; j--)
    if (scoret < scorehigh[j])
      break;
  for (i = 10; i > j; i--) {
    scorehigh[i + 1] = scorehigh[i];
    scoreinit[i] = scoreinit[i - 1];
  }
  scorehigh[j + 1] = scoret;
  scoreinit[j] = scoreinit[0];
}

export function writecurscore(bp6) {
  if (Main.getcplayer() == 0)
    writenum(score1, 0, 0, 6, bp6);
  else if (score2 < 100000)
    writenum(score2, 236, 0, 6, bp6);
  else
    writenum(score2, 248, 0, 6, bp6);
}

function writenum(n, x, y, w, c) {
  var d, xp = (w - 1) * 12 + x;
  while (w > 0) {
    d = (n % 10);
    if (w > 1 || d > 0)
      Pc.gwrite(xp, y, d + '0', c, false);	//true
    n = Math.floor(n / 10);
    w--;
    xp -= 12;
  }
}

export function zeroscores() {
  score2 = 0;
  score1 = 0;
  scoret = 0;
  nextbs1 = bonusscore;
  nextbs2 = bonusscore;
}

//
// return {
// numtostring: numtostring,
// scorebonus: scorebonus,
// scoreeatm: scoreeatm,
// scoreemerald: scoreemerald,
// scoregold: scoregold,
// scorekill: scorekill,
// scoreoctave: scoreoctave,
// shufflehigh: shufflehigh,
// writenum: writenum,
// }
