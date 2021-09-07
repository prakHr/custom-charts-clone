// import ReactDOM from "react-dom";
// import React from "react";
import FileReader from "./components/FileReader_2dscatterPlot.js";
import FileReaderCandlestick from "./components/FileReader_candlestick";
import FileReaderPolar from "./components/FileReader_polarPlot";
import FileReaderChoroplethCountry from "./components/FileReader_choropleth_country";
import FileReaderChoroplethIndia from "./components/FileReader_choropleth_india";
// import FileReaderCarpetPlot from "./components/FileReader_carpetPlot";
import FileReaderSankeyDiagram from "./components/FileReader_sankeyDiagram";
import FileReaderTreemap from "./components/FileReader_treemap";
import FileReaderHighchart from "./components/FileReader_Highcharts";
import Area from "./components/FileReader_areaChart";
import FileReaderHistogram from "./components/FileReader_histogram";
import FileReaderCandlestickHighchart from "./components/FileReader_candlestick_Highcharts";
import FileReaderDistributionHighchart from "./components/FileReader_distribution_Highcharts";
import FileReaderVennDiagram from "./components/FileReader_vennDiagram_highcharts";
// import FileReaderScatterPolarPlot from "./components/FileReader_scatterPolarPlot";
// export default App;
import React from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

// import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
// import { render } from "react-dom";
// import "./App.css";
// const Home = () => (
//   <div>
//     <h2>Home</h2>
//   </div>
// );
class Charts extends React.Component {
  
  constructor(props) {
    
    super(props);
    this.state = {
      showChart: "Data visualization"
    };
  }
  handleShowChart(type) {
    this.setState({
      showChart: type
    });
  }
  render() {
    return (
      <React.Fragment>
        <h3 align="Center" font="Calibri" fontcolor="Dark Green">
          Friday Visualization
        </h3>
        <Dropdown>
          <Dropdown.Toggle variant="success">
            {this.state.showChart}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div>
              <Dropdown.Item
                href="#/FileReader"
                onClick={() => this.handleShowChart("FileReader")}
              >
                2d scatter plot
              </Dropdown.Item>
            </div>
            <div>
              <Dropdown.Item
                href="#/FileReaderCandlestick"
                onClick={() => this.handleShowChart("FileReaderCandlestick")}
              >
                Candlestick plot using plotly
              </Dropdown.Item>
            </div>
            <div>
              <Dropdown.Item
                href="#/FileReaderPolar"
                onClick={() => this.handleShowChart("FileReaderPolar")}
              >
                Polar plot
              </Dropdown.Item>
            </div>
            {/* <div>
              <Dropdown.Item
                href="#/FileReaderScatterPolarPlot"
                onClick={() =>
                  this.handleShowChart("FileReaderScatterPolarPlot")
                }
              >
                Scatter Polar plot
              </Dropdown.Item>
            </div> */}

            <div>
              <Dropdown.Item
                href="#/FileReaderChoroplethCountry"
                onClick={() =>
                  this.handleShowChart("FileReaderChoroplethCountry")
                }
              >
                Choropleth country
              </Dropdown.Item>
            </div>
            <div>
              <Dropdown.Item
                href="#/FileReaderChoroplethIndia"
                onClick={() =>
                  this.handleShowChart("FileReaderChoroplethIndia")
                }
              >
                Choropleth india
              </Dropdown.Item>
            </div>
            {/* <div>
              <Dropdown.Item
                href="#/Area"
                onClick={() => this.handleShowChart("Area")}
              >
                Area
              </Dropdown.Item>
            </div> */}
            <div>
              <Dropdown.Item
                href="#/FileReaderSankeyDiagram"
                onClick={() => this.handleShowChart("FileReaderSankeyDiagram")}
              >
                Sankey diagram
              </Dropdown.Item>
            </div>
            <div>
              <Dropdown.Item
                href="#/FileReaderTreemap"
                onClick={() => this.handleShowChart("FileReaderTreemap")}
              >
                Treemap
              </Dropdown.Item>
            </div>
            {/* <div>
              <Dropdown.Item
                href="#/FileReaderHighchart"
                onClick={() => this.handleShowChart("FileReaderHighchart")}
              >
                High chart
              </Dropdown.Item>
            </div> */}
            <div>
              <Dropdown.Item
                href="#/FileReaderHistogram"
                onClick={() => this.handleShowChart("FileReaderHistogram")}
              >
                Histogram plot
              </Dropdown.Item>
            </div>
            {/* <div>
              <Dropdown.Item
                href="#/FileReaderCandlestickHighchart"
                onClick={() =>
                  this.handleShowChart("FileReaderCandlestickHighchart")
                }
              >
                Candlestick Highchart plot
              </Dropdown.Item>
            </div> */}
            <div>
              <Dropdown.Item
                href="#/FileReaderDistribtionHighchart"
                onClick={() =>
                  this.handleShowChart("FileReaderDistributionHighchart")
                }
              >
                Distribution Highchart plot
              </Dropdown.Item>
            </div>
            {/* <div>
              <Dropdown.Item
                href="#/FileReaderVennDiagram"
                onClick={() => this.handleShowChart("FileReaderVennDiagram")}
              >
                Venn Diagram
              </Dropdown.Item>
            </div> */}
          </Dropdown.Menu>
        </Dropdown>

        {this.state.showChart === "FileReader" && (
          <Container>
            <h4 align="center">2d scatter plot</h4>
            <Row>
              <Col xs={6}>
                <FileReader />
              </Col>
            </Row>
          </Container>
        )}

        {this.state.showChart === "FileReaderCandlestick" && (
          <Container>
            <h4 align="center">Candlestick plot</h4>
            <Row>
              <Col xs={12}>
                <FileReaderCandlestick />
              </Col>
            </Row>
          </Container>
        )}

        {this.state.showChart === "FileReaderPolar" && (
          <Container>
            <h4 align="center">Polar plot</h4>
            <Row>
              <Col xs={12}>
                <FileReaderPolar />
              </Col>
            </Row>
          </Container>
        )}
        {/* {this.state.showChart === "FileReaderScatterPolarPlot" && (
          <Container>
            <h4 align="center">Scatter Polar plot</h4>
            <Row>
              <Col xs={12}>
                <FileReaderScatterPolarPlot />
              </Col>
            </Row>
          </Container>
        )} */}
        {this.state.showChart === "FileReaderChoroplethCountry" && (
          <Container>
            <h4 align="center">Choropleth country plot</h4>
            <Row>
              <Col xs={12}>
                <FileReaderChoroplethCountry />
              </Col>
            </Row>
          </Container>
        )}
        {this.state.showChart === "FileReaderChoroplethIndia" && (
          <Container>
            <h4 align="center">Choropleth india plot</h4>
            <Row>
              <Col xs={12}>
                <FileReaderChoroplethIndia />
              </Col>
            </Row>
          </Container>
        )}
        {/* {this.state.showChart === "FileReaderCarpetPlot" && (
          <Container>
            <h4 align="center">Carpet plot</h4>
            <Row>
              <Col xs={12}>
                <FileReaderCarpetPlot />
              </Col>
            </Row>
          </Container>
        )} */}
        {this.state.showChart === "FileReaderSankeyDiagram" && (
          <Container>
            <h4 align="center">Sankey diagram</h4>
            <Row>
              <Col xs={12}>
                <FileReaderSankeyDiagram />
              </Col>
            </Row>
          </Container>
        )}
        {this.state.showChart === "FileReaderTreemap" && (
          <Container>
            <h4 align="center">Treemap</h4>
            <Row>
              <Col xs={12}>
                <FileReaderTreemap />
              </Col>
            </Row>
          </Container>
        )}
        {/* {this.state.showChart === "Area" && (
          <Container>
            <h4 align="center">Area chart</h4>
            <Row>
              <Col xs={12}>
                <Area />
              </Col>
            </Row>
          </Container>
        )} */}
        {/* {this.state.showChart === "FileReaderHighchart" && (
          <Container>
            <h4 align="center">HighChart</h4>
            <Row>
              <Col xs={12}>
                <FileReaderHighchart />
              </Col>
            </Row>
          </Container>
        )} */}
        {this.state.showChart === "FileReaderHistogram" && (
          <Container>
            <h4 align="center">Histogram</h4>
            <Row>
              <Col xs={12}>
                <FileReaderHistogram />
              </Col>
            </Row>
          </Container>
        )}
        {/* {this.state.showChart === "FileReaderCandlestickHighchart" && (
          <Container>
            <h4 align="center">Candlestick HighChart</h4>
            <Row>
              <Col xs={12}>
                <FileReaderCandlestickHighchart />
              </Col>
            </Row>
          </Container>
        )} */}
        {this.state.showChart === "FileReaderDistributionHighchart" && (
          <Container>
            <h4 align="center">Distribution HighChart</h4>
            <Row>
              <Col xs={12}>
                <FileReaderDistributionHighchart />
              </Col>
            </Row>
          </Container>
        )}
        {/* {this.state.showChart === "FileReaderVennDiagram" && (
          <Container>
            <h4 align="center">Venn Diagram</h4>
            <Row>
              <Col xs={12}>
                <FileReaderVennDiagram />
              </Col>
            </Row>
          </Container>
        )} */}
      </React.Fragment>
    );
  }
}
export default Charts;
