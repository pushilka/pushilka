function Pushilka(n){var i={endpoint:"https://push.wuazu.net/push_subscription.php",serviceWorker:"/serviceWorker.js",serviceWorkerOptions:{scope:"/"},applicationServerKey:"BCmIwkLHxJNPccoVf2UXDjd7kDuiyJpKsSOqSHCtGBMfBkjfHLCq4-d8eNtabNlCNKFF8CZIzeDwOo3OvNCQAns",source:"",var1:"",var2:"",var3:"",var4:"",done:function(){},success:function(){},decline:function(){}};for(var e in n)n.hasOwnProperty(e)&&i.hasOwnProperty(e)&&(i[e]=n[e]);function r(){navigator.serviceWorker.ready.then(function(n){return n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:function(n){for(var e=(n+"=".repeat((4-n.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),r=window.atob(e),t=new Uint8Array(r.length),o=0;o<r.length;++o)t[o]=r.charCodeAt(o);return t}(i.applicationServerKey)})}).then(function(n){return t(n,"POST")}).catch(function(){i.decline()})}function t(n,e){var r=n.getKey("p256dh"),t=n.getKey("auth"),o=(PushManager.supportedContentEncodings||["aesgcm"])[0];return fetch(i.endpoint+"?s="+encodeURIComponent(i.source.toString())+"&var1="+encodeURIComponent(i.var1.toString())+"&var2="+encodeURIComponent(i.var2.toString())+"&var3="+encodeURIComponent(i.var3.toString())+"&var4="+encodeURIComponent(i.var4.toString()),{method:e,body:JSON.stringify({endpoint:n.endpoint,publicKey:r?btoa(String.fromCharCode.apply(null,new Uint8Array(r))):null,authToken:t?btoa(String.fromCharCode.apply(null,new Uint8Array(t))):null,contentEncoding:o})}).then(function(){return i.done(),i.success(),n}).catch(function(){i.done(),i.success()})}this.run=function(){document.addEventListener("DOMContentLoaded",function(){navigator.serviceWorker.register(i.serviceWorker,i.serviceWorkerOptions),navigator.serviceWorker.ready.then(function(n){return n.pushManager.getSubscription()}).then(function(n){return n?t(n,"PUT"):r()})})}}