
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
}

function canvasInit() {
  // initiate canvas
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', {alpha: false});
  ctx.canvas.width  = 1080; //screen.width;
  ctx.canvas.height = 2 * 1080; // screen.width; //screen.height; //todo
  // save post locations to canvas for later retrieve by "touch"
  canvas.loclocs = hexiful(canvas.width/6, canvas.width/2, canvas.width/6);
}

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


  // higlight ring on selection
  if ([0,1,2,3,4,5,6,7,8,9].includes(flags.selectedPost)) ringHighlight(posts[flags.selectedPost]);
  //
  for (let post of posts) {
    postPaint(post);
  }
  for (let post of batterys) {
    batteryPaint(post);
  }
  // paint undo button
  undoColor(undoloc); //(postIdx)


  //animate(ctx, moonstrip); // plays moonstrip
  //flip(ctx, moonstrip); // flip(ctx, moonstrip, loops=1, frame=0)




  function postPaint(post){// one rad 14 ring is rad w/6 on screen = screen is 3 rings wide
    const moons = [];
    const scale = w/6/14;
    const [x,y] = postlocs[post.id];

    for (let ring of post.rings) {
      let radiuso = ring.rank * scale;
      let radiusi = 0; //(ring.rank < 5);// ? 0 : 3 * scale; // 3-ring is size of num-ring

      let linedmoon = { // this is a stamp
        x: x - radiuso, //centerd +
        y: y - radiuso, //space at top +
        theta: 0, //Math.random()*3.14, //todo
        scale: {x:1, y:1},
        path: linefillpath(ctx, ring, scale),
        style: linefillstyle(ctx, ring, post), //rgbaString([10,10,10], a=0.2)
      };

      let moon = { // this is a stamp
        x: x, //centerd +
        y: y, //space at top +
        theta: 0, //Math.random()*3.14, //todo
        scale: {x:1, y:1},
        path: circlePath(radiuso, radiusi),
        style: ringstyle(ctx, ring, post), //rgbaString([10,10,10], a=0.2)
        text: {
          msg: (ring === post.top) ? ring.rank : "",  //textpips.chinese[ring.rank] : "",
          pt: "64px ", font: "myFont",
          textAlign: "center" || "right",
          textBaseline: "middle" || "alphabetic" || "top",
          color: suitlinecode[ring.suit],
          x: 0, y: 3,
        }
      };

      let moonhole = { // this is a stamp
        x: x, //centerd +
        y: y, //space at top +
        theta: 0, //Math.random()*3.14, //todo
        scale: {x:1, y:1},
        path: circlePath(radiuso, radiusi),
      };

      moons.push([moon,moonhole,linedmoon]);
    }

    for (let [moon, moonhole, linepip] of moons) {
      ctx.save();
      stencil(moonhole, ctx);
      //stomp(linepip, ctx);
      ctx.restore();
      stomp(moon, ctx);
    }

/*
    const rabbits = [];
    //const ups = posts.rings.filter((e) => e.)
    for (let ring of post.rings) {
      let rabbit = { // this is a stamp
        x: x, //centerd +
        y: y, //so to put the text in the fn middle
        theta: 0,
        scale: {x:1, y:1},
        text: {
          msg: "" + ring.rank,
          pt: "16px ", font: "myFont",
          textAlign: "center" || "right",
          textBaseline: "middle" || "alphabetic" || "top",
          color: suitlinecode[ring.suit],
          x: 0, y: ring.rank * scale,
        },
      };
//      if (ring.up && ring.rings) rabbits.push(rabbit);
    }
    for (let txt of rabbits) {
      //stomp(moon, ctx);
      typetap(txt, ctx);
    }
    */

    //animate(ctx, moons);

  } // end of postPaint


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
      style: genericStyle(undefined, suitlinecode[actionsuit], 2),
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
