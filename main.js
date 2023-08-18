
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
                displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, false), currentStop.stop_name);
            }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "left") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - textWidth(currentStop.stop_name) - 15}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.stop_name) + 15}px; border: solid; border-color: ${bordercolor};`);
            div.addEventListener("click", function () {
                displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, false), currentStop.stop_name);
            }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "up") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 10}px; top: ${y * fsize + overallYOffset - textWidth(currentStop.stop_name) - 3}px; height: ${textWidth(currentStop.stop_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
            div.addEventListener("click", function () {
                displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, false), currentStop.stop_name);
            }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "down") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 12}px; top: ${y * fsize + overallYOffset + 3}px; height: ${textWidth(currentStop.stop_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
            div.addEventListener("click", function () {
                displayStoppingTrains(getStopingTrainsAtStop(currentStop.stop_id, false), currentStop.stop_name);
            }, false);
            document.body.appendChild(div);
        }
        // reset style
        textStyle(NORMAL);
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

function getStopingTrainsAtStop(stop_num, asNumber) {
    // if (asNumber == false) {
    //     stop_num = stationList.findRow(station, 'stop_name')
    //     if (stop_num == null)
    //         return 'Error'
    //     else {
    //         stop_num = stationList.findRow(station, 'stop_name').obj.stop_id;
    //     }
    // } else {
    //     stop_num = station
    // }

    allTrains = []
    count = 0
    for (let train of reformated) {
        stopsArr = train.stops;
        for (let stop of stopsArr) {
            stopStats = stop.obj;
            if (stopStats.stop_id == stop_num) {
                //console.log(stopStats);
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
        // if (railroad == 'MNR') { // since MNR starts days at 4...
        //     if (parseInt(arrival_time.substring(0, 2)) < 4) {
        //         arrival_time = (parseInt(arrival_time.substring(0, 2)) + 24) + arrival_time.substring(2);
        //     }
        // }
        let line = lineNumToStr(train[0].overallTrainInfo.obj.route_id);
        let headsign = train[0].overallTrainInfo.obj.trip_headsign;
        let track = train[1].obj.track;
        if (typeof track === 'undefined')
            track = "N/A";
        let direction = "N/A";
        // let direction = train[0].overallTrainInfo.obj.direction_id;

        // if (direction == 0) {
        //     direction = abc.meta[abc.railroad.id].direction0;
        // } else {
        //     direction = abc.meta[abc.railroad.id].direction1;
        // }

        let shortname = train[0].overallTrainInfo.obj.trip_short_name;
        if (typeof shortname === "undefined") {
            shortname = train[0].overallTrainInfo.obj.block_id;
        }
        let origin = stopnumToStr(train[0].stops[0].obj.stop_id);

        dontmissthetrain.push([arrival_time, line, origin, headsign, track, direction, shortname]);
        // console.log(`${depature_time} ${line} ${headsign} ${track} ${direction} ${shortname}`);

    }

    // dontmissthetrain.sort((a, b) => {
    //     return a[0].localeCompare(b[0]);
    // });

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


    for (let [index0, row] of dontmissthetrain.entries()) {
        let r = document.createElement('tr');
        r.setAttribute('id', row[row.length - 1]);

        for (let [index, col] of row.entries()) {
            let c = document.createElement('td');
            c.innerText = col;

            if (head[index] == 'Line') {
                c.style.background = "#" + lineNameToColor(col);
                if (typeof lineNameToTextColor(col) !== "undefined")
                    c.style.color = "#" + lineNameToTextColor(col);
                else
                    c.style.color = "white";

            }

            if (head[index] == 'Train Number') {
                r.setAttribute('stopsVisible', 'false');
                c.addEventListener('click', () => {
                    //displayTrains(findByTrainNumber(col), stationName)
                    displayTrains(allTrains[index0][0], stationName)
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

function lineNameToColor(name) {
    return routes.findRow(name, 'route_long_name').obj.route_color;
}

function lineNameToTextColor(name) {
    return routes.findRow(name, 'route_long_name').obj.route_text_color;
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
function displayTrains(train, stationName) {

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
        let stopName = stopnumToStr(stop.obj.stop_id);
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
