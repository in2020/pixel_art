<?php

use Common\DB;

require '../../../required.php';
$json = getJsonParameter();

DB::run('UPDATE trainer_code SET is_invalid =IF(is_invalid = 1, 0 , 1) WHERE code = ?', $json['trainerCode']);
