<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="./css/bootstrap.css">
    <script src="jquery-3.4.1.min.js" type="application/javascript"></script>
    <script src="popper.min.js" type="application/javascript"></script>
    <script src="js/bootstrap.js" type="application/javascript"></script>
    <script src="konva.min.js"></script>
    <meta charset="utf-8" />
    <title>Konva Image Resize Demo</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #f0f0f0;
      }
      
      .img-item {
        height:50px;
        width:50px;
      }

    </style>
  </head>
  <body>
  <div class="container">

  <nav class="nav nav-pills flex-column flex-sm-row">
      <a class="flex-sm-fill text-sm-center nav-link" href="index.php">Cropping</a>
      <a class="flex-sm-fill text-sm-center nav-link active" href="assemblePhoto.php">Assemble</a>
  </nav>
    <div id="control_panel">
        <span style="display:inline-block"><button class='form-control' id="import_parts" onclick="selectPart()">Import</button></span>
        <span style="display:inline-block"><button class='form-control' id="finish" onclick="savePhoto()">Finish</button></span>
        <span style="display:inline-block"><button class='form-control' id="finish" onclick="show()">Show Boundary</button></span>
        <span style="display:inline-block"><button class='form-control' id="finish" onclick="hide()">Hide Boundary</button></span>
    </div>
    <div id="head_bar"></div>
    <div id="img_bar"></div>
    <div id="model_preview"></div>
    </div>
  </body>
  <script>
    initHeadsBar();
    initClothesBar();

    var stageWidth = window.innerWidth;
    var stageHeight = window.innerHeight;
    var rotateFrameList = [];

    var stage = new Konva.Stage({
        container: 'model_preview',
        width: stageWidth,
        height: stageHeight
    });
    var layer = new Konva.Layer();
    stage.add(layer);

    function importParts(imgSrc) {
        
        var imageObj = new Image();
        imageObj.onload = function () {
            let width = imageObj.width;
            let height = imageObj.height;
            let posx = 80;
            let posy = 80;
            if(height>400){
                width = 400*width/height;
                height = 400;
            }
            var newImg = new Konva.Image({
                width: width,
                height: height,
                x: posx,
                y: posy,
                draggable: true
            });

            layer.add(newImg);
            newImg.image(imageObj);
            var rotateFrame = new Konva.Transformer({
                node: newImg,
                centeredScaling: true,
                resizeEnabled: true
            });
            rotateFrameList.push(rotateFrame);
            layer.add(rotateFrame);
            newImg.on('click', function() {
                this.moveToTop();
                rotateFrame.moveToTop();
                layer.draw();
            });
            newImg.on('dragstart', function() {
                this.moveToTop();
                rotateFrame.moveToTop();
                layer.draw();
            });
            newImg.on('dragmove', function() {
                this.moveToTop();
                rotateFrame.moveToTop();
                layer.draw();
            });
            newImg.on('dblclick dbltap', function() {
                this.destroy();
                rotateFrame.destroy();
                layer.draw();
              });
            layer.draw();

        };
        imageObj.src = imgSrc;
    }

    function blobtoDataURL(blob, callback) {
        var fr = new FileReader();
        fr.onload = function(e) {
            callback(e.target.result);
        };
        fr.readAsDataURL(blob);
    }

    function selectPart() {
        var input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => { 
            var file = e.target.files[0];
            blobtoDataURL(file, function (dataURL){
                importParts(dataURL);
            });
        }
        input.click();
    }

    // function from https://stackoverflow.com/a/15832662/512042
    function downloadURI(uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
      }

    function savePhoto() {
        hide();
        var dataURL = stage.toDataURL();
        downloadURI(dataURL, 'finish.png');
    }

    function hide(){
        for (var key in rotateFrameList){
            rotateFrameList[key].hide()
        }
        layer.draw();
    }

    function show(){
        for (var key in rotateFrameList){
            rotateFrameList[key].show()
        }
        layer.draw();
    }

    function initHeadsBar(){
        var head_bar = document.getElementById('head_bar');
        var headDirs =  JSON.parse('<?php echo json_encode(scandir('heads/'));?>');
        headDirs.shift();
        headDirs.shift();
        for(var key in headDirs){
            let path = 'heads/' + headDirs[key];
            let img_item = document.createElement('img');
            img_item.className = "img-item";
            img_item.src = path;
            img_item.onclick = function() {
              (async function() {
                let i = 4;
                let blob = await fetch(img_item.src).then(r => r.blob());
                let dataUrl = await new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = () => importParts(reader.result);
                reader.readAsDataURL(blob);
                
                });
              })();
            }
            head_bar.append(img_item);
        }
    }

    function initClothesBar() {
        var img_bar = document.getElementById('img_bar');
        var clothesDirs =  JSON.parse('<?php echo json_encode(scandir('uploads/'));?>');
        clothesDirs.shift();
        clothesDirs.shift();
        for(var key in clothesDirs){
          for(var i = 0;i<4;i++){
            let part;
            if(i==0){
              part = 'body.png';
            }
            if(i==1){
              part = 'leftarm.png';
            }
            if(i==2){
              part = 'rightarm.png';
            }
            if(i==3){
              part = 'org.png';
            }
            let path = 'uploads/' + clothesDirs[key] + '/' + part;
            let img_item = document.createElement('img');
            img_item.className = "img-item";
            img_item.src = path;
            img_item.onclick = function() {
              (async function() {
                let blob = await fetch(img_item.src).then(r => r.blob());
                let dataUrl = await new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = () => importParts(reader.result);
                reader.readAsDataURL(blob);
                
                });
              })();
            }
            img_bar.append(img_item);
          }
        }
    }
  </script>
</html>