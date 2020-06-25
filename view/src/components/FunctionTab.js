import React from 'react';
import {Tabs} from 'antd';
import FindPath from "./FindPath";
import SearchField from "./SearchField";
import {connect} from "react-redux";
const {TabPane} = Tabs;

class FunctionTab extends React.Component{
    constructor(props){
        super(props);
    }

    onChange = (activeKey)=>{
        this.props.geoMap.series.clear();
    }
    render() {
        return(
            <Tabs defaultActiveKey="1" onChange={this.onChange}>
                <TabPane tab = "Tra cứu" key="1">
                    <SearchField/>
                </TabPane>
                <TabPane tab = "Tìm đường" key="2">
                    <FindPath/>
                </TabPane>
            </Tabs>
        )
    }
}

function mapStateToProps(state){
    return{
        geoMap:state.geomap,
    }
}
export default connect(mapStateToProps)(FunctionTab);