
Bags = (function() {


function _bag() {
  this.x = this.y = this.h = this.v = this.xr = this.yr = this.dir = this.wt = this.gt = this.fallh = 0;
  this.wobbling = this.unfallen = this.exist = false;
}

_bag.prototype.copyFrom = function(t) {
  this.x = t.x;
  this.y = t.y;
  this.h = t.h;
  this.v = t.v;
  this.xr = t.xr;
  this.yr = t.yr;
  this.dir = t.dir;
  this.wt = t.wt;
  this.gt = t.gt;
  this.fallh = t.fallh;
  this.wobbling = t.wobbling;
  this.unfallen = t.unfallen;
  this.exist = t.exist;
}


var bagdat1 = [ new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag() ],
bagdat2 = [ new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag() ],
bagdat  = [ new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag(), new _bag() ];

var pushcount=0, goldtime=0;

var wblanim = [2,0,1,0];

function bagbits () {
  var bag,b,bags=0;
  for (bag=1,b=2;bag<8;bag++,b<<=1)
	if (bagdat[bag].exist)
	  bags|=b;
  return bags;
}

function baghitground (bag) {
  var bn,b,clbits;
  if (bagdat[bag].dir==6 && bagdat[bag].fallh>1)
	bagdat[bag].gt=1;
  else
	bagdat[bag].fallh=0;
  bagdat[bag].dir=-1;
  bagdat[bag].wt=15;
  bagdat[bag].wobbling=false;
  clbits=Drawing.drawgold(bag,0,bagdat[bag].x,bagdat[bag].y);
  Main.incpenalty();
  for (bn=1,b=2;bn<8;bn++,b<<=1)
	if ((b&clbits)!=0)
	  removebag(bn);
}

function bagy (bag) {
  return bagdat[bag].y;
}

function cleanupbags () {
  var bpa;
  Sound.soundfalloff();
  for (bpa=1;bpa<8;bpa++) {
    if (bagdat[bpa].exist && ((bagdat[bpa].h==7 && bagdat[bpa].v==9) ||
	bagdat[bpa].xr!=0 || bagdat[bpa].yr!=0 || bagdat[bpa].gt!=0 ||
	bagdat[bpa].fallh!=0 || bagdat[bpa].wobbling)) {
	    bagdat[bpa].exist=false;
	    Sprite.erasespr(bpa);
    }
    if (Main.getcplayer()==0)
	bagdat1[bpa].copyFrom(bagdat[bpa]);
    else
	bagdat2[bpa].copyFrom(bagdat[bpa]);
  }
}

function dobags () {
  var bag;
  var soundfalloffflag=true,soundwobbleoffflag=true;
  for (bag=1;bag<8;bag++)
	if (bagdat[bag].exist) {
	  if (bagdat[bag].gt!=0) {
		if (bagdat[bag].gt==1) {
		  Sound.soundbreak();
		  Drawing.drawgold(bag,4,bagdat[bag].x,bagdat[bag].y);
		  Main.incpenalty();
		}
		if (bagdat[bag].gt==3) {
		  Drawing.drawgold(bag,5,bagdat[bag].x,bagdat[bag].y);
		  Main.incpenalty();
		}
		if (bagdat[bag].gt==5) {
		  Drawing.drawgold(bag,6,bagdat[bag].x,bagdat[bag].y);
		  Main.incpenalty();
		}
		bagdat[bag].gt++;
		if (bagdat[bag].gt==goldtime)
		  removebag(bag);
		else
		  if (bagdat[bag].v<9 && bagdat[bag].gt<goldtime-10)
			if ((Monster.getfield(bagdat[bag].h,bagdat[bag].v+1)&0x2000)==0)
			  bagdat[bag].gt=goldtime-10;
	  }
	  else
		updatebag(bag);
	}
  for (bag=1;bag<8;bag++) {
	if (bagdat[bag].dir==6 && bagdat[bag].exist)
	  soundfalloffflag=false;
	if (bagdat[bag].dir!=6 && bagdat[bag].wobbling && bagdat[bag].exist)
	  soundwobbleoffflag=false;
  }
  if (soundfalloffflag)
    Sound.soundfalloff();
  if (soundwobbleoffflag)
    Sound.soundwobbleoff();
}

async function drawbags () {
  var bag;
  for (bag=1;bag<8;bag++) {
    if (Main.getcplayer()==0)
  	bagdat[bag].copyFrom (bagdat1[bag]);
    else
	bagdat[bag].copyFrom (bagdat2[bag]);
    if (bagdat[bag].exist)
	Sprite.movedrawspr(bag,bagdat[bag].x,bagdat[bag].y);
    Digger.newframe(); //js
    await sleep(12);
  }
}

function getbagdir (bag) {
  if (bagdat[bag].exist)
	return bagdat[bag].dir;
  return -1;
}

function getgold (bag) {
  var clbits;
  clbits=Drawing.drawgold(bag,6,bagdat[bag].x,bagdat[bag].y);
  Main.incpenalty();
  if ((clbits&1)!=0) {
	Scores.scoregold();
	Sound.soundgold();
	Digger.digtime_w(0);
  }
  else
	Monster.mongold();
  removebag(bag);
}

function getnmovingbags () {
  var bag,n=0;
  for (bag=1;bag<8;bag++)
	if (bagdat[bag].exist && bagdat[bag].gt<10 &&
		(bagdat[bag].gt!=0 || bagdat[bag].wobbling))
	  n++;
  return n;
}

function initbags () {
  var bag,x,y,i;
  pushcount=0;
  goldtime=150-Main.levof10()*10;
  for (bag=1;bag<8;bag++)
	bagdat[bag].exist=false;
  bag=1;
  for (x=0;x<15;x++)
	for (y=0;y<10;y++)
	  if (Main.getlevch(x,y,Main.levplan())=='B')
		if (bag<8) {
		  bagdat[bag].exist=true;
		  bagdat[bag].gt=0;
		  bagdat[bag].fallh=0;
		  bagdat[bag].dir=-1;
		  bagdat[bag].wobbling=false;
		  bagdat[bag].wt=15;
		  bagdat[bag].unfallen=true;
		  bagdat[bag].x=x*20+12;
		  bagdat[bag].y=y*18+18;
		  bagdat[bag].h=x;
		  bagdat[bag].v=y;
		  bagdat[bag].xr=0;
		  bagdat[bag++].yr=0;
		}
  if (Main.getcplayer()==0)
  	for (i=1;i<8;i++)
  		bagdat1[i].copyFrom(bagdat[i]);
  else
  	for (i=1;i<8;i++)
  		bagdat2[i].copyFrom(bagdat[i]);
}


function pushbag (bag, dir) {	// r: boolean
  var x,y,h,v,ox,oy,clbits;
  var push=true;
  ox=x=bagdat[bag].x;
  oy=y=bagdat[bag].y;
  h=bagdat[bag].h;
  v=bagdat[bag].v;
  if (bagdat[bag].gt!=0) {
		getgold(bag);
		return true;
  }
  if (bagdat[bag].dir==6 && (dir==4 || dir==0)) {
		clbits=Drawing.drawgold(bag,3,x,y);
		Main.incpenalty();
		if (((clbits&1)!=0) && (Digger.diggery_r()>=y))
		  Digger.killdigger(1,bag);
		if ((clbits&0x3f00)!=0)
		  Monster.squashmonsters(bag,clbits);
		return true;
  }
  if ((x==292 && dir==0) || (x==12 && dir==4) || (y==180 && dir==6) ||
	  (y==18 && dir==2))
	push=false;
  if (push) {
	switch (dir) {
	  case 0:
		x+=4;
		break;
	  case 4:
		x-=4;
		break;
	  case 6:
		if (bagdat[bag].unfallen) {
		  bagdat[bag].unfallen=false;
		  Drawing.drawsquareblob(x,y);
		  Drawing.drawtopblob(x,y+21);
		}
		else
		  Drawing.drawfurryblob(x,y);
		Drawing.eatfield(x,y,dir);
		Digger.killemerald(h,v);
		y+=6;
	}
	switch(dir) {
	  case 6:
		clbits=Drawing.drawgold(bag,3,x,y);
		Main.incpenalty();
		if (((clbits&1)!=0) && Digger.diggery_r()>=y)
		  Digger.killdigger(1,bag);
		if ((clbits&0x3f00)!=0)
		  Monster.squashmonsters(bag,clbits);
		break;
	  case 0:
	  case 4:
		bagdat[bag].wt=15;
		bagdat[bag].wobbling=false;
		clbits=Drawing.drawgold(bag,0,x,y);
		Main.incpenalty();
		pushcount=1;
		if ((clbits&0xfe)!=0)
		  if (!pushbags(dir,clbits)) {
			x=ox;
			y=oy;
			Drawing.drawgold(bag,0,ox,oy);
			Main.incpenalty();
			push=false;
		  }
		if (((clbits&1)!=0) || ((clbits&0x3f00)!=0)) {
		  x=ox;
		  y=oy;
		  Drawing.drawgold(bag,0,ox,oy);
		  Main.incpenalty();
		  push=false;
		}
	}
	if (push)
	  bagdat[bag].dir=dir;
	else
	  bagdat[bag].dir=Digger.reversedir(dir);
	bagdat[bag].x=x;
	bagdat[bag].y=y;
	bagdat[bag].h=Math.floor((x-12)/20);
	bagdat[bag].v=Math.floor((y-18)/18);
	bagdat[bag].xr=(x-12)%20;
	bagdat[bag].yr=(y-18)%18;
  }
  return push;
}

function pushbags (dir, bits) {	// r: boolean
  var bag,bit;
  var push=true;
  for (bag=1,bit=2;bag<8;bag++,bit<<=1)
	if ((bits&bit)!=0)
	  if (!pushbag(bag,dir))
		push=false;
  return push;
}

function pushudbags (bits) { // r: boolean
  var bag,b;
  var push=true;
  for (bag=1,b=2;bag<8;bag++,b<<=1)
	if ((bits&b)!=0)
	  if (bagdat[bag].gt!=0)
		getgold(bag);
	  else
		push=false;
  return push;
}

function removebag (bag) {
  if (bagdat[bag].exist) {
	bagdat[bag].exist=false;
	Sprite.erasespr(bag);
  }
}

function removebags (bits) {
  var bag,b;
  for (bag=1,b=2;bag<8;bag++,b<<=1)
	if ((bagdat[bag].exist) && ((bits&b)!=0))
	  removebag(bag);
}


function updatebag (bag) {
  var x,h,xr,y,v,yr,wbl;
  x=bagdat[bag].x;
  h=bagdat[bag].h;
  xr=bagdat[bag].xr;
  y=bagdat[bag].y;
  v=bagdat[bag].v;
  yr=bagdat[bag].yr;
  switch (bagdat[bag].dir) {
	case -1:
	  if (y<180 && xr==0) {
		if (bagdat[bag].wobbling) {
		  if (bagdat[bag].wt==0) {
			bagdat[bag].dir=6;
			Sound.soundfall();
			break;
		  }
		  bagdat[bag].wt--;
		  wbl=bagdat[bag].wt%8;
		  if (!((wbl&1)!=0)) {
			Drawing.drawgold(bag,wblanim[wbl>>1],x,y);
			Main.incpenalty();
			Sound.soundwobble(bagdat[bag].wt);
		  }
		}
		else
		  if ((Monster.getfield(h,v+1)&0xfdf)!=0xfdf)
			if (!Digger.checkdiggerunderbag(h,v+1))
			  bagdat[bag].wobbling=true;
	  }
	  else {
		bagdat[bag].wt=15;
		bagdat[bag].wobbling=false;
	  }
	  break;
	case 0:
	case 4:
	  if (xr==0)
		if (y<180 && (Monster.getfield(h,v+1)&0xfdf)!=0xfdf) {
		  bagdat[bag].dir=6;
		  bagdat[bag].wt=0;
		  Sound.soundfall();
		}
		else
		  baghitground(bag);
	  break;
	case 6:
	  if (yr==0)
		bagdat[bag].fallh++;
	  if (y>=180)
		baghitground(bag);
	  else
		if ((Monster.getfield(h,v+1)&0xfdf)==0xfdf)
		  if (yr==0)
			baghitground(bag);
	  Monster.checkmonscared(bagdat[bag].h);
  }
  if (bagdat[bag].dir!=-1)
	if (bagdat[bag].dir!=6 && pushcount!=0)
	  pushcount--;
	else
	  pushbag(bag,bagdat[bag].dir);
}


return {
	bagbits: bagbits,
	baghitground: baghitground,
	bagy: bagy,
	cleanupbags: cleanupbags,
	dobags: dobags,
	drawbags: drawbags,
	getbagdir: getbagdir,
	getgold: getgold,
	getnmovingbags: getnmovingbags,
	initbags: initbags,
	pushbag: pushbag,
	pushbags: pushbags,
	pushudbags: pushudbags,
	removebag: removebag,
	removebags: removebags,
	updatebag: updatebag
};

})();


