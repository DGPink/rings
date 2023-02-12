// SPIDER
// This game is based on the solitare game "spider",
// it uses 2 decks of 52 cards, in four suits,
// cards numbered 1-13, twice
// in this version the cards are the blocks on the gameboard
// then used in stacks, then stacks darkmode, now copied to :
//
// RINGS
//
//
/////////////////////////////////
//var posts; // still called by paint, //todo
const flags = {
  selectedPost: -1,
  undoCount: 0, //todo some must be in gamestateflags // bug: can undo crown, but not zslot count
  nextZslot: 0,
  score: 0,
  autocrown: true,
  autoexplode:false,
  updnDisplay: {qty: false, suit: false, rank: false},
  battDisplay: {qty: false, suit: false, rank: false},
};

////////////////
//
// METHODS
//
///////////////


function updateGamestatePlace(fromIndex, toIndex) {
  const gamestate = JSON.parse(localStorage.getItem('gamestates')).at(-1);
  const posts = gamestate.posts;
  const p1 = posts[fromIndex]; //.up; //fromPost = flagged post
  const p2 = posts[toIndex];  // .up; //toPost = closepost
  const action = [p1.at(-1), p2.at(-1)].map(p => p ? p.code : "empty")
  console.log(...action);

  // if fromPost (p1) is empty, return copy of gamestate (no change)
  if (posts[fromIndex].length < 1) {
    gamestate.nogo = true; // flag to disavow this
    return gamestate;
  }
  const idx = (posts[toIndex].length < 1) ? // if toPost (p2) is empty
    // move tallest possible stack (until no kingchain), or top ring. always moves something
    p1.findLastIndex((e,i,r) => i < 1 || !(e.rank === r[i-1].rank - 1 && e.suit === r[i-1].suit))
    // else try to move first stack that can go
    : p1.findLastIndex((e,i,r) => e.rank + 1 === p2.at(-1).rank // can go atop p2
        && r.slice(i).every((f,j,s) => j === s.length-1 || (f.rank === s[j+1].rank + 1 && f.suit === s[j+1].suit))
    ); //and is top or kingchains
    //i === r.length-1 || (e.rank === r[i+1].rank + 1 && e.suit === r[i+1].suit)

  if (idx === -1) { // -1 means no move allowed
    gamestate.nogo = true; // flag to disavow this
    return gamestate;
  }

  posts[toIndex] = p2.concat(p1.slice(idx));
  posts[fromIndex] = p1.slice(0,idx);

  // check for crown
  if (flags.autocrown) {
    let stack = posts[toIndex].slice(-13);
    //pposts[toIndex].findLastIndex((e,i,r) => i < 1 || !(e.rank === r[i-1].rank - 1 && e.suit === r[i-1].suit))
    if (stack.length === 13
      && stack.every((f,j,s) => j === s.length-1 || (f.rank === s[j+1].rank + 1 && f.suit === s[j+1].suit))) {
      posts[toIndex] = posts[toIndex].slice(0,-13);
      gamestate.zslots[flags.nextZslot].push(...stack);
      console.log("autoexploding ring", flags.nextZslot);
      flags.nextZslot++;
    }
  }
  // todo
  gamestate.action = action;

  return Object.assign(gamestate, {posts: posts});
} // end updateGamestatePlace

function updateGamestateDeal(index) {
  const gamestate = JSON.parse(localStorage.getItem('gamestates')).at(-1);
  console.log("deal", index);
  let posts = gamestate.posts.map((post,i) => post.concat(gamestate.batts[index][i]));
  let batts = gamestate.batts.map((batt,i) => (index === i) ? [] : batt);
  return Object.assign(gamestate, {posts: posts}, {batts: batts}); //gamestate;
} // end updateGamestateDeal
//////////////////////  end updateGamestate

// gamestate is what is sent to print, it is stored in an array, gamestates.
function handlePlace(closepost){ // from touch: toPost, p2, second post touched
  // copy and slice for any "undos" = undoCount
  const gamestatesLocal = JSON.parse(localStorage.getItem('gamestates'));
  const gamestates = gamestatesLocal.slice(0, gamestatesLocal.length - flags.undoCount);
  // with action (place or deal), game state is saved as new branch
  localStorage.setItem('gamestates', JSON.stringify(gamestates));
  flags.undoCount = 0;

  // new state with place event executed
  const newgamestate = updateGamestatePlace(flags.selectedPost, closepost);
  if (!newgamestate.nogo) {
    gamestates.push(newgamestate)
    localStorage.setItem('gamestates', JSON.stringify(gamestates));
  }

  // paint that same state
  flags.selectedPost = -1; //todo is there a better way?
  paint();
};
function handleDeal(closebatt){ // from touch, last, or toPost
  // copy and slice for any "undo-s" = undoCount
  const gamestatesLocal = JSON.parse(localStorage.getItem('gamestates'));
  const gamestates = gamestatesLocal.slice(0, gamestatesLocal.length - flags.undoCount);
  //
  if (gamestates.at(-1).batts[closebatt].length < 1) return
  // with action (place or deal), game state is saved as new branch
  localStorage.setItem('gamestates', JSON.stringify(gamestates));
  flags.undoCount = 0;

  // new state with deal event executed
  const newgamestate = updateGamestateDeal(closebatt);

  gamestates.push(newgamestate)
  localStorage.setItem('gamestates', JSON.stringify(gamestates));
  // paint that same state
  paint();
};
function handleUndo(distance){ // from touch, last, or toPost
  const gamestates = JSON.parse(localStorage.getItem('gamestates'));
  if (gamestates.length > flags.undoCount + 1) {
    flags.undoCount++;
    //console.log(gamestates);
    //console.log(-flags.undoCount - 1);
    paint(); // gamestates.at(-flags.undoCount - 1)
  }
};

// gamestates = JSON.parse(localStorage.getItem('gamestates'));


////////////////////////////////////////////////
// SETUP
/////////////////////////////////////////////////

function logicInit() {

  // FOR DEBUGGING ::::::::;;;
  localStorage.clear();

  // make a shuffled deck
  if (!localStorage.getItem('cardcode')) {
    localStorage.setItem('cardcode',
      ["K","Q","J","0","9","8","7","6","5","4","3","2","A"]
        .map(e=>["♥","♦","♣","♠"]
          .map(f=>[e+f+"0",e+f+"1"]))
        .flat(2)
        .map((e,i,r) => {
          const j = i + Math.floor(Math.random() * (r.length-i));
          [r[i], r[j]] = [r[j], r[i]];
          return r[i]
        })
        .join(",")
    ); // shuffled fischer-yeats or whatever
  }
  console.log(localStorage.getItem('cardcode'));

  // make array of rings from deck code
  const rings = localStorage.getItem('cardcode').split(",").map(
    code => {
        let [r,s,d] = code.split("");
        return ({
          code: code,
          rank: pipcode[r],
          suit: s,
          deck: d,
        })
      }
  );
  console.log(rings);
  paintInit(rings);

  // make initial game state: place rings on posts and batts
  const gamestateInitial = {
    rings: rings,
    batts: [...Array(5)].map((_,i) => rings.slice(i*10, i*10 + 10)), // first 50 rings
    posts: [6,6,6,6] // four extra rings: 1 each on posts 1 thru 4
      .map((rqty,i) => [...Array(rqty)]
        .map((_,j) => rings[50 + 6*i + j])) // from rings 50 thru 50+24
      .concat([5,5,5,5,5,5] // the rest get 5 rings each
        .map((rqty,i) => [...Array(rqty)]
          .map((_,j) => rings[50 + 5*i + j + 24]))), // from rings 50 + 24 to end (+30)
    zslots: [...Array(8)].map((_,i) => []),
  }

  if (!localStorage.getItem('gamestates')){
    localStorage.setItem('gamestates', JSON.stringify([gamestateInitial]));
  }

  const gamestates = JSON.parse(localStorage.getItem('gamestates'));
  //localStorage.setItem('gamestates', JSON.stringify(gamestates.push(newgamestate)));
  //posts = gamestates.at(-1).posts;
  console.log(gamestates.at(-1));

  paint(gamestates.at(-1)); // paint initial gamestate

} // end logicInit




/* // original idea ::::
function updateGamestate(gamestate) {
  const p1 = gamestate.posts[flags.selectedPost]; //fromPost
  const p2 = gamestate.posts[closepost]; //toPost
  let idx = p1.findLastIndex(e => e.num+1 === p2.at(-1).num);
  if ( p1.slice(idx).every((e,i,r) => i ? (e.num === r[i-1].num - 1 && e.suit === r[i-1].suit) : e.num === p2.at(-1).num - 1) ) {
    p2 = p2.concat(p1.slice(idx));
    p1 = p1.slice(0,idx);
    p1.at(-1).suit = p1.at(-1).suit[1];
  }
  //down = suit is code, up: code[1]
  return [p1,p2];
} // end updateGamestate
*/



// todo
function resetGame(){
  localStorage.clear();
  score = 0;
  newGame();
}
// todo
function newGame(){
  actionlog = [];
  //todo
}





  ///////////////
  // ACTION
  ///////////////



function explode(){
  console.alert("BOOM");
}

function winner(){
  alert("Winner!");
}


//////////////////
/// INSTRUCTIONS / SETTINGS ////////////////
/////////////////////////////////////////////////////

// todo






//
