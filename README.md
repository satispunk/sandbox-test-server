# sandbox-test-server
Tool for ui components test automation

### Motivation

There are several ways to test components
* Unit testing with tools like [Jest](https://facebook.github.io/jest/)
  Pros:
  + Easy to setup
  + Quite fast
  + Snapshot testing
  Cons:
  - No real browser testing (crossbrowser things)
  - No component interactions/integration testing
* Manual testing using tools like [storybook](https://github.com/storybooks/storybook)
  Pros:
  + Visualization
  + Testing in different browsers
  Cons:
  - No built-in automation except snapshot testing
* End-to-end automation tools like [testcafe](https://devexpress.github.io/testcafe/), [selenium](http://webdriver.io/)
  Pros:
  + Visualization
  + Automation
  + Crossbrowser testing
  Cons:
  - Has to be used against application or sandbox like storybook
  - Can't define a data (or component) in test unit.
  
### Idea

is to combine those 3 ways. So test can be automated, isolated (with its testing data) and run against real browser environment.

### Example

```jsx

test('render: popup is shown', async () => {
  const { url } = await sandbox.render(`
    import React from 'react';
    import {Popup, Button} from 'semantic-ui-react'
  
  export default <Popup
    className="popup-example"
    trigger={<Button icon="add" className="trigger-example" />}
    content='Example content'
  />
  `);

  await t.navigateTo(url);

  await t.expect(Selector('.popup-example').exists).eql(false);
  await t.hover(Selector('.trigger-example'));
  await t.expect(Selector('.popup-example').exists).eql(true);
});

``` 

or

```jsx

test('renderFromFile: check tab content is rendered', async () => {
  const { url } = await sandbox.renderFromFile(
    require.resolve('./test-cases/basic-tab')
  );

  await t.navigateTo(url);

  await t.expect(Selector('.content1').visible).eql(true);
  await t.expect(Selector('.content2').exists).eql(false);
  await t.expect(Selector('.content3').exists).eql(false);

  await t.click(Selector('.tabular a').nth(1));

  await t.expect(Selector('.content1').exists).eql(false);
  await t.expect(Selector('.content2').visible).eql(true);
  await t.expect(Selector('.content3').exists).eql(false);

  await t.click(Selector('.tabular a').nth(2));

  await t.expect(Selector('.content1').exists).eql(false);
  await t.expect(Selector('.content2').exists).eql(false);
  await t.expect(Selector('.content3').visible).eql(true);
});
```
  
where './test-cases/basic-tab' is 

```jsx
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

```

### What's inside

There are expressjs server, api to register components, webpack that compiles components on the fly

### What's supported

React!

I expect that with some webpack config replacements VueJS, Angular or Polymer can be used as well.   

