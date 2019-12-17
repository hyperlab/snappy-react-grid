let supportsPassive = false;

try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    },
  });
  const noop = () => null;
  window.addEventListener('testPassive', noop, opts);
  window.removeEventListener('testPassive', noop, opts);
} catch (e) {}

export default supportsPassive;
