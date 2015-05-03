#!/usr/bin/env python

import sqlite3, json, pprint, sys

filename = sys.argv[1]

## connect to the database
conn = sqlite3.connect('tweets.db')

## create the cursor and exexute the select statement
cursor = conn.cursor()
cursor.execute('select * from tweet')

# fetch all the results into 'mydata'
mydata = cursor.fetchall()

# create a new file
f = open(filename, 'w+')

# dump the contents of 'mydata' to the file
json.dump(mydata, f)
f.close
