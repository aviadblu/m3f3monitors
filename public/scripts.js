$(document).ready(init);
var presentationUrl = "https://docs.google.com/presentation/d/1jEg3kWTC9TVLKzMigSLYsDxe-C9PPUtEN5c1UMfP9nQ/embed?start=true&loop=true&delayms=7000";

var jenkinsFrameIndex = 0;
var jenkinsStatusUrls = ["http://mydtbld0079.hpeswlab.net:8080/view/SRL%20Code%20Status%20Monitor/",
    "http://mydtbld0079.hpeswlab.net:8080/view/Agent%20Monitor%20Tool/"];


function init() {
    // init presentation
    var preIframe = $('<iframe scrolling="no"></iframe>').attr('src', presentationUrl);
    $('#m3presentationFrame').append(preIframe);

    // init jenkins status
    var jenkinsIframe = $('<iframe scrolling="no"></iframe>').attr('src', jenkinsStatusUrls[0]);
    $('#jenkinsBuildFrame').append(jenkinsIframe);

    getHPEStockData();
    getMicroFocusStockData();
    loadMessages();

    usageMetrics();

    //setInterval(refreshPresentationFrame, 60000 * 3);
    setInterval(refreshJenkinsFrame, 30000);

    initFirasFrame();
}

var firasFrameIndex = 0;

function initFirasFrame() {
    var firasIframe = $('<iframe scrolling="no"></iframe>');
    $('#m3FirasFrame').append(firasIframe);
    loadFirasSection();
}

function loadFirasSection() {
    var frames = [
        'https://dwhastrep001p.saas.hpe.com/views/Firas-FloorMonitors/DFY17Deals?:isGuestRedirectFromVizportal=y&:embed=y',
        'https://dwhastrep001p.saas.hpe.com/views/Firas-FloorMonitors/DDealsToday?:iid=2&:isGuestRedirectFromVizportal=y&:embed=y'
    ];

    var firasFrameUrl = frames[firasFrameIndex];
    firasFrameIndex++;
    if(frames.length -1 < firasFrameIndex) {
        firasFrameIndex = 0;
    }
    $('#m3FirasFrame').find('iframe').attr('src', firasFrameUrl);
    setTimeout(loadFirasSection, 30000)
}

function usageMetrics() {
    var metricsURLs = ['https://docs.google.com/presentation/d/1jEg3kWTC9TVLKzMigSLYsDxe-C9PPUtEN5c1UMfP9nQ/embed?start=true&loop=true&delayms=7000'];

    function loadFrame(url) {
        $('#m3presentationFrame').find('iframe').attr('src', url);
    }

    for (var i = 0; i < metricsURLs.length; i++) {
        setTimeout(loadFrame, 10000 + i * 30 * 1000, metricsURLs[i]);
    }

    setTimeout(usageMetrics, 10000 + i * 30 * 1000);

}

function refreshPresentationFrame() {
    $('#m3presentationFrame').find('iframe').attr('src', presentationUrl);
}

function refreshJenkinsFrame() {
    var newJenkinsFrame;
    if(!jenkinsStatusUrls[jenkinsFrameIndex + 1]) {
        jenkinsFrameIndex = 0;
    } else{
        jenkinsFrameIndex++;
    }
    $('#jenkinsBuildFrame').find('iframe').attr('src', jenkinsStatusUrls[jenkinsFrameIndex]);
}

function loadMessages() {
    $.get('/api/messages').then(function (data) {
        if (data) {
            var me = data.split(',');
            me.forEach(function (m) {
                addMessage(m);
            });
        }
    });
}

function getHPEStockData() {
    $.ajax({
        url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=HPE",
        dataType: "jsonp",
        jsonpCallback: "updateHPEStockData"
    });
    setTimeout(getHPEStockData, 60 * 1000);
}

function getMicroFocusStockData() {

    $.ajax({
        url: "https://www.quandl.com/api/v3/datasets/LSE/MCRO.json?api_key=Eh6WTfxDUf7vAQzdS8Q_",
        dataType: "json"
    }).then(function (response) {
        var data = response.dataset.data[0];
        var price = data[5] / 100
        var change = Math.round(data[7] * 100) / 100;
        var status;
        if (change < 0) {
            status = 'red';
        } else {
            status = 'green';
        }

        if (change > 0) {
            change = '+' + change;
        }

        var stockHTML = '<span class="name">MICRO FOCUS (' + response.dataset.dataset_code + ')</span>';
        stockHTML += '<span class="value ' + status + '">&pound;' + price + '</span>';
        stockHTML += '<span class="' + status + '"> (' + change + '%)</span>';
        if (messages.stockMF) {
            delete messages.stockMF;
        }
        addMessage(stockHTML, 'stockMF');
    });
    setTimeout(getMicroFocusStockData, 60 * 1000);
}

var messages = {};
function renderMessages() {
    var HTML = '';
    var i = 0;
    Object.keys(messages).forEach(function (key) {
        var m = messages[key];
        if (i > 0) {
            HTML += '&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;';
        }
        HTML += ' ' + m;
        i++;
    });
    $('#messages').html(HTML);
}

function addMessage(message, key) {
    key = key !== undefined ? key : Object.keys(messages).length;
    messages[key] = message;
    renderMessages();
}

function updateHPEStockData(data) {
    var change = Math.round(data.Change * 100) / 100;
    var status;
    if (change < 0) {
        status = 'red';
    } else {
        status = 'green';
    }

    if (change > 0) {
        change = '+' + change;
    }

    var stockHTML = '<span class="name">' + data.Name + ' (' + data.Symbol + ')</span>';
    stockHTML += '<span class="value ' + status + '">$' + data.LastPrice + '</span>';
    stockHTML += '<span class="' + status + '"> (' + change + '%)</span>';
    if (messages.stock) {
        delete messages.stock;
    }
    addMessage(stockHTML, 'stock');
}
