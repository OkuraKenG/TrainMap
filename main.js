let searchMode = 'DATE';

function SET_SEARCH_MODE(MODE) {
    searchMode = MODE;
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

        // if we get invalid x, y values we ignore
        if (Number.isNaN(x) || Number.isNaN(y)) {
            continue;
        }

        ellipse(x * fsize + diameter + overallXOffset, y * fsize + diameter + overallYOffset, diameter, diameter);

        // handles line header + special stations
        if (currentStop.stop_id == "LINE") {
            textStyle(BOLDITALIC);
        }

        if (currentStop.color == "#8F8F8F") {
            textStyle(ITALIC);
        }

        // draws the text 
        fill(255);
        if (currentStop.location == "right") { // handles the side text is displayed on
            text(currentStop.map_display_name, x * fsize + fsize + overallXOffset + 5, y * fsize + fsize + overallYOffset);
        } else if (currentStop.location == "left") {
            text(currentStop.map_display_name, x * fsize + fsize + overallXOffset - textWidth(currentStop.map_display_name) - 15, y * fsize + fsize + overallYOffset);
        } else if (currentStop.location == "up") {
            rotate(-(PI / 2.0));
            text(currentStop.map_display_name, -1 * (y * fsize + fsize + overallYOffset - 15), (x * fsize + fsize + overallXOffset));
            rotate((PI / 2.0));
        } else if (currentStop.location == "down") {
            rotate(-(PI / 2.0));
            text(currentStop.map_display_name, -1 * (y * fsize + fsize + overallYOffset + textWidth(currentStop.map_display_name) + 5), (x * fsize + fsize + overallXOffset - 2));
            rotate((PI / 2.0));
        }

        // reset style
        textStyle(NORMAL);
    }
}

function buttonGenerator(thisReformated, thisRoutes, thisStationList) {
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
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset + 5 - 16}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.map_display_name) + 16}px; border: solid; border-color: ${bordercolor};`);
            div.addEventListener("click", function () {
                displayStoppingTrains(getStopingTrainsAtStop(currentStop, thisReformated), currentStop, thisRoutes, thisStationList, thisReformated);
                //console.log(thisReformated, thisRoutes, thisStationList);
            }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "left") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - textWidth(currentStop.map_display_name) - 15}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.map_display_name) + 15}px; border: solid; border-color: ${bordercolor};`);
            div.addEventListener("click", function () {
                displayStoppingTrains(getStopingTrainsAtStop(currentStop, thisReformated), currentStop, thisRoutes, thisStationList, thisReformated);
                //console.log(thisReformated, thisRoutes, thisStationList);
            }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "up") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 10}px; top: ${y * fsize + overallYOffset - textWidth(currentStop.stop_name) - 3}px; height: ${textWidth(currentStop.map_display_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
            div.addEventListener("click", function () {
                displayStoppingTrains(getStopingTrainsAtStop(currentStop, thisReformated), currentStop, thisRoutes, thisStationList, thisReformated);
                //console.log(thisReformated, thisRoutes, thisStationList);
            }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "down") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 12}px; top: ${y * fsize + overallYOffset + 3}px; height: ${textWidth(currentStop.map_display_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
            div.addEventListener("click", function () {
                displayStoppingTrains(getStopingTrainsAtStop(currentStop, thisReformated), currentStop, thisRoutes, thisStationList, thisReformated);
                //console.log(thisReformated, thisRoutes, thisStationList);
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

function getTodayDay() {
    const todayDate = new Date();
    const day = todayDate.getDay();
    return day;
}

// gets all services run today
function getServices(currentCalander, currentCaladerDates) {
    let allServices = [];
    if (searchMode == 'DATE') {
        // DATE, based of MMDDYYYY
        allServices.push(currentCaladerDates.findRows(getTodayDateStr(), 'date'));
    } else {
        let day = getTodayDay();
        if (day == '0') {
            allServices.push(currentCalander.findRows('1', 'sunday'));
        }
        if (day == '1') {
            allServices.push(currentCalander.findRows('1', 'monday'));
        }
        if (day == '2') {
            allServices.push(currentCalander.findRows('1', 'tuesday'));
        }
        if (day == '3') {
            allServices.push(currentCalander.findRows('1', 'wednesday'));
        }
        if (day == '4') {
            allServices.push(currentCalander.findRows('1', 'thursday'));
        }
        if (day == '5') {
            allServices.push(currentCalander.findRows('1', 'friday'));
        }
        if (day == '6') {
            allServices.push(currentCalander.findRows('1', 'saturday'));
        }
    }
    return allServices;
}

// converts services to trains
function getTrains(listOfServices, currentTrips, filter) {
    let listOfTrains = [];
    if (typeof filter === 'undefined') {

        for (row of listOfServices[0]) {
            listOfTrains = listOfTrains.concat(currentTrips.findRows(row.obj.service_id, 'service_id'));
        }
        return listOfTrains;
    } else {
        for (row of listOfServices[0]) {
            let temp = currentTrips.findRows(row.obj.service_id, 'service_id');

            for (let temp1 of temp) {
                if (temp1.obj.route_id.substring(0, 2) == filter)
                    listOfTrains.push(temp1);
            }
        }
        return listOfTrains;
    }
}

// gets all the stops for each of the trains
function reformat(listOfTrains, thisStopTimes) {
    let reformat = []
    console.log(listOfTrains.length);
    for (let i = 0; i < listOfTrains.length; i++) {
        trip_id = listOfTrains[i].obj.trip_id;
        trainObject = {
            overallTrainInfo: listOfTrains[i],
            stops: thisStopTimes.findRows(trip_id, 'trip_id')
        };
        reformat.push(trainObject);
    }
    return reformat;
}

// returns array of all stopping trains at stop
function getStopingTrainsAtStop(currentStop, thisReformatted) {
    let stop_num = currentStop.stop_id;
    let allTrains = []
    count = 0

    // stores all of the trains that stop at the stop
    for (let train of thisReformatted) {
        stopsArr = train.stops;
        for (let stop of stopsArr) {
            stopStats = stop.obj;
            if (stopStats.stop_id == stop_num) {
                allTrains.push([train, stop]);
                count++;
            }
        }
    }
    
    // finds stopping trains if other stop_ids are associated with stop
    if ((typeof currentStop.otherNames !== 'undefined') && currentStop.otherNames.length > 0) {
        for (let otherName of currentStop.otherNames) {
            for (let train of thisReformatted) {
                stopsArr = train.stops;
                for (let stop of stopsArr) {
                    stopStats = stop.obj;
                    if (stopStats.stop_id == otherName) {
                        allTrains.push([train, stop]);
                        count++;
                    }
                }
            }
        }
    }

    // sorts trains by time arrives at station
    allTrains.sort((a, b) => {
        let timeA = a[1].obj.arrival_time;
        if (timeA.search("[0-9]:") == 0)
            timeA = "0" + timeA;
        let timeB = b[1].obj.arrival_time;
        if (timeB.search("[0-9]:") == 0)
            timeB = "0" + timeB;
        return timeA.localeCompare(timeB);
    });

    return allTrains;
}

// handles the HTML display of array
function displayStoppingTrains(allTrains, currentStop, thisRoutes, thisStationList) {
    let tablecontainer = document.getElementById('tablecontainer');
    tablecontainer.innerHTML = '';
    let overlayinner = document.getElementById('overlayinner');
    overlayinner.innerHTML = '';
    let overlay = document.getElementById('overlay');

    let htmlTable = document.createElement('table');
    htmlTable.setAttribute('id', 'thetable');

    // converts array to table-array
    let dontmissthetrain = []
    for (train of allTrains) {
        let arrival_time = train[1].obj.arrival_time;

        let line = lineNumToStr(train[0].overallTrainInfo.obj.route_id, thisRoutes);
        let headsign = train[0].overallTrainInfo.obj.trip_headsign;
        let track = train[1].obj.track;
        if (typeof track === 'undefined')
            track = "N/A";
        let direction = "N/A";

        let shortname = train[0].overallTrainInfo.obj.trip_short_name;
        if (typeof shortname === "undefined") {
            shortname = train[0].overallTrainInfo.obj.block_id;
        }
        let origin = stopnumToStr(train[0].stops[0].obj.stop_id, thisStationList);

        dontmissthetrain.push([arrival_time, line, origin, headsign, track, direction, shortname]);
    }

    // converts array-table to table
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
                c.style.background = "#" + lineNameToColor(col, thisRoutes);
                if (typeof lineNameToTextColor(col, thisRoutes) !== "undefined")
                    c.style.color = "#" + lineNameToTextColor(col, thisRoutes);
                else
                    c.style.color = "white";

            }

            if (head[index] == 'Train Number') {
                r.setAttribute('stopsVisible', 'false');
                c.addEventListener('click', () => {
                    displayTrains(allTrains[index0][0], currentStop, thisStationList);
                });
            }




            r.appendChild(c);
        }
        htmlTable.appendChild(r);
    }

    tablecontainer.appendChild(htmlTable);
    overlay.style.display = 'grid';

    let station = document.createElement('h1');
    station.innerText = `${currentStop.div_display_name} (${dontmissthetrain.length} trains)`;
    overlayinner.appendChild(station);
    overlayinner.appendChild(htmlTable);

    let newButton = document.createElement('button');
    newButton.setAttribute('class', 'buttonExit');
    newButton.addEventListener('click', close);
    newButton.innerText = 'Exit';
    overlayinner.appendChild(newButton);
}

function lineNumToStr(num, thisRoutes) {
    return thisRoutes.findRow(num, 'route_id').obj.route_long_name;
}

function lineNameToColor(name, thisRoutes) {
    return thisRoutes.findRow(name, 'route_long_name').obj.route_color;
}

function lineNameToTextColor(name, thisRoutes) {
    return thisRoutes.findRow(name, 'route_long_name').obj.route_text_color;
}

function stopnumToStr(num, thisStationList) {
    return thisStationList.findRow(num, 'stop_id').obj.stop_name;
}

function close() {
    document.getElementById('overlay').style.display = '';
}

function findByTrainNumber(num, thisReformatted) {
    for (let train of thisReformatted) {
        if (train.overallTrainInfo.obj.trip_short_name == num) {
            // console.log(train);
            return train;
        }
    }
    return findByTrainBlockNumber(num, thisReformatted);
}

function findByTrainBlockNumber(num, thisReformatted) {
    for (let train of thisReformatted) {
        if (train.overallTrainInfo.obj.block_id == num) {
            return train;
        }
    }
    return 'None Found...';
}

// displays stops of train
function displayTrains(train, currentStop, thisStationList) {
    // console.log(train, currentStop, thisStationList);
    let stops = train.stops;
    let trip_short_name = train.overallTrainInfo.obj.trip_short_name;
    if (typeof trip_short_name === "undefined")
        trip_short_name = train.overallTrainInfo.obj.block_id

    let mainRowBool = document.getElementById(trip_short_name).getAttribute('stopsvisible')

    // hides if shown
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
        let stopName = stopnumToStr(stop.obj.stop_id, thisStationList);
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
    for (let [index_i,row] of convertedToTable.entries()) {
        let r = document.createElement('tr');
        // r.setAttribute('id',row[row.length-1]);

        if (train.stops[index_i].obj.stop_id == currentStop.stop_id) {
            r.style.background = 'black';
            r.style.color = 'white';
        }

        if ((typeof currentStop.otherNames !== 'undefined') && currentStop.otherNames.length > 0) {
            console.log('Start Loop',index_i);
            console.log(currentStop.stop_id);
            console.log(currentStop.otherNames);
            console.log(train.stops[index_i].obj.stop_id);
            for (let otherName of currentStop.otherNames) {
                console.log(train.stops[index_i].obj.stop_id,otherName,train.stops[index_i].obj.stop_id == otherName.stop_id);
                if (train.stops[index_i].obj.stop_id == otherName) {
                    r.style.background = 'black';
                    r.style.color = 'white';
                }
            }
        }

        for (let [index_j, col] of row.entries()) {
            let c = document.createElement('td');
            c.innerText = col;
            if (index_j == 0) {
                c.setAttribute('align', 'right');
                c.setAttribute('style', 'font-weight: bold;');
            }

            r.appendChild(c);
        }
        r.setAttribute('class', `RandomPickels${trip_short_name}`);
        document.getElementById('thetable').insertBefore(r, temp.nextSibling);
        temp = r;
    }
    document.getElementById(trip_short_name).setAttribute('stopsvisible', 'true');
}
