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

          var dataurl = canvas.toDataURL("image/png");

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
