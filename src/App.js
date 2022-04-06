/* eslint-disable */
import React, { useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

function App() {
  useEffect(() => {
    // drawScatterPlotSvg();
    // drawTimeSvg();
    drawBarChart();
  }, []);

  const drawScatterPlotSvg = () => {
    //Dynamic, random dataset
    // const dataset = [];
    // const numDataPoints = 50;
    // const xRange = Math.random() * 1000;
    // const yRange = Math.random() * 1000;
    // for (let i = 0; i < numDataPoints; i++) {
    //     const newNumber1 = Math.floor(Math.random() * xRange);
    //     const newNumber2 = Math.floor(Math.random() * yRange);
    //     dataset.push([newNumber1, newNumber2]);
    // }

    const dataset = [
      [1, 90],
      [480, 90],
      [250, 50],
      [100, 33],
      [330, 95],
      [410, 12],
      [475, 44],
      [25, 67],
      [85, 21],
      [220, 88],
      [400, 200],
    ];

    const w = 500;
    const h = 300;
    const padding = 50;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[0])])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([h - padding, padding]);

    const aScale = d3
      .scaleSqrt()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([0, 10]);

    const formatAsPercentage = d3.format(".1%");
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5); /* .tickValues([100, 250, 400]) */
    const yAxis = d3.axisLeft(yScale).ticks(5);

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg
      .append("g")
      .attr("id", "circles")
      .style("clip-path", "url(#chart-area)")
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", ([cx]) => xScale(cx))
      .attr("cy", ([cx, cy]) => yScale(cy))
      .attr("r", (d) => aScale(d[1]));

    // svg
    //   .selectAll("text")
    //   .data(dataset)
    //   .enter()
    //   .append("text")
    //   .text(([cx, cy]) => `${cx},${cy}`)
    //   .attr("x", ([cx, cy]) => xScale(cx) + aScale(cy) + 2)
    //   .attr("y", ([cx, cy]) => yScale(cy))
    //   .attr("font-family", "arial")
    //   .attr("font-size", "10px")
    //   .attr("fill", "red")
    //   .attr("dominant-baseline", "middle");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    //Define clipping path
    svg
      .append("clipPath") //Make a new clipPath
      .attr("id", "chart-area") //Assign an ID
      .append("rect") //Within the clipPath, create a new rect
      .attr("x", padding) //Set rect's position and size…
      .attr("y", padding)
      .attr("width", w - padding * 2)
      .attr("height", h - padding * 2);

    d3.select("p").on("click", () => {
      const dataset = [
        [100, 70],
        [480, 90],
        [250, 10],
        [150, 33],
        [330, 10],
        [300, 100],
        [475, 44],
        [555, 67],
        [85, 10],
        [120, 20],
        [300, 170],
      ];

      xScale.domain([0, d3.max(dataset, (d) => d[0])]);
      yScale.domain([0, d3.max(dataset, (d) => d[1])]);
      aScale.domain([0, d3.max(dataset, (d) => d[1])]);

      svg
        .selectAll("circle")
        .data(dataset)
        .transition()
        .duration(1000)
        .attr("cx", ([cx]) => xScale(cx))
        .attr("cy", ([cx, cy]) => yScale(cy))
        .attr("r", (d) => aScale(d[1]));

      svg
        .selectAll("text")
        .data(dataset)
        .transition()
        .duration(1000)
        .on("start", function () {
          d3.select(this).attr("fill", "blue");
        })
        .text(([cx, cy]) => `${cx},${cy}`)
        .attr("x", ([cx, cy]) => xScale(cx) + aScale(cy) + 2)
        .attr("y", ([cx, cy]) => yScale(cy))
        .on("end", function () {
          d3.select(this).attr("fill", "red");
        });
    });
  };

  const drawTimeSvg = () => {
    const w = 500;
    const h = 300;
    const padding = 40;

    const parseTime = d3.timeParse("%m/%d/%y");
    const formatTime = d3.timeFormat("%e");

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style("border-top", "1px solid #555");

    const rowConverter = (row) => {
      return {
        Date: parseTime(row.Date),
        Amount: parseInt(row.Amount),
      };
    };

    d3.csv("assets/time-scale-data.csv", rowConverter).then((dataset) => {
      const startDate = d3.min(dataset, (d) => d.Date);
      const endDate = d3.max(dataset, (d) => d.Date);

      const xScale = d3
        .scaleTime()
        .domain([
          d3.timeDay.offset(startDate, -1),
          d3.timeDay.offset(endDate, 1),
        ])
        .range([padding, w - padding]);

      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(dataset, (d) => d.Amount),
          d3.max(dataset, (d) => d.Amount),
        ])
        .range([h - padding, padding]);

      const aScale = d3
        .scaleSqrt()
        .domain([0, d3.max(dataset, (d) => d.Amount)])
        .range([0, 5]);

      const xAxis = d3.axisBottom(xScale).tickFormat(formatTime).ticks(9);
      const yAxis = d3.axisLeft(yScale).ticks(10);

      svg
        .selectAll("line")
        .data(dataset)
        .enter()
        .append("line")
        .attr("x1", (d) => xScale(d.Date))
        .attr("x2", (d) => xScale(d.Date))
        .attr("y1", h - padding)
        .attr("y2", (d) => yScale(d.Amount))
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1);

      svg
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.Date))
        .attr("cy", (d) => yScale(d.Amount))
        .attr("r", (d) => aScale(d.Amount));

      // svg
      //   .selectAll("text")
      //   .data(dataset)
      //   .enter()
      //   .append("text")
      //   .text((d) => formatTime(d.Date))
      //   .attr("x", (d) => xScale(d.Date) + aScale(d.Amount) + 2)
      //   .attr("y", (d) => yScale(d.Amount))
      //   .attr("font-family", "arial")
      //   .attr("font-size", "10px")
      //   .attr("fill", "red")
      //   .attr("dominant-baseline", "middle");

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);
    });
  };

  const drawBarChart = () => {
    const w = 600;
    const h = 250;

    const dataset = [
      5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23,
      25,
    ];

    const xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([h, 0]);

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d, i) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", h)
      .style("fill", "teal");

    svg
      .selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y", (d, i) => yScale(d) + 12)
      .style("font-size", 12)
      .style("fill", "#fff")
      .style("text-anchor", "middle");

    d3.select("p.add").on("click", () => {
      dataset.push(Math.ceil(Math.random() * 20));

      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset)]);

      const bars = svg.selectAll("rect").data(dataset);

      bars
        .enter()
        .append("rect")
        .attr("x", w)
        .attr("y", (d, i) => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", h)
        .style("fill", "teal")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d, i) => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", h);

      const texts = svg.selectAll("text").data(dataset);

      texts
        .enter()
        .append("text")
        .text((d) => d)
        .attr("x", (d, i) => w + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(d) + 12)
        .style("font-size", 12)
        .style("fill", "#fff")
        .style("text-anchor", "middle")
        .merge(texts)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(d) + 12);
    });

    d3.select("p.remove").on("click", () => {
      dataset.pop();

      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset)]);

      const bars = svg.selectAll("rect").data(dataset);

      bars.exit().transition().duration(500).attr("x", w).remove();
      bars
        .transition()
        .duration(500)
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d, i) => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", h);

      const texts = svg.selectAll("text").data(dataset);

      texts
        .exit()
        .transition()
        .duration(250)
        .attr("x", w)
        .remove();
      texts
        .transition()
        .duration(500)
        .text((d) => d)
        .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(d) + 12);
    });
  };

  return (
    <div>
      <p className="add">
        Click on this text to update the chart with new data values (once).
      </p>
      <p className="remove">
        Click on this text to remove a data value from the chart.
      </p>
    </div>
  );
}

export default App;
