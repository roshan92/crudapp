<?php
class Cart{
 
    // database connection and table name
    private $conn;
    private $table_name = "cart";
 
    // object properties
    public $id;
    public $user_id;
    public $product_id;
    public $quantity;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function create(){
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    user_id=:user_id, product_id=:product_id, quantity=:quantity";
     
        // prepare query
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));
        $this->product_id=htmlspecialchars(strip_tags($this->product_id));
        $this->quantity=htmlspecialchars(strip_tags($this->quantity));
     
        // bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":quantity", $this->quantity);
        
        if($stmt->execute()){
            return true;
        }
        return false;
    }

    function show(){
        // query to read single record
        $query = "SELECT
                    c.id, c.product_id, p.name, p.price, c.quantity
                FROM
                    " . $this->table_name . " c
                LEFT JOIN
                    product p
                        ON c.product_id = p.id
                WHERE
                    user_id=:user_id ";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // bind id of cart to be updated
        $stmt->bindParam(":user_id", $this->user_id);
    
        // execute query
        $stmt->execute();

        return $stmt;
    }

    function update(){
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    quantity=:quantity
                WHERE
                    id=:id";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->quantity=htmlspecialchars(strip_tags($this->quantity));
    
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':quantity', $this->quantity);
    
        // execute the query
        if($stmt->execute()){
            return true;
        }
        return false;
    }

    function delete(){
        // delete query
        $query = "DELETE FROM " . $this->table_name . "
            WHERE id=:id ";
    
        // prepare query
        $stmt = $this->conn->prepare($query);
    
        // bind id of record to delete
        $stmt->bindParam(":id", $this->id);
    
        // execute query
        if($stmt->execute()){
            return true;
        }
        return false;
    }

    function check(){
        // query to read single record
        $query = "SELECT
                    *
                FROM
                    " . $this->table_name . " c
                WHERE
                    user_id=:user_id
                AND
                    product_id=:product_id";
    
        // prepare query statement
        $stmt = $this->conn->prepare($query);
    
        // bind id of cart to be updated
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":product_id", $this->product_id);
    
        // execute query
        $stmt->execute();

        return $stmt;
    }
}