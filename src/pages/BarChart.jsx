/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import chartData from '../chart-data/my_weather_data.json';
import './styles.css';

const metrics = [
  'windSpeed',
  'moonPhase',
  'dewPoint',
  'humidity',
  'uvIndex',
  'windBearing',
  'temperatureMin',
  'temperatureMax',
];

function BarChart() {
  // const [dataset, setDataset] = useState(chartData);
  const [selectedMetricIdx, setSelectedMetricIdx] = useState(0);
  const svgRef = useRef();

  useEffect(() => {
    // d3.selectAll('svg > *').remove();
    // d3.select('#wrapper').selectAll('*').remove();
    async function drawBars() {
      // 1. Access data
      const dataset = chartData;

      // 2. Create chart dimensions

      const width = 500;
      const dimensions = {
        width,
        height: width * 0.6,
        margin: {
          top: 30,
          right: 10,
          bottom: 50,
          left: 50,
        },
      };
      dimensions.boundedWidth =
        dimensions.width - dimensions.margin.left - dimensions.margin.right;
      dimensions.boundedHeight =
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

      // 3. Draw canvas
      const wrapper = d3
        .select('#wrapper')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

      const bounds = wrapper
        .append('g')
        .style(
          'transform',
          `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
        );

      // init static elements
      bounds.append('g').attr('class', 'bins');
      bounds.append('line').attr('class', 'mean');
      bounds
        .append('g')
        .attr('class', 'x-axis')
        .style('transform', `translateY(${dimensions.boundedHeight}px)`)
        .append('text')
        .attr('class', 'x-axis-label')
        .attr('x', dimensions.boundedWidth / 2)
        .attr('y', dimensions.margin.bottom - 10);

      const drawHistogram = (metric) => {
        const metricAccessor = (d) => d[metric];
        const yAccessor = (d) => d.length;

        // 4. Create scales

        const xScale = d3
          .scaleLinear()
          .domain(d3.extent(dataset, metricAccessor))
          .range([0, dimensions.boundedWidth])
          .nice();

        const binsGenerator = d3
          .bin()
          .domain(xScale.domain())
          .value(metricAccessor)
          .thresholds(12);

        const bins = binsGenerator(dataset);

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(bins, yAccessor)])
          .range([dimensions.boundedHeight, 0])
          .nice();

        // 5. Draw data

        const exitTransition = d3.transition().duration(600);

        const updateTransition = exitTransition.transition().duration(600);

        const barPadding = 1;

        let binGroups = bounds.select('.bins').selectAll('.bin').data(bins);

        const oldBinGroups = binGroups.exit();
        oldBinGroups
          .selectAll('rect')
          .style('fill', 'orangered')
          .transition(exitTransition)
          .attr('y', dimensions.boundedHeight)
          .attr('height', 0);

        oldBinGroups
          .selectAll('text')
          .transition(exitTransition)
          .attr('y', dimensions.boundedHeight);

        oldBinGroups.transition(exitTransition).remove();

        const newBinGroups = binGroups.enter().append('g').attr('class', 'bin');

        newBinGroups
          .append('rect')
          .attr('height', 0)
          .attr('x', (d) => xScale(d.x0) + barPadding)
          .attr('y', dimensions.boundedHeight)
          .attr('width', (d) =>
            d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
          )
          .style('fill', 'yellowgreen');

        newBinGroups
          .append('text')
          .attr('x', (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
          .attr('y', dimensions.boundedHeight);

        // update binGroups to include new points
        binGroups = newBinGroups.merge(binGroups);

        const barRects = binGroups
          .select('rect')
          .transition(updateTransition)
          .attr('x', (d) => xScale(d.x0) + barPadding)
          .attr('y', (d) => yScale(yAccessor(d)))
          .attr(
            'height',
            (d) => dimensions.boundedHeight - yScale(yAccessor(d))
          )
          .attr('width', (d) =>
            d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
          )
          .transition()
          .style('fill', 'cornflowerblue');

        const barText = binGroups
          .select('text')
          .transition(updateTransition)
          .attr('x', (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
          .attr('y', (d) => yScale(yAccessor(d)) - 5)
          .text((d) => yAccessor(d) || '');

        const mean = d3.mean(dataset, metricAccessor);

        const meanLine = bounds
          .selectAll('.mean')
          .transition(updateTransition)
          .attr('x1', xScale(mean))
          .attr('x2', xScale(mean))
          .attr('y1', -20)
          .attr('y2', dimensions.boundedHeight);

        // 6. Draw peripherals

        const xAxisGenerator = d3.axisBottom().scale(xScale);

        const xAxis = bounds
          .select('.x-axis')
          .transition(updateTransition)
          .call(xAxisGenerator);

        const xAxisLabel = xAxis
          .select('.x-axis-label')
          .attr('x', dimensions.boundedWidth / 2)
          .attr('y', dimensions.margin.bottom - 10)
          .text('Humidity');

        // 7. Set up interactions

        binGroups
          .select('rect')
          .on('mouseenter', onMouseEnter)
          .on('mouseleave', onMouseLeave);

        const tooltip = d3.select('#tooltip');
        function onMouseEnter(e, datum) {
          tooltip.select('#count').text(yAccessor(datum));

          const formatHumidity = d3.format('.2f');
          tooltip
            .select('#range')
            .text(
              [formatHumidity(datum.x0), formatHumidity(datum.x1)].join(' - ')
            );

          const x =
            xScale(datum.x0) +
            (xScale(datum.x1) - xScale(datum.x0)) / 2 +
            dimensions.margin.left;
          const y = yScale(yAccessor(datum)) + dimensions.margin.top;

          tooltip.style(
            'transform',
            `translate(` +
              `calc( -50% + ${x}px),` +
              `calc(-100% + ${y}px)` +
              `)`
          );

          tooltip.style('opacity', 1);
        }

        function onMouseLeave() {
          tooltip.style('opacity', 0);
        }
      };

      let selectedMetricIndex = 0;
      drawHistogram(metrics[selectedMetricIndex]);
      d3.select('button').remove();
      const button = d3.select('body').append('button').text('Change metric');

      function onClick() {
        selectedMetricIndex = (selectedMetricIndex + 1) % metrics.length;
        drawHistogram(metrics[selectedMetricIndex]);
      }

      button.node().addEventListener('click', onClick);
    }

    drawBars();
  }, []);

  return (
    <div>
      <h2>Line Charts</h2>
      <div id='wrapper' className='wrapper'>
        {/* <svg ref={svgRef} /> */}
        <div id='tooltip' className='tooltip'>
          <div className='tooltip-range'>
            Humidity: <span id='range' />
          </div>
          <div className='tooltip-value'>
            <span id='count' /> days
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(BarChart);
