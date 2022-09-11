let hash = [];
let stringsArr = [];

const init = function(){  
    const prop = ["p", "span", "h1", "h2", "h3", "div"];
   
    stringsArr = startParse(prop, stringsArr);

    saveStringsInStorage(stringsArr)
  } 

  const addToArray = function(value, arr) { 
    
    if (!value || value.length == 0 || value.split(" ").length <= 3) return arr;
    
    if (value.replaceAll(" ", "").length > 0 && Array.isArray(arr) && !arr.find((s) => s == value))
        arr.push(value);
    return arr
  }

  const startParse = function(prop, stringsArr) {   
    let tmpArr = [];
    
    for (let p = 0; p < prop.length; p ++) {
        tmpArr = document.getElementsByTagName(prop[p]);  
            if (prop[p] != 'div') {
                stringsArr = parseHtml(tmpArr, prop[p], stringsArr)
            } else {  
                for(var i = 0; i < tmpArr.length; i++)
                {
                    if (tmpArr[i].childNodes.length > 0) {
                        for(let child = 0; child < tmpArr[i].childNodes.length; child ++ ) {
                             childNodesParse(tmpArr[i].childNodes[child], stringsArr);
                        }
                    } else {
                        const value = tmpArr[i].innerText; 
                        if (value.split('\n').length > 0) 
                           value.split('\n').forEach((t) => stringsArr = addToArray(t, stringsArr)); 
                        else
                            stringsArr = addToArray(value, stringsArr)
                    } 
                } 
            }   
    }
    return stringsArr
  }

  const childNodesParse = function (childN, stringsArr) {
        let text = ''; 
        if (childN.childNodes.length > 0) {
            for(let child = 0; child < childN.childNodes.length; child ++ ) {
                stringsArr = childNodesParse(childN.childNodes[child], stringsArr)
            }
         } else {
            text = childN.innerText
         }
         stringsArr = addToArray(text, stringsArr)
         return stringsArr
  }

  const parseHtml = function(tmpArr, prop, stringsArr) {
    for(var i = 0; i < tmpArr.length; i++)
    {
        const value = tmpArr[i].textContent;
        stringsArr = addToArray(value, stringsArr) 
    }

    return stringsArr;
  }

  const saveStringsInStorage = function(stringArr) {
    let storageStrings = [];

    chrome.storage.local.get('hateSpeech', function(result) {
        storageStrings = result.hateSpeech;
        if(storageStrings) { 
          storageStrings = storageStrings.split('$$')
          storageStrings = stringArr.filter((s) => !storageStrings.find((ss) => ss == s))  
        } else {
          storageStrings = stringArr
        }
          
        chrome.storage.local.set({"hateSpeech": storageStrings.join('$$')}, function(value) {
            sendStrings(storageStrings)
        });
    }); 
  }

  const getStorageHash = function () {
    chrome.storage.local.get('hateSpeech-hash', function(result) {
      hash = result['hateSpeech-hash'];
      
      if (!hash) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
          if(this.readyState === 4) {
            chrome.storage.local.set({"hateSpeech-hash": hash}, function(value) { 
              document.getElementById("hash").innerHTML= hash;
          });
          }
        });

        xhr.open("GET", "https://api.dadol.pt/extensao/hash");

        xhr.send();
      } else {
        document.getElementById("hash").innerHTML= hash;
      }
    });  
  }
 
  const sendStrings = function(stringArr) {
    var data = JSON.stringify({
      "hash": "11025ea2-b050-4d97-8872-3d7c09783453",
      "strings": stringArr
    });
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    
    xhr.open("POST", "https://api.dadol.pt/extensao/");
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(data);
  }


var t= setInterval(init,5000);
init();
