!function(){var n=async function(n,e){var t=1,o=1e3,i=1001,r="$cbid";e||(e={}),void 0!==e.reconnect&&!0!==e.reconnect||(e.reconnect=1e3),!0===e.ping&&(e.ping=1e3),void 0===e.disconnect&&(e.disconnect=3e3);for(var c,a,s,u,f,p={},d=["message","open","close","error"],l=0;l<d.length;l++)p[d[l]]=[];function v(n,...e){for(var t=0;t<p[n].length;t++)p[n][t](...e)}function m(t,o){a={},s=0,(c=new WebSocket(n)).onmessage=function(n){var e=JSON.parse(n.data),t=e[r];t?(delete e[r],a[t]&&(a[t](e,n),delete a[t])):v("message",e,n)},c.onopen=function(n){t&&t(h),v("open",h,n),e.ping&&(clearInterval(u),clearTimeout(f),u=setInterval(function(){w({$ping:1})},e.ping),f=setTimeout(function(){clearInterval(u),g(i)},e.disconnect))},c.onerror=function(n){o&&o(n),v("error",n)},c.onclose=function(n){e.reconnect&&setTimeout(m,e.reconnect),v("close",n)}}function g(n){n=n||o,c.close(n)}function w(n){c.readyState===t&&c.send(JSON.stringify(n))}var h={on:function(n,e){p[n].push(e)},connect:m,send:w,fetch:function(n){return new Promise(function(e){n[r]=++s,a[s]=function(n){e(n)},w(n)})},disconnect:g};return new Promise(m)},e=function(n,e,t){return new Promise(function(o,i){t||(t={}),e||(e={});var r,c=new XMLHttpRequest;if(c.addEventListener("load",function(){var n=JSON.parse(c.responseText);o(n)}),c.addEventListener("error",function(){i(c)}),c.open(t.method||"POST",n+(t.path||"")),t.files){for(var a in r=new FormData,e)r.append(a,e[a]);for(var s of t.files)r.append("file",s,s.name);t.progress&&c.upload.addEventListener("progress",function(n){n.percent=(n.loaded/n.total*100).toFixed(2),t.progress(n)})}else c.setRequestHeader("Content-Type","application/json; charset=utf-8");c.withCredentials=!0,c.send(r||JSON.stringify(e))})};window.waveorb=function(t,o){if(0==t.indexOf("ws"))return new Promise(function(e){n(t,o||{}).then(function(n){e({action:function(e,t){return t||(t={}),t.action=e,n.fetch(t)}})})});{function i(n,o,i){return o||(o={}),o.action=n,e(t,o,i)}return{action:i,upload:function(n,e,t){return e||(e={}),t||(t={}),new Promise(function(o){var r=document.createElement("input");r.type="file",t.multiple&&(r.multiple=!0),t.accept&&(r.accept=t.accept),r.onchange=function(){t.files=r.files,i(n,e,t).then(function(n){o(n)})},r.click()})}}}}}();