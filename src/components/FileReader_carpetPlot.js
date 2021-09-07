import * as Papa from "papaparse";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
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
* Select 3 dropdowns of a single class containing floats or int values.
*
* After selecting a axis, b axis and z axis from dropdowns give it to data array of type 'carpet'.
*
* Make a different kind of carpet plots by plotting dropdowns on x-axis, y-axis and z-axis.

* @author Prakhar Gandhi
* @param {Array} data consists of an array of json objects present in csv file
* @return {void}
*
*/
function selectedYCarpetPlot(data) {
  var B_axisValue = $("#dataBtn_B :selected").val();
  var A_axisValue = $("#dataBtn_A :selected").val();
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  if (B_axisValue === "" || A_axisValue === "" || Y_axisValue === "") {
    return;
  }

  var a_data = [],
    b_data = [],
    y_data = [],
    z_data = [];

  for (var d = 0; d < data.length; d++) {
    a_data.push(parseFloat(data[d][A_axisValue]));
    b_data.push(parseFloat(data[d][B_axisValue]));
    y_data.push(parseFloat(data[d][Y_axisValue]));
  }
  z_data.push(a_data);
  z_data.push(b_data);
  z_data.push(y_data);
  //   console.log("y_data");
  //   console.log(y_data);

  data = [
    {
      // a: a_data,
      // b: b_data,
      // y: y_data,
      // type: "carpet",
      // name: "Trial 1",
      // mode: "markers",
      // marker: {
      //   size: 16
      // }
      z: z_data,
      type: "surface"
    }
  ];
  // var layout = {
  //   hovermode: "closest",
  //   title: "carpet plot of points"
  // };
  var layout = {
    title: "Mt Bruno Elevation With Projected Contours",
    scene: { camera: { eye: { x: 1.87, y: 0.88, z: -0.64 } } },
    autosize: false,
    width: 500,
    height: 500,
    margin: {
      l: 65,
      r: 50,
      b: 65,
      t: 90
    }
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
  return { AData: a_data, YData: y_data };
  // console.log("--------------------------");
}

class FileReaderCarpetPlot extends React.Component {
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
    var options = textColumns.map(data => (
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
      <select onChange={() => selectedYCarpetPlot(data)}>{options_2}</select>,
      document.getElementById("dataBtn_A")
    );
    ReactDOM.render(
      <select onChange={() => selectedYCarpetPlot(data)}>{options_2}</select>,
      document.getElementById("dataBtn_B")
    );
    ReactDOM.render(
      <select onChange={() => selectedYCarpetPlot(data)}>{options_2}</select>,
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

export default FileReaderCarpetPlot;
