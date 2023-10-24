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

    var data = {"OkPercent": 92.82193699699872, "KoPercent": 7.178063003001286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.799240290147452, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9999825688819681, 500, 1500, "https://session-cc.omnitracs.online/smet_6?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999650821732855, 500, 1500, "https://session-cc.omnitracs.online/smet_28?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999883718226005, 500, 1500, "https://session-cc.omnitracs.online/smet_7?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999883641102617, 500, 1500, "https://session-cc.omnitracs.online/smet_25?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999767612098114, 500, 1500, "https://session-cc.omnitracs.online/smet_2?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999592942791017, 500, 1500, "https://session-cc.omnitracs.online/smet_8?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999709153520405, 500, 1500, "https://session-cc.omnitracs.online/smet_24?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999709515122642, 500, 1500, "https://session-cc.omnitracs.online/smet_1?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999129132267391, 500, 1500, "https://session-cc.omnitracs.online/smet_0?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999767252414756, 500, 1500, "https://session-cc.omnitracs.online/smet_26?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999825435248114, 500, 1500, "https://session-cc.omnitracs.online/smet_27?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999883800648393, 500, 1500, "https://session-cc.omnitracs.online/smet_3?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999709481366135, 500, 1500, "https://session-cc.omnitracs.online/smet_4?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999767585092908, 500, 1500, "https://session-cc.omnitracs.online/smet_5?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5775185953549562, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-0"], "isController": false}, {"data": [0.9866501374622612, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-2"], "isController": false}, {"data": [0.9999883691176813, 500, 1500, "https://session-cc.omnitracs.online/smet_18?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.6674762603518359, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-1"], "isController": false}, {"data": [0.17745286961367013, 500, 1500, "https://aws-cc.omnitracs.online/otcc/remolque/initGrid.action"], "isController": false}, {"data": [0.9999709231323928, 500, 1500, "https://session-cc.omnitracs.online/smet_17?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.3598135192708394, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor"], "isController": false}, {"data": [0.6665064345831436, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-4"], "isController": false}, {"data": [0.9857562111015534, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-3"], "isController": false}, {"data": [0.9999941845588406, 500, 1500, "https://session-cc.omnitracs.online/smet_19?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9834960953971226, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-6"], "isController": false}, {"data": [0.9999825544881487, 500, 1500, "https://session-cc.omnitracs.online/smet_13?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.6664895680480359, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-5"], "isController": false}, {"data": [0.9999709231323928, 500, 1500, "https://session-cc.omnitracs.online/smet_14?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9913053011519843, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-8"], "isController": false}, {"data": [0.9999767385059143, 500, 1500, "https://session-cc.omnitracs.online/smet_15?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.36172669846292427, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action"], "isController": false}, {"data": [0.6632343267722511, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-7"], "isController": false}, {"data": [0.9999767385059143, 500, 1500, "https://session-cc.omnitracs.online/smet_16?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.3091021750712284, 500, 1500, "https://aws-cc.omnitracs.online/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0"], "isController": false}, {"data": [0.9999883696587658, 500, 1500, "https://session-cc.omnitracs.online/smet_11?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.7268417833355988, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-8"], "isController": false}, {"data": [0.7266718771238276, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-7"], "isController": false}, {"data": [0.9961346336822074, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-9"], "isController": false}, {"data": [0.6587688595895066, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-4"], "isController": false}, {"data": [0.5155095497002649, 500, 1500, "https://aws-cc.omnitracs.online/otcc/loadGeoreferencesNewMonitor.action"], "isController": false}, {"data": [0.6607567622672285, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-3"], "isController": false}, {"data": [0.6604849123283947, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-6"], "isController": false}, {"data": [0.6578598613565312, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-5"], "isController": false}, {"data": [0.5880793801821395, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-0"], "isController": false}, {"data": [0.6612579855919533, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-2"], "isController": false}, {"data": [0.6628551039826016, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-1"], "isController": false}, {"data": [0.3818841331903164, 500, 1500, "https://aws-cc.omnitracs.online/otcc/doLogin2.action"], "isController": false}, {"data": [0.4780091652648065, 500, 1500, "https://aws-cc.omnitracs.online/otcc/listDriversJson.action?ql=0&qo=0"], "isController": false}, {"data": [0.9999941842882732, 500, 1500, "https://session-cc.omnitracs.online/smet_21?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.9999651503182938, 500, 1500, "https://session-cc.omnitracs.online/camps"], "isController": false}, {"data": [0.23234961059370016, 500, 1500, "https://aws-cc.omnitracs.online/otcc/obtainKeyVectorJson.action"], "isController": false}, {"data": [0.4744650763845423, 500, 1500, "https://aws-cc.omnitracs.online/otcc/countFeedback.action"], "isController": false}, {"data": [0.9957580664204152, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-9"], "isController": false}, {"data": [0.6001161912507988, 500, 1500, "https://aws-cc.omnitracs.online/otcc/listRouteDefinitionRouteJson.action"], "isController": false}, {"data": [0.9999767505841416, 500, 1500, "https://vector-api-r1.omnitracs.online/internal/set_cook"], "isController": false}, {"data": [0.9999941848293828, 500, 1500, "https://session-cc.omnitracs.online/smet_12?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.5068521763347529, 500, 1500, "https://aws-cc.omnitracs.online/otcc/initializeClientPreference.action"], "isController": false}, {"data": [0.9999825546910436, 500, 1500, "https://session-cc.omnitracs.online/smet_10?c=PREPARACION001&u=instalaciones"], "isController": false}, {"data": [0.6504784646043915, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-12"], "isController": false}, {"data": [0.9950179533213644, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-10"], "isController": false}, {"data": [0.6498590638970179, 500, 1500, "https://aws-cc.omnitracs.online/otcc/menu.action-11"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4791613, 343945, 7.178063003001286, 1870.7915964831784, 0, 165588, 82.0, 6616.900000000031, 14205.900000000001, 19184.900000000016, 105.3798191464117, 3390.055883304877, 118.53961969945715], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://session-cc.omnitracs.online/smet_6?c=PREPARACION001&u=instalaciones", 86053, 0, 0.0, 32.69644288984705, 22, 1071, 30.0, 39.0, 44.0, 57.0, 1.9005698904744504, 1.2530347994445228, 0.712713708927919], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_28?c=PREPARACION001&u=instalaciones", 85916, 0, 0.0, 33.13009218306249, 22, 1112, 30.0, 40.0, 45.0, 59.0, 1.9049168965703025, 1.255925375668786, 0.7162041066206704], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_7?c=PREPARACION001&u=instalaciones", 85998, 0, 0.0, 38.371915625944894, 22, 1489, 33.0, 49.0, 54.0, 71.0, 1.900044844310571, 1.2526649370075194, 0.7125168166164643], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_25?c=PREPARACION001&u=instalaciones", 85941, 0, 0.0, 32.60394922097692, 22, 903, 30.0, 39.0, 44.0, 58.0, 1.904350974758647, 1.2555447231173709, 0.7159913332832802], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_2?c=PREPARACION001&u=instalaciones", 86063, 0, 0.0, 35.45754854002289, 23, 1100, 30.0, 42.0, 50.0, 63.0, 1.8989277852742776, 1.2519551602678016, 0.7120979194778541], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_8?c=PREPARACION001&u=instalaciones", 85983, 0, 0.0, 33.97400648965455, 22, 3115, 31.0, 42.0, 48.0, 65.0, 1.9009211584974015, 1.253293941775786, 0.7128454344365255], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_24?c=PREPARACION001&u=instalaciones", 85956, 1, 0.001163385918376844, 38.01966122202077, 22, 1111, 32.0, 49.0, 54.0, 72.0, 1.9043089831493822, 1.2555416177408438, 0.7159672158637007], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_1?c=PREPARACION001&u=instalaciones", 86063, 0, 0.0, 36.12264271522105, 22, 1602, 33.0, 46.0, 52.0, 69.0, 1.898927827172966, 1.2520016437807062, 0.7120979351898622], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_0?c=PREPARACION001&u=instalaciones", 86121, 0, 0.0, 58.02915665168721, 40, 1118, 53.0, 64.0, 70.0, 104.0, 1.8982430963450339, 1.2515702405903715, 0.7118411611293877], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_26?c=PREPARACION001&u=instalaciones", 85930, 0, 0.0, 33.547841266146996, 22, 1072, 30.0, 40.0, 46.0, 61.0, 1.9045945100999695, 1.255737070096193, 0.7160828968637581], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_27?c=PREPARACION001&u=instalaciones", 85928, 1, 0.0011637650125686622, 52.05408016013467, 19, 533, 52.0, 62.0, 68.0, 89.0, 1.904960499138314, 1.2560382848124447, 0.7162121650407137], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_3?c=PREPARACION001&u=instalaciones", 86059, 0, 0.0, 33.34687830441916, 22, 1079, 30.0, 40.0, 45.0, 58.0, 1.8991851130051445, 1.2521689193315833, 0.7121944173769292], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_4?c=PREPARACION001&u=instalaciones", 86053, 1, 0.0011620745354607043, 52.2040951506634, 22, 1066, 52.0, 62.0, 67.0, 88.0, 1.9005674558660774, 1.2531031836804591, 0.7127045136958664], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_5?c=PREPARACION001&u=instalaciones", 86053, 0, 0.0, 32.798868139402366, 22, 1066, 30.0, 39.0, 44.0, 58.0, 1.900568085505576, 1.2530877029277114, 0.712713032064591], "isController": false}, {"data": ["Test", 85907, 66362, 77.2486526127091, 71133.18847125281, 1285, 710201, 2556.0, 79582.2000000001, 164714.0, 339916.97000000003, 1.9038084634875967, 2135.4640705598126, 96.08675994067299], "isController": true}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-0", 59289, 0, 0.0, 3893.105854374334, 27, 59990, 921.5, 17893.0, 27597.050000000057, 48441.77000000003, 1.3041915408168794, 32.04509792862723, 1.1195159808379267], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-2", 59289, 30, 0.05059960532307848, 208.77225117643852, 0, 60062, 44.0, 135.0, 458.0, 19887.75000000004, 1.3041945531218246, 38.76371430244064, 0.7250791672878139], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_18?c=PREPARACION001&u=instalaciones", 85978, 0, 0.0, 32.930412431087014, 22, 1097, 30.0, 39.0, 43.0, 57.0, 1.9043397630253402, 1.2554825708629993, 0.715987117934332], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-1", 59289, 250, 0.42166337769232065, 3257.807738366292, 22, 60156, 61.0, 17208.500000000007, 29518.95, 60028.0, 1.3041946965652642, 3.868640875204577, 1.1373494765945127], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/remolque/initGrid.action", 86144, 65686, 76.25139301634472, 5034.474240806106, 25, 67305, 35.0, 7255.300000000025, 11441.150000000012, 60063.0, 1.8983732551682377, 2.3830886417124924, 1.5090584274481889], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_17?c=PREPARACION001&u=instalaciones", 85979, 0, 0.0, 51.96415403761469, 22, 1228, 52.0, 62.0, 67.0, 88.0, 1.9035037251700073, 1.2550096774049464, 0.715672787295364], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor", 85907, 27140, 31.592303304736518, 8983.758215279335, 20, 165588, 67.0, 15102.800000000003, 28147.9, 60062.0, 1.90524094843106, 534.5213448477703, 11.493923698032495], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-4", 59289, 251, 0.42335003120308995, 3269.9024439609316, 24, 71727, 89.0, 17281.90000000003, 29556.800000000003, 60036.0, 1.3041949834522384, 24.472441333855418, 1.137852376842509], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-3", 59289, 30, 0.05059960532307848, 236.60463155054094, 1, 67505, 72.0, 179.0, 511.0, 19877.830000000027, 1.304193864593753, 188.41692540583819, 0.7180659854283519], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_19?c=PREPARACION001&u=instalaciones", 85978, 0, 0.0, 32.556572611598135, 22, 1074, 30.0, 39.0, 43.0, 57.0, 1.9043398052048515, 1.2555628460874242, 0.7159871337928396], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-6", 59289, 27, 0.045539644790770634, 260.036431715834, 24, 67609, 85.0, 241.0, 662.0, 19763.49000000008, 1.3041939219710648, 105.45021084409287, 0.6834787629037966], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_13?c=PREPARACION001&u=instalaciones", 85982, 0, 0.0, 32.62820125142487, 22, 1056, 30.0, 39.0, 43.0, 55.0, 1.9021800449627915, 1.2540488638648841, 0.7151751145612057], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-5", 59289, 252, 0.42503668471385925, 3270.3638111622618, 22, 95142, 88.0, 17207.0, 29535.95, 60036.0, 1.3041952129619085, 17.52184803219107, 1.1487755457276834], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_14?c=PREPARACION001&u=instalaciones", 85979, 0, 0.0, 38.037881343119004, 22, 1085, 32.0, 49.0, 54.0, 70.0, 1.9035059586982666, 1.2549702876211473, 0.7156736270496412], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-8", 59289, 19, 0.03204641670461637, 201.4838671591695, 2, 90310, 101.0, 156.0, 263.0, 5151.960000000006, 1.304197794951264, 92.5083709840688, 0.7062576626899805], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_15?c=PREPARACION001&u=instalaciones", 85979, 0, 0.0, 32.49745868177106, 22, 1097, 30.0, 39.0, 43.0, 56.0, 1.9035053687091603, 1.254991864871819, 0.7156734052275653], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action", 86593, 27599, 31.872091277585948, 8508.65155382065, 25, 159689, 42.0, 12802.900000000001, 19341.600000000006, 60053.0, 1.9047964297621798, 727.266634918616, 12.557771761097069], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-7", 59289, 241, 0.40648349609539713, 3293.867159169515, 21, 95104, 94.0, 16947.500000000007, 29513.950000000015, 60046.0, 1.304198225283817, 54.236285240308405, 1.1348441092366157], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_16?c=PREPARACION001&u=instalaciones", 85979, 0, 0.0, 33.431617022760925, 22, 1373, 30.0, 40.0, 46.0, 62.0, 1.9035046522943087, 1.2549833065454779, 0.715673135872372], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0", 86342, 28110, 32.55657733200528, 7948.018079266155, 25, 67322, 41.0, 10059.0, 17897.550000000007, 60060.0, 1.9002244607407182, 120.96005391812217, 1.3880545865566964], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_11?c=PREPARACION001&u=instalaciones", 85982, 0, 0.0, 32.985985438812854, 22, 1037, 30.0, 39.0, 44.0, 58.0, 1.902181475749653, 1.254110559024703, 0.7151756525035317], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-8", 58856, 46, 0.07815685741470708, 2030.7915930406384, 22, 93649, 79.0, 10266.0, 17704.750000000004, 40552.82000000003, 1.3053118581115186, 2.16051684064042, 1.1369251594652363], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-7", 58856, 46, 0.07815685741470708, 2041.2238514340154, 22, 93627, 81.0, 10283.0, 17739.95, 42544.11000000319, 1.3053115107202058, 14.30381155872183, 1.1407500946171203], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-9", 58856, 0, 0.0, 163.06622944134705, 70, 3258, 152.0, 224.0, 295.0, 553.9900000000016, 1.3053095421729244, 204.75670952607834, 0.6776245792469222], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-4", 58856, 50, 0.08495310588555118, 2683.9196173712107, 23, 60064, 354.0, 12607.0, 18595.35000000001, 46613.98, 1.3053113080753584, 113.04859926714686, 1.1305402608869441], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/loadGeoreferencesNewMonitor.action", 86076, 27659, 32.13323109809935, 5199.892455504438, 25, 67308, 40.0, 1701.9000000000015, 10054.0, 60059.0, 1.8981042023836516, 672.3924698448537, 1.3716768650038107], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-3", 58856, 51, 0.0866521680032622, 2662.544991164857, 23, 60070, 336.0, 12585.700000000004, 18580.600000000006, 46577.97, 1.3053117423143938, 14.117687327744415, 1.134363709566851], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-6", 58856, 52, 0.08835123012097322, 2669.442452766059, 23, 60077, 340.0, 12613.800000000003, 18596.70000000002, 46581.96000000001, 1.3053118581115186, 13.817308035361219, 1.1356385288102304], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-5", 58856, 50, 0.08495310588555118, 2693.8118458611084, 25, 60068, 361.0, 12616.700000000004, 18593.800000000003, 46623.94000000001, 1.305310960684338, 150.25658934846982, 1.1330904783912774], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-0", 58856, 0, 0.0, 3387.2892993067976, 43, 59914, 1260.5, 14596.90000000003, 22090.550000000007, 48524.0, 1.305314724096907, 11.687739092306096, 1.1459745478155463], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-2", 58856, 52, 0.08835123012097322, 2658.8941994019433, 22, 60076, 339.0, 12582.600000000006, 18597.55000000002, 46570.96000000001, 1.305311916010089, 8.162729733724554, 1.131815506091914], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-1", 58856, 51, 0.0866521680032622, 2642.945884871541, 22, 60067, 317.0, 12559.800000000003, 18483.95, 46564.95000000001, 1.305311916010089, 1.2988554581598029, 1.200573947130964], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogin2.action", 86703, 27029, 31.17423849232437, 5314.734634326331, 25, 67360, 41.0, 9695.400000000009, 11740.60000000002, 60053.0, 1.90691720067115, 2.2561650661840678, 1.8448647660207778], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/listDriversJson.action?ql=0&qo=0", 86195, 27763, 32.20952491443819, 5516.731736179619, 26, 67304, 36.0, 8352.800000000017, 11797.100000000013, 60075.990000000005, 1.8984182901672504, 17.916864498296686, 1.3681959942806943], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_21?c=PREPARACION001&u=instalaciones", 85974, 0, 0.0, 32.51869169749026, 22, 932, 30.0, 39.0, 43.0, 57.0, 1.9043383092202943, 1.25557744622549, 0.7159865713377083], "isController": false}, {"data": ["https://session-cc.omnitracs.online/camps", 86084, 0, 0.0, 32.76880721156074, 22, 1137, 30.0, 40.0, 44.0, 57.0, 1.8977847456986299, 1.2197141941772593, 0.6486568955024614], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/obtainKeyVectorJson.action", 86542, 28063, 32.42702965034319, 8583.136950844699, 26, 67312, 38.0, 12467.700000000019, 21755.250000000025, 60053.0, 1.904140805472111, 5.015709522279956, 1.3611631539117044], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/countFeedback.action", 86274, 27662, 32.062962190231126, 5475.984815819344, 24, 67684, 37.0, 7376.200000000012, 10046.0, 60063.990000000005, 1.8992803322712504, 2.3577865197412198, 1.4893597940992798], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-9", 59289, 0, 0.0, 73.2746209246239, 16, 2337, 55.0, 154.0, 242.0, 770.0, 1.3042054836023367, 108.32470725692772, 0.6964888461232317], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/listRouteDefinitionRouteJson.action", 86065, 27578, 32.04322314529716, 4132.564247952084, 25, 67303, 35.0, 87.0, 10028.0, 60055.990000000005, 1.8983590779557575, 14.096191530246761, 1.3737149187160316], "isController": false}, {"data": ["https://vector-api-r1.omnitracs.online/internal/set_cook", 258071, 2, 7.749805286142186E-4, 43.63864595401929, 23, 31552, 38.0, 59.0, 64.0, 85.0, 5.6962906403224345, 5.225522391622404, 40.35250957197073], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_12?c=PREPARACION001&u=instalaciones", 85982, 0, 0.0, 32.530948338024366, 22, 1074, 30.0, 39.0, 43.0, 56.0, 1.9021807182739874, 1.2541258741161083, 0.7151753677104348], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/initializeClientPreference.action", 86177, 27700, 32.143147243464036, 5167.2047878204085, 26, 67309, 56.0, 6957.100000000013, 11187.0, 61065.0, 1.8985512236839754, 4.5312110957838, 1.3701458538109939], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_10?c=PREPARACION001&u=instalaciones", 85983, 0, 0.0, 51.96833094914084, 23, 738, 52.0, 62.0, 68.0, 91.0, 1.9009195615197176, 1.253263742471948, 0.7147012023291908], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-12", 55699, 225, 0.403956983069714, 3424.548735165797, 22, 96038, 72.0, 16049.700000000004, 29005.9, 60045.0, 1.2252425616872311, 8.55616543584772, 1.0780698711720655], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-10", 55700, 0, 0.0, 56.172298025134104, 30, 1685, 41.0, 90.0, 238.95000000000073, 759.0, 1.2252629690400685, 7.703329539484088, 0.6724587779301938], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-11", 55699, 228, 0.4093430761773102, 3411.67171762509, 23, 95061, 82.0, 15923.700000000004, 29013.95, 60044.0, 1.2252425077825195, 44.489556291907014, 1.0840524531747682], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 10, 0.002907441596766925, 2.0869798959139647E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, 8.722324790300775E-4, 6.260939687741895E-5], "isController": false}, {"data": ["503/Service Unavailable", 335, 0.09739929349169199, 0.006991382651311781], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 4, 0.00116297663870677, 8.347919583655859E-5], "isController": false}, {"data": ["502/Bad Gateway", 161925, 47.07874805564843, 3.3793421964586874], "isController": false}, {"data": ["504/Gateway Timeout", 143249, 41.648810129526524, 2.989577831097795], "isController": false}, {"data": ["500/Internal Server Error", 38035, 11.058454113302998, 0.7937828034108765], "isController": false}, {"data": ["Assertion failed", 384, 0.11164575731584991, 0.008014002800309625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4791613, 343945, "502/Bad Gateway", 161925, "504/Gateway Timeout", 143249, "500/Internal Server Error", 38035, "Assertion failed", 384, "503/Service Unavailable", 335], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_24?c=PREPARACION001&u=instalaciones", 85956, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_27?c=PREPARACION001&u=instalaciones", 85928, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://session-cc.omnitracs.online/smet_4?c=PREPARACION001&u=instalaciones", 86053, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-2", 59289, 30, "504/Gateway Timeout", 26, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-1", 59289, 250, "504/Gateway Timeout", 250, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/remolque/initGrid.action", 86144, 65686, "500/Internal Server Error", 38035, "502/Bad Gateway", 14825, "504/Gateway Timeout", 12785, "503/Service Unavailable", 41, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor", 85907, 27140, "502/Bad Gateway", 14549, "504/Gateway Timeout", 12434, "Assertion failed", 89, "503/Service Unavailable", 67, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-4", 59289, 251, "504/Gateway Timeout", 250, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-3", 59289, 30, "504/Gateway Timeout", 27, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-6", 59289, 27, "504/Gateway Timeout", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-5", 59289, 252, "504/Gateway Timeout", 249, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-8", 59289, 19, "504/Gateway Timeout", 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action", 86593, 27599, "502/Bad Gateway", 14584, "504/Gateway Timeout", 12707, "Assertion failed", 295, "503/Service Unavailable", 13, "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-7", 59289, 241, "504/Gateway Timeout", 239, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/refreshUnitsMonitorJsonV2.action?ql=0&qo=0", 86342, 28110, "502/Bad Gateway", 14682, "504/Gateway Timeout", 13407, "503/Service Unavailable", 21, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-8", 58856, 46, "504/Gateway Timeout", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-7", 58856, 46, "504/Gateway Timeout", 44, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-4", 58856, 50, "504/Gateway Timeout", 48, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/loadGeoreferencesNewMonitor.action", 86076, 27659, "502/Bad Gateway", 14915, "504/Gateway Timeout", 12721, "503/Service Unavailable", 23, "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-3", 58856, 51, "504/Gateway Timeout", 49, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-6", 58856, 52, "504/Gateway Timeout", 52, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-5", 58856, 50, "504/Gateway Timeout", 48, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-2", 58856, 52, "504/Gateway Timeout", 49, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogout2.action?origin=monitor-1", 58856, 51, "504/Gateway Timeout", 50, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/doLogin2.action", 86703, 27029, "502/Bad Gateway", 14560, "504/Gateway Timeout", 12440, "503/Service Unavailable", 29, "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/listDriversJson.action?ql=0&qo=0", 86195, 27763, "502/Bad Gateway", 14717, "504/Gateway Timeout", 13012, "503/Service Unavailable", 34, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/obtainKeyVectorJson.action", 86542, 28063, "502/Bad Gateway", 14641, "504/Gateway Timeout", 13412, "503/Service Unavailable", 10, "", "", "", ""], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/countFeedback.action", 86274, 27662, "502/Bad Gateway", 14683, "504/Gateway Timeout", 12944, "503/Service Unavailable", 34, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Received fatal alert: handshake_failure", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/listRouteDefinitionRouteJson.action", 86065, 27578, "502/Bad Gateway", 14997, "504/Gateway Timeout", 12554, "503/Service Unavailable", 27, "", "", "", ""], "isController": false}, {"data": ["https://vector-api-r1.omnitracs.online/internal/set_cook", 258071, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/initializeClientPreference.action", 86177, 27700, "502/Bad Gateway", 14748, "504/Gateway Timeout", 12916, "503/Service Unavailable", 36, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-12", 55699, 225, "504/Gateway Timeout", 224, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://aws-cc.omnitracs.online/otcc/menu.action-11", 55699, 228, "504/Gateway Timeout", 224, "502/Bad Gateway", 4, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
