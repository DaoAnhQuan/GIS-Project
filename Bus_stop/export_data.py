import json
from shapely import wkb
import psycopg2

conn = psycopg2.connect(database="BusStopDatabase", user="postgres",
                        password="phuongle998", host="127.0.0.1", port="5432")
print("Opened database successfully")

cur = conn.cursor()

cur.execute("select id, code from bus")
rows = cur.fetchall()
bus_result = {}
for row in rows:
    bus_result[row[0]] = row[1]

with open("bus_data.json", "w") as out:
    out.write(json.dumps(bus_result, indent=2))