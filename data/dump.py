#!/usr/bin/env python

import sqlite3, json, pprint, sys


## connect to the database
conn = sqlite3.connect('tweets.db')

## create the cursor and exexute the select statement
cursor = conn.cursor()
cursor.execute('select * from tweet')

# fetch all the results into 'mydata'
mydata = cursor.fetchall()

# dump the contents of 'mydata' to a string
data_json = json.dumps(mydata, ensure_ascii=false)

print(data_json)

