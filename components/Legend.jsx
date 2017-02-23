// @flow
import React, { Component, PropTypes } from 'react';
import colorbrewer from 'colorbrewer';
import styles from './Legend.css';
import { scaleQuantize } from 'd3';
import _ from 'lodash';

import {
  toggleReverseLegend,
  fetchFeatures,
} from '../actions.jsx';

class Legend extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  render() {

    const { dispatch, opnames } = this.props;

    let scaleVariant = colorbrewer.RdYlGn[this.props.opnames.mapSettings.numLegendIntervals];

    let scaleVariantKrw = [
      '#0000FF',
      '#1ECA22',
      '#FFFD37',
      '#FF9900',
      '#FF0000',
    ];

    if (opnames.mapSettings.reverseLegend) {
      scaleVariant.reverse();
      scaleVariantKrw.reverse();
    }

    let domain;
    if (opnames.mapSettings.legendMin && opnames.mapSettings.legendMax) {
      domain = [
        opnames.mapSettings.legendMin, opnames.mapSettings.legendMax
      ];
    }
    else {
      domain = [
        (opnames.mapSettings.dataDomain) ?
          opnames.features.min_value :
          opnames.features.abs_min_value,
        (opnames.mapSettings.dataDomain) ?
          opnames.features.max_value :
          opnames.features.abs_max_value,
      ];
    }
    const colors = scaleQuantize()
          .domain(domain)
          .range(scaleVariant);

    return (
      <div
        onClick={() => {
          dispatch(
            toggleReverseLegend()
          );
          dispatch(
            fetchFeatures()
          );
        }}
        className={`${styles.Legend} pull-right`}>
        <div className={styles.LegendWrapper}>
          <div className={styles.LegendList}
              style={{ borderTop: '15px solid #cccccc' }}>
              NULL
          </div>
          {colors.range().map((color, i) => {
            const label = colors.invertExtent(color);
            return (
              <div
                key={i}
                className={styles.LegendList}
                style={{ borderTop: `15px solid ${color}` }}>
                {(label) ? label[0].toFixed(2) : ''}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Legend.propTypes = {
  dispatch: PropTypes.func,
  opnames: PropTypes.object,
};

export default Legend;
