let table, stationList, calendar_dates, routes, stop_times, trips;
let reformated;
let gridmap;
let linesmap;

function preload() {
  calendar_dates = loadTable(`./data/MNR/calendar_dates.txt`, "csv", "header");
  routes = loadTable(`./data/MNR/routes.txt`, "csv", "header");
  stop_times = loadTable(`./data/MNR/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/MNR/stops.txt`, "csv", "header");
  trips = loadTable(`./data/MNR/trips.txt`, "csv", "header");
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