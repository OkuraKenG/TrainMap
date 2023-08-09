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
    stroke(color);
    line(x1 * fsize + diameter + overallXOffset, y1 * fsize + diameter + overallYOffset, x2 * fsize + diameter + overallXOffset, y2 * fsize + diameter + overallYOffset);
  }

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
    if (currentStop.isRight == "true") { // handles the side text is displayed on
      text(currentStop.stop_name, x * fsize + fsize + overallXOffset + 5, y * fsize + fsize + overallYOffset);
    } else {
      text(currentStop.stop_name, x * fsize + fsize + overallXOffset - textWidth(currentStop.stop_name) - 15, y * fsize + fsize + overallYOffset);
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

    if (currentStop.isRight == "true") { // handles the side text is displayed on
      let div = document.createElement("div");
      div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset + 5 - 16}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.stop_name) + 16}px; border: solid; border-color: transparent;`);
      div.addEventListener("click", function () {
        displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_name, false), currentStop.stop_name);
      }, false);
      document.body.appendChild(div);
    } else {
      let div = document.createElement("div");
      div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - textWidth(currentStop.stop_name) - 15}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.stop_name) + 15}px; border: solid; border-color: transparent;`);
      div.addEventListener("click", function () {
        displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_name, false), currentStop.stop_name);
      }, false);
      document.body.appendChild(div);
    }
    // reset style
    textStyle(NORMAL);
  }
}


function draw() {
  canvasDrawer();
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
  return calendar_dates.findRows(getTodayDateStr(), 'date');
}

function getTrains(listOfServices) {
  listOfTrains = [];
  for (row of listOfServices) {
    listOfTrains = listOfTrains.concat(trips.findRows(row.obj.service_id, 'service_id'));
  }
  return listOfTrains;
}

function reformat(listOfTrains) {
  let reformat = []
  console.log(listOfTrains.length);
  for (let i = 0; i < listOfTrains.length; i++) {
    trip_id = listOfTrains[i].obj.trip_id;
    trainObject = {
      overallTrainInfo: listOfTrains[i],
      stops: stop_times.findRows(trip_id, 'trip_id')
    };
    reformat.push(trainObject);
  }
  //console.log(reformat);
  return reformat;
}

function getStopingTrainsAtStop(station, asNumber) {
  if (asNumber == false) {
    stop_num = stationList.findRow(station, 'stop_name')
    if (stop_num == null)
      return 'Error'
    else {
      stop_num = stationList.findRow(station, 'stop_name').obj.stop_id;
    }
  } else {
    stop_num = station
  }

  allTrains = []
  count = 0
  for (let train of reformated) {
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
    return a[1].obj.arrival_time.localeCompare(b[1].obj.arrival_time);
  });

  // if (railroad == 'MNRR') {
  //   allTrains = cleanAllTrains(allTrains) 
  // }

  return allTrains;

}

function displayStoppingTrains(allTrains, stationName) {
  let tablecontainer = document.getElementById('tablecontainer');
  tablecontainer.innerHTML = '';
  let overlayinner = document.getElementById('overlayinner');
  overlayinner.innerHTML = '';
  let overlay = document.getElementById('overlay');

  let htmlTable = document.createElement('table');
  htmlTable.setAttribute('id', 'thetable');
  let dontmissthetrain = []

  for (train of allTrains) {
    let arrival_time = train[1].obj.arrival_time;
    if (railroad == 'MNR') { // since MNR starts days at 4...
      if (parseInt(arrival_time.substring(0, 2)) < 4) {
        arrival_time = (parseInt(arrival_time.substring(0, 2)) + 24) + arrival_time.substring(2);
      }
    }
    let line = lineNumToStr(train[0].overallTrainInfo.obj.route_id);
    let headsign = train[0].overallTrainInfo.obj.trip_headsign;
    let track = train[1].obj.track;
    let direction = train[0].overallTrainInfo.obj.direction_id;



    if (direction == 0) {
      direction = abc.meta[abc.railroad.id].direction0;
    } else {
      direction = abc.meta[abc.railroad.id].direction1;
    }

    let shortname = train[0].overallTrainInfo.obj.trip_short_name;
    let origin = stopnumToStr(train[0].stops[0].obj.stop_id);

    dontmissthetrain.push([arrival_time, line, origin, headsign, track, direction, shortname]);
    // console.log(`${depature_time} ${line} ${headsign} ${track} ${direction} ${shortname}`);

  }

  dontmissthetrain.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  let head = ['Arrival/Depature Time', 'Line', 'Origin', 'Terminus', 'Track', 'Direction', 'Train Number']
  let headerRow = document.createElement('thead');
  let headerTr = document.createElement('tr');
  for (let h of head) {
    let th = document.createElement('th');
    th.innerText = h;
    headerTr.appendChild(th);
  }
  headerRow.appendChild(headerTr);

  htmlTable.appendChild(headerRow);


  for (let row of dontmissthetrain) {
    let r = document.createElement('tr');
    r.setAttribute('id', row[row.length - 1]);

    for (let [index, col] of row.entries()) {
      let c = document.createElement('td');
      c.innerText = col;

      if (head[index] == 'Line') {
        if (col == 'Harlem') {
          c.style.background = '#0039A6';
          c.style.color = '#FFFFFF';
        } else if (col == 'Hudson') {
          c.style.background = '#009B3A';
          c.style.color = '#FFFFFF';
        } else if (col == 'Waterbury' || col == 'Danbury' || col == 'New Canaan' || col == 'New Haven') {
          c.style.background = '#EE0034';
          c.style.color = '#FFFFFF';
        }
      }

      if (head[index] == 'Train Number') {
        r.setAttribute('stopsVisible', 'false');
        c.addEventListener('click', () => {
          displayTrains(findByTrainNumber(col), stationName)
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

function lineNumToStr(num) {
  return routes.findRow(num, 'route_id').obj.route_long_name;
}

function stopnumToStr(num) {
  return stationList.findRow(num, 'stop_id').obj.stop_name;
}

function close() {
  document.getElementById('overlay').style.display = '';
}

function findByTrainNumber(num) {
  for (let train of reformated) {
    if (train.overallTrainInfo.obj.trip_short_name == num) {
      // console.log(train);
      return train;
    }
  }
  return 'None Found...';
}

function displayTrains(train, stationName) {

  let stops = train.stops;
  let trip_short_name = train.overallTrainInfo.obj.trip_short_name;

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
    let stopName = stopnumToStr(stop.obj.stop_id);
    let time = stop.obj.arrival_time;
    let track = stop.obj.track;
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
