
  /////////
  // ANIMATION
  /////////////////////

function flip(ctx, moonstrip){
  // paints on canvas
  // one stomp each moonframe
  //

  console.log("flippping");
  let flips = 1;
  let frame = 0;
  const resetBackground = false; // background; //"#112222"; //false;
  loop();


  function stomp(stamp) {
    //console.log("stomping");
    // reset background
    if (resetBackground){
      ctx.fillStyle = resetBackground;
      ctx.fillRect(0, 0, w, ctx.canvas.height);
    }

    //let path = new Path2D(stamp.path);
    //let path = stamp.path;
    //ctx.translate(stamp.x, stamp.y);
    //ctx.rotate(stamp.theta);
    ctx.scale(1,1);

    ctx.drawImage(stamp, 0, 0);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  } // end of stomp


  // plays (stomp()) moonstrip until end of loops, end of strip
  function stamper(){
    let done = true; //asserts true
    // when done stays true, loop stops
    if (flips > 0){
      stomp(moonstrip[frame]);
      frame = (frame+1)%(moonstrip.length);
      if (frame === 0){
        flips -= 1;
      }
      done = false; // if still running, set false
    }
    return done;
  }

  // when solve = true, loop runs
  // after timeout, runs flipthem, on loop, until flipthem return false
  function loop(){
    if(!stamper()){
      setTimeout(loop, 1000/24); //32 times per second
    }
  }
}
  /////////////////////////////////////////////
