// @flow
import React, { Component, PropTypes } from 'react';
import styles from './Legend.css';
import { scaleQuantize } from 'd3';
import _ from 'lodash';

import {
  toggleReverseLegend,
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
    const opnames = this.props.opnames;

    let scaleVariant = [
      '#006837',
      '#1a9850',
      '#66bd63',
      '#a6d96a',
      '#d9ef8b',
      '#ffffbf',
      '#fee08b',
      '#fdae61',
      '#f46d43',
      '#d73027',
      '#a50026',
    ];
    let scaleVariantKrw = [
      '#0000FF',
      '#1ECA22',
      '#FFFD37',
      '#FF9900',
      '#FF0000',
    ];

    if (this.props.opnames.mapSettings.reverseLegend) {
      scaleVariant.reverse();
      scaleVariantKrw.reverse();
    }

    const colors = scaleQuantize()
          .domain([
            opnames.features.min_value,
            opnames.features.max_value,
          ])
          .range(scaleVariant);

    return (
      <div
        onClick={() => this.props.dispatch(toggleReverseLegend())}
        className={`${styles.Legend} pull-right`}>
        <ul>
          <li className={styles.LegendList}
              style={{ borderTop: '15px solid #cccccc' }}>
              NULL
          </li>
          {colors.range().map((color, i) => {
            const label = colors.invertExtent(color);
            return (
              <li
                key={i}
                className={styles.LegendList}
                style={{ borderTop: `15px solid ${color}` }}>
                {(label) ? label[0].toFixed(2) : ''}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

Legend.propTypes = {};

export default Legend;
