/* eslint-disable */
import React, { useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

function App() {
  useEffect(() => {
    // drawScatterPlotSvg();
    // drawTimeSvg();
    // drawBarChart();
    // drawPaths();
    // drawPieChart();
    drawStackCharts();
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
      { key: 0, value: 5 },
      { key: 1, value: 10 },
      { key: 2, value: 13 },
      { key: 3, value: 19 },
      { key: 4, value: 21 },
      { key: 5, value: 25 },
      { key: 6, value: 22 },
      { key: 7, value: 18 },
      { key: 8, value: 15 },
      { key: 9, value: 13 },
      { key: 10, value: 11 },
      { key: 11, value: 12 },
      { key: 12, value: 15 },
      { key: 13, value: 20 },
      { key: 14, value: 18 },
      { key: 15, value: 17 },
      { key: 16, value: 16 },
      { key: 17, value: 18 },
      { key: 18, value: 23 },
      { key: 19, value: 25 },
    ];

    const key = (d) => d.key;
    const value = (d) => d.value;

    const xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, value)])
      .range([h, 0]);

    const svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg
      .selectAll("rect")
      .data(dataset, key)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d, i) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", h)
      .style("fill", "teal")
      .on("mouseover", function (event, d) {
        const xPosition =
          parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
        const yPosition = parseFloat(d3.select(this).attr("y")) + 12;

        d3.select("#tooltip")
          .style("left", `${xPosition}px`)
          .style("top", `${yPosition}px`)
          .classed("hidden", false)
          .select("#value")
          .text(d.value);
        d3.select(this).transition().duration(350).style("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition("restoreBarColor")
          .duration(350)
          .style("fill", "teal");

        d3.select("#tooltip").classed("hidden", true);
      });

    svg
      .selectAll("text")
      .data(dataset, key)
      .enter()
      .append("text")
      .text(value)
      .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y", (d, i) => yScale(d.value) + 12)
      .style("font-size", 12)
      .style("fill", "#fff")
      .style("text-anchor", "middle")
      .style("pointer-events", "none");

    d3.select("p.add").on("click", () => {
      dataset.push({
        key: dataset[dataset.length - 1].key + 1,
        value: Math.ceil(Math.random() * 20),
      });

      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset, value)]);

      const bars = svg.selectAll("rect").data(dataset, key);

      bars
        .enter()
        .append("rect")
        .attr("x", w)
        .attr("y", (d, i) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", h)
        .style("fill", "teal")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d, i) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", h);

      const texts = svg.selectAll("text").data(dataset, key);

      texts
        .enter()
        .append("text")
        .text(value)
        .attr("x", (d, i) => w + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(d.value) + 12)
        .style("font-size", 12)
        .style("fill", "#fff")
        .style("text-anchor", "middle")
        .merge(texts)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(d.value) + 12);
    });

    d3.select("p.remove").on("click", () => {
      dataset.shift();

      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset, value)]);

      const bars = svg.selectAll("rect").data(dataset, key);

      bars
        .exit()
        .transition()
        .duration(500)
        .attr("x", -xScale.bandwidth())
        .remove();
      bars
        .transition()
        .duration(500)
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d, i) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", h);

      const texts = svg.selectAll("text").data(dataset, key);

      texts
        .exit()
        .transition()
        .duration(250)
        .attr("x", -xScale.bandwidth())
        .remove();
      texts
        .transition()
        .duration(500)
        .text(value)
        .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(d.value) + 12);
    });

    d3.select("p.sort").on("click", () => {
      svg
        .selectAll("rect")
        .sort((a, b) => d3.ascending(a.value, b.value))
        .transition("sortBars")
        .duration(500)
        .attr("x", (d, i) => xScale(i));

      svg
        .selectAll("text")
        .sort((a, b) => d3.ascending(a.value, b.value))
        .transition("sortBars")
        .delay((d, i) => i * 50)
        .duration(500)
        .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2);
    });

    const d = svg.selectAll("rect");
  };

  const drawPaths = () => {
    const rowConverter = (d) => {
      return {
        //Make a new Date object for each year + month
        date: new Date(+d.year, +d.month - 1),
        //Convert from string to float
        average: parseFloat(d.average),
      };
    };

    d3.csv("assets/mauna_loa_co2_monthly_averages.csv", rowConverter).then(
      (dataset) => {
        const w = 800;
        const h = 300;
        const padding = 40;
        const formatTime = d3.timeFormat("%Y");

        console.table(dataset, ["average"]);

        const xScale = d3
          .scaleTime()
          .domain([
            d3.min(dataset, (d) => d.date),
            d3.max(dataset, (d) => d.date),
          ])
          .range([padding, w]);

        const yScale = d3
          .scaleLinear()
          .domain([
            d3.min(dataset, (d) => (d.average >= 0 ? d.average : undefined)),
            d3.max(dataset, (d) => d.average),
          ])
          .range([h - padding, 0]);

        const area = d3
          .area()
          .defined((d) => d.average >= 0)
          .x((d) => xScale(d.date))
          .y0((d) => yScale.range()[0])
          .y1((d) => yScale(d.average));

        const dangerArea = d3
          .area()
          .defined((d) => d.average >= 350)
          .x((d) => xScale(d.date))
          .y0((d) => yScale(350))
          .y1((d) => yScale(d.average));

        const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(formatTime);
        const yAxis = d3.axisLeft(yScale).ticks(5);

        const svg = d3
          .select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

        svg
          .append("line")
          .attr("class", "line safe-level")
          .attr("x1", padding)
          .attr("x2", w)
          .attr("y1", yScale(350))
          .attr("y2", yScale(350));

        svg
          .append("text")
          .attr("x", padding + 10)
          .attr("y", yScale(360))
          .text('350 ppm "safe" level')
          .style("font-size", 12)
          .style("fill", "red");

        svg.append("path").datum(dataset).attr("class", "area").attr("d", area);
        svg
          .append("path")
          .datum(dataset)
          .attr("class", "area danger")
          .attr("d", dangerArea);

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
      }
    );
  };

  const drawPieChart = () => {
    const dataset = [5, 10, 20, 45, 6, 25];
    const w = 300;
    const h = 300;
    // const innerRadius = w / 3; // doughnut chart
    const innerRadius = 0;
    const outerRadius = w / 2;

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    //Easy colors accessible via a 10-step ordinal scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const pie = d3.pie();

    const arcs = svg
      .selectAll("g.arc")
      .data(pie(dataset))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${outerRadius},${outerRadius})`);

    arcs
      .append("path")
      .attr("fill", (d) => color(d))
      .attr("d", arc);

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .text((d) => d.value)
      .style("text-anchor", "middle");
  };

  const drawStackCharts = () => {
    const dataset = [
      { apples: 5, oranges: 10, grapes: 22 },
      { apples: 4, oranges: 12, grapes: 28 },
      { apples: 2, oranges: 19, grapes: 32 },
      { apples: 7, oranges: 23, grapes: 35 },
      { apples: 23, oranges: 17, grapes: 43 },
    ];

    const w = 600;
    const h = 300;

    const xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length))
      .range([0, w])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d.apples + d.oranges + d.grapes)])
      .range([h, 0]);

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const stack = d3
      .stack()
      .keys(["apples", "oranges", "grapes"])
      .order(d3.stackOrderDescending);

    const series = stack(dataset);

    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const groups = svg
      .selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .attr("fill", (d, i) => colors(i));

    const rects = groups
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", (d, i) => xScale.bandwidth())
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]));
  };

  return (
    <div>
      <p className="add">
        Click on this text to update the chart with new data values (once).
      </p>
      <p className="remove">
        Click on this text to remove a data value from the chart.
      </p>
      <p className="sort">
        Click on this text to sort data values from the chart
      </p>

      <div className="chart">
        <div id="tooltip" className="hidden">
          <p>
            <strong>Important Label Heading</strong>
          </p>
          <p>
            <span id="value">100</span>%
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
