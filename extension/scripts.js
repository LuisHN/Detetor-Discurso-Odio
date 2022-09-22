


 const getStorageHash = function () {
    chrome.storage.local.get('hateSpeech-hash', function(result) {
      hash = result['hateSpeech-hash'];
      document.getElementById("hash").innerHTML= hash;
      if (!hash) {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        fetch("https://api.dadol.pt/extensao/hash", requestOptions)
          .then(response => response.text())
          .then(result =>  { 
            chrome.storage.local.set({"hateSpeech-hash": result}, function(value) { 
              document.getElementById("hash").innerHTML= result;
              console.log(result)
          });
          })
          .catch(error => console.log('error', error));
      }
    });  
  }


 getStorageHash()