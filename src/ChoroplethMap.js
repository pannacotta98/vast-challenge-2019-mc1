import { extent, group, mean, select, timeParse } from 'd3';
import { StopWatch } from './util';
import TimeSelector from './TimeSelector';
import { csvVariableNames } from './mappings';
import ScatterPlot from './ScatterPlot';
import { myColor } from './globalConfigs';

export default class ChoroplethMap {
  constructor(data, mapSvg) {
    const stopWatch = new StopWatch('Building cloropleth map');

    // this.data = data;
    this.mapSvg = mapSvg;

    this.parseTime = timeParse('%Y-%m-%d %H:%M:%S');

    this.selectedTime = this.parseTime('2020-04-06 00:00:00');
    this.selectedProp = 'shake_intensity';

    this.data = group(
      data,
      (d) => this.parseTime(d.time),
      (d) => d.location
    );

    // Add the map svg
    select('#map-test').node().append(this.mapSvg.documentElement);
    this.svg = select('#map-test').select('svg');

    this.draw();
    stopWatch.stop();

    this.scatterRef = new ScatterPlot(data);

    new TimeSelector(
      extent(data, (d) => this.parseTime(d.time)),
      (newTime) => {
        this.setTime(newTime);
        this.scatterRef.setTime(newTime);
      }
    );
  }

  draw() {
    // Set map colors
    this.svg
      .select('#regions')
      .selectAll('g')
      .each((d, i, nodes) => {
        const svgElement = select(nodes[i]).select('*');
        // The numerical id of the geographical region
        const regionId = select(nodes[i]).node().id.split('-')[1];

        const dataForTimeAndRegion = this.data.get(this.selectedTime)?.get(regionId);

        // Check if there are no reports in the selected region at the selected time
        if (dataForTimeAndRegion === undefined) {
          svgElement.style('opacity', 1);
          svgElement.style('fill', '#eeeeee');
          return;
        }

        const theMean = mean(dataForTimeAndRegion, (d) => d[this.selectedProp]);
        svgElement.style('fill', myColor(theMean));
      });
  }

  setTime(date) {
    this.selectedTime = date;
    this.draw();
  }

  setMode(mode) {
    if (mode === 'All' || mode === 'Average')
      console.error('All or Average are not supported by choropleth map atm');
    this.selectedProp = csvVariableNames.get(mode);
    this.draw();
    this.scatterRef.setMode(mode);
  }
}
