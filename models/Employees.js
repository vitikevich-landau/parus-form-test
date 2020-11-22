const {oracledb, connectAndExecute} = require(`../db/connection`);

class Employees {
    async getByPhone(phone) {
        return await connectAndExecute(`
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
    }
}

module.exports = {
    employees: new Employees(),
    Employees
};