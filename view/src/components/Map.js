import React from 'react';
import {connect} from 'react-redux'
import { IgrGeographicMap } from 'igniteui-react-maps';
import { IgrGeographicPolylineSeries } from 'igniteui-react-maps';
import { IgrShapeDataSource } from 'igniteui-react-core';
import { IgrBingMapsMapImagery } from 'igniteui-react-maps';
import { BingMapsImageryStyle } from 'igniteui-react-maps';

const tileSource = new IgrBingMapsMapImagery();
tileSource.apiKey = "Ahy_wuZ5zZKMSEvsqRE5vSgt7cd_DhRvcatvz0m241PNmTGGuSfSSTL3YDZfIuyG";
tileSource.imageryStyle = BingMapsImageryStyle.Road;
tileSource.cultureName="Vietnam"
// const geoMap = new IgrGeographicMap({ name: "geoMap", width: "100%", height: "100%", zoomable:true});
// geoMap.backgroundContent = tileSource;

class Map extends React.Component{
    constructor() {
        super();
        this.state = {
            polyline: {
                "location": [[105.878495,21.048159],[-122.12901, 47.64226]],
                "option": { strokeColor: 'red', strokeThickness: 10, strokeDashArray: [1, 2, 5, 10] }
            }
        }
    }

    mapZoom = (geoMap)=>{
        this.props.dispatch({type:'SET_GEO_MAP', geomap:geoMap});
        geoMap.zoomToGeographic({top: 21.055619, left: 105.767652,height:0.077513, width:0.174352});
    }

    render() {
        //return this.geoMap;
        return (
            <IgrGeographicMap
                ref = {this.mapZoom}
                width={"100%"}
                height={"100%"}
                zoomable="true"
                backgroundContent={tileSource}
            />
        );
    }
}

// function mapStatesToProps(state) {
//     return {
//         polyline: state.polyline
//     }
// }
//
export default connect()(Map);
//export default Map;