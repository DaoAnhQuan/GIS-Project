const { Client } = require('pg');
const express = require('express');
const cors = require('cors');
const spawn = require('child_process').spawn;

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


const client = new Client({
    user:'postgres',
    host:'localhost',
    password:'125808037',
    database:'BusStopDatabase',
    port:5432
});
client.connect()

app.get('/api/bus',(req,res)=>{
    const code = req.query.code.toString();
    const bus_info = 'SELECT id,name,code, entreprise, operations_time,frequency, bus_count, cost, first_station, ' +
        'last_station, go_route_string, re_route_string' +
        ' FROM bus where code =\''+code+'\'';
    let go = '';
    let re = '';
    let go_station='';
    let re_station='';
    let bus_info_res, go_route, re_route, go_stations;

    client.query(bus_info)
        .then((res)=>{
            bus_info_res = res.rows[0];
            go = 'select ST_AsGeoJSON(go_route) from bus where id='+bus_info_res.id;
        })
        .then(()=> client.query(go))
        .then((res)=>{
            go_route = res.rows[0];
            re = 'select ST_AsGeoJSON(re_route) from bus where id = ' +bus_info_res.id;
        })
        .then(()=>client.query(re))
        .then((res)=>{
            re_route = res.rows[0];
        })
        .then(()=>{
            go_station = 'select idstation from bus_station where idbus='+bus_info_res.id+' and direction = 0';
            go_station = 'select id,name,fleetover, ST_AsGeoJSON(geo) from station where id in ('+go_station+')';
            console.log(go_station);
        })
        .then(()=>client.query(go_station))
        .then(res=>{
            go_stations = res.rows;
            re_station = 'select idstation from bus_station where idbus='+bus_info_res.id+' and direction = 1';
            re_station = 'select id,name,fleetover, ST_AsGeoJSON(geo) from station where id in ('+re_station+')';
            console.log(re_station);
        })
        .then(()=>client.query(re_station))
        .then((response)=>{
            //console.log(response);
            res.send({
                bus_info: bus_info_res,
                go_route: go_route,
                re_route: re_route,
                go_station:go_stations,
                re_station:response.rows,
            })
        })
});

app.get('/api/path',(req,res) => {
    const srcId = req.query.srcId;
    const dstId = req.query.dstId;
    const pythonProcess = spawn('python',["demo.py", srcId, dstId]);
    console.log(srcId + " ******" + dstId);

    pythonProcess.stdout.on('data', (data) => {
        const result = JSON.parse(data.toString('utf-8'));
        const resultString = result.result_string;
        const resultList = result.result_list_station;
        const bus = result.bus;
        const foot = result.foot;
        const footPath = foot.map(value => {
           const p=[];
           p.push({
               x:value.start.location[0],
               y:value.start.location[1]
           });
            p.push({
                x:value.end.location[0],
                y:value.end.location[1]
            });
            return p;
        });
        const listId = resultList.toString();
        const get_station_query = "select name, fleetover, st_asgeojson(geo) from station where id in ("+listId+")";
        let path = [];
        let stations;
        client.query(get_station_query)
            .then(response=>{
                stations = response.rows;
                // res.send({
                //     "resultString": resultString,
                //     "resultList": response.rows,
                // });
            }).then(async ()=>{
                for (let item of bus){
                    const id_query = "select id from bus where code = '"+item.bus+"'";
                    let id, frs_id, snd_id, direction, frs_dir, snd_dir;
                    await client.query(id_query).then(res=>{id=res.rows[0].id});
                    const fst_station_id = "select id from station where name = '"+item.start.name+"'";
                    await client.query(fst_station_id).then(res=>{frs_id=res.rows[0].id});
                    const snd_station_id = "select id from station where name = '"+item.end.name+"'";
                    await client.query(snd_station_id).then(res=>{snd_id=res.rows[0].id});
                    const fdirq = "select direction, station_order from bus_station where idbus="+id+" and "+"idstation="+frs_id+" order by direction";
                    const sdirq = "select direction, station_order from bus_station where idbus="+id+" and "+"idstation="+snd_id+" order by direction";
                    await client.query(fdirq).then(res=>{frs_dir=res.rows})
                    await client.query(sdirq).then(res=>{snd_dir=res.rows})
                    if (frs_dir.length===2 && snd_dir.length ===1 ){
                        direction = snd_dir[0].direction;
                    }else{
                        if (frs_dir.length===1 && snd_dir.length ===2 ){
                            direction = frs_dir[0].direction;
                        }
                        else{
                            if (frs_dir.length===2 && snd_dir.length ===2 ){
                                if (frs_dir[0].station_order<snd_dir[0].station_order){
                                    direction=1;
                                }else{
                                    direction=0;
                                }
                            }else{
                                direction=frs_dir[0].direction;
                            }
                        }
                    }
                    let route, routeq;
                    if (direction===0){
                        routeq = "select ST_AsText(foo.go_route) FROM (SELECT go_route from bus where id ="+id+") As foo";
                    }else{
                        routeq = "select ST_AsText(foo.re_route) FROM (SELECT re_route from bus where id ="+id+") As foo";
                    }
                    await client.query(routeq).then(res=>{route=res.rows[0].st_astext});
                    let fstPoint, sndPoint;
                    const fp = "select ST_AsText(frs.geo) from (select geo from station where id ="+frs_id+") as frs";
                    const sp = "select ST_AsText(frs.geo) from (select geo from station where id ="+snd_id+") as frs";

                    await client.query(fp).then(res=>{fstPoint=res.rows[0].st_astext});
                    await client.query(sp).then(res=>{sndPoint=res.rows[0].st_astext});

                    const flq = "select ST_LineLocatePoint(ST_GeomFromText('"+route+"'),ST_GeomFromText('"+fstPoint+"'))";
                    const slq = "select ST_LineLocatePoint(ST_GeomFromText('"+route+"'),ST_GeomFromText('"+sndPoint+"'))";
                    let fl,sl;
                    await client.query(flq).then(res=>{fl=res.rows[0].st_linelocatepoint});
                    await client.query(slq).then(res=>{sl=res.rows[0].st_linelocatepoint});
                    if (fl>sl){
                        let tmp = sl;
                        sl = fl;
                        fl = tmp;
                    }
                    let subPath;
                    const spq = "select ST_AsGeoJSON(ST_LineSubstring(ST_GeomFromText('"+route+"'),"+fl+","+sl+"))";
                    await client.query(spq).then(res=>{subPath=res.rows});
                    path.push(subPath);
                }
            }).then(()=>{
                    res.send({
                        "resultString": resultString,
                        "resultList": stations,
                        "path":path,
                        "foot":footPath,
                    });
            })
    });
    pythonProcess.stderr.on('data', (data) => {
        console.log(data.toString());
    });
});

app.get('/api/station',(req,res)=>{
    const get_all_station_query = "select id, name from station";
    client.query(get_all_station_query)
        .then(response=>{
            res.send({
                'stations':response.rows,
            })
        })
});

app.listen(3010,()=>{
    console.log('New client!\n');
})