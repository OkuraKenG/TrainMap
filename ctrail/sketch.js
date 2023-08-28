let stationList, calendar_dates, routes, stop_times, trips;
let reformated;
let gridmap;
let linesmap;

let stationListHF, routesHF, stop_timesHF, tripsHF, calendarHF;
let reformatedHF;

function preload() {
    calendar = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_sle/calendar.txt`, "csv", "header");
    routes = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_sle/routes.txt`, "csv", "header");
    stop_times = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_sle/stop_times.txt`, "csv", "header");
    stationList = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_sle/stops.txt`, "csv", "header");
    trips = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_sle/trips.txt`, "csv", "header");

    calendarHF = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_hartford/calendar.txt`, "csv", "header");
    routesHF = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_hartford/routes.txt`, "csv", "header");
    stop_timesHF = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_hartford/stop_times.txt`, "csv", "header");
    stationListHF = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_hartford/stops.txt`, "csv", "header");
    tripsHF = loadTable(`https://okurakeng-gtfs-data.pages.dev/GTFSData/ctrail_hartford/trips.txt`, "csv", "header");

    gridmap = loadJSON(`./data/stops.json`);
    linesmap = loadJSON(`./data/lines.json`);
}

function setup() {
    noLoop();
    pixelDensity(3); // keep it low or else slower browsers may struggle
    createCanvas(1300, 690);
    SET_SEARCH_MODE('DAY');
    canvasDrawer();
    reformated = reformat(getTrains(getServices(calendar), trips), stop_times);
    reformatedHF = reformat(getTrains(getServices(calendarHF), tripsHF), stop_timesHF);
    buttonGeneratorB(reformated, routes, stationList);
    buttonGeneratorB(reformatedHF, routesHF, stationListHF);
    console.log('Ready');
}

function draw() {
    canvasDrawer();
}

function buttonGeneratorB() {
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
            if (currentStop.agency == 0)
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformated), currentStop,routes,stationList,reformated);
                }, false);
            else
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformatedHF), currentStop,routesHF,stationListHF,reformatedHF);
                }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "left") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - textWidth(currentStop.stop_name) - 15}px; top: ${y * fsize + overallYOffset + 5}px; height: 9px; width: ${textWidth(currentStop.stop_name) + 15}px; border: solid; border-color: ${bordercolor};`);
            if (currentStop.agency == 0)
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformated), currentStop,routes,stationList,reformated);
                }, false);
            else
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformatedHF), currentStop,routesHF,stationListHF,reformatedHF);
                }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "up") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 10}px; top: ${y * fsize + overallYOffset - textWidth(currentStop.stop_name) - 3}px; height: ${textWidth(currentStop.stop_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
            if (currentStop.agency == 0)
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformated), currentStop,routes,stationList,reformated);
                }, false);
            else
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformatedHF), currentStop,routesHF,stationListHF,reformatedHF);
                }, false);
            document.body.appendChild(div);
        } else if (currentStop.location == "down") {
            let div = document.createElement("div");
            div.setAttribute("style", `position: absolute; left: ${x * fsize + fsize + overallXOffset - 12}px; top: ${y * fsize + overallYOffset + 3}px; height: ${textWidth(currentStop.stop_name) + 16}px; width: 9px; border: solid; border-color: ${bordercolor};  `);
            if (currentStop.agency == 0)
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformated), currentStop,routes,stationList,reformated);
                }, false);
            else
                div.addEventListener("click", function () {
                    displayStoppingTrains(getStopingTrainsAtStop(currentStop, reformatedHF), currentStop,routesHF,stationListHF,reformatedHF);
                }, false);
            document.body.appendChild(div);
        }
        // reset style
        textStyle(NORMAL);
    }
}