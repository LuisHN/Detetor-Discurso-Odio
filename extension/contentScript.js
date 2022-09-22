let hash = '';
let stringsArr = [];

const init = function(){  
    getStorageHash();
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
    let control = storageStrings;

    chrome.storage.local.get('hateSpeech', function(result) {
        storageStrings = result.hateSpeech;
        
        if(storageStrings) { 
          storageStrings = storageStrings.split('$$')
          control = storageStrings;
          storageStrings = [...storageStrings, ...stringArr.filter((s) => !storageStrings.find((ss) => ss == s))]   
        } else {
          storageStrings = stringArr
        }

        if (control.length != storageStrings.length) {
          control = storageStrings.filter((s) => !control.find((ss) => s == ss))
          chrome.storage.local.set({"hateSpeech": storageStrings.join('$$')}, function(value) {
            sendStrings(control)
        });
        }

    }); 
  }

  const getStorageHash = function () {
    chrome.storage.local.get('hateSpeech-hash', function(result) {
      hash = result['hateSpeech-hash'];
      
      if (!hash) {

        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        fetch("https://api.dadol.pt/extensao/hash", requestOptions)
          .then(response => response.text())
          .then(result =>  {
            document.getElementById("hash").innerHTML= result;
            chrome.storage.local.set({"hateSpeech-hash": result}, function(value) { 
              hash= result; 
          });
          })
          .catch(error => console.log('error', error));

 
      } 
    
    });  
  }
 
  const sendStrings = function(stringArr) {
     
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "hash": hash,
      "strings": stringArr
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://api.dadol.pt/extensao", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
 
  }


var t= setInterval(init,5000);
init();
