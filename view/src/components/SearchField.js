import React from 'react';
import { Input, AutoComplete } from 'antd';
import axios from 'axios';
import {connect} from 'react-redux'
const {Search} = Input;

const bus = ["01 - Bến xe Gia Lâm - Bến xe Yên Nghĩa","02 - Bác Cổ - Bến xe Yên Nghĩa","03A - Bến xe Giáp Bát - Bến xe Gia Lâm","03B - Bến xe Nước Ngầm - Giang Biên (Long Biên)","04 - Long Biên - Bệnh viện Nội tiết trung ương cơ sở 2","05 - KĐT Linh Đàm 4 - Phú Diễn","06A - Bến xe Giáp Bát - Cầu Giẽ","06B - Bến xe Giáp Bát - Hồng Vân","06C - Bến xe Giáp Bát - Phú Minh","06D - Bến xe Giáp Bát - Tân Dân","06E - Bến xe Giáp Bát - Phú Túc","07 - Cầu Giấy - Nội Bài","08A - Long Biên - Đông Mỹ","08ACT - Long Biên - Đông Mỹ","08B - Long Biên - Vạn Phúc","08BCT - Long Biên - Vạn Phúc","09A - Bờ Hồ - Cầu Giấy - Khu Liên cơ quan Sở ngành HN","09ACT - Trần Khánh Dư - Khu liên cơ quan Sở ngành HN","09B - Bờ Hồ - Công viên Thống Nhất - Bến xe Mỹ Đình","09BCT - Trần Khánh Dư - Bến xe Mỹ Đình","100 - Long Biên - Khu đô thị Đặng Xá","101A - Bến xe Giáp Bát - Vân Đình","101B - Bến xe Giáp Bát - Đại Cường (Ứng Hòa)","102 - Bến xe Yên Nghĩa - Vân Đình","103A - Bến xe Mỹ Đình - Hương Sơn","103B - Bến xe Mỹ Đình - Hồng Quang - Hương Sơn","104 - Mỹ Đình - BX Nước Ngầm","105 - Đô Nghĩa - Cầu Giấy","106 - KĐT Mỗ Lao - TTTM Aeon Mall Long Biên","107 - Kim Mã - Làng văn hóa du lịch các dân tộc VN","108 - Bến xe Thường Tín - Minh Tân","109 - Mỹ Đình - Nội Bài","10A - Long Biên - Từ Sơn","10B - Long Biên - Trung Mầu","11 - Công viên Thống Nhất - Học Viện Nông Nghiệp","110 - BX Sơn Tây - Vườn Quốc gia Ba Vì - Đá Chông","111 - BX Sơn Tây - Bất Bạt","112 - Nam Thăng Long - Thạch Đà (Mê Linh)","113 - Đại Thắng (Phú Xuyên) - Bến đò Vườn Chuối","12 - Công viên Nghĩa Đô - Đại Áng","13 - CV nước Hồ Tây - Cổ Nhuế (HVCS)","14 - Bờ Hồ - Cổ Nhuế","14CT - Trần Khánh Dư - Cổ Nhuế","15 - Bến xe Gia Lâm - Phố Nỉ","16 - Bến xe Mỹ Đình - Bến xe Nước Ngầm","17 - Long Biên - Nội Bài","18 - ĐH Kinh tế QD - ĐH Kinh tế QD","19 - Trần Khánh Dư - KĐT Vinhomes Thăng Long","20A - Cầu Giấy - Bến xe Sơn Tây","20B - Nhổn - Bến xe Sơn Tây","21A - Bến xe Giáp Bát - Bến xe Yên Nghĩa","21B - Khu đô thị Pháp Vân - Bến xe Mỹ Đình","22A - Bến xe Gia Lâm - KĐT Trung Văn","22B - BX Mỹ Đình - KĐT Kiến Hưng","22C - Bến xe Giáp Bát - Khu đô thị Dương Nội","23 - Nguyễn Công Trứ - Nguyễn Công Trứ","24 - Long Biên - Cầu Giấy","25 - BV Nhiệt đới TW Cơ sở 2 - Bến xe Giáp Bát","26 - Mai Động - SVĐ Quốc gia","27 - Bến xe Yên Nghĩa - Bến xe Nam Thăng Long","28 - BX Nước Ngầm - Đông Ngạc - Đại học Mỏ","29 - BX Giáp Bát - Tân Lập","31 - Bách Khoa - Chèm (ĐH Mỏ)","32 - Bến xe Giáp Bát - Nhổn","33 - Cụm Công nghiệp Thanh Oai - Xuân Đỉnh","34 - Bến xe Mỹ Đình - Bến xe Gia Lâm","35A - Trần Khánh Dư - Nam Thăng Long","35B - Nam Thăng Long - Thanh Lâm","36 - Yên Phụ - Khu đô thị Linh Đàm","36CT - Yên Phụ - Khu đô thị Linh Đàm","37 - Bến xe Giáp Bát - Chương Mỹ","38 - BX Nam Thăng Long - Mai Động","39 - Công viên Nghĩa Đô - Bệnh viện Nội tiết TW CS II","40 - Công viên Thống Nhất - Văn Lâm","41 - Nghi Tàm - BX Giáp Bát","42 - Giáp Bát - Đức Giang","43 - Công viên Thống Nhất - Thị trấn Đông Anh","44 - Trần Khánh Dư - BX Mỹ Đình","45 - Time City - Bến xe Nam Thăng Long","46 - Bến xe Mỹ Đình - Thị trấn Đông Anh","47A - Long Biên - Bát Tràng","47B - Đại học Kinh tế Quốc dân - Kiêu Kỵ","48 - Bến xe Nước Ngầm - Chương Dương - Phúc Lợi (Long Biên)","49 - Trần Khánh Dư - Nhổn","50 - Long Biên - Khu đô thị Vân Canh","51 - Trần Khánh Dư - Trần Vỹ (Học vện Tư Pháp)","52A - Công viên Thống nhất - Lệ Chi","52B - Công viên Thống Nhất - Đặng Xá","53A - Hoàng Quốc Việt - Đông Anh","53B - Bến xe Mỹ Đình - Kim Hoa (Mê Linh)","54 - Long Biên - Bắc Ninh","55A - Khu đô thị Times City - Cầu Giấy","55B - TTTM Aeon Mall - Cầu Giấy","56A - Bến xe Nam Thăng Long - Núi Đôi","56B - Học viện Phật Giáo VN - Xuân Giang - Bắc Phú - Học viện Phật Giáo VN","57 - Nam Thăng Long - Khu công nghiệp Phú Nghĩa","58 - Long Biên - Thạch Đà","59 - TT Đông Anh - Học viện Nông nghiệp Việt Nam","60A - KĐT Pháp Vân, Tứ Hiệp - Công Viên Nước Hồ Tây","60B - Bến xe Nước Ngầm - BV Bệnh nhiệt đới TƯ (CS2)","61 - Vân Hà (Đông Anh) - CV Cầu Giấy","62 - Bến xe Yên Nghĩa - Bến xe Thường Tín","63 - Khu công nghiệp Bắc Thăng Long - Tiến Thịnh (Mê Linh)","64 - BX Mỹ Đình - Phố Nỉ - TTTM Bình An","65 - Thụy Lâm (Đông Anh) - Long Biên (ĐCT Long Biên)","68 - Hà Đông - Sân bay Nội Bài","72 - Bến xe Yên Nghĩa - Xuân Mai","74 - Bến xe Mỹ Đình - Xuân Khanh","84 - Cầu Diễn - Khu đô thị Linh Đàm","85 - Công viên Nghĩa Đô - Khu đô thị Thanh Hà","86 - Ga Hà Nội - Sân bay Nội Bài","86CT - Ga Hà Nội - Sân Bay Nội Bài","87 - Bến xe Mỹ Đình - Quốc Oai - Xuân Mai","88 - Bến xe Mỹ Đình - Hòa Lạc - Xuân Mai","89 - Bến xe Yên Nghĩa - Thạch Thất - Bến xe Sơn Tây","90 - Hào Nam - Cầu Nhật Tân - Sân bay Nội Bài","91 - Bến xe Yên Nghĩa - Kim Bài - Phú Túc","92 - Nhổn - Sơn Tây - Tây Đằng","93 - Nam Thăng Long - Bắc Sơn (Sóc Sơn)","94 - Bến xe Giáp Bát - Kim Bài","95 - Nam Thăng Long - Xuân Hòa","96 - Công viên Nghĩa Đô - Đông Anh","97 - Hoài Đức - Công viên Nghĩa Đô","98 - Yên Phụ - Gia Thụy - Aeon Mall Long Biên","99 - Kim Mã - Ngũ Hiệp (Thanh Trì)","BRT01 - Bến xe Yên Nghĩa - Kim Mã"];
class SearchField extends React.Component{
    constructor() {
        super();
        this.state = {
            option:[],
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
            option: option
        })
    }
    onSelect = (data)=>{
        this.setState({
            option:[]
        })
    }
    searchBusInfo = (value)=>{
        console.log(this.props.polyline);
        this.props.dispatch({type:'SET_POLYLINE'});
    }
    render() {
        return(
            <AutoComplete
                options = {this.state.option}
                style = {{
                    width: '100%'
                }}
                onSearch = {this.onSearch}
                onSelect={this.onSelect}
            >
                <Search
                    placeholder="Input bus name"
                    enterButton="Search"
                    size="large"
                    onSearch={this.searchBusInfo}
                />
            </AutoComplete>
        )
    }
}

function mapStatesToProps(state) {
    return {
        polyline: state.polyline,
    };
}

export default connect(mapStatesToProps)(SearchField);