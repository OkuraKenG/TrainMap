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
  calendar_dates = loadTable(`./data/${railroad}/calendar_dates.txt`, "csv", "header");
  routes = loadTable(`./data/${railroad}/routes.txt`, "csv", "header");
  table = loadTable(`./data/${railroad}/shapes.txt`, "csv", "header");
  stop_times = loadTable(`./data/${railroad}/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/${railroad}/stops.txt`, "csv", "header");
  trips = loadTable(`./data/${railroad}/trips.txt`, "csv", "header");
  gridmap = loadJSON(`./data/stops.json`);
  linesmap = loadJSON(`./data/lines.json`);
}

// https://traintime.mta.info/map?trainId=MNR_9699&code=2NR

function setup() {
  pixelDensity(3); // keep it low or else slower browsers may struggle
  createCanvas(840, 690);
  canvasDrawer();
  buttonGenerator();
  frameRate(1);
  // ~ setup ~ //
  reformated = reformat(getTrains(getServices()));
  console.log('Ready');
}

function draw() {
  canvasDrawer();
}
