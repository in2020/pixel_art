<?php

require '../../vendor/autoload.php';
$dbHost = 'database-1.cwquh8kas3fc.us-east-2.rds.amazonaws.com';
$db = \ParagonIE\EasyDB\Factory::fromArray([
    "mysql:host={$dbHost};dbname=pokemon",
    'admin',
    'db210424'
]);
$body = file_get_contents('php://input');
$json=json_decode($body);

$db->run('INSERT INTO trainer_code SET code =? ', $json['trainerCode']);
