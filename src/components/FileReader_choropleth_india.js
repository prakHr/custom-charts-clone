import * as Papa from "papaparse";
import ReactDOM from "react-dom";
import $ from "jquery";
import React from "react";
import Plotly from "plotly.js/lib/index-geo";
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
 * takes 2 dropdowns 1 dropdown contains names of states in India
 *
 * and second dropdown contains active counts of users of states in India
 *
 * and then plot is rendered using plotly
 *
 * @param {Array} data consists of an array of json objects present in csv file
 * @author Prakhar Gandhi
 * @return {void}
 */
function selectedYChoroplethIndia(data) {
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

  data = [
    {
      //   geojson: "/csv/india_states.geojson",
      geojson:
        "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson",
      featureidkey: "properties.ST_NM",
      locationmode: "geojson-id",
      type: "choropleth",
      //   locationmode: 'state',
      // locations: unpack(rows, 'state'),
      // z: unpack(rows, 'active cases'),
      // text: unpack(rows, 'state'),
      locations: x_data,
      z: y_data,
      text: x_data,
      autocolorscale: false,
      colorscale: "Reds",
      marker_line_color: "peachpuff",
      colorbar: {
        title: { text: "Active Cases" },

        thickness: 15,
        len: 0.35,
        bgcolor: "rgba(255,255,255,0.6)",

        tick0: 0,
        dtick: 20000,

        xanchor: "left",
        x: 0.01,
        yanchor: "bottom",
        y: 0.05
      }
    }
  ];

  var layout = {
    title: "Data corresponding to country names",
    geo: {
      projection: {
        type: "conic conformal",
        parallels: [12.472944444, 35.172805555556],
        rotation: { lat: 24, lon: 80 }
      },
      lonaxis: { range: [68, 98] },
      lataxis: { range: [6, 38] }
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
  // return { XData: x_data, YData: y_data };
  // console.log("--------------------------");
}

class FileReaderChoroplethIndia extends React.Component {
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
      <select onChange={() => selectedYChoroplethIndia(data)}>
        {options}
      </select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <select onChange={() => selectedYChoroplethIndia(data)}>
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

export default FileReaderChoroplethIndia;
