const oracledb = require('oracledb');

oracledb.initOracleClient()

const dbConfig = {
    user: process.env.DB_USER_SPIRIT,
    password: process.env.DB_PASSWORD_SPIRIT,
    connectString: process.env.DB_CONNECTION_STRING_SPIRIT,
};

export async function spiritDBconn() {
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
            connection.close
        }
    }
}