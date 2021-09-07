import * as Papa from "papaparse";
import * as d3 from "d3";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
// import ImageGallery from "react-image-gallery";
// import image1 from "./images/logo192.png";
// import SliderBox from "react-native-image-slider-with-text";
// import Plotly from "plotly.js-basic-dist";
// import Plotly from "plotly.js-finance-dist";
// import Plot from "react-plotly.js";
// import Plot from "plotly.js-basic-dist";
// import createPlotlyComponent from "react-plotly.js/factory";
import PreviousButton from "./PreviousButton";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
// import createPlotlyComponent from "react-plotly.js/factory";
// import Plotly from "plotly.js-finance-dist";

window.Highcharts = Highcharts;

// console.log("images", images);
var zoomButton;
/**
 * Checks if a string is a float,integer or a valid exponential notation
 * @author Prakhar Gandhi
 * @param {string} str  the target string.
 * @return {boolean} regex matching test for string.
 *
 */
function isItNumber(str) {
  return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(str);
}

/**
 * Returns open,high,low and close data array obtained from the target array.
 *
 * @param {Array} data the target array.
 *
 * @return {Array} result, the array consisting of open,high,low,close values.
 */

function convertToOHLC(data) {
  data.sort((a, b) => d3.ascending(a.date_1, b.date_1));
  var result = [];
  var allDates = [...new Set(data.map(d => d.date_1))];
  allDates.forEach(d => {
    var tempObject = {};

    var filteredData = [];
    filteredData = data.filter(e => e.date_1 === d);

    tempObject.activity = d;
    tempObject.open = filteredData[0].price_1;

    tempObject.close = filteredData[filteredData.length - 1].price_1;
    tempObject.high = d3.max(filteredData, e => e.price_1);
    tempObject.low = d3.min(filteredData, e => e.price_1);
    result.push(tempObject);
  });

  return result;
}

function selectedYCandlestickHighchart(data) {
  /**
   * Display a temporary label on the chart
   */
  function toast(chart, text) {
    chart.toast = chart.renderer
      .label(text, 100, 120)
      .attr({
        fill: Highcharts.getOptions().colors[0],
        padding: 10,
        r: 5,
        zIndex: 8
      })
      .css({
        color: "#FFFFFF"
      })
      .add();

    setTimeout(function() {
      chart.toast.fadeOut();
    }, 2000);
    setTimeout(function() {
      chart.toast = chart.toast.destroy();
    }, 2500);
  }

  /**
   * The handler for a custom event, fired from selection event
   */
  function selectedPoints(e) {
    // Show a label
    var ans = "";
    var imagesSlashed = [];

    for (var i = 0; i < e.points.length; i++) {
      //console.log(e.points[i].x);
      imagesSlashed.push("./" + e.points[i].name);
      ans += e.points[i].name + "<br>";
    }

    toast(
      this,

      e.points.length +
        " points selected.</b>" +
        "<br>Click on empty space to deselect." +
        "<b>" +
        ans
    );
    const cache = {};

    function importAll(r) {
      r.keys().forEach(key => (cache[key] = r(key)));
    }
    // Note from the docs -> Warning: The arguments passed to require.context must be literals!
    importAll(require.context("./images", false, /\.(png|jpe?g|svg)$/));

    const images = Object.entries(cache).map(module => module[1].default);
    const imagesKeys = Object.entries(cache).map(module => module[0]);
    // console.log("images", images);
    // console.log("imagesKeys", imagesKeys);

    var arr1 = imagesSlashed,
      arr2 = imagesKeys,
      res = arr1.filter(item => arr2.includes(item));
    var imagesData = [];
    for (i = 0; i < imagesKeys.length; i++) {
      for (var j = 0; j < res.length; j++) {
        if (imagesKeys[i] === res[j]) {
          imagesData.push(images[i]);
        }
      }
    }
    // console.log("res", res);
    // console.log("imagesData", imagesData);
    var mySet = new Set(imagesData);
    let myArray = Array.from(mySet);
    ReactDOM.render(
      <>
        <p>Media Page..</p>

        {myArray.map(image => (
          <img style={{ width: 100 }} src={image} alt="" />
        ))}
      </>,
      document.getElementById("root_2")
    );
  }

  /**
   * On click, unselect all points
   */
  function unselectByClick() {
    var points = this.getSelectedPoints();
    if (points.length > 0) {
      Highcharts.each(points, function(point) {
        point.select(false);
      });
    }
    // var point = points,
    //   series = point.series,
    //   chart = series.chart,
    //   xAxis = series.xAxis,
    //   yAxis = series.yAxis;
    // console.log("point", point);
    // console.log("series", series);
    // console.log("xAxis", xAxis);
    // console.log("yAxis", yAxis);
  }

  var X_axisValue = $("#dataBtn_X :selected").val();
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  var Z_axisValue = $("#dataBtn_Z :selected").val();

  // console.log(X_axisValue);
  // console.log(Y_axisValue);
  // console.log(Z_axisValue);

  var x_data = [],
    y_data = [],
    str_data = [],
    DATA = [],
    ans = [],
    DATA_2 = [];
  if (X_axisValue === "" || Y_axisValue === "" || Z_axisValue === "") {
    return;
  }

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (isNaN(row[X_axisValue])) continue;
    if (isNaN(row[Y_axisValue])) continue;
    x_data.push(parseFloat(row[X_axisValue]));
    y_data.push(parseFloat(row[Y_axisValue]));
    str_data.push(row[Z_axisValue]);
    DATA.push({
      x: x_data[i],
      price_1: x_data[i],
      y: y_data[i],
      date_1: str_data[i],
      activity: str_data[i]
    });
  }
  // console.log("DATA", DATA);
  ans = convertToOHLC(DATA);
  // console.log("ans:-", ans);
  var ohlc = [],
    close_data = [],
    high_data = [],
    low_data = [],
    open_data = [];
  for (i = 0; i < ans.length; i++) {
    if (ans[i].activity === undefined) continue;
    close_data.push(parseFloat(ans[i].close));
    high_data.push(parseFloat(ans[i].high));
    low_data.push(parseFloat(ans[i].low));
    open_data.push(parseFloat(ans[i].open));
    // ohlc.push([
    //   ans[i].activity, // the date
    //   ans[i].open, // open
    //   ans[i].high, // high
    //   ans[i].low, // low
    //   ans[i].close // close
    // ]);
    for (var j = 0; j < DATA.length; j++) {
      if (ans[i].activity === DATA[j].activity) {
        DATA_2.push({
          open: ans[i].open,
          close: ans[i].close,
          high: ans[i].high,
          low: ans[i].low,
          name: ans[i].activity,
          activity: ans[i].activity,
          x: DATA[j].x,
          y: DATA[j].y
        });
      }
    }
    ohlc.push({
      open: ans[i].open,
      close: ans[i].close,
      high: ans[i].high,
      low: ans[i].low,
      name: ans[i].activity
    });
  }
  // console.log("ohlc:-", ohlc);
  // console.log("DATA_2", DATA_2);
  //   console.log("x_data");
  //   console.log(x_data);
  //   console.log("y_data");
  //   console.log(y_data);
  const options = {
    title: {
      text: "Select points by click-drag"
    },

    mapNavigation: {
      enabled: true,
      enableButtons: true,
      enableTouchZoom: false,
      enableMouseWheelZoom: false,
      buttonOptions: {
        verticalAlign: "bottom",
        theme: {
          stroke: "#fff"
        }
      }
    },
    chart: {
      zoomType: "xy",

      events: {
        load: function() {
          // Set the initial axis scale
          // var axis = this.xAxis[0];
          this.initialMin = d3.min(x_data) - 10;
          this.initialMax = d3.max(x_data) + 10;
          this.initialMin_1 = d3.min(y_data) - 10;
          this.initialMax_1 = d3.max(y_data) + 10;

          // var y=this.yAxis[0];
          // axis.setExtremes(d3.min(x_data)-1000, d3.max(x_data)+1000);
          // y.setExtremes(d3.min(y_data)-1000, d3.max(y_data)+1000);
        },
        selection: function(e) {
          // let ch = this;
          var ch = this;
          // var xAxis = this.xAxis[0];
          // var yAxis = this.yAxis[0];
          zoomButton = ch.renderer
            .button(
              "Reset zoom",
              null,
              null,
              function() {
                ch.xAxis[0].setExtremes(ch.initialMin, ch.initialMax);
                ch.yAxis[0].setExtremes(ch.initialMin_1, ch.initialMax_1);
                ch.resetZoomButton.hide();
              },
              {
                zIndex: 20
              }
            )
            .attr({
              id: "resetZoom",
              align: "right",
              title: "Reset zoom"
            })
            .add()
            .align(
              {
                align: "right",
                x: -10,
                y: 10
              },
              false,
              null
            );
          Highcharts.each(this.series, function(series) {
            Highcharts.each(series.points, function(point) {
              if (
                point.x >= e.xAxis[0].min &&
                point.x <= e.xAxis[0].max &&
                point.y >= e.yAxis[0].min &&
                point.y <= e.yAxis[0].max
              ) {
                point.select(true, true);
              }
            });
          });

          Highcharts.fireEvent(this, "selectedpoints", {
            points: this.getSelectedPoints()
          });
        },
        selectedpoints: selectedPoints,
        click: unselectByClick,

        zoomType: "xy"
      },
      rangeSelector: {
        enabled: true
      },

      navigator: {
        enabled: true
      },
      type: "scatter",
      panning: true,
      panKey: "shift"
    },
    xAxis: {
      gridLineWidth: 1,
      lineWidth: 0,
      tickWidth: 0,
      events: {
        setExtremes: function(event) {
          if (!event.min && !event.max) {
            zoomButton.destroy();
          }
        }
      }
    },
    yAxis: {
      title: {
        text: ""
      }
    },
    plotOptions: {
      series: {
        type: "candlestick",
        name: "AAPL",
        data: DATA_2,
        lineColor: "#555555"
      },
      candlestick: {
        color: "red",
        lineColor: "orange",
        upLineColor: "red",
        upColor: "green"
      },
      scatter: {
        color: "white",
        lineColor: "white"
      }
    },
    tooltip: {
      formatter: function() {
        // let anss = this.point;
        // console.log("anss:-", anss);

        let tmpTooltip =
          "<b>" +
          this.point.category +
          '</b><br/><span style="color:' +
          this.point.color +
          '">\u25CF</span> ' +
          this.series.name +
          ": <b>" +
          this.point.y +
          "</b>";
        if (this.point.name !== "") {
          return tmpTooltip + "<br/><b>Label's Name:</b>" + this.point.name;
        } else {
          return tmpTooltip;
        }
      }
    },
    series: [
      {
        data: DATA_2,
        allowPointSelect: true,
        showInLegend: false
      },
      {
        name: "candlestick chart",
        type: "candlestick",

        data: DATA_2,
        tooltip: {
          valueSuffix: " "
        }
      }
      // {
      //   type: "areaspline",
      //   data: y_data,
      //   tooltip: {
      //     valueSuffix: " "
      //   }
      // }
    ]
  };

  const App = () => (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );

  ReactDOM.render(<App />, document.getElementById("root"));

  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
  // return { FlowData: mySeries };
}

class FileReaderCandlestickHighchart extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    var name = event.target.files[0].name;
    var regex = new RegExp("(.*?).(csv)$");
    if (!regex.test(name.toLowerCase())) {
      // el.value = '';
      alert("Please select correct file format");
      // this.setState({
      //   csvfile: undefined
      // });
    }
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    var data = result.data;
    var colNames = result.meta["fields"];
    // console.log("colNames", colNames);

    // console.log("data", data);
    var textColumns = [],
      nonTextColumns = [];
    var first = data[0];
    // console.log(first);
    for (var j = 0; j < colNames.length; j++) {
      if (!isItNumber(first[colNames[j]])) {
        textColumns.push(colNames[j]);
      }
      if (isItNumber(first[colNames[j]])) {
        nonTextColumns.push(colNames[j]);
      }
    }
    // console.log(nonTextColumns);
    // console.log(textColumns);
    var options = nonTextColumns.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options.unshift(<option value="">Choose options</option>);
    // console.log("options");
    // console.log(options);

    var options_2 = nonTextColumns.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options_2.unshift(<option value="">Choose options</option>);
    // console.log("options_2");
    // console.log(options_2);

    var options_3 = textColumns.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options_3.unshift(<option value="">Choose options</option>);
    // console.log("options_3");
    // console.log(options_3);

    ReactDOM.render(
      <select onChange={() => selectedYCandlestickHighchart(data)}>
        {options}
      </select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYCandlestickHighchart(data)}>
        {options_2}
      </select>,
      document.getElementById("dataBtn_Y")
    );
    ReactDOM.render(
      <select onChange={() => selectedYCandlestickHighchart(data)}>
        {options_3}
      </select>,
      document.getElementById("dataBtn_Z")
    );
  }

  render() {
    // console.log(this.state.csvfile);
    return (
      <div className="App">
        <h2>Import CSV File!</h2>
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />
        <button onClick={this.importCSV}> Upload now!</button>
      </div>
    );
  }
}

export default FileReaderCandlestickHighchart;
