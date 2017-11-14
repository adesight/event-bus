class EventGo {
  constructor() {
    this.events = {};
  }
  /**
    * 添加事件
    * @param {String} eventName 
    * @param {Object|Function} listener 
    * @return {Object} this
    */
  on(eventName, listener) {
    if (!eventName || !listener) return;
    if (!listenerValidate(listener))
      throw new Error("listener should be a function");
    const events = this.events;
    const listeners = (events[eventName] = events[eventName] || []);
    if (!listeners.length) {
      pushListener(listeners, listener);
    } else {
      listeners.forEach(val => {
        if (val.listener !== listener) {
          pushListener(listeners, listener);
        }
      });
    }
    return this;
  }

  /**
    * 删除事件
    * @param  {String} eventName
    * @param  {Function} listener
    * @return {Object} this
    */
  off(eventName, listener) {
    const listeners = this.events[eventName];
    if (!listeners) return;
    let index = -1;
    // 最好用 for 替代 foreach 结束后续不必要循环
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i].listener === listener) {
        index = i;
        break;
      }
    }
    if (index !== -1) listeners.splice(index, 1);
    return this;
  }

  /**
    * 调用事件
    * @param  {String} eventName
    * @param  {Function} listener
    * @return {Object} this
    */

  emit(eventName, args) {
    const listeners = this.events[eventName];
    if (!listeners) return;
    listeners.forEach(val => {
      val.listener.apply(this, args || []);
      if (val.once) {
        this.off(eventName, listener.listener);
      }
    });
    return this;
  }
}

/**
  * 验证事件回调函数
  * @param {Object|Function} listener 
  * @return {Boolean}
  */
function listenerValidate(listener) {
  if (typeof listener === "function") {
    return true;
  } else if (typeof listener === "object") {
    return listenerValidate(listener.listener);
  } else {
    return false;
  }
}

/**
  * 添加listener
  * @param {Array} listeners 
  * @param {Function|Object} listener 
  */
function pushListener(listeners, listener) {
  listeners.push(
    typeof listener === "object"
      ? listener
      : {
          listener: listener,
          once: false
        }
  );
}

module.exports = EventGo;
