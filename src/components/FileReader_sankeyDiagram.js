import "core-js/stable";
import "regenerator-runtime/runtime";
import * as Papa from "papaparse";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import PreviousButton from "./PreviousButton";

// import AnyChart from "anychart-react";
// import AnyChart from "anychart-react/dist/anychart-react";

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
 * function takes 3 dropdowns of x(string of text cols), y(string of text cols) and z(int or float of non text columns) axis
 *
 * then pushes everything consists of {from: row[X_axisValue], to: row[Y_axisValue], weight: parseFloat(row[Z_axisValue])*1 } into flow data
 *
 * and then give the flow_data to chart of the library
 *
 * @author Prakhar Gandhi
 * @param {Array} data consists of an array of json objects present in csv file
 * @return {void}
 */
function selectedYSankeyDiagram(data) {
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  var X_axisValue = $("#dataBtn_X :selected").val();
  var Z_axisValue = $("#dataBtn_Z :selected").val();

  // console.log(X_axisValue);
  // console.log(Y_axisValue);
  // console.log(Z_axisValue);

  if (Y_axisValue === "" || X_axisValue === "" || Z_axisValue === "") {
    return;
  }
  var flow_data = [];
  for (var i = 0; i < data.length; i++) {
    flow_data.push({
      from: data[i][X_axisValue],
      to: data[i][Y_axisValue],
      value: parseFloat(data[i][Z_axisValue]) * 1
      // weight: parseFloat(data[i][Z_axisValue]) * 1
    });
  }
  // console.log("flow_data");
  // console.log(flow_data);
  document.getElementById("container").innerHTML = "";
  // document.getElementById("chartContainer").innerHTML = '<canvas id="sankey"></canvas>';
  // create a chart and set the data
  //   var chart = anychart.sankey(flow_data);

  //   // set the width of nodes
  //   chart.nodeWidth("10%");

  //   // set the container id
  //   chart.container("container");

  //   // initiate drawing the chart
  //   chart.draw();
  // ReactDOM.render(
  //   <AnyChart type="sankey" data={flow_data} title="Simple sankey diagram" />,
  //   document.getElementById("container")
  // );

  let chart = am4core.create("container", am4charts.SankeyDiagram);
  chart.data = flow_data;
  chart.dataFields.fromName = "from";
  chart.dataFields.toName = "to";
  chart.dataFields.value = "value";
  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
  // return { FlowData: flow_data };
  // console.log("--------------------------");
}

class FileReaderSankeyDiagram extends React.Component {
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
      <select onChange={() => selectedYSankeyDiagram(data)}>{options}</select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYSankeyDiagram(data)}>{options}</select>,
      document.getElementById("dataBtn_Y")
    );
    ReactDOM.render(
      <select onChange={() => selectedYSankeyDiagram(data)}>
        {options_2}
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

export default FileReaderSankeyDiagram;
