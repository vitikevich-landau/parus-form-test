const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const _delay = ms => new Promise(resolve => setTimeout(resolve, ms, {ms}));

const delay = () => _delay(randomInteger(350, 2150));


module.exports = delay;