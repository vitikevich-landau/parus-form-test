const {oracledb, connectAndExecute} = require(`../db/connection`);

class Questions {
    async save(phone, name, msg, company) {
        /***
         *  Вызов удалённой процедуры на сервере
         *
         */

        return await connectAndExecute(`
            begin
                UDO_P_PA_WEBQUESTION_REG(:phone, :company, :name, :msg);
            end;
        `, {phone, name, company, msg}
        );
    }
}

module.exports = {
    questions: new Questions(),
    Questions
};