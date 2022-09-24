const fs = require('fs');
const mysql = require('mysql2');
let config = require('./config.js');

let connection = mysql.createConnection(config);
  
const makeMagic = async () => {
    try { 
        let items = await getNewSentences() || []; 
        if (Object.keys(items).length > 0 ) {
            fs.copyFile('../dataset/dataset.csv', `../dataset/dataset_${Date.now()}.csv`, async (err) => {
                if (err) throw err; 
                const ids = items.map((item) => item.id);
                items = items.map((item) => {delete item.id; return item;})
                items.forEach(async (item) => {
                    await incrementDataset(`\n${item.string};${item.classification}`)
                })
                
                await updateSentences(ids);
                connection.end();
                process.exit(0);
              });
    } else {
        process.exit(0);
    }
    } catch(err) {
        console.log(err)
    }
}

const getNewSentences = () => {
    return new Promise((resolve, rejects) => {
            connection.query("SELECT id, string, finalClassification as classification FROM strings where readyToUpgrade = 1 and deleted = 0;", function (err, result, fields) {
              if (err) rejects(err);
              resolve(result);
            });
    })

}

const updateSentences = (ids) => {
    return new Promise((resolve, rejects) => { 
        var sql = "UPDATE strings SET readyToUpgrade = 2 WHERE id in (?)";
        connection.query(sql, [ids], (error, results, fields) => {
            if (error) rejects(error);
            resolve(true);
        });
    });
}

const incrementDataset = async (newLine) => {
   return fs.appendFileSync('../dataset/dataset.csv', newLine);
}

makeMagic();