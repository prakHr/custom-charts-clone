import "core-js/stable";
import "regenerator-runtime/runtime";
import * as Papa from "papaparse";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
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
* Select 2 dropdowns of a single class 1 dropdown as x-data containing floats or int values and other one containing strings as y-data.
*
* Make a set from array and converting that set back into array for text data and according to that element choose the rest of the elements.
*
* Make a treemap by plotting dataset given in form of a series to am4chart.

* @author Prakhar Gandhi
* @param {Array} data consists of an array of json objects present in csv file
* @return {void}
*
*/
function selectedYTreemap(data) {
  var X_axisValue = $("#dataBtn_X :selected").val();
  var Y_axisValue = $("#dataBtn_Y :selected").val();

  // console.log(X_axisValue);

  // console.log(Y_axisValue);

  var x_data = [],
    y_data = [],
    text_data = [];
  if (X_axisValue === "" || Y_axisValue === "") {
    return;
  }

  var topTags = [];
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (isNaN(row[Y_axisValue])) continue;
    x_data.push(row[X_axisValue]);
    y_data.push(parseFloat(row[Y_axisValue]));

    var str = X_axisValue + ":" + parseFloat(row[X_axisValue]);
    text_data.push(str);

    topTags.push({
      name: x_data[i],
      //   y: y_data[i]
      value: y_data[i]
    });
    // topTags.push({tag:x_data[i],num:1});
  }
  // console.log("x_data");
  // console.log(x_data);
  // console.log("y_data");
  // console.log(y_data);

  // clearBox('treemap');
  // ctx.beginPath();
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     // do some drawing
  //   ctx.clear();

  //   // do some more drawing
  //   ctx.setTransform(-1, 0, 0, 1, 200, 200);
  //   // do some drawing with the new transform
  //   ctx.clear(true);
  // draw more, still using the preserved transform
  // console.log("topTags");
  // console.log(topTags);
  var set = new Set(x_data);
  let array = [...set];
  //   console.log("set");
  //   console.log(set);
  //   console.log("array");
  //   console.log(array);
  var mySeries = [];
  //   mySeries.push({
  //     palette: {
  //       pointValue: "%yValue",
  //       colors: ["#bcd2f6", "#6296ea"]
  //     }
  //   });
  for (i = 0; i < array.length; i++) {
    var selectedTags = [];
    for (var j = 0; j < topTags.length; j++) {
      if (array[i] === topTags[j].name) {
        selectedTags.push(topTags[j]);
      }
    }
    var json_data = {
      name: array[i],
      //   points: selectedTags
      children: selectedTags
    };
    mySeries.push(json_data);
  }
  // console.log("mySeries");
  // console.log(mySeries);
  // let chart = am4core.create("container", am4charts.SankeyDiagram);
  //   chart.data = flow_data;
  //   chart.dataFields.fromName = "from";
  //   chart.dataFields.toName = "to";
  //   chart.dataFields.value = "value";
  //   return { FlowData: flow_data };

  let chart = am4core.create("container", am4charts.TreeMap);
  chart.data = mySeries;
  chart.dataFields.value = "value";
  chart.dataFields.name = "name";
  chart.dataFields.children = "children";
  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
  // return { FlowData: mySeries };
}

class FileReaderTreemap extends React.Component {
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
      <select onChange={() => selectedYTreemap(data)}>{options}</select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYTreemap(data)}>{options_2}</select>,
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

export default FileReaderTreemap;
