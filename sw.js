if(!self.define){let e,n={};const i=(i,s)=>(i=new URL(i+".js",s).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(n[t])return;let d={};const o=e=>i(e,t),f={module:{uri:t},exports:d,require:o};n[t]=Promise.all(s.map((e=>f[e]||o(e)))).then((e=>(r(...e),d)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.1043602e.css",revision:null},{url:"assets/index.d37f35ad.js",revision:null},{url:"index.html",revision:"8703d8c247deeffef2b7985d409a5751"},{url:"Chun.svg",revision:"350386df7d86394eb4579e618979695b"},{url:"Chun192.png",revision:"b18333f952139554430d3d68cd6035ed"},{url:"Chun512.png",revision:"f863c547bfae9a7ec8fa7660fd1d8fb0"},{url:"manifest.webmanifest",revision:"d15fca84f963140f5f5892a03505b82d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
