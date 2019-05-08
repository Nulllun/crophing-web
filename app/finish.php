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
    $filename = $_POST['filename'];

    $success1 = rename("body/" . $body . ".png", $filename . "/body.png");
    $success2 = rename("left_arm/" . $leftarm . ".png", $filename . "/leftarm.png");
    $success3 = rename("right_arm/" . $rightarm . ".png", $filename . "/rightarm.png");

    if ($success1 && $success2 && $success3) 
        echo "Moved file!";
    else
        echo "Failed to move file!";


}
?>
