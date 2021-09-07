import * as Papa from "papaparse";
import ReactDOM from "react-dom";
// import * as d3 from "d3";
import $ from "jquery";
import React from "react";
import Plotly from "plotly.js-finance-dist";
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
function selectedYHistogram(data) {
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
  // function linspace(a, b, n) {
  //   return d3.range(n).map(function(i) {
  //     return a + (i * (b - a)) / (n - 1);
  //   });
  // }

  var xValues = x_data;

  var yValues = [];

  for (var i = 0; i < xValues.length; i++) {
    var result = xValues[i] * Math.sin(Math.pow(xValues[i], 2)) + 1;
    yValues.push(result);
  }
  let trace = {
    x: x_data,
    type: "histogram"
    // hovertext: y_data
  };
  // let trace2 = {
  //   x: y_data,
  //   // y: x_data,
  //   type: "scatter"
  // };

  var layout = {
    dragmode: "zoom",
    showlegend: false,
    xaxis: {
      // xaxis_type: "category",
      autorange: true,
      title: X_axisValue,
      rangeselector: {
        visible: false
      }
    }
  };
  ReactDOM.render(
    React.createElement(Plot, {
      data: [trace],
      layout: layout,
      onRelayout: function(eventdata) {
        var i;
        // console.log("eventdata", JSON.stringify(eventdata));
        // console.log("data", data);
        // console.log("layout.yaxis", layout.yaxis);
        var start = eventdata["xaxis.range[0]"];
        var end = eventdata["xaxis.range[1]"];
        var cl = x_data;
        // console.log("cl", cl);
        var newClasses = [];
        for (i = 0; i < cl.length; i++) {
          if (cl[i] > parseInt(start) && cl[i] <= parseInt(end)) {
            newClasses.push(y_data[i]);
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
    document.getElementById("container")
  );
  ReactDOM.render(<PreviousButton />, document.getElementById("backBtn"));
  // return { XData: x_data, YData: y_data };
  // console.log("--------------------------");
}

class FileReaderHistogram extends React.Component {
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

    var options_2 = textColumns.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options_2.unshift(<option value="">Choose options</option>);
    // console.log("options_2");
    // console.log(options_2);

    ReactDOM.render(
      <select onChange={() => selectedYHistogram(data)}>{options}</select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYHistogram(data)}>{options_2}</select>,
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

export default FileReaderHistogram;
