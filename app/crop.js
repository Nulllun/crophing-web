$(document).ready(function() {
  var condition = 1;
  var points = []; //holds the mousedown points
  var canvas = document.getElementById("myCanvas");
  var part = "temp/body/";
  var done_left_arm = "";
  var done_right_arm = "";
  var done_body = "";
  var done_head = "";
  var done_trouser = "";
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

          let tmpCanvas = trim(canvas);

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
            if (part == "temp/left_arm/" || done_left_arm != "") {
              if (part == "temp/left_arm/") {
                done_left_arm = xhr.responseText;
              }
              $("#myimg_left_arm").html(
                '<img src="temp/left_arm/' + done_left_arm + '.png"/>'
              );
              document.getElementById("left_tag").innerHTML = "Left Arm";
            }
            if (part == "temp/right_arm/" || done_right_arm != "") {
              if (part == "temp/right_arm/") {
                done_right_arm = xhr.responseText;
              }
              $("#myimg_right_arm").html(
                '<img src="temp/right_arm/' + done_right_arm + '.png"/>'
              );
              document.getElementById("right_tag").innerHTML = "Right Arm";
            }
            if (part == "temp/body/" || done_body != "") {
              if (part == "temp/body/") {
                done_body = xhr.responseText;
              }
              $("#myimg_body").html(
                '<img src="temp/body/' + done_body + '.png"/>'
              );
              document.getElementById("body_tag").innerHTML = "Body";
            }
            if (part == "temp/trouser/" || done_trouser != "") {
              if (part == "temp/trouser/") {
                done_trouser = xhr.responseText;
              }
              $("#myimg_trouser").html(
                '<img src="temp/trouser/' + done_trouser + '.png"/>'
              );
              document.getElementById("trouser_tag").innerHTML = "Trouser";
            }
            if (part == "temp/head/" || done_head != "") {
              if (part == "temp/head/") {
                done_head = xhr.responseText;
              }
              $("#myimg_head").html(
                '<img src="temp/head/' + done_head + '.png"/>'
              );
              document.getElementById("head_tag").innerHTML = "Head";
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
      part = "temp/left_arm/";
      document.getElementById("editing_message").innerHTML =
        "Now Croping Left Arm";
      console.log(part);
    });

    $("#right_arm").click(function() {
      part = "temp/right_arm/";
      document.getElementById("editing_message").innerHTML =
        "Now Croping Right Arm";
      console.log(part);
    });

    $("#body").click(function() {
      part = "temp/body/";
      document.getElementById("editing_message").innerHTML = "Now Croping Body";
      console.log(part);
    });

    $("#head").click(function() {
      part = "temp/head/";
      document.getElementById("editing_message").innerHTML = "Now Croping Head";
      console.log(part);
    });

    $("#trouser").click(function() {
      part = "temp/trouser/";
      document.getElementById("editing_message").innerHTML =
        "Now Croping Trouser";
      console.log(part);
    });

    // }
    $("#finish").click(function() {
      {
        //console.log("YO");
        //upload to server (if needed)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "finish.php", false);
        xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        var data = new FormData();
        var myprod = $("#pid").val();
        console.log("done_trouser:" + done_trouser);
        console.log(document.getElementById("name_src").innerHTML);
        data =
          "body=" +
          done_body +
          "&leftarm=" +
          done_left_arm +
          "&rightarm=" +
          done_right_arm +
          "&head=" +
          done_head +
          "&trouser=" +
          done_trouser +
          "&filename=" +
          document.getElementById("name_src").innerHTML;
        xhr.send(data);
        if (xhr.status === 200) {
          console.log(xhr.responseText);
          if (xhr.responseText == "Moved file!") {
            alert("File Saved");
          } else {
            alert("Save Fail! Maybe Try again?");
          }
        }
      }
    });
  });
});

//Reference: https://gist.github.com/remy/784508
function trim(c) {
  var ctx = c.getContext("2d"),
    copy = document.createElement("canvas").getContext("2d"),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x,
    y;

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~(i / 4 / c.width);

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
