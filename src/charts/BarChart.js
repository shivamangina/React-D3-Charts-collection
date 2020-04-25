import React, { Component, createRef } from 'react';
import * as d3 from 'd3';
class BarChart extends Component {
  constructor(props) {
    super(props);
    this.myChart = createRef();
  }

  state = {
    flag: true,
    data: []
  };

  initChart = (data) => {
    this.margin = {
      left: 100,
      right: 10,
      top: 10,
      bottom: 100
    };
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.svg = d3
      .select(this.myChart.current)
      .append('svg') // create a svg
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.g = this.svg
      .append('g') // append a group - This is chart
      .attr(
        'transform',
        `translate( ${this.margin.left} ,  ${this.margin.top})`
      );

    this.x = d3
      .scaleBand()
      .range([0, this.width])
      .paddingInner(0.3)
      .paddingOuter(1);

    this.y = d3.scaleLinear().range([this.height, 0]);

    this.xAxisGroup = this.g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`);

    this.yAxisGroup = this.g.append('g').attr('class', 'y axis');

    //y label
    this.yLabel = this.g
      .append('text')
      .attr('class', 'y axis-label')
      .attr('x', -(this.height / 2))
      .attr('y', -60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)');

    //x label
    this.xLabel = this.g
      .append('text')
      .attr('class', 'x axis-label')
      .attr('x', this.width / 2)
      .attr('y', this.height + 100)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle');
  };

  componentDidMount() {
    // load data
    d3.json('data/revenues.json')
      .then((data) => {
        this.setState({ data }, () => {
          this.initChart(this.state.data);
          setInterval(() => {
            this.setState({
              flag: !this.state.flag
            });
            this.updateChart(this.state.data);
          }, 1000);
          this.updateChart(this.state.data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateChart = (data) => {
    let value = this.state.flag ? 'revenue' : 'profit';
    this.x.domain(data.map((d) => d.month));
    this.y.domain([0, d3.max(data, (d) => d[value])]);

    let colors = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.month))
      .range(d3.schemeCategory10);

    let xAxis = d3.axisBottom(this.x);
    let yAxis = d3
      .axisLeft(this.y)
      .tickFormat((revenue) => revenue / 1000 + 'K');

    this.xAxisGroup
      .call(xAxis)
      .selectAll('text')
      .attr('y', '10')
      .attr('x', '-5')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-40)');

    this.yAxisGroup.call(yAxis);
    this.xLabel.text('Months');
    this.yLabel.text(value);
    // set data
    let rects = this.g.selectAll('rect').data(data);

    // remove old data
    rects.exit().remove();

    //update
    rects
      .attr('x', (d) => this.x(d.month))
      .attr('y', (d) => this.y(d[value]))
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => this.height - this.y(d[value]));

    // enter
    rects
      .enter()
      .append('rect')
      .attr('x', (d) => this.x(d.month))
      .attr('y', (d) => this.y(d.revenue))
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => this.height - this.y(d.revenue))
      .attr('fill', (d) => colors(d.month));
  };

  render() {
    return <div ref={this.myChart}> </div>;
  }
}
export default BarChart;
