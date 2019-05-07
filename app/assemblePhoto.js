var width = window.innerWidth;
var height = window.innerHeight;
var rotateFrameList = [];

var stage = new Konva.Stage({
    container: 'model_preview',
    width: width,
    height: height
});
var layer = new Konva.Layer();
stage.add(layer);

function importParts(imgSrc) {
    
    var imageObj = new Image();
    imageObj.onload = function () {
        var newImg = new Konva.Image({
            width: imageObj.width,
            height: imageObj.height,
            x: 80,
            y: 80,
            draggable: true
        });

        layer.add(newImg);
        newImg.image(imageObj);
        var rotateFrame = new Konva.Transformer({
            node: newImg,
            centeredScaling: true,
            rotationSnaps: [0, 90, 180, 270],
            resizeEnabled: true
        });
        rotateFrameList.push(rotateFrame);
        layer.add(rotateFrame);
        newImg.on('dragstart', function() {
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
    downloadURI(dataURL, 'stage.png');
    
    
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