import React, { Component, createRef } from 'react';
import * as d3 from 'd3';

export default class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.myChart = createRef();
  }

  state = {
    time: 0,
    data: []
  };

  componentDidMount() {
    // load data
    d3.json('data/gdp.json')
      .then((data) => {
        const formattedData = data.map(function (year) {
          return year['countries']
            .filter((country) => {
              var dataExists = country.income && country.life_exp;
              return dataExists;
            })
            .map((country) => {
              country.income = +country.income;
              country.life_exp = +country.life_exp;
              return country;
            });
        });

        this.setState({ data: formattedData }, () => {
          this.initChart();
          setInterval(() => {
            this.setState({
              time: this.state.time < 214 ? this.state.time + 1 : 0
            });
            this.updateChart(this.state.data[this.state.time]);
          }, 100);

          this.updateChart(this.state.data[0]);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * initializes the chart values
   */
  initChart = () => {
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

    // Scales
    this.x = d3
      .scaleLog()
      .base(10)
      .range([0, this.width])
      .domain([142, 150000]);

    this.y = d3.scaleLinear().range([this.height, 0]).domain([0, 90]);
    this.area = d3
      .scaleLinear()
      .range([25 * Math.PI, 1500 * Math.PI])
      .domain([2000, 1400000000]);

    this.continentColor = d3.scaleOrdinal(d3.schemePastel1);

    this.xAxisGroup = this.g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`);

    this.yAxisGroup = this.g.append('g').attr('class', 'y axis');

    // Labels
    this.xLabel = this.g
      .append('text')
      .attr('y', this.height + 50)
      .attr('x', this.width / 2)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('GDP Per Capita ($)');
    this.yLabel = this.g
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -170)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('Life Expectancy (Years)');

    this.timeLabel = this.g
      .append('text')
      .attr('y', this.height - 10)
      .attr('x', this.width - 40)
      .attr('font-size', '40px')
      .attr('opacity', '0.4')
      .attr('text-anchor', 'middle')
      .text('1800');

    // X Axis
    this.xAxisCall = d3
      .axisBottom(this.x)
      .tickValues([400, 4000, 40000])
      .tickFormat(d3.format('$'));
    this.g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxisCall);

    // Y Axis
    this.yAxisCall = d3.axisLeft(this.y).tickFormat(function (d) {
      return +d;
    });
    this.g.append('g').attr('class', 'y axis').call(this.yAxisCall);
  };

  /**
   * updates chart with new data
   */
  updateChart = (data) => {
    // Standard transition time for the visualization
    let t = d3.transition().duration(100);

    // JOIN new data with old elements.
    let circles = this.g.selectAll('circle').data(data,(d) => d.country);

    // EXIT old elements not present in new data.
    circles.exit().attr('class', 'exit').remove();

    // ENTER new elements present in new data.
    circles
      .enter()
      .append('circle')
      .attr('class', 'enter')
      .attr('fill', (d) => this.continentColor(d.continent))
      .merge(circles)
      .transition(t)
      .attr('cy', (d) => this.y(d.life_exp))
      .attr('cx', (d) => this.x(d.income))
      .attr('r', (d) => Math.sqrt(this.area(d.population) / Math.PI));

    // Update the time label
    this.timeLabel.text(this.state.time + 1800);
  };

  render() {
    return <div ref={this.myChart}> </div>;
  }
}
