const go = require("./index");

const e = new go();

const test = function() {
  e.off("test", test);
};

e.on("test", test);
e.on("test", test);
console.assert(e.events.test.length === 1, "重复添加了相同监听器");
e.emit("test");
console.assert(e.events.test.length === 0, "清除监听器测试失败");
