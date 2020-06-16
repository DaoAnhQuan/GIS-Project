const { Client } = require('pg');
const express = require('express');
const app = express();


const client = new Client({
    user:'postgres',
    host:'localhost',
    password:'125808037',
    database:'BusStopDatabase',
    port:5432
});
client.connect()

app.get('/api/bus',(req,res)=>{
    const bus_info = 'SELECT id,name,code, entreprise, operations_time,frequency, bus_count, cost, first_station, ' +
        'last_station, go_route_string, re_route_string' +
        ' FROM bus where code = '+req.query.code;
    const go = 'select ST_AsGeoJSON(go_route) from bus where code = '+ req.query.code;
    const re = 'select ST_AsGeoJSON(re_route) from bus where code = '+ req.query.code;
    let bus_info_res, go_route, re_route;

    client.query(bus_info)
        .then((res)=>{
            bus_info_res = res.rows[0];
        })
        .then(()=> client.query(go))
        .then((res)=>{
            go_route = res.rows[0];
        })
        .then(()=>client.query(re))
        .then((res)=>{
            re_route = res.rows[0];
        })
        .then(()=>{
            res.send({
                bus_info: bus_info_res,
                go_route: go_route,
                re_route: re_route
            })
        })
});

app.listen(3010,()=>{
    console.log('New client!\n');
})