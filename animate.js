
  /////////
  // ANIMATION
  /////////////////////

function animate(ctx, moonstrip, loops=1, frame=0){
  // paints on canvas
  // moonstrip = array of objects "stamps" with instructions to "stomp"
  // one stomp each moonframe
  //

  const resetBackground = false; // background; //"#112222"; //false;
  loop();


  // plays (stomp()) moonstrip until end of loops, end of strip
  function flipper(){
    let done = true; //asserts true
    // when done stays true, loop stops
    if (loops > 0){
      stomp(moonstrip[frame], ctx);
      frame = (frame+1)%(moonstrip.length);
      if (frame === 0){
        loops -= 1;
      }
      done = false; // if still running, set false
    }
    return done;
  }

  // when solve = true, loop runs
  // after timeout, runs flipthem, on loop, until flipthem return false
  function loop(){
    if(!flipper()){
      setTimeout(loop, 1000/moonstrip.length/60); //32 times per second
    }
  }
}
  /////////////////////////////////////////////
