const {connectAndExecute, connectAndExecuteMany} = require(`./connection`);
const {clearPhoneNumber, formatPhoneNumber} = require(`../../lib/phones`)



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

const selectPhones = async () => await connectAndExecute(`
    select 
        rn, phone, phone2, fax, telex
    from ${TB_NAME}
--    where 
--        phone is not null
--        ${COL_NAME} is not null
--        fax is not null
--         telex is not null
`,
    {}, {/*maxRows: 300*/});


(async () => {
    try {
        const {rows} = await selectPhones();

        /***
         *  Номера соодержащие запятую в тексте
         */
        // const filtered = rows.filter(v => v[1] && v[1].includes(`,`));
        //
        // let sliced = filtered;
        // sliced = sliced.map(v => [v[0], v[1].split(`,`)]);
        // // console.log(sliced)
        // sliced = sliced.filter(v => v[1].length <= 2);
        //
        // // console.log(sliced.length);
        //
        // // return;
        //
        // /***
        //  *  Вторую часть запихиваем в phone2
        //  */
        // // console.log(sliced.map(v => [v[0], v[1][1]]));
        // const bindsPhone2 = sliced.map(v => ({rn: v[0], phone: v[1][1]}));
        //
        // const bindsPhone2Result = await connectAndExecuteMany(
        //     `
        //         update ${TB_NAME} set PHONE2 = :phone where RN = :rn
        //     `,
        //     bindsPhone2,
        //     {autoCommit: true}
        // );
        //
        // console.log(bindsPhone2Result);
        //
        // const bindsPhone = sliced.map(v => ({rn: v[0], phone: formatPhoneNumber(v[1][0], false)}));
        //
        // const bindsPhoneResult = await connectAndExecuteMany(
        //     `
        //         update ${TB_NAME} set PHONE = :phone where RN = :rn
        //     `,
        //     bindsPhone,
        //     {autoCommit: true}
        // );
        //
        // console.log(bindsPhoneResult);

        // console.log(rows.length);

        const notEmptyPhones = rows
            .filter(v => v[2])
            .map(v => ({rn: v[0], phone: formatPhoneNumber(v[2], false)}));
        console.log(notEmptyPhones.length);

        /***
         *  Вставка остальных стлбцов
         */
        const res = await connectAndExecuteMany(
            `
                update ${TB_NAME} set PHONE2 = :phone where RN = :rn
            `,
            notEmptyPhones,
            {autoCommit: true}
        );
        console.log(res);


    } catch (e) {
        console.error(e);
    }
})();

