import { t, Selector } from 'testcafe';
import sandbox from '../dist/server';

fixture`Example`;

test('renderFromFile: check tab content is rendered', async () => {
  const { url } = await sandbox.renderFromFile(
    require.resolve('./test-cases/basic-tab.jsx')
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
