import createConnection from './connection';

const testConnection = async () => {
  const connection = await createConnection();

  try {
    // Consulta para comprobar si la base de datos responde
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('📄 Consulta de prueba realizada:', rows);
  } catch (error) {
    console.error('❌ Error al realizar la consulta:', (error as Error).message);
  } finally {
    await connection.end();
  }
};

testConnection();
