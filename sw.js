if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let t={};const o=e=>i(e,l),d={module:{uri:l},exports:t,require:o};s[l]=Promise.all(n.map((e=>d[e]||o(e)))).then((e=>(r(...e),t)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.1c61e133.css",revision:null},{url:"assets/index.5d515beb.js",revision:null},{url:"assets/tiles-dark.985f36ef.js",revision:null},{url:"assets/tiles-light.ddd8b723.js",revision:null},{url:"assets/vendor.cc215caa.js",revision:null},{url:"index.html",revision:"f5bcea7a6ac72f1bc69f5e2fc119d728"},{url:"Chun.svg",revision:"350386df7d86394eb4579e618979695b"},{url:"Chun192.png",revision:"b18333f952139554430d3d68cd6035ed"},{url:"Chun512.png",revision:"f863c547bfae9a7ec8fa7660fd1d8fb0"},{url:"manifest.webmanifest",revision:"d15fca84f963140f5f5892a03505b82d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
