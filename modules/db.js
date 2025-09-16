
const mysql = require('mysql2/promise'); // Use promise-based MySQL client
require('dotenv').config(); // Load environment variables






//padtracker web
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'padtrack_padtrack',
//   password: 'g%y#U[^%B6?X',
//   database: 'padtrack_pinkishedb',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

//padtracker web
// const pool = mysql.createPool({
//   host: 'localhost', 
//   user: 'radiodek_padtrack_pinkishedb',        
//   password: 'UtLB4.ECDIzvkPIR',
//   database: 'padtrack_pinkishedb', 
//   waitForConnections: true,
//   connectionLimit: 10, 
//   queueLimit: 0
// });



//local
const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: '',
    database: "pinkshedb",
    waitForConnections: true,
  connectionLimit: 10,     
  queueLimit: 0
});

async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
};

module.exports = {query};



