<html>
    <head>
        <link rel="stylesheet" href="./css/bootstrap.css">
        <script src="jquery-3.4.1.min.js" type="application/javascript"></script>
        <script src="popper.min.js" type="application/javascript"></script>
        <script src="js/bootstrap.js" type="application/javascript"></script>
    </head>
    <body>
        <div class="container">

            <nav class="nav nav-pills flex-column flex-sm-row">
                <a class="flex-sm-fill text-sm-center nav-link active" href="index.php">Cropping</a>
                <a class="flex-sm-fill text-sm-center nav-link" href="assemblePhoto.php">Assemble</a>
            </nav>

            <form method="POST" action="./index.php" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="exampleFormControlFile1">Select file input</label>
                    <input type="file" class="form-control-file" name="fileToUpload" id="exampleFormControlFile1">
                    <input type="submit" class="form-control">
                </div>
            </form>


<?php
    if(isset($_FILES["fileToUpload"])) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);

        $target_dir = "uploads/";
        $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        // Check if image file is a actual image or fake image
        if(isset($_POST["submit"])) {
            $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
            if($check !== false) {
                echo "File is an image - " . $check["mime"] . ".";
                $uploadOk = 1;
            } else {
                echo "File is not an image.";
                $uploadOk = 0;
            }
        }
        // Check if file already exists
        if (file_exists($target_file)) {
            echo "Sorry, file already exists.";
            $uploadOk = 0;
        }
        // Check file size
        if ($_FILES["fileToUpload"]["size"] > 500000) {
            echo "Sorry, your file is too large.";
            $uploadOk = 0;
        }
        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif" ) {
            echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            $uploadOk = 0;
        }
        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
        } else {
            if (!file_exists($target_file)) {
                mkdir($target_file, 0777, true);
            }
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file . "/org." . $imageFileType)) {
                echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
                header("Location: edit.php?link=" . $target_file . "/org." . $imageFileType . "&filename=" . $target_file);
                die();
            } else {
                echo "Sorry, there was an error uploading your file.";
            }
        }
    }
?>

</div>
    </body>
</html>
