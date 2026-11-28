function integerSetting(name, fallback) {
  const value = Number(process.env[name] || fallback);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`${name} must be a port between 1 and 65535.`);
  }
  return value;
}

function connectDatabase() {
  const auth = process.env.DB_AUTH || (process.platform === 'win32' ? 'windows' : 'sql');
  if (auth !== 'windows' && auth !== 'sql') {
    throw new Error('Set DB_AUTH to windows or sql.');
  }

  const server = process.env.DB_SERVER || 'localhost';
  const database = process.env.DB_DATABASE || 'StudentAttendance';
  const instance = process.env.DB_INSTANCE;
  const port = process.env.DB_PORT ? integerSetting('DB_PORT') : undefined;
  const trustServerCertificate = process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false';
  if (instance && port) {
    throw new Error('Set either DB_INSTANCE or DB_PORT.');
  }

  let sql;
  let config;

  if (auth === 'windows') {
    try {
      sql = require('mssql/msnodesqlv8');
    } catch (error) {
      throw new Error('Windows Authentication requires msnodesqlv8. Run npm ci in server/ and install Microsoft ODBC Driver 18 for SQL Server.', { cause: error });
    }

    const target = instance ? `${server}\\${instance}` : port ? `tcp:${server},${port}` : server;
    const odbcValue = (value) => `{${value.replaceAll('}', '}}')}}`;
    config = {
      server,
      database,
      connectionString: [
        'Driver={ODBC Driver 18 for SQL Server}',
        `Server=${odbcValue(target)}`,
        `Database=${odbcValue(database)}`,
        'Trusted_Connection=Yes',
        'Encrypt=Yes',
        `TrustServerCertificate=${trustServerCertificate ? 'Yes' : 'No'}`,
      ].join(';'),
    };
  } else {
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    if (!user || !password) {
      throw new Error('Set DB_USER and DB_PASSWORD for SQL Server Authentication.');
    }

    sql = require('mssql');
    config = {
      server,
      database,
      user,
      password,
      ...(instance ? {} : { port: port ?? 1433 }),
      options: { instanceName: instance, encrypt: true, trustServerCertificate },
    };
  }

  const pool = new sql.ConnectionPool({ ...config, connectionTimeout: 8000, requestTimeout: 10000 });
  pool.on('error', (error) => console.error('SQL Server pool error:', error.message));
  return pool.connect().then(() => ({ pool, sql }));
}

module.exports = { connectDatabase, integerSetting };
