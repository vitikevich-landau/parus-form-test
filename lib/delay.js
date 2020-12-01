const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const _delay = ms => new Promise(resolve => setTimeout(resolve, ms, {ms}));

const delay = (min = 750, max = 3150) => _delay(randomInteger(min, max));


module.exports = {
    delay
};