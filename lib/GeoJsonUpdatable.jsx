import React, { Component, PropTypes } from 'react';
import { GeoJSON } from 'react-leaflet';

export default class GeoJsonUpdatable extends GeoJSON {
  componentWillReceiveProps(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.clearLayers();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.addData(this.props.data);
    }
  }
}

GeoJsonUpdatable.propTypes = {
  data: React.PropTypes.any,
};
