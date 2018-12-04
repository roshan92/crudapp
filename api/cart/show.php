<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/cart.php';
include_once '../objects/product_image.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare cart object
$cart = new Cart($db);
 
// set ID property of record to read
$cart->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
 
// read the details of cart to be edited
$stmt = $cart->show();
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
    $cart_arr=array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);

        $image = '';
        $product_image = new ProductImage($db);
        $product_image->product_id = $product_id;
        $stmt2 = $product_image->show();
        $num2 = $stmt2->rowCount();
        if($num2>0) {
            while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)){
                extract($row2);
                $image = $image_filename;
            }
        }

        $cart_item = array(
            "id" => $id,
            "product_id" => $product_id,
            "name" => $name,
            "price" => $price,
            "quantity" => $quantity,
            "image_filename" => $image
        );
        array_push($cart_arr, $cart_item);
    }
    // set response code - 200 OK
    http_response_code(200);
    
    // make it json format
    echo json_encode(
        array(
            "error" => false,
            "value" => $cart_arr
        )
    );
}
else{
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user cart does not exist
    echo json_encode(
        array(
            "error" => true,
            "message" => "No cart found."
        )
    );
}
?>