if(!self.define){let e,n={};const i=(i,s)=>(i=new URL(i+".js",s).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(n[t])return;let o={};const d=e=>i(e,t),f={module:{uri:t},exports:o,require:d};n[t]=Promise.all(s.map((e=>f[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.0e612c21.js",revision:null},{url:"assets/index.5e8ca205.css",revision:null},{url:"index.html",revision:"79d36a4a0de1e50a4efb26f1b86284d2"},{url:"Chun.svg",revision:"350386df7d86394eb4579e618979695b"},{url:"Chun192.png",revision:"b18333f952139554430d3d68cd6035ed"},{url:"Chun512.png",revision:"f863c547bfae9a7ec8fa7660fd1d8fb0"},{url:"manifest.webmanifest",revision:"d15fca84f963140f5f5892a03505b82d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
