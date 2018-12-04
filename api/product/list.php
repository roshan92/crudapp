<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/product.php';
include_once '../objects/product_image.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$product = new Product($db);
// query products
$stmt = $product->listAll();
$num = $stmt->rowCount();

// check if more than 0 record found
if($num>0){
 
    // products array
    $product_arr=array();
    $product_arr["value"]=array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        
        $image = '';
        $product_image = new ProductImage($db);
        $product_image->product_id = $id;
        $stmt2 = $product_image->show();
        $num2 = $stmt2->rowCount();
        if($num2>0) {
            while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)){
                extract($row2);
                $image = $image_filename;
            }
        }

        $product_item=array(
            "id" => $id,
            "name" => $name,
            "description" => $description,
            "price" => $price,
            "image_filename" => $image
        );
        array_push($product_arr["value"], $product_item);
    }
 
    // set response code - 200 OK
    http_response_code(200);
 
    echo json_encode(
        array(
            "error" => false,
            "value" => $product_arr["value"]
        )
    );
    // show products data in json format
}
 
else{
 
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user no products found
    echo json_encode(
        array(
            "error" => true,
            "message" => "No product found."
        )
    );
}
?>