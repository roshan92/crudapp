<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/user.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare user object
$user = new User($db);
 
// set ID property of record to read
// $user->username = isset($_GET['username']) ? $_GET['username'] : die();
// $user->password = isset($_GET['password']) ? $_GET['password'] : die();

$data = json_decode(file_get_contents("php://input"));

// set user property values
$user->username = $data->username;
$user->password = $data->password;

// read the details of user to be edited
$user->login();
 
// echo json_encode(
//     array(
//         "error" => true,
//         "message" => $data->username
//     )
// );
if(
    $user->id!=null &&
    $user->username!=null &&
    $user->password!=null
){
    // create array
    $user_arr = array(
        "id" => $user->id,
        "username" =>  $user->username,
        "password" => $user->password,
    );
 
    // set response code - 200 OK
    http_response_code(200);
 
    // make it json format
    echo json_encode(
        array(
            "error" => false,
            "user" => $user_arr
        )
    );
}
 
else{
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user user does not exist
    echo json_encode(
        array(
            "error" => true,
            "message" => "Invalid credentials."
        )
    );
}
?>