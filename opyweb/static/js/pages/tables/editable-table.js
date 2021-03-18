var BASE_URL = 'http://www.zitoon.com:8000'

$(function () {
    $('#mainTable').editableTableWidget();
    $(".alert").hide()
    $("#buttonaddrows").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#buttonaddrows").click();
            }
        });
    wol()
    serveron = checkServer();
    serviceon = checkService();
});




$.fn.getForm2obj = function() {
  var _ = {};
  $.map(this.serializeArray(), function(n) {
    const keys = n.name.match(/[a-zA-Z0-9_]+|(?=\[\])/g);
    if (keys.length > 1) {
      let tmp = _;
      pop = keys.pop();
      for (let i = 0; i < keys.length, j = keys[i]; i++) {
        tmp[j] = (!tmp[j] ? (pop == '') ? [] : {} : tmp[j]), tmp = tmp[j];
      }
      if (pop == '') tmp = (!Array.isArray(tmp) ? [] : tmp), tmp.push(n.value);
      else tmp[pop] = n.value;
    } else _[keys.pop()] = n.value;
  });
  return _;
}
console.log($('form').getForm2obj());
$('form input').change(function() {
  //console.clear();
  console.log($('form').getForm2obj());
});

function sortTable(index) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById('mainTable');
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[index];
      y = rows[i + 1].getElementsByTagName("TD")[index];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function jsonstringtonumber (myjson)
    {
    for (var key in myjson){
        var value = myjson[key];
        if (!isNaN(Number(value))) myjson[key] = Number(value) ;
        if (Array.isArray(value)) myjson[key] = value.map(Number) ;
        }
    return myjson;
    }




function getResult (baseUrl, apiName, myjson, timeout = 0)
    {
	jQuery.support.cors = true;
	$.ajaxSetup({
           headers : { 'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                       'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
                       'Access-Control-Max-Age': 86400}
       });
    var res  = {}
    var url = baseUrl + "/"+apiName
    console.log ("url "+url);
    console.log ("timeout "+timeout);

    $.ajax(url, {
           headers: { 'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                       'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
                       'Access-Control-Max-Age': 86400},

           data : JSON.stringify(myjson),
           contentType : 'application/json',
           type : 'POST',
           async: false,
           success: function (data) {
               //console.log ("getResult done : ");
               //console.log (data);
               res =  data;
               },
           timeout: timeout
           });
    return res ;


    }


function getAsyncResult (url, successFunction, errorFunction, timeout = 800)
    {
	jQuery.support.cors = true;
	$.ajaxSetup({
           headers : { 'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                       'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
                       'Access-Control-Max-Age': 86400}
       });
    var res  = {}
    console.log ("url "+url);
    console.log ("timeout "+timeout);

    $.ajax(url, {
           headers: { 'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                       'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
                       'Access-Control-Max-Age': 86400},

           data : JSON.stringify({}),
           contentType : 'application/json',
           type : 'POST',
           async: true,
           success: successFunction,
           error: errorFunction,
           timeout: timeout
           });

    }


function restartServer()
{
    $('#serverstate').html('<span class="label bg-orange">Sarting Server...</span>');

    var url = "wait_server_up"
    var res = getAsyncResult (url,
    function (data) {
               console.log ("check server done success : ");
               console.log (data);
               $('#serverstate').html('<span class="label bg-green">Server ON</span>');
               restartService();
               return true;
               },
    function (data, textStatus, errorThrown) {
               console.log ("check server done error");
               $('#serverstate').html('<span class="label bg-red">Server OFF</span>');
               return false;
           },
    60000
    );
    return res;
}

function checkServer()
{
    $('#serverstate').html('<span class="label bg-red">Server OFF</span>');

    var url = "ping"
    var res = getAsyncResult (url,
    function (data) {
               console.log ("check server done success : ");
               console.log (data);
               $('#serverstate').html('<span class="label bg-green">Server ON</span>');
               return true;
               },
    function (data, textStatus, errorThrown) {
               console.log ("check server done error");
               $('#serverstate').html('<span class="label bg-red">Server OFF</span>');
               restartServer();
               return false;
           },
    800
    );
    return res;
}




function checkService()
{
    var apiName = "check"
    var url = BASE_URL + "/"+apiName
    var res = getAsyncResult (url,
    function (data) {
               console.log ("check service done success : ");
               console.log (data);
               $('#servicestate').html('<span class="label bg-green">Service ON</span>');
               return true;
               },
    function (data, textStatus, errorThrown) {
               console.log ("check service done error");
               $('#servicestate').html('<span class="label bg-red">Service OFF</span>');
               restartService();
               return false;
           }
    );
    return res;
}


function restartService()
{
    $('#servicestate').html('<span class="label bg-orange">Sarting Service...</span>');
    var url = "restartservice"
    var res = getAsyncResult (url,
    function (data) {
               console.log ("restart service done success : ");
               console.log (data);
               $('#servicestate').html('<span class="label bg-green">Service ON</span>');
               return true;
               },
    function (data, textStatus, errorThrown) {
               console.log ("restart service done error");
               $('#servicestate').html('<span class="label bg-red">Service OFF</span>');
               return false;
           },
    10000
    );
    return res;
}


function wol()
    {
    var data = getResult ("", "wol", {});
    console.log ("wake server");
    console.log (data);
    }



function clearTradierCache()
    {
    var data = getResult (BASE_URL, "cleartradiercache", {});
    //data-placement-from="top" data-placement-align="right" data-animate-enter="animated rotateInUpRight"     data-animate-exit="animated rotateOutUpRight"

    showTableAlert ('Tradier cache cleared','success')
    //showNotification('alert-success', 'cache cleared', 'top', 'right', 'animated rotateInUpRight', 'animated rotateOutUpRight')
    return data;
    }


function getPlotArrays(index)
    {

    var res = JSON.parse(localStorage.getItem('res'));
    var results = res["allResults"][index];
    var assetSymbol = results["assetSymbol"];
    var constantDict = res["constantDictList"][assetSymbol];
    var jsonres = {"constantDict":constantDict, "mstrategy":results["mstrategy"]};
    console.log (jsonres);
    var data = getResult (BASE_URL, "getplotarrays", jsonres);

    return data;

    }



function changeBaseUrl()
    {
    BASE_URL = document.getElementById("base_url").value
    console.log("BASE_URL="+BASE_URL);
    }
    //


function launchSimu()
		{
 		console.log("BASE_URL="+BASE_URL);
		document.getElementById("viewresults").disabled = true;

 		var jsonform = jsonstringtonumber($('form').getForm2obj())
		var $table = $("#mainTable")
		rows = [],
		header = [];

		$table.find("thead th").each(function () {
		header.push($(this).html());
		});

		$table.find("tbody tr").each(function () {
			var row = {};
    
			$(this).find("td").each(function (i) {
			var key = header[i],
				value = $(this).html();
            if (!!key) {
                if (key !== 'Symbol') {
                value = Number(value)}
			    row[key] = value;
			    }
			});
    
		rows.push(row);
		});

        nbsteps =  rows.length + 1;
        localStorage.setItem('allResults', {});
        localStorage.setItem('constantDictList', {});
        res = {}
        res['allResults'] = []
        res['constantDictList'] = {}
        console.log("________________1__________________");
        myprogress = (100 / nbsteps).toFixed(0)
        var progressbar = document.getElementById("progressbar")
        progressbar.setAttribute('style','width: '+myprogress+'%;');
        progressbar.setAttribute('aria-valuenow', myprogress);
        progressbar.innerText = myprogress+'%'
        var step = 1
 		for (var line in rows) {
            var assetSymbol = rows[line]["Symbol"];
            var jsonres = {"assetSymbol":assetSymbol,
                          "assetPrice":rows[line]["Last price"],
                          "range_start":rows[line]["Range start"],
                          "range_end":rows[line]["Range end"]
                          };

 		    jsonres = $.extend(jsonres, jsonform);
            var data = getResult (BASE_URL, "getresult", jsonres)


            console.log(assetSymbol+" done")
            console.log(data.full_result)
            res['constantDictList'][assetSymbol] = data.constantDict;
            res['allResults'] = res['allResults'].concat( data.full_result);
            console.log("_______________");
            step = step + 1;
            myprogress = (100 * step / nbsteps).toFixed(0)
            progressbar.setAttribute('style','width: '+myprogress+'%;');
            progressbar.setAttribute('aria-valuenow', myprogress);
            progressbar.innerText = myprogress+'%'
 		    }
        console.log("________________2__________________");
        var simuDate = new Date()
        res["simuDate"] = simuDate
        console.log (res)
        console.log("_____ sort ____")
        res['allResults'].sort(function(a, b) {return parseFloat(b['gainproba']) - parseFloat(a['gainproba']);});
        console.log (res)

        localStorage.setItem('res', JSON.stringify(res));
		console.log ("--------- done")
		document.getElementById("viewresults").disabled = false;
		}

function getExistingAssetList(){
    var items=[];

    //Iterate all td's in first column
    $('#mainTable tbody tr td:nth-child(1)').each( function(){
    //add item to array
    items.push( $(this).text() );
    });

    //restrict array to unique items
    var items = $.unique( items );
    return items;
	}
function showTableAlert (text,type)
    {

    if  (!text || 0 === text.length) return;
    $('#tablealerts'+type).html(text) ;
    $('#tablealerts'+type).fadeIn();

    }

function emptyTable()
    {
    $("#mainTable > tbody").empty();
    }

function addRows()
        {
            var $loading = $('#clock').waitMe({effect: 'timer',text: '',bg: 'rgba(255,255,255,0.90)',color: '#555'});
            $('.alert').hide()
            var errorResume = ''
            console.log("BASE_URL="+BASE_URL);
            var existingAssetList = getExistingAssetList();
            console.log (existingAssetList);
		    //Close price 	Last price 	Volatility 	Range start 	Range end
		    var assetSymbolString = document.getElementById("assetsymbols").value.toUpperCase().replace(/[^a-zA-Z0-9,]/g, '');
		    console.log ("assetSymbolString="+assetSymbolString);
			var assetsymbols = assetSymbolString.split(",");
            var assetsymbols = $.unique( assetsymbols );
			for (var i = assetsymbols.length - 1; i >= 0; i--) {
                if (existingAssetList.indexOf(assetsymbols[i])> -1 || assetsymbols[i].length < 1 ) {
                assetsymbols.splice(i, 1);
                }
            }
            console.log (assetsymbols);
			var l = assetsymbols.length;
			if (l == 0)
			    {
			    $loading.waitMe('hide');
			    return;
			    }


			var i = 0;
			assetsymbols.forEach(function(assetsymbol){
			    jQuery.support.cors = true;
			    $.ajaxSetup({
                    headers : { 'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                                'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
                                'Access-Control-Max-Age': 86400}
                });

				$.getJSON(BASE_URL+'/gettabledatas?assetSymbol='+assetsymbol, function(data) {

					if (data.error != '') {
					    errorResume = errorResume +  data.error + '<br>';
					    showTableAlert (errorResume,'warning');
					    }
					else {
					$("#mainTable > tbody").append("<tr><td class='removeclick' >"+data.symbol
					                             +"</td><td>"+data.prevclose.toFixed(2)
					                             +"</td><td>"+data.lastprice.toFixed(2)
					                             +"</td><td>"+data.sigma.toFixed(2)
					                             +"</td><td>"+data.rangestart.toFixed(2)
					                             +"</td><td>"+data.rangeend.toFixed(2)
					                             +"<td class='btnDelete' ><i class='material-icons'>delete</i></td></tr>");
					$('#mainTable').editableTableWidget();
                    $('.removeclick').bind('dblclick',function(e){ e.stopPropagation(); e.preventDefault();return true;})
                    $("#mainTable").on('click', '.btnDelete', function () {$(this).closest('tr').remove();});

                    }
                    i ++;
                    if (i == l) { $loading.waitMe('hide');  }
				});
				
			});

        }
		
		
