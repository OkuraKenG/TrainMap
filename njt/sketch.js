let table, stationList, calendar_dates, routes, stop_times, trips;
let reformated;
let gridmap;
let linesmap;

function preload() {
  calendar_dates = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/njt/calendar_dates.txt`, "csv", "header");
  routes = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/njt/routes.txt`, "csv", "header");
  stop_times = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/njt/stop_times.txt`, "csv", "header");
  stationList = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/njt/stops.txt`, "csv", "header");
  trips = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/njt/trips.txt`, "csv", "header");
  gridmap = loadJSON(`./data/stops.json`);
  linesmap = loadJSON(`./data/lines.json`);
}

function setup() {
  noLoop();
  pixelDensity(3); // keep it low or else slower browsers may struggle
  createCanvas(1300, 690);
  SET_SEARCH_MODE('DATE');
  canvasDrawer();
  reformated = reformat(getTrains(getServices(null, calendar_dates), trips), stop_times);
  buttonGenerator(reformated, routes, stationList);
  console.log('Ready');
}

function draw() {
  canvasDrawer();
}