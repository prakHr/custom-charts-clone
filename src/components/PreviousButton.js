import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class PreviousButton extends Component {
  handleClick = e => {
    // e.preventDefault();

    console.log("The link was clicked.");
  };
  render() {
    return (
      <a href="/charts" onClick={this.handleClick}>
        <h3>
            Built with ❤️, now go back. 
        </h3>
      </a>
    );
  }
}
