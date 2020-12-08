const {connectAndExecute, connectAndExecuteMany} = require(`../db/connection`);
const {REGEX_MOBILE_7_PHONE} = require("../lib/phones");
const {formatPhoneNumber, REGEX_PHONE} = require("../lib/phones");

const TB_NAME = `AGNLIST`;

const select = async () => await connectAndExecute(
    `select * from ${TB_NAME}`,
    {},
    {/*maxRows: 300*/}
);


const movedNotMatched = async () => {
    try {
        const querySet = await select();
        const {metaData, rows} = querySet;

        const rnPos = metaData.findIndex(v => v.name === `RN`);
        const agnCommentPos = metaData.findIndex(v => v.name === `AGN_COMMENT`);
        const phonePos = metaData.findIndex(v => v.name === `PHONE`);
        const phone2Pos = metaData.findIndex(v => v.name === `PHONE2`);
        const faxPos = metaData.findIndex(v => v.name === `FAX`);
        const telexPos = metaData.findIndex(v => v.name === `TELEX`);

        const filtered = rows.filter(r => r[phonePos] || r[phone2Pos] || r[faxPos] || r[telexPos]);

        const bindings = [];
        for (let i = 0; i < filtered.length; i++) {
            const row = filtered[i];
            let rn = row[rnPos],
                phone = row[phonePos],
                phone2 = row[phone2Pos],
                fax = row[faxPos],
                telex = row[telexPos],
                agn_comment = `${(row[agnCommentPos] || ``).trim()}`;
            agn_comment = agn_comment.length > 0 ? `${agn_comment}\n\n` : ``;


            if (phone && !phone.match(REGEX_MOBILE_7_PHONE)) {
                agn_comment += `PHONE: ${phone}\n`;
                phone = null;
            }
            if (phone2 && !phone2.match(REGEX_MOBILE_7_PHONE)) {
                agn_comment += `PHONE2: ${phone2}\n`;
                phone2 = null;
            }
            if (fax && !fax.match(REGEX_MOBILE_7_PHONE)) {
                agn_comment += `FAX: ${fax}\n`;
                fax = null;
            }
            if (telex && !telex.match(REGEX_MOBILE_7_PHONE)) {
                agn_comment += `TELEX: ${telex}\n`
                telex = null;
            }

            bindings.push({rn, phone, phone2, fax, telex, agn_comment});
        }

        const res = await connectAndExecuteMany(
            `update 
                    ${TB_NAME} 
                set 
                    phone = :phone,
                    phone2 = :phone2,
                    fax = :fax,
                    telex = :telex,
                    agn_comment = :agn_comment 
                where rn = :rn`,
            bindings,
            {autoCommit: true}
        );

        console.log(res);

    } catch (e) {
        console.error(e);
    }
};

/***
 *  Format phones func
 */
const formatPhones = async () => {
    try {
        const agnlist = await select();
        const {metaData, rows} = agnlist;
        const neededColNames = [`RN`, `AGNFIRSTNAME`, `AGN_COMMENT`, `PHONE`, `PHONE2`, `FAX`, `TELEX`];

        /***
         *
         * skip first items
         */
        for (const colName of neededColNames.slice(3)) {
            const colIndex = metaData.findIndex(v => v.name === colName);
            console.log(colName, colIndex);

            const items = rows.filter(r => r[colIndex]);
            const bindingsPhone = items.map(
                r => ({rn: r[1], phone: formatPhoneNumber(r[colIndex])})
            );

            const res = await connectAndExecuteMany(
                `update ${TB_NAME} set ${colName} = :phone where RN = :rn`,
                bindingsPhone,
                {autoCommit: true}
            );

            console.log(res);
        }

        /*---------------------------------------------------------------------------*/

        /***
         *
         *  Номера содержащие запятую (,) разбиты на двое
         */
        const phonePos = metaData.findIndex(v => v.name === `PHONE`);
        const phone2Pos = metaData.findIndex(v => v.name === `PHONE2`);

        const splitted = rows
            .filter(r => r[phonePos] && !r[phone2Pos] && r[phonePos].includes(`,`))
            .map(r =>
                r.map((v, i) => i === phonePos ? v.split(`,`) : v)
            );

        /***
         *
         *  У которых точно совпадает 1 номер
         */
        const isMatched = splitted.filter(r => r[phonePos][0].match(REGEX_PHONE));

        const rnPos = metaData.findIndex(v => v.name === `RN`);
        const phones = isMatched.map(r => [r[rnPos], r[phonePos]]);

        const bindingsPhones = phones.map(r => {
            const [rn, phones] = r;
            const out = {
                rn,
                phone: formatPhoneNumber(phones[0], false),
                phone2: null
            };
            const matched = phones[1].match(REGEX_PHONE);

            /***
             *  Проверка на совпадение втого номера
             */
            if (matched) {
                out.phone2 = formatPhoneNumber(matched[0], false);
            }

            return out;
        });

        const res = await connectAndExecuteMany(
            `update
                        ${TB_NAME}
                    set
                        phone = :phone,
                        phone2 = :phone2
                    where
                        rn = :rn`,
            bindingsPhones,
            {autoCommit: true}
        );

        console.log(res);
        /*------------------------------------------------------------------*/

    } catch (e) {
        console.error(e);
    }
};

(async () => {
    // await formatPhones();
    // await movedNotMatched();
})();

