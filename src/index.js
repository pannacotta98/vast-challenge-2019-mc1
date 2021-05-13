import { csv, select, svg } from 'd3';
import './style.scss';
import { createHeatmap } from './heatmap.js';
// import { Tooltip, Toast, Popover } from 'bootstrap';
import ChoroplethMap from './ChoroplethMap';

const main = async () => {
  const data = await csv('data/mc1-reports-data.csv');
  document.getElementById('full-plot').onclick = function () {
    constructHeatmaps(data);
  };
  document.getElementById('avg-plot').onclick = function () {
    constructHeatmaps(data);
  };

  constructHeatmaps(data);

  select('#loading-icon').remove();

  const mapSvgFile = await svg('data/map.svg');
  const map = new ChoroplethMap(data, mapSvgFile);
};

const locationNames = [
  'Palace Hills',
  'Northwest',
  'Old Town',
  'Safe Town',
  'Southwest',
  'Downtown',
  'Wilson Forest',
  'Scenic Vista',
  'Broadview',
  'Chapparal',
  'Terrapin Springs',
  'Pepper Mill',
  'Cheddarford',
  'Easton',
  'Weston',
  'Southton',
  'Oak Willow',
  'East Parton',
  'West Parton',
];

const constructHeatmaps = async () => {
  document.getElementById('loading-text').textContent = 'Loading...';

  for (let index = 0; index < locationNames.length; index++) {
    const data = await csv('data/location' + (index + 1) + '.csv');
    createHeatmap(
      data,
      locationNames[index],
      index,
      document.getElementById('avg-plot').checked
    );
  }
  document.getElementById('loading-text').textContent = '';
};

main();
