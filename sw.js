if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const f=e=>n(e,t),d={module:{uri:t},exports:o,require:f};i[t]=Promise.all(s.map((e=>d[e]||f(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.247b6601.css",revision:null},{url:"assets/index.88cba912.js",revision:null},{url:"index.html",revision:"2007aa196c1c378282e6f9e9fb7f954a"},{url:"registerSW.js",revision:"a5f3c94023a89c3d4c8af6895c37a7b9"},{url:"Chun.svg",revision:"350386df7d86394eb4579e618979695b"},{url:"Chun192.png",revision:"b18333f952139554430d3d68cd6035ed"},{url:"Chun512.png",revision:"f863c547bfae9a7ec8fa7660fd1d8fb0"},{url:"manifest.webmanifest",revision:"d15fca84f963140f5f5892a03505b82d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
