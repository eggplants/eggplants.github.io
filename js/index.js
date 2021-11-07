(function () {
  "use strict";
  var t = document.title.split(/(?<=)/u);
  Array.prototype.rotate = function (n) {
    n = n % this.length;
    return this.slice(n, this.length).concat(this.slice(0, n));
  };
  var cnt = 0;
  setInterval(() => {
    t = t.rotate(2);
    document.title = t.join("");
  }, 500);
  setInterval(() => {
    if (cnt == 3) {
      window.location.href = "https://github.com/eggplants";
      cnt++;
    } else if (cnt < 3) {
      cnt++;
    }
  }, 1000);
})();
