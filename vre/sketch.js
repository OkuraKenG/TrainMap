let stationList, routes, stop_times, trips, calendar;
let reformated;
let gridmap;
let linesmap;

function preload() {
  calendar = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/vre/calendar.txt`, "csv", "header");
  routes = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/vre/routes.txt`, "csv", "header");
  stop_times = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/vre/stop_times.txt`, "csv", "header");
  stationList = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/vre/stops.txt`, "csv", "header");
  trips = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/vre/trips.txt`, "csv", "header");
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
