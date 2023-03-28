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

    var data = {"OkPercent": 87.16360856269114, "KoPercent": 12.836391437308869};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.20196228338430172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10043103448275863, 500, 1500, "/otcc/newAdmin.action-288"], "isController": false}, {"data": [0.2910544511668107, 500, 1500, "/otcc/resources/sonidos/LOW.ogg-339"], "isController": false}, {"data": [0.22096013716245178, 500, 1500, "/otcc/listDevicesJsonV2.action?ql=50&qo=0-181"], "isController": false}, {"data": [0.28719723183391005, 500, 1500, "/otcc/resources/libs/bootstrap/fonts/glyphicons-halflings-regular.woff2-326"], "isController": false}, {"data": [1.0, 500, 1500, "/ws/maya-websocket/info-342"], "isController": false}, {"data": [0.09973637961335677, 500, 1500, "/otcc/feedbackView.action-347"], "isController": false}, {"data": [0.19621052631578947, 500, 1500, "/otcc/lib/modules/alerts/alertsView.js-88"], "isController": false}, {"data": [0.09753954305799649, 500, 1500, "/otcc/loadConfAlertModule.action-324"], "isController": false}, {"data": [0.19788519637462235, 500, 1500, "/otcc/resources/sonidos/MEDIUM.ogg-338"], "isController": false}, {"data": [0.20021052631578948, 500, 1500, "/otcc/vectorView.action-60"], "isController": false}, {"data": [0.21699318568994888, 500, 1500, "/otcc/lib/telerik/2018.2.516/styles/fonts/glyphs/WebComponentsIcons.ttf-175"], "isController": false}, {"data": [0.23813708260105448, 500, 1500, "/otcc/doLogout2.action-357"], "isController": false}, {"data": [0.03645383951682485, 500, 1500, "/otcc/loadGeoreferencesNewMonitor.action-327"], "isController": false}, {"data": [0.1726315789473684, 500, 1500, "/otcc/newMenu.action-13"], "isController": false}, {"data": [0.9978947368421053, 500, 1500, "/canonical.html-56"], "isController": false}, {"data": [0.15417017691659646, 500, 1500, "/otcc/listAlertsConfJson.action?ql=15&qo=0-94"], "isController": false}, {"data": [0.1311511423550088, 500, 1500, "/otcc/monitor/loadRealTimeAlertsWS.action-340"], "isController": false}, {"data": [0.25970664365832613, 500, 1500, "/otcc/notificationCenterView.action-299"], "isController": false}, {"data": [0.2033432077867118, 500, 1500, "/otcc/reportsView.action-98"], "isController": false}, {"data": [0.16905263157894737, 500, 1500, "/otcc/lib/telerik/2018.2.516/js/kendo.all.min.js-86"], "isController": false}, {"data": [0.16222030981067126, 500, 1500, "/otcc/newMenu.action-237"], "isController": false}, {"data": [0.18345477925417916, 500, 1500, "/otcc/newMonitorBeta.action-188"], "isController": false}, {"data": [0.15751318101933215, 500, 1500, "/otcc/lib/modules/alerts/dynamicForms.js-349"], "isController": false}, {"data": [0.267578947368421, 500, 1500, "/otcc/lib/modules/vector/vectorController.js-73"], "isController": false}, {"data": [0.28877118644067795, 500, 1500, "/otcc/lib/js/jquery.fileDownload.js-101"], "isController": false}, {"data": [0.004089539388721481, 500, 1500, "/otcc/newMenu.action-278"], "isController": false}, {"data": [0.15178947368421053, 500, 1500, "/otcc/initializeAlertsConf.action-92"], "isController": false}, {"data": [0.18778947368421053, 500, 1500, "/otcc/vectorView.action-70"], "isController": false}, {"data": [0.19793459552495696, 500, 1500, "/otcc/loadMaxFleetPreferences.action-251"], "isController": false}, {"data": [0.1923728813559322, 500, 1500, "/otcc/countGeoreferenceJson.action-140"], "isController": false}, {"data": [0.24102564102564103, 500, 1500, "/otcc/deviceView.action-178"], "isController": false}, {"data": [0.1673728813559322, 500, 1500, "/otcc/initializeGeoreferenceJson.action-129"], "isController": false}, {"data": [0.11991525423728813, 500, 1500, "/otcc/listReports.action?ql=15&qo=0-105"], "isController": false}, {"data": [0.27796610169491526, 500, 1500, "/otcc/lib/js/jquery.maskedinput.min.js-102"], "isController": false}, {"data": [0.035806729939603106, 500, 1500, "/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0-325"], "isController": false}, {"data": [0.16638406104281475, 500, 1500, "/otcc/unitsGroupsView.action-166"], "isController": false}, {"data": [0.10190677966101695, 500, 1500, "/otcc/loadGeoreferencesNewMonitor.action-137"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "/otcc/unitsGroupsView.action-165"], "isController": false}, {"data": [0.17326315789473684, 500, 1500, "/otcc/doLogin2.action-12"], "isController": false}, {"data": [0.296, 500, 1500, "/otcc/newAdmin.action-30"], "isController": false}, {"data": [0.23919491525423728, 500, 1500, "/otcc/lib/js/chosen.jquery.js-100"], "isController": false}, {"data": [0.14258474576271185, 500, 1500, "/otcc/georeferenceView.action-110"], "isController": false}, {"data": [0.17276247848537005, 500, 1500, "/otcc/initializeDashboards.action-266"], "isController": false}, {"data": [0.2265263157894737, 500, 1500, "/otcc/lib/css/font/fonts/fontawesome-webfont.woff2-23"], "isController": false}, {"data": [0.22367294520547945, 500, 1500, "/otcc/initializeDeviceList.action-182"], "isController": false}, {"data": [0.04736842105263158, 500, 1500, "/otcc/obtainKeyVectorJson.action-77"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "/otcc/lib/css/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2-53"], "isController": false}, {"data": [0.1376842105263158, 500, 1500, "/otcc/alertView.action-81"], "isController": false}, {"data": [0.23768421052631578, 500, 1500, "/otcc/doLogout2.action-7"], "isController": false}, {"data": [0.1911578947368421, 500, 1500, "/otcc/lib/modules/alerts/dynamicForms.js-87"], "isController": false}, {"data": [0.21242105263157895, 500, 1500, "/otcc/lib/telerik/2018.2.516/styles/images/kendoui.woff-89"], "isController": false}, {"data": [0.21094736842105263, 500, 1500, "/otcc/lib/modules/vector/vectorController.js-61"], "isController": false}, {"data": [0.2398427260812582, 500, 1500, "/otcc/loadUnitGroupsByUserReports.action-323"], "isController": false}, {"data": [0.21242105263157895, 500, 1500, "/otcc/listOfPeripheralsAlertsConfJson.action-91"], "isController": false}, {"data": [0.1527538726333907, 500, 1500, "/otcc/newMonitorBeta.action-244"], "isController": false}, {"data": [0.18057996485061512, 500, 1500, "/otcc/lib/modules/feedback/feedback.js-350"], "isController": false}, {"data": [0.25064102564102564, 500, 1500, "/otcc/lib/modules/deviceView.js-180"], "isController": false}, {"data": [0.22542372881355932, 500, 1500, "/otcc/lib/modules/report_view.js-103"], "isController": false}, {"data": [0.1998709122203098, 500, 1500, "/otcc/dashboardView.action-258"], "isController": false}, {"data": [0.18781833616298813, 500, 1500, "/otcc/loadAvailableUnitGroupsCoverageJson.action-177"], "isController": false}, {"data": [0.12295081967213115, 500, 1500, "/otcc/resources/sonidos/HIGH.ogg-337"], "isController": false}, {"data": [0.14871244635193134, 500, 1500, "/otcc/loadMaxFleetPreferences.action-233"], "isController": false}, {"data": [0.021748681898066783, 500, 1500, "/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0-341"], "isController": false}, {"data": [0.03536842105263158, 500, 1500, "/otcc/obtainKeyVectorJson.action-62"], "isController": false}, {"data": [0.20105263157894737, 500, 1500, "/otcc/listOfMacrosRespondeAlertsConfJson.action-90"], "isController": false}, {"data": [0.23031578947368422, 500, 1500, "/otcc/validateClientCode.action-11"], "isController": false}, {"data": [0.0, 500, 1500, "/otcc/downloadImageContent.action-57"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 156960, 20148, 12.836391437308869, 13784.543112895211, 23, 61121, 2695.0, 60057.0, 60063.0, 60076.0, 7.234035139823446, 158.5815148982594, 6.596021277360493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/otcc/newAdmin.action-288", 2320, 272, 11.724137931034482, 20495.305172413828, 124, 61085, 12724.5, 60050.0, 60057.95, 60070.0, 0.10756500507943281, 0.5116467146622183, 0.09842618140569194], "isController": false}, {"data": ["/otcc/resources/sonidos/LOW.ogg-339", 2314, 277, 11.970613656006915, 12629.923076923063, 66, 61078, 1822.5, 60030.0, 60055.0, 60072.0, 0.10769167547537102, 1.0701884338029417, 0.09685940733673506], "isController": false}, {"data": ["/otcc/listDevicesJsonV2.action?ql=50&qo=0-181", 2333, 214, 9.172738962708959, 11680.387912558923, 55, 61086, 2284.0, 57416.2, 60032.3, 60062.0, 0.1081575402425557, 0.46641463320175947, 0.10328477547134413], "isController": false}, {"data": ["/otcc/resources/libs/bootstrap/fonts/glyphicons-halflings-regular.woff2-326", 2312, 245, 10.59688581314879, 11631.291522491352, 69, 61121, 1882.5, 60027.0, 60053.0, 60066.0, 0.10732101041802926, 1.8681114602963786, 0.09736447136557537], "isController": false}, {"data": ["/ws/maya-websocket/info-342", 2276, 0, 0.0, 34.609841827767966, 24, 109, 31.0, 54.0, 59.0, 70.0, 0.10717384822487899, 0.09248525934317216, 0.07849647086783128], "isController": false}, {"data": ["/otcc/feedbackView.action-347", 2276, 357, 15.685413005272407, 16448.612917398932, 274, 60127, 3399.5, 60029.0, 60031.0, 60035.0, 0.10687192085843132, 0.267569573866998, 0.08933824634259493], "isController": false}, {"data": ["/otcc/lib/modules/alerts/alertsView.js-88", 2375, 305, 12.842105263157896, 14637.608842105248, 30, 60082, 2610.0, 60030.0, 60054.2, 60069.0, 0.11101921576680411, 1.2193653137779334, 0.10458758774549796], "isController": false}, {"data": ["/otcc/loadConfAlertModule.action-324", 2276, 183, 8.040421792618629, 10446.98374340949, 439, 61089, 2574.0, 49057.60000000001, 60050.0, 60065.0, 0.10775595756460551, 0.38369889602104024, 0.0980747582521605], "isController": false}, {"data": ["/otcc/resources/sonidos/MEDIUM.ogg-338", 2317, 324, 13.983599482088907, 16280.974104445386, 118, 61088, 3156.0, 60030.0, 60054.1, 60068.0, 0.1076402411345811, 1.4200942377216144, 0.09712849883628218], "isController": false}, {"data": ["/otcc/vectorView.action-60", 2375, 166, 6.989473684210527, 8619.819789473679, 29, 60076, 2068.0, 37510.20000000009, 60029.0, 60061.0, 0.11293265271953953, 0.17562081597895277, 0.09413396321797766], "isController": false}, {"data": ["/otcc/lib/telerik/2018.2.516/styles/fonts/glyphs/WebComponentsIcons.ttf-175", 2348, 209, 8.901192504258944, 12654.496592844958, 28, 61096, 2226.0, 56664.49999999999, 60053.0, 60067.51, 0.108483878200696, 9.4828326009786, 0.10094562319529468], "isController": false}, {"data": ["/otcc/doLogout2.action-357", 2276, 194, 8.523725834797892, 11704.105887521953, 124, 61087, 1964.5, 57422.9, 60052.0, 60066.0, 0.10628669949910759, 0.3564010443129378, 0.09746407307584182], "isController": false}, {"data": ["/otcc/loadGeoreferencesNewMonitor.action-327", 2318, 272, 11.73425366695427, 13646.65918895597, 519, 61079, 4113.0, 60028.1, 60054.0, 60068.81, 0.10815618985619986, 0.19292496698156697, 0.10604376427307095], "isController": false}, {"data": ["/otcc/newMenu.action-13", 2375, 476, 20.042105263157893, 20411.491368421033, 29, 60082, 3700.0, 60032.0, 60053.0, 60067.0, 0.1129577362565749, 0.48572323567209597, 0.10341187861414224], "isController": false}, {"data": ["/canonical.html-56", 2375, 0, 0.0, 38.1225263157895, 23, 5027, 25.0, 28.0, 34.0, 130.23999999999978, 0.11294369454850985, 0.03286601138498597, 0.03573609085323944], "isController": false}, {"data": ["/otcc/listAlertsConfJson.action?ql=15&qo=0-94", 2374, 243, 10.235888795282223, 10978.088458298216, 190, 60086, 2388.5, 60026.0, 60035.0, 60065.0, 0.10943970466953497, 0.4176744762890628, 0.10460225089559387], "isController": false}, {"data": ["/otcc/monitor/loadRealTimeAlertsWS.action-340", 2276, 186, 8.172231985940247, 9931.882249560625, 279, 61100, 2475.5, 44670.50000000004, 60031.0, 60062.0, 0.10745713317305099, 0.35319587033408356, 0.09874722882406345], "isController": false}, {"data": ["/otcc/notificationCenterView.action-299", 2318, 179, 7.722174288179465, 9791.23511647973, 82, 61080, 1979.0, 44015.4, 60054.05, 60067.0, 0.10874938535250869, 0.596429007739738, 0.09897893276224425], "isController": false}, {"data": ["/otcc/reportsView.action-98", 2363, 262, 11.08760050782903, 11918.156580617871, 35, 61082, 2127.0, 60027.0, 60052.0, 60068.0, 0.10893154290996948, 0.6226898037920715, 0.09092549171493329], "isController": false}, {"data": ["/otcc/lib/telerik/2018.2.516/js/kendo.all.min.js-86", 2375, 274, 11.536842105263158, 14330.261473684199, 113, 61066, 2273.0, 60028.0, 60053.0, 60067.0, 0.11164500667355089, 90.18068953450108, 0.10626442431451023], "isController": false}, {"data": ["/otcc/newMenu.action-237", 2324, 337, 14.500860585197934, 14012.53571428569, 69, 60076, 2257.5, 60033.0, 60055.0, 60068.0, 0.10895758905548211, 0.44794620702527965, 0.09968795088879667], "isController": false}, {"data": ["/otcc/newMonitorBeta.action-188", 2333, 202, 8.658379768538362, 10459.255893699083, 311, 61084, 2264.0, 52267.799999999974, 60032.3, 60062.0, 0.10785764935418095, 2.7562794494897958, 0.0973111766027078], "isController": false}, {"data": ["/otcc/lib/modules/alerts/dynamicForms.js-349", 2276, 495, 21.748681898066785, 20563.601493848884, 152, 60093, 3110.0, 60051.0, 60058.0, 60070.0, 0.10658631794146042, 0.46806808508383957, 0.1006532904779221], "isController": false}, {"data": ["/otcc/lib/modules/vector/vectorController.js-73", 2375, 211, 8.884210526315789, 10569.305263157908, 27, 60086, 1711.0, 56979.00000000002, 60031.0, 60063.0, 0.11259066037005966, 0.21165882132476113, 0.10671988149169304], "isController": false}, {"data": ["/otcc/lib/js/jquery.fileDownload.js-101", 2360, 92, 3.8983050847457625, 6769.37669491526, 26, 60078, 1636.5, 19146.90000000002, 54808.34999999974, 60056.0, 0.11126071067024632, 0.7435711154065394, 0.10449788777905283], "isController": false}, {"data": ["/otcc/newMenu.action-278", 2323, 1166, 50.19371502367628, 45060.784330607086, 403, 61081, 60046.0, 60065.0, 60069.0, 60076.0, 0.10770344359853942, 0.5644012484546898, 0.09907875377912513], "isController": false}, {"data": ["/otcc/initializeAlertsConf.action-92", 2375, 154, 6.484210526315789, 9559.020631578958, 403, 60084, 2305.0, 41981.60000000001, 60030.0, 60062.0, 0.10978731492863408, 2.5790305178283965, 0.0951762574813699], "isController": false}, {"data": ["/otcc/vectorView.action-70", 2375, 120, 5.052631578947368, 8588.406315789496, 31, 61091, 2269.0, 32086.200000000004, 60025.2, 60065.0, 0.11291177796305346, 0.1632403458884733, 0.09412078816485843], "isController": false}, {"data": ["/otcc/loadMaxFleetPreferences.action-251", 2324, 150, 6.454388984509467, 8976.744406196205, 131, 61089, 2032.5, 40409.5, 60049.75, 60065.75, 0.10835108025187802, 0.19785139566005436, 0.10812880304016159], "isController": false}, {"data": ["/otcc/countGeoreferenceJson.action-140", 2360, 184, 7.796610169491525, 12380.997457627087, 48, 61072, 2557.5, 49933.40000000002, 60049.95, 60066.0, 0.10940015754549806, 0.17725008419118585, 0.09581196481130025], "isController": false}, {"data": ["/otcc/deviceView.action-178", 2340, 196, 8.376068376068377, 9984.126068376052, 42, 61065, 2058.5, 47896.00000000006, 60050.95, 60066.0, 0.10848039457935521, 0.2369794276782998, 0.09045506339021724], "isController": false}, {"data": ["/otcc/initializeGeoreferenceJson.action-129", 2360, 276, 11.694915254237289, 16067.704661016958, 51, 61082, 3067.5, 60028.0, 60054.0, 60067.0, 0.10970527723755419, 0.210306837743408, 0.09661426685811011], "isController": false}, {"data": ["/otcc/listReports.action?ql=15&qo=0-105", 2360, 486, 20.593220338983052, 16690.205932203415, 191, 61056, 2702.0, 60034.0, 60057.0, 60068.0, 0.11032400852374509, 0.3419044945948482, 0.1046984719943673], "isController": false}, {"data": ["/otcc/lib/js/jquery.maskedinput.min.js-102", 2360, 135, 5.720338983050848, 7670.049576271215, 28, 61090, 1630.0, 30053.900000000005, 60027.0, 60060.39, 0.11094673860779143, 0.3231228729283047, 0.10452923297888984], "isController": false}, {"data": ["/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0-325", 2318, 177, 7.635893011216566, 10682.947368421035, 397, 61091, 3611.0, 36731.99999999999, 60053.0, 60067.81, 0.10845110118571956, 1.561043094054475, 0.10040199601959195], "isController": false}, {"data": ["/otcc/unitsGroupsView.action-166", 2359, 494, 20.941076727426875, 19563.295464179682, 33, 60078, 3319.0, 60051.0, 60058.0, 60068.0, 0.10885713619901244, 0.29858887476837864, 0.09810326159560381], "isController": false}, {"data": ["/otcc/loadGeoreferencesNewMonitor.action-137", 2360, 263, 11.14406779661017, 12836.294491525434, 435, 61054, 3227.5, 60027.0, 60052.0, 60066.39, 0.10909667995226928, 0.19089472189453413, 0.1063072803074853], "isController": false}, {"data": ["/otcc/unitsGroupsView.action-165", 2359, 424, 17.97371767698177, 17712.995760915604, 38, 61079, 3609.0, 60031.0, 60054.0, 60067.0, 0.10915935864272576, 0.28281454312285165, 0.091551405534907], "isController": false}, {"data": ["/otcc/doLogin2.action-12", 2375, 385, 16.210526315789473, 16850.758736842057, 84, 61101, 3033.0, 60030.0, 60053.0, 60070.0, 0.1129619000201096, 0.2209250966198803, 0.12271949506399303], "isController": false}, {"data": ["/otcc/newAdmin.action-30", 2375, 147, 6.189473684210526, 9889.462736842086, 31, 60091, 1786.0, 45008.4, 60030.0, 60064.0, 0.11294932907622952, 0.5224866910616609, 0.1032987099004914], "isController": false}, {"data": ["/otcc/lib/js/chosen.jquery.js-100", 2360, 189, 8.008474576271187, 10495.299576271165, 30, 60084, 1964.5, 49975.50000000001, 60034.0, 60064.0, 0.11157644371644493, 1.046743180011028, 0.10413946079761649], "isController": false}, {"data": ["/otcc/georeferenceView.action-110", 2360, 444, 18.8135593220339, 18455.21398305085, 99, 60084, 3396.0, 60052.0, 60059.0, 60069.0, 0.11001668850606708, 0.8256811563375136, 0.09946585025756724], "isController": false}, {"data": ["/otcc/initializeDashboards.action-266", 2324, 274, 11.790017211703958, 13156.608003442327, 168, 61089, 2481.0, 60028.0, 60040.75, 60065.75, 0.10774971262493276, 2.0925889811986487, 0.10710836038029621], "isController": false}, {"data": ["/otcc/lib/css/font/fonts/fontawesome-webfont.woff2-23", 2375, 309, 13.010526315789473, 15986.437052631603, 40, 60094, 2569.0, 60031.0, 60055.0, 60068.0, 0.11295235336822729, 7.102612711660821, 0.10043112984396169], "isController": false}, {"data": ["/otcc/initializeDeviceList.action-182", 2336, 214, 9.16095890410959, 11605.047517123274, 121, 61077, 2197.0, 55410.400000000016, 60050.0, 60064.0, 0.10793024896773218, 0.2472697063146773, 0.09358051217130711], "isController": false}, {"data": ["/otcc/obtainKeyVectorJson.action-77", 2375, 297, 12.505263157894737, 14143.824421052643, 352, 60368, 3179.0, 60028.0, 60049.0, 60067.0, 0.11227117833872502, 0.31285120935913346, 0.11091409123772852], "isController": false}, {"data": ["/otcc/lib/css/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2-53", 2375, 128, 5.389473684210526, 7174.06947368422, 37, 60075, 1681.0, 25307.600000000006, 60027.0, 60059.0, 0.11294363009577288, 8.206303276476282, 0.10351650579312846], "isController": false}, {"data": ["/otcc/alertView.action-81", 2375, 345, 14.526315789473685, 15176.048421052628, 34, 60102, 2683.0, 60030.0, 60054.0, 60069.0, 0.11196088242334828, 0.6676761442850028, 0.0932241919205633], "isController": false}, {"data": ["/otcc/doLogout2.action-7", 2375, 193, 8.126315789473685, 9082.7545263158, 65, 61097, 1879.0, 42730.2, 60059.0, 60073.24, 0.11297056163160124, 0.37712393091498164, 0.09414252179059435], "isController": false}, {"data": ["/otcc/lib/modules/alerts/dynamicForms.js-87", 2375, 303, 12.757894736842106, 14528.212210526279, 28, 60221, 2376.0, 60029.0, 60052.0, 60065.0, 0.1113315919353551, 0.4580764901299973, 0.10509693123138975], "isController": false}, {"data": ["/otcc/lib/telerik/2018.2.516/styles/images/kendoui.woff-89", 2375, 240, 10.105263157894736, 12398.35073684211, 29, 61091, 2244.0, 60025.0, 60052.0, 60066.0, 0.11009280290203702, 6.383569658544043, 0.10049300020688176], "isController": false}, {"data": ["/otcc/lib/modules/vector/vectorController.js-61", 2375, 230, 9.68421052631579, 11202.644631578954, 28, 60074, 1973.0, 58206.600000000035, 60030.0, 60056.24, 0.11292441571837497, 0.2171651667451432, 0.1070314049367559], "isController": false}, {"data": ["/otcc/loadUnitGroupsByUserReports.action-323", 2289, 232, 10.135430318916557, 10786.46308431631, 135, 61062, 1907.0, 58320.0, 60050.0, 60065.1, 0.1062570304181987, 0.2054504953415878, 0.09754063339170585], "isController": false}, {"data": ["/otcc/listOfPeripheralsAlertsConfJson.action-91", 2375, 334, 14.063157894736841, 16089.184842105244, 38, 60116, 3007.0, 60030.0, 60052.0, 60068.24, 0.11070880437987338, 0.2961242468159565, 0.11067448100877864], "isController": false}, {"data": ["/otcc/newMonitorBeta.action-244", 2324, 225, 9.6815834767642, 11911.169535284005, 321, 61078, 2296.5, 59309.0, 60054.0, 60070.0, 0.10865244691014228, 2.7529461997521003, 0.0979244733097181], "isController": false}, {"data": ["/otcc/lib/modules/feedback/feedback.js-350", 2276, 365, 16.036906854130052, 18453.30975395431, 111, 61085, 2985.0, 60037.3, 60057.0, 60069.0, 0.10628682854953878, 0.2531500351654829, 0.10016288042021963], "isController": false}, {"data": ["/otcc/lib/modules/deviceView.js-180", 2340, 236, 10.085470085470085, 11218.225641025641, 34, 61075, 1977.0, 60026.0, 60053.0, 60067.0, 0.10817944806845595, 0.45510560525973565, 0.10119168489189868], "isController": false}, {"data": ["/otcc/lib/modules/report_view.js-103", 2360, 219, 9.279661016949152, 10598.645338983051, 28, 61074, 1932.0, 57799.80000000001, 60032.95, 60063.0, 0.11063451802587893, 1.1883691131009646, 0.10358860851274955], "isController": false}, {"data": ["/otcc/dashboardView.action-258", 2324, 151, 6.497418244406196, 8510.173838209965, 164, 61086, 1966.0, 37989.0, 60030.0, 60063.0, 0.10804960741588532, 0.45705944306843405, 0.09938716332481567], "isController": false}, {"data": ["/otcc/loadAvailableUnitGroupsCoverageJson.action-177", 2356, 442, 18.760611205432937, 17483.96477079795, 52, 61083, 2848.0, 60050.3, 60059.0, 60069.43, 0.10871864965530512, 0.3083754901943253, 0.09914631049637954], "isController": false}, {"data": ["/otcc/resources/sonidos/HIGH.ogg-337", 2318, 456, 19.672131147540984, 18167.40250215704, 175, 61098, 3292.5, 60033.0, 60056.0, 60070.0, 0.10787524669831007, 1.4973202332078543, 0.09712986079672059], "isController": false}, {"data": ["/otcc/loadMaxFleetPreferences.action-233", 2330, 292, 12.532188841201716, 12801.40042918456, 124, 61091, 2344.5, 60028.0, 60052.0, 60067.0, 0.10769389199069894, 0.231348364345284, 0.10747064310147131], "isController": false}, {"data": ["/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0-341", 2276, 159, 6.985940246045694, 10947.26713532513, 711, 61080, 3783.5, 45033.20000000005, 60031.0, 60065.0, 0.10716619296478427, 1.5483215887384574, 0.09921245208067919], "isController": false}, {"data": ["/otcc/obtainKeyVectorJson.action-62", 2375, 215, 9.052631578947368, 12359.45978947367, 404, 61072, 3265.0, 56253.00000000003, 60037.2, 60067.0, 0.11290850356013585, 0.29711450233485276, 0.11153828087342786], "isController": false}, {"data": ["/otcc/listOfMacrosRespondeAlertsConfJson.action-90", 2375, 345, 14.526315789473685, 16343.03578947368, 38, 60080, 2855.0, 60030.0, 60054.0, 60068.0, 0.11039995976328203, 0.3297396673220396, 0.11069093992038839], "isController": false}, {"data": ["/otcc/validateClientCode.action-11", 2375, 255, 10.736842105263158, 11882.472421052647, 33, 61085, 2142.0, 60027.0, 60036.2, 60068.24, 0.11296664439836462, 0.1847629389764889, 0.113678492188416], "isController": false}, {"data": ["/otcc/downloadImageContent.action-57", 2324, 2324, 100.0, 60036.370912220336, 60024, 61085, 60030.0, 60057.0, 60064.0, 60071.0, 0.10745127923660767, 0.7306477122309563, 0.10628762586398527], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 20045, 99.4887830057574, 12.770769622833843], "isController": false}, {"data": ["500/Internal Server Error", 103, 0.5112169942426047, 0.06562181447502548], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 156960, 20148, "504/Gateway Time-out", 20045, "500/Internal Server Error", 103, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/otcc/newAdmin.action-288", 2320, 272, "504/Gateway Time-out", 272, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/resources/sonidos/LOW.ogg-339", 2314, 277, "504/Gateway Time-out", 277, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/listDevicesJsonV2.action?ql=50&qo=0-181", 2333, 214, "504/Gateway Time-out", 214, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/resources/libs/bootstrap/fonts/glyphicons-halflings-regular.woff2-326", 2312, 245, "504/Gateway Time-out", 245, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/otcc/feedbackView.action-347", 2276, 357, "504/Gateway Time-out", 357, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/alerts/alertsView.js-88", 2375, 305, "504/Gateway Time-out", 305, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/loadConfAlertModule.action-324", 2276, 183, "504/Gateway Time-out", 183, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/resources/sonidos/MEDIUM.ogg-338", 2317, 324, "504/Gateway Time-out", 324, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/vectorView.action-60", 2375, 166, "504/Gateway Time-out", 166, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/telerik/2018.2.516/styles/fonts/glyphs/WebComponentsIcons.ttf-175", 2348, 209, "504/Gateway Time-out", 209, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/doLogout2.action-357", 2276, 194, "504/Gateway Time-out", 194, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/loadGeoreferencesNewMonitor.action-327", 2318, 272, "504/Gateway Time-out", 272, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/newMenu.action-13", 2375, 476, "504/Gateway Time-out", 476, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/otcc/listAlertsConfJson.action?ql=15&qo=0-94", 2374, 243, "504/Gateway Time-out", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/monitor/loadRealTimeAlertsWS.action-340", 2276, 186, "504/Gateway Time-out", 186, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/notificationCenterView.action-299", 2318, 179, "504/Gateway Time-out", 179, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/reportsView.action-98", 2363, 262, "504/Gateway Time-out", 262, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/telerik/2018.2.516/js/kendo.all.min.js-86", 2375, 274, "504/Gateway Time-out", 274, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/newMenu.action-237", 2324, 337, "504/Gateway Time-out", 337, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/newMonitorBeta.action-188", 2333, 202, "504/Gateway Time-out", 202, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/alerts/dynamicForms.js-349", 2276, 495, "504/Gateway Time-out", 495, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/vector/vectorController.js-73", 2375, 211, "504/Gateway Time-out", 211, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/js/jquery.fileDownload.js-101", 2360, 92, "504/Gateway Time-out", 92, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/newMenu.action-278", 2323, 1166, "504/Gateway Time-out", 1166, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/initializeAlertsConf.action-92", 2375, 154, "504/Gateway Time-out", 154, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/vectorView.action-70", 2375, 120, "504/Gateway Time-out", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/loadMaxFleetPreferences.action-251", 2324, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/countGeoreferenceJson.action-140", 2360, 184, "504/Gateway Time-out", 184, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/deviceView.action-178", 2340, 196, "504/Gateway Time-out", 196, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/initializeGeoreferenceJson.action-129", 2360, 276, "504/Gateway Time-out", 276, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/listReports.action?ql=15&qo=0-105", 2360, 486, "504/Gateway Time-out", 442, "500/Internal Server Error", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/js/jquery.maskedinput.min.js-102", 2360, 135, "504/Gateway Time-out", 135, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0-325", 2318, 177, "504/Gateway Time-out", 177, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/unitsGroupsView.action-166", 2359, 494, "504/Gateway Time-out", 494, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/loadGeoreferencesNewMonitor.action-137", 2360, 263, "504/Gateway Time-out", 263, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/unitsGroupsView.action-165", 2359, 424, "504/Gateway Time-out", 424, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/doLogin2.action-12", 2375, 385, "504/Gateway Time-out", 385, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/newAdmin.action-30", 2375, 147, "504/Gateway Time-out", 147, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/js/chosen.jquery.js-100", 2360, 189, "504/Gateway Time-out", 189, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/georeferenceView.action-110", 2360, 444, "504/Gateway Time-out", 444, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/initializeDashboards.action-266", 2324, 274, "504/Gateway Time-out", 274, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/css/font/fonts/fontawesome-webfont.woff2-23", 2375, 309, "504/Gateway Time-out", 309, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/initializeDeviceList.action-182", 2336, 214, "504/Gateway Time-out", 214, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/obtainKeyVectorJson.action-77", 2375, 297, "504/Gateway Time-out", 297, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/css/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2-53", 2375, 128, "504/Gateway Time-out", 128, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/alertView.action-81", 2375, 345, "504/Gateway Time-out", 345, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/doLogout2.action-7", 2375, 193, "504/Gateway Time-out", 193, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/alerts/dynamicForms.js-87", 2375, 303, "504/Gateway Time-out", 303, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/telerik/2018.2.516/styles/images/kendoui.woff-89", 2375, 240, "504/Gateway Time-out", 240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/vector/vectorController.js-61", 2375, 230, "504/Gateway Time-out", 230, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/loadUnitGroupsByUserReports.action-323", 2289, 232, "504/Gateway Time-out", 222, "500/Internal Server Error", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/listOfPeripheralsAlertsConfJson.action-91", 2375, 334, "504/Gateway Time-out", 334, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/newMonitorBeta.action-244", 2324, 225, "504/Gateway Time-out", 225, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/feedback/feedback.js-350", 2276, 365, "504/Gateway Time-out", 365, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/deviceView.js-180", 2340, 236, "504/Gateway Time-out", 236, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/lib/modules/report_view.js-103", 2360, 219, "504/Gateway Time-out", 219, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/dashboardView.action-258", 2324, 151, "504/Gateway Time-out", 151, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/loadAvailableUnitGroupsCoverageJson.action-177", 2356, 442, "504/Gateway Time-out", 393, "500/Internal Server Error", 49, "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/resources/sonidos/HIGH.ogg-337", 2318, 456, "504/Gateway Time-out", 456, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/loadMaxFleetPreferences.action-233", 2330, 292, "504/Gateway Time-out", 292, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0-341", 2276, 159, "504/Gateway Time-out", 159, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/obtainKeyVectorJson.action-62", 2375, 215, "504/Gateway Time-out", 215, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/listOfMacrosRespondeAlertsConfJson.action-90", 2375, 345, "504/Gateway Time-out", 345, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/validateClientCode.action-11", 2375, 255, "504/Gateway Time-out", 255, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/otcc/downloadImageContent.action-57", 2324, 2324, "504/Gateway Time-out", 2324, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
