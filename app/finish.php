<?php
/*
 * HTML5 crop image in polygon shape
 * author: netplayer@gmx.com
 * file: upload.php
 * github version 
 */
//error_reporting(E_ALL);

if($_POST) {
	
    //define('UPLOAD_DIR', 'upload/');
    $body = $_POST['body'];
    $leftarm = $_POST['leftarm'];
    $rightarm = $_POST['rightarm'];
    $head = $_POST['head'];
    $trousers = $_POST['trousers'];
    $filename = $_POST['filename'];
    $filename_copy = $filename;
    $filename_copy = str_replace("uploads/", "", $filename_copy);
    $filename_copy = str_replace(".png", "", $filename_copy);

    if($body != "") {
        $success1 = rename("body/" . $body . ".png", $filename . "/body.png");
    }
    if($leftarm != "") {
        $success2 = rename("left_arm/" . $leftarm . ".png", $filename . "/leftarm.png");
    }
    if($rightarm != "") {
        $success3 = rename("right_arm/" . $rightarm . ".png", $filename . "/rightarm.png");
    }
    if($trousers != "") {
        $success4 = rename("trousers/" . $trousers . ".png", "trousers_saved/" . $filename_copy . ".png");
    }
    if ($head != "") {
        $success5 = rename("head/" . $head . ".png", "heads/" . $filename_copy . ".png");
    }

    if (($success1 && $success2 && $success3) || ($success4)) 
        echo "Moved file!";
    else
        echo "Failed to move file!";


}
?>
