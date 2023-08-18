let stationList, routes, stop_times, trips, calendar;
let reformated;
let railroad;
let allTrains;


let gridmap;
let linesmap;

function preload() {
  railroad = 'SEPTA';
  calendar = loadTable(`./data/MBTA/calendar.txt`, "csv", "header");
  routes = loadTable(`./data/MBTA/routes.txt`, "csv", "header");
  stop_times = loadTable(`./data/MBTA/stop_times.txt`, "csv", "header");
  stationList = loadTable(`./data/MBTA/stops.txt`, "csv", "header");
  trips = loadTable(`./data/MBTA/trips.txt`, "csv", "header");

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
  reformated = reformat(getTrains(getServices(calendar), trips), stop_times);
  console.log('Ready');
}

function draw() {
  canvasDrawer();
}


function canvasDrawer() {
  background(35);

  // setup
  let overallXOffset = 125;
  let overallYOffset = 15;
  let fsize = 15;
  let diameter = fsize * 2 / 3;

  // draws lines
  strokeWeight(3);
  for (let i = 0; i < linesmap.lines.length; i++) {
    let currentLine = linesmap.lines[i];
    let color = currentLine.route_color;
    let x1 = currentLine.x1;
    let y1 = currentLine.y1;
    let x2 = currentLine.x2;
    let y2 = currentLine.y2;
    stroke("#"+color);

    if (currentLine.line_id == 'ARROW') {
      strokeWeight(1);
      fill("#000000");
      line(x1 * fsize + diameter + overallXOffset, y1 * fsize + diameter + overallYOffset, x2 * fsize + diameter + overallXOffset, y2 * fsize + diameter + overallYOffset);
      ellipse(x1 * fsize + diameter + overallXOffset, y1 * fsize + diameter + overallYOffset, 4, 4);
      fill("#FFFFFF");
      strokeWeight(3);
    } else {
      line(x1 * fsize + diameter + overallXOffset, y1 * fsize + diameter + overallYOffset, x2 * fsize + diameter + overallXOffset, y2 * fsize + diameter + overallYOffset);
    }
  }
  // rotate(PI/2)
  //resets
  stroke(0);
  strokeWeight(1);

  // draws the stations
  for (let i = 0; i < gridmap.stops.length; i++) {
    let currentStop = gridmap.stops[i];
    // draws the dots
    fill(currentStop.color);
    let x = parseInt(currentStop.x);
    let y = parseInt(currentStop.y);

    if (Number.isNaN(x) || Number.isNaN(y)) {
      continue;
    }

    ellipse(x * fsize + diameter + overallXOffset, y * fsize + diameter + overallYOffset, diameter, diameter);

    // handles line endings + special stations
    if (currentStop.stop_id == "LINE") {
      textStyle(BOLDITALIC);
    }

    if (currentStop.color == "#8F8F8F") {
      textStyle(ITALIC);
    }

    // draws the text 
    fill(255);
    if (currentStop.location == "right") { // handles the side text is displayed on
      text(currentStop.stop_name, x * fsize + fsize + overallXOffset + 5, y * fsize + fsize + overallYOffset);
    } else if (currentStop.location == "left") {
      text(currentStop.stop_name, x * fsize + fsize + overallXOffset - textWidth(currentStop.stop_name) - 15, y * fsize + fsize + overallYOffset);
    } else if (currentStop.location == "up") {
      rotate(-(PI / 2.0));
      text(currentStop.stop_name, -1 * (y * fsize + fsize + overallYOffset - 15), (x * fsize + fsize + overallXOffset));
      rotate((PI / 2.0));
    } else if (currentStop.location == "down") {
      rotate(-(PI / 2.0));
      text(currentStop.stop_name, -1 * (y * fsize + fsize + overallYOffset + textWidth(currentStop.stop_name) + 5), (x * fsize + fsize + overallXOffset - 2));
      rotate((PI / 2.0));
    }

    // reset style
    textStyle(NORMAL);
  }
}

function buttonGenerator() {
  background(35);

  // setup
  let overallXOffset = 125;
  let overallYOffset = 15;
  let fsize = 15;

  // draws the buttons
  for (let i = 0; i < gridmap.stops.length; i++) {
    let currentStop = gridmap.stops[i];
    let x = parseInt(currentStop.x);
    let y = parseInt(currentStop.y);

    if (Number.isNaN(x) || Number.isNaN(y)) {
      continue;
    }

    let bordercolor = "transparent";
    if (currentStop.location == "right") { // handles the side text is displayed on
      let div = document.createElement("div");
      div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset + 5 - 16}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.stop_name) + 16}px; border: solid; border-color: ${bordercolor};`);


      div.addEventListener("click", function () {
        displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, stationList, reformated, false), currentStop.stop_name, routes, stationList, reformated);
      }, false);


      document.body.appendChild(div);
    } else if (currentStop.location == "left") {
      let div = document.createElement("div");
      div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - textWidth(currentStop.stop_name) - 15}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.stop_name) + 15}px; border: solid; border-color: ${bordercolor};`);
      div.addEventListener("click", function () {
        displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, stationList, reformated, false), currentStop.stop_name, routes, stationList, reformated);
      }, false);
      document.body.appendChild(div);
    } else if (currentStop.location == "up") {
      let div = document.createElement("div");
      div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 10}px; top: ${y * fsize + overallYOffset - textWidth(currentStop.stop_name) - 3}px; height: ${textWidth(currentStop.stop_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
      div.addEventListener("click", function () {
        displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, stationList, reformated, false), currentStop.stop_name, routes, stationList, reformated);
      }, false);
      document.body.appendChild(div);
    } else if (currentStop.location == "down") {
      let div = document.createElement("div");
      div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 12}px; top: ${y * fsize + overallYOffset + 3}px; height: ${textWidth(currentStop.stop_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
      div.addEventListener("click", function () {
        displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, stationList, reformated, false), currentStop.stop_name, routes, stationList, reformated);
      }, false);
      document.body.appendChild(div);
    }
    // reset style
    textStyle(NORMAL);
  }
}


function getTodayDateStr() {
  const todayDate = new Date();
  const day = todayDate.getDay();
  return day;
}

function getServices(calendarthis) {
  let allServices = [];
  let day = getTodayDateStr();
  if (day == '0') {
    allServices.push(calendarthis.findRows('1', 'sunday'));
  }
  if (day == '1') {
    allServices.push(calendarthis.findRows('1', 'monday'));
  }
  if (day == '2') {
    allServices.push(calendarthis.findRows('1', 'tuesday'));
  }
  if (day == '3') {
    allServices.push(calendarthis.findRows('1', 'wednesday'));
  }
  if (day == '4') {
    allServices.push(calendarthis.findRows('1', 'thursday'));
  }
  if (day == '5') {
    allServices.push(calendarthis.findRows('1', 'friday'));
  }
  if (day == '6') {
    allServices.push(calendarthis.findRows('1', 'saturday'));
  }

  return allServices;
}

function getTrains(listOfServices, tripsthis) {
  //console.log(listOfServices[0]);
  listOfTrains = [];
  for (row of listOfServices[0]) {
    let temp = tripsthis.findRows(row.obj.service_id, 'service_id');

    for (let temp1 of temp) {
      if (temp1.obj.route_id.substring(0,2) == "CR")
        listOfTrains.push(temp1);   
    }

   // console.log(tripsthis.findRows(row.obj.service_id, 'service_id')[1].obj.route_id);


 //   listOfTrains = listOfTrains.concat(tripsthis.findRows(row.obj.service_id, 'service_id'));
  }

 // console.log(listOfTrains);
  
  return listOfTrains;
}
function reformat(listOfTrains, stop_timesthis) {
  let reformat = []
  console.log(listOfTrains.length);
  for (let i = 0; i < listOfTrains.length; i++) {
    trip_id = listOfTrains[i].obj.trip_id;
    trainObject = {
      overallTrainInfo: listOfTrains[i],
      stops: stop_timesthis.findRows(trip_id, 'trip_id')
    };
    reformat.push(trainObject);
  }
  //console.log(reformat);
  return reformat;
}

function getStopingTrainsAtStop(stop_num, stationListThis, reformatedthis, asNumber) {
  allTrains = []
  count = 0
  for (let train of reformatedthis) {
    stopsArr = train.stops;
    for (let stop of stopsArr) {
      stopStats = stop.obj;
      if (stopStats.stop_id == stop_num) {
        allTrains.push([train, stop]);
        count++;
      }
    }
  }

  allTrains.sort((a, b) => {
    let timeA = a[1].obj.arrival_time;
    if (timeA.search("[0-9]:") == 0)
      timeA = "0" + timeA;
    let timeB = b[1].obj.arrival_time;
    if (timeB.search("[0-9]:") == 0)
      timeB = "0" + timeB;
    //console.log(timeA, timeB, timeA.localeCompare(timeB));
    return timeA.localeCompare(timeB);
  });
  console.log(allTrains);
  return allTrains;

}

function displayStoppingTrains(allTrains, stationName, routesthis, stationListthis, reformatedthis) {
  let tablecontainer = document.getElementById('tablecontainer');
  tablecontainer.innerHTML = '';
  let overlayinner = document.getElementById('overlayinner');
  overlayinner.innerHTML = '';
  let overlay = document.getElementById('overlay');

  let htmlTable = document.createElement('table');
  htmlTable.setAttribute('id', 'thetable');
  let dontmissthetrain = []

  for (train of allTrains) {
    console.log(train);
    let arrival_time = train[1].obj.arrival_time;

    let line = lineNumToStr(train[0].overallTrainInfo.obj.route_id, routesthis);
    let headsign = train[0].overallTrainInfo.obj.trip_headsign;
    let track = train[1].obj.track;
    if (typeof track === 'undefined')
      track = "N/A";
    let direction = "N/A";

    let shortname = train[0].overallTrainInfo.obj.trip_short_name;
    if (typeof shortname === "undefined") {
      shortname = train[0].overallTrainInfo.obj.block_id;
    }
    let origin = stopnumToStr(train[0].stops[0].obj.stop_id, stationListthis);

    dontmissthetrain.push([arrival_time, line, origin, headsign, track, direction, shortname]);
    // console.log(`${depature_time} ${line} ${headsign} ${track} ${direction} ${shortname}`);

  }

  dontmissthetrain.sort((a, b) => {
    //console.log(a[0], b[0]);
    let timeA = a[0];
    if (timeA.search("[0-9]:") == 0)
      timeA = "0" + timeA;
    let timeB = b[0];
    if (timeB.search("[0-9]:") == 0)
      timeB = "0" + timeB;
    //console.log(timeA,timeB,timeA.localeCompare(timeB));
    return timeA.localeCompare(timeB);
  });

  let head = ['Arrival/Depature Time', 'Line', 'Origin', 'Terminus (Headsign)', 'Track', 'Direction', 'Train Number']
  let headerRow = document.createElement('thead');
  let headerTr = document.createElement('tr');
  for (let h of head) {
    let th = document.createElement('th');
    th.innerText = h;
    headerTr.appendChild(th);
  }
  headerRow.appendChild(headerTr);

  htmlTable.appendChild(headerRow);


  for (let [index0,row] of dontmissthetrain.entries()) {
    let r = document.createElement('tr');
    r.setAttribute('id', row[row.length - 1]);

    for (let [index, col] of row.entries()) {
      let c = document.createElement('td');
      c.innerText = col;

      if (head[index] == 'Line') {
        c.style.background = "#" + lineNameToColor(col, routesthis);
        if (typeof lineNameToTextColor(col, routesthis) !== "undefined")
          c.style.color = "#" + lineNameToTextColor(col, routesthis);
        else
          c.style.color = "white";

      }

      if (head[index] == 'Train Number') {
        r.setAttribute('stopsVisible', 'false');
        c.addEventListener('click', () => {
          //displayTrains(findByTrainNumber(col, reformatedthis), stationName, stationListthis)
          displayTrains(allTrains[index0][0], stationName, stationListthis)
        });
      }




      r.appendChild(c);
    }
    htmlTable.appendChild(r);
  }

  tablecontainer.appendChild(htmlTable);
  overlay.style.display = 'grid';

  let station = document.createElement('h1');
  station.innerText = `${stationName} (${dontmissthetrain.length} trains)`;
  overlayinner.appendChild(station);
  overlayinner.appendChild(htmlTable);

  let newButton = document.createElement('button');
  newButton.setAttribute('class', 'buttonExit');
  newButton.addEventListener('click', close);
  newButton.innerText = 'Exit';
  overlayinner.appendChild(newButton);
  //       <button class="buttonExit" id="exitButton" onclick="close()">Exit</button>

}

function lineNumToStr(num, routesthis) {
  return routesthis.findRow(num, 'route_id').obj.route_long_name;
}

function lineNameToColor(name, routesthis) {
  //console.log(routesthis)
  return routesthis.findRow(name, 'route_long_name').obj.route_color;
}

function lineNameToTextColor(name, routesthis) {
  //console.log(routesthis)
  return routesthis.findRow(name, 'route_long_name').obj.route_text_color;
}

function stopnumToStr(num, stationListthis) {
  return stationListthis.findRow(num, 'stop_id').obj.stop_name;
}

function close() {
  document.getElementById('overlay').style.display = '';
}

function findByTrainNumber(num, reformatedthis) {
  for (let train of reformatedthis) {
    if (train.overallTrainInfo.obj.trip_short_name == num) {
      // console.log(train);
      return train;
    }
  }
  return findByTrainBlockNumber(num);
}

function findByTrainBlockNumber(num) {
  for (let train of reformated) {
    if (train.overallTrainInfo.obj.block_id == num) {
      // console.log(train);
      return train;
    }
  }
  return 'None Found...';
}

// displays stops 
function displayTrains(train, stationName, stationListthis) {
  let stops = train.stops;
  let trip_short_name = train.overallTrainInfo.obj.trip_short_name;
  if (typeof trip_short_name === "undefined")
    trip_short_name = train.overallTrainInfo.obj.block_id

  let mainRowBool = document.getElementById(trip_short_name).getAttribute('stopsvisible')

  if (mainRowBool != 'false') {
    let rowToKill = document.getElementsByClassName(`RandomPickels${trip_short_name}`);
    for (let i = rowToKill.length - 1; i >= 0; i--) {
      document.getElementById('thetable').removeChild(rowToKill[i]);
    }
    document.getElementById(trip_short_name).setAttribute('stopsvisible', 'false');
    return;
  }

  let header = [`Train ${trip_short_name} Stops`, '#', 'Stop Name', 'Time', 'Tk'];
  let convertedToTable = [];
  for (let [index, stop] of stops.entries()) {
    let number = index + 1;
    let stopName = stopnumToStr(stop.obj.stop_id, stationListthis);
    let time = stop.obj.arrival_time;
    let track = stop.obj.track;
    if (typeof track === 'undefined')
      track = "N/A";
    convertedToTable.push(['', number, stopName, time, track]);
  }

  convertedToTable[0][0] = 'Origin Station: ';
  convertedToTable[convertedToTable.length - 1][0] = 'Terminus Station: ';
  // console.log(convertedToTable);

  let newTableHeader = document.createElement('tr');

  for (let h of header) {
    let th = document.createElement('th');
    th.innerText = h;
    newTableHeader.appendChild(th);
  }
  newTableHeader.setAttribute('class', `RandomPickels${trip_short_name}`);

  document.getElementById('thetable').insertBefore(newTableHeader, document.getElementById(trip_short_name).nextSibling);

  let temp = newTableHeader;
  for (let row of convertedToTable) {
    let r = document.createElement('tr');
    // r.setAttribute('id',row[row.length-1]);

    for (let [index, col] of row.entries()) {
      let c = document.createElement('td');
      c.innerText = col;
      if (index == 0) {
        c.setAttribute('align', 'right');
        c.setAttribute('style', 'font-weight: bold;');

      }
      if (col == stationName) {
        r.style.background = 'black';
        r.style.color = 'white';
      }

      r.appendChild(c);
    }
    r.setAttribute('class', `RandomPickels${trip_short_name}`);
    document.getElementById('thetable').insertBefore(r, temp.nextSibling);
    temp = r;
  }
  document.getElementById(trip_short_name).setAttribute('stopsvisible', 'true');
}
