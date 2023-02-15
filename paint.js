


const ringImages = {};
const textRingImages = {};
///////////////////////////////////////////////////////////////////////////////

//       PAINT                       ////////////////////////////

//////////////////////////////////////
// helper
function hexiful(radius, center, offset) {
  // Better hex grid
  //const rad = w/6; // size of post location, or max post size
  //const center = w/2; // centered
  //const offset = w/6; // location of grid start from top
  //const gridstart = (e) => [[-1,1],[0]][e]; //
  return [...Array(6)].map((row,k) => k%2).map( // f= [0,1,0,1...],
    (f,j) => [[0],[-1,1]].map( // j= "2-row" number: 0-row, 1,1-row
      (row) => row.map((e) => [
        e * radius * Math.sqrt(3) + center, // x
        j * 2*radius + Math.abs(e) * radius + offset // y
      ])
      // e = 0 or [-1,or,1] = the x location(s) + center offset,
      // j = row + a half circle for the center column only + any initial offset
    )
  ).flat(2);
};

function canvasInit() {
  // initiate canvas
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', {alpha: false});
  ctx.canvas.width  = 1080; //screen.width;
  ctx.canvas.height = 2700; // screen.width; //screen.height; //todo
  // save post locations to canvas for later retrieve by "touch"
  canvas.loclocs = hexiful(canvas.width/5, canvas.width/2, canvas.width/6);
  canvas.scale = canvas.width/5/13 // one rad 14 ring is rad w/6 on screen = screen is 3 rings wide
};

function paintInit(rings) {
  for (let ring of rings) {
    ringImages[ring.code] = ringPaint(ring);
    textRingImages[ring.code] = polygonPaint(ring);
  }
}
//*

function squarepattern(pip, pipsize, gap){ //pip pattern-maker
  const canvas = new OffscreenCanvas(pipsize+gap, pipsize+gap);
  const ctx = canvas.getContext('2d', {alpha: true});

  stomp(pip, ctx);
  //typetap(txt, ctx);

  return ctx.createPattern(canvas, "repeat") // ctx.createPattern(canva, "repeat"); //canvas;
} // end of squarepattern

// STARS
//
function stars(ring){ //pip pattern-maker
  // initiate canvas
  const scale = document.getElementById('canvas').scale; //canvas.width/6/14;
  const whth = 2 * ring.rank * scale + 2;
  const canvas = new OffscreenCanvas(whth, whth);
  const ctx = canvas.getContext('2d', {alpha: true});
  const moons = [];

  const [x,y] = [whth/2, whth/2];
  let radiuso = ring.rank * scale;
  let radiusi = 0;

  const pippattern = { // this is a stamp
    x: 0,
    y: 0,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:ring.rank/200, y:ring.rank/200}, //{x:0.02, y:0.02},
    path: suitpathcode[ring.suit],
    style: pipstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
  };

  let piptext = { // this is a stamp
    x: 0,
    y: 0,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    //path: circlePath(radiuso, radiusi),
    //style: ringstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
    text: {
      msg: "" + ring.suit,
      pt: "14px ", font: "myFont",
      textAlign: "left" || "center" || "right",
      textBaseline:"top" || "alphabetic" ||  "middle" ,
      color: suitlinecode[ring.suit],
      x: 0, //ring.rank * scale || 0,
      y: 0,
    },
  };

  ctx.fillStyle = squarepattern(pippattern, 120, 200);
  ctx.fillRect(0,0,canvas.width,canvas.height);


//  for (let i=0; i<9; i++)(let j=0; j<9; j++){
//  }
/*
    moons.push([moon, piptext]);
    for (let [moon,txt] of moons) {
      stomp(moon, ctx);
      //typetap(txt, ctx);
    }
*/

    //ctx.save(); // do in caller
    //ctx.clip(new Path2D(stamp.path));
    //ctx.restore(); // do in calling function
    //stomp(moon, ct);

  return canvas;
  //return ctx.createPattern(canvas, "repeat")
} // end of stars
//*/

function polygonPaint(ring){
  // initiate canvas
  const scale = document.getElementById('canvas').scale; //canvas.width/6/14;
  const whth = 2 * ring.rank * scale * 2;
  const canvas = new OffscreenCanvas(whth, whth);
  const ctx = canvas.getContext('2d', {alpha: true});
  const moons = [];

  const [x,y] = [whth/2, whth/2];
  let radiuso = ring.rank * scale;
  let radiusi = 0; //(ring.rank < 5);// ? 0 : 3 * scale; // 3-ring is size of num-ring

  const polygonmoon = { // this is a stamp
    x: 0,
    y: 0,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    path: polygonPath(ctx, whth, radiuso, ring.rank),
    style: polygonstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
  };
  let pipfill = { // this is a stamp
    x: 0,
    y: 0,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    img: stars(ring),
  };
  let moon = { // this is a stamp
    x: x,
    y: y,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    path: circlePath(radiuso, radiusi),
    style: thinringstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
  };
  let texto = { // this is a stamp
    x: x,
    y: y,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    //path: circlePath(radiuso, radiusi),
    //style: ringstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
    text: {
      msg: "" + ring.rank,
      pt: "60px ", font: "myFont",
      textAlign: "center" || "right",
      textBaseline: "middle" || "alphabetic" || "top",
      color: suitlinecode[ring.suit],
      x: 0, //ring.rank * scale || 0,
      y: 0,
    },
  };

  stomp(polygonmoon, ctx);
  ctx.save(); // do in caller
  stencil(polygonmoon, ctx);
  stomp(pipfill, ctx);
  ctx.restore(); // do in calling function
  stomp(moon, ctx);
  stomp(texto, ctx);

  return canvas;

} // end of polygonPaint

function ringPaint(ring){
  // initiate canvas
  const scale = document.getElementById('canvas').scale; //canvas.width/6/14;
  const whth = 2 * (ring.rank * scale + 2);
  const canvas = new OffscreenCanvas(whth, whth);
  const ctx = canvas.getContext('2d', {alpha: true});
  const moons = [];

  const [x,y] = [whth/2, whth/2];
  let radiuso = ring.rank * scale;
  let radiusi = 0; //(ring.rank < 5);// ? 0 : 3 * scale; // 3-ring is size of num-ring

  const linedmoon = { // this is a stamp
    x: 0,
    y: 0,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    path: polygonPath(ctx, whth, radiuso, ring.rank),
    style: pipstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
  };

  let moon = { // this is a stamp
    x: x,
    y: y,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    path: circlePath(radiuso, radiusi),
    style: ringstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
    /*
    text: {
      msg: (ring === post.top) ? ring.rank : "",  //textpips.chinese[ring.rank] : "",
      pt: "32px ", font: "myFont",
      textAlign: "center" || "right",
      textBaseline: "middle" || "alphabetic" || "top",
      color: suitlinecode[ring.suit],
      x: 0, y: 2,
    }
    */
  };

  let moonhole = { // this is a stamp
    x: x,
    y: y,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    path: circlePath(radiuso, radiusi),
  };
  let texto = { // this is a stamp
    x: x,
    y: y,
    theta: 0, //Math.random()*3.14, //todo
    scale: {x:1, y:1},
    path: circlePath(radiuso, radiusi),
    style: ringstyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
    text: {
      msg: "" + ring.rank,
      pt: "40px ", font: "myFont",
      textAlign: "center" || "right",
      textBaseline: "middle" || "alphabetic" || "top",
      color: suitlinecode[ring.suit],
      x: 0, //ring.rank * scale || 0,
      y: 0,
    },
  };

  moons.push([moon,moonhole,linedmoon]);


  for (let [moon, moonhole, linepip] of moons) {
    //ctx.save();
    //stencil(moonhole, ctx);
    stomp(moon, ctx);
    //stomp(linepip, ctx);
    //ctx.restore();

  }

  return canvas;

} // end of ringPaint







function paint() {
  // read game state
  gamestate = JSON.parse(localStorage.getItem('gamestates')).at(-flags.undoCount - 1)
  actionsuit = (gamestate.action) ? gamestate.action[0][1] : "⊝"; // todo
  // define elements; from logic
  const posts = [...gamestate.posts].map((post,i) => ({
    id: i,
    ord: i,
    rings: post,
    top: post.at(-1) || 0,})
  );
  const batterys = [...gamestate.batts].map((batt,i) => ({
    id: i,
    ord: i,
    rings: batt,})
  );

  // initiate canvas
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', {alpha: false});

  const w = canvas.width; //window.innerWidth;
  const h = canvas.height; //window.innerHeight;
  const scale = document.getElementById('canvas').scale;
  // define element locations
  const loclocs = document.getElementById('canvas').loclocs;
  const postlocs = [...loclocs].slice(0,10); // .sort(([x,y],[u,v]) => v-y)
  const batterylocs = [...loclocs].slice(10,12).concat([...loclocs].slice(13,16));
  const undoloc = [...loclocs][12];
  //console.log(postlocs, batterylocs, undoloc);

  // set background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);








  /////////////
  //
  //    paint commands
  //
  ////



  //
  // paint undo button
  undoColor(undoloc); //(postIdx)
  //
  for (let post of posts) {
    //const postlocs = document.getElementById('canvas');
    const [x,y] = postlocs[post.id];
    for (let ring of post.rings) {
      let img = (ring === post.top) ? textRingImages[ring.code] : ringImages[ring.code];
      if (post.id !== flags.selectedPost) {
        stomp({ // this is a stamp
          x: x - img.width/2,
          y: y - img.height/2, // backout bc canvas in corner not center
          theta: 0, //Math.random()*3.14, //todo
          scale: {x:1, y:1},
          img: img,
        }
        , ctx);
      }
    }
  }

  for (let post of batterys) {
    batteryPaint(post);
  }
  // higlight ring on selection
  if ([0,1,2,3,4,5,6,7,8,9].includes(flags.selectedPost)) {
    //ringHighlight(posts[flags.selectedPost]);
    animate(ctx, rabbits(posts[flags.selectedPost]));
    //rabbits(posts[flags.selectedPost]).forEach((stamp,i) => animate(ctx, stamp));
  }



  //animate(ctx, moonstrip); // plays moonstrip
  //flip(ctx, moonstrip); // flip(ctx, moonstrip, loops=1, frame=0)


  function rabbits(post) {
    const rabbits = [];
    const scale = w/6/14;
    const [x,y] = loclocs[post.id];
    if (post.rings.length > 0) {
      post.rings.forEach((ring,i) => {
        let img = textRingImages[ring.code];
        let moon = { // this is a stamp
          x: x - img.width/2,
          y: y + i * 2.2 * scale - img.height/2, // backout bc canvas in corner not center
          theta: 0, //Math.random()*3.14, //todo
          scale: {x:1, y:1},
          img: img,
          /*
          text: {
            msg: "" + ring.rank,
            pt: "32px ", font: "myFont",
            textAlign: "center" || "right",
            textBaseline: "middle" || "alphabetic" || "top",
            color: suitlinecode[ring.suit],
            x: w/12, //ring.rank * scale || 0,
            y: (post.rings.length - i - 1) * 3 * scale,
          },
          */
        };
        rabbits.push(moon); //if (ring.up && ring.rings) rabbits.push(rabbit);
      });
    }
    /*
    for (let txt of rabbits) {
      stomp(txt, ctx);
      //typetap(txt, ctx);
    }
    */
    return rabbits
  } // end of rabbits


  // batterys
  function batteryPaint(post){// one rad 14 ring is rad w/6 on screen = screen is 3 rings wide
    const moons = [];
    const scale = w/6/14;
    const [x,y] = batterylocs[post.id];

    for (let ring of post.rings) {
      let radiuso = ring.rank * scale;
      let moon = { // this is a stamp
        x: x, //centerd +
        y: y, //space at top +
        theta: 0, //Math.random()*3.14, //todo
        scale: {x:1, y:1},
        path: circlePath(radiuso),
        style: batterystyle(ctx, ring), //rgbaString([10,10,10], a=0.2)
        text: undefined, //{},
      };
      moons.push(moon);
    }

    for (let moon of moons) {
      stomp(moon, ctx);
    }

  } // end of batteryPaint

  // selection
  function ringHighlight(post, ){// one rad 14 ring is rad w/6 on screen = screen is 3 rings wide
    const moons = [];
    const scale = w/6/14;
    const [x,y] = loclocs[post.id];

    const radiuso = 14 * scale;
    let moon = { // this is a stamp
      x: x, //centerd +
      y: y, //space at top +
      theta: 0, //Math.random()*3.14, //todo
      scale: {x:1, y:1},
      path: circlePath(radiuso),
      style: genericStyle(undefined, suitlinecode[post.top.suit], 8),
      text: false,
    };

    moons.push(moon);

    for (let moon of moons) {
      stomp(moon, ctx);
    }
  } // end of ringHighlight

  function undoColor(loc){// one rad 14 ring is rad w/6 on screen = screen is 3 rings wide
    const moons = [];
    const scale = w/6/14;
    const [x,y] = loc;

    let radiuso = 8 * scale;
    let moon = { // this is a stamp
      x: x, //centerd +
      y: y, //space at top +
      theta: 0, //Math.random()*3.14, //todo
      scale: {x:1, y:1},
      path: circlePath(radiuso),
      style: {
        gradient: false,
        line: {
          width: 2,
          cap: "round" || "butt" || "square" ,
          join:  "round" || "miter" || "bevel",
          color: suitlinecode[actionsuit],
          dash: [], // [] for none
          dashOffset: 0, // 0 for none
        },//*/
        fill:
          //{fillStyle: fillcolor,},
          false,
        shadow:
          //{shadowColor: fillcolor, shadowOffsetX: 0, shadowOffsetY: 0, shadowBlur: 16,},
          false,
        },
      text: {
        msg: "⟲",
        pt: "60px ", font: "myFont",
        textAlign: "center" || "right",
        textBaseline: "middle" || "alphabetic" || "top",
        color: suitlinecode[actionsuit],
        x: 0, y: 0,
      },
    };

    moons.push(moon);

    for (let moon of moons) {
      stomp(moon, ctx);
    }

  } // end of undoColor

} // end of paint







///
