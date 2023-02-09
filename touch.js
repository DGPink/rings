
function touchSetup() {
  const el = document.getElementById('canvas');
  el.addEventListener('touchstart', handleStart);
  el.addEventListener('touchend', handleEnd);
  el.addEventListener('touchcancel', handleCancel);
  el.addEventListener('touchmove', handleMove);
}


function closestPost(touch){
  const distances = document.getElementById('canvas').loclocs
    .map(([x,y]) => Math.hypot(x - touch.x, y - touch.y));
  const index = distances.indexOf(Math.min(...distances));
  return [index, distances[index]];
}

function handlePost(numberClosestPost, distance) {
  // returns label this selected, a number
  if (flags.selectedPost === numberClosestPost) {
    return -1;
  } // deselect if same
  if ([0,1,2,3,4,5,6,7,8,9].includes(numberClosestPost)) {
    if (flags.selectedPost === -1) {
      return numberClosestPost;
    } // select if no selection
    handlePlace(numberClosestPost);
  }
  if ([10,11,13,14,15].includes(numberClosestPost)) { // matches to batts[i]
    if (![0,1,2,3,4,5,6,7,8,9].includes(flags.selectedPost)){
      handleDeal([10,11,13,14,15].indexOf(numberClosestPost));
    }
  }
  if ([12].includes(numberClosestPost)) {
    handleUndo(distance);
  }
  return -1; // flags.selectedPost is set to -1, (no selection)
}


function handleStart(e) {
  e.preventDefault();
  let touch = {x: e.touches[0]["pageX"], y: e.touches[0]["pageY"]};
  let [closepost, distance] = closestPost(touch);
  console.log(closepost);
  flags.selectedPost = handlePost(closepost, distance); //send to decider, returns selected post for housekeeping
  paint();
}


function handleEnd(){
  //console.log("end handled");
}
function handleCancel(){
  console.log("cancel handled");
}
function handleMove(){
  console.log("move handled");
}
