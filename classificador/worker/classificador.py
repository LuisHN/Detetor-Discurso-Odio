import pickle
import base64
from utils.utils import text_preprocessing
from redis import StrictRedis
from time import strftime, sleep
import mysql.connector
from mysql.connector import Error

client = StrictRedis(host="localhost", port=6379)

subscriber = client.pubsub()
subscriber.psubscribe('channel-classificador')

def classificador(message, id):
    message = base64.b64decode(message).decode()

    # Loading Label encoder
    labelencode = pickle.load(open('../model/labelencoder_fitted.pkl', 'rb'))

    # Loading TF-IDF Vectorizer
    Tfidf_vect = pickle.load(open('../model/Tfidf_vect_fitted.pkl', 'rb'))

    # Loading models
    SVM = pickle.load(open('../model/svm_trained_model.sav', 'rb'))
    knn = pickle.load(open('../model/knn_trained_model.sav', 'rb'))
    stack = pickle.load(open('../model/stack_trained_model.sav', 'rb'))

    # Inference

    sample_text_processed = text_preprocessing(message)
    sample_text_processed_vectorized = Tfidf_vect.transform([sample_text_processed])

    prediction_SVM = SVM.predict(sample_text_processed_vectorized)
    prediction_kNN = knn.predict(sample_text_processed_vectorized)
    prediction_Stack = stack.predict(sample_text_processed_vectorized)

    svm = labelencode.inverse_transform(prediction_SVM)[0]
    knn = labelencode.inverse_transform(prediction_kNN)[0]
    stack = labelencode.inverse_transform(prediction_Stack)[0]

    results = []
    results.append(svm)
    results.append(knn)
    results.append(stack)
    total = svm + knn + stack
    classification = 0
    if percentage(total, 3) > 66:
        classification = 1
    else:
        classification = knn

    setClassification(id, classification, message)



def percentage(part, whole):
  percentage = 100 * float(part)/float(whole)
  return str(percentage) + "%"

def setClassification(idHash, classification, string):
    try:
        id = idHash.split('||') [0]
        hash = idHash.split('||')[1]
        connection = mysql.connector.connect(host='localhost',
                                             database='HATE_DETECTOR',
                                             user='root',
                                             password='')
        if connection.is_connected():
            cursor = connection.cursor()
            sql = "UPDATE database_ORIG SET classified = 1 WHERE id = %s ;"
            val = id
            cursor.execute(sql, val)
            sql = "INSERT INTO strings (string, clientHash, classification) values (%s, %s, %s);"
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

while True:
    messages = subscriber.get_message()

    if messages:
        message = messages["data"]
        classificador(message, message.split('||')[1])
    else:
        print('No Jobs')
    sleep(1)






