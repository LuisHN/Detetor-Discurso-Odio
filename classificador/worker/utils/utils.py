from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from nltk.corpus import stopwords

def text_preprocessing(text):
    # Step - 1b : Case Folding
    text = text.lower()

    # Step - 1c :Tokenização
    text_words_list = word_tokenize(text)

    # Step - 1d : Remove Stop words, Non-Numeric and perfom Word Stemming/Lemmenting.
    # Declaring Empty List to store the words that follow the rules for this step
    Final_words = []
    word_Lemmatized = WordNetLemmatizer()
    for word, tag in pos_tag(text_words_list):
        if word not in stopwords.words('portuguese') and word.isalpha():
            word_Final = word_Lemmatized.lemmatize(word)
            Final_words.append(word_Final)
    return str(Final_words)


def percentage(part, whole):
  percentage = 100 * float(part)/float(whole)
  return percentage
