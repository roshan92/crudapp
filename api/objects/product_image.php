<?php
class ProductImage{
 
    // database connection and table name
    private $conn;
    private $table_name = "product_image";
 
    // object properties
    public $image_filename;
    public $product_id;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // used when filling up the update product form
    function listAll(){
    
        // query to read single record
        $query = "SELECT
                    *
                FROM
                    " . $this->table_name ;
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // execute query
        $stmt->execute();
    
        return $stmt;
    }

    function show(){
    
        // query to read single record
        $query = "SELECT
                    image_filename
                FROM
                    " . $this->table_name . "
                WHERE
                    product_id=:product_id
                LIMIT 1";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // bind id of product to be updated
        $stmt->bindParam(":product_id", $this->product_id);
    
        // execute query
        $stmt->execute();

        return $stmt;
    }
}