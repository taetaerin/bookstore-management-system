import mariadb from 'mysql2/promise';

const createConnection = async () => {
    return await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Library',
        dateStrings: true
    })
}

export default createConnection;
