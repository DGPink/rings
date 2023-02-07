// init

// initiate the game
document.addEventListener('DOMContentLoaded', function(){loadFonts().then(()=>init())});



var font1, font2;
async function loadFonts() {
  font1 = new FontFace('myFont', 'url(fonts/nationalpark-regular-webfont.woff2)');
  font2 = new FontFace('nationalPark', 'url(fonts/nationalpark-regular-webfont.woff2)');
  await font1.load();
  await font2.load();
  document.fonts.add(font1);
  document.fonts.add(font2);
}

function init(){
  canvasInit();
  logicInit();
  touchSetup();
}
