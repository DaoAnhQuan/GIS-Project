# Requirement
1. Cài đặt [Jupyter notebooks](https://jupyter.org/install)
2. Cài đặt [PostgreSQL và postgis](https://www.postgresql.org/download/)
3. Cài đặt [Nodejs](https://nodejs.org/en/download/)
4. Cài đặt [Python](https://www.python.org/downloads/)

# Install package
Chạy các lệnh sau:
```bash
pip install psycopg2 
pip install postgis
pip install shapely
pip install numba
```

Trong Bus_stop, chạy
```bash
npm install
```
Trong view, chạy
```bash
npm install
```

# Add Data to DB
1. Tạo database với extension postgis
2. Mở file GetData.ipynb bằng Jupyter notebooks cấu hình lại các tham số ```user, password, dbname```
3. Run all
# Server Configuration
Mở file Bus_stop/index.js điều chỉnh lại các tham số trong client.
```js
const client = new Client({
    user:'postgres',
    host:'localhost',
    password:'',
    database:'BusStopDatabase',
    port:5432
});
```
Mở file Bus_stop/demo.py điều chỉnh lại các tham số:
```bash
conn = psycopg2.connect(database="BusStopDatabase", user="postgres", password="", host="127.0.0.1", port="5432")
```
# Run Server
Vào thư mục Bus_stop chạy:
```bash
npm run start:dev
```
Vào thự mục view chạy:
```bash
npm start
```