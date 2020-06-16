# Requirement
1. Cài đặt Jupyter notebooks
2. Cài đặt PostgreSQL and postgis
3. Cài đặt Nodejs

# Install package
```bash
pip install psycopg2 
pip install postgis
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
2. Mở file GetData.ipynb bằng Jupyter cầu hình lại các tham số ```user, password, dbname```
3. Run all
# Server Configuration
Mở file Bus_stop/index.js điều chỉnh lại các tham số trong client.
# Run Server
npm run start:dev
