import React from 'react';
import { Input, AutoComplete, message, Card, Table } from 'antd';
import axios from 'axios';
import {connect} from 'react-redux'
import {IgrGeographicPolylineSeries} from "igniteui-react-maps";
import { MarkerType } from 'igniteui-react-charts';
import { IgrGeographicSymbolSeries } from 'igniteui-react-maps';
import {IgrDataContext} from "igniteui-react-core";
const {Search} = Input;

const bus = ["01 - Bến xe Gia Lâm - Bến xe Yên Nghĩa","02 - Bác Cổ - Bến xe Yên Nghĩa","03A - Bến xe Giáp Bát - Bến xe Gia Lâm","03B - Bến xe Nước Ngầm - Giang Biên (Long Biên)","04 - Long Biên - Bệnh viện Nội tiết trung ương cơ sở 2","05 - KĐT Linh Đàm 4 - Phú Diễn","06A - Bến xe Giáp Bát - Cầu Giẽ","06B - Bến xe Giáp Bát - Hồng Vân","06C - Bến xe Giáp Bát - Phú Minh","06D - Bến xe Giáp Bát - Tân Dân","06E - Bến xe Giáp Bát - Phú Túc","07 - Cầu Giấy - Nội Bài","08A - Long Biên - Đông Mỹ","08ACT - Long Biên - Đông Mỹ","08B - Long Biên - Vạn Phúc","08BCT - Long Biên - Vạn Phúc","09A - Bờ Hồ - Cầu Giấy - Khu Liên cơ quan Sở ngành HN","09ACT - Trần Khánh Dư - Khu liên cơ quan Sở ngành HN","09B - Bờ Hồ - Công viên Thống Nhất - Bến xe Mỹ Đình","09BCT - Trần Khánh Dư - Bến xe Mỹ Đình","100 - Long Biên - Khu đô thị Đặng Xá","101A - Bến xe Giáp Bát - Vân Đình","101B - Bến xe Giáp Bát - Đại Cường (Ứng Hòa)","102 - Bến xe Yên Nghĩa - Vân Đình","103A - Bến xe Mỹ Đình - Hương Sơn","103B - Bến xe Mỹ Đình - Hồng Quang - Hương Sơn","104 - Mỹ Đình - BX Nước Ngầm","105 - Đô Nghĩa - Cầu Giấy","106 - KĐT Mỗ Lao - TTTM Aeon Mall Long Biên","107 - Kim Mã - Làng văn hóa du lịch các dân tộc VN","108 - Bến xe Thường Tín - Minh Tân","109 - Mỹ Đình - Nội Bài","10A - Long Biên - Từ Sơn","10B - Long Biên - Trung Mầu","11 - Công viên Thống Nhất - Học Viện Nông Nghiệp","110 - BX Sơn Tây - Vườn Quốc gia Ba Vì - Đá Chông","111 - BX Sơn Tây - Bất Bạt","112 - Nam Thăng Long - Thạch Đà (Mê Linh)","113 - Đại Thắng (Phú Xuyên) - Bến đò Vườn Chuối","12 - Công viên Nghĩa Đô - Đại Áng","13 - CV nước Hồ Tây - Cổ Nhuế (HVCS)","14 - Bờ Hồ - Cổ Nhuế","14CT - Trần Khánh Dư - Cổ Nhuế","15 - Bến xe Gia Lâm - Phố Nỉ","16 - Bến xe Mỹ Đình - Bến xe Nước Ngầm","17 - Long Biên - Nội Bài","18 - ĐH Kinh tế QD - ĐH Kinh tế QD","19 - Trần Khánh Dư - KĐT Vinhomes Thăng Long","20A - Cầu Giấy - Bến xe Sơn Tây","20B - Nhổn - Bến xe Sơn Tây","21A - Bến xe Giáp Bát - Bến xe Yên Nghĩa","21B - Khu đô thị Pháp Vân - Bến xe Mỹ Đình","22A - Bến xe Gia Lâm - KĐT Trung Văn","22B - BX Mỹ Đình - KĐT Kiến Hưng","22C - Bến xe Giáp Bát - Khu đô thị Dương Nội","23 - Nguyễn Công Trứ - Nguyễn Công Trứ","24 - Long Biên - Cầu Giấy","25 - BV Nhiệt đới TW Cơ sở 2 - Bến xe Giáp Bát","26 - Mai Động - SVĐ Quốc gia","27 - Bến xe Yên Nghĩa - Bến xe Nam Thăng Long","28 - BX Nước Ngầm - Đông Ngạc - Đại học Mỏ","29 - BX Giáp Bát - Tân Lập","31 - Bách Khoa - Chèm (ĐH Mỏ)","32 - Bến xe Giáp Bát - Nhổn","33 - Cụm Công nghiệp Thanh Oai - Xuân Đỉnh","34 - Bến xe Mỹ Đình - Bến xe Gia Lâm","35A - Trần Khánh Dư - Nam Thăng Long","35B - Nam Thăng Long - Thanh Lâm","36 - Yên Phụ - Khu đô thị Linh Đàm","36CT - Yên Phụ - Khu đô thị Linh Đàm","37 - Bến xe Giáp Bát - Chương Mỹ","38 - BX Nam Thăng Long - Mai Động","39 - Công viên Nghĩa Đô - Bệnh viện Nội tiết TW CS II","40 - Công viên Thống Nhất - Văn Lâm","41 - Nghi Tàm - BX Giáp Bát","42 - Giáp Bát - Đức Giang","43 - Công viên Thống Nhất - Thị trấn Đông Anh","44 - Trần Khánh Dư - BX Mỹ Đình","45 - Time City - Bến xe Nam Thăng Long","46 - Bến xe Mỹ Đình - Thị trấn Đông Anh","47A - Long Biên - Bát Tràng","47B - Đại học Kinh tế Quốc dân - Kiêu Kỵ","48 - Bến xe Nước Ngầm - Chương Dương - Phúc Lợi (Long Biên)","49 - Trần Khánh Dư - Nhổn","50 - Long Biên - Khu đô thị Vân Canh","51 - Trần Khánh Dư - Trần Vỹ (Học vện Tư Pháp)","52A - Công viên Thống nhất - Lệ Chi","52B - Công viên Thống Nhất - Đặng Xá","53A - Hoàng Quốc Việt - Đông Anh","53B - Bến xe Mỹ Đình - Kim Hoa (Mê Linh)","54 - Long Biên - Bắc Ninh","55A - Khu đô thị Times City - Cầu Giấy","55B - TTTM Aeon Mall - Cầu Giấy","56A - Bến xe Nam Thăng Long - Núi Đôi","56B - Học viện Phật Giáo VN - Xuân Giang - Bắc Phú - Học viện Phật Giáo VN","57 - Nam Thăng Long - Khu công nghiệp Phú Nghĩa","58 - Long Biên - Thạch Đà","59 - TT Đông Anh - Học viện Nông nghiệp Việt Nam","60A - KĐT Pháp Vân, Tứ Hiệp - Công Viên Nước Hồ Tây","60B - Bến xe Nước Ngầm - BV Bệnh nhiệt đới TƯ (CS2)","61 - Vân Hà (Đông Anh) - CV Cầu Giấy","62 - Bến xe Yên Nghĩa - Bến xe Thường Tín","63 - Khu công nghiệp Bắc Thăng Long - Tiến Thịnh (Mê Linh)","64 - BX Mỹ Đình - Phố Nỉ - TTTM Bình An","65 - Thụy Lâm (Đông Anh) - Long Biên (ĐCT Long Biên)","68 - Hà Đông - Sân bay Nội Bài","72 - Bến xe Yên Nghĩa - Xuân Mai","74 - Bến xe Mỹ Đình - Xuân Khanh","84 - Cầu Diễn - Khu đô thị Linh Đàm","85 - Công viên Nghĩa Đô - Khu đô thị Thanh Hà","86 - Ga Hà Nội - Sân bay Nội Bài","86CT - Ga Hà Nội - Sân Bay Nội Bài","87 - Bến xe Mỹ Đình - Quốc Oai - Xuân Mai","88 - Bến xe Mỹ Đình - Hòa Lạc - Xuân Mai","89 - Bến xe Yên Nghĩa - Thạch Thất - Bến xe Sơn Tây","90 - Hào Nam - Cầu Nhật Tân - Sân bay Nội Bài","91 - Bến xe Yên Nghĩa - Kim Bài - Phú Túc","92 - Nhổn - Sơn Tây - Tây Đằng","93 - Nam Thăng Long - Bắc Sơn (Sóc Sơn)","94 - Bến xe Giáp Bát - Kim Bài","95 - Nam Thăng Long - Xuân Hòa","96 - Công viên Nghĩa Đô - Đông Anh","97 - Hoài Đức - Công viên Nghĩa Đô","98 - Yên Phụ - Gia Thụy - Aeon Mall Long Biên","99 - Kim Mã - Ngũ Hiệp (Thanh Trì)","BRT01 - Bến xe Yên Nghĩa - Kim Mã"];
const columns = [{
        title: "Thời gian hoạt động",
        dataIndex: "optime",
        key:"optime",
    },{
        title: "T2-T6",
        dataIndex: "t26",
        key:"t26",
    },
    {
        title: "T7",
        dataIndex: "t7",
        key:"t7",
    },
    {
        title: "CN",
        dataIndex: "cn",
        key:"cn",
    }
    ]
class SearchField extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            option:[],
            value:'',
            display: false,
            title:'',
            content:'',
        }
    }
    onSearch = (searchText)=>{
        let option = [];
        if (!searchText) {
            option = []
        }else{
            for (let data of bus){
                if (data.includes(searchText)) {
                    option.push({value:data});
                }
            }
        }
        this.setState({
            option: option,
            value:searchText
        })
    }
    onSelect = (data)=>{
        this.setState({
            option:[],
            value:data,
        })
    }

    addPolyLine = (data, color)=>{
        const lineSeries = new IgrGeographicPolylineSeries ( { name: "lineSeries" });
        lineSeries.dataSource = [{points:[data]}];
        lineSeries.shapeMemberPath = "points";
        lineSeries.shapeFilterResolution = 2.0;
        lineSeries.shapeStrokeThickness = 3;
        lineSeries.shapeStroke = color;

        this.props.geoMap.series.add(lineSeries);
    }

    addSymbols = (data,color)=>{
        const symbolSeries = new IgrGeographicSymbolSeries ( { name: "symbolSeries" });
        symbolSeries.dataSource = data;
        symbolSeries.markerType = MarkerType.Circle;
        symbolSeries.latitudeMemberPath = "lat";
        symbolSeries.longitudeMemberPath = "lon";
        symbolSeries.markerBrush  = "White";
        symbolSeries.markerOutline = color;
        symbolSeries.tooltipTemplate = this.createTooltip;
        // console.log(symbolSeries);
        this.props.geoMap.series.add(symbolSeries);
    }

    createTooltip(context) {
        const dataContext = context.dataContext;
        if (!dataContext) return null;

        const dataItem = dataContext.item;
        if (!dataItem) return null;

        const brush = dataContext.series.markerOutline;
        const seriesStyle = { color: brush};

        return <div>
            <div className="tooltipTitle" style={seriesStyle}>{dataItem.name}</div>
            <div className="tooltipBox">
                <div className="tooltipRow">
                    <div className="tooltipLbl">FleetOver:</div>
                    <div className="tooltipVal">{dataItem.fleetover}</div>
                </div>
            </div>
        </div>
    }

    searchBusInfo = (value)=>{
        if (bus.includes(value)){
            this.props.geoMap.series.clear();
            axios.get('http://localhost:3010/api/bus',{
                params:{
                    code:value.toString().split('-')[0].trim()
                }
            }).then(res=>{
                let goRoutePoints = [];
                let reRoutePoints = [];
                let goStation =[];
                let reStation=[];
                let minLat=200,maxLat=0,minLon=200,maxLon=0;
                let bus_info = res.data.bus_info;
                let goGeo = JSON.parse(res.data.go_route.st_asgeojson);
                let reGeo = JSON.parse(res.data.re_route.st_asgeojson);
                for (let point of goGeo.coordinates){
                    let lat = point[1];
                    let lon = point[0];
                    if (lat>maxLat){
                        maxLat = lat;
                    }
                    if (lat<minLat){
                        minLat = lat;
                    }
                    if (lon>maxLon){
                        maxLon =lon;
                    }
                    if (lon<minLon){
                        minLon = lon;
                    }
                    goRoutePoints.push({
                        x:point[0],
                        y:point[1]
                    })
                }
                for (let point of reGeo.coordinates){
                    let lat = point[1];
                    let lon = point[0];
                    if (lat>maxLat){
                        maxLat = lat;
                    }
                    if (lat<minLat){
                        minLat = lat;
                    }
                    if (lon>maxLon){
                        maxLon =lon;
                    }
                    if (lon<minLon){
                        minLon = lon;
                    }
                    reRoutePoints.push({
                        x:point[0],
                        y:point[1]
                    })
                }
                for (let station of res.data.go_station){
                    let geo = JSON.parse(station.st_asgeojson);
                    let lon = geo.coordinates[0];
                    let lat = geo.coordinates[1];
                    goStation.push({
                        lon:lon,
                        lat:lat,
                        name: station.name,
                        fleetover: station.fleetover,
                    })
                }
                for (let station of res.data.re_station){
                    let geo = JSON.parse(station.st_asgeojson);
                    let lon = geo.coordinates[0];
                    let lat = geo.coordinates[1];
                    reStation.push({
                        lon:lon,
                        lat:lat,
                        name: station.name,
                        fleetover: station.fleetover,
                    })
                }
                console.log(res.data.bus_info);
                let optime = bus_info.operations_time;
                let op = optime.split('###');
                let t1 = op[0].split(';');
                let t2 = op[1].split(';');
                let tmp1 = [];
                let tmp2=[];
                for (let i=0;i<3;i++){
                    tmp1.push(t1[i].split('|')[2]);
                    tmp2.push(t2[i].split('|')[2]);
                }
                console.log(t1);
                let dataSource =[];
                dataSource.push({
                    key:0,
                    optime:bus_info.first_station,
                    t26:tmp1[0].split(',')[0]+' - '+tmp1[0].split(',')[1],
                    t7:tmp1[1].split(',')[0]+' - '+tmp1[1].split(',')[1],
                    cn:tmp1[2].split(',')[0]+' - '+tmp1[2].split(',')[1],
                },{
                        key:1,
                        optime:bus_info.last_station,
                        t26:tmp2[0].split(',')[0]+' - '+tmp2[0].split(',')[1],
                        t7:tmp2[1].split(',')[0]+' - '+tmp2[1].split(',')[1],
                        cn:tmp2[2].split(',')[0]+' - '+tmp2[2].split(',')[1],
                    }
                    )
                this.setState({
                    display:true,
                    title: "Tuyến " + value,
                    content:(
                        <div>
                            <p><b>Doanh nghiệp: </b>{bus_info.entreprise}</p>
                            <p><b>Tên tuyến: </b>{bus_info.first_station+" - " + bus_info.last_station}</p>
                            {bus_info.bus_count.toString().length>0?(
                                <p><b>Số xe vận hành: </b>{bus_info.bus_count}</p>
                            ):""}
                            <Table columns={columns} dataSource={dataSource} pagination={false} bordered={true}/>
                            <p><b>Tần suất: </b>{bus_info.frequency}</p>
                            <p><b>Giá vé: </b>{bus_info.cost+' VNĐ/lượt'}</p>
                            <p><b>Chiều đi: </b>{bus_info.go_route_string}</p>
                            <p><b>Chiều về: </b>{bus_info.re_route_string}</p>
                        </div>
                    )
                })
                this.addPolyLine(goRoutePoints,"rgba(3, 121, 231, 0.9)");
                this.addPolyLine(reRoutePoints,"rgba(252,32,32,0.9)");
                this.addSymbols(goStation,"rgba(3, 121, 231, 0.9)");
                this.addSymbols(reStation,"rgba(252,32,32,0.9)");
                this.props.geoMap.zoomToGeographic({left:maxLon,top:minLat,width:maxLon-minLon,height:maxLat-minLat});
                this.setState({
                    value:""
                })
            }).catch(error=>{
                console.log(error.response.data);
            })
        }else{
            message.error('Please select one bus');
        }
    }
    render() {
        return(
            <div>
                <AutoComplete
                    options = {this.state.option}
                    style = {{
                        width: '100%'
                    }}
                    onSearch = {this.onSearch}
                    onSelect={this.onSelect}
                    value = {this.state.value}
                >
                    <Search
                        placeholder="Nhập tên tuyến"
                        enterButton="Tìm kiếm"
                        onSearch={this.searchBusInfo}
                    />
                </AutoComplete>
                {this.state.display?(
                    <Card title={this.state.title} bordered={false} style={{textAlign:"left"}}>
                        {this.state.content}
                    </Card>
                ):("")}
            </div>
        )
    }
}

function mapStatesToProps(state) {
    return {
        geoMap: state.geomap,
    };
}

export default connect(mapStatesToProps)(SearchField);