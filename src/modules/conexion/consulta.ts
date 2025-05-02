import createConnection from "./connection";

const consultarDatos = async () => {
  const connection = await createConnection();

  try {
    const [rows] = await connection.execute('SELECT * FROM audit_billing');
    console.log('📄 Resultados:', rows);
  } catch (error) {
    console.error('❌ Error en la consulta:', (error as Error).message);
  } finally {
    await connection.end();
  }
};

consultarDatos();
