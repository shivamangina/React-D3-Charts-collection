import React, { Component } from 'react'
import * as d3 from 'd3'
class BarChart extends Component {
    state = {
        temperatureData : [ 8, 5, 13, 9, 12 ]
    }
    
    componentDidMount(){
       this.createChart()
    }

    createChart =  () => {
        d3.select(this.refs.temperatures)
        .selectAll("h2")
        .data(this.state.temperatureData)
        .enter()
            .append("h2")
            .text("New Temperature")
    }
    
   
   
 
    render(){
        return <div ref="temperatures"></div>
    }
}
export default BarChart