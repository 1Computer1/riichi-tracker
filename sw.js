if(!self.define){let e,i={};const s=(s,r)=>(s=new URL(s+".js",r).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(r,a)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(i[l])return;let d={};const b=e=>s(e,l),c={module:{uri:l},exports:d,require:b};i[l]=Promise.all(r.map((e=>c[e]||b(e)))).then((e=>(a(...e),d)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.29d6f82d.js",revision:null},{url:"assets/index.90824920.css",revision:null},{url:"index.html",revision:"9bddcfffed618137435f2493b3cc3f39"},{url:"Chun.svg",revision:"350386df7d86394eb4579e618979695b"},{url:"Chun192.png",revision:"b18333f952139554430d3d68cd6035ed"},{url:"Chun512.png",revision:"f863c547bfae9a7ec8fa7660fd1d8fb0"},{url:"github/github-corner-right.svg",revision:"091bcd50362e12bc725d9a1c288dbfb7"},{url:"tiles/dark/Back.svg",revision:"03e56a9636640fad9634d2cd8223e6aa"},{url:"tiles/dark/Blank.svg",revision:"5f73eaf78597a9bd6441532e3a159169"},{url:"tiles/dark/Chun.svg",revision:"05ac8076859a76a7bcc5724da42d10dd"},{url:"tiles/dark/Front.svg",revision:"03e56a9636640fad9634d2cd8223e6aa"},{url:"tiles/dark/Haku.svg",revision:"c2b74bbb97511faa436463d3338ae5eb"},{url:"tiles/dark/Hatsu.svg",revision:"8b7df738d19152192fbe00ee1c6390c7"},{url:"tiles/dark/Man1.svg",revision:"c673bd6e2f1b7109a704200ba08829bb"},{url:"tiles/dark/Man2.svg",revision:"13d0835320c5d92fcbe6e94e2570996e"},{url:"tiles/dark/Man3.svg",revision:"e6c0426c9e099e5248c658a9ee2b722a"},{url:"tiles/dark/Man4.svg",revision:"351d1f303161ba29994d4ab3a33b1027"},{url:"tiles/dark/Man5-Dora.svg",revision:"e7c5e8f1d0f505d54a32558b6b167515"},{url:"tiles/dark/Man5.svg",revision:"2e0e2b514f3da58bf3e62fb13a57e9ba"},{url:"tiles/dark/Man6.svg",revision:"83c52ae10a375cfab472838d5a89358e"},{url:"tiles/dark/Man7.svg",revision:"9664056d4e48b45e2b4c0d3c30b46964"},{url:"tiles/dark/Man8.svg",revision:"0d621672e33918ac41a0c5bdbb8cf95f"},{url:"tiles/dark/Man9.svg",revision:"12c6981d0400836eab74a864786ec3e2"},{url:"tiles/dark/Nan.svg",revision:"8b642a1215cb4f8da50adada4b627f3e"},{url:"tiles/dark/Pei.svg",revision:"b8d5390f78cd754ea5a43dd4559555d1"},{url:"tiles/dark/Pin1.svg",revision:"01bac01be75bbd1f695a390be6f35d95"},{url:"tiles/dark/Pin2.svg",revision:"9305c9ea89071d08d138ee41886c436a"},{url:"tiles/dark/Pin3.svg",revision:"c639ca54c33f26c213bec5a1f8a0f871"},{url:"tiles/dark/Pin4.svg",revision:"40cf2b8786fef77be49bd8ec5b69d686"},{url:"tiles/dark/Pin5-Dora.svg",revision:"a052c5ab047b0521212bd29754b8cf30"},{url:"tiles/dark/Pin5.svg",revision:"536d14579fdea11554b2a089077c8ac1"},{url:"tiles/dark/Pin6.svg",revision:"7a31e764e1f9a592435b3180b83233ef"},{url:"tiles/dark/Pin7.svg",revision:"926b5b973b83d6ef5d3c40f298604ef2"},{url:"tiles/dark/Pin8.svg",revision:"5f7e2da07a51861e133639afecb38950"},{url:"tiles/dark/Pin9.svg",revision:"38d5113b62ab05859b90b4e8a6d6d357"},{url:"tiles/dark/Shaa.svg",revision:"b921b2f30c8e547ec4bc0d8652948d2e"},{url:"tiles/dark/Sou1.svg",revision:"305c16f8d08fd208f2829b2d43613236"},{url:"tiles/dark/Sou2.svg",revision:"dd6499ae9515514b697db5b27cb36b2f"},{url:"tiles/dark/Sou3.svg",revision:"9f7ca2bb35b38455e94841051a60d333"},{url:"tiles/dark/Sou4.svg",revision:"f2fb0ae62ec2aa9260351c1dfa55c181"},{url:"tiles/dark/Sou5-Dora.svg",revision:"a77995d4f1fc5a618fe27e7f49a511bf"},{url:"tiles/dark/Sou5.svg",revision:"185225370d28749aa297fbcc64f702d4"},{url:"tiles/dark/Sou6.svg",revision:"d76cad0658be076730720582c2ef43d8"},{url:"tiles/dark/Sou7.svg",revision:"63b394e55d14cad6698460b546d03bf1"},{url:"tiles/dark/Sou8.svg",revision:"d0708f32f76eb282a23c5308989b5b63"},{url:"tiles/dark/Sou9.svg",revision:"9d8a96210b60a4fed3c54350c1159aae"},{url:"tiles/dark/Ton.svg",revision:"c7da20e2f1324f69b9aa4762f12b5c5b"},{url:"tiles/light/Back.svg",revision:"76137b7605dd2c11a7c4ae217c09c141"},{url:"tiles/light/Blank.svg",revision:"8bf07363db1122e18dd67f1c8fcc6b74"},{url:"tiles/light/Chun.svg",revision:"350386df7d86394eb4579e618979695b"},{url:"tiles/light/Front.svg",revision:"d05999d7c7c481d243075b2df0b96532"},{url:"tiles/light/Haku.svg",revision:"c2b74bbb97511faa436463d3338ae5eb"},{url:"tiles/light/Hatsu.svg",revision:"e04c72c4da4f2f148f9a83fb717b465d"},{url:"tiles/light/Man1.svg",revision:"510ebd9495263c23e4cc8bc34092459c"},{url:"tiles/light/Man2.svg",revision:"fcb5216b41147d5b8f0dd18f16327034"},{url:"tiles/light/Man3.svg",revision:"2cd43a18af1d30279e36ca25aa6c1b46"},{url:"tiles/light/Man4.svg",revision:"c6a4b70afaa0c943e94e1dca032a3644"},{url:"tiles/light/Man5-Dora.svg",revision:"e7c5e8f1d0f505d54a32558b6b167515"},{url:"tiles/light/Man5.svg",revision:"f2394a4cc504d30a10583f95f096a80e"},{url:"tiles/light/Man6.svg",revision:"5917c8f5b3ab30c5620b3843c98e5bcc"},{url:"tiles/light/Man7.svg",revision:"9f57d1c231b1626694b4d02954d91f86"},{url:"tiles/light/Man8.svg",revision:"e6c28da32d7185a05026b7b0b1e7d90f"},{url:"tiles/light/Man9.svg",revision:"ffea0079520e44dba9829e9d3a77993c"},{url:"tiles/light/Nan.svg",revision:"39e75850464a65d83b7f0c11920f25c0"},{url:"tiles/light/Pei.svg",revision:"47ddd4641bf00800fc1dc7721c042678"},{url:"tiles/light/Pin1.svg",revision:"186cae74cdde7ffdcf00d45fcf6a3477"},{url:"tiles/light/Pin2.svg",revision:"12342fa173cf1343994aeeeb4968c7d1"},{url:"tiles/light/Pin3.svg",revision:"67c7a6f793ef63739ed6f988be7b32a9"},{url:"tiles/light/Pin4.svg",revision:"51d4cc9fc69dabe13829a6eec800fcf1"},{url:"tiles/light/Pin5-Dora.svg",revision:"9640ca22e365e2aff3636878b35cb2e7"},{url:"tiles/light/Pin5.svg",revision:"9a9609e32510e48dcd2cd17911b0a68c"},{url:"tiles/light/Pin6.svg",revision:"b9cfedf27d38d7b3fd9cfa4c1bf8f92f"},{url:"tiles/light/Pin7.svg",revision:"d040d90704673cbd715756e6267228e8"},{url:"tiles/light/Pin8.svg",revision:"3d44695e880b2954e5936410bdeb85b6"},{url:"tiles/light/Pin9.svg",revision:"5e2c1416c58fa8c4a999e11e6a06b919"},{url:"tiles/light/Shaa.svg",revision:"8152279500e023f27ee1ded20e0961f2"},{url:"tiles/light/Sou1.svg",revision:"f7e195dfb1ff4fca5eb0cde3e5a1e6f8"},{url:"tiles/light/Sou2.svg",revision:"067690c76620b10a33ba70a49b5ccb2e"},{url:"tiles/light/Sou3.svg",revision:"e2ee3c27f9d2432deb5bc53cadca84ea"},{url:"tiles/light/Sou4.svg",revision:"d78d3f22c40b052f61e085912dd6fb9c"},{url:"tiles/light/Sou5-Dora.svg",revision:"df0edefa90b2340009a24478f99740f0"},{url:"tiles/light/Sou5.svg",revision:"b1f451283233c2aad7a1ee875354ba07"},{url:"tiles/light/Sou6.svg",revision:"3c4c2fc356de03f99b79b01c2b5f306e"},{url:"tiles/light/Sou7.svg",revision:"434a936943d4c3e287686eebe363173a"},{url:"tiles/light/Sou8.svg",revision:"d2878fd00a182de42bfac61293f87c7a"},{url:"tiles/light/Sou9.svg",revision:"6717b5f6aeb0de740cb06c947557ec27"},{url:"tiles/light/Ton.svg",revision:"67b553f6e07052f26db8be4d5879b4d5"},{url:"manifest.webmanifest",revision:"d15fca84f963140f5f5892a03505b82d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
