// @flow
import React, { Component, PropTypes } from "react";
import colorbrewer from "colorbrewer";
import styles from "./Legend.css";
import { scaleQuantize } from "d3";
import _ from "lodash";

import { toggleReverseLegend, fetchFeatures } from "../actions.jsx";

class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  // }

  componentWillReceiveProps(newProps) {}

  render() {
    const { dispatch, opnames } = this.props;

    let scaleVariant =
      colorbrewer.RdYlGn[this.props.opnames.mapSettings.numLegendIntervals];

    let scaleVariantKrw = [
      "#FF0000",
      "#FF9900",
      "#FFFD37",
      "#1ECA22",
      "#0000FF"
    ];

    if (opnames.mapSettings.reverseLegend) {
      scaleVariant.slice().reverse();
      scaleVariantKrw.slice().reverse();
    }

    let domain;

    const { legendMin, legendMax } = opnames.mapSettings;

    if ((legendMin !== null || legendMin !== "") && legendMax) {
      if (opnames.mapSettings.reverseLegend) {
        domain = [legendMax, legendMin];
      } else {
        domain = [legendMin, legendMax];
      }
    } else {
      if (opnames.mapSettings.reverseLegend) {
        domain = [
          opnames.mapSettings.dataDomain
            ? opnames.features.max_value
            : opnames.features.abs_max_value,
          opnames.mapSettings.dataDomain
            ? opnames.features.min_value
            : opnames.features.abs_min_value
        ];
      } else {
        domain = [
          opnames.mapSettings.dataDomain
            ? opnames.features.min_value
            : opnames.features.abs_min_value,
          opnames.mapSettings.dataDomain
            ? opnames.features.max_value
            : opnames.features.abs_max_value
        ];
      }
    }

    const colors = scaleQuantize()
      .domain(domain)
      .range(opnames.features.is_krw_score ? scaleVariantKrw : scaleVariant);

    return (
      <div
        onClick={() => {
          dispatch(toggleReverseLegend());
        }}
        className={`${styles.Legend} pull-right`}
      >
        <div className={styles.LegendWrapper}>
          <div
            className={styles.LegendList}
            style={{ borderTop: "15px solid #cccccc" }}
          >
            NULL
          </div>
          {colors.range().map((color, i) => {
            const label = colors.invertExtent(color);
            return (
              <div
                key={i}
                className={styles.LegendList}
                style={{ borderTop: `15px solid ${color}` }}
              >
                {label ? label[0].toFixed(2) : ""}
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
  opnames: PropTypes.object
};

export default Legend;
