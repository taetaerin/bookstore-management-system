import mariadb from "mysql2/promise";

const getCategories = async () => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Library",
        dateStrings: true,
    });

    try {
        const sql = "SELECT * FROM category";
        const [rows, fields] = await conn.execute(sql);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default { getCategories };
