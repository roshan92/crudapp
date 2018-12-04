<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate user object
include_once '../objects/cart.php';
 
$database = new Database();
$db = $database->getConnection();
 
$cart = new Cart($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));
 
// make sure data is not empty
if(
    !empty($data->user_id) &&
    !empty($data->product_id) &&
    !empty($data->quantity)
){
 
    // set user property values
    $cart->user_id = $data->user_id;
    $cart->product_id = $data->product_id;
    $cart->quantity = $data->quantity;

    $stmt = $cart->check();
    $num = $stmt->rowCount();
    
    // check if more than 0 record found
    if($num>0){
        http_response_code(200);
        echo json_encode(
            array(
                "error" => false,
                "message" => "Product already added to cart."
            )
        );
    }
    else {
        // create the user
        if($cart->create()){
    
            // set response code - 201 created
            http_response_code(201);
    
            // tell the user
            echo json_encode(
                array(
                    "error" => false,
                    "message" => "Product added to cart."
                )
            );
        }

        // if unable to create the user, tell the user
        else{
    
            // set response code - 503 service unavailable
            http_response_code(503);
    
            // tell the user
            echo json_encode(
                array(
                    "error" => true,
                    "message" => "Unable to add cart."
                )
            );
        }
    }   
}
// tell the user data is incomplete
else{
 
    // set response code - 400 bad request
    http_response_code(400);
 
    // tell the user
    echo json_encode(
        array(
            "error" => true,
            "message" => "Unable to add cart. Data is incomplete."
        )
    );
}
?>