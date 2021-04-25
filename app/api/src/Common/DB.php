<?php


namespace Common;


class DB
{
    public static function run(...$args)
    {
        return self::db()->run($args[0], $args[1]);
    }

    private static function db(){
        $dbHost = 'database-1.cwquh8kas3fc.us-east-2.rds.amazonaws.com';
        return  \ParagonIE\EasyDB\Factory::fromArray([
            "mysql:host={$dbHost};dbname=pokemon",
            'admin',
            'db210424'
        ]);
    }
}
