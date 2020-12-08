const {oracledb, connectAndExecute} = require(`../db/connection`);

class Clients {
    async getByPhone(phone) {
        return await connectAndExecute(`
           select
                PHONE,
                NAME,
                TITLE
            from
                UDO_V_PA_WEBQUEST_CLIENTVERIFY
            where PHONE = :phone
    `,
            {phone},
            {
                bindDefs: {
                    phone: {type: oracledb.STRING, maxSize: 25}
                }
            }
        );
    }
}

module.exports = {
    clients: new Clients(),
    Clients
};