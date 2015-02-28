<?php


function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}


//$BASEURL = "http://victorshima.com/txtstore/";
$BASEURL = "http://localhost/shima/unbabel/StoreTxt/";
$OUTPUT = array();


if ( isset($_POST['content']) && $_POST['content'] != '' ) {

    // create the content filepath for this txt data
    $dir = 'upload';
    $filename = generateRandomString(16) . '.txt';

    // adding the content directory is an atomic operation
    try {
        if ( ! file_exists($dir) ) {
            $confirm = mkdir( $dir, 0777, true );
            if ( ! $confirm ) {
                throw new \Exception( 'Content directory could not be created.', 500 );
            }
        }

        // store the content file in it
        $confirm = file_put_contents( $dir . '/' . $filename , $_POST['content'] );
        if ( ! $confirm ) {
            throw new \Exception( 'Text file could not be created.', 500 );
        }

        $OUTPUT['filepath'] = $BASEURL . $dir . '/' . $filename;
        $OUTPUT['success'] = true;

    }
    // if an error occured, delete all recently created files
    catch (\Exception $e) {
        $OUTPUT['error'] = $e->getMessage();
    }

}


echo json_encode($OUTPUT);

?>