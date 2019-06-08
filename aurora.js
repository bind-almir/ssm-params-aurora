const mysql = require('mysql2');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM({apiVersion: '2014-11-06'});

const response = (statusCode, body) => {
  return {
    statusCode, 
    body: JSON.stringify(body)
  }
}

const handler = async (event) => {

  try {
    const AURORA = await ssm.getParameter({ Name: 'AURORA' }).promise();
    const { host, database, port, user, password } = JSON.parse(AURORA['Parameter']['Value']);

    const connection = await mysql.createConnection({
      host,
      port,
      database,
      user,
      password
    });

    const [rows] = await connection.promise().query('SELECT * from users');
    return response(200, rows);
  
  } catch(err) {
    return response(500, { message: 'server error' });
  }

};

module.exports = { handler }