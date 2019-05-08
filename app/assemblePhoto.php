<!DOCTYPE html>
<html>
  <head>
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
    </style>
  </head>
  <body>
    <div id="control_panel">
        <button id="import_parts" onclick="selectPart()">Import</button>
        <button id="finish" onclick="savePhoto()">Finish</button>
        <button id="finish" onclick="show()">Show Boundary</button>
        <button id="finish" onclick="hide()">Hide Boundary</button>
    </div>
    <div id="model_preview"></div>
  </body>
  <script src="assemblePhoto.js"></script>
</html>