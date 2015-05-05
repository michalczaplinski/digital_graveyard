-- Schema
DROP SCHEMA IF EXISTS core;
    CREATE SCHEMA core
    AUTHORIZATION grabarz;

-- Tables
SET SEARCH_PATH TO core;

CREATE TABLE IF NOT EXISTS tweets
(
  ID         BIGSERIAL      NOT NULL  PRIMARY KEY,
  NAME       VARCHAR(140)   NOT NULL,
  TWEET      VARCHAR(140)   NOT NULL,
  USERNAME   VARCHAR(15)    NOT NULL,
  TIME       timestamp with time zone NOT NULL,
  RETWEETED  BOOLEAN        NOT NULL
);
ALTER TABLE tweets
OWNER TO grabarz;


CREATE TABLE IF NOT EXISTS flowers
(
  ID        BIGSERIAL           NOT NULL  PRIMARY KEY,
  X         double precision    NOT NULL,
  Y         double precision    NOT NULL
);
ALTER TABLE flowers
OWNER TO grabarz;


CREATE TABLE IF NOT EXISTS candles
(
  ID        BIGSERIAL           NOT NULL  PRIMARY KEY,
  X         double precision    NOT NULL,
  Y         double precision    NOT NULL
);
ALTER TABLE candles
OWNER TO grabarz;
