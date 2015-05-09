import psycopg2

conn = psycopg2.connect(database="digital_graveyard",
                        user="grabarz",
                        password="testpassword",
                        host="127.0.0.1",
                        port=5432)

cursor = conn.cursor()
cursor.execute()
