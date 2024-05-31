const oracledb = require('oracledb');

oracledb.initOracleClient()

const dbConfig = {
    user: process.env.DB_USER_MTLE,
    password: process.env.DB_PASSWORD_MTLE,
    connectString: process.env.DB_CONNECTION_STRING_MTLE,
};

export async function mteDBconn() {
    let connection;
    
    try {
        connection = await oracledb.getConnection(dbConfig);
        return connection;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if(connection){
            // console.log("connection closed")
           await connection.close
        }
    }
}