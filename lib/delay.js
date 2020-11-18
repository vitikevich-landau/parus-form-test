const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const _delay = ms => new Promise(resolve => setTimeout(resolve, ms, {ms}));

const delay = (min = 350, max = 2150) => _delay(randomInteger(min, max));


module.exports = delay;