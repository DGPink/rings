/////////////////////////////////////////////////
//////
/////
/////        MOONS
////
/////
/////////////////////////////////////////////////

//




//////////
/////             STYLES
/////////

function genericStyle(fillcolor, linecolor, linewidth) {
  return {
    gradient: false,
    line: {
      width: linewidth,
      cap: "round" || "butt" || "square" ,
      join:  "round" || "miter" || "bevel",
      color: linecolor,
      dash: [], // [] for none
      dashOffset: 0, // 0 for none
    },//*/
    fill:
      {fillStyle: fillcolor,},
      //false,
    shadow:
      //{shadowColor: fillcolor, shadowOffsetX: 0, shadowOffsetY: 0, shadowBlur: 16,},
      false,
    }
} // end of genericStyle

function ringstyle(ctx, ring, post) {
  let index = post.rings.findLastIndex((e) => e.code === ring.code);
  let ringthick = (ring === post.top) ? 6 : 3;
  // 4 + 2 * (1/2) ** (post.rings.length - index); //post.ord === flags.selectedPost &&
  return genericStyle(...[
    rgbaString([0,0,0],0.25),//(ring === post.top) ? rgbaString[[0,0,0],0.3] : "black", //fillcolor
    suitlinecode[ring.suit], //linecolor
    //3, //notesfromthepost(post,ring)//8,
    ringthick,
    //(flags.selectedPost === this.ord) {} //todo
    ]
  );
}



const linefillstyle = (ctx, ring) => genericStyle(...[ // style(fillcolor, linecolor, linewidth)
    rgbaString([0,0,0],0.7), //darksuitfillcode[ring.color],
    suitlinecode[ring.suit],
    1,
]);
const pipstyle = (ctx, ring) => genericStyle(...[
    rgbaString([0,0,0],0), //darksuitfillcode[ring.color],
    suitlinecode[ring.suit],
    1,
]);
const batterystyle = (ctx, ring) => genericStyle(...[
  rgbaString([0,0,0],0), //"#111", //fillcolor
  "#ccc", //linecolor
  1, //linewidth
]);




//////////
/////             PATHZ
/////////

//
// path
const circlePath = (ro,ri) => {
  let path = new Path2D();
  path.arc(0, 0, ro, 0, 2 * Math.PI, false);
  if (ri) path.arc(0, 0, ri, 0, 2 * Math.PI, true);
  return path
}

function linefillpath(ctx, ring, scale) {
  //const scale = w/6/14;
  const whth = 2 * ring.rank * scale;
  const radiuso = ring.rank * scale;

  const pippath = new Path2D();

  // angle raiate
  [...Array(ring.rank)].forEach((e,i) => {
    let pha = Math.random()*2*Math.PI;
    let pho = Math.random()*2*Math.PI;
    pippath.moveTo(Math.cos(pha) * whth/2 + whth/2, Math.sin(pha) * whth/2 + whth/2);
    pippath.lineTo(Math.cos(pho) * whth/2 + whth/2, Math.sin(pho) * whth/2 + whth/2);
  });

  return pippath //pattern;
} // end of linefillpath

function linefill_pathz(ctx, ring, scale=w/6/14) {
  const whth = 2 * ring.rank * scale;
  let radiuso = ring.rank * scale;

  const pippath = new Path2D();


  // angle raiate
  [...Array(ring.rank)].forEach((e,i) => {
    let pha = Math.random()*2*Math.PI;
    let pho = Math.random()*2*Math.PI;
    pippath.moveTo(Math.cos(pha) * whth/2 + whth/2, Math.sin(pha) * whth/2 + whth/2);
    pippath.lineTo(Math.cos(pho) * whth/2 + whth/2, Math.sin(pho) * whth/2 + whth/2);
  });
/*
  [...Array(ring.rank)].forEach((e,i) => {
    pippath.moveTo(0, i/ring.rank * whth);
    pippath.lineTo(whth, i/ring.rank * whth);
  });

  let [verts,hortz] = vertshortz[ring.rank];
  verts.map((e,i,r) => e * whth * i/(r.length-1))
    .filter(q => (q>0))
    .forEach(x => {
      pippath.moveTo(x, 0);
      pippath.lineTo(x, whth);
    });
  hortz.map((e,i,r) => e * whth * i/(r.length-1))
    .filter(q => (q>0))
    .forEach(y => {
      pippath.moveTo(0, y);
      pippath.lineTo(whth, y);
    });
*/
  return pippath //pattern;
} // end of linefill_pathz

/////////////////
///
///  PATTERNS
//
//
////
/*
  // STARS
  function stars(ctx, ring){ //pip pattern-maker
    const moons = [];
    let moon = { // this is a stamp
      x: 0,
      y: 0,
      theta: 0, //Math.PI/4,
      scale: {x:ring.rank/200, y:ring.rank/200}, //{x:0.02, y:0.02},
      path: suitpathcode[ring.suit],
      style: pipstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
    };
    const canva = new OffscreenCanvas(ring.rank*4, ring.rank*4); //(30,30);
    const ct = canva.getContext('2d', {alpha: true});
    ct.fillStyle = rgbaString([0,0,0],0.33);
    ct.fillRect(0,0,canva.width,canva.height);
    let piptext = { // this is a stamp
      x: 0, //centerd +
      y: 0, //so to put the text in the fn middle
      theta: 0,
      scale: {x:1, y:1},
      text: {
        msg: "" + ring.rank,
        pt: ring.rank + "px ", font: "myFont",
        textAlign: "center" || "right",
        textBaseline: "middle" || "alphabetic" || "top",
        color: "#000",
        x: ring.rank * 1.8, y: ring.rank * 1.4,
      },
    };
    moons.push([moon, piptext]);
    for (let [moon,txt] of moons) {
      stomp(moon, ctx);
      //typetap(txt, ctx);
    }
    //stomp(moon, ct);
    return ctx.createPattern(canva, "repeat") // ctx.createPattern(canva, "repeat"); //canvas;
    //stars.push(moon);
  } // end of stars
*/
  function linesomething(ctx, ring, scale=w/6/14) {
    const whth = 2 * ring.rank * scale;
    const raincanvas = new OffscreenCanvas(whth, whth);
    const rainctx = raincanvas.getContext('2d', { alpha: true });
    rainctx.strokeStyle = suitlinecode[ring.suit];
    rainctx.lineWidth = 1;
    let radiuso = ring.rank * scale;
    let radiusi = 0;

    rainctx.beginPath();
    rainctx.arc(whth/2, whth/2, radiuso, 0, 2 * Math.PI, false);
    rainctx.stroke();

    rainctx.save();

    //wheelclip
    const path = new Path2D();
    const radiusOuter = ring.rank * scale;
    path.arc(whth/2, whth/2, radiusOuter, 0, 2 * Math.PI, false);
    rainctx.clip(path);


    rainctx.moveTo(1/3*whth, 0);
    rainctx.lineTo(1/3*whth, whth);
    rainctx.moveTo(2/3*whth, 0);
    rainctx.lineTo(2/3*whth, whth);

    rainctx.moveTo(0, 1/6*whth);
    rainctx.lineTo(whth, 1/6*whth);
    rainctx.moveTo(0, 1/3*whth);
    rainctx.lineTo(whth, 1/3*whth);
    rainctx.moveTo(0, 2/3*whth);
    rainctx.lineTo(whth, 2/3*whth);
    rainctx.moveTo(0, 5/6*whth);
    rainctx.lineTo(whth, 5/6*whth);



    return raincanvas //pattern;
  } // end of linesomething



/*
  // LINES
  function lines(ctx, ring){ //pip pattern-maker
    const moons = [];

    let moon = { // this is a stamp
      x: 0,
      y: 0,
      theta: 0, //Math.PI/4,
      scale: {x:1, y:1}, //{x:0.02, y:0.02},
      path: linefillpath(ctx, ring),
      style: linefillstyle(ctx, ring), //(ctx, ring) => style(...[ // style(fillcolor, linecolor, linewidth)
    };

    const canva = new OffscreenCanvas(ring.rank * scale, ring.rank * scale); //(30,30);
    const ct = canva.getContext('2d', {alpha: true});
    ct.fillStyle = rgbaString([0,0,0],0.4);
    ct.fillRect(0,0,canva.width,canva.height);

    //moons.push(moon);
    /*
    for (let moon of moons) {
      stomp(moon, ctx);
    }

    //stomp(moon, ct);
    //return //ctx.createPattern(canva) // ctx.createPattern(canva, "repeat"); //canvas;
    //stars.push(moon);
  } // end of lines
*/










///
