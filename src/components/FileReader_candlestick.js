//https://github.com/plotly/plotly.js/blob/master/dist/README.md
import * as Papa from "papaparse";
import * as d3 from "d3";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
// import Plotly from "plotly.js-basic-dist";
import Plotly from "plotly.js-finance-dist";
// import Plot from "react-plotly.js";
// import Plot from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import PreviousButton from "./PreviousButton";

// import { hashHistory } from "react-router";
//  var data = [];
// var allRows = null;
// image classification take x-axis as sphere size and y-axis as height

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
    // console.log("filteredData");
    // console.log(filteredData);

    tempObject.data_1 = d;
    tempObject.open = filteredData[0].price_1;

    tempObject.close = filteredData[filteredData.length - 1].price_1;
    tempObject.high = d3.max(filteredData, e => e.price_1);
    tempObject.low = d3.min(filteredData, e => e.price_1);
    result.push(tempObject);
  });

  return result;
}

/**
* Select 2 dropdowns one for int values on y-axis and second for string labels on x-axis.
*
* Group them, i.e. string labels, according to the classes and also choose frequency distribution of them.
*
* After selecting a group from the set of classes, calculate open, high, low, and close corresponding to datapoints that is x_data.
*
* Make a candlestick plot by plotting classes on x-axis and bars range on y-axis.

* @author Prakhar Gandhi
* @param {Array} allRows consists of an array of json objects present in csv file
* @return {void}
*
*/
function selectedYCandlestick(allRows) {
  var X_axisValue = $("#dataBtn_X :selected").val();
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  if (X_axisValue === "" || Y_axisValue === "") {
    return;
  }
  // console.log(X_axisValue);
  var class_data = [];

  var x_data = [],
    data = [],
    ans = [],
    i,
    row;

  for (i = 0; i < allRows.length; i++) {
    row = allRows[i];
    if (row[X_axisValue] === undefined || row[Y_axisValue] === undefined)
      continue;
    x_data.push(row[X_axisValue]);
    class_data.push(row[Y_axisValue]);
  }
  // console.log("class_data");
  // console.log(class_data);

  for (i = 0; i < class_data.length; i++) {
    data.push({
      price_1: x_data[i],
      date_1: class_data[i]
    });
  }
  ans = convertToOHLC(data);
  // console.log("ans", ans);
  var close_data = [],
    high_data = [],
    low_data = [],
    open_data = [],
    data_11 = [],
    numerics = [];
  for (i = 0; i < ans.length; i++) {
    if (ans[i].data_1 === undefined) continue;
    data_11.push(ans[i].data_1);
    close_data.push(parseFloat(ans[i].close));
    high_data.push(parseFloat(ans[i].high));
    low_data.push(parseFloat(ans[i].low));
    open_data.push(parseFloat(ans[i].open));
    numerics.push(i);
  }
  // console.log("data_11", data_11);
  // console.log("numerics", numerics);
  // console.log("close_data", close_data);

  // data_11 = data_11.filter(function(element) {
  //   return element !== undefined && element !== null;
  // });
  // close_data = close_data.filter(function(element) {
  //   return element !== undefined && element !== null && !isNaN(element);
  // });
  // high_data = high_data.filter(function(element) {
  //   return element !== undefined && element !== null && !isNaN(element);
  // });
  // low_data = low_data.filter(function(element) {
  //   return element !== undefined && element !== null && !isNaN(element);
  // });
  // open_data = open_data.filter(function(element) {
  //   return element !== undefined && element !== null && !isNaN(element);
  // });
  // console.log("close_data", close_data);

  // var trace = {
  //   type: "candlestick",
  //   xaxis: "x",
  //   yaxis: "y",

  //   x: data_11,
  //   close: close_data,
  //   high: high_data,
  //   low: low_data,
  //   open: open_data,

  //   // cutomise colors
  //   increasing: { line: { color: "black" } },
  //   decreasing: { line: { color: "red" } }
  // };

  // var candleDiv = document.getElementById("container");
  // var data = {
  //   x: data_11, //Each of these is a single dimension array of the same length
  //   open: open_data,
  //   close: close_data,
  //   high: high_data,
  //   low: low_data,
  //   type: "candlestick"
  // };
  // console.log("close_data", close_data);
  // console.log("high_data", high_data);
  // console.log("low_data", low_data);
  // console.log("open_data", open_data);

  var trace = {
    x: numerics,
    close: close_data,
    high: high_data,
    low: low_data,
    open: open_data,

    // cutomise colors
    increasing: { line: { color: "black" } },
    decreasing: { line: { color: "red" } },

    type: "candlestick",
    xaxis: "x",
    yaxis: "y"
  };

  var data_2 = [trace];

  // // var layout = {
  //   // datarevision: candleCount,
  //   dragmode: "zoom",
  //   showlegend: false
  // xaxis: {
  //   // range: [data_11[data_11.length - 26], data_11[data_11.length - 1]], //Only show the last 25 entries so it's not zoomed out too far.
  //   rangeslider: {
  //     visible: false
  //   },
  //   yaxis: {
  //     autorange: true
  //   }
  // }
  var layout = {
    dragmode: "zoom",
    showlegend: false,
    xaxis: {
      // xaxis_type: "category",
      autorange: true,
      title: X_axisValue,
      rangeselector: {
        visible: false
        // x: 0,
        // y: 1.2,
        // xanchor: "left",
        // font: { size: 8 }
        // buttons: [
        //   {
        //     step: "month",
        //     stepmode: "backward",
        //     count: 1,
        //     label: "1 month"
        //   },
        //   {
        //     step: "month",
        //     stepmode: "backward",
        //     count: 6,
        //     label: "6 months"
        //   },
        //   {
        //     step: "all",
        //     label: "All dates"
        //   }
        // ]
      }
    }
    // yaxis: {
    //   autorange: true
    // }
  };
  // data.xaxis = "x";
  // data.yaxis = "y";

  var myDiv = document.getElementById("container");
  const Plot = createPlotlyComponent(Plotly);
  ReactDOM.render(
    React.createElement(Plot, {
      data: data_2,
      layout: layout,
      onRelayout: function(eventdata) {
        var i;
        // console.log("eventdata", JSON.stringify(eventdata));
        // console.log("data", data);
        // console.log("layout.yaxis", layout.yaxis);
        var start = eventdata["xaxis.range[0]"];
        var end = eventdata["xaxis.range[1]"];
        var cl = numerics;
        // console.log("cl", cl);
        var newClasses = [];
        for (i = 0; i < cl.length; i++) {
          if (cl[i] > parseInt(start) && cl[i] <= parseInt(end)) {
            newClasses.push(data_11[i]);
          }
        }
        // console.log("newclasses", newClasses);
        // console.log("start,end", start, end);
        var imagesSlashed = [];

        for (i = 0; i < newClasses.length; i++) {
          imagesSlashed.push("./" + newClasses[i]);
        }
        // console.log("imagesSlashed", imagesSlashed);
        const cache = {};

        function importAll(r) {
          r.keys().forEach(key => (cache[key] = r(key)));
        }
        // Note from the docs -> Warning: The arguments passed to require.context must be literals!
        importAll(require.context("./images", false, /\.(png|jpe?g|svg)$/));

        const images = Object.entries(cache).map(module => module[1].default);
        const imagesKeys = Object.entries(cache).map(module => module[0]);
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
    }),
    myDiv
  );

  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
}
class FileReaderCandlestick extends React.Component {
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

    var options_2 = textColumns.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options_2.unshift(<option value="">Choose options</option>);
    // console.log("options_2");
    // console.log(options_2);

    ReactDOM.render(
      <select onChange={() => selectedYCandlestick(data)}>{options}</select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYCandlestick(data)}>{options_2}</select>,
      document.getElementById("dataBtn_Y")
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

export default FileReaderCandlestick;
