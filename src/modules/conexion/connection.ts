import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("✅ Conexión a la base de datos establecida");
    return connection;
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:",
      (error as Error).message
    );
    throw error;
  }
};

export default createConnection;
