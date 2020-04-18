import React, { Component } from 'react';
import * as d3 from 'd3';
class BarChart extends Component {
  state = {
    temperatureData: [8, 5, 13, 9, 12],
  };

  componentDidMount() {
    // load data
    d3.json('data/revenues.json')
      .then((data) => {
        console.log(data);

        this.createChart(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createChart = (data) => {
    let margin = { left: 100, right: 10, top: 10, bottom: 100 };
    let width = 600 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    let svg = d3
      .select(this.refs.temperatures)
      .append('svg') // create a svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    let g = svg
      .append('g') // append a group - This is chart
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')'); // TODO  - come back here

    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.revenue)])
      .range([height, 0]);

    let x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(1);

    // let colors = d3.schemeCategory10;

    console.log(x, y);

    let xAxis = d3.axisBottom(x);
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis)
      .selectAll('text')
      .attr('y', '10')
      .attr('x', '-5')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-40)');

    let yAxis = d3.axisLeft(y).tickFormat((revenue) => revenue / 1000 + 'K');
    g.append('g').attr('class', 'y axis').call(yAxis);

    let rects = g
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.month))
      .attr('y', (d) => y(d.revenue))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.revenue))
      // .attr('fill', (d) => colors(d.month));
  };

  render() {
    return <div ref="temperatures"></div>;
  }
}
export default BarChart;
