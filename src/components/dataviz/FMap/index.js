import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer } from "react-leaflet";
import Choropleth from "react-leaflet-choropleth";
import * as d3 from 'd3';
import { blue, darkGrey, white, orange } from '../../../scss/_vars.scss';
var hp_geojson = require("../../../data/hp_geojson.json");
// console.log(hp_geojson);


const style = {
    fillColor: '#FFFFFF',
    weight: 2,
    opacity: 1,
    color: '#fff',
    fillOpacity: 0.8
}

type State = {
  lat: number,
  lng: number,
  zoom: number,
  tooltipDisplay: string,
  tooltipData: object
};

export default class FMap extends Component<{}, State> {

  constructor(props){
    super(props);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
  }

  state = {
    lat: 31.1048,
    lng: 77.1734,
    zoom: 7,
    tooltipDisplay: "none",
    tooltipData: {}

  };


  highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5
    });

    this.setState({ tooltipDisplay : "block"})
    this.setState({ tooltipData: {
      dataPointToMap: e.target.options.data.properties[this.props.dataPointToMap],
      districtName: e.target.options.data.properties.NAME_2
    }})

  }

  resetHighlight(e) {
    var layer = e.target;
    layer.setStyle({
      weight: 2
    });

    this.setState({
      tooltipDisplay : "none"
    })

    this.setState({
      tooltipDisplay : "none"
    })
  }

// style={feature => feature.properties.gross ? showStyle : hideStyle}
  render() {
    // const position = [this.state.lat, this.state.lng];
    const position = [31.1048, 77.1734];
    return (
      <div style={{position: "relative", zIndex: 10}}>
        <div className="f-map-tooltip-wrapper">

            {
              this.state.tooltipDisplay === "block" ?
              <div className='f-map-tooltip' style={{ display : this.state.tooltipDisplay }}>
                <p className='f-map-tooltip__district-name'>
                  {this.state.tooltipData.districtName && this.state.tooltipData.districtName}
                </p>
                <div className='f-map-tooltip__separator'></div>
                <div className='f-map-tooltip__data-wrapper'>
                <p className='f-map-tooltip__data-point-key'>
                  {this.props.dataPointToMap && `${this.props.dataPointToMap.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}:`}
                </p>
                <p className='f-map-tooltip__data-point-value'>
                  {this.state.tooltipData.dataPointToMap && `${this.state.tooltipData.dataPointToMap.toLocaleString('en-IN')} INR`}
                </p>
                </div>
              </div>
                :
              <div className="f-map-tooltip__guide-text-wrapper">
                <p className='f-map-tooltip__guide-text'>
                  hover over a district to see its spending info.
                </p>
              </div>
            }

        </div>
      <Map
        center={position}
        scrollWheelZoom= {false}
        zoom={this.state.zoom}
        style={{backgroundColor: 'white'}}>
      {/* <TileLayer url="https://api.mapbox.com/styles/v1/abrarburk/ck5wgtnm04osr1inyi2ng4wo5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWJyYXJidXJrIiwiYSI6ImNqM284MjlrbTAwMTMyd3BuemplOTVoMmYifQ.TX_JBU6Ff8EwHVx8dJfRPg" />*/}
      <Choropleth
          data={this.props.data}
          valueProperty={feature => feature.properties[this.props.dataPointToMap]}
          scale={["hsl(177,100%,0%)", "hsl(177,100%,70%)"]}
          style={style}
          steps={7}
          mode="e"
          onEachFeature={(feature, layer) => layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight
          })}
        />
      </Map>

      </div>
    );
  }
}
