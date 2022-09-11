

 getStorageHash()

 const getStorageHash = function () {
    chrome.storage.local.get('hateSpeech-hash', function(result) {
      hash = result['hateSpeech-hash'];
      document.getElementById("hash").innerHTML= hash;
      console.log("aquiiiii",hash)
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

      //  xhr.open("GET", "https://api.dadol.pt/extensao/hash");

       // xhr.send();
      }
    });  
  }