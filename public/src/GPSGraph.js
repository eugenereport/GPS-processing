export class GPSGraph {

  // Initializes graph configuration
  constructor(plotId) {
    this.started = false;
    this.angle = 1;
    this.trace_set = new Set();
    this.plotId = plotId;

    this.layout = {
      title: "GPS",
      xaxis: {
        title: "X Axis",
        showgrid: true,
        zeroline: true,
        gridcolor: "#444444",
        zerolinecolor: "#888888",
        tickmode: "linear",
        tick0: 0,
        dtick: 10,
        range: [0, 100],
      },
      yaxis: {
        title: "Y Axis",
        showgrid: true,
        zeroline: true,
        gridcolor: "#444444",
        zerolinecolor: "#888888",
        tickmode: "linear",
        tick0: 0,
        dtick: 10,
        range: [0, 100],
      },
      width: 680,
      height: 500,
      plot_bgcolor: "#131416",
      paper_bgcolor: "#131416",
      font: {
        color: "lime",
        size: 10,
      },
      margin: {
        r: 280,
      },
    };
  }

  // Updates graph configuration based on new data
  updateConfiguration(config) {
    let width = config.GPSService.emulationZoneSize.width;
    this.layout.xaxis.range = [0, width];
    this.layout.xaxis.dtick = width / 10;

    let height = config.GPSService.emulationZoneSize.height;
    this.layout.yaxis.range = [0, height];
    this.layout.yaxis.dtick = height / 10;
  }

  // Initializes the graph with GPS storage and starts rendering
  init(GPSStorage_) {
    this.storage = GPSStorage_;

    setInterval(() => {
      this.render();
      let traces = [...this.trace_set];
      Plotly.newPlot(this.plotId, traces, this.layout);
    }, 20);

    this.started = true;
  }

  // Renders graph data by plotting object and satellite positions
  render() {
    this.trace_set = new Set();

    const positionData = this.storage.getObjectPosition();

    let satelite_color = 'orange';

    if (positionData.status === "threepointsfound") {
      const { x, y } = positionData.objectCoordinates;

      const objectTrace = {
        x: [x],
        y: [y],
        mode: "markers",
        type: "scatter",
        marker: { size: 10, color: "lime", symbol: "cross" },
        opacity: 1,
        name: `Object (${x.toFixed(3)}, ${y.toFixed(3)})`,
      };

      this.trace_set.add(objectTrace);

      satelite_color = 'yellow';
    }

    positionData.points.forEach((satellite, index) => {
      const satTrace = {
        x: [satellite.x],
        y: [satellite.y],
        mode: "markers",
        type: "scatter",
        marker: { size: 7, color: satelite_color, symbol: "circle" },
        opacity: 1,
        name: `Satellite ${index + 1} (x: ${satellite.x.toFixed(3)}, y: ${satellite.y.toFixed(3)})`,
      };

      this.trace_set.add(satTrace);
    });
  }
}
