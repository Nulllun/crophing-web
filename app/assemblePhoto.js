var width = window.innerWidth;
var height = window.innerHeight;
var anchorList = [];

function update(activeAnchor) {
    var group = activeAnchor.getParent();
    var topLeft = group.find('.topLeft')[0];
    var topRight = group.find('.topRight')[0];
    var bottomRight = group.find('.bottomRight')[0];
    var bottomLeft = group.find('.bottomLeft')[0];
    var image = group.find('Image')[0];
    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();
    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.y(anchorY);
            bottomLeft.x(anchorX);
            break;
        case 'topRight':
            topLeft.y(anchorY);
            bottomRight.x(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.y(anchorY);
            topRight.x(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.y(anchorY);
            topLeft.x(anchorX);
            break;
    }
    image.position(topLeft.position());
    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        image.width(width);
        image.height(height);
    }
}
function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });
    anchor.on('dragmove', function () {
        update(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function () {
        group.draggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function () {
        group.draggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.strokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
        layer.draw();
    });
    group.add(anchor);
    anchorList.push(anchor);
}

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
            height: imageObj.height
        });

        var newImgGroup = new Konva.Group({
            x: 180,
            y: 50,
            draggable: true
        });

        layer.add(newImgGroup);
        newImgGroup.add(newImg);
        addAnchor(newImgGroup, 0, 0, 'topLeft');
        addAnchor(newImgGroup, imageObj.width+1, 0, 'topRight');
        addAnchor(newImgGroup, imageObj.width+1, imageObj.height+1, 'bottomRight');
        addAnchor(newImgGroup, 0, imageObj.height+1, 'bottomLeft');
        newImg.image(imageObj);
        newImgGroup.on('dragstart', function() {
            this.moveToTop();
            layer.draw();
        });
        newImgGroup.on('dblclick dbltap', function() {
            this.destroy();
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
    for (var key in anchorList){
        anchorList[key].hide()
    }
    layer.draw();
}

function show(){
    for (var key in anchorList){
        anchorList[key].show()
    }
    layer.draw();
}