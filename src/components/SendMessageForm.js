//jshint esversion:6
import React, { Component } from "react";

class SendMessageForm extends Component {
  constructor() {
    super();
    this.state = {
      message: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.sendMessage(this.state.message);
    this.setState({
      message: ""
    });
  }
  render() {
    console.log(this.state.message);
    return (
      <form onSubmit={this.handleSubmit} className="send-message-form">
        <input
          disabled={this.props.disabled}
          placeholder="Send message form"
          value={this.state.message}
          type="text"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default SendMessageForm;
