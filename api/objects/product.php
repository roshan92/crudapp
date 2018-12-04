<?php
class Product{
 
    // database connection and table name
    private $conn;
    private $table_name = "product";
 
    // object properties
    public $name;
    public $description;
    public $price;
 
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
                    p.id, p.name, p.description, p.price, pimg.id as img_id, pimg.image_filename
                FROM
                    " . $this->table_name . " p
                LEFT JOIN
                    product_image pimg
                        ON p.id = pimg.product_id
                WHERE
                    p.id=:id ";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // bind id of product to be updated
        $stmt->bindParam(":id", $this->id);
    
        // execute query
        $stmt->execute();

        return $stmt;
    }
}