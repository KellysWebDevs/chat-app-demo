import React from "react";

import { connect } from "react-redux";

class SideChatBox extends React.Component {
  state = {
    boxPosition: JSON.parse(localStorage.getItem("sideChatBox")) || {
      x: 0,
      y: 0,
    },
    minimized: false,
    content: "",
  };

  mouseOffset = { x: 0, y: 0 };
  dragging = false;

  handleDrag = (e) => {
    if (this.dragging) {
      this.setState({
        boxPosition: {
          x: e.x + this.mouseOffset.x,
          y: e.y + this.mouseOffset.y,
        },
      });
    }
  };

  handleMouseDown = (e) => {
    this.dragging = true;

    const clientRect = e.target.getBoundingClientRect();
    this.mouseOffset = {
      x: clientRect.x - e.clientX,
      y: clientRect.y - e.clientY,
    };
  };

  handleMouseUp = (e) => {
    this.dragging = false;

    const boxPosition = { ...this.state.boxPosition };

    const boxRect = this.BoxContainer.getBoundingClientRect();

    if (boxPosition.x < 0) {
      boxPosition.x = 0;
    } else if (boxPosition.x + boxRect.width > window.innerWidth) {
      boxPosition.x = window.innerWidth - boxRect.width;
    }

    if (boxPosition.y < 0) {
      boxPosition.y = 0;
    } else if (boxPosition.y + boxRect.height > window.innerHeight) {
      boxPosition.y = window.innerHeight - boxRect.height;
    }

    localStorage.setItem(
      "sideChatBox",
      JSON.stringify({ x: boxPosition.x, y: boxPosition.y })
    );

    this.setState({ boxPosition });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    document.addEventListener("mousemove", this.handleDrag);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleDrag);
  }

  render() {
    const { boxPosition } = this.state;

    return (
      <div
        className="side-chat-box"
        style={{
          transform: `translate(${boxPosition.x}px, ${boxPosition.y}px)`,
        }}
        ref={(BoxContainer) => {
          this.BoxContainer = BoxContainer;
        }}
      >
        <ul
          className="moveable"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        >
          <li
            className="minimize"
            onClick={() => this.setState({ minimized: !this.state.minimized })}
          >
            －
          </li>
        </ul>

        <div
          className="chat-area"
          style={{ display: this.state.minimized ? "none" : "block" }}
        >
          <div className="row chat-text-row">
            <div className="col s12 chat-text-col">
              <ul ref={this.props.makeChatBoxRef}>
                {this.props.chat.map((msg, i) => (
                  <li key={msg._id || i}>
                    <div className="row name-delete-container">
                      <div className="col s10 name-container">
                        <span className="name">{msg.name}</span>
                      </div>

                      {msg.userId === this.props.user.id ? (
                        <div className="col s2">
                          <span
                            className="delete"
                            onClick={() =>
                              this.props.deletePost(this.props.user.id, msg)
                            }
                          >
                            ✕
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="content-container">
                      {(() => {
                        const splitMsg = msg.content.split("\n");

                        return splitMsg.map((msgBit, i) => (
                          <div key={i}>
                            <span>{msgBit}</span>
                            {i < splitMsg.length ? <br /> : null}
                          </div>
                        ));
                      })()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <form
                onSubmit={(e) => this.props.postMessage(e, this.state.content)}
                autoComplete="off"
              >
                <div className="row">
                  <div className="col s8 input-field">
                    <input
                      type="text"
                      name="content"
                      onChange={this.handleChange}
                    />
                  </div>

                  <div className="col s4">
                    <button type="submit">Post</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(SideChatBox);
