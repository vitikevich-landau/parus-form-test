const REGEX_PHONE = /(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?/g;
const REGEX_MOBILE_PHONE = /^(\d{3})(\d{3})(\d{4})$/;
const REGEX_CITY_PHONE = /^(\d{5})(\d)(\d{2})(\d{2})$/;
const CITY_CODE = `388`;


const clearPhoneNumber = phone => {
    const replaced = `${phone}`.replace(/\D/g, '');
    return replaced.length > 10 ? replaced.substring(1) : replaced;
};

const formatPhoneNumber = phone => {
    //Filter only numbers from the input
    const cleaned = clearPhoneNumber(phone);

    //Check if the input is of correct length
    const mobile = cleaned.match(REGEX_MOBILE_PHONE);
    const city = cleaned.match(REGEX_CITY_PHONE);

    if (phone.startsWith(CITY_CODE)) {
        if (city) {
            return `(${city[1]}) ${city[2]}-${city[3]}-${city[4]}`;
        }
    } else {
        if (mobile) {
            return `(${mobile[1]}) ${mobile[2]} ${mobile[3]}`;
        }
    }

    return null
};

const getMatchPhones = str => str.match(REGEX_PHONE).map(v => clearPhoneNumber(v));

module.exports = {
    formatPhoneNumber,
    getMatchPhones,
    clearPhoneNumber
};