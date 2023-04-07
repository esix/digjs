import * as Digger from "./Digger";

var width = 320, height = 200;

var pixels = new Array(65536 / 4);
var curpal = 0;

var pals = [

  [[0, 0x00, 0xCC, 0xCC],
    [0, 0xCC, 0x00, 0x74],
    [0, 0x00, 0x00, 0x00]],

  [[0, 0x64, 0xFF, 0xFF],
    [0, 0xFF, 0x64, 0xFF],
    [0, 0x64, 0x64, 0x64]]];


function gclear() {
  var lpix = Digger.getgpix();
  for (var i = 0, l = (width * height) >> 2; i < l; i++)
    pixels[i] = 0;
  for (var i = 0, l = width * height * 4; i < l;) {
    lpix[i++] = 0;
    lpix[i++] = 0;
    lpix[i++] = 0;
    i++;
  }
}

function gethrt() {
  return Date.now();
}

function getkips() {
  return 0;		// phony
}

function ggeti(x, y, p, w, h) {

  var src = 0;
  var dest = (y * width + x) >> 2;

  for (var i = 0; i < h; i++) {
    var d = dest;
    for (var j = 0; j < w; j++) {
      p[src++] = pixels[d++];
      if (src == p.length)
        return;
    }
    dest += width >> 2;
  }

}

function ggetpix(x, y) {
  return pixels[(width * y + x) >> 2];
}

function ginit() {
}

function ginten(inten) {
  if (curpal == inten & 1)
    return;
  curpal = inten & 1;
  var lpix = Digger.getgpix(), pal = pals[curpal];
  for (var i = 0, l = (width * height) >> 2, d = 0; i < l; i++) {
    var px = pixels[i];
    for (var k = 0; k < 4; k++) {
      lpix[d++] = pal[0][px & 3];
      lpix[d++] = pal[1][px & 3];
      lpix[d++] = pal[2][px & 3];
      d++;
      px >>= 2;
    }
  }

}

function gpal(pal) {
}

/*function gputi (x, y, p, w, h) {
	gputi (x, y, p, w, h, true);
} */
function gputi(x, y, p, w, h, b = true) {

  var src = 0;
  var dest = (y * width + x) >> 2;
  var lpix = Digger.getgpix(), pal = pals[curpal];

  for (var i = 0; i < h; i++) {
    var d = dest, ld = d << 4;
    for (var j = 0; j < w; j++) {
      var px = p[src++];
      pixels[d++] = px;
      for (var k = 0; k < 4; k++, px >>= 2) {
        lpix[ld++] = pal[0][px & 3];
        lpix[ld++] = pal[1][px & 3];
        lpix[ld++] = pal[2][px & 3];
        ld++;
      }
      if (src == p.length)
        return;
    }
    dest += width >> 2;
  }

}

function gputim(x, y, ch, w, h) {

  var spr = cgagrafx.cgatable[ch * 2];
  var msk = cgagrafx.cgatable[ch * 2 + 1];

  var src = 0;
  var dest = (y * width + x) >> 2;
  var lpix = Digger.getgpix(), pal = pals[curpal];

  for (var i = 0; i < h; i++) {
    var d = dest, ld = dest << 4;
    for (var j = 0; j < w; j++) {
      var px = spr[src];
      var mx = msk[src], ax = pixels[d];
      src++;

      if ((mx & 3) == 0) {
        ax = (ax & ~192) | (px & 3) << 6;
        lpix[ld + 0 + 12] = pal[0][px & 3];
        lpix[ld + 1 + 12] = pal[1][px & 3];
        lpix[ld + 2 + 12] = pal[2][px & 3];
      }
      px >>= 2;
      if ((mx & (3 << 2)) == 0) {
        ax = (ax & ~48) | (px & 3) << 4;
        lpix[ld + 0 + 8] = pal[0][px & 3];
        lpix[ld + 1 + 8] = pal[1][px & 3];
        lpix[ld + 2 + 8] = pal[2][px & 3];
      }
      px >>= 2;
      if ((mx & (3 << 4)) == 0) {
        ax = (ax & ~12) | (px & 3) << 2;
        lpix[ld + 0 + 4] = pal[0][px & 3];
        lpix[ld + 1 + 4] = pal[1][px & 3];
        lpix[ld + 2 + 4] = pal[2][px & 3];
      }
      px >>= 2;
      if ((mx & (3 << 6)) == 0) {
        ax = (ax & ~3) | (px & 3);
        lpix[ld + 0] = pal[0][px & 3];
        lpix[ld + 1] = pal[1][px & 3];
        lpix[ld + 2] = pal[2][px & 3];
      }

      pixels[d] = ax;

      d += 1;
      ld += 16;
      if (src == spr.length || src == msk.length) {
        return;
      }
    }
    dest += width >> 2;
  }

}

function gtitle() {

  var src = 0, dest = 0, plus = 0;  //, ld = 0
  var lpix = Digger.getgpix(), pal = pals[curpal];

  while (true) {

    if (src >= cgagrafx.cgatitledat.length)
      break;

    var b = cgagrafx.cgatitledat[src++], l, c;

    if (b == 0xfe) {
      l = cgagrafx.cgatitledat[src++];
      if (l == 0)
        l = 256;
      c = cgagrafx.cgatitledat[src++];
    } else {
      l = 1;
      c = b;
    }

    for (var i = 0; i < l; i++) {
      var px = c, adst = 0;
      if (dest < 32768)
        adst = Math.floor(dest / 320) * 640 + dest % 320;
      else
        adst = 320 + (Math.floor((dest - 32768) / 320)) * 640 + (dest - 32768) % 320;
      pixels[adst >> 2] = (px >> 6) | (px >> 2) & 12 | (px << 2) & 48 | (px << 6) & 192;
      for (var k = 0, ld = (adst << 2) + 12; k < 4; k++, px >>= 2, ld -= 8) {
        lpix[ld++] = pal[0][px & 3];
        lpix[ld++] = pal[1][px & 3];
        lpix[ld++] = pal[2][px & 3];
        ld++;
      }

      dest += 4;
      if (dest >= 65535)
        break;
    }

    if (dest >= 65535)
      break;

  }

}

/*function gwrite (x, y, ch, c) {
	gwrite (x, y, ch, c, false);
}*/
function gwrite(x, y, ch, c, upd = false) {
  c &= 3;
  var dest = (y * width + x) >> 2, ofs = 0, color = c | c << 2 | c << 4 | c << 6;
  var lpix = Digger.getgpix(), pal = pals[curpal];

  ch = ch.charCodeAt(0) - 32;
  if ((ch < 0) || (ch > 0x5f))
    return;

  var chartab = alpha.ascii2cga[ch];

  if (chartab == null)
    return;

  for (var i = 0; i < 12; i++) {
    var d = dest;
    for (var j = 0; j < 3; j++) {
      var px = chartab[ofs++];
      pixels[d] = ((px >> 6) | (px >> 2) & 12 | (px << 2) & 48 | (px << 6) & 192) & color;
      for (var k = 0, ld = (d << 4) + 12; k < 4; k++, px >>= 2, ld -= 8) {
        lpix[ld++] = pal[0][px & c];
        lpix[ld++] = pal[1][px & c];
        lpix[ld++] = pal[2][px & c];
        ld++;
      }
      d++;
    }
    dest += width >> 2;
  }

}

module.exports = {

  gclear: gclear,
  gethrt: gethrt,
  getkips: getkips,
  ggeti: ggeti,
  ggetpix: ggetpix,
  ginit: ginit,
  ginten: ginten,
  gpal: gpal,
  gputi: gputi,
  gputim: gputim,
  gtitle: gtitle,
  gwrite: gwrite,
  pixels: pixels
};

