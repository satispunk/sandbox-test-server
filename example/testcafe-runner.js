const createTestCafe = require('testcafe');
const path = require('path')
let runner = null;

const ReactSandbox = require('../src/server')

createTestCafe('localhost', 1337, 1338)
.then(testcafe => {
  runner = testcafe.createRunner();
  
  return testcafe.createBrowserConnection();
})
.then(() => {
  return ReactSandbox.listen(3000)
})
.then(() => {
  const testPath = path.resolve(__dirname, './tests.js')
  
  runner
  .src(testPath)
  .browsers(['chrome'])
  .run()
  .then(failedCount => {
    console.log(failedCount)
  })
  .catch(error => {
    /* ... */
  });
}).catch(error => {
  console.log(error)
  process.exit(1)
});

