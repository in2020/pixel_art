<?php

use Common\DB;

require '../../required.php';
$json = getJsonParameter();

DB::run('INSERT INTO trainer_code SET code =? ', $json['trainerCode']);
