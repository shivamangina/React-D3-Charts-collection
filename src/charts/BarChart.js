import React, { Component } from 'react';
import * as d3 from 'd3';
class BarChart extends Component {
  state = {
    temperatureData: [8, 5, 13, 9, 12],
  };

  componentDidMount() {
    this.createChart();
  }

  createChart = () => {
    d3.select(this.refs.temperatures)
      .append('svg')
      .attr('width', 600)
      .attr('height', 400)
      .selectAll('rect')
      .data(this.state.temperatureData)
      .enter()
      .append('rect')
      .attr('width', 40)
      .attr('height', (d) => d * 10)
      .attr('x',(d,i) => (i * 50))
      .attr('y',40);
  };

  render() {
    return <div ref="temperatures"></div>;
  }
}
export default BarChart;
