let table, stationList, calendar_dates, routes, stop_times, trips;
let reformated;
let railroad;
let allTrains;
let allLatLongs;
let abc;
let gridmap;
let linesmap;

function preload() {
  abc = loadJSON('./setup.json');
  railroad = 'MNR';
  calendar_dates = loadTable(`./data/NJT/calendar_dates.txt`, "csv", "header");
  routes = loadTable(`./data/NJT/routes.txt`, "csv", "header");
  table = loadTable(`./data/NJT/shapes.txt`, "csv", "header");
  stop_times = loadTable(`./data/NJT/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/NJT/stops.txt`, "csv", "header");
  trips = loadTable(`./data/NJT/trips.txt`, "csv", "header");
  gridmap = loadJSON(`./data/stops.json`);
  linesmap = loadJSON(`./data/lines.json`);
}

function setup() {
  pixelDensity(3); // keep it low or else slower browsers may struggle
  createCanvas(1300, 690);
  canvasDrawer();
  buttonGenerator();
  //frameRate(1);
  noLoop();
  // ~ setup ~ //
  reformated = reformat(getTrains(getServices()));
  console.log('Ready');
}

function draw() {
  canvasDrawer();
}