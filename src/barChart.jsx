import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const BarChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);  // Extracting the 'data' array from the JSON
      })
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Set dimensions
      const width = 800;
      const height = 400;
      const padding = 50;
      
      //setting the x scale data
      const xScaleData = d3.scaleTime()
      .domain([d3.min(data,(d)=>new Date([0])),d3.max(data,(d)=>new Date([0]))])
      .range([padding,width-padding]);

      const yScale = d3.scaleLinear()
      .domain([d3.min(data,(d)=>d[1]),d3.max(data,(d)=>d[1])])
      .range([h-padding],padding);

      const xScale = d3.scaleBand()
      .domain(data.map((d)=>Pars))
      .range()

      // Create an SVG container
      const svg = d3
        .select("#bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

      svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScaleData(new Date(d[0])))
      .attr('y',(d)=>yScale(d[1]))
      .attr('width',)
      .attr('height',)
    }
  }, [data]); // Trigger effect after data is fetched

  return (
    <div>
      <h1 id="title">UNITED STATES GDP</h1>
      <div id="bar-chart"></div> {/* Div for the chart */}
    </div>
  );
};

export default BarChartComponent;
