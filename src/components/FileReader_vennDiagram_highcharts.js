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
import PreviousButton from "./PreviousButton";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_venn from "@amcharts/amcharts4/plugins/venn";

// import VennModule from "highcharts/modules/venn.js";
// VennModule(Highcharts);
// window.Highcharts = Highcharts;

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
function selectedYVennDiagram(data) {
  var allRows = data;
  var Y_axisValue = $("#dataBtn_Y :selected").val();
  var X_axisValue = $("#dataBtn_X :selected").val();

  console.log(X_axisValue);
  console.log(Y_axisValue);

  if (Y_axisValue === "" || X_axisValue === "") {
    return;
  }
  //   const [dataValues] = d3.values(allRows);
  //   const keys = Object.keys(dataValues);

  var x_data = [],
    row,
    i,
    j,
    k;
  var y_data = [];
  for (i = 0; i < allRows.length; i++) {
    row = allRows[i][X_axisValue];
    if (row === undefined) continue;
    x_data.push(row);
    y_data.push(parseFloat(allRows[i][Y_axisValue]));
  }
  var set = new Set(x_data);
  let array = [...set];
  console.log("array", array);
  var DATA = [];
  for (j = 0; j < y_data.length; j++) {
    var my_array = [];
    var count = 0;

    //j = 0; j < array.length; j++
    for (i = 0; i < y_data.length; i++) {
      if (y_data[j] === y_data[i]) {
        my_array.push(x_data[i]);
        count += 1;
      }
    }
    if (my_array === []) continue;
    var set1 = new Set(my_array);
    let my_array1 = [...set1];
    var my_array2 = my_array1.sort();
    var string_names = "";
    for (k = 0; k < my_array2.length; k++) {
      string_names += my_array2[k];
    }
    if (my_array2.length === 1) {
      DATA.push({ name: string_names, value: count });
    } else if (my_array2.length > 1) {
      DATA.push({
        name: string_names,
        sets: my_array2,
        value: count
      });
    }
  }
  console.log("DATA", DATA);
  //   const options = {
  //     // accessibility: {
  //     //   point: {
  //     //     descriptionFormatter: function(point) {
  //     //       var intersection = point.sets.join(", "),
  //     //         name = point.name,
  //     //         ix = point.index + 1,
  //     //         val = point.value;
  //     //       return (
  //     //         ix +
  //     //         ". Intersection: " +
  //     //         intersection +
  //     //         ". " +
  //     //         (point.sets.length > 1 ? name + ". " : "") +
  //     //         "Value " +
  //     //         val +
  //     //         "."
  //     //       );
  //     //     }
  //     //   }
  //     // },
  //     series: [
  //       {
  //         type: "venn",
  //         name: "The Unattainable Triangle",
  //         data: DATA
  //       }
  //     ],
  //     title: {
  //       text: "Select points by click-drag"
  //     }
  //   };
  //   const App = () => (
  //     <div>
  //       <HighchartsReact highcharts={Highcharts} options={options} />
  //     </div>
  //   );

  //   ReactDOM.render(<App />, document.getElementById("root"));
  // Create chart
  let chart = am4core.create("root", am4plugins_venn.VennDiagram);

  // Create and configure series
  var series = chart.series.push(new am4plugins_venn.VennSeries());
  series.data = DATA;

  series.dataFields.category = "name";
  series.dataFields.value = "value";
  series.dataFields.intersections = "sets";
  series.slices.template.fillOpacity = 0.5;
  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
}

/**@constructor FileReaderPolar
 * @param {object} updateData Update is a function to takes the CSV file data and pushed into another function of column names data.
 * @return {void}  */
export default class FileReaderVennDiagram extends React.Component {
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
    console.log("colNames", colNames);

    console.log("data", data);
    var textColumns = [],
      nonTextColumns = [];
    var first = data[0];
    console.log(first);
    for (var j = 0; j < colNames.length; j++) {
      if (!isItNumber(first[colNames[j]])) {
        textColumns.push(colNames[j]);
      }
      if (isItNumber(first[colNames[j]])) {
        nonTextColumns.push(colNames[j]);
      }
    }
    console.log(nonTextColumns);
    console.log(textColumns);
    var options = textColumns.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options.unshift(<option value="">Choose options</option>);
    console.log("options");
    console.log(options);

    var options_2 = nonTextColumns.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options_2.unshift(<option value="">Choose options</option>);
    console.log("options_2");
    console.log(options_2);

    ReactDOM.render(
      <select onChange={() => selectedYVennDiagram(data)}>{options}</select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYVennDiagram(data)}>{options_2}</select>,
      document.getElementById("dataBtn_Y")
    );
  }

  render() {
    console.log(this.state.csvfile);
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
