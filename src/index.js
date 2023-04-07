import * as Digger from "./Digger";

var ua = navigator.userAgent, dde = document.documentElement, devios;

function preinit() {
  var sw = screen.width, sh = screen.height;
  //var wl = Math.max(sw, sh), ws = Math.min(sw, sh);
  //var il = /\(Macintosh;/.test(navigator.userAgent) && (ws>0 && wl/ws < 1.44);
  var il = (navigator.platform === "MacIntel" && typeof navigator.standalone !== "undefined");  // ipad
  if (/iPhone|iPod|iPad/.test(ua) || navigator.standalone || il) {
    dde.className = "vkvis pfix";
    devios = true;
  }
  else if (/Android/.test(ua))
    dde.className = "vkvis";
}

var rqdone = 0;
function rqfs() {
  if (rqdone) return;
  rqdone = 1;
  if (!(/Android/.test(ua))) return;
  if (dde.requestFullscreen)
    dde.requestFullscreen();
}

window.onresize = function() {
  Digger.digadj();
  if (devios) // ios bug
    ; //setTimeout(function() { if (digadj) digadj(); }, 450);
}


window.onload = function() {
  try {
    preinit();
    Digger.init();
  } catch (err) {
    console.error(err);
  }
}


document.addEventListener('click', function(e) {
  var dgibox = document.getElementById('dgibox'),
      dginfo = document.getElementById('dginfo');
  if (dgibox && !dgibox.contains(e.target))
    if (dginfo && dginfo.style.display == 'block')
      dginfo.style.display = 'none';
});
