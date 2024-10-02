import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const BarChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data); // Extracting the 'data' array from the JSON
      })
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Set dimensions
      const width = 800;
      const height = 400;
      const padding = 50;

      // Clear any existing SVG
      d3.select("#bar-chart").select("svg").remove();

      // Create an SVG container
      const svg = d3
        .select("#bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      // Parse date
      const ParseDate = d3.timeParse("%Y-%m-%d");

      // Create scales
      const xScale = d3
        .scaleTime()
        .domain([d3.min(data, (d) => ParseDate(d[0])), d3.max(data, (d) => ParseDate(d[0]))])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])]) // Start from 0 for better visualization
        .range([height - padding, padding]);

      // Calculate the width of each bar
      const barWidth = (width - (2 * padding)) / data.length;

       //create the tool tip
       const toolTip = 
       d3.select("body")
       .append("div")
       .attr("id", "tooltip")
       .style("position", "absolute")
       .style("background", "#f9f9f9")
       .style("padding", "5px")
       .style("border", "1px solid #ccc")
       .style("border-radius", "5px")
       .style("pointer-events", "none")
       .style("opacity", "0");

       //get the quaerter of the year
       const getQuarter = (date)=>{
        const month = date.getMonth()+1;
        if(month<=3) return "Q1";
        else if(month<=6) return "Q2";
        else if (month <= 9) return "Q3"; 
        return "Q4";
       }
      // Append bars to the chart
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(ParseDate(d[0]))) // X position based on the date
        .attr("y", (d) => yScale(d[1])) // Y position based on GDP value
        .attr("width", barWidth - 2) // Give a small gap between the bars
        .attr("height", (d) => height - padding - yScale(d[1])) // Bar height based on GDP value
        .attr("fill", "steelblue")
        .attr('data-date', (d)=> d[0])
        .attr('data-gdp', (d)=>d[1])
       .on('mouseover',(event,d)=>{
        const date = new Date(d[0]);
        const year = date.getFullYear();
        const quarter = getQuarter(date);


        toolTip
        .transition()
        .duration(200)
        .style("opacity", 1); // Fade-in effect for tooltip

        toolTip
        .attr('data-date',d[0])
        .html(`Year: ${year} (${quarter})<br/>GDP: $${d[1]} Billion`) // Tooltip content with quarter
        .style("top", event.pageY - 28 + "px") // Position tooltip near mouse
        .style("left", event.pageX + 5 + "px");
    })
    .on("mouseout", function () {
      toolTip
        .transition()
        .duration(200)
        .style("opacity", 0);
    });
       

       

        

      // Append X axis
      svg
        .append("g")
        .attr("id","x-axis")
         .attr("class", "tick")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(xScale));

      // Append Y axis
      svg
        .append("g")
        .attr("id","y-axis")
         .attr("class", "tick")
        .attr("transform", `translate(${padding}, 0)`)
        .call(d3.axisLeft(yScale));
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
