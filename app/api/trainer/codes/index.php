<?php

use Common\DB;

require '../../required.php';
$json = getJsonParameter();

$rows = DB::run('SELECT * FROM trainer_code WHERE is_invalid = 0 ORDER BY id DESC ');

responseJson([
    'trainerCodes' => $rows
]);
