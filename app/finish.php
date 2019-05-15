<?php

if($_POST) {
	
    //define('UPLOAD_DIR', 'upload/');
    $body = $_POST['body'];
    $leftarm = $_POST['leftarm'];
    $rightarm = $_POST['rightarm'];
    $head = $_POST['head'];
    $trouser = $_POST['trouser'];
    $filename = $_POST['filename'];
    $filename_copy = $filename;
    $filename_copy = str_replace("temp/temp_original/", "", $filename_copy);
    $dir_name = $filename_copy;
    //$filename_copy = str_replace(".png", "", $filename_copy);

    if($body != "") {
        if (!file_exists("uploads/clothes/" . $filename_copy)) {
            mkdir("uploads/clothes/" . $filename_copy, 0777, true);
        }
        $success1 = rename("temp/body/" . $body . ".png", "uploads/clothes/" . $filename_copy . "/body.png");
    }
    if($leftarm != "") {
        if (!file_exists("uploads/clothes/" . $filename_copy)) {
            mkdir("uploads/clothes/" . $filename_copy, 0777, true);
        }
        $success2 = rename("temp/left_arm/" . $leftarm . ".png", "uploads/clothes/" . $filename_copy . "/leftarm.png");
    }
    if($rightarm != "") {
        if (!file_exists("uploads/clothes/" . $filename_copy)) {
            mkdir("uploads/clothes/" . $filename_copy, 0777, true);
        }
        $success3 = rename("temp/right_arm/" . $rightarm . ".png", "uploads/clothes/" . $filename_copy . "/rightarm.png");
    }
    if($trouser != "") {
        if (!file_exists("uploads/trousers/")) {
            mkdir("uploads/trousers/", 0777, true);
        }
        $success4 = rename("temp/trouser/" . $trouser . ".png", "uploads/trousers/" . $filename_copy);
    }
    if ($head != "") {
        if (!file_exists("uploads/heads/")) {
            mkdir("uploads/heads/", 0777, true);
        }
        $success5 = rename("temp/head/" . $head . ".png", "uploads/heads/" . $filename_copy);
    }

    if ((($success1 && $success2 && $success3) || ($success4))|| ($success5)){
        if ($success1 && $success2 && $success3){
            rename($filename, "uploads/clothes/" . $filename_copy . "/org.png");
        }
        if($success4){
            unlink($filename);
        }
        if($success5){
            unlink($filename);
        }

        echo "Moved file!";
    }
    else {
        echo "Failed to move file!";
    }
       


}
?>
