(function () {
  "use strict";
  let t = document.title.split(/(?<=)/u);
  Array.prototype.rotate = function (n) {
    n %= this.length;
    return this.slice(n, this.length).concat(this.slice(0, n));
  };
  let cnt = 0;
  setInterval(() => {
    document.title = (t = t.rotate(2)).join("");
  }, 500);
  let i = setInterval(() => {
    if (cnt == 3) {
      window.location.href = "https://github.com/eggplants";
      clearInterval(i);
    } else if (cnt < 3) {
      cnt++;
    }
  }, 1000);
})();
