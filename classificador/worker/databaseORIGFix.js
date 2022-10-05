const mysql = require('mysql2');
let config = require('./config.js');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');
const publisher = redis.createClient();


let connection = mysql.createConnection(config);
let ids = [];

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
    let ids = [];
    const records = await getUnClassified();

    records.forEach(async element => {
        console.log(element)
        if (element.clientHash.length == 0) {
            element.clientHash = uuidv4();
            await updateRecord(element.id,element.clientHash); 
        }
 
        ids.push(element.id.toString());      
        
 
       await  delay(10000)
    });

    await publisher.connect(); 
    for (let i = 0; i< ids.length ; i++) 
         await publisher.publish('channel-classificador', ids[0]) 

    process.exit(0);
}
  
    
start(); 
 