import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.model_selection import cross_val_score, ShuffleSplit
from sklearn.preprocessing import LabelEncoder
from collections import defaultdict
from nltk.corpus import wordnet as wn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import model_selection, naive_bayes, svm
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from sklearn import metrics
from sklearn.svm import LinearSVC
from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
import pickle
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix
from imblearn.over_sampling import SMOTE

from utils.utils import text_preprocessing

np.random.seed(500)

Corpus = pd.read_csv(r"../dataset/dataset.csv", encoding='utf-8', sep=';')

Corpus['text'].dropna(inplace=True)
Corpus['text'] = [entry.lower() for entry in Corpus['text']]
Corpus['text_final'] = Corpus['text'].map(text_preprocessing)

# Step - 2: Split the utils into Train and Test Data set
Train_X, Test_X, Train_Y, Test_Y = model_selection.train_test_split(Corpus['text_final'], Corpus['label'], test_size=0.3)


# Step - 3: Label encode the target variable  - This is done to transform Categorical data of string type in the data set into numerical values
Encoder = LabelEncoder()
Encoder.fit(Train_Y)
Train_Y = Encoder.transform(Train_Y)
Test_Y = Encoder.transform(Test_Y)

# Step - 4: Vectorize the words by using TF-IDF Vectorizer - This is done to find how important a word in document is in comaprison to the corpus
Tfidf_vect = TfidfVectorizer(max_features=5000)
Tfidf_vect.fit(Corpus['text_final'])

Train_X_Tfidf = Tfidf_vect.transform(Train_X)
Test_X_Tfidf = Tfidf_vect.transform(Test_X)



print("*************************************")
print(" SVM ")
print("*************************************")

# Classifier - Algorithm - SVM
# fit the training dataset on the classifier
SVM = svm.SVC(C=1.0, kernel='linear', degree=3, gamma='auto')
SVM.fit(Train_X_Tfidf, Train_Y)

# predict the labels on validation dataset
predictions_SVM = SVM.predict(Test_X_Tfidf)

print(classification_report(Test_Y, predictions_SVM))
print('Confusion Matrix:', confusion_matrix(Test_Y, predictions_SVM))

# Use accuracy_score function to get the accuracy
print("SVM Accuracy Score -> ",accuracy_score(predictions_SVM, Test_Y)*100)

print("*************************************")
print(" kNN ")
print("*************************************")

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(Train_X_Tfidf, Train_Y)
y_pred = knn.predict(Test_X_Tfidf)

print("kNN Accuracy Score -> ",accuracy_score(y_pred, Test_Y)*100)


print("*************************************")
print(" Stack SVM & kNN ")
print("*************************************")

estimators = [
     ('knn', KNeighborsClassifier(n_neighbors=5)),
     ('svm', svm.SVC(C=1.0, kernel='linear', degree=3, gamma='auto'))]
clf = StackingClassifier(
     estimators=estimators, final_estimator=LogisticRegression())

clf.fit(Train_X_Tfidf, Train_Y)
#clf_preds_train = clf.predict(Train_X_Tfidf)
clf_preds_test = clf.predict(Test_X_Tfidf)
#, normalize=False
print("Stack Accuracy Score -> ", accuracy_score(clf_preds_test, Test_Y) )


filename = '../model/labelencoder_fitted.pkl'
pickle.dump(Encoder, open(filename, 'wb'))

# saving TFIDF Vectorizer to disk
filename = '../model/Tfidf_vect_fitted.pkl'
pickle.dump(Tfidf_vect, open(filename, 'wb'))

# saving the both models to disk
filename = '../model/svm_trained_model.sav'
pickle.dump(SVM, open(filename, 'wb'))

filename = '../model/knn_trained_model.sav'
pickle.dump(knn, open(filename, 'wb'))

filename = '../model/stack_trained_model.sav'
pickle.dump(clf, open(filename, 'wb'))

print("Files saved to disk! Proceed to inference.py")
