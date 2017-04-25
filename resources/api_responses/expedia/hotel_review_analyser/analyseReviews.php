<?php

$hotelcode = '9917391';

$json = file_get_contents(__DIR__ . '/../../../test_data/'.$hotelcode.'/reviews.json');
$json = json_decode($json, true);

var_dump($json);