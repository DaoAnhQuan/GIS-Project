import React from 'react';
import ReactBingmaps from "./ReactBingmaps";
import {connect} from 'react-redux'

class Map extends React.Component{
    constructor() {
        super();

        this.state = {
            polyline: {
                "location": [[105.878495,21.048159],[105.878230599,21.048649388],[105.87802866,21.048664283]],
                "option": { strokeColor: 'red', strokeThickness: 10, strokeDashArray: [1, 2, 5, 10] }
            }
        }
    }
    render() {
        return(
            <ReactBingmaps
                bingmapKey = "Ahy_wuZ5zZKMSEvsqRE5vSgt7cd_DhRvcatvz0m241PNmTGGuSfSSTL3YDZfIuyG"
                polyline = {this.state.polyline}
            >
            </ReactBingmaps>
        )
    }
}

// function mapStatesToProps(state) {
//     return {
//         polyline: state.polyline
//     }
// }
//
// export default connect(mapStatesToProps)(Map);
export default Map;