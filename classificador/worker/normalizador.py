from utils.utils import percentage
import mysql.connector
from mysql.connector import Error
import numpy as np

connection = mysql.connector.connect(host='localhost',
                                        database='HATE_DETECTOR',
                                        user='root',
                                        password='pdadolp#2022')

def normalizeSentenceWithoutOwner():
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            sql = "update strings set sortedByOwner = 1 where sortedByOwner = 0 and created_at < (now() - interval 6 hour );"    
            cursor.execute(sql)
            connection.commit()
            cursor.close() 

    except Error as e:
        print("Error while connecting to MySQL", e)

def getInformation(connection):
    try:
        if connection.is_connected():
            cursor = connection.cursor()
            sql = "select id, classification, classification_1, classification_2, classification_3, classification_4 from strings  WHERE readyToFinalClassification = 1;"
            cursor.execute(sql,)
            myresult = cursor.fetchall()
            connection.commit()
            cursor.close() 
            return myresult

    except Error as e:
        print("Error while connecting to MySQL", e)


def updateString(connection, id, classification):
        try:
            if connection.is_connected():
                cursor = connection.cursor()
                sql = "UPDATE strings SET finalClassification = %s, readyToFinalClassification = 2, readyToUpgrade = 1  WHERE id = %s ;"
                val = (classification, id,)
                cursor.execute(sql, val)
                connection.commit()
                cursor.close() 

        except Error as e:
            print("Error while connecting to MySQL", e)

dados = getInformation(connection) 

for item in dados:
    item = list(item) 
    id = item[0]
    item.pop(0) 
    total = np.sum(item) 
    if percentage(total, 5) > 60:
        classification = 1
    else:
        classification = 0
    
    updateString(connection, id, classification)

normalizeSentenceWithoutOwner() 

connection.close()
     
