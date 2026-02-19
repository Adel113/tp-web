(function(window){
  const isDev = (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:');

  function escapeHtml(str){
    if (typeof str !== 'string') return '';
    return str.replace(/&/g,'&amp;')
              .replace(/</g,'&lt;')
              .replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;')
              .replace(/'/g,'&#39;')
              .replace(/\//g,'&#x2F;');
  }

  function validateName(name){
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,40}$/u;
    return re.test(name);
  }

  function validateEmail(email){
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePassword(pwd){
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(pwd);
  }

  function logger(){ }
  logger.debug = function(){ if (isDev) console.debug.apply(console, arguments); };
  logger.info = function(){ if (isDev) console.info.apply(console, arguments); };
  logger.warn = function(){ if (isDev) console.warn.apply(console, arguments); };
  logger.error = function(){ if (isDev) console.error.apply(console, arguments); };

  function recordFailedAttempt(key){
    try{
      const raw = localStorage.getItem('bf_' + key);
      const obj = raw ? JSON.parse(raw) : {count:0, nextAllowed:0};
      obj.count = (obj.count || 0) + 1;
      const base = 30;
      const delay = base * Math.pow(2, Math.max(0,obj.count-1));
      obj.nextAllowed = Date.now() + delay * 1000;
      localStorage.setItem('bf_' + key, JSON.stringify(obj));
      return obj;
    }catch(e){ logger.error('recordFailedAttempt', e); return null; }
  }

  function resetAttempts(key){
    try{ localStorage.removeItem('bf_' + key); }catch(e){ logger.error(e); }
  }

  function getAttemptInfo(key){
    try{ const raw = localStorage.getItem('bf_' + key); return raw ? JSON.parse(raw) : {count:0, nextAllowed:0}; }catch(e){ logger.error(e); return {count:0,nextAllowed:0}; }
  }

  // export
  window.__SEC__ = {
    escapeHtml, validateName, validateEmail, validatePassword,
    logger, recordFailedAttempt, resetAttempts, getAttemptInfo,
    isDev
  };
})(window);
