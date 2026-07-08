/* ============ PROPERTIES (흡수) ============ */
/* 인라인 SVG 아이콘 — docs/style-guide.html 원본 path */
const ICSVG={
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 1 0-5.66-5.66l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.66 0l-2.83 2.83a4 4 0 1 0 5.66 5.66l1.5-1.5"/>',
  pin:'<path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  transit:'<rect x="5" y="3" width="14" height="14" rx="3.5"/><path d="M5 11h14"/><path d="M8.5 20l-1.5 1.5M15.5 20l1.5 1.5"/>',
};
function ic(name,cls){ return `<svg class="ic${cls?' '+cls:''}" viewBox="0 0 24 24" aria-hidden="true">${ICSVG[name]}</svg>`; }
function checklistHTML(p){
  const ch=p.checks||{};
  const done=CHECKLIST.filter(c=>ch[c.id]).length;
  const pct=Math.round(done/CHECKLIST.length*100);
  return `<div class="ck" data-pid="${p.id}">
    <button class="ck-toggle" data-cktoggle="${p.id}">
      <span>✔ 실사 체크</span>
      <span class="bar"><i style="width:${pct}%"></i></span>
      <span class="cnt">${done}/${CHECKLIST.length}</span>
      <span class="arw">▾</span>
    </button>
    <div class="ck-body">
      ${CHECKLIST.map(c=>`<div class="ck-item" data-ck="${p.id}|${c.id}" data-on="${ch[c.id]?1:0}">
        <span class="cb">${CHECK}</span>
        <span class="ct">${c.t}<small>${c.s}</small></span>
        <a class="ck-verify" href="${c.vu(((p.name||'')+' '+(p.loc||'')).trim())}" target="_blank">🔎 ${c.vl}</a>
      </div>`).join('')}
    </div></div>`;
}

function waitLeaflet(cb){ if(typeof L!=='undefined'){cb();} else {setTimeout(()=>waitLeaflet(cb),120);} }
function initOverview(){
  waitLeaflet(()=>{
    if(overview){refreshOverview();return;}
    overview=L.map('overviewMap',{scrollWheelZoom:true}).setView(CENTER,13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(overview);
    refreshOverview();
  });
}
function refreshOverview(){
  if(!overview) return;
  ovMarkers.forEach(m=>overview.removeLayer(m)); ovMarkers=[];
  const pts=[];
  state.properties.filter(p=>p.lat&&p.lng).forEach(p=>{
    const icon=L.divIcon({className:'prop-pin',html:`<span style="background:${HEX[p.status]||'#6B7C93'}"></span>`,iconSize:[20,20],iconAnchor:[10,10]});
    const m=L.marker([p.lat,p.lng],{icon});
    m.bindPopup(`<b>${esc(p.name||'')}</b><br>${esc(p.status)}${p.deposit?' · '+p.deposit+'억':''}${p.area?' · '+p.area+'㎡':''}<br><a href="${naverUrl(p)}" target="_blank">네이버에서 열기 →</a>`);
    m._pid=p.id;
    m.addTo(overview); ovMarkers.push(m); pts.push([p.lat,p.lng]);
  });
  if(pts.length===1) overview.setView(pts[0],15);
  else if(pts.length>1) overview.fitBounds(pts,{padding:[40,40],maxZoom:15});
  setTimeout(()=>overview.invalidateSize(),60);
}
document.getElementById('mapToggle').onclick=()=>{
  const c=document.getElementById('mapcard'); c.classList.toggle('collapsed');
  document.getElementById('mapToggle').textContent=c.classList.contains('collapsed')?'펼치기':'접기';
  if(!c.classList.contains('collapsed')) setTimeout(()=>overview&&overview.invalidateSize(),80);
};
document.getElementById('mapExpand').onclick=()=>{
  const c=document.getElementById('mapcard');
  c.classList.toggle('expanded');
  document.getElementById('mapExpand').textContent=c.classList.contains('expanded')?'작게 보기':'크게 보기';
  setTimeout(()=>overview&&overview.invalidateSize(),300);
};

/* ============ 임장 루트 (client-only, non-persisted) ============ */
let routeMode='off';
let routeSelected=new Set();
let routeStops=[];
let routeLayerGroup=null;

function haversineM(a,b){
  const R=6371000, toRad=d=>d*Math.PI/180;
  const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng);
  const la1=toRad(a.lat), la2=toRad(b.lat);
  const h=Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function walkMinutes(m){ return Math.round(m/1000/4*60); }
function legsForOrder(pts){
  return pts.map((p,i)=>{
    if(i===0) return {property:p,legDistanceM:0,legMinutes:0};
    const d=haversineM(pts[i-1],p);
    return {property:p,legDistanceM:d,legMinutes:walkMinutes(d)};
  });
}
function computeRoute(ids){
  const pts=ids.map(id=>state.properties.find(p=>p.id===id)).filter(p=>p&&p.lat&&p.lng);
  if(pts.length<2) return [];
  const remaining=pts.slice(1); let current=pts[0];
  const order=[current];
  while(remaining.length){
    let bestIdx=0,bestDist=Infinity;
    remaining.forEach((p,i)=>{const d=haversineM(current,p); if(d<bestDist){bestDist=d;bestIdx=i;}});
    current=remaining.splice(bestIdx,1)[0];
    order.push(current);
  }
  return legsForOrder(order);
}
function reorderRoute(fromIdx,toIdx){
  const pts=routeStops.map(s=>s.property);
  const [moved]=pts.splice(fromIdx,1);
  pts.splice(toIdx,0,moved);
  routeStops=legsForOrder(pts);
  renderRouteBar(); waitLeaflet(()=>drawRoute());
}
function clearRouteLayer(){ if(routeLayerGroup&&overview) overview.removeLayer(routeLayerGroup); routeLayerGroup=null; }
function dimRouteStatusMarkers(on){
  const ids=new Set(routeStops.map(s=>s.property.id));
  ovMarkers.forEach(m=>{ const dim=on&&ids.has(m._pid); m.setOpacity(dim?.15:1); });
}
function drawRoute(){
  clearRouteLayer();
  if(!overview||routeStops.length<2) return;
  routeLayerGroup=L.layerGroup().addTo(overview);
  const latlngs=[];
  routeStops.forEach((s,i)=>{
    const p=s.property; latlngs.push([p.lat,p.lng]);
    const icon=L.divIcon({className:'route-pin',html:`<span style="background:${HEX[p.status]||'#6B7C93'}">${i+1}</span>`,iconSize:[24,24],iconAnchor:[12,12]});
    const mk=L.marker([p.lat,p.lng],{icon});
    mk.bindPopup(`<b>${i+1}. ${esc(p.name||'')}</b>`+(i>0?`<br>이전 정류점에서 도보 약 ${s.legMinutes}분 (${Math.round(s.legDistanceM)}m)`:''));
    mk.addTo(routeLayerGroup);
  });
  L.polyline(latlngs,{color:'#4B88CC',weight:3,dashArray:'6 6',opacity:.85}).addTo(routeLayerGroup);
  overview.fitBounds(latlngs,{padding:[50,50],maxZoom:16});
  dimRouteStatusMarkers(true);
}
function renderRouteBar(){
  const bar=document.getElementById('routeBar');
  if(routeMode==='off'){ bar.style.display='none'; bar.innerHTML=''; return; }
  bar.style.display='flex';
  if(routeMode==='select'){
    const n=routeSelected.size;
    bar.innerHTML=`<div class="rb-info">🚶 임장 루트 — <b>${n}곳</b> 선택됨</div>
      <div class="rb-actions">
        <button class="addbtn" id="routeMakeBtn"${n<2?' disabled':''}>루트 만들기</button>
        <button class="btn-ghost" id="routeCancelBtn">취소</button>
      </div>`;
    document.getElementById('routeMakeBtn').onclick=makeRoute;
    document.getElementById('routeCancelBtn').onclick=exitRouteMode;
    return;
  }
  const totalMin=routeStops.reduce((s,x)=>s+x.legMinutes,0);
  const totalM=routeStops.reduce((s,x)=>s+x.legDistanceM,0);
  const rows=routeStops.map((s,i)=>
    (i>0?`<div class="rb-leg-row">→ 도보 약 ${s.legMinutes}분(${Math.round(s.legDistanceM)}m) →</div>`:'')
    +`<div class="rb-stop" data-idx="${i}"><span class="rb-drag">⠿</span><span class="rb-num">${i+1}</span><span class="rb-name">${esc(s.property.name||'(이름 없음)')}</span></div>`
  ).join('');
  bar.innerHTML=`<div class="rb-route">
      <div class="rb-route-list" id="rbRouteList">${rows}</div>
      <div class="rb-route-total">총 도보 약 ${totalMin}분 · ${(totalM/1000).toFixed(1)}km · ${routeStops.length}곳 (직선거리 추정, 드래그로 순서 변경 가능)</div>
    </div>
    <div class="rb-actions">
      <button class="btn-ghost" id="routeSaveBtn">💾 저장</button>
      <button class="btn-ghost" id="routeRefreshBtn">🔄 새로고침</button>
      <button class="btn-ghost" id="routeReselectBtn">다시 선택</button>
      <button class="btn-ghost" id="routeCloseBtn">닫기</button>
    </div>`;
  document.getElementById('routeSaveBtn').onclick=saveCurrentRoute;
  document.getElementById('routeRefreshBtn').onclick=refreshRoute;
  document.getElementById('routeReselectBtn').onclick=()=>enterRouteSelectMode(true);
  document.getElementById('routeCloseBtn').onclick=exitRouteMode;
  bindRouteDrag();
}
function bindRouteDrag(){
  document.querySelectorAll('#rbRouteList .rb-stop').forEach(row=>{
    const handle=row.querySelector('.rb-drag');
    handle.onpointerdown=(e)=>{
      e.preventDefault();
      const fromIdx=+row.dataset.idx;
      row.classList.add('dragging');
      const onMove=(ev)=>{
        const el=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.rb-stop');
        document.querySelectorAll('#rbRouteList .rb-stop').forEach(r=>r.classList.remove('drop-target'));
        if(el && el!==row) el.classList.add('drop-target');
      };
      const onUp=(ev)=>{
        const el=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.rb-stop');
        document.removeEventListener('pointermove',onMove);
        document.removeEventListener('pointerup',onUp);
        if(el){
          const toIdx=+el.dataset.idx;
          if(toIdx!==fromIdx){ reorderRoute(fromIdx,toIdx); return; }
        }
        document.querySelectorAll('#rbRouteList .rb-stop').forEach(r=>r.classList.remove('dragging','drop-target'));
      };
      document.addEventListener('pointermove',onMove);
      document.addEventListener('pointerup',onUp);
    };
  });
}
function enterRouteSelectMode(preserveSelection){
  if(!preserveSelection) routeSelected=new Set();
  routeMode='select'; clearRouteLayer(); dimRouteStatusMarkers(false);
  renderList(); renderRouteBar();
}
function exitRouteMode(){
  routeMode='off'; routeSelected=new Set(); routeStops=[];
  clearRouteLayer(); renderList(); renderRouteBar(); refreshOverview();
}
function expandMapCard(){
  document.getElementById('mapcard').classList.remove('collapsed');
  document.getElementById('mapToggle').textContent='접기';
}
function makeRoute(){
  if(routeSelected.size<2) return;
  routeStops=computeRoute([...routeSelected]);
  if(routeStops.length<2){ alert('좌표가 저장된 매물이 2곳 이상 필요해요.'); return; }
  routeMode='result';
  expandMapCard();
  renderList(); renderRouteBar(); waitLeaflet(()=>drawRoute());
}
function refreshRoute(){
  const pts=routeStops.map(s=>s.property.id).map(id=>state.properties.find(p=>p.id===id)).filter(p=>p&&p.lat&&p.lng);
  routeSelected=new Set(pts.map(p=>p.id));
  if(pts.length<2){
    alert('선택된 매물이 삭제되었거나 부족해 루트를 유지할 수 없어요. 다시 선택해주세요.');
    enterRouteSelectMode(true);
    return;
  }
  routeStops=legsForOrder(pts);
  renderRouteBar(); waitLeaflet(()=>drawRoute());
}
function saveCurrentRoute(){
  const name=(prompt('루트 이름을 입력하세요 (예: 강남권 · 7월말)')||'').trim();
  if(!name) return;
  state.savedRoutes=state.savedRoutes||[];
  state.savedRoutes.push({id:'route'+Date.now(),name,propertyIds:routeStops.map(s=>s.property.id),createdAt:Date.now()});
  save();
  alert(`"${name}" 루트를 저장했어요.`);
}
function loadSavedRoute(id){
  const r=(state.savedRoutes||[]).find(x=>x.id===id);
  if(!r) return;
  const pts=r.propertyIds.map(pid=>state.properties.find(p=>p.id===pid)).filter(p=>p&&p.lat&&p.lng);
  if(pts.length<2){ alert('저장된 매물이 삭제되었거나 좌표가 없어 루트를 불러올 수 없어요.'); return; }
  routeSelected=new Set(pts.map(p=>p.id));
  routeStops=legsForOrder(pts);
  routeMode='result';
  expandMapCard();
  renderList(); renderRouteBar(); waitLeaflet(()=>drawRoute());
}
let _routeMenu=null;
function closeRouteMenu(){ if(_routeMenu){ _routeMenu.remove(); _routeMenu=null; } }
function showRouteMenu(btn){
  if(_routeMenu){ closeRouteMenu(); return; }
  const saved=state.savedRoutes||[];
  const menu=document.createElement('div');
  menu.className='status-picker route-menu';
  menu.innerHTML=`<button class="sp-opt" data-newroute="1">+ 새 루트 만들기</button>`
    +(saved.length?`<div class="rm-sep"></div>`:'')
    +saved.map(r=>`<div class="rm-item">
        <button class="sp-opt" data-loadroute="${r.id}">${esc(r.name)} <small>(${r.propertyIds.length}곳)</small></button>
        <button class="rm-del" data-delroute="${r.id}" title="삭제">✕</button>
      </div>`).join('');
  document.body.appendChild(menu);
  _routeMenu=menu;
  const rect=btn.getBoundingClientRect();
  const top=rect.bottom+window.scrollY+4;
  const left=Math.min(rect.left+window.scrollX, window.innerWidth-240);
  menu.style.top=top+'px'; menu.style.left=Math.max(8,left)+'px';
  menu.querySelector('[data-newroute]').onclick=e=>{ e.stopPropagation(); closeRouteMenu(); enterRouteSelectMode(false); };
  menu.querySelectorAll('[data-loadroute]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); closeRouteMenu(); loadSavedRoute(b.dataset.loadroute); });
  menu.querySelectorAll('[data-delroute]').forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    if(!confirm('이 저장된 루트를 삭제할까요?')) return;
    state.savedRoutes=state.savedRoutes.filter(r=>r.id!==b.dataset.delroute);
    save(); closeRouteMenu(); showRouteMenu(btn);
  });
  const close=ev=>{ if(!menu.contains(ev.target)){ closeRouteMenu(); document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
}
document.getElementById('propRouteBtn').onclick=(e)=>{
  if(routeMode!=='off'){ exitRouteMode(); return; }
  if(!(state.savedRoutes&&state.savedRoutes.length)){ enterRouteSelectMode(false); return; }
  showRouteMenu(e.currentTarget);
};
document.getElementById('list').addEventListener('change', e=>{
  const rc=e.target.closest('[data-routecheck]'); if(!rc) return;
  rc.checked ? routeSelected.add(rc.dataset.routecheck) : routeSelected.delete(rc.dataset.routecheck);
  renderRouteBar();
});

async function geocode(q){
  try{
    const res=await fetch('/api/geocode?'+new URLSearchParams({q}),{headers:authHeaders()});
    const j=await res.json();
    if(j.ok) return {lat:j.lat,lng:j.lng,found:true};
  }catch(e){}
  try{
    const res=await fetch('https://nominatim.openstreetmap.org/search?'+new URLSearchParams({q:q+' 서울',format:'json',limit:'1',countrycodes:'kr'}),{headers:{'Accept-Language':'ko'}});
    const arr=await res.json();
    if(arr.length) return {lat:parseFloat(arr[0].lat),lng:parseFloat(arr[0].lon),found:true};
  }catch(e){}
  return {found:false};
}
async function autoGeocode(){
  const noCoord=state.properties.filter(p=>!p.lat&&(p.name||p.loc));
  if(!noCoord.length) return;
  for(const p of noCoord){
    const q=((p.name||'')+' '+(p.loc||'')).trim();
    try{
      const j=await geocode(q);
      if(j.found){ p.lat=j.lat; p.lng=j.lng; }
    }catch(e){ break; }
  }
  if(noCoord.some(p=>p.lat)) { save(); refreshOverview(); }
}

function initFormMap(){
  waitLeaflet(()=>{
    if(formMapObj){setTimeout(()=>formMapObj.invalidateSize(),60);return;}
    formMapObj=L.map('formMap').setView(CENTER,13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OSM'}).addTo(formMapObj);
    formMapObj.on('click',e=>setFormPin(e.latlng.lat,e.latlng.lng,true));
    setTimeout(()=>formMapObj.invalidateSize(),60);
  });
}
function setFormPin(lat,lng,recenter){
  tempLatLng={lat,lng};
  waitLeaflet(()=>{
    if(!formMapObj) return;
    if(formMarker) formMarker.setLatLng([lat,lng]);
    else formMarker=L.marker([lat,lng],{draggable:true}).addTo(formMapObj).on('dragend',ev=>{const p=ev.target.getLatLng();tempLatLng={lat:p.lat,lng:p.lng};});
    if(recenter) formMapObj.setView([lat,lng],16);
  });
}
function clearFormPin(){ if(formMarker&&formMapObj){formMapObj.removeLayer(formMarker);} formMarker=null; tempLatLng=null; }

let aiAvailable=null;
async function claudeAPI(messages,tools,system){
  if(aiAvailable===false) throw new Error('AI_UNAVAILABLE');
  const body={model:"claude-haiku-4-5-20251001",max_tokens:1000,messages};
  if(tools) body.tools=tools;
  if(system) body.system=system;
  const res=await fetch("/api/messages",{method:"POST",headers:authHeaders(),body:JSON.stringify(body)});
  const data=await res.json();
  if(data.error){
    if(data.error.message && data.error.message.includes('credit balance')){
      aiAvailable=false; updateAiButtons();
      throw new Error('AI_UNAVAILABLE');
    }
    throw new Error(data.error.message||data.error);
  }
  return (data.content||[]).filter(i=>i.type==="text").map(i=>i.text).join("\n");
}
function aiUnavailableMsg(){ return 'AI 크레딧 충전 필요 → console.anthropic.com'; }
function updateAiButtons(){
  if(aiAvailable===false){
    const s=document.getElementById('chatApiStatus');
    if(s){s.className='ai-status warn';s.textContent='⚠️ AI 기능은 크레딧 충전이 필요해요. → console.anthropic.com';}
  }
}
function parseNaver(t){
  const r={};
  const firstLine=(t.trim().split('\n')[0]||'').trim();
  if(firstLine && firstLine.length<=40) r.name=firstLine;
  let d=t.match(/전세가[\s\S]{0,15}?(\d+)\s*억\s*([\d,]+)\s*만/)||t.match(/전세가[\s\S]{0,15}?(\d+)\s*억/)||t.match(/(\d+)\s*억\s*([\d,]+)\s*만/)||t.match(/(\d+)\s*억/);
  if(d){const e=parseInt(d[1]||'0',10);const m=d[2]?parseInt(d[2].replace(/,/g,''),10):0;r.deposit=+(e+m/10000).toFixed(2);}
  else{const m=t.match(/([\d,]+)\s*만\s*원/);if(m)r.deposit=+(parseInt(m[1].replace(/,/g,''),10)/10000).toFixed(2);}
  const a=t.match(/전용면적[^\d]*([\d.]+)\s*㎡/)||t.match(/전용\s*([\d.]+)/);
  if(a)r.area=parseFloat(a[1]);
  const loc=t.match(/서울[특별시]*\s*([가-힣]+구)\s*([가-힣]+동)/);
  if(loc)r.loc=loc[1]+' '+loc[2];
  const bits=[];
  const sed=t.match(/([\d,]+)\s*세대/); const sedN=sed?parseInt(sed[1].replace(/,/g,''),10):null; if(sed)bits.push(sedN+'세대');
  const hy=t.match(/(복도식|계단식|복도혼합|타워형)/); if(hy)bits.push(hy[1]);
  const nan=t.match(/(중앙난방|지역난방|개별난방)/); if(nan)bits.push(nan[1]);
  const pk=t.match(/세대당\s*([\d.]+)\s*대/); if(pk)bits.push('주차 '+pk[1]+'대/세대');
  const yr=t.match(/\((\d+)년차\)/); if(yr)bits.push(yr[1]+'년차');
  const mg=t.match(/관리비[\s\S]{0,6}?([\d,]+)\s*만원/); if(mg)bits.push('관리비 '+mg[1]+'만');
  const mv=t.match(/입주가능일[\s\S]{0,15}?(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/); if(mv)bits.push('입주 '+mv[1].replace(/\s+/g,''));
  const ln=t.match(/융자금[\s\S]{0,6}?(없음|있음)/); if(ln)bits.push('융자 '+ln[1]);
  if(bits.length)r.memo=bits.join(' · ');
  r._auto={};
  if(sedN!=null&&sedN>=500) r._auto.k4=true;
  if(hy) r._auto.k5=true;
  if(nan) r._auto.k6=true;
  if(pk) r._auto.k8=true;
  return r;
}
function applyFill(j){
  if(j.name) document.getElementById('f_name').value=j.name;
  if(j.loc) document.getElementById('f_loc').value=j.loc;
  if(j.deposit!=null&&j.deposit!=='') document.getElementById('f_deposit').value=j.deposit;
  if(j.area!=null&&j.area!=='') document.getElementById('f_area').value=j.area;
  if(j.memo) document.getElementById('f_memo').value=j.memo;
  if(j._auto) tempChecks=Object.assign(tempChecks||{},j._auto);
}
document.getElementById('fillBtn').onclick=async()=>{
  const txt=document.getElementById('pasteBox').value.trim();
  if(!txt){document.getElementById('pasteBox').focus();return;}
  const btn=document.getElementById('fillBtn'); const old=btn.textContent;
  const j=parseNaver(txt);
  const got=(j.name||j.deposit!=null||j.area!=null);
  if(got){
    applyFill(j);
    const auto=Object.keys(j._auto||{}).length;
    btn.textContent='✓ 채웠어요'+(auto?` (체크 ${auto}개 자동확인)`:'');
    setTimeout(()=>{btn.textContent=old;},2000);
    return;
  }
  btn.disabled=true; btn.textContent='읽는 중…';
  try{
    const out=await claudeAPI([{role:"user",content:
      `다음 한국 부동산(전세) 매물 글에서 핵심만 JSON으로. 설명·마크다운 금지.\n`+
      `형식:{"name":"단지명","loc":"구·동/역","deposit":보증금억숫자,"area":전용면적㎡숫자,"memo":"한줄"}\n`+
      `보증금 '2억7천'→2.7. 모르면 null.\n\n${txt}`}]);
    const aj=parseJSON(out);
    if(aj){ applyFill(aj); btn.textContent='✓ 채웠어요'; }
    else { btn.textContent='못 읽었어요 — 직접 입력'; }
  }catch(e){ btn.textContent='못 읽었어요 — 직접 입력'; }
  setTimeout(()=>{btn.disabled=false;btn.textContent=old;},2000);
};

document.getElementById('findBtn').onclick=async()=>{
  const q=(document.getElementById('f_name').value+' '+document.getElementById('f_loc').value).trim();
  if(!q){document.getElementById('f_name').focus();return;}
  const btn=document.getElementById('findBtn'); btn.disabled=true; const old=btn.textContent; btn.textContent='찾는 중…';
  try{
    const j=await geocode(q);
    if(j.found){ setFormPin(j.lat,j.lng,true); btn.textContent='✓ 찾았어요'; }
    else { btn.textContent='못 찾음 — 지도 탭'; }
  }catch(e){ btn.textContent='검색 실패 — 지도 직접 탭'; }
  setTimeout(()=>{btn.disabled=false;btn.textContent=old;},1600);
};

function renderStats(){const p=state.properties;document.getElementById('stats').innerHTML=
  `총 <b>${p.length}</b>곳 · 후보 <b>${p.filter(x=>x.status==='후보').length}</b> · 방문예정 <b>${p.filter(x=>x.status==='방문예정').length}</b>`;}
function renderTabs(){
  const tabs=['전체','관심','검토중','문의예정','방문예정','후보','보류','탈락'];
  const cnt={전체:state.properties.length}; tabs.slice(1).forEach(s=>cnt[s]=state.properties.filter(p=>p.status===s).length);
  document.getElementById('tabs').innerHTML=tabs.map(t=>`<button class="tab" data-on="${activeTab===t?1:0}" data-tab="${t}">${t}<span class="ct tnum">${cnt[t]}</span></button>`).join('');
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{activeTab=b.dataset.tab;renderList();renderTabs();});
}
function areaChip(a){if(a==null||a==='')return'';const n=parseFloat(a);if(isNaN(n))return'';return n<=85?`<span class="chip ok tnum">전용 ${n}㎡ · 청약 OK</span>`:`<span class="chip warn tnum">전용 ${n}㎡ · 청약 영향 ⚠</span>`;}
function depositChip(d){if(d==null||d==='')return'';const n=parseFloat(d);if(isNaN(n))return'';return `<span class="chip deposit tnum">보증금 ${n}억${n>5?' · 예산↑?':''}</span>`;}
let propSearchQuery='';
function renderList(){
  let items=[...state.properties];
  if(activeTab!=='전체') items=items.filter(p=>p.status===activeTab);
  if(propGradeFilter) items=items.filter(p=>p.householdGrade===propGradeFilter);
  if(propLineFilter) items=items.filter(p=>p.line===propLineFilter);
  const pq=(document.getElementById('prop_search')?.value||'').trim().toLowerCase();
  if(pq) items=items.filter(p=>(p.name||'').toLowerCase().includes(pq)||(p.loc||'').toLowerCase().includes(pq)||(p.memo||'').toLowerCase().includes(pq));
  if(sortMode==='jeonse') items.sort((a,b)=>(a.jeonseReal??a.depositNum??999)-(b.jeonseReal??b.depositNum??999));
  else if(sortMode==='households') items.sort((a,b)=>(b.households??0)-(a.households??0));
  else if(sortMode==='ratio') items.sort((a,b)=>(a.jeonseRatio??999)-(b.jeonseRatio??999));
  else items.sort((a,b)=>(ORDER[a.status]-ORDER[b.status])||(b.created-a.created));
  const el=document.getElementById('list');
  if(!items.length){el.innerHTML=`<div class="empty"><div class="big">${activeTab==='전체'?'아직 등록된 매물이 없어요':'이 상태의 매물이 없어요'}</div>${activeTab==='전체'?'＋ 매물 추가로 첫 후보를 올려보세요.':'다른 탭을 눌러보세요.'}</div>`;return;}
  el.innerHTML=items.map(p=>{
    const depDisplay=p.depositNum!=null?`<span class="chip deposit tnum">보증금 ${p.depositNum}억${p.depositNum>5?' · 예산↑?':''}</span>`:depositChip(p.deposit);
    const urlSafe=p.url?safeUrl(p.url):'';
    const routeCheckHTML = routeMode!=='select' ? '' :
      (p.lat&&p.lng
        ? `<label class="c-routecheck-wrap"><input type="checkbox" class="c-routecheck" data-routecheck="${p.id}"${routeSelected.has(p.id)?' checked':''}></label>`
        : `<span class="c-routecheck-disabled" title="좌표가 없어 루트에 포함할 수 없어요">${ic('pin','ic-muted')} 위치없음</span>`);
    return `<div class="card ${(p.status==='탈락'||p.status==='보류')?'dim':''}" data-st="${p.status}">
    <div class="c-top">
      <div class="c-top-left">
        ${routeCheckHTML}
        <div>
          <div class="c-name">${esc(p.name||'(이름 없음)')}</div>
          ${(p.station||p.loc)?`<div class="c-loc">${ic('transit','ic-muted')} ${esc(p.station||p.loc)}${p.line?` <span class="c-line">${esc(p.line)}</span>`:''}</div>`:''}
        </div>
      </div>
      <span class="pill" style="border-left-color:var(${SC[p.status]})"><i class="pill-dot" style="background:var(${SC[p.status]})"></i>${p.status}</span>
    </div>
    <div class="c-meta">
      ${depDisplay}${areaChip(p.area)}
      ${p.householdGrade?`<span class="chip">${esc(p.householdGrade)}</span>`:(p.households?`<span class="chip tnum">${p.households}세대</span>`:'')}
      ${p.jeonseRatio!=null?`<span class="chip tnum">전세가율 ${p.jeonseRatio}%</span>`:''}
      ${p.commuteGangnam?`<span class="chip tnum">강남 ${esc(p.commuteGangnam)}</span>`:''}
      ${p.commuteSinsa?`<span class="chip tnum">신사 ${esc(p.commuteSinsa)}</span>`:''}
      ${p.aiScore!=null?`<span class="chip score">AI ${p.aiScore}점</span>`:''}
      ${p.geocodePending&&!p.lat?'<span class="chip chip-warn">좌표확인필요</span>':''}
      ${p.lat?`<span class="chip geo">${ic('pin','ic-muted')} 위치 저장됨</span>`:''}
    </div>
    ${p.img?`<img src="${p.img}" class="card-img-thumb" loading="lazy">`:''}
    ${p.memo?`<div class="c-memo">${esc(p.memo)}</div>`:''}
    <div class="c-actions">
      ${p.lat?`<button data-locate="${p.id}">${ic('map')} 지도에서 보기</button>`:''}
      ${urlSafe?`<a class="naver" href="${esc(urlSafe)}" target="_blank" rel="noopener">${ic('link')} 네이버 열기 ↗</a>`:''}
      <a class="naver" href="${naverUrl(p)}" target="_blank">${ic('map')} 네이버지도</a>
      <a class="hogang" href="${siteUrl('hogang',p.name)}" target="_blank">호갱노노</a>
      <a class="rt" href="${siteUrl('rt',p.name)}" target="_blank">실거래가</a>
      <button data-edit="${p.id}">수정</button><button data-del="${p.id}">삭제</button>
    </div>
    ${aiBlock(p)}${checklistHTML(p)}</div>`;
  }).join('');
  el.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openEdit(b.dataset.edit));
  el.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>delProp(b.dataset.del));
  el.querySelectorAll('[data-locate]').forEach(b=>b.onclick=()=>locate(b.dataset.locate));
}
function aiBlock(p){
  if(p._aiLoading) return `<div class="aiload">AI가 분석 중…</div>`;
  if(!p.aiReport && !p.aiComment) return '';
  let h='<div class="airep"><div class="arh">AI 분석</div>';
  if(p.aiReport){ h+=`<div>${esc(p.aiReport.summary||'')}</div>`; if(p.aiReport.risk) h+=`<div class="risk">⚠ ${esc(p.aiReport.risk)}</div>`; }
  if(p.aiComment) h+=`<div class="cmt">“${esc(p.aiComment)}”</div>`;
  return h+'</div>';
}
async function aiAnalyze(id){
  const p=state.properties.find(x=>x.id===id); if(!p)return;
  p._aiLoading=true; renderList();
  try{
    const out=await claudeAPI([{role:"user",content:
      `우리 부부 전세 매물을 분석해줘. 설명·마크다운 금지, JSON만.\n`+
      `형식:{"score":0~100정수,"summary":"우리 조건 대비 장단점·적합도 3~4문장","risk":"재건축·이주 등 핵심 리스크 한 줄(없으면 빈 문자열)"}\n`+
      `[우리 조건] ${profileLine()}\n`+
      `[매물] 이름:${p.name||'?'} / 위치:${p.loc||'?'} / 보증금:${p.deposit||'?'}억 / 전용:${p.area||'?'}㎡ / 메모:${p.memo||'없음'}\n`+
      `시세·평판·재건축 단계는 web_search로 확인.`}],
      [{type:"web_search_20250305",name:"web_search"}]);
    const j=parseJSON(out);
    if(j){ p.aiReport={summary:j.summary||'',risk:j.risk||''}; if(j.score!=null) p.aiScore=Math.max(0,Math.min(100,Math.round(j.score))); }
    else { p.aiReport={summary:'분석 결과를 읽지 못했어요. 다시 시도해 주세요.',risk:''}; }
  }catch(e){ p.aiReport={summary:e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 응답을 받지 못했어요.',risk:''}; }
  p._aiLoading=false; save(); renderList();
}
function locate(id){
  const p=state.properties.find(x=>x.id===id); if(!p||!p.lat)return;
  document.getElementById('mapcard').classList.remove('collapsed');
  document.getElementById('mapToggle').textContent='접기';
  waitLeaflet(()=>{overview.setView([p.lat,p.lng],16);overview.invalidateSize();
    const m=ovMarkers.find(mk=>{const ll=mk.getLatLng();return ll.lat===p.lat&&ll.lng===p.lng;}); if(m)m.openPopup();});
  document.getElementById('mapcard').scrollIntoView({behavior:'smooth',block:'center'});
}

const form=document.getElementById('form');
let propImgData=null;
function clearForm(){
  ['editId','f_name','f_loc','f_station','f_line','f_deposit','f_area','f_households','f_url','f_memo','pasteBox'].forEach(id=>document.getElementById(id).value='');
  tempChecks=null;clearFormPin();
  propImgData=null;
  document.getElementById('f_img').value='';
  document.getElementById('f_imgLabel').textContent='📷 사진 추가';
  document.getElementById('f_imgPreview').style.display='none';
  document.getElementById('f_imgClear').style.display='none';
}
function openForm(){form.classList.add('open');initFormMap();document.getElementById('f_name').focus();}
function closeForm(){form.classList.remove('open');clearForm();}
document.getElementById('toggleForm').onclick=()=>{ if(form.classList.contains('open'))closeForm(); else {clearForm();openForm();} };
document.getElementById('cancelBtn').onclick=closeForm;

let propEditId='', editMapObj=null, editMapMarker=null, editTempLatLng=null, editImgData=null;
function initEditMap(){
  const el=document.getElementById('propEditMap'); if(!el)return;
  if(editMapObj){editMapObj.invalidateSize();return;}
  editMapObj=L.map('propEditMap',{zoomControl:true}).setView([37.5665,126.9780],12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(editMapObj);
  editMapObj.on('click',e=>{
    editTempLatLng={lat:e.latlng.lat,lng:e.latlng.lng};
    if(editMapMarker) editMapObj.removeLayer(editMapMarker);
    editMapMarker=L.marker([e.latlng.lat,e.latlng.lng]).addTo(editMapObj);
  });
}
function openEdit(id){
  const p=state.properties.find(x=>x.id===id); if(!p)return;
  propEditId=id; editTempLatLng=null; editImgData=null;
  document.getElementById('propEditTitle').textContent=p.name?p.name+' 수정':'매물 수정';
  ['em_name','em_loc','em_station','em_line','em_deposit','em_area','em_households','em_url','em_memo'].forEach(k=>{
    const field=k.replace('em_','');
    document.getElementById(k).value=p[field]??'';
  });
  const prev=document.getElementById('em_imgPreview'), clr=document.getElementById('em_imgClear');
  if(p.img){prev.src=p.img;prev.style.display='';clr.style.display='';}
  else{prev.style.display='none';clr.style.display='none';}
  document.getElementById('em_imgLabel').textContent=p.img?'📷 사진 변경':'📷 사진 추가';
  document.getElementById('em_img').value='';
  openModal('propEditModal');
  setTimeout(()=>{
    initEditMap(); editMapObj.invalidateSize();
    if(p.lat&&p.lng){
      editMapObj.setView([p.lat,p.lng],15);
      if(editMapMarker) editMapObj.removeLayer(editMapMarker);
      editMapMarker=L.marker([p.lat,p.lng]).addTo(editMapObj);
    }
  },120);
}
document.getElementById('em_findBtn').onclick=async function(){
  const name=(document.getElementById('em_name').value+' '+document.getElementById('em_loc').value).trim();
  if(!name)return;
  this.disabled=true; this.textContent='찾는 중…';
  try{
    const r=await fetch('/api/geocode?q='+encodeURIComponent(name),{headers:authHeaders()});
    const d=await r.json();
    if(d.lat){
      editTempLatLng={lat:d.lat,lng:d.lng};
      initEditMap(); editMapObj.invalidateSize();
      editMapObj.setView([d.lat,d.lng],15);
      if(editMapMarker) editMapObj.removeLayer(editMapMarker);
      editMapMarker=L.marker([d.lat,d.lng]).addTo(editMapObj);
    }
  }catch(e){}
  this.disabled=false; this.textContent='📍 위치 자동 찾기';
};
document.getElementById('em_img').onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  compressImage(f,dataUrl=>{
    editImgData=dataUrl;
    const prev=document.getElementById('em_imgPreview');
    prev.src=dataUrl; prev.style.display='';
    document.getElementById('em_imgLabel').textContent='📷 '+f.name;
    document.getElementById('em_imgClear').style.display='';
  });
};
document.getElementById('em_imgClear').onclick=()=>{
  editImgData=''; document.getElementById('em_img').value='';
  document.getElementById('em_imgPreview').style.display='none';
  document.getElementById('em_imgLabel').textContent='📷 사진 추가';
  document.getElementById('em_imgClear').style.display='none';
};
document.getElementById('em_saveBtn').onclick=()=>{
  const name=document.getElementById('em_name').value.trim();
  if(!name){const f=document.getElementById('em_name');f.focus();f.style.borderColor='var(--s-drop)';return;}
  const p=state.properties.find(x=>x.id===propEditId); if(!p)return;
  Object.assign(p,{
    name, loc:document.getElementById('em_loc').value.trim(),
    station:document.getElementById('em_station').value.trim(),
    line:document.getElementById('em_line').value.trim(),
    deposit:document.getElementById('em_deposit').value,
    area:document.getElementById('em_area').value,
    households:document.getElementById('em_households').value,
    url:safeUrl(document.getElementById('em_url').value.trim()),
    memo:document.getElementById('em_memo').value.trim(),
    img:editImgData===null?(p.img||''):(editImgData||''),
    lat:editTempLatLng?editTempLatLng.lat:p.lat,
    lng:editTempLatLng?editTempLatLng.lng:p.lng,
  });
  closeModal('propEditModal'); save(); renderProps(); refreshOverview();
};
document.getElementById('em_cancelBtn').onclick=()=>closeModal('propEditModal');
document.getElementById('f_mdToolbar').onclick=e=>{
  const btn=e.target.closest('[data-fmtgt]');if(!btn)return;
  const ta=document.getElementById('f_memo');
  if(btn.dataset.fmtgt==='wrap'){mdWrap(ta,btn.dataset.open,btn.dataset.close);}
  else if(btn.dataset.fmtgt==='line'){mdLine(ta,btn.dataset.prefix);}
};
document.getElementById('f_memo').addEventListener('keydown',e=>{
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();mdWrap(e.target,'**','**');}
  if(mod&&e.key==='i'){e.preventDefault();mdWrap(e.target,'*','*');}
});
document.getElementById('em_mdToolbar').onclick=e=>{
  const btn=e.target.closest('[data-emtgt]');if(!btn)return;
  const ta=document.getElementById('em_memo');
  if(btn.dataset.emtgt==='wrap'){mdWrap(ta,btn.dataset.open,btn.dataset.close);}
  else if(btn.dataset.emtgt==='line'){mdLine(ta,btn.dataset.prefix);}
};
document.getElementById('em_memo').addEventListener('keydown',e=>{
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();mdWrap(e.target,'**','**');}
  if(mod&&e.key==='i'){e.preventDefault();mdWrap(e.target,'*','*');}
});
document.getElementById('f_img').onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  compressImage(f,dataUrl=>{
    propImgData=dataUrl;
    const prev=document.getElementById('f_imgPreview');
    prev.src=dataUrl; prev.style.display='';
    document.getElementById('f_imgLabel').textContent='📷 '+f.name;
    document.getElementById('f_imgClear').style.display='';
  });
};
document.getElementById('f_imgClear').onclick=()=>{
  propImgData='';
  document.getElementById('f_img').value='';
  document.getElementById('f_imgPreview').style.display='none';
  document.getElementById('f_imgLabel').textContent='📷 사진 추가';
  document.getElementById('f_imgClear').style.display='none';
};
document.getElementById('saveBtn').onclick=()=>{
  const name=document.getElementById('f_name').value.trim();
  if(!name){const f=document.getElementById('f_name');f.focus();f.style.borderColor='var(--s-drop)';return;}
  const cur=document.getElementById('editId').value;
  const existing=cur?state.properties.find(x=>x.id===cur):null;
  const data={
    name, loc:document.getElementById('f_loc').value.trim(),
    station:document.getElementById('f_station').value.trim(),
    line:document.getElementById('f_line').value.trim(),
    deposit:document.getElementById('f_deposit').value, area:document.getElementById('f_area').value,
    households:document.getElementById('f_households').value,
    url:safeUrl(document.getElementById('f_url').value.trim()),
    memo:document.getElementById('f_memo').value.trim(),
    img:propImgData===null?((existing&&existing.img)||''):(propImgData||''),
    status:existing?existing.status:'관심',
    lat:tempLatLng?tempLatLng.lat:(existing?existing.lat:null),
    lng:tempLatLng?tempLatLng.lng:(existing?existing.lng:null),
    checks:Object.assign({}, existing?existing.checks:{}, tempChecks||{}),
  };
  if(existing) Object.assign(existing,data);
  else state.properties.push({id:'m'+Date.now(),created:Date.now(),...data});
  closeForm(); save(); renderProps(); refreshOverview();
};
function delProp(id){if(!confirm('이 매물을 삭제할까요?'))return;state.properties=state.properties.filter(x=>x.id!==id);save();renderProps();refreshOverview();}

document.getElementById('list').addEventListener('click',e=>{
  const tog=e.target.closest('[data-cktoggle]');
  if(tog){ tog.closest('.ck').classList.toggle('open'); return; }
  const item=e.target.closest('.ck-item');
  if(item){
    if(e.target.closest('a')) return;
    const [pid,cid]=item.dataset.ck.split('|');
    const p=state.properties.find(x=>x.id===pid); if(!p)return;
    p.checks=p.checks||{}; p.checks[cid]=!p.checks[cid];
    item.dataset.on=p.checks[cid]?'1':'0';
    const ck=item.closest('.ck');
    const done=CHECKLIST.filter(c=>p.checks[c.id]).length;
    ck.querySelector('.cnt').textContent=done+'/'+CHECKLIST.length;
    ck.querySelector('.bar i').style.width=Math.round(done/CHECKLIST.length*100)+'%';
    save(); return;
  }
  const pill=e.target.closest('.pill'); if(!pill)return;
  const card=pill.closest('.card');
  const p=state.properties.find(x=>x.id===card.querySelector('[data-edit]').dataset.edit); if(!p)return;
  showStatusPicker(pill, p);
});

let _statusPicker=null;
function showStatusPicker(pill, p){
  if(_statusPicker){ _statusPicker.remove(); _statusPicker=null; }
  const opts=['관심','검토중','문의예정','방문예정','후보','보류','탈락'];
  const picker=document.createElement('div');
  picker.className='status-picker';
  picker.innerHTML=opts.map(s=>`<button class="sp-opt${p.status===s?' on':''}" data-sp="${esc(s)}" style="border-left:3px solid var(${SC[s]||'--hairline'})">${esc(s)}</button>`).join('');
  document.body.appendChild(picker);
  _statusPicker=picker;
  const rect=pill.getBoundingClientRect();
  const top=rect.bottom+window.scrollY+4;
  const left=Math.min(rect.left+window.scrollX, window.innerWidth-130);
  picker.style.top=top+'px'; picker.style.left=Math.max(8,left)+'px';
  picker.querySelectorAll('[data-sp]').forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    p.status=b.dataset.sp; picker.remove(); _statusPicker=null;
    save(); renderProps(); refreshOverview();
  });
  const close=ev=>{ if(!picker.contains(ev.target)){ picker.remove(); _statusPicker=null; document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
}
function runSiteSearch(site){
  const q=document.getElementById('siteSearch').value.trim();
  if(!q){document.getElementById('siteSearch').focus();return;}
  window.open(siteUrl(site,q),'_blank');
}
document.querySelectorAll('.searchbar .site').forEach(b=>b.onclick=()=>runSiteSearch(b.dataset.site));
document.getElementById('siteSearch').addEventListener('keydown',e=>{ if(e.key==='Enter') runSiteSearch('land'); });

function renderPrep(){
  document.getElementById('prep').innerHTML=state.prep.map(t=>`<div class="task" data-done="${t.done?1:0}" data-id="${t.id}"><div class="box">${CHECK}</div><div class="tx">${esc(t.tx)}${t.sub?`<small>${esc(t.sub)}</small>`:''}</div></div>`).join('');
  document.querySelectorAll('#prep .task').forEach(el=>el.onclick=()=>{const t=state.prep.find(x=>x.id===el.dataset.id);t.done=!t.done;save();renderPrep();});
}
function renderSteps(){
  document.getElementById('steps').innerHTML=state.steps.map((s,i)=>`<div class="step" data-done="${s.done?1:0}" data-id="${s.id}"><div class="num tnum">${s.done?'✓':i+1}</div><div class="stx">${esc(s.tx)}${s.sub?`<small>${esc(s.sub)}</small>`:''}</div></div>`).join('');
  document.querySelectorAll('#steps .step').forEach(el=>el.onclick=()=>{const s=state.steps.find(x=>x.id===el.dataset.id);s.done=!s.done;save();renderSteps();});
}
function renderLineFilter(){
  const sel=document.getElementById('propLineFilter'); if(!sel)return;
  const lines=[...new Set(state.properties.map(p=>p.line).filter(Boolean))].sort();
  const cur=sel.value;
  sel.innerHTML=`<option value="">전체 노선</option>`+lines.map(l=>`<option${cur===l?' selected':''}>${esc(l)}</option>`).join('');
  sel.value=lines.includes(cur)?cur:'';
  if(sel.value!==cur) propLineFilter='';
}
function renderProps(){renderStats();renderTabs();renderList();renderPrep();renderSteps();renderWeights();renderLineFilter();}

document.addEventListener('DOMContentLoaded',()=>{
  const ps=document.getElementById('prop_search');
  if(ps) ps.addEventListener('input',()=>renderList());
});
// prop_search 즉시 바인딩 (DOMContentLoaded 이미 지났을 때)
(()=>{ const ps=document.getElementById('prop_search'); if(ps) ps.addEventListener('input',()=>renderList()); })();


/* ============ v2: 가중치 · 자동 평가 · 정렬 ============ */
const WEIGHTS=[['commute','통근'],['budget','예산'],['area','면적'],['complex','단지조건'],['risk','리스크']];
let sortMode='status';
function renderWeights(){
  const w=state.settings.weights||{};
  const el=document.getElementById('weights'); if(!el)return;
  el.innerHTML=WEIGHTS.map(([k,ko])=>`<div class="wrow"><label>${ko}</label><input type="range" min="1" max="5" step="1" data-w="${k}" value="${w[k]||3}"><span class="wv tnum">${w[k]||3}</span></div>`).join('');
  el.querySelectorAll('input[data-w]').forEach(inp=>{
    inp.oninput=()=>{ state.settings.weights[inp.dataset.w]=+inp.value; inp.nextElementSibling.textContent=inp.value; save(); };
  });
}
function weightLine(){const w=state.settings.weights||{};return WEIGHTS.map(([k,ko])=>`${ko} ${w[k]||3}`).join(', ');}
document.getElementById('evalBtn').onclick=async()=>{
  const list=state.properties.filter(p=>p.status!=='탈락');
  if(!list.length){alert('평가할 매물이 없어요. 먼저 매물을 추가하세요.');return;}
  const btn=document.getElementById('evalBtn'); btn.disabled=true; const old=btn.textContent;
  let done=0;
  for(const p of list){
    btn.textContent=`평가 중 ${++done}/${list.length}…`;
    try{
      const out=await claudeAPI([{role:"user",content:
        `우리 부부 전세 매물을 0~100점으로 채점하고 한 줄 코멘트. 설명·마크다운 금지, JSON만.\n`+
        `형식:{"score":정수,"comment":"한 줄"}\n`+
        `[우리 조건] ${profileLine()}\n`+
        `[가중치 1~5] ${weightLine()}.\n`+
        `[매물] 이름:${p.name||'?'} / 위치:${p.loc||'?'} / 보증금:${p.deposit||'?'}억 / 전용:${p.area||'?'}㎡ / 메모:${p.memo||'없음'}\n`+
        `재건축 이주 리스크가 크면 감점.`}],
        [{type:"web_search_20250305",name:"web_search"}]);
      const j=parseJSON(out);
      if(j&&j.score!=null){ p.aiScore=Math.max(0,Math.min(100,Math.round(j.score))); p.aiComment=j.comment||''; save(); renderList(); }
    }catch(e){ btn.textContent=e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 연결 실패'; setTimeout(()=>{btn.disabled=false;btn.textContent=old;},1800); return; }
  }
  sortMode='status';
  const ss=document.getElementById('propSortSel'); if(ss) ss.value='status';
  save(); renderList();
  btn.disabled=false; btn.textContent=old;
};
document.getElementById('propSortSel').onchange=function(){sortMode=this.value;renderList();};
function exportProps(){
  const fmt=document.getElementById('propExportFmt').value;
  const sep=fmt==='csv'?',':'\t';
  const COLS=['단지명','위치','역','호선','전세호가(억)','전세호가숫자','매매호가','전용면적','세대수','세대수등급','준공년도','전세가율(%)','강남출퇴근','신사출퇴근','상태','URL','메모','메모2'];
  function cell(v){
    const s=String(v==null?'':v);
    const danger=fmt==='csv'?/[,\n"]/.test(s):(/[\t\n"]/.test(s));
    if(danger||/^[=+\-@]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
    return s;
  }
  const rows=state.properties.map(p=>[
    p.name||'',p.loc||'',p.station||'',p.line||'',
    p.jeonseReal!=null?p.jeonseReal:'',p.depositNum!=null?p.depositNum:'',
    p.saleReal!=null?p.saleReal:'',
    p.area!=null?p.area:'',p.households!=null?p.households:'',p.householdGrade||'',p.yearBuilt||'',
    p.jeonseRatio!=null?p.jeonseRatio:'',
    p.commuteGangnam||'',p.commuteSinsa||'',p.status||'',p.url||'',p.memo||'',''
  ].map(cell).join(sep));
  const content=[COLS.join(sep),...rows].join('\n');
  const mime=fmt==='csv'?'text/csv':'text/tab-separated-values';
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['﻿'+content],{type:mime+';charset=utf-8'}));
  a.download='매물목록_'+new Date().toISOString().slice(0,10)+(fmt==='csv'?'.csv':'.tsv');
  a.click(); URL.revokeObjectURL(a.href);
}
document.getElementById('propExportBtn').onclick=exportProps;


/* ============ 내보내기 / 가져오기 ============ */
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');}));

function makeBackup(){
  const payload={v:3, savedAt:new Date().toISOString(), state};
  return '스위티홈::'+btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
function readBackup(code){
  try{
    let c=code.trim();
    if(c.startsWith('스위티홈::')) c=c.slice('스위티홈::'.length);
    else if(c.startsWith('집구하기맵::')) c=c.slice('집구하기맵::'.length);
    const json=decodeURIComponent(escape(atob(c.trim())));
    const o=JSON.parse(json);
    if(o&&o.state) return {kind:'full',state:o.state};
    if(o&&Array.isArray(o.properties)) return {kind:'legacy',properties:o.properties,prep:o.prep,steps:o.steps};
    return null;
  }catch(e){return null;}
}


/* ============ v4: 시트 승격 벌크 임포트 ============ */
let propGradeFilter='',propLineFilter='';

function safeUrl(u){
  try{const url=new URL(u);if(!['http:','https:'].includes(url.protocol))return'';return url.href;}catch(e){return'';}
}
function calcHouseholdGrade(n){
  if(n==null)return'';const v=parseInt(n);if(isNaN(v))return'';
  if(v>=1000)return'1000세대+';if(v>=500)return'500세대+';if(v>=300)return'300세대+';
  if(v>=150)return'소규모조건부';return'소규모주의';
}
function normalizeStr(s){return String(s||'').trim().replace(/\s+/g,' ').toLowerCase();}
function mapImportStatus(s){
  const m={'후보확정':'후보','제외':'탈락'};
  const valid=['관심','검토중','문의예정','방문예정','후보','보류','탈락'];
  const v=m[s]||s;
  return valid.includes(v)?v:'관심';
}

function parseTSV(text){
  const rows=text.trim().split(/\r?\n/).map(r=>r.split('\t'));
  let data=rows;
  const firstCell=(rows[0]&&rows[0][0]||'').trim();
  if(firstCell==='단지명') data=rows.slice(1);
  return data.filter(r=>r.some(c=>c.trim())).map(cols=>{
    const c=i=>(cols[i]||'').trim();
    const deposit=c(7);
    const depositNum=parseEok(deposit);
    const jeonseReal=parseEok(c(8));
    const saleReal=parseEok(c(9));
    const jeonseRatio=saleReal?Math.round(((jeonseReal!=null?jeonseReal:depositNum)??0)/saleReal*100)||null:null;
    const hh=parseInt(c(5))||null;
    const area=parseFloat(c(6))||null;
    return {
      name:c(0),loc:c(1),station:c(2),line:c(3),
      yearBuilt:parseInt(c(4))||null,
      households:hh,householdGrade:hh?calcHouseholdGrade(hh):'',
      area,deposit,depositNum,jeonseReal,saleReal,jeonseRatio,
      commuteGangnam:c(10)||null,commuteSinsa:c(11)||null,
      status:mapImportStatus(c(12)),
      url:safeUrl(c(13)),memo:c(14),
    };
  });
}

function calcDupStatus(parsed){
  const existKeys=new Set(state.properties.map(p=>normalizeStr(p.name)+'|'+normalizeStr(p.loc||p.station||'')));
  const existNames=new Set(state.properties.map(p=>normalizeStr(p.name)));
  return parsed.map(row=>{
    const key=normalizeStr(row.name)+'|'+normalizeStr(row.loc||row.station||'');
    if(existKeys.has(key)) return{...row,_dup:'중복'};
    if(normalizeStr(row.name)&&existNames.has(normalizeStr(row.name))) return{...row,_dup:'이름유사'};
    return{...row,_dup:'신규'};
  });
}

let importParsedRows=[];
function renderImportPreview(rows){
  if(!rows.length){
    document.getElementById('propImportErr').textContent='파싱된 행이 없어요. 데이터를 확인해주세요.';
    return;
  }
  document.getElementById('propImportErr').textContent='';
  const dupCount=rows.filter(r=>r._dup==='중복').length;
  const html=`<div style="overflow-x:auto"><table class="import-tbl">
    <thead><tr>
      <th><input type="checkbox" id="piChkAll" checked></th>
      <th>단지명</th><th>지역/역</th><th>전세보증금(호가)</th><th>억값</th>
      <th>전세가율</th><th>세대수등급</th><th>상태</th><th>중복여부</th>
    </tr></thead>
    <tbody>${rows.map((r,i)=>`<tr class="${r._dup==='중복'?'dup-r':''}">
      <td><input type="checkbox" class="pi-chk" data-idx="${i}"${r._dup!=='중복'?' checked':''}></td>
      <td>${esc(r.name||'—')}</td>
      <td>${esc(r.loc||r.station||'—')}</td>
      <td>${esc(r.deposit||'—')}</td>
      <td class="tnum">${r.depositNum!=null?r.depositNum+'억':'—'}</td>
      <td class="tnum">${r.jeonseRatio!=null?r.jeonseRatio+'%':'—'}</td>
      <td>${esc(r.householdGrade||'—')}</td>
      <td>${esc(r.status)}</td>
      <td><span class="dup-badge dup-${r._dup}">${r._dup}</span></td>
    </tr>`).join('')}</tbody>
  </table></div>`;
  document.getElementById('propImportTable').innerHTML=html;
  const updateCount=()=>{
    const n=[...document.querySelectorAll('.pi-chk:checked')].length;
    const btn=document.getElementById('propImportSubmitBtn');
    btn.textContent=`선택 ${n}개 등록`;btn.disabled=n===0;
  };
  document.getElementById('piChkAll').onchange=e=>{
    document.querySelectorAll('.pi-chk').forEach(cb=>{if(!cb.closest('tr').classList.contains('dup-r'))cb.checked=e.target.checked;});
    updateCount();
  };
  document.querySelectorAll('.pi-chk').forEach(cb=>cb.onchange=updateCount);
  updateCount();
  document.getElementById('propImportSummary').textContent=`총 ${rows.length}행 · 중복 ${dupCount}행 자동 해제`;
  document.getElementById('propImportPreview').style.display='';
}

document.getElementById('propImportPreviewBtn').onclick=()=>{
  const text=document.getElementById('propImportTa').value;
  if(!text.trim()){document.getElementById('propImportErr').textContent='데이터를 붙여넣어 주세요.';return;}
  importParsedRows=calcDupStatus(parseTSV(text));
  renderImportPreview(importParsedRows);
};
document.getElementById('propImportBackBtn').onclick=()=>{
  document.getElementById('propImportPreview').style.display='none';importParsedRows=[];
};
document.getElementById('propImportSubmitBtn').onclick=async()=>{
  const chkEls=[...document.querySelectorAll('.pi-chk:checked')];
  const toImport=chkEls.map(cb=>importParsedRows[+cb.dataset.idx]).filter(r=>r&&r._dup!=='중복'&&r.name);
  if(!toImport.length)return;
  const batchId='b'+Date.now().toString(36);
  const now=new Date().toISOString();
  const newIds=[];
  toImport.forEach(row=>{
    const id='m'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
    newIds.push(id);
    state.properties.push({
      id,created:Date.now(),
      name:row.name,loc:row.loc,station:row.station,line:row.line,
      yearBuilt:row.yearBuilt,households:row.households,householdGrade:row.householdGrade,
      area:row.area,deposit:row.deposit,depositNum:row.depositNum,
      jeonseReal:row.jeonseReal,saleReal:row.saleReal,jeonseRatio:row.jeonseRatio,
      commuteGangnam:row.commuteGangnam,commuteSinsa:row.commuteSinsa,
      url:row.url,memo:row.memo,status:row.status,
      lat:null,lng:null,geocodePending:true,
      checks:{},aiScore:null,aiComment:'',img:'',
      importSource:'sheet',importedAt:now,importBatchId:batchId,
    });
  });
  const dupSkip=importParsedRows.filter(r=>r._dup==='중복').length;
  closeModal('propImportModal');
  save();renderProps();refreshOverview();
  showPropToast(`${toImport.length}개 등록 완료 / 중복 ${dupSkip}개 건너뜀`);
  geocodeBatch(newIds);
};

async function geocodeBatch(ids){
  const props=ids.map(id=>state.properties.find(p=>p.id===id)).filter(Boolean);
  for(const p of props){
    const q=((p.name||'')+' '+(p.loc||p.station||'')).trim();
    if(!q)continue;
    try{
      const j=await geocode(q);
      if(j.found){p.lat=j.lat;p.lng=j.lng;p.geocodePending=false;}
    }catch(e){/* geocodePending stays true */}
  }
  save();renderList();refreshOverview();
}

function showPropToast(msg){
  let t=document.getElementById('propToast');
  if(!t){t=document.createElement('div');t.id='propToast';t.className='prop-toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}

document.getElementById('propBulkBtn').onclick=()=>{
  document.getElementById('propImportTa').value='';
  document.getElementById('propImportErr').textContent='';
  document.getElementById('propImportPreview').style.display='none';
  importParsedRows=[];
  openModal('propImportModal');
};

(()=>{
  const gf=document.getElementById('propGradeFilter');
  const lf=document.getElementById('propLineFilter');
  if(gf) gf.onchange=()=>{propGradeFilter=gf.value;renderList();};
  if(lf) lf.onchange=()=>{propLineFilter=lf.value;renderList();};
})();
