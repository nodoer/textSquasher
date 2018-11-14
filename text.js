window.onload = function() {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');
    var out = [];
    var linewidth = 16;
    var textFile = null;

    fileDisplayArea.innerText = "";

    fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0];
      var textType = /text.*/;
      var newName = file.name.replace(".txt","") + "_min" + ".txt";
     

      if (file.type.match(textType)) {
          var reader = new FileReader();

          reader.onload = function(e) {
            
            fileDisplayArea.innerHTML = "";
            
            //Break the file into lines
            var lines = reader.result.split('\n');

            var charCount = 0;
            var newline = "";

            for(var l = 0; l<lines.length; l++){
            
                if(lines[l].length == 0) {
                        out.push(newline.trim() + "\n");
                        newline = "";
                        for(var x = 0; x<linewidth; x++){
                            newline += "-";
                        }
                        out.push(newline+"\n");
                        newline = "";
                }

                //Break the line into words
                var words = lines[l].split(' ');

                for(var w = 0; w<words.length; w++){

                    var cleanWord = words[w].replace(/[\s\t\r\n]+/g, "");
                    
                    if(charCount + cleanWord.length < linewidth && cleanWord.length){
                 
                        newline += cleanWord
                        newline += (cleanWord.length)?" ":"";
                        charCount = newline.length;

                    } else if(cleanWord.length){

                        out.push(newline.trim() + "\n");
                        
                        
                        while(cleanWord.length > 16){
                            var sub = cleanWord.substring(0,14);
                            out.push(sub + "-" + "\n");
                            cleanWord = cleanWord.replace(sub,"");
                        
                        }

                        newline = cleanWord 
                        newline += (cleanWord.length)?" ":"";
                        charCount =  newline.length;
                        
                    } else {
                        //out.push(newline.trim() + "\n");
                        //newline = "";
                    }


                }

                
                
            }


            
            var data = new Blob(out, {type: 'text/plain'});
            if (textFile !== null) {
              window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);
            

            var link = document.getElementById('downloadlink');
            link.href = textFile;
            link.download = newName;
            link.style.display = 'block';
            fileDisplayArea.innerHTML = "";
            for(var z = 0; z<out.length; z++){
                fileDisplayArea.innerHTML += out[z];
            }

          }
          
          
          reader.onProgress = function(){
              if (e.lengthComputable) {

                  var percentage = Math.round((e.loaded * 100) / e.total);

                  //fileDisplayArea.innerHTML = 'Loading File: '+percentage+'%'

                } 
          
          }

          reader.readAsText(file);  
        } else {
          fileDisplayArea.innerText = "File not supported!";
        }
        
    });
}





