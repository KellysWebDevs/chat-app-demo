import React from "react";
import M from "materialize-css";
import SideChatBox from "../components/SideChatBox";
import LoadingSplash from "../components/LoadingSplash";

import { connect } from "react-redux";

class EmbedWebsite extends React.Component {
  state = {
    website_url: "",
    finalUrl: "",
  };

  siteOptions = [
    "bing.com",
    "slither.io",
    "surviv.io",
    "mope.io",
    "deeeep.io",
    "wings.io",
    "starblast.io",
    "brutal.io",
    "splix.io",
    "gartic.io",
    "linerider.com",
  ];

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleResize = () => {
    this.Iframe.width = window.innerWidth / 1.1;
    this.Iframe.height = window.innerHeight / 1.5;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    e.target.website_url.blur();

    const { website_url } = this.state;

    this.setState({ finalUrl: "" }, () =>
      this.setState({
        finalUrl:
          "//" + website_url.replace("http://", "").replace("https://", ""),
      })
    );
  };

  componentDidMount() {
    M.Dropdown.init(this.DropTrigger, {});
  }

  render() {
    return (
      <>
        {this.props.postsLoading ? <LoadingSplash /> : null}

        <div className="center row">
          <div className="col s12">
            <h4>Share Website</h4>
            <p>
              In development! Please report bugs in chat box. May not work on
              all websites.
            </p>
          </div>
        </div>

        <div className="row">
          <SideChatBox />

          <div className="col s9">
            <div className="embed-container">
              <div className="embed-search-bar">
                <form onSubmit={this.handleSubmit} autoComplete="off">
                  <div className="row mb-0">
                    <div className="col s8 m9 l10">
                      <input
                        type="text"
                        name="website_url"
                        placeholder="type a website URL"
                        value={this.state.website_url}
                        onChange={this.handleChange}
                      />
                    </div>

                    <div className="col s4 m3 l2 mt-1 left-align">
                      <button type="submit" className="btn grey">
                        Go
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <iframe
                src={this.state.finalUrl}
                title="Embedded Website"
                ref={(Iframe) => {
                  this.Iframe = Iframe;
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <button
              className="btn dropdown-trigger"
              data-target="site-options-drop"
              ref={(DropTrigger) => {
                this.DropTrigger = DropTrigger;
              }}
            >
              Site Options
            </button>
          </div>
        </div>

        <ul id="site-options-drop" className="dropdown-content">
          {this.siteOptions.map((site) => (
            <li
              key={site}
              onClick={() =>
                this.setState({ finalUrl: "//" + site, website_url: site })
              }
            >
              <span>{site}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  postsLoading: state.chat.postsLoading,
});

export default connect(mapStateToProps)(EmbedWebsite);
