const {clearPhoneNumber} = require(`../lib/phones`);

const RECORDS = [
    {title: `Schuster Group`, name: `Chandler Lindgren`, phone: `+79291234567`},
    {title: `Intuitive fresh-thinking service-desk`, name: `Alexandra Lind`, phone: `89261234564`},
    {title: `Public-key dynamic focus group`, name: `Rahsaan McClure`, phone: `79261234267`},
    {title: `Multi-lateral zero administration strategy`, name: `Madge Lindgren`, phone: `+7 (388)22 2-12 78`},
    {title: `Total methodical definition`, name: `Gwen Turner III`, phone: `+7 927 123 45 67`},
    {title: `Optimized impactful architecture`, name: `Lucas Dietrich`, phone: `8(922)123-45-67`},
    {title: `Reverse-engineered responsive data-warehouse`, name: `Braden Collier`, phone: `123-45-67`},
    {title: `Pre-emptive bandwidth-monitored array`, name: `Blanca Friesen MD`, phone: `9261234568`},
    {title: `Programmable methodical benchmark`, name: `Violette Lynch`, phone: `79261234567`},
    {title: `Programmable methodical benchmark`, name: `Antone Friesen`, phone: `79261234567`},
    {title: `Programmable methodical benchmark`, name: `Catharine Collier I`, phone: `79261234567`},
    {title: `Public-key even-keeled hub`,name: `Ms. Mariam Adams`, phone: `(495)1234567`},
    {title: `Front-line attitude-oriented monitoring`,name: `Noble Thompson`, phone: `(495) 123 45 67`},
    {title: `Universal high-level collaboration`,name: `Imani O'Keefe`, phone: `89261236567`},
    {title: `Organic uniform installation`,name: `Warren Rosenbaum`, phone: `8-927-123-45-67`},
    {title: `Programmable hybrid conglomeration`,name: `Ms. Dee Bechtelar`, phone: `8 927 193 234`},
    {title: `Progressive executive instruction set`,name: `Terrell Kemmer`, phone: `8 927 12 12 888`},
    {title: `Business-focused 24 hour projection`,name: `Bertram Spencer`, phone: `8 927 12 555 12`},
    {title: `Optional disintermediate policy`,name: `Weston Ritchie`, phone: `8 927 123 8 123`},
    {title: `Synergized motivating orchestration`,name: `Vicky Ebert`, phone: `9139989898`},
];

const findByPhone = phone =>
    RECORDS.filter(v => clearPhoneNumber(v[`phone`]) === clearPhoneNumber(phone));


module.exports = {
    findByPhone
};