const mysql = require('mysql2');
let config = require('./config.js');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');
const publisher = redis.createClient();


let connection = mysql.createConnection(config);


delay = (ms) => new Promise((res) => setTimeout(res, ms));
 

const getUnClassified = () => {
    return new Promise((resolve, rejects) => {
        connection.query("SELECT id, clientHash FROM database_ORIG where classified = 0 and deleted = 0 limit 10;", function (err, result, fields) {
          if (err) rejects(err);
          resolve(result);
        });
    })
}

const updateRecord = (id, hash) => {
    return new Promise((resolve, rejects) => { 
        var sql = "UPDATE database_ORIG SET clientHash = ? WHERE id = ?";
        connection.query(sql, [hash, id], (error, results, fields) => {
            if (error) rejects(error);
            resolve(true);
        });
    });
}

const start = async () => {
    try {
        await publisher.connect();
      } catch (err) { 
      }
    
    const records = await getUnClassified();

    records.forEach(async element => {
        if (element.clientHash.length == 0) {
            element.clientHash = uuidv4();
            await updateRecord(element.id,element.clientHash); 
        }
        
       const a = await publisher.publish('tese', String(element.id));   
       console.log(a)  
       await  delay(10000)
    });
    process.exit(0);
}



start();
 

(async () => {

    const article = {
      id: '123456',
      name: 'Using Redis Pub/Sub with Node.js',
      blog: 'Logrocket Blog',
    };
  
    await publisher.connect();
  
    await publisher.publish('article', JSON.stringify(article));
  })();