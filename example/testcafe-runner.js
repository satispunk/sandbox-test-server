const createTestCafe = require("testcafe");
const path = require("path");
let runner = null;

const sandbox = require("../src/server");

createTestCafe("localhost", 1337, 1338)
  .then(testcafe => {
    runner = testcafe.createRunner();

    return testcafe.createBrowserConnection();
  })
  .then(() => {
    return sandbox.listen(3000);
  })
  .then(() => {
    return sandbox.build();
  })
  .then(() => {
    const testPath = path.resolve(__dirname, "./tests.js");

    runner
      .src(testPath)
      .browsers(["chrome"])
      .run()
      .then(failedCount => {
        if (failedCount) {
          process.exit(1);
        }

        process.exit(0);
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
