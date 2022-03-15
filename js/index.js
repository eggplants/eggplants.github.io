(function () {
  "use strict";
  console.log('%c Hi!', 'font-size:180px;background:url(https://raw.githubusercontent.com/eggplants/myicons/master/selfie_mini.png)no-repeat;');
  var t = document.title.split(/(?<=)/u);
  Array.prototype.rotate = function (n) {
    n %= this.length;
    return this.slice(n, this.length).concat(this.slice(0, n));
  };
  var cnt = 0;
  setInterval(() => {
    document.title = (t = t.rotate(2)).join("");
  }, 500);
  var i = setInterval(() => {
    if (cnt == 3) {
      window.location.href = "https://github.com/eggplants";
      clearInterval(i);
    } else if (cnt < 3) {
      cnt++;
    }
  }, 1000);
})();
