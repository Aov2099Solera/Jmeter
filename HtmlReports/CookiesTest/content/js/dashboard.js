/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9646666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.91, 500, 1500, "/otcc/lib/modules/alerts/dynamicForms.js-118"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-141"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-142"], "isController": false}, {"data": [0.65, 500, 1500, "/otcc/initializeAlertsConf.action-123"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-100"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-101"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-103"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-104"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-139"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-91"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-140"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-96"], "isController": false}, {"data": [0.99, 500, 1500, "/otcc/listOfMacrosRespondeAlertsConfJson.action-120"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-99"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-102"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-106"], "isController": false}, {"data": [1.0, 500, 1500, "/otcc/newMenu.action-95"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-92"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-93"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-97"], "isController": false}, {"data": [0.97, 500, 1500, "/otcc/listAlertsConfJson.action?ql=15&qo=0-122"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-98"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-111"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-112"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-116"], "isController": false}, {"data": [0.9, 500, 1500, "/canonical.html-81"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-108"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-109"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-130"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-85"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-88"], "isController": false}, {"data": [1.0, 500, 1500, "/otcc/newAdmin.action-105"], "isController": false}, {"data": [1.0, 500, 1500, "/otcc/alertView.action-113"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-137"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-90"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-82"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-83"], "isController": false}, {"data": [0.99, 500, 1500, "/otcc/listOfPeripheralsAlertsConfJson.action-121"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-86"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-87"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-89"], "isController": false}, {"data": [0.99, 500, 1500, "/otcc/doLogin2.action-94"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-125"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-126"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-117"], "isController": false}, {"data": [0.57, 500, 1500, "/otcc/doLogout2.action-84"], "isController": false}, {"data": [1.0, 500, 1500, "/otcc/doLogout2.action-136"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-124"], "isController": false}, {"data": [0.94, 500, 1500, "/otcc/lib/modules/alerts/alertsView.js-119"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-127"], "isController": false}, {"data": [0.0, 500, 1500, "/otcc/lib/telerik/2018.2.516/js/kendo.all.min.js-114"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-131"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-132"], "isController": false}, {"data": [0.99, 500, 1500, "/otcc/listUserJson.action?ql=15&qo=0-135"], "isController": false}, {"data": [0.98, 500, 1500, "/otcc/usersView.action-133"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-138"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-128"], "isController": false}, {"data": [1.0, 500, 1500, "/success.txt-129"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-110"], "isController": false}, {"data": [1.0, 500, 1500, "/canonical.html-115"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3000, 0, 0.0, 234.39666666666676, 60, 18318, 64.0, 262.40000000000055, 525.8999999999996, 5518.269999999962, 118.40858856962424, 1977.601273262354, 54.841061138301235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/otcc/lib/modules/alerts/dynamicForms.js-118", 50, 0, 0.0, 271.32, 132, 937, 160.0, 672.6999999999999, 859.1999999999995, 937.0, 2.9423880421349966, 10.9453387056435, 2.741248234567175], "isController": false}, {"data": ["/success.txt-141", 50, 0, 0.0, 63.719999999999985, 62, 84, 63.0, 64.9, 67.89999999999999, 84.0, 3.085277057879798, 0.6506801107614464, 0.9822268758484513], "isController": false}, {"data": ["/success.txt-142", 50, 0, 0.0, 63.60000000000001, 61, 80, 63.0, 65.0, 66.0, 80.0, 3.0850866909360155, 0.650639962670451, 0.982166270747208], "isController": false}, {"data": ["/otcc/initializeAlertsConf.action-123", 50, 0, 0.0, 637.6399999999998, 401, 1430, 543.5, 1249.7999999999993, 1377.4999999999998, 1430.0, 2.962962962962963, 74.24982638888889, 2.5318287037037037], "isController": false}, {"data": ["/success.txt-100", 50, 0, 0.0, 63.37999999999999, 61, 67, 63.0, 64.0, 65.44999999999999, 67.0, 110.13215859030836, 23.22670016519824, 35.06160517621145], "isController": false}, {"data": ["/success.txt-101", 50, 0, 0.0, 63.52000000000001, 60, 66, 63.5, 65.0, 65.44999999999999, 66.0, 109.89010989010988, 23.17565247252747, 34.9845467032967], "isController": false}, {"data": ["/success.txt-103", 50, 0, 0.0, 63.86, 60, 78, 63.0, 65.0, 71.49999999999996, 78.0, 108.22510822510823, 22.82450622294372, 34.45447781385281], "isController": false}, {"data": ["/success.txt-104", 50, 0, 0.0, 64.08, 61, 72, 64.0, 66.9, 68.79999999999998, 72.0, 107.75862068965516, 22.72612473060345, 34.30596713362069], "isController": false}, {"data": ["/success.txt-139", 50, 0, 0.0, 63.32000000000001, 61, 78, 63.0, 64.0, 65.44999999999999, 78.0, 3.0848963474827245, 0.6505998195335637, 0.9821056731243831], "isController": false}, {"data": ["/canonical.html-91", 50, 0, 0.0, 65.59999999999994, 60, 107, 65.0, 67.0, 68.0, 107.0, 87.26003490401396, 25.388920702443283, 27.60962041884817], "isController": false}, {"data": ["/canonical.html-140", 50, 0, 0.0, 63.26000000000001, 61, 66, 63.0, 64.0, 65.0, 66.0, 3.085277057879798, 0.8976830533444403, 0.9762009440947798], "isController": false}, {"data": ["/canonical.html-96", 50, 0, 0.0, 62.80000000000001, 61, 65, 63.0, 64.0, 64.44999999999999, 65.0, 111.60714285714286, 32.47288295200893, 35.313197544642854], "isController": false}, {"data": ["/otcc/listOfMacrosRespondeAlertsConfJson.action-120", 50, 0, 0.0, 173.4, 138, 860, 152.5, 226.39999999999992, 235.0, 860.0, 2.9918621349928194, 7.030759147618478, 2.9626447313307804], "isController": false}, {"data": ["/canonical.html-99", 50, 0, 0.0, 63.519999999999996, 61, 66, 64.0, 65.0, 65.44999999999999, 66.0, 110.61946902654867, 32.18551230641593, 35.00069137168141], "isController": false}, {"data": ["/canonical.html-102", 50, 0, 0.0, 64.03999999999999, 61, 77, 64.0, 65.0, 69.35, 77.0, 109.89010989010988, 31.973300137362635, 34.769917582417584], "isController": false}, {"data": ["/canonical.html-106", 50, 0, 0.0, 67.08, 61, 80, 65.0, 75.9, 77.0, 80.0, 106.60980810234541, 31.01887326759062, 33.73200959488273], "isController": false}, {"data": ["/otcc/newMenu.action-95", 50, 0, 0.0, 157.89999999999995, 132, 213, 146.5, 201.29999999999998, 209.89999999999998, 213.0, 89.28571428571429, 328.01339285714283, 80.65359933035714], "isController": false}, {"data": ["/success.txt-92", 50, 0, 0.0, 64.16000000000001, 62, 69, 64.0, 66.0, 68.0, 69.0, 87.10801393728224, 18.370944033101047, 27.73165287456446], "isController": false}, {"data": ["/success.txt-93", 50, 0, 0.0, 70.14, 62, 105, 65.0, 93.0, 98.59999999999997, 105.0, 87.56567425569177, 18.46746387915937, 27.877353327495623], "isController": false}, {"data": ["/success.txt-97", 50, 0, 0.0, 63.02000000000001, 60, 65, 63.0, 64.9, 65.0, 65.0, 111.1111111111111, 23.43315972222222, 35.373263888888886], "isController": false}, {"data": ["/otcc/listAlertsConfJson.action?ql=15&qo=0-122", 50, 0, 0.0, 364.67999999999995, 269, 1280, 310.5, 368.6, 1090.8499999999997, 1280.0, 2.985609362870962, 10.501997559264346, 2.816502582552099], "isController": false}, {"data": ["/success.txt-98", 50, 0, 0.0, 63.559999999999995, 61, 67, 64.0, 65.0, 65.44999999999999, 67.0, 110.61946902654867, 23.32947317477876, 35.216745022123895], "isController": false}, {"data": ["/success.txt-111", 50, 0, 0.0, 63.82, 61, 68, 63.5, 66.0, 67.0, 68.0, 107.06638115631692, 22.58013249464668, 34.08558618843683], "isController": false}, {"data": ["/success.txt-112", 50, 0, 0.0, 63.56, 61, 68, 63.0, 66.0, 66.44999999999999, 68.0, 107.06638115631692, 22.58013249464668, 34.08558618843683], "isController": false}, {"data": ["/success.txt-116", 50, 0, 0.0, 64.42, 61, 74, 63.5, 68.9, 73.44999999999999, 74.0, 102.04081632653062, 21.520248724489797, 32.48565051020408], "isController": false}, {"data": ["/canonical.html-81", 50, 0, 0.0, 422.91999999999996, 123, 1442, 126.5, 1380.3, 1440.0, 1442.0, 34.65003465003465, 10.081671214483714, 10.963487525987526], "isController": false}, {"data": ["/success.txt-108", 50, 0, 0.0, 63.66000000000001, 61, 76, 63.0, 64.9, 66.0, 76.0, 106.83760683760683, 22.531884348290596, 34.01275373931624], "isController": false}, {"data": ["/success.txt-109", 50, 0, 0.0, 64.23999999999998, 62, 82, 64.0, 66.0, 67.89999999999999, 82.0, 106.60980810234541, 22.48384195095949, 33.940231876332625], "isController": false}, {"data": ["/canonical.html-130", 50, 0, 0.0, 63.71999999999999, 61, 75, 63.0, 65.9, 68.35, 75.0, 3.065791894046232, 0.8920137079220062, 0.9700357164755655], "isController": false}, {"data": ["/canonical.html-85", 50, 0, 0.0, 66.5, 61, 72, 65.5, 71.0, 71.0, 72.0, 93.10986964618249, 27.090971252327744, 29.46054469273743], "isController": false}, {"data": ["/canonical.html-88", 50, 0, 0.0, 64.3, 62, 68, 64.0, 66.9, 67.0, 68.0, 88.0281690140845, 25.61241472271127, 27.85266285211268], "isController": false}, {"data": ["/otcc/newAdmin.action-105", 50, 0, 0.0, 146.66000000000003, 135, 214, 145.0, 154.0, 173.99999999999991, 214.0, 92.76437847866418, 416.5682253014842, 83.70535714285714], "isController": false}, {"data": ["/otcc/alertView.action-113", 50, 0, 0.0, 154.32000000000005, 134, 201, 149.0, 183.7, 190.45, 201.0, 89.12655971479501, 517.578125, 73.11163101604278], "isController": false}, {"data": ["/canonical.html-137", 50, 0, 0.0, 63.7, 62, 74, 63.0, 65.9, 67.44999999999999, 74.0, 3.0843254580223305, 0.8974061786749739, 0.975899851952378], "isController": false}, {"data": ["/success.txt-90", 50, 0, 0.0, 63.2, 60, 67, 63.0, 64.0, 65.0, 67.0, 87.10801393728224, 18.370944033101047, 27.73165287456446], "isController": false}, {"data": ["/success.txt-82", 50, 0, 0.0, 64.98, 62, 71, 65.0, 68.0, 69.44999999999999, 71.0, 46.81647940074907, 9.873522354868914, 14.904465121722845], "isController": false}, {"data": ["/success.txt-83", 50, 0, 0.0, 63.79999999999998, 62, 67, 64.0, 66.9, 67.0, 67.0, 46.72897196261682, 9.855067172897195, 14.876606308411214], "isController": false}, {"data": ["/otcc/listOfPeripheralsAlertsConfJson.action-121", 50, 0, 0.0, 172.61999999999998, 137, 836, 149.0, 170.7, 353.99999999999886, 836.0, 2.99096727881797, 6.014180923610696, 2.9529960145361014], "isController": false}, {"data": ["/success.txt-86", 50, 0, 0.0, 65.48000000000002, 61, 70, 65.0, 69.0, 70.0, 70.0, 94.87666034155598, 20.00933942125237, 30.204874288425046], "isController": false}, {"data": ["/success.txt-87", 50, 0, 0.0, 66.91999999999999, 61, 103, 64.0, 65.0, 102.0, 103.0, 88.65248226950355, 18.696669991134755, 28.223348847517734], "isController": false}, {"data": ["/success.txt-89", 50, 0, 0.0, 64.22, 61, 70, 64.0, 66.0, 69.0, 70.0, 86.95652173913044, 18.338994565217394, 27.68342391304348], "isController": false}, {"data": ["/otcc/doLogin2.action-94", 50, 0, 0.0, 349.38, 199, 506, 347.5, 445.6, 489.29999999999995, 506.0, 70.0280112044818, 70.73376225490196, 75.22540266106444], "isController": false}, {"data": ["/success.txt-125", 50, 0, 0.0, 63.98000000000001, 61, 93, 63.0, 65.9, 66.44999999999999, 93.0, 3.066167903354388, 0.6466500199300914, 0.9761432973569634], "isController": false}, {"data": ["/success.txt-126", 50, 0, 0.0, 63.7, 61, 90, 63.0, 64.0, 65.44999999999999, 90.0, 3.0665440049064703, 0.6467293391597669, 0.9762630328120209], "isController": false}, {"data": ["/success.txt-117", 50, 0, 0.0, 64.3, 61, 75, 63.0, 73.0, 73.89999999999999, 75.0, 99.8003992015968, 21.047748253493015, 31.77239271457086], "isController": false}, {"data": ["/otcc/doLogout2.action-84", 50, 0, 0.0, 891.6999999999998, 303, 1628, 943.0, 1200.1, 1514.1999999999998, 1628.0, 30.712530712530715, 93.12315244932434, 17.005864173832926], "isController": false}, {"data": ["/otcc/doLogout2.action-136", 50, 0, 0.0, 149.2, 135, 178, 146.5, 166.8, 175.45, 178.0, 3.0652280529671407, 9.29590274797695, 2.7718761494605197], "isController": false}, {"data": ["/canonical.html-124", 50, 0, 0.0, 64.10000000000005, 62, 67, 64.0, 65.0, 66.0, 67.0, 3.065791894046232, 0.8920137079220062, 0.9700357164755655], "isController": false}, {"data": ["/otcc/lib/modules/alerts/alertsView.js-119", 50, 0, 0.0, 288.2600000000001, 138, 2326, 185.5, 295.09999999999997, 1341.049999999993, 2326.0, 2.957529871051698, 34.256802780817466, 2.7495785519933755], "isController": false}, {"data": ["/canonical.html-127", 50, 0, 0.0, 63.76, 61, 95, 63.0, 64.9, 65.0, 95.0, 3.0669201987364287, 0.8923419961050113, 0.9703927191314482], "isController": false}, {"data": ["/otcc/lib/telerik/2018.2.516/js/kendo.all.min.js-114", 50, 0, 0.0, 6615.620000000002, 1580, 18318, 6058.5, 10424.6, 12982.299999999994, 18318.0, 2.7104678267468967, 2473.074943164878, 2.5463574700493306], "isController": false}, {"data": ["/success.txt-131", 50, 0, 0.0, 64.4, 61, 97, 63.5, 65.9, 71.44999999999999, 97.0, 3.064476587398872, 0.6462933240377544, 0.9756048510664379], "isController": false}, {"data": ["/success.txt-132", 50, 0, 0.0, 63.580000000000005, 61, 76, 63.0, 64.9, 70.59999999999997, 76.0, 3.06597988717194, 0.6466103676109884, 0.9760834406426294], "isController": false}, {"data": ["/otcc/listUserJson.action?ql=15&qo=0-135", 50, 0, 0.0, 240.6199999999999, 191, 1062, 219.5, 256.6, 281.74999999999994, 1062.0, 3.047851264858275, 11.24407097683633, 2.8573605608046324], "isController": false}, {"data": ["/otcc/usersView.action-133", 50, 0, 0.0, 202.05999999999995, 138, 886, 159.5, 251.9, 565.3499999999989, 886.0, 3.0504545177231406, 18.322626555731805, 2.502325971569764], "isController": false}, {"data": ["/success.txt-138", 50, 0, 0.0, 63.70000000000001, 61, 85, 63.0, 64.9, 67.79999999999998, 85.0, 3.084706027515578, 0.6505596813498674, 0.9820450829785922], "isController": false}, {"data": ["/success.txt-128", 50, 0, 0.0, 63.98, 62, 80, 63.0, 65.0, 71.59999999999997, 80.0, 3.0665440049064703, 0.6467293391597669, 0.9762630328120209], "isController": false}, {"data": ["/success.txt-129", 50, 0, 0.0, 63.62, 61, 94, 63.0, 64.0, 65.0, 94.0, 3.066167903354388, 0.6466500199300914, 0.9761432973569634], "isController": false}, {"data": ["/canonical.html-110", 50, 0, 0.0, 63.599999999999994, 61, 69, 63.0, 65.0, 66.44999999999999, 69.0, 107.2961373390558, 31.218565584763947, 33.949168454935624], "isController": false}, {"data": ["/canonical.html-115", 50, 0, 0.0, 63.599999999999994, 61, 68, 63.0, 66.9, 67.0, 68.0, 103.30578512396694, 30.057544550619834, 32.68659607438017], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
