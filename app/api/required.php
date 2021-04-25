<?php
require 'vendor/autoload.php';

function getJsonParameter(){
    $body = file_get_contents('php://input');
    $json=json_decode($body, true);
    return $json;
}
function responseJson($response, int $statusCode = 200){
    http_response_code($statusCode);
    header('Content-type: application/json');
    echo json_encode( $response );
}
