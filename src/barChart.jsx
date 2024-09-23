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
      const width = 900;
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
      const barWidth = (width - 2 * padding) / data.length;

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
        .attr("fill", "steelblue");

      // Append X axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(xScale));

      // Append Y axis
      svg
        .append("g")
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
