// https://sites.google.com/view/tv-widgets-list
var dataNasdaq; var dataNyse;  // Definovanie premenných v globálnom rozsahu
$(document).ready(function(){
    jQuery(".editable").empty();
    $(window).scroll(function() {
      if ($(document).scrollTop() > 50) {
        $(".header-settings").addClass("fixed");
        $(".groups-wr").addClass("fixed");
      } else {
        $(".header-settings").removeClass("fixed");
        $(".groups-wr").removeClass("fixed");
      }
    });
    $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3500,
        autoplayHoverPause: true,
        smartSpeed: 800,
        responsive:{
            0:{
                items:1
            }
        }
    })
    
    /*
     * 
     * 
    // dotiahnutie dát NASDAQ
    const url = 'https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/nasdaq/nasdaq_tickers.json';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
          dataNasdaq = JSON.parse(xhr.responseText);
          console.log(dataNasdaq);
          //alert("data načítané");
          //alert(dataNasdaq[7]);
      } else {
          console.error('Nastala chyba pri načítavaní dát (NASDAQ)');
      }
    };
    xhr.send();
    
    // dotiahnutie dát NYSE
    const url2 = 'https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/nyse/nyse_tickers.json';
    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', url2);
    xhr2.onload = function() {
    if (xhr.status === 200) {
        dataNyse = JSON.parse(xhr2.responseText);
        console.log(dataNyse);
        //alert("data načítané");
        //alert(dataNyse[5]);
        jQuery(".add-widgets").addClass("loaded");
    } else {
        console.error('Nastala chyba pri načítavaní dát (NYSE)');
        jQuery(".add-widgets").addClass("loaded");
    }
    };
    xhr2.send();
    */
    
    /*
    const iframe = document.querySelector('iframe');
    const tableElements = iframe.contentDocument.querySelectorAll('tr, td'); // Prispôsobte selektor podľa typu prvkov tabuľky

    tableElements.forEach(element => {
      element.addEventListener('click', () => {
        alert("rrr");
        fetch(iframe.getAttribute('src'), {
          method: 'POST',
          // ... (pridajte ďalšie parametre požiadavky POST, ak je to potrebné)
        })
          .then(response => response.json())
          .then(data => {
            // Uložte analyzované JSON dáta do premennej
            const jsonData = data;

            // Spravujte JSON dáta, napríklad zistite veľkosť objektu
            console.log('Veľkosť JSON objektu:', jsonData.length);
          });
      });
    });*/
    
    const widgetObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const container = entry.target; // Toto je náš .tradingview-widget-container
            const width = Math.round(entry.contentRect.width + 2); //2 je celková veľkosť rámčekov
            const height = Math.round(entry.contentRect.height + 2);

            // 1. Aktualizácia rozmerov (.dim-display existuje v oboch prípadoch)
            const display = container.querySelector('.dim-display');
            if (display) {
                display.textContent = `w:${width}px, h:${height}px`;
            }

            // 2. Synchronizácia šírky info-containeru (len ak existuje)
            // Použijeme .closest() na nájdenie .outer, čo je bezpečné pre obe štruktúry
            const outer = container.closest('.tradingview-widget-container-outer');
            if (outer) {
                const infoContainer = outer.querySelector('.info-container');
                if (infoContainer) {
                    infoContainer.style.width = width + 'px';
                }
            }
        }
    });
    
    
    // load favourite group
      //var scGroupValue = getCookie('sc_group');
      var scGroupValue = localStorage.getItem('sc_group');
      //alert("scGroupValue: " + scGroupValue);
      //alert("typeof scGroupValue: " + typeof scGroupValue);
      if(scGroupValue !== null){
        var scGroupArray = scGroupValue.split("|");
        var scGroupLength = scGroupArray.length;
        //alert("scGroupValue: " + scGroupValue + "\n" + "scGroupLength: " + scGroupLength);
        var i = 0;
        var groupItems = "";
        var favouriteTickers = "";
        var groupHtml = "";
        
        var favouriteGroupItems = "";
        scGroupArray[0] = scGroupArray[0].trim();
        scGroupArray[0] = scGroupArray[0].replace("<br>", "");
        //alert("scGroupArray[i]: " + scGroupArray[i]);
        favouriteGroupItems = scGroupArray[0].split(",");
        favouriteTickers = scGroupArray[0].match(/,(.*)/)[1];
        //alert("favouriteTickers: " + favouriteTickers);
        if(favouriteTickers != ""){
          jQuery(".favourite-stocks").empty();
          stockByTickerList(favouriteTickers, 1);
          jQuery(".favourites").addClass("show");
          jQuery(".favourite-stocks").addClass("show");
        }
      }
      
      
      
    

    jQuery(".add-widgets").click(function(){
        //dotiahnutie zo zoznamu
        var list = jQuery(".ticker-box").val();
        stockByTickerList(list, 0);
    });
    
    // list - list of tickers divided by comma (for example: MSFT, AAPL, NVDA)
    // favourite - 1 if stock are displayed in section Favourites, else 0
    function stockByTickerList(list, favourite){
        //test prítomnosti dát nasdaq
        //alert("ns");
        //alert("dataNasdaq[9]: " + dataNasdaq[9]);
        //alert("dataNyse[5]: " + dataNyse[5]);
        //var index1 = dataNasdaq.indexOf("ABNB");
        //var index2 = dataNasdaq.indexOf("MMMM");
        //alert("index1: " + index1);
        //alert("index2: " + index2);
    
        const widgetContainer = document.getElementById('tradingview-widget-container');
    
        /*
        var widgetTest = '';
        widgetTest = widgetTest + '<!-- TradingView Widget BEGIN -->';
        widgetTest = widgetTest + '<div class="tradingview-widget-container" style="height:100%;width:100%">';
        widgetTest = widgetTest + '<iframe scrolling="no" allowtransparency="true" frameborder="0" style="user-select: none; box-sizing: border-box; display: block; height: calc(100% - 32px); width: 100%;" src="https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22NASDAQ%3ANVDA%22%2C%22interval%22%3A%22W%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22light%22%2C%22style%22%3A%221%22%2C%22hide_legend%22%3Atrue%2C%22allow_symbol_change%22%3Atrue%2C%22calendar%22%3Afalse%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22__NHTTP__%22%7D" title="advanced chart TradingView widget" lang="en"></iframe>';
        widgetTest = widgetTest + '</div>';
      
        widgetTest = widgetTest + '<!-- TradingView Widget END -->';
        widgetTest = widgetTest + '';
        */
        
        var useFilledSettings = $("#filled-settings").is(':checked');
        var scWidth = localStorage.getItem('sc_width');
        //alert("scWidth: " + scWidth);
        var chartWidth;
        if(scWidth !== null && scWidth !== "" && useFilledSettings == false){
          chartWidth = scWidth + "px";
        }
        else{
          chartWidth = $('#set-chart-width').val();
          chartWidth = (chartWidth == "") ? "500px" : (chartWidth + "px");
        }
        
        var scHeight = localStorage.getItem('sc_height');
        var chartHeith;
        if(scHeight !== null && scHeight !== "" && useFilledSettings == false){
          chartHeith = scHeight + "px";
        }
        else{
          var chartHeith = $('#set-chart-height').val();
          chartHeith = (chartHeith == "") ? "300px" : (chartHeith + "px");
        }
        
        var containerDimensionStr = " width:" + chartWidth + "; height:" + chartHeith;
        
        var scDateRange = localStorage.getItem('sc_dateRange');
        var dateRange;
        if(scDateRange !== null && scDateRange !== "" && useFilledSettings == false){
          dateRange = scDateRange;
        }
        else{
          var dateRange = $('#default-date-range option:selected').val();
        }
        var indicators = indicatorsStr();
        var volumeWithPrice = localStorage.getItem('sc_VolumeWithPrice');
        var chartVolumeWithPrice;
        if(volumeWithPrice !== null && volumeWithPrice == "1" && useFilledSettings == false){
          chartVolumeWithPrice = ''; //uložené: zobrazovať volume with price
        }
        else if(volumeWithPrice !== null && volumeWithPrice == "0" && useFilledSettings == false){
          chartVolumeWithPrice = '%22hide_volume%22%3Atrue%2C'; //uložené: nezobrazovať volume with price
        }
        else{ // zobrazovanie podľa formulára
          if($('#ind_Volume-with-price').is(':checked')){
            chartVolumeWithPrice = '';
          }
          else{
            chartVolumeWithPrice = '%22hide_volume%22%3Atrue%2C';
          }
        }
        
        //alert("indicators: " + indicators);
    
        var widgetTemplatePart1; var widgetTemplatePart1b; var widgetTemplatePart2; var widgetTemplatePart3; var widgetTemplatePart4;
        widgetTemplatePart1 = '<!-- TradingView Widget BEGIN -->';
        widgetTemplatePart1 = widgetTemplatePart1 + '<div class="tradingview-widget-container resizable-element';
        widgetTemplatePart1b = '" style="position: relative; ';
        widgetTemplatePart1b = widgetTemplatePart1b + containerDimensionStr + '">';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="stock-details-container"><div class="stock-details-inner"><div class="stock-details-close"></div><div class="stock-details-up"></div><div class="stock-details-down"></div></div></div>';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="tradingview-widget-inner">';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="widget-enlarge"></div>';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="stock-detail" title="details" data-ticker-searched="';
        widgetTemplatePart2 = '"><div class="stock-detail-bar"></div><div class="stock-detail-bar"></div><div class="stock-detail-bar"></div></div>';
        widgetTemplatePart2 = widgetTemplatePart2 + '<div class="widget-remove" title="remove"></div>';
        widgetTemplatePart2 = widgetTemplatePart2 + '<div class="dim-display"></div>';
        widgetTemplatePart2 = widgetTemplatePart2 + '<div class="ticker-searched">';
        widgetTemplatePart3 = '</div>';
        widgetTemplatePart3 = widgetTemplatePart3 + '<iframe scrolling="no" allowtransparency="true" frameborder="0" style="user-select: none; box-sizing: border-box; display: block; height: calc(100% - 32px); width: 100%;" src="https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22';
        //widgetTemplatePart2 = '%3A';
        widgetTemplatePart4 = '%22%2C%22interval%22%3A%22W%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22light%22%2C%22style%22%3A%221%22%2C%22withdateranges%22%3Atrue%2C%22hide_legend%22%3Afalse%2C%22range%22%3A%22'
        widgetTemplatePart4 = widgetTemplatePart4 + dateRange;
        widgetTemplatePart4 = widgetTemplatePart4 + '%22%2C%22allow_symbol_change%22%3Atrue%2C%22calendar%22%3Afalse%2C';
        widgetTemplatePart4 = widgetTemplatePart4 + indicators;
        widgetTemplatePart4 = widgetTemplatePart4 + chartVolumeWithPrice;
        widgetTemplatePart4 = widgetTemplatePart4 + '%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22__NHTTP__%22%7D" title="advanced chart TradingView widget" lang="en"></iframe>';
        widgetTemplatePart4 = widgetTemplatePart4 + '<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/?utm_source=&amp;utm_medium=widget_new&amp;utm_campaign=advanced-chart" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>';
        widgetTemplatePart4 = widgetTemplatePart4 + '</div>';
        widgetTemplatePart4 = widgetTemplatePart4 + '</div>';
        widgetTemplatePart4 = widgetTemplatePart4 + '<!-- TradingView Widget END -->';
    
        
        
        //jQuery(".stocks").html(widgetTest);
        //widgetContainer.innerHTML = widgetTest;
        
        // Spustite skript TradingView pre daný div
        /*const tradingViewScript = document.querySelector('#tradingview-widget-container script');
        tradingViewScript.parentNode.removeChild(tradingViewScript);
        const newScript = tradingViewScript.cloneNode(true);
        widgetContainer.appendChild(newScript);*/
        
        //
        if(favourite == 0){
          jQuery(".tradingview-widget-container").removeClass("last-added-group");
          jQuery(".tradingview-widget-container-outer").removeClass("last-added-group");
        }
        
        var lastAddedGroup;
        
        
        //dotiahnutie zo zoznamu
        //var list = jQuery(".ticker-box").val();
        //alert(list);
        
        var listArray = list.split(",");
        //listArray[1] = listArray[1].trim();
        
        var listLength = listArray.length;
        //alert("listLength: " + listLength);
        var i = 0;
        
        /*
        // 1. možnosť - ak z dotiahnutých dát NYSE a NASDAQ dopĺňam symbol do tvaru ako napríklad NASDAQ:AAPL
        var source = '';
        var itemForDataCheck = '';
        var indexOfNasdaq = "";
        var indexOfNyse = "";
        var widget = '';
        for (i = 0; i < listLength; i++){
          source = "";
          listArray[i] = listArray[i].trim();
          listArray[i] = listArray[i].replace("<br>", "");
          //alert("listArray[" + i + "]: " + listArray[i]);
          itemForDataCheck = listArray[i];
          itemForDataCheck = itemForDataCheck.replace("/P", "^");
          itemForDataCheck = itemForDataCheck.replace(".", "/");
          indexOfNasdaq = dataNasdaq.indexOf(itemForDataCheck);
          indexOfNyse = dataNyse.indexOf(itemForDataCheck);
          //alert("indexOfNasdaq: " + indexOfNasdaq);
          //alert("indexOfNyse: " + indexOfNyse);
          if(indexOfNasdaq != -1){
            source = "NASDAQ";
          }
          else if(indexOfNyse != -1){
            source = "NYSE";
          }
          //alert("source(" + i + "): " + source);
          widget = widgetTemplatePart1 + source + widgetTemplatePart2 + listArray[i] + widgetTemplatePart3;
          jQuery(".stocks").append(widget);
        }
        // koniec 1. možnosti
        */
        
        // 2. možnosť - symbol sa automaticky nedopĺňa do tvaru ako napríklad NASDAQ:AAPL
        // prinajmenšom pri trhoch NYSE a NASDAQ sa to nemusí dopĺňať v js kóde, lebo widget to zobrazí správne aj bez názvu trhu
        // pri ostatných trhoch je vhodné uviesť aj názov trhu ako napríklad GETTEX:BMW
        
        var widget = '';
        for (i = 0; i < listLength; i++){
          listArray[i] = listArray[i].trim();
          listArray[i] = listArray[i].replace("<br>", "");
          lastAddedGroup = "";
          if(i == 0 && favourite == 0){
            lastAddedGroup = " last-added-group";
          }
          widget = widgetTemplatePart1 + lastAddedGroup + widgetTemplatePart1b + listArray[i] + widgetTemplatePart2 + listArray[i]+ widgetTemplatePart3 + listArray[i]+ widgetTemplatePart4;
          let $fullWidget = $($.parseHTML(widget));
          if(favourite == 0){
            jQuery(".stocks").append($fullWidget);
          }
          if(favourite == 1){
            jQuery(".favourite-stocks").append($fullWidget);
          }
          // Teraz nájdeme kontajner v rámci už vloženého obsahu, aby sme ho mohli pozorovať
          let $container = $fullWidget.filter('.tradingview-widget-container');
          if ($container.length > 0) {
              widgetObserver.observe($container[0]);
          }
          // Voliteľne: Nastavíme počiatočné rozmery do .dim-display
          $container.find('.dim-display').text(`w:${chartWidth.replace('px','')}, h:${chartHeith.replace('px','')}`);
        }
        
        if(favourite == 0){
          // zistenie pozície pre nascrolovanie
          const scrollTop = window.pageYOffset;
          const currentScrollPosition = window.scrollY
          var lastAddedGroupOffset = jQuery(".last-added-group").offset().top;
          const totalHeight = document.documentElement.scrollHeight; //výška celej stránky
          var vHeight = window.innerHeight;
          
          var targetPosition;
          if(totalHeight - lastAddedGroupOffset < vHeight){
            targetPosition = totalHeight - vHeight - 10;
          }
          else{
            targetPosition = lastAddedGroupOffset - 10;
          }
          //alert("window.pageYOffset: " + window.pageYOffset + "\n" + "window.scrollY: " + window.scrollY + "\n" + "lastAddedGroupOffset: " + lastAddedGroupOffset + "\n" + "totalHeight: " + totalHeight + "\n" + "window.innerHeight: " + vHeight + "\n" + "targetPosition: " + targetPosition);
          
          
          // okamžité naskrolovanie
          window.scrollTo(0, targetPosition);
          
          
          /*
          // postupné naskrolovanie - náročnejšie na výkon prehliadača
          let step = 0; // 0 až 100
          var lambda = 0; // 0 až 1
          var p;
          var stepPosition;
          const myInterval = setInterval(function() {
            step++;
            lambda += 0.05;
            //lambda = lambda.toFixed(2);
            p = parseInt(lambda);
            //alert("lambda: " + lambda + "\n" + "p: " + p);
            if (Math.abs(p - 1) < 0.001) {
                //alert("clearInterval");
                stepPosition = currentScrollPosition + lambda * (targetPosition - currentScrollPosition);
                window.scrollTo(0, stepPosition);
                clearInterval(myInterval);
            }
            else{
              stepPosition = currentScrollPosition + lambda * (targetPosition - currentScrollPosition);
              window.scrollTo(0, stepPosition);
            }
          
          }, 30);
          */
        }
    }
    
    
    /*jQuery(".settings").click(function(){
        jQuery(".settings-container").slideToggle();
    });*/
    jQuery(".header-settings").click(function(){
        var scWidth = localStorage.getItem('sc_width');
        var scHeight = localStorage.getItem('sc_height');
        var scDateRange = localStorage.getItem('sc_dateRange');
        var useFilledSettings = $("#filled-settings").is(':checked');
        if(scWidth !== null && scWidth !== "" && useFilledSettings == false){
          jQuery("#set-chart-width").val(scWidth);
        }
        if(scHeight !== null && scHeight !== "" && useFilledSettings == false){
          jQuery("#set-chart-height").val(scHeight);
        }
        if(scDateRange !== null && scDateRange !== "" && useFilledSettings == false){
          //jQuery(".set-date-range").val(scDateRange);
          $("#default-date-range option").removeAttr("selected");
          var dateRangeSelector = "#default-date-range option[value=" + scDateRange + "]";
          scDateRange = jQuery(dateRangeSelector).attr("selected","");
        }
        jQuery(".settings-container-wr").toggleClass("show");
        refreshSavedValues();
        shadow();
    });
    $(".header-settings").hover(function(){
      
        if($(this).hasClass("fixed")){
          $(this).addClass("full-visible");
        }
      }, function(){
        if($(this).hasClass("fixed")){
          $(this).removeClass("full-visible");
        }
    });
    jQuery(".settings-confirm").click(function(){
        jQuery(".settings-container-wr").toggleClass("show");
        refreshSavedValues();
        shadow();
    });
    jQuery(".settings-save").click(function(){
        // save settings to localStorage
        var settingsStr = "";
        var width = jQuery("#set-chart-width").val();
        if(width == ""){width = 500;}
        localStorage.setItem("sc_width", width);
        var height = jQuery("#set-chart-height").val();
        if(height == ""){height = 300;}
        localStorage.setItem("sc_height", height);
        var selectedDateRange = $('#default-date-range').val();
        localStorage.setItem("sc_dateRange", selectedDateRange);
        var strIndCodes = "";
        if($('#ind_Volume-with-price').is(':checked')){
          localStorage.setItem("sc_VolumeWithPrice", 1);
        }
        else{
          localStorage.setItem("sc_VolumeWithPrice", 0);
        }
        $('.indicator-input-wr').each(function(i, obj) {
          if($(obj).find("input").is(':checked')){
              
              indAttr = $(obj).attr("data-ind-code");
			  //alert("i: " + i + "\n" + "indAttr: " + indAttr);
			  if(strIndCodes == ""){
                strIndCodes = indAttr;
			  }
			  else{
                strIndCodes = strIndCodes + "%2C" + indAttr;
			  }
			  
			}
        });
        //if(strIndCodes !== ""){
          localStorage.setItem("sc_indicators", strIndCodes);
        //}
        clearTimeout(this.settingsSaveTimeout);

            // Nastavíme nový timeout
            this.settingsSaveTimeout = setTimeout(() => {
                $(".settings-save").addClass("show");
            }, 200);
            this.settingsSaveTimeout = setTimeout(() => {
                $(".settings-save").removeClass("show");
            }, 2000);
        refreshSavedValues();
    });
    
    function refreshSavedValues(){
      var savedValuesHtml = "";
      var savedValueWidthHtml = "";
      var savedValueHeightHtml = "";
      var savedValueDateRangeHtml = "";
      var scWidth = localStorage.getItem('sc_width');
      var scHeight = localStorage.getItem('sc_height');
      var scDateRange = localStorage.getItem('sc_dateRange');
      var dateRangeSelector = "#default-date-range option[value=" + scDateRange + "]";
      scDateRange = jQuery(dateRangeSelector).html();
      if(scWidth !== null){
        savedValueWidthHtml = '<div class="saved-values"><div><span>saved: </span><span class="saved-value">' + scWidth + ' px</span></div></div>';
      }
      if(scHeight !== null){
        savedValueHeightHtml = '<div class="saved-values"><div><span>saved: </span><span class="saved-value">' + scHeight + ' px</span></div></div>';
      }
      if(scDateRange !== null && scDateRange !== undefined){
        savedValueDateRangeHtml = '<div class="saved-values"><div><span>saved: </span><span class="saved-value">' + scDateRange + '</span></div></div>';
      }
      jQuery(".saved-values").remove();
      jQuery(".set-width").append(savedValueWidthHtml);
      jQuery(".set-height").append(savedValueHeightHtml);
      jQuery(".set-date-range").append(savedValueDateRangeHtml);
      
    }
    
    
    jQuery(".test-json").click(function(){
      
        // POKUS 1
        //const url = 'https://query1.finance.yahoo.com/v8/finance/chart/PLUG?metrics=high?&interval=1d&range=5d&callback=myCallback';
        //var script = document.createElement('script');
        //script.src = url;
        //document.body.appendChild(script);
        /*
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
          if (xhr.status === 200) {
              dataTestJson = JSON.parse(xhr.responseText);
              console.log(dataTestJson);
              //alert("data načítané");
              alert(dataTestJson['chart']);
          } else {
              console.error('Nastala chyba pri načítavaní dát test-json');
          }
        };
        xhr.send();*/
        // KONIE POKUS 1
        
        // POKUS 2
        // Using YQL and JSONP
        /*$.ajax({
            url: "https://query1.finance.yahoo.com/v8/finance/chart/PLUG?metrics=high?&interval=1d&range=5d",
        
            // The name of the callback parameter, as specified by the YQL service
            jsonp: "callback",
        
            // Tell jQuery we're expecting JSONP
            dataType: "jsonp",
        
            // Tell YQL what we want and that we want JSON
            data: {
                //q: "select title,abstract,url from search.news where query=\"cat\"",
                format: "json"
            },
        
            // Work with the response
            success: function( response ) {
                console.log( response ); // server response
            }
        });*/
        
        
        // pokus 3
        /*$.ajax({
          url: "https://query1.finance.yahoo.com/v8/finance/chart/elv?metrics=high?&interval=1d&range=5d",
          jsonp: "callback",
          dataType: "json",
          headers: {
            "Accept": "application/json",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1"
          },
          success: function(data) {
            // Spracovanie JSON dát
            console.log(data);
          },
          error: function(xhr, status, error) {
            console.error("Nastala chyba:", error);
          }
        });*/
        
        // pokus 4
        var tic = "medp";
        //yahooF(tic);
        
        $.ajax({
          url: "https://query1.finance.yahoo.com/v8/finance/chart/elv?metrics=high?&interval=1d&range=5d",
          dataType: "json",
          proxy: {
            url: "https://github.com/Rob--W/cors-anywhere/", // URL proxy servera
            port: 8080 // Port proxy servera (predvolený je 80)
          },
          success: function(data) {
            // Spracovanie JSON dát
            console.log(data);
          },
          error: function(xhr, status, error) {
            console.error("Nastala chyba 1:", error);
          }
        });
        
        
        //http://data.asx.com.au/data/1/share/TLS/prices?interval=daily&count=1
        
        
    });
    
    function callback(data) {
      // Spracovanie JSON dát
      console.log(data);
    }
    
    // https://gist.github.com/daverich204/a9351caa678a96dd5eaccf048942890a?permalink_comment_id=5030350#file-code-gs
    function yahooF(ticker) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
      
      const res = UrlFetchApp.fetch(url, {muteHttpExceptions: true});  
      const contentText = res.getContentText();
      const data = JSON.parse(contentText);
    
      // Check if the result exists and has data
      if (data && data.chart && data.chart.result && data.chart.result.length > 0) {
        const regularMarketPrice = data.chart.result[0].meta.regularMarketPrice;
        console.log(regularMarketPrice);
        return regularMarketPrice;
      } else {
        console.log("Error: Unable to retrieve market price.");
        return null;
      }
    }
    
    

    
    jQuery("#w3review_button").click(function(){
        var w3review = jQuery("#w3review").val().replace(/\n/g, '<br />');
        jQuery(".stocks").append(w3review);
    });
    
    /*jQuery(".widget-enlarge").click(function(){
        $(this).closest(".tradingview-widget-container").addClass("fixed");
        
    });*/
    
    /*jQuery(".insert-tickers").click(function(){
        //jQuery(".editable").execCommand('paste');
        navigator.clipboardData.getData('text/html').then(function(a) {
          $('.editable').html(a); 
        });
    });  */
    
    jQuery(".editable").on("keyup paste", function(){
      if($(this).html() == '<br>'){
        $(this).empty();
      }
    }); 
    jQuery(".editable-clear").click(function(e){
      jQuery(".editable").empty();
      $(".charts-with-desc").addClass("unactiveBtn");
      $(".insert-tickers").addClass("unactiveBtn");
    }); 
    $('.editable').on('paste',function(event){
      
      if(event.type=='paste'){
        const bottomOffset = 110;
        const scrollTop = window.pageYOffset;
        var btnOffset = jQuery(".charts-with-desc-btn").offset().top;
        var vHeight = window.innerHeight;
        var condition = btnOffset - scrollTop;
        if(vHeight - condition < bottomOffset){
          window.scrollTo(0, scrollTop + (bottomOffset - (vHeight - condition)));
        }
      
        clearTimeout(this.maintimeout);
        this.maintimeout = setTimeout(() => {
          var editableDiv = document.querySelector('.editable');
          var screener1Items = editableDiv.querySelectorAll('.tv-data-table__row');
          //alert(screener1Items);
          var screenerEntry = 0;

          if (screener1Items.length > 0) {
            $('.editable-note span').html('TradingView screener');
            screenerEntry = 1;
          }
          
          if(screenerEntry == 1){
            clearTimeout(this.timeout);

            // Nastavíme nový timeout
            this.timeout = setTimeout(() => {
                $(".editable-note").addClass("show");
            }, 1000);
            this.timeout = setTimeout(() => {
                $(".editable-note").removeClass("show");
            }, 6000);
            $(".charts-with-desc").removeClass("unactiveBtn");
            $(".insert-tickers").removeClass("unactiveBtn");
          }
          
        }, 800);
        
        
      }  
    });
    
    jQuery(".stocks-clear").click(function(e){
      jQuery(".stocks").empty();
    });
    
    jQuery(".ticker-box-info-icon").click(function(e){
      jQuery(".ticker-box-info").toggleClass("show");
      jQuery(".ticker-info-close").toggleClass("show");
      shadow();
    });
    jQuery(".ticker-box-info-icon").mouseenter(function(e){
      jQuery(this).addClass("hovered");
      jQuery(this).find(".icon-i").attr("fill","#ffffff");
    });
     jQuery(".ticker-box-info-icon").mouseleave(function(e){
      jQuery(this).removeClass("hovered");
      jQuery(this).find(".icon-i").attr("fill","#203777");
    });
    
    
    jQuery(".ticker-info-close").click(function(e){
      jQuery(".ticker-box-info").removeClass("show");
      jQuery(this).removeClass("show");
      shadow();
    });
    
    /*jQuery(".screener-toggle").click(function(e){
      if (elemHasClass($(this), 'displayed')) {
        $(this).html("Show");
      }
      else{
        $(this).html("Hide");
      }
        
      $(this).toggleClass("displayed");  
      jQuery(".tradingview-widget-container.screener").slideToggle();
    });*/
    
    
    
    jQuery(".insert-tickers-btn").click(function(e){
	  jQuery(".insert-tickers-counts").slideToggle(); 
	  if(jQuery(".charts-with-desc-counts").css('display') == "block"){
		  jQuery(".charts-with-desc-counts").slideToggle(); 
	  }
	  const bottomOffset = 110;
	  const scrollTop = window.pageYOffset;
      var btnOffset = jQuery(".insert-tickers-btn").offset().top;
      var vHeight = window.innerHeight;
      var condition = btnOffset - scrollTop;
      if(vHeight - condition < bottomOffset){
        window.scrollTo(0, scrollTop + (bottomOffset - (vHeight - condition)));
      }
      //alert("scrollTop: " + scrollTop + "\n" + "x: " + x + "\n" + "btnOffset: " + btnOffset + "\n" + "vHeight: " + vHeight + "\n" + "condition: " + condition);
    });
	
	jQuery(".counts-wr .insert-counts").click(function(e){
	  var count = $(this).attr("data-val");
	  insertTickers(count);
	});	
	
	function insertTickers(count) {
	  var tvData = $('.editable').html();
      $('.editable').html(tvData);
      var tickerStr = "";
	  if (count == "all") {
		  $('.tv-data-table__row').each(function(i, obj) { //prechádzajú sa jednotlivé akcie vložené z Tradingview
			var ticker = $(obj).find(".tv-screener__symbol").html();
			//alert(i);
			if(i == 0){
			  tickerStr = ticker;
			}
			else{
			  tickerStr = tickerStr + ", " + ticker;
			}
		  }); 
	  }
	  else{
		count = parseInt(count);
		for (var i = 0; i < count; i++) {
			var ticker = $('.tv-data-table__row').eq(i).find(".tv-screener__symbol").html();
			if(typeof ticker === "undefined"){
				continue;
			}
			if (i == 0) {
				tickerStr = ticker;
			} else {
				tickerStr = tickerStr + ", " + ticker;
			}
		}
	  }
	  jQuery(".insert-tickers-counts").slideToggle();
      jQuery(".ticker-box").val(tickerStr);
    }
    
    jQuery(".charts-with-desc-btn").click(function(e){
	  jQuery(".charts-with-desc-counts").slideToggle(); 
	  if(jQuery(".insert-tickers-counts").css('display') == "block"){
		  jQuery(".insert-tickers-counts").slideToggle(); 
	  }
	  const bottomOffset = 110;
	  const scrollTop = window.pageYOffset;
      var btnOffset = jQuery(".charts-with-desc-btn").offset().top;
      var vHeight = window.innerHeight;
      var condition = btnOffset - scrollTop;
      if(vHeight - condition < bottomOffset){
        window.scrollTo(0, scrollTop + (bottomOffset - (vHeight - condition)));
      }
    });
    
    jQuery("#add-indicators").click(function(e){
      jQuery(".indicators-wr").addClass("show");
      var volumeWithPrice = localStorage.getItem('sc_VolumeWithPrice');
      if(volumeWithPrice == 1){
        
        $('.indicator-top-input-wr').addClass("saved");
      }
      else{
        $('.indicator-top-input-wr').removeClass("saved");
      }
      var savedIndicators = localStorage.getItem('sc_indicators');
      var indAttr;
      var index;
      $('.indicator-input-wr').each(function(i, obj) { //prechádzajú sa jednotlivé indikátory
          indAttr = $(obj).attr("data-ind-code");
          //alert("i: " + i + "\n" + "indAttr: " + indAttr);
          index = savedIndicators.indexOf(indAttr);
          if(index !== -1){
            $(obj).addClass("saved");
          }   
          else{
            $(obj).removeClass("saved");
          }
      });
      
      
    });
    
    jQuery(".indicators-wr-close").click(function(e){
      jQuery(".indicators-wr").removeClass("show");
      shadow();
    });
    jQuery(".indicator-confirm").click(function(e){
      jQuery(".indicators-wr").removeClass("show");
      shadow();
    });
    jQuery(".indicator-input-wr label").click(function(e){
      $(this).toggleClass("selected");
    });
    
    jQuery(".groups-wr").click(function(e){
      if(!$(".groups-container-wr").hasClass("show")){
        jQuery(".groups-container-wr").addClass("show");
        //var scGroupValue = getCookie('sc_group');
        var scGroupValue = localStorage.getItem('sc_group');
        if(scGroupValue !== null){
            var scGroupArray = scGroupValue.split("|");
            var scGroupLength = scGroupArray.length;
            //alert("scGroupValue: " + scGroupValue + "\n" + "scGroupLength: " + scGroupLength);
            var i = 0;
            var groupItems = "";
            var tickers = "";
            var groupHtml = "";
            for (i = 0; i < scGroupLength; i++){
                groupItems = "";
                tickers = ""
                scGroupArray[i] = scGroupArray[i].trim();
                scGroupArray[i] = scGroupArray[i].replace("<br>", "");
                //alert("scGroupArray[i]: " + scGroupArray[i]);
                groupItems = scGroupArray[i].split(",");
                //alert("i: " + i + "\n" + "groupItems[0]: " + groupItems[0]);
                tickers = scGroupArray[i].match(/,(.*)/)[1]; //časť reťazca za prvou čiarkou, teda tikery
                if(i == 0){ //favourites
                $('.group-data-wr').eq(i).find(".group-data-txt").val(tickers);
                }
                if(i > 0){ //
                var groupHtml = groupHtml + '<div class="group-data-wr added"><span class="gr-edit-btn" title="edit group name"><span class="gr-edit-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg></span></span><span class="gr-delete-btn" title="delete group name"><span class="gr-delete-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></span></span><div class="group-name">' + groupItems[0] + '</div><input class="group-name-input" type="text" placeholder="enter group name (do not use symbols | or ,)"><div class="group-data"><textarea class="group-data-txt" placeholder="enter symbols divided by comma" spellcheck=false>' + tickers + '</textarea></div><p class="group-data-alert">Click "Save" button</p></div>';
                
                
                //$('.group-data-wr').eq(i).find(".group-name").html(groupItems[0]);
                }
            }
            jQuery(".groups-data-container").append(groupHtml);
        }
      }
      shadow();
    });
    $(".groups-wr").hover(function(){
        if($(this).hasClass("fixed")){
          $(this).addClass("full-visible");
        }
      }, function(){
        if($(this).hasClass("fixed")){
          $(this).removeClass("full-visible");
        }
    });
    jQuery(".load-group").click(function(e){
      if(!$(".load-groups-container-wr").hasClass("show")){
        jQuery(".load-groups-container-wr").addClass("show");
        //var scGroupValue = getCookie('sc_group');
        var scGroupValue = localStorage.getItem('sc_group');
        if(scGroupValue !== null){
            var scGroupArray = scGroupValue.split("|");
            var scGroupLength = scGroupArray.length;
            //alert("scGroupValue: " + scGroupValue + "\n" + "scGroupLength: " + scGroupLength);
            var i = 0;
            var groupItems = "";
            var tickers = "";
            var groupHtml = "";
            for (i = 0; i < scGroupLength; i++){
                groupItems = "";
                tickers = ""
                scGroupArray[i] = scGroupArray[i].trim();
                scGroupArray[i] = scGroupArray[i].replace("<br>", "");
                //alert("scGroupArray[i]: " + scGroupArray[i]);
                groupItems = scGroupArray[i].split(",");
                //alert("i: " + i + "\n" + "groupItems[0]: " + groupItems[0]);
                tickers = scGroupArray[i].match(/,(.*)/)[1]; //časť reťazca za prvou čiarkou, teda tikery
                if(i == 0){ //favourites
                $('.load-group-data-wr').eq(i).find(".load-group-data-txt").html(tickers);
                }
                if(i > 0){ //
                var groupHtml = groupHtml + '<div class="load-group-data-wr added"><div class="load-group-name">' + groupItems[0] + '</div><div class="load-group-btn">Load</div><div class="load-group-data"><div class="load-group-data-txt">' + tickers + '</div></div></div>';
                
                }
            }
            jQuery(".load-groups-data-container").append(groupHtml);
        }
        shadow();
      }
    });
    jQuery(".group-container-close").click(function(e){
      jQuery(".groups-container-wr").removeClass("show");
      jQuery(".group-data-wr.added").remove();
      shadow();
    });
    jQuery(".load-group-container-close").click(function(e){
      jQuery(".load-groups-container-wr").removeClass("show");
      jQuery(".load-group-data-wr.added").remove();
      shadow();
    });
    jQuery("#group-save").click(function(e){
      var groupName;
      var groupTickers;
      var groupCookie = "";
      var inputValue;
      $('.group-data-wr').each(function(i, obj) { //prechádzajú sa jednotlivé stock group
          if($(obj).hasClass("edit")){
            //alert("i: " + i + " - má class edit");
            inputValue = $(obj).find(".group-name-input").val();
            $(obj).find(".group-name").html(inputValue);
            $(obj).removeClass("edit");
          }
          groupName = $(obj).find(".group-name").html();
          groupTickers = $(obj).find(".group-data-txt").val();
          if(i > 0){
            groupCookie = groupCookie + "|";
          }
          groupCookie = groupCookie + groupName + "," + groupTickers;
          
      });
      //alert("groupCookie: " + groupCookie);
      //document.cookie = "sc_group=" + groupCookie + "; path=/";
      //setCookie("sc_group", groupCookie, 3650); // 3650 dní = 10 rokov
      localStorage.setItem("sc_group", groupCookie);
      clearTimeout(this.groupSaveTimeout);

      // Nastavíme nový timeout
      this.groupSaveTimeout = setTimeout(() => {
          $("#group-save").addClass("show");
      }, 200);
      this.groupSaveTimeout = setTimeout(() => {
          $("#group-save").removeClass("show");
      }, 2000);
    });
    jQuery("#group-add").click(function(e){
      var newGroupHtml = '<div class="group-data-wr added edit"><span class="gr-edit-btn" title="edit group name"><span class="gr-edit-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg></span></span><span class="gr-delete-btn" title="delete group name"><span class="gr-delete-btn-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></span></span><div class="group-name"></div><input class="group-name-input" type="text" placeholder="enter group name (do not use symbols | or ,)"><div class="group-data"><textarea class="group-data-txt" placeholder="enter symbols divided by comma" spellcheck=false></textarea></div><p class="group-data-alert">Click "Save" button</p></div>';
      jQuery(".groups-data-container").append(newGroupHtml);
    });
    jQuery(".group-container-info-link").click(function(e){
      jQuery(".ticker-box-info").addClass("show");
      jQuery(".ticker-info-close").toggleClass("show");
      shadow();
    });
    jQuery(".menu").click(function(e){
      jQuery(".menu-list").toggleClass("show");
    });
    /*jQuery(".gr-edit-btn").click(function(e){
      $(this).closest(".group-data-wr").addClass("edit");
    });*/
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();  

    }
    function setCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";  

    }
    function shadow(){
        if(
        $(".groups-container-wr").hasClass("show") || 
        $(".load-groups-container-wr").hasClass("show") || 
        $(".settings-container-wr").hasClass("show") ||
        $(".indicators-wr").hasClass("show") ||
        $(".ticker-box-info").hasClass("show")
        ){
            $(".shadow-el").addClass("show");
        }
        else{
            $(".shadow-el").removeClass("show");
        }
    }
    
	jQuery(".charts-with-desc-counts-wr .insert-counts").click(function(e){
	  var count = $(this).attr("data-val");
	  chartsWithDesc(count);
	});
    
	function chartsWithDesc(count) {
        //alert(count);
		const columns = {
			columnsIndex: []
		};
		var test_Ch1 = "";
		var columnName = "";
		var columnFilter = "";
		var columnSort = 0;
		/*$('.tv-screener-table__head-wrap').each(function(i, obj) { //prechádzajú sa názvy stĺpcov z Tradingview
			columnName = $(obj).find(".js-head-title").html();
			test_Ch1 = test_Ch1 + ", " + columnName;
		});*/
		var condition = 0;
		var columnsCount = 0;
		for (var i = 0; condition < 2; i++) {
			columnName = $('.tv-screener-table__head-wrap').eq(i).find(".js-head-title").html();
			if(columnName == "Ticker" || columnName == "TICKER" ){
				condition = condition + 1;
			}
			/*else{
				if(i == 1){
					test_Ch1 = columnName;
				}else{
					test_Ch1 = test_Ch1 + ", " + columnName;
				}
			}*/
			if(condition < 2){
				columnFilter = $('.tv-screener-table__head-wrap').eq(i).find(".js-field-value").html();
                if(
                $('.tv-screener-table__sort').eq(i).hasClass("tv-screener-table__sort--desc") || 
                $('.tv-screener-table__sort').eq(i).hasClass("tv-screener-table__sort--asc"))
                {
                    columnSort = 1;
                }
                else{
                    columnSort = 0;
                }
				test_Ch1 = test_Ch1 + i + " - " + columnName + " - " + columnFilter + "\n";
				var newColumn = {
					name: columnName,
					filter: columnFilter,
                    sort: columnSort
				};
				columns.columnsIndex.push(newColumn);
				columnsCount = columnsCount + 1;
			}
			//alert("i:" + i + "\n" + "condition: " + condition + "\n" + "columnName: " + columnName + "\n" + "columnFilter: " + columnFilter);
			
			//columns[i]["columnName"] = columnName; - takto to nefunguje
			//columns[i]["columnFilter"] = columnFilter; - takto to nefunguje
			
			//columns.values[i].index = i;
			//columns.values[i].name = columnName;
			//columns.values[i].filter = columnFilter;
			
			
		}
		//alert(test_Ch1);
		//alert("columnsCount: " + columnsCount);
		//alert("columns.columnsIndex[7].name: " + columns.columnsIndex[7].name + "\n" + "columns.columnsIndex[7].filter: " + columns.columnsIndex[7].filter + "\n" + "columns.columnsIndex[8].name: " + columns.columnsIndex[8].name + "\n" + "columns.columnsIndex[8].filter: " + columns.columnsIndex[8].filter);
        
        /*var chartWidth = $('#set-chart-width').val();
        chartWidth = (chartWidth == "") ? "500px" : (chartWidth + "px");
        var chartHeith = $('#set-chart-height').val();
        chartHeith = (chartHeith == "") ? "300px" : (chartHeith + "px");
        var containerDimensionStr = " width:" + chartWidth + "; height:" + chartHeith;
        var infoDimensionStr = " width:" + chartWidth;
        
        var dateRange = $('#default-date-range option:selected').val();*/
        var useFilledSettings = $("#filled-settings").is(':checked');
        var scWidth = localStorage.getItem('sc_width');
        //alert("scWidth: " + scWidth);
        var chartWidth;
        if(scWidth !== null && scWidth !== "" && useFilledSettings == false){
          chartWidth = scWidth + "px";
        }
        else{
          chartWidth = $('#set-chart-width').val();
          chartWidth = (chartWidth == "") ? "500px" : (chartWidth + "px");
        }
        
        var scHeight = localStorage.getItem('sc_height');
        var chartHeith;
        if(scHeight !== null && scHeight !== "" && useFilledSettings == false){
          chartHeith = scHeight + "px";
        }
        else{
          var chartHeith = $('#set-chart-height').val();
          chartHeith = (chartHeith == "") ? "300px" : (chartHeith + "px");
        }
        
        var containerDimensionStr = " width:" + chartWidth + "; height:" + chartHeith;
        var infoDimensionStr = " width:" + chartWidth;
        
        var scDateRange = localStorage.getItem('sc_dateRange');
        var dateRange;
        if(scDateRange !== null && scDateRange !== "" && useFilledSettings == false){
          dateRange = scDateRange;
        }
        else{
          var dateRange = $('#default-date-range option:selected').val();
        }
        var indicators = indicatorsStr();
        var volumeWithPrice = localStorage.getItem('sc_VolumeWithPrice');
        var chartVolumeWithPrice;
        if(volumeWithPrice !== null && volumeWithPrice == "1" && useFilledSettings == false){
          chartVolumeWithPrice = ''; //uložené: zobrazovať volume with price
        }
        else if(volumeWithPrice !== null && volumeWithPrice == "0" && useFilledSettings == false){
          chartVolumeWithPrice = '%22hide_volume%22%3Atrue%2C'; //uložené: nezobrazovať volume with price
        }
        else{ // zobrazovanie podľa formulára
          if($('#ind_Volume-with-price').is(':checked')){
            chartVolumeWithPrice = '';
          }
          else{
            chartVolumeWithPrice = '%22hide_volume%22%3Atrue%2C';
          }
        }
		
		var widgetTemplatePart1; var widgetTemplatePart1b ;var widgetTemplatePart2; var widgetTemplatePart3; var widgetTemplatePart4; var widgetTemplatePart5;
        widgetTemplatePart1 = '<!-- TradingView Widget BEGIN -->';
		widgetTemplatePart1 = widgetTemplatePart1 + '<div class="tradingview-widget-container-outer';
		
		
		widgetTemplatePart1b = '">';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="tradingview-widget-container resizable-element" style="position: relative; ';
        widgetTemplatePart1b = widgetTemplatePart1b + containerDimensionStr + '">';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="stock-details-container"><div class="stock-details-inner"><div class="stock-details-close"></div><div class="stock-details-up"></div><div class="stock-details-down"></div></div></div>';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="tradingview-widget-inner">';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="widget-enlarge"></div>';
        widgetTemplatePart1b = widgetTemplatePart1b + '<div class="stock-detail" title="details" data-ticker-searched="';
        widgetTemplatePart2 = '"><div class="stock-detail-bar"></div><div class="stock-detail-bar"></div><div class="stock-detail-bar"></div></div>';
        widgetTemplatePart2 = widgetTemplatePart2 + '<div class="widget-remove" title="remove"></div>';
        widgetTemplatePart2 = widgetTemplatePart2 + '<div class="dim-display"></div>';
        widgetTemplatePart2 = widgetTemplatePart2 + '<div class="ticker-searched">';
        widgetTemplatePart3 = '</div>';
        widgetTemplatePart3 = widgetTemplatePart3 + '<iframe scrolling="no" allowtransparency="true" frameborder="0" style="user-select: none; box-sizing: border-box; display: block; height: calc(100% - 32px); width: 100%;" src="https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22';
        //widgetTemplatePart2 = '%3A';
        widgetTemplatePart4 = '%22%2C%22interval%22%3A%22W%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22light%22%2C%22style%22%3A%221%22%2C%22withdateranges%22%3Atrue%2C%22hide_legend%22%3Afalse%2C%22range%22%3A%22';
        widgetTemplatePart4 = widgetTemplatePart4 + dateRange;
        widgetTemplatePart4 = widgetTemplatePart4 + '%22%2C%22allow_symbol_change%22%3Atrue%2C%22calendar%22%3Afalse%2C';
        
        widgetTemplatePart4 = widgetTemplatePart4 + indicators;
        widgetTemplatePart4 = widgetTemplatePart4 + chartVolumeWithPrice;
        widgetTemplatePart4 = widgetTemplatePart4 + '%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22__NHTTP__%22%7D" title="advanced chart TradingView widget" lang="en"></iframe>';
        widgetTemplatePart4 = widgetTemplatePart4 + '<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/?utm_source=&amp;utm_medium=widget_new&amp;utm_campaign=advanced-chart" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>';
        widgetTemplatePart4 = widgetTemplatePart4 + '</div>';
        widgetTemplatePart4 = widgetTemplatePart4 + '</div>';
		widgetTemplatePart4 = widgetTemplatePart4 + '<div class="info-container clearfix" style="';
        widgetTemplatePart4 = widgetTemplatePart4 + infoDimensionStr + '">';
		widgetTemplatePart5 = '</div>';
		widgetTemplatePart5 = widgetTemplatePart5 + '</div>';
        widgetTemplatePart5 = widgetTemplatePart5 + '<!-- TradingView Widget END -->';

        jQuery(".tradingview-widget-container").removeClass("last-added-group");
        jQuery(".tradingview-widget-container-outer").removeClass("last-added-group");
        var lastAddedGroup;

		var ticker = "";
		var row;
		var tdValue;
		var tdHead;
		var tdFilter;
		var filterClass;
        var tdSort;
        var sortClass;
		var k;
		var infoHtml;
		var widget = '';
		for (var j = 0; j < count; j++) {
			ticker = $('.tv-data-table__row').eq(j).find(".tv-screener__symbol").html();
			if(typeof ticker === "undefined"){
				continue;
			}
			//row = $('.tv-data-table__row').eq(j);
			//td = $('.tv-data-table__row').eq(j).find('.tv-data-table__cell').eq(3).html();
			//alert("ticker: " + ticker);
			/*$('.tv-data-table__cell').each(function(i, obj) { //prechádzajú sa jednotlivé stĺpce riadka akcie 
				
			}); */
			infoHtml = '';
			for(k = 1; k < columnsCount; k++){
				tdValue = $('.tv-data-table__row').eq(j).find('.tv-data-table__cell').eq(k).html();
				tdHead = columns.columnsIndex[k].name;
				//alert("tdHead: " + tdHead + ", tdValue: " + tdValue);
				tdFilter = columns.columnsIndex[k].filter;
				if(typeof tdFilter === "undefined"){
					filterClass = "";
				}
				else{
					filterClass = " filter-used"
				}
				tdSort = columns.columnsIndex[k].sort;
                if(tdSort == 0){
                    sortClass = "";
                }
                else{
                    sortClass = " sort-used";
                }
				infoHtml = infoHtml + '<span class="info-item' + filterClass + sortClass + '"><span class="info-item-hd">' + tdHead + '</span>' + '<span class="info-item-value">' + tdValue + '</span></span>';
			}
			
			lastAddedGroup = "";
            if(j == 0){
              lastAddedGroup = " last-added-group";
            }
			
			widget = widgetTemplatePart1 + lastAddedGroup + widgetTemplatePart1b + ticker + widgetTemplatePart2 + ticker + widgetTemplatePart3 + ticker + widgetTemplatePart4 + infoHtml + widgetTemplatePart5;
            let $fullWidget = $($.parseHTML(widget));
			jQuery(".stocks").append($fullWidget);
            // UPRAVENÉ: Ak je .tradingview-widget-container vnútri .tradingview-widget-container-outer
            // musíme ho nájsť pomocou .find() (ak je kontajner súčasťou fullWidgetu)
            // alebo použiť .filter() ak je fullWidget priamo ten kontajner.
            let $container = $fullWidget.hasClass('tradingview-widget-container') 
                            ? $fullWidget 
                            : $fullWidget.find('.tradingview-widget-container');

            if ($container.length > 0) {
                widgetObserver.observe($container[0]);
                // Nastavenie počiatočných rozmerov
                $container.find('.dim-display').text(`w:${chartWidth.replace('px','')}, h:${chartHeith.replace('px','')}`);
            } else {
                console.warn("Element .tradingview-widget-container nebol nájdený v štruktúre!");
            }
		}
		jQuery(".charts-with-desc-counts").slideToggle();
		
		// zistenie pozície pre nascrolovanie
        const scrollTop = window.pageYOffset;
        const currentScrollPosition = window.scrollY
        var lastAddedGroupOffset = jQuery(".last-added-group").offset().top;
        const totalHeight = document.documentElement.scrollHeight; //výška celej stránky
        var vHeight = window.innerHeight;
        
        var targetPosition;
        if(totalHeight - lastAddedGroupOffset < vHeight){
          targetPosition = totalHeight - vHeight - 10;
        }
        else{
          targetPosition = lastAddedGroupOffset - 10;
        }
        //alert("window.pageYOffset: " + window.pageYOffset + "\n" + "window.scrollY: " + window.scrollY + "\n" + "lastAddedGroupOffset: " + lastAddedGroupOffset + "\n" + "totalHeight: " + totalHeight + "\n" + "window.innerHeight: " + vHeight + "\n" + "targetPosition: " + targetPosition);
        
        
        // okamžité naskrolovanie
        window.scrollTo(0, targetPosition);
		
	}
    
    function elemHasClass(elem, className) {
        return elem.className.split(' ').indexOf(className) > -1;
    }
    
    document.addEventListener('click', function (e) {
      //alert(e.target);
        if (elemHasClass(e.target, 'widget-enlarge')) {
            // .widget-enlarge clicked
            //  alert("hhh");
            if (elemHasClass(e.target, 'enlarged')) {
              e.target.closest(".tradingview-widget-container").classList.remove('fixed');
              e.target.classList.remove('enlarged');
              if(elemHasClass(e.target, 'screener-enlarge')){
                e.target.closest(".tradingview-widget-container").classList.remove('box-shadow');
              }
            } else{
              e.target.closest(".tradingview-widget-container").classList.add('fixed');
              e.target.classList.add('enlarged');
              if(elemHasClass(e.target, 'screener-enlarge')){
                e.target.closest(".tradingview-widget-container").classList.add('box-shadow');
              }
            }
        } 
        if (elemHasClass(e.target, 'stock-detail')) {
            var ticker = e.target.getAttribute("data-ticker-searched");
            stockDetails(e, ticker);
        }
        if (elemHasClass(e.target, 'stock-detail-bar')) {
            var ticker = e.target.closest(".stock-detail").getAttribute("data-ticker-searched");
            stockDetails(e, ticker);
        }
        if (elemHasClass(e.target, 'stock-details-close')) {
            e.target.closest(".stock-details-container").classList.remove('show');
            e.target.closest(".stock-details-container").classList.add('stock-details-loaded');
        }
        if (elemHasClass(e.target, 'stock-details-down')) { 
            e.target.closest(".stock-details-container").scrollTop += 0.5 * window.innerHeight; 
        }
        if (elemHasClass(e.target, 'stock-details-up')) {
            e.target.closest(".stock-details-container").scrollTop -= 0.5 * window.innerHeight; 
        }
        if (elemHasClass(e.target, 'widget-remove')) {
            var elementToRemove = e.target.closest(".tradingview-widget-container-outer");
            if (elementToRemove) {
              elementToRemove.remove();
            }
            else{
              e.target.closest(".tradingview-widget-container").remove();
            }
        }
        
        if (elemHasClass(e.target, 'screener-toggle')) {
          if (elemHasClass(e.target, 'displayed')) {
            $(e.target).html("Show");
            //alert("1");
          }
          else{
            $(e.target).html("Hide");
            //alert("2");
          }
            
          $(e.target).toggleClass("displayed");  
          jQuery(".tradingview-widget-container.screener").toggleClass("displayed");  
          //jQuery(".tradingview-widget-container.screener").slideToggle();
        }
        /*if (elemHasClass(e.target, 'insert-tickers')) {
          var htmltext = document.clipboardData.getData('text/html');
          $('.editable').html(htmltext); 
        }*/
        if (elemHasClass(e.target, 'gr-edit-btn')) {
            if (!elemHasClass(e.target.closest(".group-data-wr"), 'edit')) {
              e.target.closest(".group-data-wr").classList.add('edit');
            }
            else{
              e.target.closest(".group-data-wr").classList.remove('edit');
            }
        }
        if (elemHasClass(e.target, 'gr-delete-btn')) {
            e.target.closest(".group-data-wr").remove();
        }
        if (elemHasClass(e.target, 'load-group-btn')) {
            var tickers = e.target.closest(".load-group-data-wr").querySelector(".load-group-data-txt").innerHTML;
            jQuery(".ticker-box").val(tickers);  
            stockByTickerList(tickers, 0);
        }
        
        
        
    }, false);
    
    const insertTickersElement = document.querySelector('.insert-tickers');
    const editableElement = document.querySelector('.editable');

    /*insertTickersElement.addEventListener('click', () => {
      // Získanie obsahu schránky
      const clipboardContent = navigator.clipboard.readText();

      // Vloženie obsahu schránky do editovateľného elementu
      editableElement.innerHTML = clipboardContent;
    });*/
    /*insertTickersElement.addEventListener('click', () => {
      // Získanie Promise z schránky
      const clipboardPromise = navigator.clipboard.readText();

      // Počkanie na vyriešenie Promise
      clipboardPromise.then(clipboardContent => {
        // Vloženie obsahu do editovateľného elementu
        editableElement.innerHTML = clipboardContent;
      });
    });*/
    
    /*insertTickersElement.addEventListener('click', () => {
    // Získanie Promise z schránky
    const clipboardPromise = navigator.clipboard.readHTML();

    // Počkanie na vyriešenie Promise
    clipboardPromise.then(clipboardContent => {
      // Prekonvertovanie obsahu na DOM
      const parser = new DOMParser();
      const doc = parser.parseFromString(clipboardContent, 'text/html');

      // Vloženie obsahu do editovateľného elementu
      editableElement.innerHTML = doc.body.innerHTML;
    });*/
    /*insertTickersElement.addEventListener('click', () => {
      // Vloženie obsahu schránky do editovateľného elementu
      editableElement.focus();
      document.execCommand('paste');
    });*/


    
    
    function stockDetails(e, ticker){
      e.target.closest(".tradingview-widget-container").querySelector(".stock-details-container").classList.add('show');
      //alert("stockDetails for " + ticker);
      if(!elemHasClass(e.target.closest(".tradingview-widget-container").querySelector(".stock-details-container"), 'stock-details-loaded')) {
          var stockDetailsHtml = '<div class="stock-details-inner">';
          var stockDetailsClose = '<div class="stock-details-close"></div>';
          var stockDetailsScroll = '<div class="stock-details-up"></div><div class="stock-details-down"></div>';
          var symbolInfoWidgetHtml = symbolInfoWidget(ticker);
          var advancedChartDetailHtml = advancedChartDetailWidget(ticker);
          var fundamentalDataHtml = fundamentalDataWidget(ticker);
          stockDetailsHtml += stockDetailsClose + stockDetailsScroll + symbolInfoWidgetHtml + advancedChartDetailHtml + fundamentalDataHtml;
          stockDetailsHtml += '</div>';
          e.target.closest(".tradingview-widget-container").querySelector(".stock-details-container").innerHTML = stockDetailsHtml;
      }
    }
    
    function symbolInfoWidget(ticker){
      var symbolInfoWidgetHtml1; 
      var tickerSrc = ticker.replace(":", "%3A");
      symbolInfoWidgetHtml1 = '<!-- TradingView Widget BEGIN -->';
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + '<div class="tradingview-widget-container" style="width: 100%; height: auto;">'; //height: 207px;
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + '<iframe scrolling="no" allowtransparency="true" frameborder="0" style="user-select: none; box-sizing: border-box; display: block; height: 175px; width: 100%;" src="https://www.tradingview-widget.com/embed-widget/symbol-info/?locale=en&amp;symbol=';
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + tickerSrc;
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + '#%7B%22symbol%22%3A%22';
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + tickerSrc;
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + '%22%2C%22width%22%3A%22100%25%22%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22height%22%3A205%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22symbol-info%22%2C%22page-uri%22%3A%22__NHTTP__%22%7D" title="symbol info TradingView widget" lang="en"></iframe>';
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + '<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/?utm_source=&amp;utm_medium=widget_new&amp;utm_campaign=symbol-info" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>';
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + '</div>';
      symbolInfoWidgetHtml1 = symbolInfoWidgetHtml1 + '<!-- TradingView Widget END -->';
      return symbolInfoWidgetHtml1;
    }
    
    function advancedChartDetailWidget(ticker){
      var advancedChartDetailHtml; 
      var tickerSrc = ticker.replace(":", "%3A");
      advancedChartDetailHtml = '<!-- TradingView Widget BEGIN -->';
      advancedChartDetailHtml = advancedChartDetailHtml + '<div class="tradingview-widget-container advancedChartDetailWidget" style="height:100%;width:100%">';
      advancedChartDetailHtml = advancedChartDetailHtml + '<iframe scrolling="no" allowtransparency="true" frameborder="0" style="user-select: none; box-sizing: border-box; display: block; height: calc(100% - 32px); width: 100%;" src="https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22symbol%22%3A%22';
      advancedChartDetailHtml = advancedChartDetailHtml + tickerSrc;
      advancedChartDetailHtml = advancedChartDetailHtml + '%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22theme%22%3A%22light%22%2C%22style%22%3A%221%22%2C%22range%22%3A%2260M%22%2C%22hide_side_toolbar%22%3Afalse%2C%22allow_symbol_change%22%3Atrue%2C%22details%22%3Atrue%2C%22calendar%22%3Afalse%2C%22support_host%22%3A%22https%3A%2F%2Fwww.tradingview.com%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22advanced-chart%22%2C%22page-uri%22%3A%22__NHTTP__%22%7D" title="advanced chart TradingView widget" lang="en"></iframe>';
      advancedChartDetailHtml = advancedChartDetailHtml + '<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/?utm_source=&amp;utm_medium=widget_new&amp;utm_campaign=advanced-chart" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>';
      advancedChartDetailHtml = advancedChartDetailHtml + '</div>';
      advancedChartDetailHtml = advancedChartDetailHtml + '<!-- TradingView Widget END -->';
      
      return advancedChartDetailHtml;
    }
    
    function fundamentalDataWidget(ticker){
      var fundamentalDataHtml;
      var tickerSrc = ticker.replace(":", "%3A");
      fundamentalDataHtml = '<!-- TradingView Widget BEGIN -->';
      fundamentalDataHtml = fundamentalDataHtml + '<div class="tradingview-widget-container" style="width: 100%; height: 500px;">';
      fundamentalDataHtml = fundamentalDataHtml + '<iframe scrolling="no" allowtransparency="true" frameborder="0" style="user-select: none; box-sizing: border-box; display: block; height: calc(100% - 32px); width: 100%;" src="https://www.tradingview-widget.com/embed-widget/financials/?locale=en#%7B%22isTransparent%22%3Afalse%2C%22largeChartUrl%22%3A%22%22%2C%22displayMode%22%3A%22compact%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22colorTheme%22%3A%22light%22%2C%22symbol%22%3A%22';
      fundamentalDataHtml = fundamentalDataHtml + tickerSrc;
      fundamentalDataHtml = fundamentalDataHtml + '%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22financials%22%2C%22page-uri%22%3A%22__NHTTP__%22%7D" title="financials TradingView widget" lang="en"></iframe>';
      fundamentalDataHtml = fundamentalDataHtml + '<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/?utm_source=&amp;utm_medium=widget_new&amp;utm_campaign=financials" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>';
      fundamentalDataHtml = fundamentalDataHtml + '</div>';
      fundamentalDataHtml = fundamentalDataHtml + '<!-- TradingView Widget END -->';
      
      return fundamentalDataHtml;
    }
    
    function indicatorsStr(){
      var str = "";
      var strIndCodes = "";
      var indAttr;
      var useFilledSettings = $("#filled-settings").is(':checked');
      var scIndicators = localStorage.getItem('sc_indicators');
      //var chartWidth;
      if(scIndicators !== null/* && scIndicators !== ""*/ && useFilledSettings == false){
          strIndCodes = scIndicators;
      }
      else{
        $('.indicator-input-wr').each(function(i, obj) { //prechádzajú sa jednotlivé indikátory
              if($(obj).find("input").is(':checked')){
                indAttr = $(obj).attr("data-ind-code");
                //alert("i: " + i + "\n" + "indAttr: " + indAttr);
                if(strIndCodes == ""){
                  strIndCodes = indAttr;
                }
                else{
                  strIndCodes = strIndCodes + "%2C" + indAttr;
                }
                
              }
        });
      }
      //alert("strIndCodes: " + strIndCodes);
      if(strIndCodes !== ""){
        str = "%22studies%22%3A%5B" + strIndCodes + "%5D%2C";
      }
      //alert("str: " + str);
      return str;
    }
    
}); 
