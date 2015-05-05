-- Drop stuff if needed

DROP DATABASE IF EXISTS digital_graveyard;
DROP ROLE IF EXISTS grabarz;


-- Roles

CREATE ROLE grabarz WITH
UNENCRYPTED PASSWORD 'testpassword'
-- 'testpassword'
LOGIN NOSUPERUSER NOINHERIT NOCREATEDB CREATEROLE;



-- Databases

CREATE DATABASE digital_graveyard
WITH ENCODING = 'UTF8'
OWNER = grabarz;

