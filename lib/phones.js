const REGEX_PHONE = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/g;
const REGEX_MOBILE_7_PHONE = /^7(\d{3})(\d{3})(\d{4})$/;
const REGEX_MOBILE_PHONE = /^(\d{3})(\d{3})(\d{4})$/;
const REGEX_CITY_PHONE = /^(\d{5})(\d)(\d{2})(\d{2})$/;
const REGION_CODES = [
    `388`,`385`,`416`,`814`,`818`,`851`,`472`,`483`,`302`,`492`,`844`,
    `817`,`820`,`844`,`473`,`426`,`493`,`395`,`866`,`401`,`484`,`415`,
    `878`,`384`,`833`,`494`,`861`,`862`,`391`,`352`,`471`,`812`,`813`,
    `474`,`413`,`495`,`495`,`496`,`815`,`818`,`831`,`816`,`383`,`381`,
    `353`,`486`,`841`,`342`,`423`,`811`,`877`,`347`,`301`,`872`,`873`,
    `847`,`814`,`821`,`836`,`834`,`867`,`843`,`855`,`394`,`341`,`390`,
    `835`,`411`,`863`,`491`,`846`,`848`,`845`,`424`,`343`,`481`,`863`,
    `865`,`879`,`475`,`482`,`382`,`487`,`345`,`346`,`842`,`421`,`351`,
    `871`,`302`,`427`,`349`,`485`
];

/***
 *  Принимает matched номер телефона.
 *
 * @param phone
 * @returns {string}
 */
const clearPhoneNumber = phone => {
    const replaced = `${phone}`.replace(/\D/g, '');
    return replaced.length > 10 ? replaced.substring(1) : replaced;
};

const formatPhoneNumber = (phone, userFriendly = true) => {
    if (phone.match(REGEX_PHONE)) {
        const cleaned = clearPhoneNumber(phone);

        const mobile = cleaned.match(REGEX_MOBILE_PHONE);
        const city = cleaned.match(REGEX_CITY_PHONE);

        if (REGION_CODES.some(v => cleaned.startsWith(v))) {
            if (city) {
                if (userFriendly) {
                    return `+7 (${city[1]}) ${city[2]}-${city[3]}-${city[4]}`;
                } else {
                    return `7${city[1]}${city[2]}${city[3]}${city[4]}`;
                }

            }
        } else {
            if (mobile) {
                if (userFriendly) {
                    return `+7 (${mobile[1]}) ${mobile[2]} ${mobile[3]}`;
                } else {
                    return `7${mobile[1]}${mobile[2]}${mobile[3]}`;
                }
            }
        }
    }

    return phone;
};

const getMatchPhones = str => str.match(REGEX_PHONE).map(v => clearPhoneNumber(v));

module.exports = {
    formatPhoneNumber,
    getMatchPhones,
    clearPhoneNumber,
    REGEX_PHONE,
    REGEX_MOBILE_7_PHONE
};