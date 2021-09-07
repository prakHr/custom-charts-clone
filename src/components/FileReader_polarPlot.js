/**@module Polarplot
 * @exports FileReaderPolar */
// import * as d3 from "d3";
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
 * Verifying the First Data Point in CSV file whether it should be Float, String or Integer.
 * @author Prakhar Gandhi
 * @function isItNumber
 * @param {string} str  The Target String of the Variable
 * @return {boolean} Regex Matching Test for String.
 * @exports FileReaderPolar.isItNumber
 */
function isItNumber(str) {
  return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(str);
}

/**
* Select 2 dropdowns of a single class containing floats or int values and split them into train and test dataset internally by selecting ratio size.
*
* After selecting train and test data from x and y dropdowns compute the average of radial axis of both datasets.
*
* Make a different kind of polar plots like scatter plot,area plot by plotting average value on r-axis and y data on theta-axis.

* @author Prakhar Gandhi
* @function selectedYPolar
* @param {Array} data consists of an array of json objects present in csv file
* @param {Array} keys consists of an array of column names present in csv file
* @return {void}
* @exports FileReaderPolar.selectedYPolar
* 
*
*/
function selectedYPolar(data, keys) {
  var allRows = data;
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  var X_axisValue = $("#dataBtn_X :selected").val();

  // console.log(X_axisValue);
  // console.log(Y_axisValue);

  if (Y_axisValue === "" || X_axisValue === "") {
    return;
  }
  //   const [dataValues] = d3.values(allRows);
  //   const keys = Object.keys(dataValues);

  var random_arr = [],
    row;
  var idx1 = keys.indexOf(X_axisValue);
  var y_data = [];
  var idx2 = keys.indexOf(Y_axisValue);
  // console.log("idx1", idx1);
  //   printArr(idx1);
  // console.log("idx2", idx2);
  //   printArr(idx2);
  //   allRows = data;
  for (var i = 0; i < allRows.length; i++) {
    row = allRows[i][X_axisValue];
    random_arr.push(row);
    y_data.push(allRows[i][Y_axisValue]);
  }
  // console.log("y_data", y_data);
  var trace1 = {
    r: random_arr,
    t: y_data,
    marker: { color: "rgb(106,81,163)" },
    type: "area"
  };
  data = [trace1];
  var layout = {
    title: "Polar plot on various datasets",
    font: { size: 16 },
    legend: { font: { size: 16 } },
    radialaxis: { ticksuffix: "%" },
    orientation: 270
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

/**@constructor FileReaderPolar
 * @param {object} updateData Update is a function to takes the CSV file data and pushed into another function of column names data.
 * @return {void}  */
export default class FileReaderPolar extends React.Component {
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
      <select onChange={() => selectedYPolar(data, colNames)}>
        {options}
      </select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYPolar(data, colNames)}>
        {options_2}
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
