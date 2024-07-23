const oracledb = require('oracledb');

oracledb.initOracleClient()

const dbConfig = {
    user: process.env.DB_USER_MT200,
    password: process.env.DB_PASSWORD_MT200,
    connectString: process.env.DB_CONNECTION_STRING_MT200,
};

export async function MT200conn() {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        return connection;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            // console.log("connection closed")
            await connection.close
        }
    }
}