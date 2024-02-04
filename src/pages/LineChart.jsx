/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import chartData from '../chart-data/my_weather_data.json';

function LineChart() {
  const [dataset, setDataset] = useState(chartData);
  const svgRef = useRef();

  useEffect(() => {
    const yAccessor = (d) => d.temperatureMax;
    const dateParser = d3.timeParse('%Y-%m-%d');
    const xAccessor = (d) => dateParser(d.date);

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

    // 4. Create scales

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, yAccessor)) // min and max data values
      .range([dimensions.boundedHeight, 0]);
    // to test return value of yScale - call yScale(number). Return value - is the number of pixels from the top

    const freezingTemperaturePlacement = yScale(32);
    const freezingTemperatures = bounds
      .append('rect')
      .attr('x', 0)
      .attr('width', dimensions.boundedWidth)
      .attr('y', freezingTemperaturePlacement)
      .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr('fill', '#e0f3f3');

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth]);

    // 5. Draw data

    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    const line = bounds
      .append('path')
      .attr('d', lineGenerator(dataset))
      .attr('fill', 'none')
      .attr('stroke', '#af9358') // cornflowerblue
      .attr('stroke-width', 2);

    // 6. Draw peripherals

    const yAxisGenerator = d3.axisLeft().scale(yScale);

    const yAxis = bounds.append('g').call(yAxisGenerator);

    const xAxisGenerator = d3.axisBottom().scale(xScale);

    const xAxis = bounds
      .append('g')
      .call(xAxisGenerator)
      .style('transform', `translateY(${dimensions.boundedHeight}px)`);
  }, [dataset]);

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
