<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/product.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare product object
$product = new Product($db);
 
// set ID property of record to read
$product->id = isset($_GET['id']) ? $_GET['id'] : die();
 
// read the details of product to be edited
$stmt = $product->show();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
    $image_arr=array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        // create array
        $image_item = array(
            "id" =>  $img_id,
            "filename" => $image_filename
        );
        array_push($image_arr, $image_item);
        $product_item = array(
            "id" =>  $id,
            "name" => $name,
            "description" => $description,
            "price" => $price,
            "images" => $image_arr
        );
    }
    // set response code - 200 OK
    http_response_code(200);
    
    // make it json format
    echo json_encode(
        array(
            "error" => false,
            "value" => $product_item
        )
    );
}
else{
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user product does not exist
    echo json_encode(
        array(
            "error" => true,
            "message" => "No product found."
        )
    );
}
?>