const {connectAndExecute, connectAndExecuteMany} = require(`./connection`);
const delay = require(`../../lib/delay`);
const {REGEX_MOBILE_7_PHONE} = require("../../lib/phones");
const {
    clearPhoneNumber,
    formatPhoneNumber,
    getMatchPhones,
    REGEX_PHONE
} = require("../../lib/phones");


// const updatePhones = async (rn, column, value) => {
//     return await connectAndExecute(`
//         update ${TB_NAME} set ${column} = :value where RN = ${rn}
//     `,
//         [value],
//         {autoCommit: true}
//     );
// };

/***
 *
 *  Выборка, обновление и редактирование частями по 1 столбцу за раз
 *  Начиная от малого
 */

const TB_NAME = `MY_AGNLIST_TMP`;
const COL_NAME = `PHONE`;


const selectPhoneByRn = async rn => await connectAndExecute(`
    select 
        *
    from 
        ${TB_NAME}
    where rn = :rn
`, {rn}
);

const selectPhones = async () => await connectAndExecute(
    `select * from ${TB_NAME}`,
    {},
    {/*maxRows: 300*/}
);


const movedNotMatched = async () => {
    try {
        const querySet = await selectPhones();
        const {metaData, rows} = querySet;
        const filtered = rows.filter(r => {
            // return r[2] && r[3] && r[4]
            return r[1] || r[2] || r[3] || r[4]
        });

        // console.log(filtered.length);
        // return ;

        const bindings = [];
        for (let i = 0; i < filtered.length; i++) {
            const row = filtered[i];
            let rn = row[0],
                phone = row[1],
                phone2 = row[2],
                fax = row[3],
                telex = row[4],
                agn_comment = `${(row[5] || ``).trim()}`;
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

        // console.log(bindings)
        // return;

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

        const querySet = await selectPhones();
        const {metaData, rows} = querySet;
        /***
         *
         * skip first items
         */
        const metaDataCols = metaData.map(v => v.name);
        const cols = metaData.map(v => v.name).slice(1, metaData.length - 1);

        for (const col of cols) {
            const colIndex = metaDataCols.findIndex(v => v === col);

            const items = rows.filter(r => r[colIndex]);
            const bindingsPhone = items.map(
                r => ({rn: r[0], phone: formatPhoneNumber(r[colIndex], false)})
            );

            const res = await connectAndExecuteMany(
                `update ${TB_NAME} set ${col} = :phone where RN = :rn`,
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
        const splitted = rows
            .filter(r => r[1] && !r[2] && r[1].includes(`,`))
            .map(r =>
                r.map((v, i) => i === 1 ? v.split(`,`) : v)
            );

        console.log(`splitted: ${splitted.length}`);
        // console.log(splitted);

        /***
         *
         *  У которых точно совпадает 1 номер
         */
        const isMatched = splitted.filter(r => r[1][0].match(REGEX_PHONE));

        const phones = isMatched.map(r => [r[0], r[1]]);
        const bindingsPhones = phones.map(r => {
            const [rn, phones] = r;
            // const out = [rn, formatPhoneNumber(phones[0], false)];
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

        // console.log(bindPhones.slice(5000, 5500));

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

        /***
         *  double masked
         */
        // .filter(r => r[1].every(v => v.match(/[()]/)))
        // .filter(r => r[1].every(v => v.match(REGEX_PHONE)))

        // console.log(`isMatched: ${isMatched.length}`);

        /*---------------------------------------------------------------------------*/

    } catch (e) {
        console.error(e);
    }
};

(async () => {
    // await formatPhones();
    // await movedNotMatched();
})();

