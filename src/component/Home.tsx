import React from 'react';

import { Segment, Image, Container } from 'semantic-ui-react';
import '../css/style.css';
export const Home = () => {
  return (
    <>
      <Container className="ui inverted vertical  center aligned segment">
        <div className="ui text container">
          <h1 className="ui inverted header">Online Whiteboard</h1>
          <h2> You can draw whatever you want to</h2>
          <div className="ui huge primary button">
            Get Started <i className="right arrow icon"></i>
          </div>
        </div>
      </Container>
      <div className="ui vertical stripe segment">
        <div className="ui middle aligned stackable grid container">
          <div className="row">
            <div className="eight wide column">
              <h3 className="ui header">We Help Companies and School</h3>
              <p>Express your idea with anywhere.</p>
              <h3 className="ui header">We Make People Discuss Together</h3>
              <p>Share your imagination via your creativity</p>
            </div>
            <div className="six wide right floated column">
              <Image
                style={{ background: 'blue' }}
                className="card home-screen-image"
                src="https://images.unsplash.com/photo-1537884557178-342a575d7d16?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"
              ></Image>
            </div>
          </div>
          <div className="row">
            <div className="center aligned column">
              <a
                className="ui huge button"
                href="https://github.com/kevinliao852/online-whiteboard-client"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
