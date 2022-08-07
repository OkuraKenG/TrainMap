let table, stationList, calendar_dates, routes, stop_times, trips;
let reformated

function preload() {
  let abc = "MNRR"
  calendar_dates = loadTable(`./data/${abc}/calendar_dates.txt`, "csv", "header");
  routes = loadTable(`./data/${abc}/routes.txt`, "csv", "header");
  table = loadTable(`./data/${abc}/shapes.txt`, "csv", "header");
  stop_times = loadTable(`./data/${abc}/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/${abc}/stops.txt`, "csv", "header");
  // colors =  loadTable("./data/colors.txt","txt","header");
  trips = loadTable(`./data/${abc}/trips.txt`, "csv", "header");  
}

let allLatLongs;

function setup() {
  reformated = reformat(getTrains(getServices())) 
  allLatLongs = [];
  let latlngs = [];
  let rem = table.rows[0].arr[0]; // Gets the the first point

  // converts csv data to array
  for (let row of table.rows) {
    let cord = [row.arr[1], row.arr[2], row.arr[3]]; // Gets current cord of row
    latlngs.push(cord); // Saves to list
    if (row.arr[0] != rem) { // If it's a diffrent shape ID...
      let newLat = latlngs.pop(); // ...it saves the last collected cord, it's part of next shape
      latlngs.sort(function (a, b) { // sort the list of lat/longs for current shape by it's order (MTA data is out of order)
        return a[2] - b[2];
      });
      allLatLongs.push({ latlngs: latlngs, shapeID: rem }); // add to storage
      latlngs = [newLat]; // add to next shape
      rem = row.arr[0]; // record ID of shape
    }
  }

  noCanvas();
  var map = L.map("maap").setView([0, 0], 13);

  var tiles = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ).addTo(map);

  // general 
  // for (let i = 0 ; i < allLatLongs.length ; i++) {
  //   var polyline = L.polyline(allLatLongs[i].latlngs, { color: "black" /*color(Math.random()*255,Math.random()*255,Math.random()*255)*/ }).addTo(map);
  // }
  //var polyline = L.polyline(allLatLongs[45].latlngs, { color: "purple" /*color(Math.random()*255,Math.random()*255,Math.random()*255)*/ }).addTo(map);

  //   zoom the map to the polyline
  // map.fitBounds(polyline.getBounds());


  // Just MNRR
  let colors = ['#009B3A', '#EE0034', '#EE0034', '#EE0034', '#EE0034', '#0039A6'];
  let linesToPrint = [1, 8, 10, 11, 5, 3];
  //let linesToPrint = [  4];

  let i = 0;
  for (let shape of linesToPrint) {
    var polyline = L.polyline(allLatLongs.find(({ shapeID }) => shapeID == shape).latlngs, { color: colors[i] }).bindPopup(`${shape}`).addTo(map);
    i++;
  }

  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());

  for (let x of stationList.rows) {
    let latlngs = [x.arr[4], x.arr[5]];
    let stationName = x.arr[2]
    var circle = L.circle(latlngs, {
      color: '#353535',
      fillColor: 'white',
      fillOpacity: 0.5,
      radius: 25
    }).bindPopup(stationName).addTo(map);
  }
}

function getTodayDateStr() {
  const todayDate = new Date();
  const year = `${todayDate.getFullYear()}`;
  let month = `${todayDate.getMonth() + 1}`;
  let day = `${todayDate.getDate()}`;

  if (month.length <= 1) {
    month = `0${month}`
  }

  if (day.length <= 1) {
    day = `0${day}`
  }

  return year + month + day;
}



function getServices() {
  return calendar_dates.findRows('20220808', 1);
}

function getTrains(listOfServices) {
  listOfTrains = [];
  for (row of listOfServices) {
    listOfTrains = listOfTrains.concat(trips.findRows(row.arr[0], 1));
  }
  return listOfTrains;
}

function reformat(listOfTrains) {
  let reformat = [] 
  for (let i = 0 ; i < listOfTrains.length ; i++) {
    trip_id = listOfTrains[i].arr[2];
    trainObject = {overallTrainInfo:   listOfTrains[i].arr,
                   stops:              stop_times.findRows(trip_id,0)};
    reformat.push(trainObject);
  }
  return reformat;
}
