import pickle
import base64

from utils.utils import percentage
from utils.utils import text_preprocessing
from redis import StrictRedis
from time import strftime, sleep
import mysql.connector
from mysql.connector import Error

def getInformation(id):
    try: 
        connection = mysql.connector.connect(host='localhost',
                                             database='HATE_DETECTOR',
                                             user='root',
                                             password='pdadolp#2022')
        if connection.is_connected():
            cursor = connection.cursor()
            sql = "select string, clientHash from database_ORIG  WHERE id = %s and classified = 0;" 
            cursor.execute(sql, (id,))
            myresult = cursor.fetchall()
            connection.commit()
            cursor.close()
            connection.close()
            if len(myresult) != 1:
                return [0]
            return myresult[0]

    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")


def setClassification(id, classification, string, hash): 
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='HATE_DETECTOR',
                                             user='root',
                                             password='pdadolp#2022')
        if connection.is_connected():
            cursor = connection.cursor()
            sql = "UPDATE database_ORIG SET classified = 1 WHERE id = %s ;"
            val = (id,)
            cursor.execute(sql, val)
            sql = "INSERT IGNORE INTO strings (string, clientHash, classification) values (%s, %s, %s);"
            val = (string, hash, classification)
            cursor.execute(sql, val)
            connection.commit()
            cursor.close()
            connection.close()

    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

def classificador(id):
 
    message = getInformation(id)
    
    if message[0] == 0:
         return 'erro'
    try:
        # Loading Label encoder
        labelencode = pickle.load(open('../model/labelencoder_fitted.pkl', 'rb'))
    
        # Loading TF-IDF Vectorizer
        Tfidf_vect = pickle.load(open('../model/Tfidf_vect_fitted.pkl', 'rb'))

        # Loading models
        SVM = pickle.load(open('../model/svm_trained_model.sav', 'rb'))
        knn = pickle.load(open('../model/knn_trained_model.sav', 'rb'))
        stack = pickle.load(open('../model/stack_trained_model.sav', 'rb'))

        # Inference

        sample_text_processed = text_preprocessing(str(message[0]))
        sample_text_processed_vectorized = Tfidf_vect.transform([sample_text_processed])

        prediction_SVM = SVM.predict(sample_text_processed_vectorized)
        prediction_kNN = knn.predict(sample_text_processed_vectorized)
        prediction_Stack = stack.predict(sample_text_processed_vectorized)

        svm = labelencode.inverse_transform(prediction_SVM)[0]
        knn = labelencode.inverse_transform(prediction_kNN)[0]
        stack = labelencode.inverse_transform(prediction_Stack)[0]

        total = svm + knn + stack
        classification = 0
 
        if percentage(total, 3) > 67:
            classification = 1
        else:
            classification = int(knn)   
 
        setClassification(id, classification, str(message[0]), str(message[1]))
    except Exception as e:  
        print(e) 


client = StrictRedis(host="localhost", port=6379)

subscriber = client.pubsub()
subscriber.psubscribe('channel-extensao')

while True:
    messages = subscriber.get_message()

    if messages:
        message = messages["data"]
        try:
            if message != 1:
                classificador(message)
        except:
            print('Ocorreu um erro') 
        
    sleep(1)






