function playSound1() {
  const player = require('play-sound')();
  player.play('./media/ahaa.m4a', (err) => {
    if (err) console.log(`could not play sound: ${err}`);
  })
}
function playSound2() {
  const player = require('play-sound')();
  player.play('./media/bebwaj.m4a', (err) => {
    if (err) console.log(`could not play sound: ${err}`);
  })
}
console.log("play sound one");
playSound1();
console.log("play sound two");
playSound2();

