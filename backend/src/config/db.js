const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

let pool = null;

function isMockMode() {
  return (process.env.DB_MODE || 'mock').toLowerCase() === 'mock';
}

async function initPool() {
  if (isMockMode()) {
    console.log('[db] DB_MODE=mock — using in-memory store (no Oracle connection)');
    return null;
  }

  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1,
  });
  console.log('[db] Oracle pool created');
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}

async function withConnection(fn) {
  if (isMockMode()) {
    throw new Error('withConnection called in mock mode');
  }
  const connection = await pool.getConnection();
  try {
    return await fn(connection);
  } finally {
    await connection.close();
  }
}

module.exports = {
  initPool,
  closePool,
  withConnection,
  isMockMode,
  oracledb,
};
