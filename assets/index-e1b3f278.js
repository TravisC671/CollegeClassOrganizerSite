(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function l(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=l(o);fetch(o.href,i)}})();function $(e){let t=e.toString(),l="#000000";return l=l.substring(0,l.length-t.length),l+t}function M(e,t,l){let r="#"+(16777216+(e<<16)+(t<<8)+l).toString(16).slice(1);return r=r.replace("#",""),parseInt(r)}function P(e,t){const l=e.getBoundingClientRect(),r=t.clientX-l.left,o=t.clientY-l.top;return[r,o]}function b(e){const t=["th","st","nd","rd"],l=e%100;return e+(t[(l-20)%10]??t[l]??t[0])}function w(e){return e.sort((t,l)=>t-l)}const F=document.getElementById("addNodeButton"),E=document.getElementById("nodeWrapper"),y=document.getElementById("mainCanvas"),S=document.getElementById("hitCanvas"),J=document.getElementById("SaveBtn"),A=document.getElementById("LoadBtn"),C=document.getElementById("fileInput"),n=y.getContext("2d"),I=S.getContext("2d");let R=new FontFace("JetBrainsMonoBold","url(./JetBrainsMono-ExtraBold.ttf)"),k=new FontFace("JetBrainsMono","url(./JetBrainsMono-Bold.ttf)"),f=-1,B=!1,m=!1,g=!1,v=0,p=[0,0];R.load().then(function(e){document.fonts.add(e),console.log("Font loaded")});k.load().then(function(e){document.fonts.add(e),console.log("Font loaded")});let d={x:-140,y:0},x=[0,0,0,0,0,0,0,0,0,0],s=[],h=[];function N(){O(),D(),K(h),H(),G(s),W(s),window.requestAnimationFrame(N)}function O(){n.clearRect(0,0,y.width,y.height),I.clearRect(0,0,S.width,S.height),n.fillStyle="#2c2d30",n.fillRect(0,0,y.width,y.height)}function D(){for(let e=0;e<5;e++)n.strokeStyle="#616161",n.lineWidth=1,n.fillStyle="#616161",n.textAlign="center",n.font="18px JetBrainsMono",e!=0&&(n.beginPath(),n.roundRect(e*325+25+d.x,45+d.y,100,30,[5]),n.stroke(),n.fillText(`${b(e*2-1)}: ${x[e*2-1]}`,e*325+75+d.x,65+d.y),n.beginPath(),n.moveTo(e*325+75+d.x,75+d.y),n.lineTo(e*325+75+d.x,450+d.y),n.stroke()),n.beginPath(),n.roundRect(e*325+175+d.x,45+d.y,100,30,[5]),n.stroke(),n.fillText(`${b(e*2)}: ${x[e*2]}`,e*325+225+d.x,65+d.y),n.beginPath(),n.moveTo(e*325+225+d.x,75+d.y),n.lineTo(e*325+225+d.x,450+d.y),n.stroke()}function G(e){B||e.forEach((t,l)=>{let r=99999,o=0,i=0;for(let c=0;c<5;c++){let a=99999;if(c!=0){let u=c*325+75-t.x-50;Math.abs(u)<r&&(r=Math.abs(u),o=Math.sign(u),i=c*2-1)}a=c*325+225-t.x-50,Math.abs(a)<r&&(r=Math.abs(a),o=Math.sign(a),i=c*2)}t.y<80&&(e[l].y+=1),t.y>400&&(e[l].y+=-1),r!=0&&(e[l].x+=o),r==0&&t.isSettled==!1&&(x[i]+=t.credits,e[l].isSettled=!0,e[l].semesterIndex=i)})}function W(e){e.forEach((t,l)=>{m||(e[l].selected=!1),q(t.name,t.credits,t.color,t.selected,t.x,t.y,l)})}function q(e,t,l,r,o,i,c){let a=100,u=50;r&&(n.fillStyle="#616161",n.beginPath(),n.roundRect(o+d.x-5,i+d.y-5,a+10,u+10,[5]),n.fill()),n.fillStyle=l,n.beginPath(),n.roundRect(o+d.x,i+d.y,a,u,[5]),n.fill(),n.fillStyle="#000000",n.font="16px JetBrainsMono",n.textAlign="center",n.fillText(e,o+a/2+d.x,i+20+d.y),n.font="14px JetBrainsMono",n.textAlign="center",n.fillText(`credits: ${t}`,o+a/2+d.x,i+40+d.y),I.fillStyle=$(c+1),I.fillRect(o+d.x,i+d.y,a,u)}function K(e){e.forEach((t,l)=>{let r={x:s[t[0]].x+100+d.x,y:s[t[0]].y+25+d.y},o={x:s[t[1]].x+d.x,y:s[t[1]].y+25+d.y};n.lineWidth=5;const i=n.createLinearGradient(s[t[0]].x,s[t[0]].y,s[t[1]].x,s[t[1]].y);i.addColorStop(.2,s[t[0]].color),i.addColorStop(.5,s[t[1]].color),n.strokeStyle=i,n.beginPath(),n.moveTo(r.x,r.y),n.bezierCurveTo(r.x+25,r.y,o.x-25,o.y,o.x,o.y),n.stroke()})}function H(){n.fillStyle="#ffffff",n.font="20px JetBrainsMono",n.textAlign="center",m&&!g?n.fillText("connection editor enabled - hold [N] to show connection",475,485):!m&&!g?n.fillText("hold [space] to add connections - hold [N] to show connection",475,485):!m&&g?n.fillText("hold [space] to add connections - showing connections",475,485):m&&g&&n.fillText("connection editor enabled - showing connections",475,485)}y.addEventListener("mousedown",function(e){let t=P(y,e),l=I.getImageData(t[0],t[1],1,1).data;if(f=M(l[0],l[1],l[2])-1,f!=-1){if(m==!1)x[s[f].semesterIndex]-=s[f].credits,s[f].isSettled=!1;else if(m==!0){if(s[f].selected=!0,v+=1,v!=2)p[0]=f;else if(v===2){p[1]=f;let o=p,i=!0;h.forEach((c,a)=>{let u=w(c),L=w(p);JSON.stringify(u)==JSON.stringify(L)&&(h.splice(a,1),i=!1)}),i&&h.push(o)}}}B=!0});y.addEventListener("mousemove",function(e){f!=-1?(s[f].x+=e.movementX,s[f].y+=e.movementY):f===-1&&B&&(d.x+=e.movementX,d.x<-700?d.x=-700:d.x>-140&&(d.x=-140))});y.addEventListener("mouseup",function(e){f=-1,B=!1});document.addEventListener("keydown",e=>{console.log(e.code),e.code==="Space"&&(m=!0),e.code==="KeyN"&&(g=!0)});document.addEventListener("keyup",e=>{e.code==="Space"&&(v=0,p=[0,0],m=!1),e.code==="KeyN"&&(g=!1)});function T(e,t="CSC110",l=3,r="#3dff57"){let o=document.createElement("div");return o.classList.add("node"),o.id=`node-${e}`,o.innerHTML=`
  <span class="nodeText"> name: <input id="nodeName-${e}" class="nodeInput nodeName" type="text" placeholder="CSC110" value="${t}"> </input></span>
  <span class="nodeText"> credits: <input id="nodeCredits-${e}" class="nodeInput nodeCredits" type="number" min="1" value="${l}"> </input></span>
  <span class="nodeText"> color: <input id="nodeColor-${e}" class="nodeInput nodeColor" type="color" value="${r}" > </input></span>
  <button class="nodeClose" id="nodeClose-${e}" ></button>
  `,o}F.onclick=e=>{let t=T(s.length),l={name:"CSC110",credits:3,color:"#3dff57",isSettled:!1,selected:!1,semesterIndex:0,x:50-d.x,y:100};s.push(l),E.appendChild(t),document.getElementById(`nodeClose-${s.length-1}`).addEventListener("click",()=>{z(s.length-1)})};E.addEventListener("input",e=>{let t=E.children;for(let l=0;l<t.length;l++){let o=t[l].id.split("-")[1],i=parseInt(document.getElementById(`nodeCredits-${o}`).value);x[s[o].semesterIndex]-=s[o].credits,x[s[o].semesterIndex]+=i,s[o].name=document.getElementById(`nodeName-${o}`).value,s[o].credits=i,s[o].color=document.getElementById(`nodeColor-${o}`).value}});function j(e){var t=document.createElement("a");t.style.display="none",t.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(JSON.stringify(e))),t.setAttribute("download","CollegePlan.json"),document.body.appendChild(t),t.click(),document.body.removeChild(t)}function z(e){document.getElementById(`node-${e}`).remove(),s.splice(e,1),h.forEach((l,r)=>{(l[0]==e||l[1]==e)&&h.splice(r,1)})}J.addEventListener("click",()=>{j({nodes:s,connections:h})});A.addEventListener("click",()=>{if(C.style.display="inline",C.value!=""){let e=C.files[0],t=new FileReader;t.onload=function(l){let r=l.target.result,o=JSON.parse(r);s=o.nodes,h=o.connections,x=[0,0,0,0,0,0,0,0,0,0],s.forEach((i,c)=>{let a=T(c,i.name,i.credits,i.color);x[i.semesterIndex]+=i.credits,E.appendChild(a)})},t.readAsText(e)}});C.addEventListener("input",e=>{document.getElementById("fileDirectionText").style.display="inline"});window.requestAnimationFrame(N);
