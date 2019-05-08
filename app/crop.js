/*
 * HTML5 crop image in polygon shape
 * author: netplayer@gmx.com
 * file : crop.js
   github version
 */

$(document).ready(function() {
  var condition = 1;
  var points = []; //holds the mousedown points
  var canvas = document.getElementById("myCanvas");
  var part = "body/";
  var done_left_arm = "";
  var done_right_arm = "";
  var done_body = "";
  this.isOldIE = window.G_vmlCanvasManager;
  $(function() {
    //  if (document.domain == 'localhost') {

    if (this.isOldIE) {
      G_vmlCanvasManager.initElement(myCanvas);
    }
    var ctx = canvas.getContext("2d");
    var imageObj = new Image();

    function init() {
      canvas.addEventListener("mousedown", mouseDown, false);
      canvas.addEventListener("mouseup", mouseUp, false);
      canvas.addEventListener("mousemove", mouseMove, false);
    }

    // Draw  image onto the canvas
    imageObj.onload = function() {
      canvas.height = imageObj.height;
      canvas.width = imageObj.width;
      ctx.drawImage(imageObj, 0, 0);
    };
    imageObj.src = document.getElementById("url_src").innerHTML;

    // Switch the blending mode
    ctx.globalCompositeOperation = "destination-over";

    //mousemove event
    $("#myCanvas").mousemove(function(e) {
      if (condition == 1) {
        ctx.beginPath();

        $("#posx").html(e.offsetX);
        $("#posy").html(e.offsetY);
      }
    });
    //mousedown event
    $("#myCanvas").mousedown(function(e) {
      if (condition == 1) {
        if (e.which == 1) {
          var pointer = $('<span class="spot">').css({
            position: "absolute",
            "background-color": "#000000",
            width: "5px",
            height: "5px",
            top: e.pageY,
            left: e.pageX
          });
          //store the points on mousedown
          points.push(e.pageX, e.pageY);

          //console.log(points);

          ctx.globalCompositeOperation = "destination-out";
          var oldposx = $("#oldposx").html();
          var oldposy = $("#oldposy").html();
          var posx = $("#posx").html();
          var posy = $("#posy").html();
          ctx.beginPath();
          ctx.moveTo(oldposx, oldposy);
          if (oldposx != "") {
            ctx.lineTo(posx, posy);

            ctx.stroke();
          }
          $("#oldposx").html(e.offsetX);
          $("#oldposy").html(e.offsetY);
        }
        $(document.body).append(pointer);
        $("#posx").html(e.offsetX);
        $("#posy").html(e.offsetY);
      } //condition
    });

    $("#crop").click(function() {
      condition = 0;

      //  var pattern = ctx.createPattern(imageObj, "repeat");
      //ctx.fillStyle = pattern;
      $(".spot").each(function() {
        $(this).remove();
      });
      //clear canvas

      //var context = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.width = canvas.width;
      ctx.height = canvas.height;
      ctx.globalCompositeOperation = "destination-over";
      //draw the polygon
      setTimeout(function() {
        //console.log(points);
        var offset = $("#myCanvas").offset();
        //console.log(offset.left,offset.top);

        for (var i = 0; i < points.length; i += 2) {
          var x = parseInt(jQuery.trim(points[i]));
          var y = parseInt(jQuery.trim(points[i + 1]));

          if (i == 0) {
            ctx.moveTo(x - offset.left, y - offset.top);
          } else {
            ctx.lineTo(x - offset.left, y - offset.top);
          }
          //console.log(points[i],points[i+1])
        }

        if (this.isOldIE) {
          ctx.fillStyle = "";
          ctx.fill();
          var fill = $("fill", myCanvas).get(0);
          fill.color = "";
          fill.src = element.src;
          fill.type = "tile";
          fill.alignShape = false;
        } else {
          var pattern = ctx.createPattern(imageObj, "repeat");
          ctx.fillStyle = pattern;
          ctx.fill();

          //edit here**************
          //find 4 est in point
          let top = null;
          let down = null;
          let left = null;
          let right = null;
          let xpoints = [];
          let ypoints = [];
          for(var pindex in points){
            if(pindex%2 == 0){
              xpoints.push(points[pindex]);
            }
            else{
              ypoints.push(points[pindex]);
            }
          }
          right = (Math.max(...xpoints));
          left = (Math.min(...xpoints));
          top = (Math.max(...ypoints));
          down = (Math.min(...ypoints));
          console.log(right+"|"+left+"|"+top+"|"+down);
          let tmpImgData = ctx.getImageData(left,top,right-left,down-top);
          let tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = right-left;
          tmpCanvas.height = down-top;
          let tmpCanvasData = tmpCanvas.getContext('2d');
          tmpCanvasData.width = tmpCanvas.width;
          tmpCanvasData.height = tmpCanvas.height;
          tmpCanvasData.putImageData(tmpImgData,0,0)
          //end edit

          // var dataurl = canvas.toDataURL("image/png");

          var dataurl = tmpCanvas.toDataURL("image/png");

          //upload to server (if needed)
          var xhr = new XMLHttpRequest();
          // //
          xhr.open("POST", "upload.php", false);
          xhr.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          var files = dataurl;
          var data = new FormData();
          var myprod = $("#pid").val();
          data = "image=" + files + "&part=" + part;
          xhr.send(data);
          if (xhr.status === 200) {
            console.log(xhr.responseText);
            if (part == "left_arm/" || done_left_arm != "") {
              if (part == "left_arm/") {
                done_left_arm = xhr.responseText;
              }
              $("#myimg_left_arm").html(
                '<img src="left_arm/' + done_left_arm + '.png"/>'
              );
              document.getElementById("left_tag").innerHTML = "Left Arm";
            }
            if (part == "right_arm/" || done_right_arm != "") {
              if (part == "right_arm/") {
                done_right_arm = xhr.responseText;
              }
              $("#myimg_right_arm").html(
                '<img src="right_arm/' + done_right_arm + '.png"/>'
              );
              document.getElementById("right_tag").innerHTML = "Right Arm";
            }
            if (part == "body/" || done_body != "") {
              if (part == "body/") {
                done_body = xhr.responseText;
              }
              $("#myimg_body").html('<img src="body/' + done_body + '.png"/>');
              document.getElementById("body_tag").innerHTML = "Body";
            }
            ctx = canvas.getContext("2d");
            imageObj = new Image();
            imageObj.onload = function() {
              ctx.drawImage(imageObj, 0, 0);
            };
            imageObj.src = document.getElementById("url_src").innerHTML;
            // Switch the blending mode
            ctx.globalCompositeOperation = "destination-over";
            points = [];
            $("#oldposx").html("");
            condition = 1;
          }
        }
      }, 20);
    });

    $("#left_arm").click(function() {
      part = "left_arm/";
      document.getElementById("editing_message").innerHTML =
        "Now Croping Left Arm";
      console.log(part);
    });

    $("#right_arm").click(function() {
      part = "right_arm/";
      document.getElementById("editing_message").innerHTML =
        "Now Croping Right Arm";
      console.log(part);
    });

    $("#body").click(function() {
      part = "body/";
      document.getElementById("editing_message").innerHTML = "Now Croping Body";
      console.log(part);
    });

    // }
    $("#finish").click(function() {
      {
        console.log("YO");
        //upload to server (if needed)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "finish.php", false);
        xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        var data = new FormData();
        var myprod = $("#pid").val();
        data =
          "body=" +
          done_body +
          "&leftarm=" +
          done_left_arm +
          "&rightarm=" +
          done_right_arm +
          "&filename=" +
          document.getElementById("name_src").innerHTML;
        xhr.send(data);
        if (xhr.status === 200) {
          console.log(xhr.responseText);
        }
      }
    });
  });
});

function trim(c) {
  var ctx = c.getContext('2d'),
    copy = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x, y;

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i+3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);
  
      if (bound.top === null) {
        bound.top = y;
      }
      
      if (bound.left === null) {
        bound.left = x; 
      } else if (x < bound.left) {
        bound.left = x;
      }
      
      if (bound.right === null) {
        bound.right = x; 
      } else if (bound.right < x) {
        bound.right = x;
      }
      
      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }
    
  var trimHeight = bound.bottom - bound.top,
      trimWidth = bound.right - bound.left,
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
  
  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);
  
  // open new window with trimmed image:
  return copy.canvas;
}