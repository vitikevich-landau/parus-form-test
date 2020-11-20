const {connectAndExecute, connectAndExecuteMany, oracledb} = require(`./connection`);

const TB_NAME = `MY_AGNLIST_TMP`;

const selectPhones = async (fields = [`*`]) => await connectAndExecute(
    `select ${fields.join(',')} from ${TB_NAME}`,
    {},
    {/*maxRows: 300*/}
);

const getClientInfoByPhone = async phone =>
    await connectAndExecute(`
        select
            a.rn, 
            a.phone, 
            a.phone2, 
            a.fax, 
            a.telex, 
            a.agnfirstname, 
            a.agnname, 
            b.agnname
        from
            MY_AGNLIST_TMP a
        left join
            CLNPERSONS c on c.PERS_AGENT = a.rn
        left join
            MY_AGNLIST_TMP b on b.rn = c.owner_agent
        where
            a.phone like :phone or
            a.phone2 like :phone or
            a.fax  like :phone or
            a.telex like :phone
    `,
        {phone},
        {
            bindDefs: {
                phone: {type: oracledb.STRING, maxSize: 25}
            }
        }
    );

(async () => {
    const phone = `79994750552`;

    // const querySet = await getClientInfoByPhone(phone);
    //
    // console.log(querySet);
})();

module.exports = {
    getClientInfoByPhone
};
