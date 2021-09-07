import * as d3 from "d3";
import * as Papa from "papaparse";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
// import Plotly from "plotly.js-basic-dist";
// import Plotly from "plotly.js-dist";// plotly.js-dist@1.58.4
//import Plotly from "plotly.js/lib/scatterpolar";
import Plotly from "plotly.js/lib/index";
import createPlotlyComponent from "react-plotly.js/factory";
import PreviousButton from "./PreviousButton";

// import { hashHistory } from "react-router";

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
 * takes array and split it into train and test according to ratio size of the data
 * @author Prakhar Gandhi
 * @param {Array} arr the target array of data
 * @param {Array} n the size to be splitted.
 * @return {Array} result, gives back training data as an array.
 *
 */
function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
function printArr(arr) {
  console.log(arr);
}
/**
 * takes data according to keys that is idx1 and idx2
 * @author Prakhar Gandhi
 * @param {arr} arr the target array
 * @param {string} idx1 the target string of array
 * @param {string} idx2 the target string of array.
 * @return {Dictionary} x_data and y_data according to keys, idx1 and idx2.
 *
 */
function getRandomData(arr, idx1, idx2) {
  var x_data = [],
    y_data = [];

  for (var i = 0; i < arr.length; i++) {
    if (isNaN(arr[i][idx1])) continue;
    x_data.push(parseFloat(arr[i][idx1]));
    y_data.push(parseFloat(arr[i][idx2]));
  }
  // console.log("x_data");
  // printArr(x_data);
  // console.log("y_data");
  // printArr(y_data);

  return {
    x_data: x_data,
    y_data: y_data
  };
}
/**
 * takes non zero length and calculates the average of the integer/float array
 * @author Prakhar Gandhi
 * @param {arr} arr the target array
 * @return {int} average of sum of an array.
 *
 */
function getAverage(arr) {
  var average = 0;
  for (var k = 0; k < arr.length; k++) {
    average = average + arr[k];
  }
  // console.log("average before dividing with length:", average);
  // console.log("arr.length", arr.length);
  if (arr.length !== 0) {
    average = average / arr.length;
    // console.log("Non zero average", average);
    return average;
  } else {
    // console.log("Length should be non zero");
    return;
  }
}
/**
* Select 2 dropdowns of a single class containing floats or int values and split them into train and test dataset internally by selecting ratio size.
*
* After selecting train and test data from x and y dropdowns compute the average of radial axis of both datasets.
*
* Make a different kind of polar plots like scatter plot,area plot by plotting average value on r-axis and y data on theta-axis.

* @author Prakhar Gandhi
* @param {Array} data consists of an array of json objects present in csv file
* @param {Array} keys consists of an array of column names present in csv file
* @return {void}
*
*/
function selectedYScatterPolarPlot(data, keys) {
  var allRows = data;
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  var X_axisValue = $("#dataBtn_X :selected").val();

  //   console.log(X_axisValue);
  //   console.log(Y_axisValue);

  if (Y_axisValue === "" || X_axisValue === "") {
    return;
  }

  var random_arr = [],
    row;
  //   console.log("idx1", idx1);
  //   printArr(idx1);
  //   console.log("idx2", idx2);
  //   printArr(idx2);
  //   allRows = data;
  for (var i = 0; i < allRows.length; i++) {
    row = allRows[i];
    random_arr.push(row);
  }

  var train_res = getRandom(random_arr, parseInt(0.7 * allRows.length));
  var test_res = [];
  for (i = 0; i < allRows.length; i++) {
    var flag = true;

    row = allRows[i];
    for (var j = 0; j < train_res.length; j++) {
      if (row === train_res[j]) {
        flag = false;
        break;
      }
    }
    if (flag === true) {
      test_res.push(row);
    }
  }
  //   console.log("train_res");
  //   printArr(train_res);
  //   console.log("test_res");
  //   printArr(test_res);

  var x_train_data = [],
    x_test_data = [],
    y_train_data = [],
    y_test_data = [],
    train_data,
    test_data,
    layout;
  train_data = getRandomData(train_res, X_axisValue, Y_axisValue);
  x_train_data = train_data.x_data;
  y_train_data = train_data.y_data;
  test_data = getRandomData(test_res, X_axisValue, Y_axisValue);
  x_test_data = test_data.x_data;
  y_test_data = test_data.y_data;

  // console.log("x_test_data");
  // printArr(x_test_data);
  // console.log("y_test_data");
  // printArr(y_test_data);
  // console.log("x_train_data");
  // printArr(x_train_data);
  // console.log("y_train_data");
  // printArr(y_train_data);
  //   polar chart area plot
  // console.log("----");
  var x_test_data_avg = getAverage(x_test_data);
  // console.log("----");
  var x_train_data_avg = getAverage(x_train_data);

  var max1 = d3.max(x_test_data);
  // console.log("max1");
  // console.log(max1);
  var max2 = d3.max(x_train_data);
  // console.log("max2");
  // console.log(max2);
  var max_range_value = d3.max([max1, max2]);
  // console.log("max_range_value");
  // console.log(max_range_value);

  var min1 = d3.min(x_test_data);
  // console.log("min1");
  // console.log(min1);
  var min2 = d3.min(x_train_data);
  // console.log("min2");
  // console.log(min2);
  var min_range_value = d3.max([min1, min2]);
  // console.log("min_range_value");
  // console.log(min_range_value);

  var avg_1 = [];
  for (i = 0; i < y_test_data.length; i++) {
    avg_1.push(x_test_data_avg);
  }
  var avg_2 = [];
  for (i = 0; i < y_train_data.length; i++) {
    avg_2.push(x_train_data_avg);
  }
  data = [
    {
      type: "scatterpolargl",
      //   r: x_test_data_avg,
      r: avg_1,
      theta: y_test_data,
      mode: "markers",
      name: "Trial 5",
      marker: {
        color: "rgb(102,166,30)",
        size: 19,
        line: {
          color: "white"
        },
        opacity: 0.7
      },
      cliponaxis: false
    },
    {
      type: "scatterpolargl",
      //   r: x_train_data_avg,
      r: avg_2,
      theta: y_train_data,
      mode: "markers",
      name: "Trial 6",
      marker: {
        color: "rgb(230,171,2)",
        size: 19,
        line: {
          color: "white"
        },
        opacity: 0.7
      },
      cliponaxis: false
    }
  ];

  layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [min_range_value, max_range_value]
      }
    },
    showlegend: false
  };

  const Plot = createPlotlyComponent(Plotly);
  ReactDOM.render(
    React.createElement(Plot, {
      data: data,
      layout: layout
    }),
    document.getElementById("container")
  );
  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
}

class FileReaderScatterPolarPlot extends React.Component {
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

    ReactDOM.render(
      <select onChange={() => selectedYScatterPolarPlot(data, colNames)}>
        {options}
      </select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYScatterPolarPlot(data, colNames)}>
        {options}
      </select>,
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

export default FileReaderScatterPolarPlot;
