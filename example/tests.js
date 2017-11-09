import {t, Selector} from "testcafe";
import sandbox from "../src/server";

const reactImport = `
import React from 'react';
`;

const customImport = `
import Slider from 'material-ui/Slider';
`;

const withImports = (...args) => {
  const imports = args.reduce((acc, next) => {
    return `
      ${acc}
      ${next}`;
  });
  return code => `
    ${imports}
    export default ${code}
   `;
};

const withExport = withImports(reactImport, customImport);
const render = async code => await sandbox.render(withExport(code));

fixture`Example`;

test("load page", async () => {
  const {url} = await render(`
    <Slider default={0.5}/>
`);

  await t.navigateTo(url);
  await t.expect(Selector(".new").visible).eql(true);
});
