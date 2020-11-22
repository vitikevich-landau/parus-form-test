const {employees} = require("../models/Employees");
const {formatPhoneNumber} = require(`../lib/phones`);
const {delay} = require(`../lib/delay`);

const verifyByPhone = async (req, res, next) => {
    const {phone} = req.query;
    const formatted = formatPhoneNumber(phone);

    console.log(phone, formatted);
    const querySet = await employees.getByPhone(formatted);
    const {rows} = querySet;
    const answer = rows.map(r =>
        ({
            phone: r[1],
            phone2: r[2],
            fax: r[3],
            telex: r[4],
            name: r[5],
            title: r[7],
        })
    );

    console.log(rows);
    console.log(answer);

    /**
     *  Валидация длины телефонного номера
     *
     *  Не обрарабывать запросы если пришло что-то больше
     *
     *  Блокировка отправки с других поддоменов
     * */

    await delay();

    res.send(answer);
};

module.exports = {
    verifyByPhone
};