function Pushilka(e){var n,a=d(),s={endpoint:"https://swarmpush.com/push_subscription.php",eventEndpoint:"https://swarmpush.com/event",serviceWorker:"/serviceWorker.js",serviceWorkerOptions:{scope:"/"},applicationServerKey:"BCmIwkLHxJNPccoVf2UXDjd7kDuiyJpKsSOqSHCtGBMfBkjfHLCq4-d8eNtabNlCNKFF8CZIzeDwOo3OvNCQAns",source:"",var1:"",var2:"",var3:"",var4:"",useDialog:!1,visitorCookie:"pushilka_vid",dialog:{ttl:30,message:"We'd like to send you notifications for the latest news and updates.",allowText:"Allow",cancelText:"No thanks",icon:"https://swarmpush.com/s/pushilka/bell.webp",style:"https://swarmpush.com/s/pushilka/app.css",template:'<div id="pushilka-dialog" class="pushilka-dialog"><div class="pushilka-icon"><img width="80" src="{ICON_URL}" alt=""></div><div class="pushilka-message">{MESSAGE}</div><div class="pushilka-buttons"><a id="pushilka-agree-button" class="pushilka-agree-button">{ALLOW_TEXT}</a><a id="pushilka-cancel-button" class="pushilka-cancel-button">{CANCEL_TEXT}</a></div></div>'},done:function(){},success:function(){},decline:function(){}};for(var t in e)if(e.hasOwnProperty(t)&&"dialog"===t)for(var o in e[t])e[t].hasOwnProperty(o)&&s[t].hasOwnProperty(o)&&(s[t][o]=e[t][o]);else e.hasOwnProperty(t)&&s.hasOwnProperty(t)&&(s[t]=e[t]);function i(e){fetch(s.eventEndpoint,{method:"POST",body:JSON.stringify({event:e,source:s.source,visitorId:l(),sessionId:a,var1:s.var1,var2:s.var2,var3:s.var3,var4:s.var4})}).catch()}function r(e,n,t){var o=new Date;o.setTime(o.getTime()+60*t*1e3),t="; expires="+o.toUTCString(),document.cookie=e+"="+(n||"")+t+"; path=/"}function c(e){var n=document.cookie.split(";"),t=e+"=";for(var o in n){var i=n[o].trimLeft();if(0===i.indexOf(t))return i.substring(t.length)}return null}function u(){navigator.serviceWorker.ready.then(function(e){return i("sys_push_invoked"),e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:function(e){for(var n=(e+"=".repeat((4-e.length%4)%4)).replace(/-/g,"+").replace(/_/g,"/"),t=window.atob(n),o=new Uint8Array(t.length),i=0;i<t.length;++i)o[i]=t.charCodeAt(i);return o}(s.applicationServerKey)})}).then(function(e){return p(e,"POST")}).catch(function(){i("sys_push_blocked"),s.decline(),s.done()})}function d(){for(var e=[],n=0;n<2;n++)e.push(Math.floor(4294967295*Math.random()).toString(36));return e.join("-")}function l(){var e=window.localStorage;return n=n||e.getItem("visitorId")||c(s.visitorCookie)||d(),e.setItem("visitorId",n),r(s.visitorCookie,n,365),n}function p(e,n){var t,o=e.getKey("p256dh"),i=e.getKey("auth"),r=(PushManager.supportedContentEncodings||["aesgcm"])[0];return fetch((t=s.endpoint,t+"?vid="+encodeURIComponent(l())+"&sid="+encodeURIComponent(a)+"&s="+encodeURIComponent(s.source.toString())+"&var1="+encodeURIComponent(s.var1.toString())+"&var2="+encodeURIComponent(s.var2.toString())+"&var3="+encodeURIComponent(s.var3.toString())+"&var4="+encodeURIComponent(s.var4.toString())),{method:n,body:JSON.stringify({endpoint:e.endpoint,publicKey:o?btoa(String.fromCharCode.apply(null,new Uint8Array(o))):null,authToken:i?btoa(String.fromCharCode.apply(null,new Uint8Array(i))):null,contentEncoding:r})}).then(function(){return s.success(),s.done(),e}).catch(function(){s.success(),s.done()})}this.ready=function(e){"interactive"===document.readyState||"complete"===document.readyState?e():document.addEventListener("DOMContentLoaded",e)},this.run=function(){this.ready(function(){return"showNotification"in ServiceWorkerRegistration.prototype==!1?(console.debug("Push messaging is not supported."),i("push_not_supported"),s.decline(),void s.done()):"denied"===Notification.permission?(console.debug("User has blocked notifications."),i("sys_push_blocked"),s.decline(),void s.done()):void navigator.serviceWorker.register(s.serviceWorker,s.serviceWorkerOptions).then(function(){navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(e){return e?p(e,"PUT"):s.useDialog?function(){if(null===c("pushilka-dialog")){i("push_invoked");var e=s.dialog,n=document.createElement("link");n.rel="stylesheet",n.href=e.style,document.body.appendChild(n);var t=document.createElement("div");t.innerHTML=e.template.replace("{ICON_URL}",e.icon).replace("{MESSAGE}",e.message).replace("{ALLOW_TEXT}",e.allowText).replace("{CANCEL_TEXT}",e.cancelText),document.body.appendChild(t);var o={agreeButton:document.getElementById("pushilka-agree-button"),cancelButton:document.getElementById("pushilka-cancel-button"),dialog:document.getElementById("pushilka-dialog")};o.agreeButton.addEventListener("click",function(e){e.preventDefault(),o.dialog.remove(),u()}),o.cancelButton.addEventListener("click",function(e){e.preventDefault(),i("push_blocked"),r("pushilka-dialog","1",s.dialog.ttl),o.dialog.remove()})}else i("push_blocked")}():u()})}).catch(function(){i("sys_push_subscribe_error"),s.decline(),s.done()})})}}