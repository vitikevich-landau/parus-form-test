const {connectAndExecute, connectAndExecuteMany, oracledb} = require(`./connection`);

const TB_NAME = `MY_AGNLIST_TMP`;

/***
 *  SandBox
 * */

const selectPhones = async (fields = [`*`]) => await connectAndExecute(
    `select ${fields.join(',')} from ${TB_NAME}`,
    {},
    {/*maxRows: 300*/}
);

(async () => {

})();

