function Pushilka(e){var a=r(),s={endpoint:"https://push.wuazu.net/push_subscription.php",eventEndpoint:"https://push.wuazu.net/event",serviceWorker:"/serviceWorker.js",serviceWorkerOptions:{scope:"/"},applicationServerKey:"BCmIwkLHxJNPccoVf2UXDjd7kDuiyJpKsSOqSHCtGBMfBkjfHLCq4-d8eNtabNlCNKFF8CZIzeDwOo3OvNCQAns",source:"",var1:"",var2:"",var3:"",var4:"",useDialog:!1,dialog:{ttl:30,message:"We'd like to send you notifications for the latest news and updates.",allowText:"Allow",cancelText:"No thanks",icon:"https://push.wuazu.net/s/pushilka/bell.webp",style:"https://push.wuazu.net/s/pushilka/app.css",template:'<div id="pushilka-dialog" class="pushilka-dialog"><div class="pushilka-icon"><img width="80" src="{ICON_URL}" alt=""></div><div class="pushilka-message">{MESSAGE}</div><div class="pushilka-buttons"><a href="" id="pushilka-agree-button" class="pushilka-agree-button">{ALLOW_TEXT}</a><a href="" id="pushilka-cancel-button" class="pushilka-cancel-button">{CANCEL_TEXT}</a></div></div>'},done:function(){},success:function(){},decline:function(){}};for(var n in e)if(e.hasOwnProperty(n)&&"dialog"===n)for(var t in e[n])e[n].hasOwnProperty(t)&&s[n].hasOwnProperty(t)&&(s[n][t]=e[n][t]);else e.hasOwnProperty(n)&&s.hasOwnProperty(n)&&(s[n]=e[n]);function c(e){fetch(s.eventEndpoint,{method:"POST",body:JSON.stringify({event:e,source:s.source,visitorId:u(),sessionId:a,var1:s.var1,var2:s.var2,var3:s.var3,var4:s.var4})}).catch()}function o(){if(null===function(e){var n=document.cookie.split(";"),t=e+"=";for(var o in n){var i=n[o].trimLeft();if(0===i.indexOf(t))return i.substring(t.length)}return null}("pushilka-dialog")){c("push_invoked");var e=s.dialog,n=document.createElement("link");n.rel="stylesheet",n.href=e.style,document.body.appendChild(n);var t=document.createElement("div");t.innerHTML=e.template.replace("{ICON_URL}",e.icon).replace("{MESSAGE}",e.message).replace("{ALLOW_TEXT}",e.allowText).replace("{CANCEL_TEXT}",e.cancelText),document.body.appendChild(t);var r={agreeButton:document.getElementById("pushilka-agree-button"),cancelButton:document.getElementById("pushilka-cancel-button"),dialog:document.getElementById("pushilka-dialog")};r.agreeButton.addEventListener("click",function(e){e.preventDefault(),r.dialog.remove(),i()}),r.cancelButton.addEventListener("click",function(e){var n,t,o,i;e.preventDefault(),c("push_blocked"),n="pushilka-dialog",t="1",o=s.dialog.ttl,(i=new Date).setTime(i.getTime()+60*o*1e3),o="; expires="+i.toUTCString(),document.cookie=n+"="+(t||"")+o+"; path=/",r.dialog.remove()})}}function i(){navigator.serviceWorker.ready.then(function(e){return c("sys_push_invoked"),e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:function(e){for(var n=(e+"=".repeat((4-e.length%4)%4)).replace(/-/g,"+").replace(/_/g,"/"),t=window.atob(n),o=new Uint8Array(t.length),i=0;i<t.length;++i)o[i]=t.charCodeAt(i);return o}(s.applicationServerKey)})}).then(function(e){return d(e,"POST")}).catch(function(){c("sys_push_blocked"),s.decline(),s.done()})}function r(){for(var e=[],n=0;n<2;n++)e.push(Math.floor(4294967295*Math.random()).toString(36));return e.join("-")}function u(){var e=window.localStorage,n=e.getItem("visitorId")||r();return e.setItem("visitorId",n),n}function d(e,n){var t,o=e.getKey("p256dh"),i=e.getKey("auth"),r=(PushManager.supportedContentEncodings||["aesgcm"])[0];return fetch((t=s.endpoint,t+"?vid="+encodeURIComponent(u())+"&sid="+encodeURIComponent(a)+"&s="+encodeURIComponent(s.source.toString())+"&var1="+encodeURIComponent(s.var1.toString())+"&var2="+encodeURIComponent(s.var2.toString())+"&var3="+encodeURIComponent(s.var3.toString())+"&var4="+encodeURIComponent(s.var4.toString())),{method:n,body:JSON.stringify({endpoint:e.endpoint,publicKey:o?btoa(String.fromCharCode.apply(null,new Uint8Array(o))):null,authToken:i?btoa(String.fromCharCode.apply(null,new Uint8Array(i))):null,contentEncoding:r})}).then(function(){return s.success(),s.done(),e}).catch(function(){s.success(),s.done()})}this.ready=function(e){"interactive"===document.readyState||"complete"===document.readyState?e():document.addEventListener("DOMContentLoaded",e)},this.run=function(){this.ready(function(){return"showNotification"in ServiceWorkerRegistration.prototype==!1?(console.debug("Push messaging is not supported."),s.decline(),void s.done()):"denied"===Notification.permission?(console.debug("User has blocked notifications."),s.decline(),void s.done()):void navigator.serviceWorker.register(s.serviceWorker,s.serviceWorkerOptions).then(function(){navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(e){return e?d(e,"PUT"):s.useDialog?o():i()})}).catch(function(){s.decline(),s.done()})})}}