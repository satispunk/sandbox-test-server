module.exports = id => `
<!doctype>
<html>
  <head>
  </head>
  <body>
  <div id="app"/>
    <script src="/script/vendor"></script>
    <script src="/script/${id}"></script>
  </body>
</html>`;
