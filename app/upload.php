<?php

if($_POST) {
	
    //define('UPLOAD_DIR', 'upload/');
    $img = $_POST['image'];
    $img = str_replace('data:image/png;base64,', '', $img);
   
    $part = $_POST['part'];

    $img = str_replace(' ', '+', $img);
   
    $dataimg = base64_decode($img);
    
    $nameimg = uniqid();

    $fileimg = $part . $nameimg . '.png';
    $successimg = file_put_contents($fileimg, $dataimg);

    echo $nameimg;


}
?>
