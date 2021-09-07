import * as Papa from "papaparse";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
import Plotly from "plotly.js-basic-dist";
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
 * 2 configurable dropdowns with columns consisting of float or int are used
 *
 * pushed data from csv file into x row and y row and
 *
 * then 2d scatter plot is plotted
 * @author Prakhar Gandhi
 * @param {Array} data consists of an array of json objects present in csv file
 * @return {void}
 *
 */
function selectedY2dScatterPlot(data) {
  var X_axisValue = $("#dataBtn_X :selected").val();
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  if (X_axisValue === "" || Y_axisValue === "") {
    return;
  }

  var x_data = [],
    y_data = [];

  for (var d = 0; d < data.length; d++) {
    x_data.push(data[d][X_axisValue]);
    y_data.push(data[d][Y_axisValue]);
  }

  // console.log("y_data");
  // console.log(y_data);

  const Plot = createPlotlyComponent(Plotly);

  ReactDOM.render(
    React.createElement(Plot, {
      data: [
        {
          x: x_data,
          y: y_data,
          type: "scatter",
          mode: "markers",
          marker: { color: "red" }
        }
      ]
    }),
    document.getElementById("container")
  );
  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
  // return { XData: x_data, YData: y_data };
  // console.log("--------------------------");
}

class FileReader extends React.Component {
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
    this.setState({
      csvfile: event.target.files[0]
    });

    if (!regex.test(name.toLowerCase())) {
      // el.value = '';
      alert("Please select correct file format");
      // this.setState({
      //   csvfile: undefined
      // });
    }
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
      <select onChange={() => selectedY2dScatterPlot(data)}>{options}</select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedY2dScatterPlot(data)}>
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

export default FileReader;
