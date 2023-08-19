let table, stationList, calendar_dates, routes, stop_times, trips;
let reformated;
let gridmap;
let linesmap;

function preload() {
  calendar_dates = loadTable(`./data/NJT/calendar_dates.txt`, "csv", "header");
  routes = loadTable(`./data/NJT/routes.txt`, "csv", "header");
  stop_times = loadTable(`./data/NJT/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/NJT/stops.txt`, "csv", "header");
  trips = loadTable(`./data/NJT/trips.txt`, "csv", "header");
  gridmap = loadJSON(`./data/stops.json`);
  linesmap = loadJSON(`./data/lines.json`);
}

function setup() {
  noLoop();
  pixelDensity(3); // keep it low or else slower browsers may struggle
  createCanvas(840, 690);
  SET_SEARCH_MODE('DATE');
  canvasDrawer();
  reformated = reformat(getTrains(getServices(null, calendar_dates), trips), stop_times);
  buttonGenerator(reformated, routes, stationList);
  console.log('Ready');
}

function draw() {
  canvasDrawer();
}