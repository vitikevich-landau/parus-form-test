const oracledb = require(`oracledb`);

const getConnection = () => {
    const dbSettings = require(`./config`);

    return oracledb.getConnection({
        user: dbSettings.DB_USER,
        password: dbSettings.DB_PASSWORD,
        connectString: dbSettings.DB_CONNECTION_STRING
    });
};
const connectAndExecute = async (sql, bindParams = {}, options = {}) => {
    let connection;

    try {
        connection = await getConnection();
        return await connection.execute(sql, bindParams, options);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
};
const connectAndExecuteMany = async (sql, bindParams = {}, options = {}) => {
    let connection;

    try {
        connection = await getConnection();
        return await connection.executeMany(sql, bindParams, options);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
};

module.exports = {
    oracledb,
    connectAndExecute,
    connectAndExecuteMany
}