import React, { Component } from 'react';
import classSet from 'classnames';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';

var map = {},
    Microsoft,
    infobox = {},
    scriptURL = "https://www.bing.com/api/maps/mapcontrol?callback=bingmapsCallback",
    pendingProps = [];

class ReactBingmaps extends Component {
    constructor(props) {
        super(props);
        if(document.querySelector('script[src="' +scriptURL+ '"]') === null){
            this.loadScript(scriptURL);
            window.bingmapsCallback = function(){
                Microsoft = window.Microsoft;
                this.afterDependencyLoad(pendingProps);
            }.bind(this);
        }
    }
    componentDidMount(){
        if(Microsoft === null || Microsoft === undefined){
            pendingProps.push(this.props);
        }
        else{
            this.reactBingmaps(this.props, Microsoft);
        }
    }
    afterDependencyLoad(pendingProps){
        try{
            pendingProps.map((props) => this.reactBingmaps(props, Microsoft));
        }
        catch(exception){
            console.log("Error loading Microsoft bingmaps");
        }
    }
    componentWillUnmount(){
        try{
            let mapReference = this.props.id ? ('#' + this.props.id) : '.react-bingmaps';
            if(map[mapReference])
                //map[mapReference].dispose();

                map[mapReference] = undefined;
            infobox = {};
            pendingProps = [];
        }
        catch(exception){
            console.log(exception);
        }
    }
    loadScript(url){
        var script = document.createElement("script")
        script.type = "text/javascript";
        script.async = true;
        script.defer = true;
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    componentWillReceiveProps(nextProps){
        let mapReference = nextProps.id ? ('#' + nextProps.id) : '.react-bingmaps';
        if(this.props.center !== nextProps.center){
            this.setMapCenter(nextProps.center, mapReference);
        }
        if(this.props.zoom !== nextProps.zoom){
            this.setMapZoom(nextProps.zoom, mapReference);
        }
        if(this.props.mapTypeId !== nextProps.mapTypeId){
            this.setMapTypeId(nextProps.mapTypeId, nextProps.center, nextProps.heading, mapReference);
        }
        if(this.props.navigationBarMode !== nextProps.navigationBarMode){
            this.setMapNavigationBarMode(nextProps.navigationBarMode, mapReference);
        }
        if(this.props.supportedMapTypes !== nextProps.supportedMapTypes){
            this.setMapSupportedMapTypes(nextProps.supportedMapTypes, mapReference);
        }
        if(this.props.disableStreetside !== nextProps.disableStreetside){
            this.setDisableStreetside(nextProps.disableStreetside, mapReference);
        }
        if(this.props.pushPins !== nextProps.pushPins){
            this.setPushPins(nextProps.pushPins, mapReference);
        }
        if(this.props.infoboxes !== nextProps.infoboxes){
            this.setInfoboxes(nextProps.infoboxes, "infoboxes", mapReference);
        }
        if(this.props.infoboxesWithPushPins !== nextProps.infoboxesWithPushPins){
            this.setInfoboxesWithPushPins(nextProps.infoboxesWithPushPins, "infoboxesWithPushPins", mapReference);
        }
        if(this.props.regularPolygons !== nextProps.regularPolygons){
            this.createRegularPolygons(nextProps.regularPolygons, mapReference);
        }
        if(this.props.irregularPolygons !== nextProps.irregularPolygons){
            this.setBoundary(nextProps.irregularPolygons, mapReference);
        }
        if(this.props.boundary !== nextProps.boundary){
            this.setBoundary(nextProps.boundary, mapReference);
        }

    }
    reactBingmaps(props,  Microsoft){
        const {
            bingmapKey,
            center,
            mapTypeId,
            zoom,
            navigationBarMode,
            supportedMapTypes,
            heading,
            pushPins,
            disableStreetside,
            infoboxes,
            infoboxesWithPushPins,
            getLocation,
            regularPolygons,
            irregularPolygons,
            boundary
        } = props;
        if(bingmapKey && Microsoft){
            let mapReference = props.id ? ('#' + props.id) : '.react-bingmaps';
            if(!map[mapReference]){
                map[mapReference] = new Microsoft.Maps.Map(mapReference, {
                    credentials: bingmapKey
                });
            }
            this.setMapCenter(center, mapReference);
            this.setMapTypeId(mapTypeId, center, heading, mapReference);
            this.setMapZoom(zoom, mapReference);
            this.setMapNavigationBarMode(navigationBarMode, mapReference);
            this.setMapSupportedMapTypes(supportedMapTypes, mapReference);
            this.setDisableStreetside(disableStreetside, mapReference);
            this.setPushPins(pushPins, mapReference);
            this.setInfoboxes(infoboxes, "infoboxes", mapReference);
            this.setInfoboxesWithPushPins(infoboxesWithPushPins, "infoboxesWithPushPins", mapReference);
            this.setGetLocation(getLocation, mapReference);
            this.createRegularPolygons(regularPolygons, mapReference);
            this.createIrregularPolygons(irregularPolygons, mapReference);
            this.setBoundary(boundary, mapReference);
        }
    }
    setMapCenter(center, mapReference){
        if(map[mapReference] && center && center[0] && center[1]){
            map[mapReference].setView({
                center: new Microsoft.Maps.Location(center[0], center[1])
            });
        }
    }
    setMapTypeId(mapTypeId, center, heading, mapReference){
        if(map[mapReference] && mapTypeId){
            let isBirdEyeAvailable = false;
            if(mapTypeId === "birdseye" && center && center[0] && center[1]){
                let location = new Microsoft.Maps.Location(center[0], center[1]);
                Microsoft.Maps.getIsBirdseyeAvailable(location, Microsoft.Maps.Heading[heading], (onResponse => { isBirdEyeAvailable = onResponse; }));
            }
            if(mapTypeId){
                map[mapReference].setView({
                    mapTypeId: isBirdEyeAvailable ? Microsoft.Maps.MapTypeId.birdseye : Microsoft.Maps.MapTypeId[mapTypeId]
                });
            }
        }
    }
    setMapZoom(zoom, mapReference){
        if(map[mapReference] && zoom){
            map[mapReference].setView({
                zoom: zoom
            });
        }
    }
    setMapNavigationBarMode(navigationBarMode, mapReference){
        if(map[mapReference] && navigationBarMode){
            map[mapReference].setView({
                navigationBarMode: navigationBarMode
            });
        }
    }
    setMapSupportedMapTypes(supportedMapTypes, mapReference){
        if(map[mapReference] && supportedMapTypes){
            map[mapReference].setView({
                supportedMapTypes: supportedMapTypes.map((id) => Microsoft.Maps.MapTypeId[id])
            });
        }
    }
    setDisableStreetside(disableStreetside, mapReference){
        if(map[mapReference] && disableStreetside){
            map[mapReference].setView({
                disableStreetside: disableStreetside
            });
        }
    }
    setPushPins(pushPins, mapReference){
        if(map[mapReference] && pushPins){
            for (var i = map[mapReference].entities.getLength() - 1; i >= 0; i--) {
                var pushpin = map[mapReference].entities.get(i);
                if (pushpin instanceof Microsoft.Maps.Pushpin) {
                    map[mapReference].entities.removeAt(i);
                }
            }
            for(var pushPinIndex = 0; pushPinIndex < pushPins.length; pushPinIndex++){
                if(pushPins[pushPinIndex].location && pushPins[pushPinIndex].location[0] && pushPins[pushPinIndex].location[1]) {
                    let location =  new Microsoft.Maps.Location(pushPins[pushPinIndex].location[0], pushPins[pushPinIndex].location[1]);
                    let option = pushPins[pushPinIndex].option ? pushPins[pushPinIndex].option : null
                    if(option && option.anchor && option.anchor[0] && option.anchor[1]){
                        option.anchor = new Microsoft.Maps.Point(option.anchor[0], option.anchor[1])
                    }
                    let pushpin = new Microsoft.Maps.Pushpin(location, option);
                    map[mapReference].entities.push(pushpin);
                    if(pushPins[pushPinIndex].addHandler){
                        Microsoft.Maps.Events.addHandler(pushpin, pushPins[pushPinIndex].addHandler.type,
                            function (callback, data) { this.MakeCallback(callback, data) }.bind(this, pushPins[pushPinIndex].addHandler.callback, pushPins[pushPinIndex].addHandler.callbackData));
                    }
                }
            }
        }
    }
    setInfoboxes(infoboxes, infoboxCreateType, mapReference){
        if(map[mapReference] && infoboxes){
            for (var i = 0; infobox[infoboxCreateType] && i < infobox[infoboxCreateType].length ; i++) {
                infobox[infoboxCreateType][i].setMap(null);
            }
            infobox[infoboxCreateType] = [];
            if(infoboxes){
                for(var infoboxIndex = 0; infoboxIndex < infoboxes.length; infoboxIndex++){
                    if(infoboxes[infoboxIndex].location && infoboxes[infoboxIndex].location[0] && infoboxes[infoboxIndex].location[1]) {
                        let location =  new Microsoft.Maps.Location(infoboxes[infoboxIndex].location[0], infoboxes[infoboxIndex].location[1]);
                        let option = infoboxes[infoboxIndex] ? infoboxes[infoboxIndex].option : null;
                        if(option.htmlContent){
                            option.htmlContent = ReactDOMServer.renderToStaticMarkup(option.htmlContent);
                        }
                        infobox[infoboxCreateType].push(new Microsoft.Maps.Infobox(location, option));
                        infobox[infoboxCreateType][infoboxIndex].setMap(map[mapReference]);
                        if(infoboxes[infoboxIndex].addHandler){
                            Microsoft.Maps.Events.addHandler(infobox[infoboxCreateType][infoboxIndex], infoboxes[infoboxIndex].addHandler.type,
                                function (callback, data) { this.MakeCallback(callback, data) }.bind(this, infoboxes[infoboxIndex].addHandler.callback, infoboxes[infoboxIndex].addHandler.callbackData));
                        }
                    }
                }
            }
        }
    }
    setInfoboxesWithPushPins(infoboxesWithPushPins, infoboxCreateType, mapReference){
        if(map[mapReference] && infoboxesWithPushPins){
            //Remove existing Infoboxes
            var i;
            for (i = 0; infobox[infoboxCreateType] && i < infobox[infoboxCreateType].length ; i++) {
                infobox[infoboxCreateType][i].setMap(null);
            }

            //Remove existing Pushpins
            for (i = map[mapReference].entities.getLength() - 1; i >= 0; i--) {
                var pushpin = map[mapReference].entities.get(i);
                if (pushpin instanceof Microsoft.Maps.Pushpin) {
                    map[mapReference].entities.removeAt(i);
                }
            }

            infobox[infoboxCreateType] = [];

            //Add Infoboxes with Pushpins
            if(infoboxesWithPushPins){
                for(var infoboxWithPushPinIndex = 0; infoboxWithPushPinIndex < infoboxesWithPushPins.length; infoboxWithPushPinIndex++){
                    if(infoboxesWithPushPins[infoboxWithPushPinIndex].location){
                        //Set Location
                        let location =  new Microsoft.Maps.Location(infoboxesWithPushPins[infoboxWithPushPinIndex].location[0], infoboxesWithPushPins[infoboxWithPushPinIndex].location[1]);

                        //Set Infobox Option
                        let infoboxOption = infoboxesWithPushPins[infoboxWithPushPinIndex].infoboxOption ? infoboxesWithPushPins[infoboxWithPushPinIndex].infoboxOption : null

                        //ConvertToHtml if Obj
                        if(infoboxOption.htmlContent){
                            infoboxOption.htmlContent = ReactDOMServer.renderToStaticMarkup(infoboxOption.htmlContent);
                        }

                        //If Handler added, initially hide Infobox
                        if(infoboxesWithPushPins[infoboxWithPushPinIndex].addHandler){
                            infoboxOption["visible"] = false;
                        }

                        //Set Pushpin Option
                        let pushPinOption = infoboxesWithPushPins[infoboxWithPushPinIndex].pushPinOption ? infoboxesWithPushPins[infoboxWithPushPinIndex].pushPinOption : null

                        //Initilize if anchor for Pushpin
                        if(pushPinOption.anchor && pushPinOption.anchor[0] && pushPinOption.anchor[1]){
                            pushPinOption.anchor = new Microsoft.Maps.Point(pushPinOption.anchor[0], pushPinOption.anchor[1])
                        }

                        //Set Infobox
                        infobox[infoboxCreateType].push(new Microsoft.Maps.Infobox(location, infoboxOption));
                        infobox[infoboxCreateType][infoboxWithPushPinIndex].setMap(map[mapReference]);

                        //Set Infobox Callback if any
                        if(infoboxesWithPushPins[infoboxWithPushPinIndex].infoboxAddHandler){
                            Microsoft.Maps.Events.addHandler(infobox[infoboxCreateType][infoboxWithPushPinIndex], infoboxesWithPushPins[infoboxWithPushPinIndex].infoboxAddHandler.type,
                                function (callback, data) { this.MakeCallback(callback, data) }.bind(this, infoboxesWithPushPins[infoboxWithPushPinIndex].infoboxAddHandler.callback, infoboxesWithPushPins[infoboxWithPushPinIndex].infoboxAddHandler.callbackData));
                        }

                        //Set Pushpin
                        let pushpin = new Microsoft.Maps.Pushpin(location, pushPinOption);
                        map[mapReference].entities.push(pushpin);

                        //Set Pushpin Callback if any
                        if(infoboxesWithPushPins[infoboxWithPushPinIndex].pushPinAddHandler){
                            Microsoft.Maps.Events.addHandler(pushpin, infoboxesWithPushPins[infoboxWithPushPinIndex].pushPinAddHandler.type,
                                function (callback, data) { this.MakeCallback(callback, data) }.bind(this, infoboxesWithPushPins[infoboxWithPushPinIndex].pushPinAddHandler.callback, infoboxesWithPushPins[infoboxWithPushPinIndex].pushPinAddHandler.callbackData));
                        }

                        //Set InfoboxesWithPushPins handler if any
                        if(infoboxesWithPushPins[infoboxWithPushPinIndex].addHandler){
                            this.setInfoboxesWithPushPinsHandler(infobox[infoboxCreateType][infoboxWithPushPinIndex], pushpin, infoboxesWithPushPins[infoboxWithPushPinIndex].addHandler);
                        }
                    }
                }
            }
        }
    }
    setGetLocation(getLocation, mapReference){
        if(map[mapReference] && getLocation){
            if(getLocation.addHandler){
                Microsoft.Maps.Events.addHandler(map[mapReference], getLocation.addHandler,
                    function (callback, e) {
                        let point = new Microsoft.Maps.Point(e.getX(), e.getY());
                        let location = e.target.tryPixelToLocation(point);
                        this.MakeCallback(callback, location);
                    }.bind(this, getLocation.callback)
                );
            }
            else{
                Microsoft.Maps.Events.addHandler(map[mapReference], "click",
                    function (callback, e) {
                        let point = new Microsoft.Maps.Point(e.getX(), e.getY());
                        let location = e.target.tryPixelToLocation(point);
                        this.MakeCallback(callback, location);
                    }.bind(this, getLocation.callback)
                );
            }
        }
    }
    setInfoboxesWithPushPinsHandler(infobox, pushpin, addHandler, mapReference){
        if(addHandler === "mouseover"){
            Microsoft.Maps.Events.addHandler(pushpin, addHandler, function () {
                infobox.setOptions({ visible: true });
            });
            Microsoft.Maps.Events.addHandler(pushpin, "mouseout", function () {
                infobox.setOptions({ visible: false });
            });
        }
        else{
            Microsoft.Maps.Events.addHandler(pushpin, addHandler, function () {
                infobox.setOptions({ visible: true });
            });
        }
    }
    MakeCallback(callback, data, mapReference){
        data ? callback(data) : callback();
    }
    createRegularPolygons(regularPolygons, mapReference){
        if(map[mapReference] && regularPolygons){
            for (var i = map[mapReference].entities.getLength() - 1; i >= 0; i--) {
                var regularPolygon = map[mapReference].entities.get(i);
                if (regularPolygon instanceof Microsoft.Maps.Polygon) {
                    map[mapReference].entities.removeAt(i);
                }
            }
            for(let regularPolygonIndex = 0; regularPolygonIndex < regularPolygons.length; regularPolygonIndex++){
                if(regularPolygons[regularPolygonIndex].center &&
                    regularPolygons[regularPolygonIndex].center[0] &&
                    regularPolygons[regularPolygonIndex].center[1])
                {
                    let location =  new Microsoft.Maps.Location(regularPolygons[regularPolygonIndex].center[0], regularPolygons[regularPolygonIndex].center[1]);
                    let radius = regularPolygons[regularPolygonIndex].radius ? regularPolygons[regularPolygonIndex].radius : 0;
                    let points = regularPolygons[regularPolygonIndex].points ? regularPolygons[regularPolygonIndex].points : 0;
                    let option = regularPolygons[regularPolygonIndex].option ? regularPolygons[regularPolygonIndex].option : {};

                    Microsoft.Maps.loadModule('Microsoft.Maps.SpatialMath', function () {
                        var locations = Microsoft.Maps.SpatialMath.getRegularPolygon(location, radius, points, Microsoft.Maps.SpatialMath.DistanceUnits.Miles);
                        var polygon = new Microsoft.Maps.Polygon(locations, option);
                        map[mapReference].entities.push(polygon);
                    });
                }
            }
        }
    }
    createIrregularPolygons(irregularPolygons, mapReference){
        if(map[mapReference] && irregularPolygons){
            for (var i = map[mapReference].entities.getLength() - 1; i >= 0; i--) {
                var irregularPolygon = map[mapReference].entities.get(i);
                if (irregularPolygon instanceof Microsoft.Maps.Polygon) {
                    map[mapReference].entities.removeAt(i);
                }
            }
            for(let irregularPolygonIndex = 0; irregularPolygonIndex < irregularPolygons.length; irregularPolygonIndex++){
                let points = irregularPolygons[irregularPolygonIndex].points ? irregularPolygons[irregularPolygonIndex].points : 0;
                let option = irregularPolygons[irregularPolygonIndex].option ? irregularPolygons[irregularPolygonIndex].option : {};
                var locations = [];
                for(let pointIndex = 0; pointIndex < points.length; pointIndex++) {
                    let point = points[pointIndex].map(String);
                    let latLong = point.join(",");
                    var location = Microsoft.Maps.Location.parseLatLong(latLong);
                    locations.push(location);
                }
                var polygon = new Microsoft.Maps.Polygon(locations, option);
                map[mapReference].entities.push(polygon);
            }
        }
    }
    setBoundary(boundary, mapReference){
        if(map[mapReference] && boundary){

            for (var i = map[mapReference].entities.getLength() - 1; i >= 0; i--) {
                var regularPolygon = map[mapReference].entities.get(i);
                if (regularPolygon instanceof Microsoft.Maps.Polygon) {
                    map[mapReference].entities.removeAt(i);
                }
            }

            // var boundaryLocation;
            // if(boundary.option &&
            // 	boundary.option.entityType &&
            // 		!(boundary.option.entityType.includes("Postcode"))){
            // 	boundaryLocation = new Microsoft.Maps.Location(boundary.location[0], boundary.location[1]);
            // }
            // else{
            // 	boundaryLocation = boundary.location
            // }

            var boundaryLocation = boundary.location ? boundary.location : null;

            var geoDataRequestOptions = boundary.option ? boundary.option : {};
            var polygonStyle = boundary.polygonStyle ? boundary.polygonStyle : null;
            var search = boundary.search ? boundary.search : null;
            if(!search && boundaryLocation){
                Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function () {
                    Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(boundaryLocation, geoDataRequestOptions, map[mapReference], function (data) {
                        if (data.results && data.results.length > 0) {
                            map[mapReference].entities.push(data.results[0].Polygons);
                        }
                    }, polygonStyle, function errCallback(networkStatus, statusMessage) {
                        console.log(networkStatus);
                        console.log(statusMessage);
                    });
                });
            }
            else{
                Microsoft.Maps.loadModule(['Microsoft.Maps.SpatialDataService', 'Microsoft.Maps.Search'], function () {
                    var searchManager = new Microsoft.Maps.Search.SearchManager(map[mapReference]);
                    var geocodeRequest = {
                        where: search,
                        callback: function (geocodeResult) {
                            if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
                                map[mapReference].setView({ bounds: geocodeResult.results[0].bestView });
                                Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(geocodeResult.results[0].location, geoDataRequestOptions, map[mapReference], function (data) {
                                    if (data.results && data.results.length > 0) {
                                        map[mapReference].entities.push(data.results[0].Polygons);
                                    }
                                }, polygonStyle, function errCallback(networkStatus, statusMessage) {
                                    console.log(networkStatus);
                                    console.log(statusMessage);
                                });
                            }
                        },
                    };
                    searchManager.geocode(geocodeRequest);
                });
            }
        }
    }
    render() {
        return(
            <div id = {this.props.id} className = { classSet('react-bingmaps', this.props.className) }>
            </div>
        );
    }
}

export default ReactBingmaps;

ReactBingmaps.propTypes = {
    bingmapKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    center: PropTypes.arrayOf(PropTypes.number),
    mapTypeId: PropTypes.string,
    navigationBarMode: PropTypes.string,
    supportedMapTypes: PropTypes.arrayOf(PropTypes.string),
    heading: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    zoom: PropTypes.number,
    pushPins: PropTypes.arrayOf(
        PropTypes.shape({
            location: PropTypes.arrayOf(PropTypes.number),
            option: PropTypes.object,
            addHandler: PropTypes.shape({
                "type" : PropTypes.string,
                "callback" : PropTypes.func
            })
        })
    ),
    disableStreetside: PropTypes.bool,
    infoboxes: PropTypes.arrayOf(
        PropTypes.shape({
            location: PropTypes.arrayOf(PropTypes.number),
            option: PropTypes.object,
            addHandler: PropTypes.shape({
                "type" : PropTypes.string,
                "callback" : PropTypes.func
            })
        })
    ),
    infoboxesWithPushPins: PropTypes.arrayOf(
        PropTypes.shape({
            location: PropTypes.arrayOf(PropTypes.number),
            addHandler: PropTypes.string,
            infoboxOption: PropTypes.object,
            pushPinOption: PropTypes.object,
            infoboxAddHandler: PropTypes.shape({
                "type" : PropTypes.string,
                "callback" : PropTypes.func
            }),
            pushPinAddHandler: PropTypes.shape({
                "type" : PropTypes.string,
                "callback" : PropTypes.func
            })
        })
    ),
    getLocation: PropTypes.object,
    regularPolygons: PropTypes.arrayOf(
        PropTypes.shape({
            center: PropTypes.arrayOf(PropTypes.number),
            radius: PropTypes.number,
            points: PropTypes.number,
            option: PropTypes.object
        })
    ),
    boundary: PropTypes.shape({
        location: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.string) ]),
        option: PropTypes.object,
        polygonStyle: PropTypes.object,
        search: PropTypes.string,
    })

}
ReactBingmaps.defaultProps = {
    bingmapKey: undefined,
    center: undefined,
    mapTypeId: undefined,
    navigationBarMode: undefined,
    supportedMapTypes: undefined,
    heading: 0,
    pushPins: undefined,
    disableStreetside: true,
    infoboxes: undefined,
    infoboxesWithPushPins: undefined,
    zoom: undefined,
    getLocation: undefined,
    regularPolygons: undefined,
    boundary: undefined
}