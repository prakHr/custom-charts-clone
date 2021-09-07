// import React, { Component } from "react";
import React from "react";
import { Line } from "react-chartjs-2";
// import Papa from 'papaparse/papaparse.min.js';
import * as Papa from "papaparse";
// import $ from "jquery";
import ReactDOM from "react-dom";
// function isItNumber(str) {
//   return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(str);
// }
class Area extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      selectedX: "",
      selectedY: "",
      csvData: [],
      data: {
        datasets: [
          {
            label: " ",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "rgba(56,182,192,1)",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
          }
        ]
      }
    };
    this.updateData = this.updateData.bind(this);
  }
  Select = (type, options) => {
    if (type === "x") {
      this.setState({ selectedX: options });
    } else {
      this.setState({ selectedY: options });
    }
  };
  GenerateGraph = () => {
    let new_data = { ...this.state.data };
    let x = [],
      y = [];
    this.state.csvData.map(data => {
      x.push(data[this.state.selectedX]);
      y.push(data[this.state.selectedY]);
    });
    new_data["labels"] = x;
    new_data["datasets"][0]["data"] = y;
    this.setState({ data: new_data });
  };

  handleChange = event => {
    var name = event.target.files[0].name;
    var regex = new RegExp("(.*?).(csv)$");
    if (!regex.test(name.toLowerCase())) {
      // el.value = '';
      alert("Please select correct file format");
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
    console.log("colNames", colNames, data);
    var options = colNames.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options.unshift(<option value="">Choose options</option>);
    console.log("options");
    console.log(options);

    var options_2 = colNames.map(data => (
      <option key={data} value={data}>
        {data}
      </option>
    ));
    options_2.unshift(<option value="">Choose options</option>);
    console.log("options_2");
    console.log(options_2);

    ReactDOM.render(
      <select onChange={e => this.Select("x", e.target.value)}>
        {options}
      </select>,
      document.getElementById("dataBtn_X")
    );
    ReactDOM.render(
      <div>
        <select onChange={e => this.Select("y", e.target.value)}>
          {options_2}
        </select>
        <button onClick={this.GenerateGraph}>Proceed </button>
      </div>,
      document.getElementById("dataBtn_Y")
    );
    this.setState({ csvData: data });
    console.log("object", Object.keys(data[0]));
    console.log("colNames", colNames);
    console.log("data", data);
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
        <Line
          ref="chart"
          data={this.state.data}
          options={{
            scales: {
              xAxes: [
                {
                  ticks: {
                    display: false,
                    fontSize: 4 //this will remove only the label
                  },
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          }}
        />
      </div>
    );
  }
}

export default Area;
