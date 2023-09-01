let stationList, routes, stop_times, trips, calendar, calendar_dates;
let reformated;
let gridmap;
let linesmap;

function preload() {
  calendar = loadTable(`./data/RTD/calendar.txt`, "csv", "header");
  routes = loadTable(`./data/RTD/routes.txt`, "csv", "header");
  stop_times = loadTable(`./data/RTD/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/RTD/stops.txt`, "csv", "header");
  calendar_dates = loadTable(`./data/RTD/calendar_dates.txt`, "csv", "header");
  trips = loadTable(`./data/RTD/trips.txt`, "csv", "header");
  gridmap = loadJSON(`./data/stops.json`);
  linesmap = loadJSON(`./data/lines.json`);
}

function setup() {
  noLoop();
  pixelDensity(3); // keep it low or else slower browsers may struggle
  createCanvas(1300, 690);
  SET_SEARCH_MODE('DAY');
  canvasDrawer();
  reformated = reformat(getTrains(getServices(calendar, calendar_dates), trips), stop_times);
  buttonGenerator(reformated, routes, stationList);
  console.log('Ready');
}

function draw() {
  canvasDrawer();
}
