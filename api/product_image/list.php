<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/product_image.php';
 
// instantiate database and product_image object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$product_image = new ProductImage($db);
// query product_images
$stmt = $product_image->listAll();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // product_images array
    $product_image_arr=array();
    $product_image_arr["value"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $product_image_item=array(
            "id" => $id,
            "image_filename" => $image_filename,
            "product_id" => $product_id
        );
        array_push($product_image_arr["value"], $product_image_item);
    }
 
    // set response code - 200 OK
    http_response_code(200);
 
    echo json_encode(
        array(
            "error" => false,
            "value" => $product_image_arr["value"]
        )
    );
    // show product_images data in json format
}
 
else{
 
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user no product_images found
    echo json_encode(
        array(
            "error" => true,
            "message" => "No product image found."
        )
    );
}
?>