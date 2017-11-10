import React from 'react';
import { Tab } from 'semantic-ui-react';
const panes = [
  {
    menuItem: 'Tab 1',
    render: () => (
      <Tab.Pane>
        <div className="content1">Tab 1 Content</div>
      </Tab.Pane>
    )
  },
  {
    menuItem: 'Tab 2',
    render: () => (
      <Tab.Pane>
        <div className="content2">Tab 2 Content</div>
      </Tab.Pane>
    )
  },
  {
    menuItem: 'Tab 3',
    render: () => (
      <Tab.Pane>
        <div className="content3">Tab 3 Content</div>
      </Tab.Pane>
    )
  }
];

export default <Tab panes={panes} />;
