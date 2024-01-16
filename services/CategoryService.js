import createConnection from "../mariadb.js";
import camelcaseKeys from "camelcase-keys";

const getCategories = async () => {
    const conn = await createConnection();

    try {
        const sql = "SELECT * FROM category";
        const [results] = await conn.execute(sql);
        return camelcaseKeys(results);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default { getCategories };
