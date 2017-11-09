import {t, Selector} from "testcafe";
import sandbox from "../src/server";
//
// const reactImport = `
// import React from 'react';
// `;
//
// const customImport = `
// import { Tab } from 'semantic-ui-react'
// `;
//
// const withImports = (...args) => {
//   const imports = args.reduce((acc, next) => {
//     return `
//       ${acc}
//       ${next}`;
//   });
//   return code => `
//     ${imports}
//     export default ${code}
//    `;
// };
//
// const withExport = withImports(reactImport, customImport);
// const render = async code => await sandbox.render(withExport(code));

fixture`Example`;

test("load page", async () => {
  const {url} = await sandbox.renderFrom(require.resolve('./samples/basic-tab'));
  
  await t.navigateTo(url);
  await t.wait(2000000000)
  await t.expect(Selector(".new").visible).eql(true);
});
