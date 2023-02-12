
  /////////
  // PRESS
  /////////////////////

function press(moonstrip, ){
  // paints on canvas
  // one stomp each moonframe
  //

  // make canvas
  if (!ctx) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    const w = 720;
    //const h = window.innerHeight;
    ctx.canvas.width  = w;
    ctx.canvas.height = w;

    // set background
    ctx.fillStyle = "#112222";
    ctx.fillRect(0, 0, w, ctx.canvas.height);
  }


  const resetBackground = false; // background; //"#112222"; //false;
  moonstrip.forEach(frame => stomp(frame));

  //return canvas

} // end of press



function stomp(stamp, ctx) {
/*
  // reset background
  if (resetBackground){
    ctx.fillStyle = resetBackground;
    ctx.fillRect(0, 0, w, h);
  }
*/
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  let path = new Path2D(stamp.path); // even if Path2D, now for sure
  ctx.translate(stamp.x, stamp.y);
  ctx.rotate(stamp.theta);
  ctx.scale(stamp.scale.x,stamp.scale.y); //80,80

  if (stamp.img) {
    ctx.drawImage(stamp.img, 0, 0);
  }
  if (stamp.style) {
    if (stamp.style.gradient){
      console.log("ned gad mad");// todo: ctx.createLinearGradient();
    };
    if (stamp.style.shadow){
      //console.log("shad mad");
      for (let [typ,sty] of Object.entries(stamp.style.shadow)) {
        ctx[typ] = sty;
      }
    };
    if (stamp.style.line){
      ctx.lineWidth = stamp.style.line.width; // Nb: pixelminutes
      ctx.lineCap = stamp.style.line.cap;
      ctx.strokeStyle = stamp.style.line.color;
      //ctx.stroke-opacity="1";
      ctx.lineJoin = stamp.style.line.join;
      //ctx.miterLimit = stamp.style.line.miterLimit;
      ctx.setLineDash(stamp.style.line.dash);
      ctx.lineDashOffset = stamp.style.line.dashOffset;
      ctx.stroke(path);
    };
    if (stamp.style.fill){
      ctx.fillStyle = stamp.style.fill.fillStyle;
      ctx.fill(path);
    };
  }

  if (stamp.text){
    //ctx.setTransform(1, 0, 0, 1, 0, 0); // todo:
    ctx.fillStyle = stamp.text.color;
    ctx.font = stamp.text.pt + stamp.text.font;
    ctx.textAlign = stamp.text.textAlign; //"center" || "right";
    ctx.textBaseline = stamp.text.textBaseline; //"middle" || "alphabetic" || "top";
    ctx.fillText(stamp.text.msg, stamp.text.x, stamp.text.y);
  };

  ctx.setTransform(1, 0, 0, 1, 0, 0);
} // end of stomp


function typetap(stamp, ctx) {

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  let path = new Path2D(stamp.path); // even if Path2D, now for sure
  ctx.translate(stamp.x, stamp.y);
  ctx.rotate(stamp.theta);
  ctx.scale(stamp.scale.x,stamp.scale.y); //80,80

  ctx.fillStyle = stamp.text.color;
  ctx.font = stamp.text.pt + stamp.text.font;
  ctx.textAlign = stamp.text.textAlign; //"center" || "right";
  ctx.textBaseline = stamp.text.textBaseline; //"middle" || "alphabetic" || "top";
  ctx.fillText(stamp.text.msg, stamp.text.x, stamp.text.y);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
} // end of typetap

function stencil(stamp, ctx) {

  //ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(stamp.x, stamp.y);
  ctx.rotate(stamp.theta);
  ctx.scale(stamp.scale.x,stamp.scale.y); //80,80

  //ctx.save(); // do in caller
  ctx.clip(new Path2D(stamp.path));
  //ctx.restore(); // do in calling function

  //ctx.setTransform(1, 0, 0, 1, 0, 0);
} // end of stencil
  /////////////////////////////////////////////
