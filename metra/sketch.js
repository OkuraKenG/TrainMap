let stationList, routes, stop_times, trips, calendar, calendar_dates;
let reformated;
let gridmap;
let linesmap;

function preload() {
  calendar = loadTable(`./data/METRA/calendar.txt`, "csv", "header");
  routes = loadTable(`./data/METRA/routes.txt`, "csv", "header");
  stop_times = loadTable(`./data/METRA/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/METRA/stops.txt`, "csv", "header");
  calendar_dates = loadTable(`./data/METRA/calendar_dates.txt`, "csv", "header");
  trips = loadTable(`./data/METRA/trips.txt`, "csv", "header");
  gridmap = loadJSON(`./data/stops.json`);
  linesmap = loadJSON(`./data/lines.json`);
}

function setup() {
  noLoop();
  pixelDensity(3); // keep it low or else slower browsers may struggle
  createCanvas(1300, 690);
  SET_SEARCH_MODE('DAY');
  canvasDrawer();
  reformated = reformat(getTrains(getServices(calendar, null), trips), stop_times);
  buttonGenerator(reformated, routes, stationList);
  console.log('Ready');
}

function draw() {
  canvasDrawer();
}
