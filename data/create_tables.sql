-- Schema
DROP SCHEMA IF EXISTS core;
    CREATE SCHEMA core
    AUTHORIZATION grabarz;

-- Tables
SET SEARCH_PATH TO core;

CREATE TABLE IF NOT EXISTS tweets
(
  ID                    BIGSERIAL             NOT NULL  PRIMARY KEY,
  TWEET_TWITTER_ID      VARCHAR(20)           NOT NULL,
  NAME                  VARCHAR(140)          NOT NULL,
  TWEET                 VARCHAR(140)          NOT NULL,
  USERNAME              VARCHAR(15)           NOT NULL,
  USER_TWITTER_ID       VARCHAR(20)           NOT NULL,
  TIME                  timestamp             NOT NULL,
  TIMEZONE              VARCHAR(20),
  IS_RETWEET            BOOLEAN               NOT NULL,

  CONSTRAINT tweets_unique_twitter_tweet_id UNIQUE (TWEET_TWITTER_ID),
  CONSTRAINT tweets_unique_username UNIQUE (USERNAME),
  CONSTRAINT tweets_unique_twitter_user_id UNIQUE (USER_TWITTER_ID)

);
ALTER TABLE tweets
OWNER TO grabarz;


CREATE TABLE IF NOT EXISTS flowers
(
  ID                    BIGSERIAL             NOT NULL  PRIMARY KEY,
  TWEET_ID              BIGSERIAL             NOT NULL  REFERENCES tweets (ID),
  X                     double precision      NOT NULL,
  Y                     double precision      NOT NULL
);
ALTER TABLE flowers
OWNER TO grabarz;


CREATE TABLE IF NOT EXISTS candles
(
  ID                    BIGSERIAL             NOT NULL  PRIMARY KEY,
  TWEET_ID              BIGSERIAL             NOT NULL  REFERENCES tweets (ID),
  X                     double precision      NOT NULL,
  Y                     double precision      NOT NULL
);
ALTER TABLE candles
OWNER TO grabarz;
