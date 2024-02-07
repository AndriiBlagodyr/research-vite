/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

import chartData from '../chart-data/my_weather_data.json';
import './styles.css';

function LineChart() {
  const [data, setData] = useState(chartData);
  const svgRef = useRef();

  useEffect(() => {
    d3.selectAll('svg > *').remove();
    async function drawLineChart() {
      const yAccessor = (d) => d.temperatureMax;
      const dateParser = d3.timeParse('%Y-%m-%d');
      const xAccessor = (d) => dateParser(d.date);

      let dataset = data
        .sort((a, b) => xAccessor(a) - xAccessor(b))
        .slice(0, 100);
      // 2. Create chart dimensions

      const dimensions = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
          top: 15,
          right: 15,
          bottom: 40,
          left: 60,
        },
      };
      dimensions.boundedWidth =
        dimensions.width - dimensions.margin.left - dimensions.margin.right;
      dimensions.boundedHeight =
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

      // 3. Draw canvas

      const wrapper = d3
        .select(svgRef.current)
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

      const bounds = wrapper
        .append('g')
        .style(
          'transform',
          `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
        );

      const clipPath = bounds
        .append('defs')
        .append('clipPath')
        .attr('id', 'bounds-clip-path')
        .append('rect')
        .attr('width', dimensions.boundedWidth)
        .attr('height', dimensions.boundedHeight);

      // init static elements
      bounds.append('rect').attr('class', 'freezing');

      const clip = bounds
        .append('g')
        .attr('clip-path', 'url(#bounds-clip-path)');

      clip.append('path').attr('class', 'line');

      bounds
        .append('g')
        .attr('class', 'x-axis')
        .style('transform', `translateY(${dimensions.boundedHeight}px)`);
      bounds.append('g').attr('class', 'y-axis');

      const drawLine = (dataset) => {
        // 4. Create scales

        const yScale = d3
          .scaleLinear()
          .domain(d3.extent(dataset, yAccessor)) // min and max data values
          .range([dimensions.boundedHeight, 0]);
        // to test return value of yScale - call yScale(number). Return value - is the number of pixels from the top

        const freezingTemperaturePlacement = yScale(32);
        const freezingTemperatures = bounds
          .select('.freezing')
          .attr('x', 0)
          .attr('width', dimensions.boundedWidth)
          .attr('y', freezingTemperaturePlacement)
          .attr(
            'height',
            dimensions.boundedHeight - freezingTemperaturePlacement
          );

        const xScale = d3
          .scaleTime()
          .domain(d3.extent(dataset, xAccessor))
          .range([0, dimensions.boundedWidth]);

        // 5. Draw data

        const lineGenerator = d3
          .line()
          .x((d) => xScale(xAccessor(d)))
          .y((d) => yScale(yAccessor(d)));

        const lastTwoPoints = dataset.slice(-2);
        const pixelsBetweenLastPoints =
          xScale(xAccessor(lastTwoPoints[1])) -
          xScale(xAccessor(lastTwoPoints[0]));
        const line = bounds
          .select('.line')
          .attr('d', lineGenerator(dataset))
          .style('transform', `translateX(${pixelsBetweenLastPoints}px)`)
          .transition()
          .duration(1000)
          .style('transform', `none`);

        // 6. Draw peripherals

        const yAxisGenerator = d3.axisLeft().scale(yScale);

        const yAxis = bounds.select('.y-axis').call(yAxisGenerator);

        const xAxisGenerator = d3.axisBottom().scale(xScale);

        const xAxis = bounds
          .select('.x-axis')
          .transition()
          .duration(1000)
          .call(xAxisGenerator);
      };
      drawLine(dataset);

      function generateNewDataPoint(dataset) {
        const lastDataPoint = dataset[dataset.length - 1];
        const nextDay = d3.timeDay.offset(xAccessor(lastDataPoint), 1);

        return {
          date: d3.timeFormat('%Y-%m-%d')(nextDay),
          temperatureMax: yAccessor(lastDataPoint) + (Math.random() * 6 - 3),
        };
      }

      // update the line every 1.5 seconds
      function addNewDay() {
        dataset = [...dataset.slice(1), generateNewDataPoint(dataset)];
        drawLine(dataset);
      }
      setInterval(addNewDay, 1500);
    }
    drawLineChart();
  }, [data]);

  return (
    <div>
      <h2>Line Charts</h2>
      <div>
        <svg ref={svgRef} style={{ margin: '100px', display: 'block' }} />
      </div>
    </div>
  );
}

export default LineChart;
