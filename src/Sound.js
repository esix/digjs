import * as Digger from "./Digger";
import {time_w} from "./Digger";

var wavetype = 0, musvol = 0;
var spkrmode = 0, timerrate = 0x7d0;
var timercount = 0, t2val = 0, t0val = 0;  //uint4
var pulsewidth = 1;
var volume = 1;	// 0

var timerclock = 0;		// sint3 (not imp)

var soundflag = true, musicflag = true;

var sndflag = false, soundpausedflag = false;

var soundlevdoneflag = false;
var nljpointer = 0, nljnoteduration = 0;

var newlevjingle = [0x8e8, 0x712, 0x5f2, 0x7f0, 0x6ac, 0x54c, 0x712, 0x5f2, 0x4b8, 0x474, 0x474];	// [11]

var soundfallflag = false, soundfallf = false;
var soundfallvalue, soundfalln = 0;

var soundbreakflag = false;
var soundbreakduration = 0, soundbreakvalue = 0;

var soundwobbleflag = false;
var soundwobblen = 0;

var soundfireflag = false;
var soundfirevalue, soundfiren = 0;

var soundexplodeflag = false;
var soundexplodevalue, soundexplodeduration;

var soundbonusflag = false;
var soundbonusn = 0;

var soundemflag = false;

var soundemeraldflag = false;
var soundemeraldduration, emerfreq, soundemeraldn;

var emfreqs = [0x8e8, 0x7f0, 0x712, 0x6ac, 0x5f2, 0x54c, 0x4b8, 0x474];

var soundgoldflag = false, soundgoldf = false;
var soundgoldvalue1, soundgoldvalue2, soundgoldduration;

var soundeatmflag = false;
var soundeatmvalue, soundeatmduration, soundeatmn;

var soundddieflag = false;
var soundddien, soundddievalue;

var sound1upflag = false;
var sound1upduration = 0;

var musicplaying = false;
var musicp = 0, tuneno = 0, noteduration = 0, notevalue = 0, musicmaxvol = 0, musicattackrate = 0,
    musicsustainlevel = 0, musicdecayrate = 0, musicnotewidth = 0, musicreleaserate = 0, musicstage = 0, musicn = 0;

var bonusjingle = [	// [321]
  0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2,
  0xd59, 4, 0xbe4, 4, 0xa98, 4, 0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2,
  0x11d1, 4, 0xd59, 2, 0xa98, 2, 0xbe4, 4, 0xe24, 4, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2,
  0x11d1, 4, 0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2, 0xd59, 4, 0xbe4, 4,
  0xa98, 4, 0xd59, 2, 0xa98, 2, 0x8e8, 10, 0xa00, 2, 0xa98, 2, 0xbe4, 2, 0xd59, 4,
  0xa98, 4, 0xd59, 4, 0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2, 0x11d1, 4,
  0x11d1, 2, 0x11d1, 2, 0xd59, 4, 0xbe4, 4, 0xa98, 4, 0x11d1, 2, 0x11d1, 2, 0x11d1, 4,
  0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0xd59, 2, 0xa98, 2, 0xbe4, 4, 0xe24, 4, 0x11d1, 4,
  0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2, 0x11d1, 4, 0x11d1, 2, 0x11d1, 2,
  0xd59, 4, 0xbe4, 4, 0xa98, 4, 0xd59, 2, 0xa98, 2, 0x8e8, 10, 0xa00, 2, 0xa98, 2,
  0xbe4, 2, 0xd59, 4, 0xa98, 4, 0xd59, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4, 0xa98, 2,
  0xa98, 2, 0xa98, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4, 0x7f0, 4, 0xa98, 4, 0x7f0, 4,
  0xa98, 4, 0x7f0, 4, 0xa98, 4, 0xbe4, 4, 0xd59, 4, 0xe24, 4, 0xfdf, 4, 0xa98, 2,
  0xa98, 2, 0xa98, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4,
  0x7f0, 4, 0xa98, 4, 0x7f0, 4, 0xa98, 4, 0x7f0, 4, 0x8e8, 4, 0x970, 4, 0x8e8, 4,
  0x970, 4, 0x8e8, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4,
  0xa98, 2, 0xa98, 2, 0xa98, 4, 0x7f0, 4, 0xa98, 4, 0x7f0, 4, 0xa98, 4, 0x7f0, 4,
  0xa98, 4, 0xbe4, 4, 0xd59, 4, 0xe24, 4, 0xfdf, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4,
  0xa98, 2, 0xa98, 2, 0xa98, 4, 0xa98, 2, 0xa98, 2, 0xa98, 4, 0x7f0, 4, 0xa98, 4,
  0x7f0, 4, 0xa98, 4, 0x7f0, 4, 0x8e8, 4, 0x970, 4, 0x8e8, 4, 0x970, 4, 0x8e8, 4,
  0x7d64];

var backgjingle = [	// [291]
  0xfdf, 2, 0x11d1, 2, 0xfdf, 2, 0x1530, 2, 0x1ab2, 2, 0x1530, 2, 0x1fbf, 4, 0xfdf, 2,
  0x11d1, 2, 0xfdf, 2, 0x1530, 2, 0x1ab2, 2, 0x1530, 2, 0x1fbf, 4, 0xfdf, 2, 0xe24, 2,
  0xd59, 2, 0xe24, 2, 0xd59, 2, 0xfdf, 2, 0xe24, 2, 0xfdf, 2, 0xe24, 2, 0x11d1, 2,
  0xfdf, 2, 0x11d1, 2, 0xfdf, 2, 0x1400, 2, 0xfdf, 4, 0xfdf, 2, 0x11d1, 2, 0xfdf, 2,
  0x1530, 2, 0x1ab2, 2, 0x1530, 2, 0x1fbf, 4, 0xfdf, 2, 0x11d1, 2, 0xfdf, 2, 0x1530, 2,
  0x1ab2, 2, 0x1530, 2, 0x1fbf, 4, 0xfdf, 2, 0xe24, 2, 0xd59, 2, 0xe24, 2, 0xd59, 2,
  0xfdf, 2, 0xe24, 2, 0xfdf, 2, 0xe24, 2, 0x11d1, 2, 0xfdf, 2, 0x11d1, 2, 0xfdf, 2,
  0xe24, 2, 0xd59, 4, 0xa98, 2, 0xbe4, 2, 0xa98, 2, 0xd59, 2, 0x11d1, 2, 0xd59, 2,
  0x1530, 4, 0xa98, 2, 0xbe4, 2, 0xa98, 2, 0xd59, 2, 0x11d1, 2, 0xd59, 2, 0x1530, 4,
  0xa98, 2, 0x970, 2, 0x8e8, 2, 0x970, 2, 0x8e8, 2, 0xa98, 2, 0x970, 2, 0xa98, 2,
  0x970, 2, 0xbe4, 2, 0xa98, 2, 0xbe4, 2, 0xa98, 2, 0xd59, 2, 0xa98, 4, 0xa98, 2,
  0xbe4, 2, 0xa98, 2, 0xd59, 2, 0x11d1, 2, 0xd59, 2, 0x1530, 4, 0xa98, 2, 0xbe4, 2,
  0xa98, 2, 0xd59, 2, 0x11d1, 2, 0xd59, 2, 0x1530, 4, 0xa98, 2, 0x970, 2, 0x8e8, 2,
  0x970, 2, 0x8e8, 2, 0xa98, 2, 0x970, 2, 0xa98, 2, 0x970, 2, 0xbe4, 2, 0xa98, 2,
  0xbe4, 2, 0xa98, 2, 0xd59, 2, 0xa98, 4, 0x7f0, 2, 0x8e8, 2, 0xa98, 2, 0xd59, 2,
  0x11d1, 2, 0xd59, 2, 0x1530, 4, 0xa98, 2, 0xbe4, 2, 0xa98, 2, 0xd59, 2, 0x11d1, 2,
  0xd59, 2, 0x1530, 4, 0xa98, 2, 0x970, 2, 0x8e8, 2, 0x970, 2, 0x8e8, 2, 0xa98, 2,
  0x970, 2, 0xa98, 2, 0x970, 2, 0xbe4, 2, 0xa98, 2, 0xbe4, 2, 0xd59, 2, 0xbe4, 2,
  0xa98, 4, 0x7d64];

var dirge = [
  0x7d00, 2, 0x11d1, 6, 0x11d1, 4, 0x11d1, 2, 0x11d1, 6, 0xefb, 4, 0xfdf, 2,
  0xfdf, 4, 0x11d1, 2, 0x11d1, 4, 0x12e0, 2, 0x11d1, 12, 0x7d00, 16, 0x7d00, 16,
  0x7d00, 16, 0x7d00, 16, 0x7d00, 16, 0x7d00, 16, 0x7d00, 16, 0x7d00, 16, 0x7d00, 16,
  0x7d00, 16, 0x7d00, 16, 0x7d00, 16, 0x7d64];


var soundt0flag = false;

var int8flag = false;


export function initsound() {

  jsinitsound();

  settimer2(40);	// 0x20
  setspkrt2();
  settimer0(0);
  wavetype = 2;
  t0val = 12000;
  musvol = 8;
  t2val = 40;
  soundt0flag = true;
  sndflag = true;
  spkrmode = 0;
  int8flag = false;
  setsoundt2();
  soundstop();
  setupsound();
  timerrate = 0x4000;
  settimer0(0x4000);
}

export function music(tune) {
  tuneno = tune;
  musicp = 0;
  noteduration = 0;
  switch (tune) {
    case 0:
      musicmaxvol = 50;
      musicattackrate = 20;
      musicsustainlevel = 20;
      musicdecayrate = 10;
      musicreleaserate = 4;
      break;
    case 1:
      musicmaxvol = 50;
      musicattackrate = 50;
      musicsustainlevel = 8;
      musicdecayrate = 15;
      musicreleaserate = 1;
      break;
    case 2:
      musicmaxvol = 50;
      musicattackrate = 50;
      musicsustainlevel = 25;
      musicdecayrate = 5;
      musicreleaserate = 1;
  }
  musicplaying = true;
  if (tune == 2)
    soundddieoff();
}

export function musicoff() {
  musicplaying = false;
  musicp = 0;
}

export function musicupdate() {
  if (!musicplaying)
    return;
  if (noteduration != 0)
    noteduration--;
  else {
    musicstage = musicn = 0;
    switch (tuneno) {
      case 0:
        noteduration = bonusjingle[musicp + 1] * 3;
        musicnotewidth = noteduration - 3;
        notevalue = bonusjingle[musicp];
        musicp += 2;
        if (bonusjingle[musicp] == 0x7d64)
          musicp = 0;
        break;
      case 1:
        noteduration = backgjingle[musicp + 1] * 6;
        musicnotewidth = 12;
        notevalue = backgjingle[musicp];
        musicp += 2;
        if (backgjingle[musicp] == 0x7d64)
          musicp = 0;
        break;
      case 2:
        noteduration = dirge[musicp + 1] * 10;
        musicnotewidth = noteduration - 10;
        notevalue = dirge[musicp];
        musicp += 2;
        if (dirge[musicp] == 0x7d64)
          musicp = 0;
        break;
    }
  }
  musicn++;
  wavetype = 1;
  t0val = notevalue;
  if (musicn >= musicnotewidth)
    musicstage = 2;
  switch (musicstage) {
    case 0:
      if (musvol + musicattackrate >= musicmaxvol) {
        musicstage = 1;
        musvol = musicmaxvol;
        break;
      }
      musvol += musicattackrate;
      break;
    case 1:
      if (musvol - musicdecayrate <= musicsustainlevel) {
        musvol = musicsustainlevel;
        break;
      }
      musvol -= musicdecayrate;
      break;
    case 2:
      if (musvol - musicreleaserate <= 1) {
        musvol = 1;
        break;
      }
      musvol -= musicreleaserate;
  }
  if (musvol == 1)
    t0val = 0x7d00;
}

export function setsoundmode() {
  spkrmode = wavetype;
  if (!soundt0flag && sndflag) {
    soundt0flag = true;
    setspkrt2();
  }
}

export function setsoundt2() {
  if (soundt0flag) {
    spkrmode = 0;
    soundt0flag = false;
    setspkrt2();
  }
}

export function sett0() {
  if (sndflag) {
    timer2(t2val);
    if (t0val < 1000 && (wavetype == 1 || wavetype == 2))
      t0val = 1000;
    timer0(t0val);
    timerrate = t0val;
    if (musvol < 1)
      musvol = 1;
    if (musvol > 50)
      musvol = 50;
    pulsewidth = musvol * volume;
    setsoundmode();
  }
}

export function sett2val(t2v) {
  if (sndflag)
    timer2(t2v);
}

export function sound1up() {
  sound1upduration = 96;
  sound1upflag = true;
}

export function sound1upoff() {
  sound1upflag = false;
}

export function sound1upupdate() {
  if (sound1upflag) {
    if (Math.floor(sound1upduration / 3) % 2 != 0)
      t2val = (sound1upduration << 2) + 600;
    sound1upduration--;
    if (sound1upduration < 1)
      sound1upflag = false;
  }
}

export function soundbonus() {
  soundbonusflag = true;
}

export function soundbonusoff() {
  soundbonusflag = false;
  soundbonusn = 0;
}

export function soundbonusupdate() {
  if (soundbonusflag) {
    soundbonusn++;
    if (soundbonusn > 15)
      soundbonusn = 0;
    if (soundbonusn >= 0 && soundbonusn < 6)
      t2val = 0x4ce;
    if (soundbonusn >= 8 && soundbonusn < 14)
      t2val = 0x5e9;
  }
}

export function soundbreak() {
  soundbreakduration = 3;
  if (soundbreakvalue < 15000)
    soundbreakvalue = 15000;
  soundbreakflag = true;
}

export function soundbreakoff() {
  soundbreakflag = false;
}

export function soundbreakupdate() {
  if (soundbreakflag)
    if (soundbreakduration != 0) {
      soundbreakduration--;
      t2val = soundbreakvalue;
    } else
      soundbreakflag = false;
}

export function soundddie() {
  soundddien = 0;
  soundddievalue = 20000;
  soundddieflag = true;
}

export function soundddieoff() {
  soundddieflag = false;
}

export function soundddieupdate() {
  if (soundddieflag) {
    soundddien++;
    if (soundddien == 1)
      musicoff();
    if (soundddien >= 1 && soundddien <= 10)
      soundddievalue = 20000 - soundddien * 1000;
    if (soundddien > 10)
      soundddievalue += 500;
    if (soundddievalue > 30000)
      soundddieoff();
    t2val = soundddievalue;
  }
}

export function soundeatm() {
  soundeatmduration = 20;
  soundeatmn = 3;
  soundeatmvalue = 2000;
  soundeatmflag = true;
}

export function soundeatmoff() {
  soundeatmflag = false;
}

export function soundeatmupdate() {
  if (soundeatmflag)
    if (soundeatmn != 0) {
      if (soundeatmduration != 0) {
        if ((soundeatmduration % 4) == 1)
          t2val = soundeatmvalue;
        if ((soundeatmduration % 4) == 3)
          t2val = soundeatmvalue - (soundeatmvalue >> 4);
        soundeatmduration--;
        soundeatmvalue -= (soundeatmvalue >> 4);
      } else {
        soundeatmduration = 20;
        soundeatmn--;
        soundeatmvalue = 2000;
      }
    } else
      soundeatmflag = false;
}

export function soundem() {
  soundemflag = true;
}

export function soundemerald(n) {
  emerfreq = emfreqs[n];
  soundemeraldduration = 7;
  soundemeraldn = 0;
  soundemeraldflag = true;
}

export function soundemeraldoff() {
  soundemeraldflag = false;
}

export function soundemeraldupdate() {
  if (soundemeraldflag)
    if (soundemeraldduration != 0) {
      if (soundemeraldn == 0 || soundemeraldn == 1)
        t2val = emerfreq;
      soundemeraldn++;
      if (soundemeraldn > 7) {
        soundemeraldn = 0;
        soundemeraldduration--;
      }
    } else
      soundemeraldoff();
}

export function soundemoff() {
  soundemflag = false;
}

export function soundemupdate() {
  if (soundemflag) {
    t2val = 1000;
    soundemoff();
  }
}

export function soundexplode() {
  soundexplodevalue = 1500;
  soundexplodeduration = 10;
  soundexplodeflag = true;
  soundfireoff();
}

export function soundexplodeoff() {
  soundexplodeflag = false;
}

export function soundexplodeupdate() {
  if (soundexplodeflag)
    if (soundexplodeduration != 0) {
      soundexplodevalue = t2val = soundexplodevalue - (soundexplodevalue >> 3);
      soundexplodeduration--;
    } else
      soundexplodeflag = false;
}

export function soundfall() {
  soundfallvalue = 1000;
  soundfallflag = true;
}

export function soundfalloff() {
  soundfallflag = false;
  soundfalln = 0;
}

export function soundfallupdate() {
  if (soundfallflag)
    if (soundfalln < 1) {
      soundfalln++;
      if (soundfallf)
        t2val = soundfallvalue;
    } else {
      soundfalln = 0;
      if (soundfallf) {
        soundfallvalue += 50;
        soundfallf = false;
      } else
        soundfallf = true;
    }
}

export function soundfire() {
  soundfirevalue = 500;
  soundfireflag = true;
}

export function soundfireoff() {
  soundfireflag = false;
  soundfiren = 0;
}

export function soundfireupdate() {
  if (soundfireflag) {
    if (soundfiren == 1) {
      soundfiren = 0;
      soundfirevalue += Math.floor(soundfirevalue / 55);
      t2val = soundfirevalue + Main.randno(soundfirevalue >> 3);
      if (soundfirevalue > 30000)
        soundfireoff();
    } else
      soundfiren++;
  }
}

export function soundgold() {
  soundgoldvalue1 = 500;
  soundgoldvalue2 = 4000;
  soundgoldduration = 30;
  soundgoldf = false;
  soundgoldflag = true;
}

export function soundgoldoff() {
  soundgoldflag = false;
}

export function soundgoldupdate() {
  if (soundgoldflag) {
    if (soundgoldduration != 0)
      soundgoldduration--;
    else
      soundgoldflag = false;
    if (soundgoldf) {
      soundgoldf = false;
      t2val = soundgoldvalue1;
    } else {
      soundgoldf = true;
      t2val = soundgoldvalue2;
    }
    soundgoldvalue1 += (soundgoldvalue1 >> 4);
    soundgoldvalue2 -= (soundgoldvalue2 >> 4);
  }
}

export function soundint() {
  timerclock++;
  if (soundflag && !sndflag)
    sndflag = musicflag = true;
  if (!soundflag && sndflag) {
    sndflag = false;
    timer2(40);
    setsoundt2();
    soundoff();
  }
  if (sndflag && !soundpausedflag) {
    t0val = 0x7d00;
    t2val = 40;
    if (musicflag)
      musicupdate();
    soundemeraldupdate();
    soundwobbleupdate();
    soundddieupdate();
    soundbreakupdate();
    soundgoldupdate();
    soundemupdate();
    soundexplodeupdate();
    soundfireupdate();
    soundeatmupdate();
    soundfallupdate();
    sound1upupdate();
    soundbonusupdate();
//soundlevdoneupdate();  // js, test
    if (t0val == 0x7d00 || t2val != 40)
      setsoundt2();
    else {
      setsoundmode();
      sett0();
    }
    sett2val(t2val);
  }
}

export async function soundlevdone() {
  var timer = 0;
  soundstop();
  nljpointer = 0;
  nljnoteduration = 20; //20
  soundlevdoneflag = true; //soundpausedflag=true;
  //soundlevdoneflag=soundpausedflag=true;

  await new Promise(resolve => {
    var intv = setInterval(() => {

      //while (soundlevdoneflag) {
      if (soundlevdoneflag) {
        //fillbuffer();
        //if (timerclock==timer)
        //  continue;
        soundlevdoneupdate();
        //timer=timerclock;
      } else {
        clearInterval(intv);
        resolve();
      }

    }, 15);
  });

  soundlevdoneoff();
}

export function soundlevdoneloop() {
  return soundlevdoneflag;
}

export function soundlevdoneoff() {
  soundlevdoneflag = soundpausedflag = false;
}

export function soundlevdoneupdate() {
  if (sndflag) {
    if (nljpointer < 11)
      t2val = newlevjingle[nljpointer];
    t0val = t2val + 35;
    musvol = 50;
    setsoundmode();
    sett0();
    sett2val(t2val);
    if (nljnoteduration > 0)
      nljnoteduration--;
    else {
      nljnoteduration = 20;
      nljpointer++;
      if (nljpointer > 10)
        soundlevdoneoff();
    }
  } else {
//	olddelay(100);
    soundlevdoneflag = false;
  }
}

export function getmusicflag() {
  return musicflag;
}

export function soundpause() {
  soundpausedflag = true;
}

export function soundpauseoff() {
  soundpausedflag = false;
}

export function soundstop() {
  soundfalloff();
  soundwobbleoff();
  soundfireoff();
  musicoff();
  soundbonusoff();
  soundexplodeoff();
  soundbreakoff();
  soundemoff();
  soundemeraldoff();
  soundgoldoff();
  soundeatmoff();
  soundddieoff();
  sound1upoff();
}

export function soundwobble(wbl) {
  soundwobbleflag = true;
}

export function soundwobbleoff() {
  soundwobbleflag = false;
  soundwobblen = 0;
}

export function soundwobbleupdate() {
  if (soundwobbleflag) {
    soundwobblen++;
    if (soundwobblen > 63)
      soundwobblen = 0;
    switch (soundwobblen) {
      case 0:
        t2val = 0x7d0;
        break;
      case 16:
      case 48:
        t2val = 0x9c4;
        break;
      case 32:
        t2val = 0xbb8;
        break;
    }
  }
}

export function startint8() {
  if (!int8flag) {
    initint8();
    timerrate = 0x4000;
    settimer0(0x4000);
    int8flag = true;
  }
}

export function stopint8() {
  settimer0(0);
  if (int8flag) {
    restoreint8();
    int8flag = false;
  }

  sett2val(40);
  setspkrt2();
}

export function getvolume() {
  return volume;
}

export function setvolume(v) {
  volume = v;
}

export function setaudio(s) {
  soundflag = s;
}

// ---

// newsnd/newsnd2.c

var MIN_SAMP = -0.3, MAX_SAMP = 0.3;	// org 0, 255

var rate;	// int
var t0rate, t2rate, t2new, t0v = 0, t2v = 0;	// uint4
var t2sw;	// bool


export function setupsound() {
  inittimer();
  Digger.time_w(0);
  startint8();
  //fillbuffer();
  //initsounddevice();	// fix
}

export function killsound() {
  setsoundt2();
  timer2(40);
  stopint8();
  //killsounddevice();
}

function fillbuffer() {
}


function s2settimer2(t2) {  // uint4
  if (t2 == 40)
    t2rate = 0;
  else if (t2 == 0)
    t2rate = rate;
  else
    t2rate = Math.floor((rate << 16) / t2);	// fix, cast to uint4
  //t2rate=(Uint4)((((Uint5)rate)<<16)/t2);
}

function s2timer2(t2) {  // uint4
  s2settimer2(t2);
}

function s2soundoff() {
  t2sw = false;
}

function s2setspkrt2() {
  t2sw = true;
}

function s2settimer0(t0) {  // uint4
  if (t0 == 0)
    t0rate = rate;
  else
    t0rate = Math.floor((rate << 16) / t0);	// fix, cast to uint4
  //t0rate=(Uint4)((((Uint5)rate)<<16)/t0);
}

function s2timer0(t0) {  // uint4
  s2settimer0(t0);
}

function getsample2() {

  var t0 = 0, t2 = 0;

  t0v = (t0v + t0rate);
  if (t0v >= 65536) {
    t0v = t0v % 65536;
    timercount = (timercount + timerrate);
    if (timercount >= 65536) {
      timercount = timercount % 65536;
      soundint();
      timercount -= 0x4000;
      if (timercount < 0)
        timercount += 65536;
    }
  }

  t2v = (t2v + t2rate) % 65536;
  if (spkrmode != 0)
    if (t0v > pulsewidth * 63) 	// 655 org, 63 tmp/new
      t0 = -32767;
    else
      t0 = 32767;
  if (t2rate != 0 && t2sw) {
    if (t2v > 32767)
      t2 = -32767;
    else
      t2 = 32767;
  }

  return (((t0 + 2 * t2 + 98301) * (MAX_SAMP - MIN_SAMP)) / 196605) + MIN_SAMP;
}


// ---


function initint8() {
}

function restoreint8() {
}

export function soundoff() {
  s2soundoff();
}

function setspkrt2() {
  s2setspkrt2();
}

function settimer0(t) {
  s2settimer0(t);
}

function timer0(t) {
  s2timer0(t);
}

function settimer2(t) {
  s2settimer2(t);
}

function timer2(t) {
  s2timer2(t);
}

function getsample() {
  return getsample2();
}


function inittimer() {
}	// fix? set timer returned by gethrt to 0

//

function jsinitsound() {
  var acon, anode;

  if ('AudioContext' in window)
    acon = new AudioContext();

  if (!acon) return;

  var bsize = 2048;
  rate = Math.floor(0x1234dd / acon.sampleRate);
  //var bsize = (acon.sampleRate == 48000 ? 4096 : 2048);
  t2sw = false;


  var austart = function () {
    if (acon.state && acon.state == 'suspended')
      acon.resume();
    // anode must be global (webkit/chrome/safari gc bug)
    anode = acon.createScriptProcessor(bsize, 1, 1);
    anode.onaudioprocess = function (e) {
      var ou = e.outputBuffer.getChannelData(0);
      for (var i = 0; i < ou.length; i++)
        ou[i] = getsample();
    }
    anode.connect(acon.destination);
  }

  window.acon = acon;  // prevent compiler warnings
  window.anode = anode;

  window.fuinput = function () {
    austart();
    window.fuinput = null;
  }
}

