// 节流
export function _throttle(fn, wait = 200) {
    let last, timer,now;
    return function() {
      now = Date.now();
      if (last && now - last < wait) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          last = now;
          fn.call(this, ...arguments);
        }, wait);
      } else {
        last = now;
        fn.call(this, ...arguments);
      }
    };
  }


  // 防抖
export function _debounce(fn, wait = 200) {
    let timer;
      return function () {
        let context = this;
        let args = arguments;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, wait)
      }
  }