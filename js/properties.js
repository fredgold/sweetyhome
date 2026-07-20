/* ============ PROPERTIES (흡수) ============ */
/* 인라인 SVG 아이콘 — docs/style-guide.html 원본 path */
const ICSVG={
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 9.5V20h14V9.5"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 1 0-5.66-5.66l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.66 0l-2.83 2.83a4 4 0 1 0 5.66 5.66l1.5-1.5"/>',
  pin:'<path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  transit:'<rect x="5" y="3" width="14" height="14" rx="3.5"/><path d="M5 11h14"/><path d="M8.5 20l-1.5 1.5M15.5 20l1.5 1.5"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  paste:'<rect x="9" y="3" width="6" height="3" rx="1"/><path d="M15 4.5h1.5a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V6a1.5 1.5 0 0 1 1.5-1.5H9"/><path d="M12 10v6"/><path d="M9.5 13.5 12 16l2.5-2.5"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  price:'<path d="M4 11.5 11.5 4H18a2 2 0 0 1 2 2v6.5L12.5 20a2 2 0 0 1-2.83 0l-5.67-5.67a2 2 0 0 1 0-2.83z"/><circle cx="15.5" cy="8.5" r="1.2"/>',
  export:'<path d="M12 15V4"/><path d="M8.5 7.5 12 4l3.5 3.5"/><path d="M5 14v4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4"/>',
  /* 2라운드 — 잔여 이모지 정리 */
  wallet:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10.5h18"/><circle cx="16.5" cy="14.5" r="1"/>',
  listings:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
  tasks:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 12l2.5 2.5L16 9"/>',
  inbox:'<path d="M4 12h4l2 3h4l2-3h4"/><path d="M4 12 5.5 5.2a1 1 0 0 1 1-.8h11a1 1 0 0 1 1 .8L20 12"/><path d="M4 12v5.5A1.5 1.5 0 0 0 5.5 19h13a1.5 1.5 0 0 0 1.5-1.5V12"/>',
  profile:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  sync:'<path d="M7.5 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17.4 9.2h.3a3.3 3.3 0 0 1 0 6.6H15"/><path d="M9.3 14.6l1.8 1.8 3.3-3.8"/>',
  camera:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13.5" r="3.5"/>',
  edit:'<path d="M4 20l1-4.2L15.8 5 19 8.2 8.2 19z"/><path d="M13.5 6.5l4 4"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  star:'<path d="M12 3.5l2.5 5.6 6 .6-4.5 4.1 1.3 6-5.3-3.2-5.3 3.2 1.3-6-4.5-4.1 6-.6z"/>',
  tip:'<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.15 1 1.9v.2h5v-.2c0-.75.4-1.45 1-1.9A6 6 0 0 0 12 3z"/>',
  quote:'<path d="M7 8a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v-3H6v-2a1 1 0 0 1 1-1h1V8z"/><path d="M16 8a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1v-3h-2v-2a1 1 0 0 1 1-1h1V8z"/>',
  import:'<path d="M12 4v11"/><path d="M8.5 11.5 12 15l3.5-3.5"/><path d="M5 14v4a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-4"/>',
  /* 3라운드 — 정보 영역 이모지 마저 정리 */
  sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  area:'<rect x="3" y="9" width="18" height="6" rx="1"/><path d="M7 9v2"/><path d="M11 9v2"/><path d="M15 9v2"/><path d="M19 9v2"/>',
};
function ic(name,cls){ return `<svg class="ic${cls?' '+cls:''}" viewBox="0 0 24 24" aria-hidden="true">${ICSVG[name]}</svg>`; }
function checklistHTML(p){
  const ch=p.checks||{};
  const done=CHECKLIST.filter(c=>ch[c.id]).length;
  return `<div class="ck" data-pid="${p.id}">
    <div class="ck-label">실사 체크 ${done}/${CHECKLIST.length}</div>
    <div class="ck-body">
      ${CHECKLIST.map(c=>`<div class="ck-item" data-ck="${p.id}|${c.id}" data-on="${ch[c.id]?1:0}">
        <span class="cb">${CHECK}</span>
        <span class="ct">${c.t}<small>${c.s}</small></span>
        ${c.vu&&c.vl?`<a class="ck-verify" href="${c.vu(((p.name||'')+' '+(p.loc||'')).trim())}" target="_blank" rel="noopener">${ic('search')} ${c.vl}</a>`:''}
      </div>`).join('')}
    </div></div>`;
}

function waitNaverMaps(cb){ if(typeof naver!=='undefined'&&naver.maps){cb();} else {setTimeout(()=>waitNaverMaps(cb),120);} }
function initOverview(){
  waitNaverMaps(()=>{
    if(overview){refreshOverview();return;}
    overview=new naver.maps.Map('overviewMap',{center:new naver.maps.LatLng(CENTER[0],CENTER[1]),zoom:13,scrollWheel:true,zoomControl:true,zoomControlOptions:{position:naver.maps.Position.TOP_RIGHT}});
    refreshOverview();
  });
}
/* v5 cutover: 지도 마커 소스를 properties[]→complexes[](대표매물 라벨)로 전환.
   마커 = 대표매물 보증금 라벨 pill + 단지상태색 테두리, 상세 열려있으면 선택 링(outline) + 최상단.
   히트영역은 CSS(.prop-marker padding)로 ~44px까지 확장 — 보이는 pill(~22px)보다 넓게 클릭 가능 */
function cxMarkerLabel(rep){
  const d=rep&&rep.deposit!=null?rep.deposit:null;
  return (d!=null&&!isNaN(d))?`${d}억`:'가격미정';
}
function cxMarkerHtml(cx,rep,selected,dimmed){
  const color=HEX_CX[cx.complexStatus]||'#6B7C93';
  const ring=selected?`outline:3px solid ${color}88;outline-offset:1px;`:'';
  return `<div class="prop-marker${selected?' selected':''}"${dimmed?' style="opacity:.15"':''}>
    <span class="prop-marker-pill" style="border-color:${color};${ring}"><i style="background:${color}"></i>${esc(cxMarkerLabel(rep))}</span>
  </div>`;
}
/* B-02: 데스크톱 hover 시 단지명+대표매물(전세보증금/전용) 툴팁. hover 불가(터치) 환경은
   탭이 곧 상세 패널 열기라 별도 툴팁을 붙이지 않음("모바일은 탭 대체") */
const CAN_HOVER=window.matchMedia('(hover:hover)').matches;
let _cxHoverTip=null;
function closeCxHoverTip(){ if(_cxHoverTip){ _cxHoverTip.remove(); _cxHoverTip=null; } }
function showCxHoverTip(marker,cx,rep){
  closeCxHoverTip();
  const tip=document.createElement('div');
  tip.className='status-picker cx-hover-tip';
  const depositTxt=rep&&rep.deposit!=null?`보증금 ${rep.deposit}억`:'보증금 미정';
  const areaTxt=rep&&rep.areaM2!=null?`전용 ${rep.areaM2}㎡`:'면적 미정';
  tip.innerHTML=`<div class="cx-hover-name">${esc(cx.complexName||'(이름 없음)')}</div><div class="cx-hover-meta">${esc(depositTxt)} · ${esc(areaTxt)}</div>`;
  document.body.appendChild(tip);
  _cxHoverTip=tip;
  const mapEl=document.getElementById('overviewMap');
  const off=overview.getProjection().fromCoordToOffset(marker.getPosition());
  const mapRect=mapEl.getBoundingClientRect();
  const left=mapRect.left+window.scrollX+off.x-tip.offsetWidth/2;
  const top=mapRect.top+window.scrollY+off.y-tip.offsetHeight-14;
  tip.style.left=Math.max(8,left)+'px';
  tip.style.top=Math.max(8,top)+'px';
}
function bindMarkerHover(marker,cx,rep){
  if(!CAN_HOVER) return;
  naver.maps.Event.addListener(marker,'mouseover',()=>showCxHoverTip(marker,cx,rep));
  naver.maps.Event.addListener(marker,'mouseout',closeCxHoverTip);
}
/* 필터로 보이는 단지 id 집합이 실제로 바뀐 경우에만 fitBounds — 상세 열기/닫기·마커 재선택처럼
   집합은 그대로인 리렌더에서는 지도가 튀지 않도록 (연타해도 멀미 안 나게, animate:false) */
let lastVisibleMapKey='',lastMarkerRenderKey='';
function refreshOverview(items){
  if(!overview) return;
  closeCxHoverTip();
  const withCoords=(items||state.complexes.filter(cxMatchesFilters)).filter(cx=>cx.lat&&cx.lng);
  const key=withCoords.map(cx=>`${cx.id}:${cx.lat}:${cx.lng}`).sort().join(',');
  const setChanged=key!==lastVisibleMapKey;
  lastVisibleMapKey=key;
  const markerKey=withCoords.map(cx=>{
    const rep=cxRepOf(cx);
    return `${cx.id}:${cx.lat}:${cx.lng}:${cx.complexStatus}:${rep?rep.deposit:''}:${cxDetailId===cx.id}`;
  }).sort().join(',');
  if(markerKey===lastMarkerRenderKey) return;
  lastMarkerRenderKey=markerKey;
  /* 네이버 지도 SDK가 오래 산 마커의 setMap(null) 내부에서 널 참조로 죽는 경우가
     실측됨(SDK 내부 상태 문제로 추정, 우리 코드 밖) — 마커 하나 정리 실패가 전체
     리프레시를 막지 않도록 개별 try/catch */
  ovMarkers.forEach(m=>{ try{ m.setMap(null); }catch(e){} }); ovMarkers=[];
  const pts=[];
  withCoords.forEach(cx=>{
    try{
      const rep=cxRepOf(cx);
      const selected=cxDetailId===cx.id;
      const pos=new naver.maps.LatLng(cx.lat,cx.lng);
      const m=new naver.maps.Marker({position:pos,map:overview,icon:{content:cxMarkerHtml(cx,rep,selected),anchor:new naver.maps.Point(0,0)},zIndex:selected?1000:0});
      naver.maps.Event.addListener(m,'click',()=>{ closeCxHoverTip(); if(DESKTOP_MQ.matches){ openComplexDetail(cx.id); } else { focusCxCard(cx.id); } });
      bindMarkerHover(m,cx,rep);
      m._cxid=cx.id;
      ovMarkers.push(m); pts.push(pos);
    }catch(e){ /* 마커 하나 생성 실패가 나머지 단지 마커까지 막지 않도록 */ }
  });
  if(setChanged){
    if(pts.length===1){ overview.setCenter(pts[0]); overview.setZoom(Math.max(overview.getZoom(),15)); }
    else if(pts.length>1){
      const bounds=new naver.maps.LatLngBounds(); pts.forEach(p=>bounds.extend(p));
      overview.fitBounds(bounds,{top:40,right:40,bottom:40,left:40});
      naver.maps.Event.once(overview,'idle',()=>{ if(overview.getZoom()>15) overview.setZoom(15); });
    }
  }
  setTimeout(()=>overview.refresh(true),60);
}
const DESKTOP_MQ=window.matchMedia('(min-width:900px)');
/* 상세 열기 → 지도: 마커 재생성 없이 아이콘만 바꿔치기(제거·재추가 없음 → fitBounds 재발동 안 함) */
function reselectCxMarker(id){
  ovMarkers.forEach(m=>{
    try{
      const cx=state.complexes.find(x=>x.id===m._cxid); if(!cx) return;
      const rep=cxRepOf(cx);
      const selected=m._cxid===id;
      m.setIcon({content:cxMarkerHtml(cx,rep,selected),anchor:new naver.maps.Point(0,0)});
      m.setZIndex(selected?1000:0);
    }catch(e){}
  });
}
/* 레거시(기존 매물) 카드의 "지도에서 보기"(locate())가 호출하던 마커 재선택 로직 —
   지도가 더 이상 매물 마커를 그리지 않아(모든 마커가 _cxid만 가짐) 실질적으로
   무동작이 됨. properties[] 뷰 은퇴에 따른 알려진 부수효과이며, locate()의 지도
   패닝 자체는 유지(좌표 확인 용도로는 여전히 유효해 남겨둠) */
function reselectMarker(id){ /* no-op: 매물 마커 자체가 더 이상 존재하지 않음 */ }
/* 모바일 전용 지도 풀스크린 토글 (≥900px에서는 버튼 자체가 CSS로 숨겨져 호출될 일 없음) */
function setMapExpanded(on){
  const c=document.getElementById('mapcard');
  c.classList.toggle('expanded',on);
  const btn=document.getElementById('mapExpand');
  if(btn) btn.textContent=on?'작게 보기':'크게 보기';
  setTimeout(()=>overview&&overview.refresh(true),300);
}
function handleBreakpointChange(e){
  if(e.matches){
    document.getElementById('mapcard').classList.remove('expanded','collapsed');
    const btn=document.getElementById('mapExpand'); if(btn) btn.textContent='크게 보기';
    const tbtn=document.getElementById('mapToggle'); if(tbtn) tbtn.textContent='접기';
  }
  /* 브레이크포인트 전환 직후 레이아웃·페인트가 끝난 뒤에 refresh해야 해서
     이중 rAF로 한 프레임 넘김 (동기 호출하면 갱신 전 크기로 refresh(true)가
     실행돼 새로 넓어진 영역의 타일이 안 채워지는 문제가 실측됨) */
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    waitNaverMaps(()=>overview&&overview.refresh(true));
  }));
}
DESKTOP_MQ.addEventListener('change',handleBreakpointChange);
(()=>{
  let raf=null;
  window.addEventListener('resize',()=>{
    if(raf) cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{ if(overview) overview.refresh(true); });
    });
  });
})();
document.getElementById('mapToggle').onclick=()=>{
  const c=document.getElementById('mapcard'); c.classList.toggle('collapsed');
  document.getElementById('mapToggle').textContent=c.classList.contains('collapsed')?'펼치기':'접기';
  if(!c.classList.contains('collapsed')) setTimeout(()=>overview&&overview.refresh(true),80);
};
document.getElementById('mapExpand').onclick=()=>{
  setMapExpanded(!document.getElementById('mapcard').classList.contains('expanded'));
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
  const pts=ids.map(id=>state.complexes.find(c=>c.id===id)).filter(p=>p&&p.lat&&p.lng);
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
  renderRouteBar(); waitNaverMaps(()=>drawRoute());
}
function clearRouteLayer(){ if(routeLayerGroup) routeLayerGroup.forEach(o=>o.setMap(null)); routeLayerGroup=null; }
/* naver.maps.Marker엔 Leaflet의 setOpacity() 같은 메서드가 없음(실측 확인, 이전
   네이버 전환 세션의 잔재 버그로 추정) — 아이콘을 opacity 스타일 포함해 다시
   그려 넣는 setIcon()으로 대체. 이미 지도 전환 전 코드에서도 깨져 있던 걸 이번에
   루트 플로우를 테스트하다 발견해서 같이 고침 */
function dimRouteStatusMarkers(on){
  const ids=new Set(routeStops.map(s=>s.property.id));
  ovMarkers.forEach(m=>{
    const cx=state.complexes.find(x=>x.id===m._cxid); if(!cx) return;
    const rep=cxRepOf(cx);
    const dim=on&&ids.has(m._cxid);
    const selected=cxDetailId===m._cxid;
    m.setIcon({content:cxMarkerHtml(cx,rep,selected,dim),anchor:new naver.maps.Point(0,0)});
  });
}
function drawRoute(){
  clearRouteLayer();
  if(!overview||routeStops.length<2) return;
  routeLayerGroup=[];
  const latlngs=[];
  routeStops.forEach((s,i)=>{
    try{
      const p=s.property; const pos=new naver.maps.LatLng(p.lat,p.lng); latlngs.push(pos);
      const mk=new naver.maps.Marker({position:pos,map:overview,icon:{content:`<div class="route-pin"><span style="background:${HEX_CX[p.complexStatus]||'#6B7C93'}">${i+1}</span></div>`,anchor:new naver.maps.Point(12,12)},zIndex:500});
      const info=new naver.maps.InfoWindow({content:`<div class="route-popup"><b>${i+1}. ${esc(p.complexName||'')}</b>`+(i>0?`<br>이전 정류점에서 도보 약 ${s.legMinutes}분 (${Math.round(s.legDistanceM)}m)`:'')+`</div>`,borderWidth:0,backgroundColor:'transparent',disableAnchor:true});
      naver.maps.Event.addListener(mk,'click',()=>info.open(overview,mk));
      routeLayerGroup.push(mk);
    }catch(e){}
  });
  const polyline=new naver.maps.Polyline({map:overview,path:latlngs,strokeColor:'#4B88CC',strokeWeight:3,strokeOpacity:.85,strokeStyle:'shortdash'});
  routeLayerGroup.push(polyline);
  const bounds=new naver.maps.LatLngBounds(); latlngs.forEach(p=>bounds.extend(p));
  overview.fitBounds(bounds,{top:50,right:50,bottom:50,left:50});
  naver.maps.Event.once(overview,'idle',()=>{ if(overview.getZoom()>16) overview.setZoom(16); });
  dimRouteStatusMarkers(true);
}
function renderRouteBar(){
  const bar=document.getElementById('routeBar');
  if(routeMode==='off'){ bar.style.display='none'; bar.innerHTML=''; return; }
  bar.style.display='flex';
  if(routeMode==='select'){
    const n=routeSelected.size;
    bar.innerHTML=`<div class="rb-info">${ic('map')} 임장 루트 — <b>${n}곳</b> 선택됨</div>
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
    +`<div class="rb-stop" data-idx="${i}"><span class="rb-drag">⠿</span><span class="rb-num">${i+1}</span><span class="rb-name">${esc(s.property.complexName||'(이름 없음)')}</span></div>`
  ).join('');
  bar.innerHTML=`<div class="rb-route">
      <div class="rb-route-list" id="rbRouteList">${rows}</div>
      <div class="rb-route-total">총 도보 약 ${totalMin}분 · ${(totalM/1000).toFixed(1)}km · ${routeStops.length}곳 (직선거리 추정, 드래그로 순서 변경 가능)</div>
    </div>
    <div class="rb-actions">
      <button class="btn-ghost" id="routeSaveBtn">저장</button>
      <button class="btn-ghost" id="routeRefreshBtn">↻ 새로고침</button>
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
  renderComplexes(); renderRouteBar();
}
function exitRouteMode(){
  routeMode='off'; routeSelected=new Set(); routeStops=[];
  clearRouteLayer(); renderComplexes(); renderRouteBar();
}
function expandMapCard(){
  document.getElementById('mapcard').classList.remove('collapsed');
  document.getElementById('mapToggle').textContent='접기';
}
function makeRoute(){
  if(routeSelected.size<2) return;
  routeStops=computeRoute([...routeSelected]);
  if(routeStops.length<2){ alert('좌표가 저장된 단지가 2곳 이상 필요해요.'); return; }
  routeMode='result';
  expandMapCard();
  renderComplexes(); renderRouteBar(); waitNaverMaps(()=>drawRoute());
}
function refreshRoute(){
  const pts=routeStops.map(s=>s.property.id).map(id=>state.complexes.find(c=>c.id===id)).filter(p=>p&&p.lat&&p.lng);
  routeSelected=new Set(pts.map(p=>p.id));
  if(pts.length<2){
    alert('선택된 단지가 삭제되었거나 부족해 루트를 유지할 수 없어요. 다시 선택해주세요.');
    enterRouteSelectMode(true);
    return;
  }
  routeStops=legsForOrder(pts);
  renderRouteBar(); waitNaverMaps(()=>drawRoute());
}
/* v5 cutover: 임장은 단지 단위로 전환. 필드명 propertyIds는 state.js 스키마
   안정성을 위해 그대로 두되(범위 밖 파일이라 이름 변경 안 함), 저장되는 값은
   이제 매물 id가 아니라 단지(complexes) id */
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
  const pts=r.propertyIds.map(pid=>state.complexes.find(c=>c.id===pid)).filter(p=>p&&p.lat&&p.lng);
  if(pts.length<2){ alert('저장된 단지가 삭제되었거나 좌표가 없어 루트를 불러올 수 없어요.'); return; }
  routeSelected=new Set(pts.map(p=>p.id));
  routeStops=legsForOrder(pts);
  routeMode='result';
  expandMapCard();
  renderComplexes(); renderRouteBar(); waitNaverMaps(()=>drawRoute());
}
let _routeMenu=null;
function closeRouteMenu(){
  if(!_routeMenu) return;
  document.removeEventListener('click',_routeMenu._outsideClose,true);
  _routeMenu.remove(); _routeMenu=null;
}
function showRouteMenu(btn){
  if(_routeMenu){ closeRouteMenu(); return; }
  const saved=state.savedRoutes||[];
  const menu=document.createElement('div');
  menu.className='status-picker route-menu';
  menu.innerHTML=`<button class="sp-opt" data-newroute="1">+ 새 루트 만들기</button>`
    +(saved.length?`<div class="rm-sep"></div>`:'')
    +saved.map(r=>`<div class="rm-item">
        <button class="sp-opt" data-loadroute="${r.id}">${esc(r.name)} <small>(${r.propertyIds.length}곳)</small></button>
        <button class="rm-del" data-delroute="${r.id}" title="삭제" aria-label="삭제">✕</button>
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
  menu._outsideClose=ev=>{ if(!menu.contains(ev.target)) closeRouteMenu(); };
  document.addEventListener('click',menu._outsideClose,true);
}
document.getElementById('propRouteBtn').onclick=(e)=>{
  if(routeMode!=='off'){ exitRouteMode(); return; }
  if(!(state.savedRoutes&&state.savedRoutes.length)){ enterRouteSelectMode(false); return; }
  showRouteMenu(e.currentTarget);
};

/* 매물탭 툴바 "⋯ 더보기" — 480px 이하(데스크톱)/900px 이하(모바일 풀스크린 지도뷰)에서
   숨겨진 실제 컨트롤을 기존 .status-picker 플로팅 메뉴 안으로 옮겼다가 닫으면 원래
   자리로 되돌림(컨트롤을 복제하지 않고 그대로 이동해 이벤트 핸들러도 그대로 유지).
   모바일에서는 검색(unisearch)도 함께 옮기는데, 원래 부모가 .ph-actions가 아니므로
   요소별로 (parent,next)를 따로 기억해야 닫을 때 서로 다른 원래 자리로 정확히 되돌아감.
   B-35: 필터(cxFilterBar)는 상단 칩 바로 상시 노출되므로 이 메뉴에서 제외 */
let _moreMenu=null, _moreSlots=null;
function closeMoreMenu(){
  if(!_moreMenu) return;
  document.removeEventListener('click',_moreMenu._outsideClose,true);
  _moreSlots.forEach(({el,parent,next})=>parent.insertBefore(el,next));
  _moreMenu.remove(); _moreMenu=null; _moreSlots=null;
  unlockBodyScroll();
}
function showMoreMenu(btn){
  if(_moreMenu){ closeMoreMenu(); return; }
  const ids=DESKTOP_MQ.matches
    ? ['phExportRow','propBulkBtn','propRouteBtn']
    : ['unisearch','phExportRow','propBulkBtn','propRouteBtn'];
  const els=ids.map(id=>document.getElementById(id)).filter(Boolean);
  _moreSlots=els.map(el=>({el,parent:el.parentElement,next:el.nextSibling}));
  const menu=document.createElement('div');
  menu.className='status-picker ph-more-menu';
  els.forEach(el=>menu.appendChild(el));
  document.body.appendChild(menu);
  _moreMenu=menu;
  const rect=btn.getBoundingClientRect();
  const menuW=menu.offsetWidth||230;
  // 위치 계산은 잠금(body position:fixed) 전에 실측 scrollY 기준으로 먼저 끝내고,
  // 잠금은 그 다음에 걸어야 함(B-12 버그3) — body가 position:fixed가 되는 순간
  // .status-picker(position:absolute, body 직계 자식)의 containing block이 body로
  // 바뀌는데, body의 top:-scrollY 오프셋과 여기서 더한 +scrollY가 정확히 상쇄되므로
  // 결과 좌표는 동일(실측 확인 완료) — 순서를 바꿔도 무방하지만 기존 위치 계산
  // 코드를 그대로 두기 위해 잠금을 뒤에 붙임
  menu.style.top=(rect.bottom+window.scrollY+4)+'px';
  menu.style.left=Math.max(8,Math.min(rect.left+window.scrollX, window.innerWidth-menuW-8))+'px';
  /* B-12 재수정B: 모바일에서 검색+필터(6줄)+버튼 3개가 다 들어가면 메뉴 내용이
     뷰포트보다 길어져(overflow 제약 없던 시절) 메뉴 자체가 페이지를 늘려 뒤 배경이
     스크롤되던 원인이었음 — lockBodyScroll()이 body를 잠가도 메뉴가 뷰포트를
     넘치면 body 잠금과 무관하게 브라우저가 페이지를 늘려버림. 버튼 아래 남는 세로
     공간만큼 max-height를 주고 CSS(.ph-more-menu{overflow-y:auto})로 메뉴 내부만
     스크롤되게 함 */
  menu.style.maxHeight=Math.max(120,window.innerHeight-rect.bottom-4-12)+'px';
  lockBodyScroll();
  menu._outsideClose=ev=>{ if(!menu.contains(ev.target)&&ev.target!==btn) closeMoreMenu(); };
  document.addEventListener('click',menu._outsideClose,true);
}
document.getElementById('propMoreBtn').onclick=(e)=>showMoreMenu(e.currentTarget);

async function geocode(q){
  try{
    const res=await fetch('/api/geocode?'+new URLSearchParams({q}),{headers:authHeaders()});
    const j=await res.json();
    if(j.ok) return {lat:j.lat,lng:j.lng,found:true};
  }catch(e){}
  return {found:false};
}
/* v5 cutover: 좌표 자동 채우기 대상을 properties[]에서 complexes[]로 전환.
   geocodeQuery는 이미 [G#]·동/호·가격 등이 제거된 상태로 저장돼 있어 그대로 사용 */
async function autoGeocode(){
  const noCoord=state.complexes.filter(cx=>!(cx.lat&&cx.lng)&&cx.geocodeQuery);
  if(!noCoord.length) return;
  for(const cx of noCoord){
    try{
      const j=await geocode(cx.geocodeQuery);
      if(j.found){ cx.lat=j.lat; cx.lng=j.lng; }
    }catch(e){ break; }
  }
  if(noCoord.some(cx=>cx.lat)) { save(); refreshOverview(); }
}

function initFormMap(){
  waitNaverMaps(()=>{
    if(formMapObj){setTimeout(()=>formMapObj.refresh(true),60);return;}
    formMapObj=new naver.maps.Map('formMap',{center:new naver.maps.LatLng(CENTER[0],CENTER[1]),zoom:13});
    naver.maps.Event.addListener(formMapObj,'click',e=>setFormPin(e.coord.lat(),e.coord.lng(),true));
    setTimeout(()=>formMapObj.refresh(true),60);
  });
}
function setFormPin(lat,lng,recenter){
  tempLatLng={lat,lng};
  waitNaverMaps(()=>{
    if(!formMapObj) return;
    const pos=new naver.maps.LatLng(lat,lng);
    if(formMarker) formMarker.setPosition(pos);
    else{
      formMarker=new naver.maps.Marker({position:pos,map:formMapObj,draggable:true});
      naver.maps.Event.addListener(formMarker,'dragend',ev=>{const p=ev.coord;tempLatLng={lat:p.lat(),lng:p.lng()};});
    }
    if(recenter){ formMapObj.setCenter(pos); formMapObj.setZoom(16); }
  });
}
function clearFormPin(){ if(formMarker&&formMapObj){formMarker.setMap(null);} formMarker=null; tempLatLng=null; }

let tempComplexPromotion=null;
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
  const sed=t.match(/([\d,]+)\s*세대/); const sedN=sed?parseInt(sed[1].replace(/,/g,''),10):null; if(sed){bits.push(sedN+'세대'); r.households=sedN;}
  const hy=t.match(/(복도식|계단식|복도혼합|타워형)/); if(hy)bits.push(hy[1]);
  const nan=t.match(/(중앙난방|지역난방|개별난방)/); if(nan)bits.push(nan[1]);
  const pk=t.match(/세대당\s*([\d.]+)\s*대/); if(pk){bits.push('주차 '+pk[1]+'대/세대'); r.parking=parseFloat(pk[1]);}
  const yr=t.match(/\((\d+)년차\)/); if(yr)bits.push(yr[1]+'년차');
  const mg=t.match(/관리비[\s\S]{0,6}?([\d,]+)\s*만원/); if(mg){bits.push('관리비 '+mg[1]+'만'); r.managementFee=parseInt(mg[1].replace(/,/g,''),10);}
  const mv=t.match(/입주가능일[\s\S]{0,15}?(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/); if(mv)bits.push('입주 '+mv[1].replace(/\s+/g,''));
  const ln=t.match(/융자금[\s\S]{0,6}?(없음|있음)/); if(ln)bits.push('융자 '+ln[1]);
  if(bits.length)r.memo=bits.join(' · ');
  r._auto={};
  if(sedN!=null&&sedN>=state.settings.grades.bigComplex) r._auto.k4=true;
  if(hy) r._auto.k5=true;
  if(nan) r._auto.k6=true;
  if(pk) r._auto.k8=true;
  return r;
}
function createComplexPromotion(j){
  const values={};
  if(j.loc) values.loc=String(j.loc).trim();
  if(j.parking!=null&&!isNaN(j.parking)&&j.parking>=0) values.parking=+j.parking;
  if(j.households!=null&&!isNaN(j.households)&&j.households>=0) values.households=+j.households;
  return Object.keys(values).length?{values,handled:{}}:null;
}
function applyComplexPromotion(cx,promotion){
  if(!cx||!promotion||promotion.handled[cx.id]) return;
  const direct=[], overwrite=[];
  const addChange=(field,label,current,next,empty)=>{
    if(current===next) return;
    (empty?direct:overwrite).push({field,label,current,next});
  };
  if(promotion.values.loc){
    addChange('loc','주소',cx.loc||'—',promotion.values.loc,!cx.loc);
  }
  if(promotion.values.parking!=null){
    const same=cx.parkingState==='known'&&cx.parking===promotion.values.parking;
    if(!same) addChange(
      'parking','주차',parkingCaption(cx),
      `세대당 ${promotion.values.parking}대`,
      cx.parkingState==='unknown'
    );
  }
  if(promotion.values.households!=null){
    const same=cx.households===promotion.values.households;
    if(!same) addChange(
      'households','세대수',cx.households!=null?cx.households+'세대':'—',
      promotion.values.households+'세대',
      cx.households==null
    );
  }
  let approved=true;
  if(overwrite.length){
    const lines=overwrite.map(change=>`${change.label}: ${change.current} → ${change.next}`);
    approved=confirm(`단지 정보에도 반영할까요?\n${lines.join('\n')}`);
  }
  const accepted=direct.concat(approved?overwrite:[]);
  accepted.forEach(change=>{
    if(change.field==='loc'){
      cx.loc=promotion.values.loc;
      cx.geocodeQuery=buildGeocodeQuery(cx.loc,cx.complexName);
    } else if(change.field==='parking'){
      cx.parking=promotion.values.parking;
      cx.parkingState='known';
    } else if(change.field==='households'){
      cx.households=promotion.values.households;
      cx.householdGrade=calcHouseholdGrade(cx.households,state.settings.grades);
    }
  });
  promotion.handled[cx.id]=true;
  if(!accepted.length) return;
  cx.updatedAt=new Date().toISOString();
  save();
  renderComplexes();
  if(cxDetailId===cx.id){
    renderComplexDetailInfo(cx);
    const parkingWrap=document.getElementById('cxDetailParkingWrap');
    if(parkingWrap) parkingWrap.innerHTML=triStateHTML({
      field:'parking',value:cx.parking,state:cx.parkingState,
      caption:parkingCaption(cx),unit:'대/세대',step:'0.1',placeholder:'예: 1.2',
    });
  }
}
function queueAddFormComplexPromotion(j){
  tempComplexPromotion=createComplexPromotion(j);
  if(!tempComplexPromotion) return;
  const {complexName}=migParseName(document.getElementById('f_name').value);
  const id=findExistingComplexId(
    complexName,
    document.getElementById('f_loc').value.trim(),
    document.getElementById('f_station').value.trim()
  );
  if(id) applyComplexPromotion(state.complexes.find(cx=>cx.id===id),tempComplexPromotion);
}
function applyFill(j){
  if(j.name) document.getElementById('f_name').value=j.name;
  if(j.loc) document.getElementById('f_loc').value=j.loc;
  if(j.deposit!=null&&j.deposit!=='') document.getElementById('f_deposit').value=j.deposit;
  if(j.area!=null&&j.area!=='') document.getElementById('f_area').value=j.area;
  if(j.memo){ document.getElementById('f_memo').value=j.memo; if(fMemoTiptapEditor) fMemoTiptapEditor.commands.setContent(j.memo); }
  if(j._auto) tempChecks=Object.assign(tempChecks||{},j._auto);
  /* B-28: 파싱이 주차·관리비를 읽었을 때만 저장 — 저장 시점(saveAsComplexListing)에
     반영, 실패 시 각 state는 기존대로 'unknown' */
  if(j.parking!=null) tempParking=j.parking;
  if(j.managementFee!=null) tempManagementFee=j.managementFee;
  queueAddFormComplexPromotion(j);
}
document.getElementById('fillBtn').onclick=async()=>{
  const txt=document.getElementById('pasteBox').value.trim();
  if(!txt){document.getElementById('pasteBox').focus();return;}
  const btn=document.getElementById('fillBtn'); const old=btn.innerHTML;
  const j=parseNaver(txt);
  const got=(j.name||j.deposit!=null||j.area!=null||createComplexPromotion(j));
  if(got){
    applyFill(j);
    const auto=Object.keys(j._auto||{}).length;
    btn.textContent='✓ 채웠어요'+(auto?` (체크 ${auto}개 자동확인)`:'');
    setTimeout(()=>{btn.innerHTML=old;},2000);
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
  setTimeout(()=>{btn.disabled=false;btn.innerHTML=old;},2000);
};

document.getElementById('findBtn').onclick=async()=>{
  const q=(document.getElementById('f_name').value+' '+document.getElementById('f_loc').value).trim();
  if(!q){document.getElementById('f_name').focus();return;}
  const btn=document.getElementById('findBtn'); btn.disabled=true; const old=btn.innerHTML; btn.textContent='찾는 중…';
  try{
    const j=await geocode(q);
    if(j.found){ setFormPin(j.lat,j.lng,true); btn.textContent='✓ 찾았어요'; }
    else { btn.textContent='못 찾음 — 지도 탭'; }
  }catch(e){ btn.textContent='검색 실패 — 지도 직접 탭'; }
  setTimeout(()=>{btn.disabled=false;btn.innerHTML=old;},1600);
};

/* v5 cutover: 통계를 properties[] 기준에서 단지/매물(complexes/listings) 기준으로 전환 */
function renderStats(){
  const cx=state.complexes;
  document.getElementById('stats').innerHTML=
    `단지 <b>${cx.length}</b>개 · 매물 <b>${state.listings.length}</b>건 · 후보 <b>${cx.filter(x=>x.complexStatus==='후보').length}</b> · 임장예정 <b>${cx.filter(x=>x.complexStatus==='임장예정').length}</b>`;
}
function renderTabs(){
  const tabs=['전체','관심','검토중','문의예정','방문예정','후보','보류','탈락'];
  const cnt={전체:state.properties.length}; tabs.slice(1).forEach(s=>cnt[s]=state.properties.filter(p=>p.status===s).length);
  document.getElementById('tabs').innerHTML=tabs.map(t=>`<button class="tab" data-on="${activeTab===t?1:0}" data-tab="${t}">${t}<span class="ct tnum">${cnt[t]}</span></button>`).join('');
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{activeTab=b.dataset.tab;renderList();renderTabs();});
}
/* 카드 액션 링크 — 펼친 상태에서만 보이므로 4개 전부 상시 노출(더보기 접기 불필요).
   호갱노노·실거래가는 매물별 딥링크가 불가능해(실거래가는 항상 홈페이지) 제거.
   네이버 링크는 등록된 URL이 있으면 그 링크만, 없으면 이름 검색만 (둘 다 보여주지 않음) */
function actionsHTML(p, urlSafe){
  const _acts=[];
  if(p.lat) _acts.push(`<button class="c-act" data-locate="${p.id}">${ic('map')} 지도에서 보기</button>`);
  if(urlSafe) _acts.push(`<a class="c-act naver" href="${esc(urlSafe)}" target="_blank" rel="noopener">${ic('link')} 네이버 열기 ↗</a>`);
  else _acts.push(`<a class="c-act naver" href="${naverUrl(p)}" target="_blank" rel="noopener">${ic('map')} 네이버지도</a>`);
  _acts.push(`<button class="c-act" data-edit="${p.id}">${ic('edit')} 수정</button>`);
  _acts.push(`<button class="c-act c-act-del" data-del="${p.id}" aria-label="매물 삭제">✕ 삭제</button>`);
  return `<div class="c-actions">${_acts.join('')}</div>`;
}
/* 헤드라인 = 보증금·전용면적 (비교 1순위 정보). 부제 = 단지명·역·호선 */
function headlineText(p){
  const d=p.depositNum!=null?p.depositNum:(p.deposit!=null&&p.deposit!==''?parseFloat(p.deposit):null);
  const a=p.area!=null&&p.area!==''?parseFloat(p.area):null;
  const dTxt=(d!=null&&!isNaN(d))?`보증금 ${d}억`:'보증금 미정';
  const aTxt=(a!=null&&!isNaN(a))?`전용 ${a}㎡`:'면적 미정';
  return `${dTxt} · ${aTxt}`;
}
function subtitleText(p){
  const parts=[];
  if(p.name) parts.push(esc(p.name));
  const st=p.station||p.loc;
  if(st) parts.push(esc(st));
  if(p.line) parts.push(esc(p.line));
  return parts.join(' · ')||'정보 없음';
}
/* B-18: depositRange("4~5")에서 경고선 상한(마지막 숫자)만 추출 — 파싱 실패
   시 fallback(과거 하드코딩 5) 유지, 동작 변화 없음 */
function parseDepositUpper(rangeStr,fallback){
  const nums=String(rangeStr||'').match(/[\d.]+/g);
  if(!nums||!nums.length) return fallback;
  const last=parseFloat(nums[nums.length-1]);
  return isNaN(last)?fallback:last;
}
function commuteCardChips(cx){
  const commuters=state.settings.commuters||[];
  const current=commuters.map((commuter,i)=>{
    const commute=(cx.commutes||[])[i]||{};
    return commute.minutes!=null?{commuter,commute}:null;
  }).filter(Boolean);
  if(current.length){
    const summary=current.map(({commuter,commute})=>`${esc(commuter.name)} ${esc(commute.minutes)}분`).join(' · ');
    const changed=current.filter(({commuter,commute})=>commute.destSnapshot&&commute.destSnapshot!==commuter.dest);
    return `<span class="chip tnum">${summary}</span>`+
      changed.map(({commuter})=>`<span class="chip warn">${esc(commuter.name)} 기준지 변경됨 · 재확인 필요</span>`).join('');
  }
  const legacy=[cx.commuteGangnam,cx.commuteSinsa].map((value,i)=>{
    if(value==null||value==='') return null;
    const label=commuters[i]?.dest||`목적지 ${i+1}`;
    return `${esc(label)} ${esc(value)}`;
  }).filter(Boolean);
  return legacy.length?`<span class="chip tnum">${legacy.join(' · ')}</span>`:'';
}
/* 펼침 본문 메타칩 — 가격·면적은 헤드라인에 이미 있으므로 경고성 신호만 별도 칩으로 */
function bodyMetaChips(p){
  const chips=[];
  const dn=p.depositNum!=null?p.depositNum:parseFloat(p.deposit);
  const depositUpper=parseDepositUpper(state.profile.depositRange,5);
  if(!isNaN(dn)&&dn>depositUpper) chips.push(`<span class="chip warn tnum">예산↑? · 보증금 ${dn}억</span>`);
  const a=p.area!=null&&p.area!==''?parseFloat(p.area):null;
  const maxArea=state.profile.maxArea!=null?state.profile.maxArea:85;
  if(a!=null&&!isNaN(a)&&a>maxArea) chips.push(`<span class="chip warn tnum">전용 ${a}㎡ · 청약 영향 ⚠</span>`);
  if(p.householdGrade) chips.push(`<span class="chip">${esc(p.householdGrade)}</span>`);
  else if(p.households) chips.push(`<span class="chip tnum">${p.households}세대</span>`);
  if(p.jeonseRatio!=null) chips.push(`<span class="chip tnum">전세가율 ${p.jeonseRatio}%</span>`);
  const commuteChips=commuteCardChips(p);
  if(commuteChips) chips.push(commuteChips);
  if(p.aiScore!=null) chips.push(`<span class="chip score">AI ${p.aiScore}점</span>`);
  if(p.geocodePending&&!p.lat) chips.push('<span class="chip chip-warn">좌표확인필요</span>');
  else if(p.lat) chips.push(`<span class="chip geo">${ic('pin','ic-muted')} 위치 저장됨</span>`);
  return chips.join('');
}
let propSearchQuery='';
let expandedPropId=null;
function togglePropCard(id){
  expandedPropId = expandedPropId===id ? null : id;
  renderList();
}
/* 탭 필터·검색 — renderList()와 refreshOverview() 둘 다 같은 "보이는 집합"을 써야
   목록 필터 변경 시 지도 마커 집합도 함께 좁혀진다 (덱 스펙 "필터=지도 동기화") */
function visibleProperties(){
  let items=[...state.properties];
  if(activeTab!=='전체') items=items.filter(p=>p.status===activeTab);
  const pq=(document.getElementById('prop_search')?.value||'').trim().toLowerCase();
  if(pq) items=items.filter(p=>[p.name,p.loc,p.memo,p.station,p.line,p.householdGrade,p.households].some(v=>String(v??'').toLowerCase().includes(pq)));
  return items;
}
function renderList(){
  let items=visibleProperties();
  if(sortMode==='jeonse') items.sort((a,b)=>(a.jeonseReal??a.depositNum??999)-(b.jeonseReal??b.depositNum??999));
  else if(sortMode==='households') items.sort((a,b)=>(b.households??0)-(a.households??0));
  else if(sortMode==='ratio') items.sort((a,b)=>(a.jeonseRatio??999)-(b.jeonseRatio??999));
  else items.sort((a,b)=>(ORDER[a.status]-ORDER[b.status])||(b.created-a.created));
  const el=document.getElementById('list');
  updateUnisearch(items.length);
  /* v5 cutover: 지도는 이제 complexes[] 기준(refreshOverview는 renderComplexes()에서 호출) —
     레거시 매물 목록 자체 갱신에는 지도 리프레시가 더 이상 필요 없음 */
  if(!items.length){el.innerHTML=`<div class="empty"><div class="big">${activeTab==='전체'?'아직 등록된 매물이 없어요':'이 상태의 매물이 없어요'}</div>${activeTab==='전체'?'＋ 매물 추가로 첫 후보를 올려보세요.':'다른 탭을 눌러보세요.'}</div>`;return;}
  el.innerHTML=items.map(p=>{
    const urlSafe=p.url?safeUrl(p.url):'';
    const expanded=expandedPropId===p.id;
    const done=CHECKLIST.filter(c=>(p.checks||{})[c.id]).length;
    const pct=Math.round(done/CHECKLIST.length*100);
    const color='var('+(SC[p.status]||'--hairline')+')';
    return `<div class="card${expanded?' expanded':''}${(p.status==='탈락'||p.status==='보류')?' dim':''}" data-st="${p.status}">
    <div class="c-top" data-cardtoggle="${p.id}" role="button" tabindex="0" aria-expanded="${expanded?'true':'false'}" aria-controls="cbody-${p.id}">
      <div class="c-head-text">
        <div class="c-headline">${ic('transit','ic-muted')} ${subtitleText(p)}</div>
        <div class="c-sub tnum">${headlineText(p)}</div>
      </div>
      <div class="c-badge-col">
        <span class="pill" data-statuspill="${p.id}" style="border-left-color:${color}"><i class="pill-dot" style="background:${color}"></i>${p.status}</span>
        <div class="c-progress"><span class="c-progress-text tnum">실사 ${done}/${CHECKLIST.length}</span><span class="c-progress-track"><i style="width:${pct}%;background:${color}"></i></span></div>
      </div>
    </div>
    <div class="c-body" id="cbody-${p.id}">
      <div class="c-meta">${bodyMetaChips(p)}</div>
      ${p.img?`<img src="${esc(p.img)}" class="card-img-thumb" loading="lazy" alt="${esc(p.name||'매물')} 사진">`:''}
      ${p.memo?`<div class="c-memo sc-md-content">${renderMd(p.memo)}</div>`:''}
      ${actionsHTML(p, urlSafe)}
      ${aiBlock(p)}${checklistHTML(p)}
    </div></div>`;
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
  waitNaverMaps(()=>{
    overview.refresh(true);
    overview.panTo(new naver.maps.LatLng(p.lat,p.lng));
    reselectMarker(id);
  });
  document.getElementById('mapcard').scrollIntoView({behavior:'smooth',block:'center'});
}

const form=document.getElementById('form');
let propImgData=null;
function clearForm(){
  ['editId','f_name','f_loc','f_station','f_line','f_deposit','f_area','f_households','f_url','f_memo','pasteBox'].forEach(id=>document.getElementById(id).value='');
  if(fMemoTiptapEditor) fMemoTiptapEditor.commands.setContent('');
  tempChecks=null;tempParking=null;tempManagementFee=null;tempComplexPromotion=null;clearFormPin();
  propImgData=null;
  document.getElementById('f_img').value='';
  document.getElementById('f_imgLabel').innerHTML=ic('camera')+' 사진 추가';
  document.getElementById('f_imgPreview').style.display='none';
  document.getElementById('f_imgClear').style.display='none';
}
/* .form.open은 데스크톱에선 사이드바 안 인라인 콘텐츠(스크롤 잠글 이유 없음)지만
   모바일(<900px)에선 A안에서 지도를 안 밀어내는 position:fixed 하단시트라 배경(뒤
   리스트뷰)이 같이 스크롤되는 문제(B-12 버그3)가 있어 모바일에서만 잠금.
   _formLocked로 실제 잠갔는지를 기억해두는 이유: 폼이 열려 있는 동안 창 폭이
   모바일↔데스크톱 경계를 넘나들면 DESKTOP_MQ.matches를 open/close 시점에 각각
   다시 읽는 방식은 비대칭이 생겨(연 시점엔 모바일이라 잠갔는데 닫는 시점엔
   데스크톱이라 안 풀리는 등) 잠금이 영영 안 풀릴 수 있음 */
let _formLocked=false;
function openForm(){
  form.classList.add('open');initFormMap();document.getElementById('f_name').focus();
  if(!DESKTOP_MQ.matches){ lockBodyScroll(); _formLocked=true; }
  initFMemoEditor();
}
function closeForm(){
  form.classList.remove('open');clearForm();
  if(_formLocked){ unlockBodyScroll(); _formLocked=false; }
}
/* B-103 2-3: 매물 추가폼 메모 Tiptap 전환 — "그림자 textarea" 패턴.
   f_memo textarea는 DOM에 그대로 두되 숨기고(display:none), Tiptap
   onUpdate에서 매 변경마다 markdown을 textarea.value로 계속 동기화한다.
   이렇게 하면 저장 로직(`document.getElementById('f_memo').value`)이
   Tiptap 유무와 무관하게 그대로 동작 — properties.js의 저장 경로를
   건드리지 않아도 됨(가장 침습이 적은 방식). 폴백 시엔 textarea가
   원래대로 보이고 편집 가능해 기존과 완전히 동일 */
let fMemoTiptapEditor=null, fMemoTiptapFailed=false, fMemoTiptapInitPromise=null;
function initFMemoEditor(){
  if(fMemoTiptapEditor||fMemoTiptapFailed||fMemoTiptapInitPromise) return;
  const ta=document.getElementById('f_memo');
  if(!ta) return;
  fMemoTiptapInitPromise=(async()=>{
    const mods=await loadTiptapMods().catch(()=>null);
    if(!mods){ fMemoTiptapFailed=true; fMemoTiptapInitPromise=null; showEditorFallbackNote(ta); return; }
    let mount=document.getElementById('f_memoMount');
    if(!mount){
      mount=document.createElement('div');
      mount.id='f_memoMount';
      mount.className='sc-md-editor sc-md-content';
      mount.dataset.placeholder=ta.placeholder||''; // B-110: 기존 textarea placeholder 재사용
      ta.insertAdjacentElement('afterend',mount);
    }
    try{
      const listFixExt=buildListBackspaceFix(mods); // B-110: B-109① 전파
      const placeholderExt=buildTiptapPlaceholder(mods,mount); // B-110: B-109② 전파
      fMemoTiptapEditor=new mods.core.Editor({
        element:mount,
        extensions:[mods.starterKit,mods.Markdown,listFixExt,placeholderExt],
        content:ta.value||'',
        onUpdate:({editor})=>{ ta.value=editor.storage.markdown.getMarkdown(); },
      });
      ta.style.display='none';
      document.getElementById('f_memoPreviewToggle').style.display='none';
      document.getElementById('f_mdToolbar').style.display='none';
      document.getElementById('f_memoPreview').style.display='none';
    }catch(e){
      fMemoTiptapFailed=true; fMemoTiptapEditor=null; mount.remove();
      showEditorFallbackNote(ta);
    }
    fMemoTiptapInitPromise=null;
  })();
}
document.getElementById('toggleForm').onclick=()=>{ if(form.classList.contains('open'))closeForm(); else {clearForm();openForm();} };
document.getElementById('cancelBtn').onclick=closeForm;

let propEditId='', editMapObj=null, editMapMarker=null, editTempLatLng=null, editImgData=null;
function initEditMap(){
  const el=document.getElementById('propEditMap'); if(!el)return;
  if(editMapObj){editMapObj.refresh(true);return;}
  editMapObj=new naver.maps.Map('propEditMap',{center:new naver.maps.LatLng(37.5665,126.9780),zoom:12,zoomControl:true,zoomControlOptions:{position:naver.maps.Position.TOP_RIGHT}});
  naver.maps.Event.addListener(editMapObj,'click',e=>{
    const pos=e.coord;
    editTempLatLng={lat:pos.lat(),lng:pos.lng()};
    if(editMapMarker) editMapMarker.setMap(null);
    editMapMarker=new naver.maps.Marker({position:pos,map:editMapObj});
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
  /* B-103 2-3: em_memo는 모달이 재사용되므로(다른 매물을 열 때마다
     같은 인스턴스) sem_text와 동일 패턴 — 이미 활성이면 콘텐츠만
     교체, 아직이면 위에서 이미 채운 textarea.value를 초기값 삼아
     초기화하고 그 사이 다른 항목으로 안 바뀐 경우에만 반영 */
  if(emMemoTiptapEditor){
    emMemoTiptapEditor.commands.setContent(p.memo??'');
  } else if(!emMemoTiptapFailed){
    initEMMemoEditor().then(ok=>{
      if(ok&&propEditId===id) emMemoTiptapEditor.commands.setContent(p.memo??'');
    });
  }
  const prev=document.getElementById('em_imgPreview'), clr=document.getElementById('em_imgClear');
  if(p.img){prev.src=p.img;prev.style.display='';clr.style.display='';}
  else{prev.style.display='none';clr.style.display='none';}
  document.getElementById('em_imgLabel').innerHTML=ic('camera')+(p.img?' 사진 변경':' 사진 추가');
  document.getElementById('em_img').value='';
  openModal('propEditModal');
  setTimeout(()=>{
    initEditMap(); editMapObj.refresh(true);
    if(p.lat&&p.lng){
      const pos=new naver.maps.LatLng(p.lat,p.lng);
      editMapObj.setCenter(pos); editMapObj.setZoom(15);
      if(editMapMarker) editMapMarker.setMap(null);
      editMapMarker=new naver.maps.Marker({position:pos,map:editMapObj});
    }
  },120);
}
/* B-103 2-3: em_memo Tiptap 싱글턴 — 모달을 여러 매물에 재사용하므로
   sem_text(B-103 2-2)와 동일하게 최초 1회만 생성, 이후엔 openEdit()에서
   setContent()로 내용만 교체. 그림자 textarea 패턴은 f_memo와 동일 */
let emMemoTiptapEditor=null, emMemoTiptapFailed=false, emMemoTiptapInitPromise=null;
async function initEMMemoEditor(){
  if(emMemoTiptapEditor) return true;
  if(emMemoTiptapFailed) return false;
  if(emMemoTiptapInitPromise) return emMemoTiptapInitPromise;
  const ta=document.getElementById('em_memo');
  emMemoTiptapInitPromise=(async()=>{
    const mods=await loadTiptapMods().catch(()=>null);
    if(!mods){ emMemoTiptapFailed=true; showEditorFallbackNote(ta); return false; }
    let mount=document.getElementById('em_memoMount');
    if(!mount){
      mount=document.createElement('div');
      mount.id='em_memoMount';
      mount.className='sc-md-editor sc-md-content';
      mount.dataset.placeholder=ta.placeholder||''; // B-110: 기존 textarea placeholder 재사용
      ta.insertAdjacentElement('afterend',mount);
    }
    try{
      const listFixExt=buildListBackspaceFix(mods); // B-110: B-109① 전파
      const placeholderExt=buildTiptapPlaceholder(mods,mount); // B-110: B-109② 전파
      emMemoTiptapEditor=new mods.core.Editor({
        element:mount,
        extensions:[mods.starterKit,mods.Markdown,listFixExt,placeholderExt],
        content:ta.value||'',
        onUpdate:({editor})=>{ ta.value=editor.storage.markdown.getMarkdown(); },
      });
      ta.style.display='none';
      document.getElementById('em_memoPreviewToggle').style.display='none';
      document.getElementById('em_mdToolbar').style.display='none';
      document.getElementById('em_memoPreview').style.display='none';
      return true;
    }catch(e){
      emMemoTiptapFailed=true; emMemoTiptapEditor=null; mount.remove();
      showEditorFallbackNote(ta);
      return false;
    }
  })();
  const ok=await emMemoTiptapInitPromise;
  emMemoTiptapInitPromise=null;
  return ok;
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
      initEditMap(); editMapObj.refresh(true);
      const pos=new naver.maps.LatLng(d.lat,d.lng);
      editMapObj.setCenter(pos); editMapObj.setZoom(15);
      if(editMapMarker) editMapMarker.setMap(null);
      editMapMarker=new naver.maps.Marker({position:pos,map:editMapObj});
      this.textContent='✓ 찾았어요';
    } else {
      /* B-90: 예전엔 실패 시 아무 표시 없이 조용히 원상복구돼 클릭이 씹힌
         것처럼 보였다 — findBtn(추가 폼)과 동일하게 사람이 읽을 문구로 표시 */
      this.textContent='못 찾음 — 지도 탭';
    }
  }catch(e){ this.textContent='검색 실패 — 지도 직접 탭'; }
  setTimeout(()=>{ this.disabled=false; this.innerHTML=ic('pin')+' 위치 자동 찾기'; },1600);
};
document.getElementById('em_img').onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  compressImage(f,dataUrl=>{
    editImgData=dataUrl;
    const prev=document.getElementById('em_imgPreview');
    prev.src=dataUrl; prev.style.display='';
    document.getElementById('em_imgLabel').innerHTML=ic('camera')+' '+esc(f.name);
    document.getElementById('em_imgClear').style.display='';
  });
};
document.getElementById('em_imgClear').onclick=()=>{
  editImgData=''; document.getElementById('em_img').value='';
  document.getElementById('em_imgPreview').style.display='none';
  document.getElementById('em_imgLabel').innerHTML=ic('camera')+' 사진 추가';
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
/* B-97: 매물 메모 미리보기 — 자산 노트(an_previewToggle) 패턴 재사용,
   접기 아닌 명시 토글 버튼(UI 원칙). renderMd+DOMPurify 경로 그대로.
   element를 직접 받아 고정 ID(f_memo·em_memo)·행별 동적 요소(수정모드
   listing memo) 양쪽에서 재사용 */
function memoPreviewToggle(btn,ta,prev,toolbar){
  const on=prev.style.display==='none';
  prev.style.display=on?'':'none';
  ta.style.display=on?'none':'';
  if(toolbar) toolbar.style.display=on?'none':'';
  btn.classList.toggle('on',on);
  btn.innerHTML=on?ic('edit')+' 편집':ic('eye')+' 미리보기';
  if(on) prev.innerHTML=renderMd(ta.value)||'<span style="color:var(--ink-faint);font-size:12px;">내용을 입력하면 미리보기가 표시됩니다.</span>';
}
document.getElementById('f_memoPreviewToggle').onclick=function(){
  memoPreviewToggle(this,document.getElementById('f_memo'),document.getElementById('f_memoPreview'),document.getElementById('f_mdToolbar'));
};
document.getElementById('em_memoPreviewToggle').onclick=function(){
  memoPreviewToggle(this,document.getElementById('em_memo'),document.getElementById('em_memoPreview'),document.getElementById('em_mdToolbar'));
};
document.getElementById('f_img').onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  compressImage(f,dataUrl=>{
    propImgData=dataUrl;
    const prev=document.getElementById('f_imgPreview');
    prev.src=dataUrl; prev.style.display='';
    document.getElementById('f_imgLabel').innerHTML=ic('camera')+' '+esc(f.name);
    document.getElementById('f_imgClear').style.display='';
  });
};
document.getElementById('f_imgClear').onclick=()=>{
  propImgData='';
  document.getElementById('f_img').value='';
  document.getElementById('f_imgPreview').style.display='none';
  document.getElementById('f_imgLabel').innerHTML=ic('camera')+' 사진 추가';
  document.getElementById('f_imgClear').style.display='none';
};
document.getElementById('saveBtn').onclick=async()=>{
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
  /* B-90: 매칭 제안 모달이 뜨면 사용자 선택을 기다리는 동안(그리고 예전엔
     지오코딩 응답까지) 버튼에 아무 표시가 없어 클릭이 무시된 것처럼 보였고,
     그 사이 버튼이 계속 눌려 있어 두 번 클릭하면 매물이 중복 생성됐다 —
     disabled로 막고 진행 중임을 표시, finally로 취소·에러 시에도 항상 복구 */
  const btn=document.getElementById('saveBtn');
  btn.disabled=true; const old=btn.textContent; btn.textContent='처리 중…';
  try{
    if(existing){
      Object.assign(existing,data);
    } else {
      /* v5 stage5a: 신규 매물은 properties[]가 아니라 단지(complexes)/매물(listings)
         2계층으로 라우팅. properties[]는 기존 데이터 백업용으로 손대지 않는다 */
      const saved=await saveAsComplexListing(data);
      /* B-19확: 매칭 제안에서 "취소"를 고르면 저장을 중단하고 폼을 그대로 둔다
         (입력값 유실 방지) */
      if(saved===false) return;
    }
    closeForm(); save(); renderProps(); refreshOverview();
  } finally {
    btn.disabled=false; btn.textContent=old;
  }
};
/* 파싱·입력 UX는 그대로, 저장 목적지만 단지/매물로 변경(Stage2 규칙 재사용) */
/* B-19확: 완전일치(mergeKey) 실패 시에만 퍼지 후보를 확인, 있으면 사용자에게
   제안 모달을 띄운다 — "취소" 선택 시 false를 반환해 호출부가 폼을 닫지 않고
   유지하게 한다(입력값 유실 방지) */
async function saveAsComplexListing(data){
  const {complexName,groupCode,dongHo}=migParseName(data.name);
  const loc=data.loc||'';
  const geocodeQuery=buildGeocodeQuery(loc,complexName);
  const mergeKey=normalizeStr(complexName)+'|'+normalizeStr(loc||data.station||'');
  let cx=state.complexes.find(c=>normalizeStr(c.complexName)+'|'+normalizeStr(c.loc||c.station||'')===mergeKey);

  if(!cx){
    const candidates=findComplexCandidates(complexName,data.lat,data.lng);
    if(candidates.length){
      const choice=await showComplexMatchPrompt(candidates,complexName||data.name);
      if(choice==='cancel') return false;
      if(choice!=='new') cx=state.complexes.find(c=>c.id===choice)||null;
    }
  }
  const isNewComplex=!cx;

  if(isNewComplex){
    const hh=data.households?parseInt(data.households)||null:null;
    const now=new Date().toISOString();
    cx={
      id:'cx'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
      complexName:complexName||data.name, loc, geocodeQuery, groupCode, regionGroup:'',
      station:data.station||'', line:data.line||'',
      yearBuilt:null, households:hh, householdGrade:hh?calcHouseholdGrade(hh,state.settings.grades):'',
      commuteGangnam:null, commuteSinsa:null,
      complexStatus:migComplexStatus(data.status),
      lat:data.lat??null, lng:data.lng??null,
      memo:data.memo||'',
      /* B-28: 붙여넣기 파싱이 세대당 주차대수를 읽었을 때만 known으로 승격 —
         파싱 실패(unknown) 시 사용자가 단지 상세에서 직접 입력 */
      parking:tempParking!=null?tempParking:null,
      parkingState:tempParking!=null?'known':'unknown',
      pros:'', cons:'', verdict:'', favorite:false,
      commutes:defaultComplexCommutes(), commuteMemo:'',
      fieldNote:defaultComplexFieldNote(),
      createdAt:now, updatedAt:now,
    };
    state.complexes.push(cx);
    /* B-90: 예전엔 이 지오코딩 응답을 기다린 뒤에야 폼이 닫히고 목록에
       반영됐다 — 네이버 API가 느리거나(레이트리밋 등) 오류를 반환하면
       저장 자체가 몇 초씩 멈춘 것처럼 보였다("추가해도 반영 안 됨"·
       "스크롤 안 먹음" 신고와 일치). 좌표는 미확정으로 먼저 저장하고,
       지오코딩은 백그라운드에서 마저 진행해 성공하면 그때 반영 */
    if(!(cx.lat&&cx.lng)){
      geocode(geocodeQuery).then(j=>{
        if(j.found){ cx.lat=j.lat; cx.lng=j.lng; save(); renderComplexes(); refreshOverview(); }
      }).catch(()=>{/* 좌표 확인 필요 상태로 남음 */});
    }
  } else {
    applyComplexPromotion(cx,tempComplexPromotion);
  }

  const areaNum=data.area!=null&&data.area!==''?parseFloat(data.area):null;
  const areaVal=(areaNum!=null&&!isNaN(areaNum))?areaNum:null;
  const depositVal=data.deposit?parseEok(data.deposit):null;
  /* B-20: 임포트 경로가 이미 쓰는 listingExists() 재사용 — 자동 차단이 아니라
     확인만, 사용자가 강행 가능(취소 시 저장 중단, 폼 유지) */
  if(listingExists(cx.id,data.url||'',dongHo,areaVal,depositVal)){
    if(!confirm('같은 동호수·보증금 매물이 있어요. 그래도 추가할까요?')) return false;
  }
  const isFirstListing=state.listings.filter(l=>l.complexId===cx.id).length===0;
  const now2=new Date().toISOString();
  state.listings.push({
    id:'lst'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    complexId:cx.id, source:'', url:data.url||'',
    capturedAt:now2, lastCheckedAt:now2,
    dongHo, areaM2:areaVal,
    areaText:data.area?String(data.area):'', areaGrade:'',
    deposit:depositVal,
    /* B-28: 붙여넣기 파싱이 관리비(만원)를 읽었을 때만 known으로 승격 */
    managementFee:tempManagementFee!=null?tempManagementFee:null,
    managementFeeState:tempManagementFee!=null?'known':'unknown',
    listingStatus:'게시중',
    isRepresentative:isFirstListing,
    memo:data.memo||'',
    safety:defaultListingSafety(),
    history:[{at:now2,deposit:depositVal,listingStatus:'게시중',source:'create'}],
  });

  toast(isNewComplex
    ? `새 단지 "${cx.complexName}"가 등록됐어요${(cx.lat&&cx.lng)?'':' · 좌표 확인 필요'}`
    : `기존 단지 "${cx.complexName}"에 매물이 추가됐어요`);
  tempParking=null; tempManagementFee=null; tempComplexPromotion=null;
  return true;
}
function delProp(id){if(!confirm('이 매물을 삭제할까요?'))return;state.properties=state.properties.filter(x=>x.id!==id);save();renderProps();refreshOverview();}

document.getElementById('list').addEventListener('click',e=>{
  const pill=e.target.closest('.pill');
  if(pill){
    const p=state.properties.find(x=>x.id===pill.dataset.statuspill); if(!p)return;
    showStatusPicker(pill, p);
    return;
  }
  const item=e.target.closest('.ck-item');
  if(item){
    if(e.target.closest('a')) return;
    const [pid,cid]=item.dataset.ck.split('|');
    const p=state.properties.find(x=>x.id===pid); if(!p)return;
    p.checks=p.checks||{}; p.checks[cid]=!p.checks[cid];
    item.dataset.on=p.checks[cid]?'1':'0';
    const done=CHECKLIST.filter(c=>p.checks[c.id]).length;
    const card=item.closest('.card');
    const label=card.querySelector('.ck-label'); if(label) label.textContent=`실사 체크 ${done}/${CHECKLIST.length}`;
    const progText=card.querySelector('.c-progress-text'); if(progText) progText.textContent=`실사 ${done}/${CHECKLIST.length}`;
    const progBar=card.querySelector('.c-progress-track i'); if(progBar) progBar.style.width=Math.round(done/CHECKLIST.length*100)+'%';
    save(); return;
  }
  const ctoggle=e.target.closest('[data-cardtoggle]');
  if(ctoggle){ togglePropCard(ctoggle.dataset.cardtoggle); return; }
});
document.getElementById('list').addEventListener('keydown',e=>{
  if(e.key!=='Enter'&&e.key!==' ') return;
  const ctoggle=e.target.closest('[data-cardtoggle]');
  if(ctoggle){ e.preventDefault(); togglePropCard(ctoggle.dataset.cardtoggle); }
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
/* 통합검색 — 입력값에 따라 "내 목록 N곳" 안내 갱신 */
function updateUnisearch(matchCount){
  const input=document.getElementById('prop_search'); if(!input) return;
  const q=input.value.trim();
  const resultEl=document.getElementById('unisearchResult');
  const textEl=document.getElementById('unisearchText');
  if(resultEl) resultEl.style.display=q?'':'none';
  if(textEl&&q) textEl.innerHTML=`내 목록 <b>${matchCount}곳</b> 검색됨`;
}

function renderProps(){renderStats();renderTabs();renderList();renderWeights();renderComplexes();}

(()=>{ const ps=document.getElementById('prop_search'); if(ps) ps.addEventListener('input',()=>{renderList();renderComplexes();}); })();


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
/* v5 stage6a: 내보내기 공용 헬퍼 — CSV injection 이스케이프(=,+,-,@)·BOM 유지 로직을
   단지/매물/통합/레거시 4개 내보내기가 공유 */
function csvCell(v,fmt){
  const s=String(v==null?'':v);
  const danger=fmt==='csv'?/[,\n"]/.test(s):(/[\t\n"]/.test(s));
  if(danger||/^[=+\-@]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
  return s;
}
function downloadDelimited(filename,cols,rows,fmt){
  const sep=fmt==='csv'?',':'\t';
  const content=[cols.join(sep),...rows.map(r=>r.map(v=>csvCell(v,fmt)).join(sep))].join('\n');
  const mime=fmt==='csv'?'text/csv':'text/tab-separated-values';
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['﻿'+content],{type:mime+';charset=utf-8'}));
  a.download=filename+(fmt==='csv'?'.csv':'.tsv');
  a.click(); URL.revokeObjectURL(a.href);
}
/* 레거시(기존 매물) 내보내기 — properties[] 원본, 컬럼 구성은 기존과 동일(회귀 없음) */
function exportProps(fmt){
  const COLS=['단지명','위치','역','호선','전세호가(억)','전세호가숫자','매매호가','전용면적','세대수','세대수등급','준공년도','전세가율(%)','강남출퇴근','신사출퇴근','상태','URL','메모','메모2'];
  const rows=state.properties.map(p=>[
    p.name||'',p.loc||'',p.station||'',p.line||'',
    p.jeonseReal!=null?p.jeonseReal:'',p.depositNum!=null?p.depositNum:'',
    p.saleReal!=null?p.saleReal:'',
    p.area!=null?p.area:'',p.households!=null?p.households:'',p.householdGrade||'',p.yearBuilt||'',
    p.jeonseRatio!=null?p.jeonseRatio:'',
    p.commuteGangnam||'',p.commuteSinsa||'',p.status||'',p.url||'',p.memo||'',''
  ]);
  downloadDelimited('매물목록(레거시)_'+new Date().toISOString().slice(0,10),COLS,rows,fmt);
}
/* 단지 목록 내보내기 — complexes[] 기준 */
function exportComplexes(fmt){
  const COLS=['단지ID','탐색그룹코드','탐색그룹명','단지명','지역','역/도보','노선','준공연도','세대수','세대수등급','강남역','신사역','단지상태','메모'];
  const rows=state.complexes.map(cx=>[
    cx.id,cx.groupCode||'',cx.regionGroup||'',cx.complexName||'',cx.loc||'',
    cx.station||'',cx.line||'',cx.yearBuilt??'',cx.households??'',cx.householdGrade||'',
    cx.commuteGangnam??'',cx.commuteSinsa??'',cx.complexStatus||'',cx.memo||''
  ]);
  downloadDelimited('단지목록_'+new Date().toISOString().slice(0,10),COLS,rows,fmt);
}
/* 매물 목록 내보내기 — listings[] 기준. 전세보증금은 deposit 단일 컬럼(B-06) */
function exportListings(fmt){
  const cxNameById=new Map(state.complexes.map(cx=>[cx.id,cx.complexName||'']));
  const COLS=['매물ID','단지ID','단지명','동/호','전용면적','면적등급','전세보증금','매물상태','대표매물여부','수집일','최근확인일','링크','메모'];
  const rows=state.listings.map(l=>[
    l.id,l.complexId||'',cxNameById.get(l.complexId)||'',
    l.dongHo||'',l.areaM2??'',l.areaGrade||calcAreaGrade(l.areaM2,state.settings.grades)||'',
    l.deposit??'',l.listingStatus||'',l.isRepresentative?'Y':'N',
    l.capturedAt?l.capturedAt.slice(0,10):'',l.lastCheckedAt?l.lastCheckedAt.slice(0,10):'',
    l.url||'',l.memo||''
  ]);
  downloadDelimited('매물목록_'+new Date().toISOString().slice(0,10),COLS,rows,fmt);
}
/* 단지+대표매물 통합 내보내기 — 단지 1행당 대표매물(없으면 첫 매물) 핵심 정보만 붙여 요약 */
function exportComplexesWithRep(fmt){
  const COLS=['단지ID','단지명','지역','역/도보','노선','세대수','세대수등급','준공연도','강남역','신사역','단지상태','대표매물동호','대표매물전용면적','대표매물전세보증금','대표매물상태','대표매물링크','단지메모'];
  const rows=state.complexes.map(cx=>{
    const rep=cxRepOf(cx);
    return [
      cx.id,cx.complexName||'',cx.loc||'',cx.station||'',cx.line||'',
      cx.households??'',cx.householdGrade||'',cx.yearBuilt??'',
      cx.commuteGangnam??'',cx.commuteSinsa??'',cx.complexStatus||'',
      rep?rep.dongHo||'':'',rep?rep.areaM2??'':'',rep?rep.deposit??'':'',
      rep?rep.listingStatus||'':'',rep?rep.url||'':'',cx.memo||''
    ];
  });
  downloadDelimited('단지_대표매물_통합_'+new Date().toISOString().slice(0,10),COLS,rows,fmt);
}
/* 내보내기 드롭다운(B-10) — 기존 showRouteMenu와 동일한 status-picker 플로팅 메뉴 패턴 재사용 */
let _exportMenu=null;
function closeExportMenu(){ if(_exportMenu){ _exportMenu.remove(); _exportMenu=null; } }
function showExportMenu(btn){
  if(_exportMenu){ closeExportMenu(); return; }
  let fmt='csv';
  const menu=document.createElement('div');
  menu.className='status-picker route-menu';
  menu.innerHTML=`
    <div class="rm-item">
      <button type="button" class="sp-opt on" data-fmt="csv">CSV</button>
      <button type="button" class="sp-opt" data-fmt="tsv">TSV</button>
    </div>
    <div class="rm-sep"></div>
    <button class="sp-opt" data-exp="cx">단지 목록</button>
    <button class="sp-opt" data-exp="listing">매물 목록</button>
    <button class="sp-opt" data-exp="combined">단지+대표매물 통합</button>
    <button class="sp-opt" data-exp="legacy">레거시(기존 매물)</button>
  `;
  document.body.appendChild(menu);
  _exportMenu=menu;
  const rect=btn.getBoundingClientRect();
  menu.style.top=(rect.bottom+window.scrollY+4)+'px';
  menu.style.left=Math.max(8,Math.min(rect.left+window.scrollX, window.innerWidth-240))+'px';
  menu.querySelectorAll('[data-fmt]').forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    fmt=b.dataset.fmt;
    menu.querySelectorAll('[data-fmt]').forEach(x=>x.classList.toggle('on',x===b));
  });
  menu.querySelectorAll('[data-exp]').forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    const kind=b.dataset.exp;
    closeExportMenu();
    if(kind==='cx') exportComplexes(fmt);
    else if(kind==='listing') exportListings(fmt);
    else if(kind==='combined') exportComplexesWithRep(fmt);
    else if(kind==='legacy') exportProps(fmt);
  });
  const close=ev=>{ if(!menu.contains(ev.target)&&ev.target!==btn){ closeExportMenu(); document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
}
document.getElementById('propExportBtn').onclick=e=>showExportMenu(e.currentTarget);


/* ============ 내보내기 / 가져오기 ============ */
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{
  closeModal(b.dataset.close);
  /* B-117: 단지 상세를 닫으면 옆/위에 열려있던 매물 상세 사이드 패널도 같이 정리 —
     안 그러면 다음에 이 단지(혹은 다른 단지)를 다시 열었을 때 이전 매물의 패널이
     잠깐 남아있는 상태로 보일 수 있음(cxListingDetailId가 stale) */
  if(b.dataset.close==='complexDetailModal') closeListingDetail();
});
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{
  if(e.target===m){
    m.classList.remove('open');
    if(m.id==='complexDetailModal') closeListingDetail();
  }
}));

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
/* B-18: calcHouseholdGrade는 utils.js(GRADE_DEFAULTS와 함께 정의)로 이동 —
   state.js의 applyGuards()에서도 같은 함수를 써야 해서 두 파일보다 먼저
   로드되는 utils.js가 단일 소스. 여기 정의를 남겨두면 로드 순서상 이 파일이
   나중에 덮어써 utils.js 쪽이 죽은 코드가 되므로 반드시 제거해야 함 */
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
      households:hh,householdGrade:hh?calcHouseholdGrade(hh,state.settings.grades):'',
      area,deposit,depositNum,jeonseReal,saleReal,jeonseRatio,
      commuteGangnam:c(10)||null,commuteSinsa:c(11)||null,
      status:mapImportStatus(c(12)),
      url:safeUrl(c(13)),memo:c(14),
    };
  });
}

/* v5 stage5b: 상태 매핑 — parseTSV()의 mapImportStatus()가 이미 한 번 정규화한
   값(관심/검토중/문의예정/방문예정/후보/보류/탈락)을 입력받아 단지 상태 어휘로 재매핑 */
function mapCxImportStatus(s){
  const statusMap={관심:'관심',검토중:'검토중',후보:'후보',후보확정:'후보',
    문의예정:'문의예정',방문예정:'임장예정',임장예정:'임장예정',보류:'보류',탈락:'탈락'};
  return statusMap[s]||'관심';
}
/* 단지/매물 중복 판정 공용 헬퍼 — Stage5b TSV 프리뷰·migApply 재실행 idempotency
   가드가 공통으로 씀. 단지 중복: normalize(complexName)+'|'+normalize(loc||station).
   매물 중복: URL 우선(없으면 complexId+dongHo+areaM2+deposit 조합) */
function cxMergeKey(complexName,loc,station){
  return normalizeStr(complexName)+'|'+normalizeStr(loc||station||'');
}
function findExistingComplexId(complexName,loc,station){
  const key=cxMergeKey(complexName,loc,station);
  const found=state.complexes.find(cx=>cxMergeKey(cx.complexName,cx.loc,cx.station)===key);
  return found?found.id:null;
}
function cxListingDupKey(cxId,url,dongHo,areaM2,deposit){
  return url
    ?cxId+'|url:'+normalizeStr(url)
    :cxId+'|'+normalizeStr(dongHo)+'|'+normalizeStr(areaM2==null?'':String(areaM2))+'|'+normalizeStr(deposit==null?'':String(deposit));
}
function listingExists(cxId,url,dongHo,areaM2,deposit){
  const key=cxListingDupKey(cxId,url,dongHo,areaM2,deposit);
  return state.listings.some(l=>cxListingDupKey(l.complexId,l.url,l.dongHo,l.areaM2,l.deposit)===key);
}
/* geocodeQuery엔 지오코딩 정확도를 위해 "서울" 리전 컨텍스트를 항상 포함(중복 접두 방지) */
function buildGeocodeQuery(loc,complexName){
  const base=`${loc||''} ${complexName||''}`.trim();
  return /^서울/.test(base)?base:`서울 ${base}`.trim();
}
/* B-19확: 단지명 퍼지 비교 전용 — normalizeStr()보다 공격적으로 정규화(괄호와
   내용·끝의 "아파트" 접미사·모든 공백 제거). cxMergeKey() 등 기존 완전일치
   dedup 로직은 그대로 두고, 이 함수는 오직 "비슷한 단지 후보" 탐색에만 씀 —
   완전일치가 실패했을 때만 호출돼 제안 후보를 찾는 용도(자동 배정 아님) */
function fuzzyComplexName(name){
  return String(name||'')
    .replace(/\([^)]*\)/g,'')
    .replace(/아파트\s*$/,'')
    .replace(/\s+/g,'')
    .toLowerCase()
    .trim();
}
/* 매칭 기준 ①이름 유사(퍼지 완전일치) ②좌표 근접(300m) — 둘 중 하나라도 걸리면
   후보. 여러 개면 전부 반환, 최종 선택은 항상 사용자(showComplexMatchPrompt) */
const CX_MATCH_RADIUS_M=300;
function findComplexCandidates(complexName,lat,lng){
  const fz=fuzzyComplexName(complexName);
  const out=[];
  state.complexes.forEach(cx=>{
    const nameMatch=!!fz && fuzzyComplexName(cx.complexName)===fz;
    const distMatch=(lat!=null&&lng!=null&&cx.lat!=null&&cx.lng!=null)
      &&haversineM({lat,lng},{lat:cx.lat,lng:cx.lng})<=CX_MATCH_RADIUS_M;
    if(nameMatch||distMatch) out.push({cx,nameMatch,distMatch});
  });
  return out;
}
function cxMatchReason(c){
  return [c.nameMatch?'이름 유사':null, c.distMatch?'위치 근접':null].filter(Boolean).join(' · ');
}
/* B-19확: "이 단지에 추가할까요?" 제안 모달 — 자동 병합 금지, 사용자가 후보
   버튼을 누르거나 "새 단지로 만들기"/"취소"를 눌러야만 진행. properties.js
   외 파일 무접촉 제약(B-69와 파일 조율)이라 HTML/CSS 신규 파일 없이 여기서
   동적 주입, 기존 .modal/.mhead/.mbody/.mfoot 스타일과 --ink-soft 토큰만 재사용 */
(function cxMatchInjectUI(){
  document.body.insertAdjacentHTML('beforeend',`
    <div class="modal" id="cxMatchModal">
      <div class="box">
        <div class="mhead"><h3>비슷한 단지를 찾았어요</h3></div>
        <div class="mbody">
          <p class="mdesc" id="cxMatchDesc"></p>
          <div id="cxMatchCandidates"></div>
        </div>
        <div class="mfoot">
          <button class="btn-ghost" id="cxMatchCancelBtn">취소</button>
          <button class="btn-ghost" id="cxMatchNewBtn">새 단지로 만들기</button>
        </div>
      </div>
    </div>`);
  const modal=document.getElementById('cxMatchModal');
  modal.addEventListener('click',e=>{ if(e.target===modal) cxMatchCleanup('cancel'); });
})();
let _cxMatchResolve=null;
function cxMatchCleanup(result){
  document.getElementById('cxMatchCandidates').querySelectorAll('[data-cxid]').forEach(b=>b.onclick=null);
  closeModal('cxMatchModal');
  const resolve=_cxMatchResolve; _cxMatchResolve=null;
  if(resolve) resolve(result);
}
function showComplexMatchPrompt(candidates,complexName){
  return new Promise(resolve=>{
    _cxMatchResolve=resolve;
    document.getElementById('cxMatchDesc').innerHTML=
      `"<b>${esc(complexName||'')}</b>"과(와) 비슷한 단지를 찾았어요. 기존 단지에 매물을 추가할까요?`;
    document.getElementById('cxMatchCandidates').innerHTML=candidates.map(c=>
      `<button type="button" class="btn-ghost" data-cxid="${esc(c.cx.id)}" style="display:block;width:100%;text-align:left;margin-bottom:8px;padding:10px 12px;">
        <div style="font-weight:700;">${esc(c.cx.complexName||'(이름 없음)')}</div>
        <div style="font-size:11.5px;color:var(--ink-soft);margin-top:2px;">${esc(c.cx.loc||'주소 정보 없음')}${cxMatchReason(c)?' · '+esc(cxMatchReason(c)):''}</div>
      </button>`
    ).join('');
    document.getElementById('cxMatchCandidates').querySelectorAll('[data-cxid]').forEach(b=>{
      b.onclick=()=>cxMatchCleanup(b.dataset.cxid);
    });
    document.getElementById('cxMatchNewBtn').onclick=()=>cxMatchCleanup('new');
    document.getElementById('cxMatchCancelBtn').onclick=()=>cxMatchCleanup('cancel');
    openModal('cxMatchModal');
  });
}
/* ============ B-118: 단지 병합 도구 (사후 정리 — B-19확 매칭 제안에도 불구하고
   표기 차이로 실제 발생한 중복 단지, 실사례: 가양6단지 2개) ============
   자동 병합 절대 금지 — 후보 선택→방향 선택→필드 충돌 미리보기 3단계 전부
   사용자가 직접 확정해야 다음으로 진행된다. findComplexCandidates/cxMatchReason
   (B-19확)를 그대로 재사용해 후보 로직을 중복 구현하지 않았다. */
let cxMergeState=null;
/* 병합 전 필수 스냅샷 — 실행 취소 기능은 없지만 복구 원본은 반드시 남긴다는
   지시에 따라, 두 단지+소속 매물 전체를 localStorage 별도 키에 저장(기존
   makeBackup()의 "state 전체를 JSON으로 담는" 방식과 동일한 발상을 병합
   대상만으로 스코프를 좁혀 재사용). 실패(용량 초과 등)하면 null을 반환해
   호출부가 병합 자체를 중단하게 한다 */
function backupBeforeMerge(keep,drop){
  try{
    const payload={
      v:1, savedAt:new Date().toISOString(), reason:'cxMerge',
      complexes:[keep,drop].map(c=>JSON.parse(JSON.stringify(c))),
      listings:state.listings.filter(l=>l.complexId===keep.id||l.complexId===drop.id).map(l=>JSON.parse(JSON.stringify(l))),
    };
    const key='sh_mergeBackup_'+Date.now();
    localStorage.setItem(key,JSON.stringify(payload));
    return key;
  }catch(e){ return null; }
}
const CX_MERGE_FILL_FIELDS=['loc','geocodeQuery','groupCode','regionGroup','station','line','yearBuilt','commuteGangnam','commuteSinsa','memo','pros','cons','verdict','commuteMemo'];
const CX_MERGE_FIELD_LABELS={loc:'주소',geocodeQuery:'지오코딩 검색어',groupCode:'탐색그룹코드',regionGroup:'탐색그룹명',station:'역/도보',line:'노선',yearBuilt:'준공연도',commuteGangnam:'강남역(레거시)',commuteSinsa:'신사역(레거시)',memo:'단지 메모',pros:'장점',cons:'단점',verdict:'한줄 판단',commuteMemo:'출퇴근 메모',households:'세대수',coords:'좌표',parking:'주차(세대당)',favorite:'즐겨찾기'};
/* 병합 미리보기 계산 — keep/drop을 그대로 두고 얕은 복사본(merged)만 만들어
   반환하는 순수 함수. 실행(cxMergeExecute)이 이 결과를 실제 state에 적용한다.
   규칙: 남길 값 기본, keep 쪽이 빈 값일 때만 drop 값으로 보충(자동 판정 아님 —
   단순 빈값 채움, confirm 전 화면에 전부 노출) */
function cxComputeMerge(keep,drop){
  const merged=Object.assign({},keep);
  const filledFrom={};
  const isBlank=v=>v==null||v==='';
  CX_MERGE_FILL_FIELDS.forEach(f=>{
    if(isBlank(merged[f])&&!isBlank(drop[f])){ merged[f]=drop[f]; filledFrom[f]='drop'; }
  });
  if(isBlank(merged.households)&&!isBlank(drop.households)){
    merged.households=drop.households; merged.householdGrade=drop.householdGrade; filledFrom.households='drop';
  }
  if((merged.lat==null||merged.lng==null)&&drop.lat!=null&&drop.lng!=null){
    merged.lat=drop.lat; merged.lng=drop.lng; filledFrom.coords='drop';
  }
  if((!merged.parkingState||merged.parkingState==='unknown')&&drop.parkingState&&drop.parkingState!=='unknown'){
    merged.parking=drop.parking; merged.parkingState=drop.parkingState; filledFrom.parking='drop';
  }
  const favoriteMerged=!!(keep.favorite||drop.favorite);
  if(favoriteMerged&&!keep.favorite) filledFrom.favorite='drop';
  merged.favorite=favoriteMerged;
  merged.commutes=(keep.commutes||[]).map((c,i)=>{
    const dc=(drop.commutes||[])[i];
    const blank=!c||(c.minutes==null&&c.transfers==null&&!c.destSnapshot);
    if(blank&&dc&&(dc.minutes!=null||dc.transfers!=null||dc.destSnapshot)){
      filledFrom['commute'+i]='drop';
      return Object.assign({},dc);
    }
    return Object.assign({},c||{minutes:null,transfers:null,destSnapshot:''});
  });
  return {merged,filledFrom};
}
function cxMergeCandidateBtnHTML(cx,reason){
  return `<button type="button" class="btn-ghost" data-cxmergepick="${esc(cx.id)}" style="display:block;width:100%;text-align:left;margin-bottom:8px;padding:10px 12px;">
    <div style="font-weight:700;">${esc(cx.complexName||'(이름 없음)')}</div>
    <div style="font-size:11.5px;color:var(--ink-soft);margin-top:2px;">${esc(cx.loc||'주소 정보 없음')}${reason?' · '+esc(reason):''}</div>
  </button>`;
}
function cxMergeRenderStep1(){
  const cx=state.complexes.find(c=>c.id===cxMergeState.sourceId); if(!cx){ cxMergeCancel(); return; }
  const candidates=findComplexCandidates(cx.complexName,cx.lat,cx.lng).filter(c=>c.cx.id!==cx.id);
  document.getElementById('cxMergeTitle').textContent='병합할 단지 선택';
  document.getElementById('cxMergeBody').innerHTML=`
    <p class="mdesc">"<b>${esc(cx.complexName||'(이름 없음)')}</b>"과(와) 병합할 다른 단지를 선택하세요. 목록에
    없으면 아래에서 검색하세요.</p>
    ${candidates.length?`<div class="cx-dt" style="margin:10px 0 6px">근접·이름 유사 후보</div>
      ${candidates.map(c=>cxMergeCandidateBtnHTML(c.cx,cxMatchReason(c))).join('')}`:''}
    <div class="cx-dt" style="margin:10px 0 6px">직접 검색</div>
    <input type="text" id="cxMergeSearchInput" placeholder="단지명·주소 검색">
    <div id="cxMergeSearchResults" style="margin-top:8px"></div>
    <div class="c-actions" style="margin-top:14px">
      <button type="button" class="btn-ghost" id="cxMergeCancelBtn1">취소</button>
    </div>`;
  document.getElementById('cxMergeCancelBtn1').onclick=cxMergeCancel;
  document.getElementById('cxMergeBody').querySelectorAll('[data-cxmergepick]').forEach(b=>{
    b.onclick=()=>{ cxMergeState.targetId=b.dataset.cxmergepick; cxMergeState.step=2; cxMergeRenderStep2(); };
  });
  const searchInput=document.getElementById('cxMergeSearchInput');
  const renderSearch=()=>{
    const q=normalizeStr(searchInput.value);
    const wrap=document.getElementById('cxMergeSearchResults');
    if(!q){ wrap.innerHTML=''; return; }
    const results=state.complexes.filter(c=>c.id!==cx.id&&
      (normalizeStr(c.complexName).includes(q)||normalizeStr(c.loc).includes(q))).slice(0,20);
    wrap.innerHTML=results.length
      ?results.map(c=>cxMergeCandidateBtnHTML(c,'')).join('')
      :'<p style="font-size:12px;color:var(--ink-soft)">검색 결과가 없어요.</p>';
    wrap.querySelectorAll('[data-cxmergepick]').forEach(b=>{
      b.onclick=()=>{ cxMergeState.targetId=b.dataset.cxmergepick; cxMergeState.step=2; cxMergeRenderStep2(); };
    });
  };
  searchInput.addEventListener('input',renderSearch);
}
function cxMergeRenderStep2(){
  const a=state.complexes.find(c=>c.id===cxMergeState.sourceId);
  const b=state.complexes.find(c=>c.id===cxMergeState.targetId);
  if(!a||!b){ cxMergeCancel(); return; }
  document.getElementById('cxMergeTitle').textContent='어느 쪽을 남길까요?';
  document.getElementById('cxMergeBody').innerHTML=`
    <p class="mdesc">두 단지 중 남길 단지를 고르세요. 남기는 쪽 정보가 기본이 되고, 빈 항목만
    사라지는 쪽 정보로 채워요. 다음 화면에서 자세히 확인할 수 있어요.</p>
    ${cxMergeCandidateBtnHTML(a,'매물 '+state.listings.filter(l=>l.complexId===a.id).length+'건')}
    ${cxMergeCandidateBtnHTML(b,'매물 '+state.listings.filter(l=>l.complexId===b.id).length+'건')}
    <div class="c-actions" style="margin-top:6px">
      <button type="button" class="btn-ghost" id="cxMergeBackBtn2">뒤로</button>
      <button type="button" class="btn-ghost" id="cxMergeCancelBtn2">취소</button>
    </div>`;
  document.getElementById('cxMergeBody').querySelectorAll('[data-cxmergepick]').forEach(btn=>{
    btn.onclick=()=>{
      const keepId=btn.dataset.cxmergepick;
      cxMergeState.keepId=keepId;
      cxMergeState.dropId=keepId===a.id?b.id:a.id;
      cxMergeState.step=3;
      cxMergeRenderStep3();
    };
  });
  document.getElementById('cxMergeBackBtn2').onclick=()=>{ cxMergeState.step=1; cxMergeRenderStep1(); };
  document.getElementById('cxMergeCancelBtn2').onclick=cxMergeCancel;
}
function cxMergeFieldRowsHTML(keep,drop,filledFrom){
  const rows=[];
  const push=(label,val,filled)=>rows.push(`<div class="cx-dl">
    <div class="cx-dt">${esc(label)}${filled?' <span style="color:var(--ink-faint);font-weight:600;">(상대 단지 값으로 채움)</span>':''}</div>
    <div class="cx-dd">${val!=null&&val!==''?esc(String(val)):'—'}</div>
  </div>`);
  const {merged}=cxComputeMerge(keep,drop);
  push('단지명(유지)',merged.complexName,false);
  CX_MERGE_FILL_FIELDS.forEach(f=>{
    const label=CX_MERGE_FIELD_LABELS[f]||f;
    if(isBlankBoth(keep[f],drop[f])) return;
    push(label,merged[f],filledFrom[f]==='drop');
  });
  push('세대수',merged.households!=null?merged.households+'세대':null,filledFrom.households==='drop');
  push('좌표',merged.lat!=null&&merged.lng!=null?merged.lat.toFixed(5)+', '+merged.lng.toFixed(5):null,filledFrom.coords==='drop');
  push('주차(세대당)',merged.parkingState==='known'?merged.parking+'대':(merged.parkingState==='na'?'해당없음':null),filledFrom.parking==='drop');
  push('즐겨찾기',merged.favorite?'예':null,filledFrom.favorite==='drop');
  return rows.join('');
}
function isBlankBoth(a,b){ return (a==null||a==='')&&(b==null||b===''); }
function cxMergeRenderStep3(){
  const keep=state.complexes.find(c=>c.id===cxMergeState.keepId);
  const drop=state.complexes.find(c=>c.id===cxMergeState.dropId);
  if(!keep||!drop){ cxMergeCancel(); return; }
  const dropListings=state.listings.filter(l=>l.complexId===drop.id);
  const keepListings=state.listings.filter(l=>l.complexId===keep.id);
  const keepHasRep=keepListings.some(l=>l.isRepresentative);
  const dropHasRep=dropListings.some(l=>l.isRepresentative);
  const repConflict=keepHasRep&&dropHasRep;
  const {filledFrom}=cxComputeMerge(keep,drop);
  document.getElementById('cxMergeTitle').textContent='병합 전 확인';
  document.getElementById('cxMergeBody').innerHTML=`
    <p class="mdesc"><b>${esc(keep.complexName||'')}</b>을(를) 남기고
    <b>${esc(drop.complexName||'')}</b>은(는) 사라져요. 사라지는 단지의 매물
    <b>${dropListings.length}건</b>은 남는 단지로 전부 옮겨져요(병합 후 총
    ${keepListings.length+dropListings.length}건).</p>
    ${repConflict?`<p class="mdesc" style="color:var(--s-drop);font-weight:600;">⚠️ 두 단지 모두 대표매물이 있어요 —
      병합 후 <b>${esc(keep.complexName||'')}</b>의 대표매물을 유지하고,
      <b>${esc(drop.complexName||'')}</b>의 대표매물은 대표가 아닌 일반 매물로 바뀌어요.</p>`:''}
    <p class="mdesc">병합 전 두 단지와 매물 전체를 브라우저에 백업해요. 실행 취소는 없지만
    복구용 원본은 남아요.</p>
    <div class="cx-dt" style="margin:10px 0 2px">최종 반영될 값</div>
    ${cxMergeFieldRowsHTML(keep,drop,filledFrom)}
    <div class="c-actions" style="margin-top:14px">
      <button type="button" class="btn-ghost" id="cxMergeBackBtn3">뒤로</button>
      <button type="button" class="btn-ghost" id="cxMergeCancelBtn3">취소</button>
      <button type="button" class="btn-save" id="cxMergeConfirmBtn">병합 확정</button>
    </div>`;
  document.getElementById('cxMergeBackBtn3').onclick=()=>{ cxMergeState.step=2; cxMergeRenderStep2(); };
  document.getElementById('cxMergeCancelBtn3').onclick=cxMergeCancel;
  document.getElementById('cxMergeConfirmBtn').onclick=cxMergeExecute;
}
function cxMergeExecute(){
  const keep=state.complexes.find(c=>c.id===cxMergeState.keepId);
  const drop=state.complexes.find(c=>c.id===cxMergeState.dropId);
  if(!keep||!drop) return;
  const backupKey=backupBeforeMerge(keep,drop);
  if(!backupKey){
    alert('병합 전 백업 저장에 실패해서 병합을 진행하지 않았어요. 브라우저 저장 공간을 확인해주세요.');
    return;
  }
  const {merged}=cxComputeMerge(keep,drop);
  Object.assign(keep,merged);
  keep.updatedAt=new Date().toISOString();
  const dropId=drop.id, dropName=drop.complexName||'';
  const keepHadRep=state.listings.some(l=>l.complexId===keep.id&&l.isRepresentative);
  state.listings.filter(l=>l.complexId===dropId).forEach(l=>{
    l.complexId=keep.id;
    if(keepHadRep&&l.isRepresentative) l.isRepresentative=false;
    /* B-43: 값은 안 바뀌어도 "다른 단지로 이관됐다"는 사실 자체를 남김 —
       무조건 append(recordListingHistoryIfChanged가 아님) */
    recordListingHistory(l,'merge');
  });
  state.complexes=state.complexes.filter(c=>c.id!==dropId);
  routeSelected.delete(dropId); /* B-118: 삭제된 단지 참조 정리 — 임장 루트 선택 Set.
    cxListingEditMode/cxSafetyExpanded는 매물 id 기준이라 손댈 필요 없음(매물 자체는
    삭제되지 않고 complexId만 바뀌므로 편집 중이던 상태도 그대로 유효) */
  save();
  closeModal('cxMergeModal');
  cxMergeState=null;
  toast(`"${esc(dropName)}"을(를) "${esc(keep.complexName||'')}"에 병합했어요`);
  renderStats();
  /* B-118: 삭제된 단지 참조 정리② — cxDetailId가 dropId였다면 여기서 keep.id로
     재설정. openComplexDetail()을 다시 부르지 않는 이유: complexDetailModal은
     이미 열려있는 채로 이 흐름이 진행되므로, 다시 부르면 openModal()의
     lockBodyScroll() 카운터가 한 번 더 증가해 나중에 닫아도 스크롤 잠금이
     안 풀리는 카운터 불일치가 생김 — 모달을 다시 열지 않고 내용만 새로 그린다 */
  cxDetailId=keep.id;
  renderComplexDetailBody(keep);
  renderComplexes(); /* 단지 목록 자체가 바뀌었으므로(1개 삭제) 지도·필터·카드 전부 재렌더 */
}
function cxMergeCancel(){
  closeModal('cxMergeModal');
  cxMergeState=null;
}
function openCxMergeTool(sourceId){
  cxMergeState={sourceId,step:1};
  cxMergeRenderStep1();
  openModal('cxMergeModal');
}
(function cxMergeInjectUI(){
  document.body.insertAdjacentHTML('beforeend',`
    <div class="modal" id="cxMergeModal">
      <div class="box">
        <div class="mhead" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <h3 id="cxMergeTitle" style="margin:0">단지 병합</h3>
          <button type="button" class="btn-ghost" id="cxMergeCloseBtn">닫기</button>
        </div>
        <div class="mbody" id="cxMergeBody"></div>
      </div>
    </div>`);
  const modal=document.getElementById('cxMergeModal');
  modal.addEventListener('click',e=>{ if(e.target===modal) cxMergeCancel(); });
  document.getElementById('cxMergeCloseBtn').onclick=cxMergeCancel;
})();
/* 단지 상세 ⋯메뉴 — 접기 숨김이 아니라 명시적 항목 하나짜리 드롭다운(기존
   showRouteMenu/showExportMenu와 동일한 status-picker 패턴). 항목이 하나뿐이라도
   향후 확장을 대비해 별도 신규 UI 패턴을 만들지 않고 그대로 재사용했다 */
let _cxDetailMoreMenu=null;
function closeCxDetailMoreMenu(){ if(_cxDetailMoreMenu){ _cxDetailMoreMenu.remove(); _cxDetailMoreMenu=null; } }
function showCxDetailMoreMenu(btn){
  if(_cxDetailMoreMenu){ closeCxDetailMoreMenu(); return; }
  const menu=document.createElement('div');
  menu.className='status-picker route-menu';
  menu.innerHTML=`<button class="sp-opt" id="cxMergeMenuItem">다른 단지와 병합</button>`;
  document.body.appendChild(menu);
  _cxDetailMoreMenu=menu;
  const rect=btn.getBoundingClientRect();
  menu.style.top=(rect.bottom+window.scrollY+4)+'px';
  menu.style.left=Math.max(8,Math.min(rect.left+window.scrollX, window.innerWidth-200))+'px';
  document.getElementById('cxMergeMenuItem').onclick=()=>{
    closeCxDetailMoreMenu();
    if(cxDetailId) openCxMergeTool(cxDetailId);
  };
  const close=ev=>{ if(!menu.contains(ev.target)&&ev.target!==btn){ closeCxDetailMoreMenu(); document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
}
document.getElementById('cxDetailMoreBtn').onclick=e=>showCxDetailMoreMenu(e.currentTarget);
/* 같은 배치 안의 행끼리도 병합/중복 감지가 되도록 배치 내 상태를 누적하며 순회한다 */
function calcCxImportStatus(parsed){
  const existingCxByKey=new Map();
  state.complexes.forEach(cx=>{
    const key=cxMergeKey(cx.complexName,cx.loc,cx.station);
    if(!existingCxByKey.has(key)) existingCxByKey.set(key,cx.id);
  });
  const listingKeySet=new Set(state.listings.map(l=>cxListingDupKey(l.complexId,l.url,l.dongHo,l.areaM2,l.deposit)));

  const batchCxPseudoId=new Map();
  let pseudoSeq=0;
  return parsed.map(row=>{
    const {complexName,groupCode,dongHo}=migParseName(row.name);
    const loc=row.loc||'';
    const geocodeQuery=buildGeocodeQuery(loc,complexName);
    const mergeKey=cxMergeKey(complexName,loc,row.station);

    let cxId, cxJudgment, existingComplexId=null, cxCandidates=[];
    if(existingCxByKey.has(mergeKey)){
      cxId=existingCxByKey.get(mergeKey); existingComplexId=cxId; cxJudgment='existing';
    } else if(batchCxPseudoId.has(mergeKey)){
      cxId=batchCxPseudoId.get(mergeKey); cxJudgment='existing';
    } else {
      cxId='batch'+(++pseudoSeq); batchCxPseudoId.set(mergeKey,cxId);
      /* B-19확: 완전일치 없을 때만 퍼지 후보 확인(TSV엔 좌표가 없어 이름
         유사만 적용). 후보가 있어도 기본은 '신규'(자동 배정 아님) — 사용자가
         renderImportPreview()의 드롭다운에서 직접 골라야 기존 단지로 붙는다 */
      cxCandidates=findComplexCandidates(complexName,null,null).map(c=>({id:c.cx.id,name:c.cx.complexName,reason:cxMatchReason(c)}));
      cxJudgment=cxCandidates.length?'fuzzy':'new';
    }

    const lk=cxListingDupKey(cxId,row.url,dongHo,row.area,row.depositNum);
    const listingDup=listingKeySet.has(lk);
    if(!listingDup) listingKeySet.add(lk);

    return {...row,complexName,groupCode,dongHo,geocodeQuery,mergeKey,cxId,cxJudgment,existingComplexId,cxCandidates,listingDup};
  });
}

/* B-19확: 임포트 프리뷰의 "단지 판정" 셀 — existing은 기존과 동일, new는
   퍼지 후보 없는 순수 신규, fuzzy는 비슷한 기존 단지가 있어도 기본값은
   "신규"(자동 배정 아님) — 드롭다운에서 사용자가 직접 골라야 기존 단지에
   붙는다. 고른 값은 row.cxOverride에 저장, 제출 시 참조 */
function cxJudgmentCell(r,i){
  if(r.cxJudgment==='existing') return `<span class="dup-badge dup-이름유사">기존 단지 있음 · 매물 추가</span>`;
  if(r.cxJudgment==='fuzzy'){
    const opts=[`<option value="new">새 단지로 만들기</option>`]
      .concat(r.cxCandidates.map(c=>`<option value="${esc(c.id)}"${r.cxOverride===c.id?' selected':''}>${esc(c.name)}에 추가${c.reason?' · '+esc(c.reason):''}</option>`));
    return `<span class="dup-badge dup-이름유사" style="display:inline-block;margin-bottom:4px;">비슷한 단지 있음</span>
      <select class="pi-cxsel" data-idx="${i}" style="display:block;font-size:11px;max-width:170px;">${opts.join('')}</select>`;
  }
  return `<span class="dup-badge dup-신규">신규 단지</span>`;
}
let importParsedRows=[];
function renderImportPreview(rows){
  if(!rows.length){
    document.getElementById('propImportErr').textContent='파싱된 행이 없어요. 데이터를 확인해주세요.';
    return;
  }
  document.getElementById('propImportErr').textContent='';
  const newCxCount=new Set(rows.filter(r=>r.cxJudgment!=='existing').map(r=>r.mergeKey)).size;
  const fuzzyCount=rows.filter(r=>r.cxJudgment==='fuzzy').length;
  const dupListingCount=rows.filter(r=>r.listingDup).length;
  const html=`<div style="overflow-x:auto"><table class="import-tbl">
    <thead><tr>
      <th><input type="checkbox" id="piChkAll" checked></th>
      <th>단지명</th><th>지역</th><th>전세보증금</th><th>전용면적</th>
      <th>상태</th><th>단지 판정</th><th>매물 판정</th>
    </tr></thead>
    <tbody>${rows.map((r,i)=>`<tr class="${r.listingDup?'dup-r':''}">
      <td><input type="checkbox" class="pi-chk" data-idx="${i}"${r.listingDup?'':' checked'}></td>
      <td>${esc(r.complexName||r.name||'—')}</td>
      <td>${esc(r.loc||r.station||'—')}</td>
      <td class="tnum">${r.depositNum!=null?r.depositNum+'억':'—'}</td>
      <td class="tnum">${r.area!=null?r.area+'㎡':'—'}</td>
      <td>${esc(r.status)}</td>
      <td>${cxJudgmentCell(r,i)}</td>
      <td>${r.listingDup?'<span class="dup-badge dup-중복">기존 매물 있음</span>':'—'}</td>
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
  document.querySelectorAll('.pi-cxsel').forEach(sel=>sel.onchange=()=>{ rows[+sel.dataset.idx].cxOverride=sel.value; });
  updateCount();
  document.getElementById('propImportSummary').textContent=`총 ${rows.length}행 · 신규 단지 ${newCxCount}개${fuzzyCount?` (비슷한 단지 ${fuzzyCount}건 확인 필요)`:''} · 중복 매물 ${dupListingCount}건 자동 해제`;
  document.getElementById('propImportPreview').style.display='';
}

document.getElementById('propImportPreviewBtn').onclick=()=>{
  const text=document.getElementById('propImportTa').value;
  if(!text.trim()){document.getElementById('propImportErr').textContent='데이터를 붙여넣어 주세요.';return;}
  importParsedRows=calcCxImportStatus(parseTSV(text));
  renderImportPreview(importParsedRows);
};
document.getElementById('propImportBackBtn').onclick=()=>{
  document.getElementById('propImportPreview').style.display='none';importParsedRows=[];
};
document.getElementById('propImportSubmitBtn').onclick=async()=>{
  const chkEls=[...document.querySelectorAll('.pi-chk:checked')];
  const toImport=chkEls.map(cb=>importParsedRows[+cb.dataset.idx]).filter(r=>r&&r.name&&!r.listingDup);
  if(!toImport.length)return;

  /* v5 stage5b: TSV 임포트 결과는 properties[]에 push하지 않고 complexes/listings에만
     기록(이중 저장 방지). 같은 배치 안 동일 단지(mergeKey)는 실제 complexId 1개로
     합쳐 매물만 여러 개 추가한다. */
  const now=new Date().toISOString();
  const resolvedCxId=new Map();
  const newComplexIds=[];
  let newCxCount=0, newListingCount=0, seq=0;

  toImport.forEach(row=>{
    let realCxId=resolvedCxId.get(row.mergeKey);
    if(!realCxId){
      /* B-19확: 사용자가 드롭다운에서 후보를 골랐으면 우선 적용(제안 선택),
         아니면 완전일치 결과, 둘 다 없으면 신규 생성 — 자동 배정 없음 */
      if(row.cxOverride&&row.cxOverride!=='new'){
        realCxId=row.cxOverride;
      } else if(row.existingComplexId){
        realCxId=row.existingComplexId;
      } else {
        const cx={
          id:'cx'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)+(++seq),
          complexName:row.complexName||row.name, loc:row.loc||'', geocodeQuery:row.geocodeQuery,
          groupCode:row.groupCode||'', regionGroup:'',
          station:row.station||'', line:row.line||'',
          yearBuilt:row.yearBuilt??null, households:row.households??null, householdGrade:row.householdGrade||'',
          commuteGangnam:row.commuteGangnam||null, commuteSinsa:row.commuteSinsa||null,
          complexStatus:mapCxImportStatus(row.status),
          lat:null, lng:null, memo:row.memo||'',
          parking:null, parkingState:'unknown',
          pros:'', cons:'', verdict:'', favorite:false,
          commutes:defaultComplexCommutes(), commuteMemo:'',
          fieldNote:defaultComplexFieldNote(),
          createdAt:now, updatedAt:now,
        };
        state.complexes.push(cx);
        realCxId=cx.id;
        newComplexIds.push(cx.id);
        newCxCount++;
      }
      resolvedCxId.set(row.mergeKey,realCxId);
    }
    const isFirstListing=state.listings.filter(l=>l.complexId===realCxId).length===0;
    state.listings.push({
      id:'lst'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)+(++seq),
      complexId:realCxId, source:'sheet', url:row.url||'',
      capturedAt:now, lastCheckedAt:'',
      dongHo:row.dongHo||'', areaM2:row.area??null, areaText:row.area!=null?String(row.area):'',
      areaGrade:'', deposit:row.depositNum??null,
      managementFee:null, managementFeeState:'unknown', listingStatus:'확인필요',
      isRepresentative:isFirstListing,
      memo:row.memo||'',
      safety:defaultListingSafety(),
      history:[{at:now,deposit:row.depositNum??null,listingStatus:'확인필요',source:'create'}],
    });
    newListingCount++;
  });

  const dupSkip=importParsedRows.filter(r=>r.listingDup).length;
  closeModal('propImportModal');
  save();renderProps();refreshOverview();
  toast(`단지 ${newCxCount}개 신규 · 매물 ${newListingCount}개 등록 완료 / 중복 매물 ${dupSkip}건 건너뜀`);
  geocodeComplexBatch(newComplexIds);
};
async function geocodeComplexBatch(ids){
  const cxs=ids.map(id=>state.complexes.find(c=>c.id===id)).filter(Boolean);
  for(const cx of cxs){
    if(cx.lat&&cx.lng) continue;
    if(!cx.geocodeQuery) continue;
    try{
      const j=await geocode(cx.geocodeQuery);
      if(j.found){ cx.lat=j.lat; cx.lng=j.lng; }
    }catch(e){/* 좌표 확인 필요 상태로 남음 */}
  }
  save();renderComplexes();refreshOverview();
}

document.getElementById('propBulkBtn').onclick=()=>{
  document.getElementById('propImportTa').value='';
  document.getElementById('propImportErr').textContent='';
  document.getElementById('propImportPreview').style.display='none';
  importParsedRows=[];
  openModal('propImportModal');
};

/* ============ v5 Stage 2: properties[] → complexes/listings 마이그레이션 (프리뷰, 비파괴) ============
   properties[]는 읽기 전용 소스. 여기서 삭제·변경 없음 — 적용해도 그대로 남는다.
   자동 실행 없음: 버튼 클릭 → 프리뷰 → 체크 → "선택 적용" 클릭 시에만 complexes/listings에 기록 */
function migComplexStatus(st){
  if(st==='후보확정') return '후보';
  if(st==='방문예정') return '임장예정';
  const ALLOWED=['관심','검토중','후보','임장예정','보류','탈락'];
  return ALLOWED.includes(st)?st:'관심';
}
/* 이름에서 탐색그룹([G1])과 동/호(615동, 101동 1203호)를 추출 — geocodeQuery엔 절대 안 남게 제거 */
function migParseName(rawName){
  let name=String(rawName||'').trim();
  let groupCode='';
  const gm=name.match(/^\[(G\d+)\]\s*/i);
  if(gm){ groupCode=gm[1].toUpperCase(); name=name.slice(gm[0].length).trim(); }
  let dongHo='';
  const dm=name.match(/\s*(\d+동(?:\s*\d+호)?)\s*$/);
  if(dm){ dongHo=dm[1]; name=name.slice(0,dm.index).trim(); }
  return {complexName:name, groupCode, dongHo};
}
function migBuildRows(){
  const rows=state.properties.map(p=>{
    const {complexName,groupCode,dongHo}=migParseName(p.name);
    const loc=p.loc||'';
    const geocodeQuery=buildGeocodeQuery(loc,complexName);
    const mergeKey=normalizeStr(complexName)+'|'+normalizeStr(loc||p.station||'');
    return {p,complexName,groupCode,dongHo,loc,geocodeQuery,mergeKey,confident:!!complexName};
  });
  const groupRows=new Map(), groupNoMap=new Map();
  let groupNo=0;
  rows.forEach(r=>{
    if(!groupRows.has(r.mergeKey)) groupRows.set(r.mergeKey,[]);
    groupRows.get(r.mergeKey).push(r);
  });
  rows.forEach(r=>{
    if(!groupNoMap.has(r.mergeKey)) groupNoMap.set(r.mergeKey,++groupNo);
    r.groupNo=groupNoMap.get(r.mergeKey);
    r.groupSize=groupRows.get(r.mergeKey).length;
  });
  return rows;
}
let migRows=[];
function renderMigPreview(){
  migRows=migBuildRows();
  const area=document.getElementById('migPreviewArea');
  const applyBtn=document.getElementById('migApplyBtn');
  if(!migRows.length){
    area.innerHTML='<p class="mdesc">정리할 매물이 없어요.</p>';
    applyBtn.disabled=true; applyBtn.textContent='선택 0개 적용';
    document.getElementById('migSummary').textContent='';
    return;
  }
  area.innerHTML=`<div style="overflow-x:auto"><table class="import-tbl">
    <thead><tr>
      <th><input type="checkbox" id="migChkAll" checked></th>
      <th>기존이름</th><th>탐색그룹</th><th>추정 단지명</th><th>추정 동/호</th>
      <th>주소</th><th>지도 검색어</th><th>병합예정 단지</th>
    </tr></thead>
    <tbody>${migRows.map((r,i)=>`<tr>
      <td><input type="checkbox" class="mig-chk" data-idx="${i}"${r.confident?' checked':''}></td>
      <td>${esc(r.p.name||'—')}</td>
      <td>${esc(r.groupCode||'—')}</td>
      <td>${esc(r.complexName||'—')}${r.confident?'':' <span class="chip warn">단지명 추정 실패</span>'}</td>
      <td>${esc(r.dongHo||'—')}</td>
      <td>${esc(r.loc||'—')}</td>
      <td>${esc(r.geocodeQuery||'—')}</td>
      <td>#${r.groupNo} ${esc(r.complexName||r.p.name||'—')}${r.groupSize>1?` <span class="chip ok">${r.groupSize}건 병합</span>`:''}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;
  const updateCount=()=>{
    const n=[...document.querySelectorAll('.mig-chk:checked')].length;
    applyBtn.textContent=`선택 ${n}개 적용`; applyBtn.disabled=n===0;
  };
  document.getElementById('migChkAll').onchange=e=>{
    document.querySelectorAll('.mig-chk').forEach(cb=>cb.checked=e.target.checked);
    updateCount();
  };
  document.querySelectorAll('.mig-chk').forEach(cb=>cb.onchange=updateCount);
  updateCount();
  const groupCount=new Set(migRows.map(r=>r.mergeKey)).size;
  document.getElementById('migSummary').textContent=`매물 ${migRows.length}건 → 단지 ${groupCount}개로 정리 예정`;
}
/* B-14: idempotency 가드 — "정리" 재실행 시 단지는 findExistingComplexId()로 재사용
   (새로 안 만듦), 매물은 listingExists()에 걸리면 건너뜀. 여러 번 눌러도 중복 생성 없음 */
function migApply(){
  const toApply=[...document.querySelectorAll('.mig-chk:checked')]
    .map(cb=>migRows[+cb.dataset.idx]).filter(Boolean);
  if(!toApply.length) return;
  const groups=new Map();
  toApply.forEach(r=>{
    if(!groups.has(r.mergeKey)) groups.set(r.mergeKey,[]);
    groups.get(r.mergeKey).push(r);
  });
  const now=new Date().toISOString();
  let newComplexes=0, newListings=0, skippedListings=0;
  groups.forEach(rowsInGroup=>{
    const first=rowsInGroup[0].p;
    const groupCode=rowsInGroup.map(r=>r.groupCode).find(Boolean)||'';

    let complexId=findExistingComplexId(rowsInGroup[0].complexName||first.name,first.loc,first.station);
    if(!complexId){
      complexId='cx'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
      const cx={
        id:complexId,
        complexName:rowsInGroup[0].complexName||first.name||'',
        loc:first.loc||'',
        geocodeQuery:rowsInGroup[0].geocodeQuery||'',
        groupCode, regionGroup:'',
        station:first.station||'', line:first.line||'',
        yearBuilt:first.yearBuilt??null,
        households:first.households??null,
        householdGrade:first.householdGrade||'',
        commuteGangnam:first.commuteGangnam??null,
        commuteSinsa:first.commuteSinsa??null,
        complexStatus:migComplexStatus(first.status),
        lat:first.lat??null, lng:first.lng??null,
        memo:first.memo||'',
        parking:null, parkingState:'unknown',
        pros:'', cons:'', verdict:'', favorite:false,
        commutes:defaultComplexCommutes(), commuteMemo:'',
        fieldNote:defaultComplexFieldNote(),
        createdAt:now, updatedAt:now,
      };
      if(first.aiScore!=null) cx.aiScore=first.aiScore;
      if(first.aiComment) cx.aiComment=first.aiComment;
      if(first.aiReport) cx.aiReport=first.aiReport;
      state.complexes.push(cx);
      newComplexes++;
    }

    rowsInGroup.forEach(r=>{
      const p=r.p;
      const areaNum=p.area!=null&&p.area!==''?parseFloat(p.area):null;
      const depositVal=p.depositNum!=null?p.depositNum:(p.deposit?parseEok(p.deposit):null);
      if(listingExists(complexId,p.url,r.dongHo,areaNum,depositVal)){ skippedListings++; return; }
      const isFirstListing=state.listings.filter(l=>l.complexId===complexId).length===0;
      state.listings.push({
        id:'lst'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)+newListings,
        complexId,
        source:p.importSource||'',
        url:p.url||'',
        capturedAt:p.created?new Date(p.created).toISOString():now,
        lastCheckedAt:now,
        dongHo:r.dongHo||'',
        areaM2:(areaNum!=null&&!isNaN(areaNum))?areaNum:null,
        areaText:p.area!=null&&p.area!==''?String(p.area):'',
        areaGrade:'',
        deposit:depositVal,
        managementFee:null,
        managementFeeState:'unknown',
        listingStatus:'확인필요',
        isRepresentative:isFirstListing,
        memo:p.memo||'',
        safety:defaultListingSafety(),
        history:[{at:now,deposit:depositVal,listingStatus:'확인필요',source:'create'}],
      });
      newListings++;
    });
  });
  save();
  closeModal('migPreviewModal');
  renderProps();
  toast(`단지 ${newComplexes}개 신규 · 매물 ${newListings}건 등록${skippedListings?` · 중복 ${skippedListings}건 건너뜀`:''} (기존 매물 목록은 그대로 유지돼요)`);
}
/* B-47: 기준바(.gates) 접이식 — 자주 안 바뀌는 정보라 기본 접힘, 펼침 상태만 localStorage
   기억(모바일은 .gates 자체가 display:none이라 이 토글은 데스크톱에서만 실제로 보임) */
(function initGatesToggle(){
  const box=document.getElementById('gatesBox');
  const btn=document.getElementById('gatesToggleBtn');
  if(!box||!btn) return;
  const KEY='sh_gatesExpanded';
  let expanded=false;
  try{ expanded=localStorage.getItem(KEY)==='1'; }catch(e){}
  const apply=()=>{
    box.classList.toggle('expanded',expanded);
    btn.innerHTML=(expanded?'접기':'펼치기')+' <span class="gates-toggle-caret">▾</span>';
    btn.setAttribute('aria-expanded',String(expanded));
  };
  apply();
  btn.onclick=()=>{
    expanded=!expanded;
    apply();
    try{ localStorage.setItem(KEY,expanded?'1':'0'); }catch(e){}
  };
})();
/* B-68: 이관 완료 후 진입 버튼 노출 제거 — 모달·마이그레이션 코드 본체(migApply·
   renderMigPreview 등)는 B-05(레거시 일괄 삭제 예정) 전까지 그대로 유지, 여기서는
   진입 버튼(migStartBtn)만 주입하지 않는다. 모달 자체는 코드상 남아있지만 여는
   경로가 없어 사실상 비활성 */
(function migInjectUI(){
  document.body.insertAdjacentHTML('beforeend',`
    <div class="modal" id="migPreviewModal">
      <div class="box" style="max-width:1080px;width:96vw;max-height:90vh;overflow-y:auto">
        <h3>${ic('listings')} 기존 매물을 단지로 정리 (미리보기)</h3>
        <p class="mdesc">매물 목록을 단지(장기추적)·매물(시점 스냅샷) 구조로 정리해요.
          체크된 항목만 적용되고, 기존 매물 목록은 그대로 남아요.</p>
        <div id="migPreviewArea"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;flex-wrap:wrap;gap:8px">
          <span id="migSummary" style="font-size:12px;color:var(--ink-soft)"></span>
          <div style="display:flex;gap:8px">
            <button class="btn-ghost" id="migCloseBtn">닫기</button>
            <button class="btn-save" id="migApplyBtn" disabled>선택 0개 적용</button>
          </div>
        </div>
      </div>
    </div>`);
  const modal=document.getElementById('migPreviewModal');
  modal.addEventListener('click',e=>{ if(e.target===modal) modal.classList.remove('open'); });
  document.getElementById('migCloseBtn').onclick=()=>closeModal('migPreviewModal');
  document.getElementById('migApplyBtn').onclick=migApply;
})();

/* ============ v5 Stage 3+4: 단지 카드 목록 + 단지 상세·매물 목록 (properties[] 뷰 공존) ============ */
const SC_CX=Object.assign({},SC,{임장예정:SC['방문예정']});
const HEX_CX=Object.assign({},HEX,{임장예정:HEX['방문예정']});
/* B-116: 단지 카드 상태 뱃지 빠른 변경 — E-01 이관 후 소실된 카드 즉시변경 경로 복원.
   레거시 showStatusPicker(state.properties[].status용, 1367행)와 같은 .status-picker
   플로팅 메뉴를 재사용하되 대상은 complexStatus. 옵션 6개는 cxDetailStatusSel(상세
   select, index.html)과 동일한 값 집합 — migComplexStatus의 ALLOWED(1916행)와도 일치 */
let _cxStatusPicker=null;
function showCxStatusPicker(pill, cx){
  if(_cxStatusPicker){ _cxStatusPicker.remove(); _cxStatusPicker=null; }
  const opts=['관심','검토중','후보','임장예정','보류','탈락'];
  const cur=cx.complexStatus||'관심';
  const picker=document.createElement('div');
  picker.className='status-picker';
  picker.innerHTML=opts.map(s=>`<button class="sp-opt${cur===s?' on':''}" data-sp="${esc(s)}" style="border-left:3px solid var(${SC_CX[s]||'--hairline'})">${esc(s)}</button>`).join('');
  document.body.appendChild(picker);
  _cxStatusPicker=picker;
  const rect=pill.getBoundingClientRect();
  const top=rect.bottom+window.scrollY+4;
  const left=Math.min(rect.left+window.scrollX, window.innerWidth-130);
  picker.style.top=top+'px'; picker.style.left=Math.max(8,left)+'px';
  picker.querySelectorAll('[data-sp]').forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    cx.complexStatus=b.dataset.sp; cx.updatedAt=new Date().toISOString();
    picker.remove(); _cxStatusPicker=null;
    save(); renderStats(); renderComplexes();
    if(cxDetailId===cx.id) renderComplexDetailBody(cx);
  });
  const close=ev=>{ if(!picker.contains(ev.target)){ picker.remove(); _cxStatusPicker=null; document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
}
/* 대표매물(isRepresentative), 없으면 첫 매물 — 지도·카드·통계·루트가 공통으로 씀 */
function cxRepOf(cx){
  const ls=state.listings.filter(l=>l.complexId===cx.id);
  return ls.find(l=>l.isRepresentative)||ls[0]||null;
}
/* B-18: getAreaGrade는 calcAreaGrade(utils.js, GRADE_DEFAULTS와 함께 정의)로
   이동 — 호출부는 calcAreaGrade(areaM2, state.settings.grades)로 교체 */
function listingStatusChipClass(st){
  if(st==='게시중')return'ok';
  if(st==='가격변동')return'warn';
  if(st==='사라짐')return'gone';
  return'';
}
/* B-63: cxFilterListingStatus(index.html) 필터 칩과 동일한 5개 값 —
   listingStatus select 편집 옵션도 동일 소스로 맞춤 */
const LISTING_STATUS_OPTIONS=['게시중','사라짐','가격변동','다른동호수등장','확인필요'];

/* ---- (3) 단지 카드 목록 ---- */
let legacyExpanded=null;
function updateLegacyToggleLabel(){
  const btn=document.getElementById('legacyToggleBtn'); if(!btn)return;
  btn.textContent=`${legacyExpanded?'▾':'▸'} 기존(미정리) 매물 (${state.properties.length})`;
}

/* ---- v5 stage6c: 단지 목록 필터 (6종) ---- */
let cxFilters={region:'',status:'',listing:'',area:'',hh:'',line:'',favorite:false};
function renderCxFilterOptions(){
  const regionSet=new Set(state.complexes.map(c=>c.regionGroup).filter(Boolean));
  const regionWrap=document.getElementById('cxFilterRegion');
  if(regionWrap) regionWrap.innerHTML=`<span class="sc-filter-chip${cxFilters.region===''?' on':''}" data-fregion="">전체</span>`
    +[...regionSet].map(r=>`<span class="sc-filter-chip${cxFilters.region===r?' on':''}" data-fregion="${esc(r)}">${esc(r)}</span>`).join('');
  const lineSet=new Set(state.complexes.map(c=>c.line).filter(Boolean));
  const lineWrap=document.getElementById('cxFilterLine');
  if(lineWrap) lineWrap.innerHTML=`<span class="sc-filter-chip${cxFilters.line===''?' on':''}" data-fline="">전체</span>`
    +[...lineSet].map(l=>`<span class="sc-filter-chip${cxFilters.line===l?' on':''}" data-fline="${esc(l)}">${esc(l)}</span>`).join('');
  document.querySelectorAll('#cxFilterStatus [data-fstatus]').forEach(c=>c.classList.toggle('on',c.dataset.fstatus===cxFilters.status));
  document.querySelectorAll('#cxFilterListingStatus [data-flisting]').forEach(c=>c.classList.toggle('on',c.dataset.flisting===cxFilters.listing));
  document.querySelectorAll('#cxFilterAreaGrade [data-farea]').forEach(c=>c.classList.toggle('on',c.dataset.farea===cxFilters.area));
  document.querySelectorAll('#cxFilterHouseholdGrade [data-fhh]').forEach(c=>c.classList.toggle('on',c.dataset.fhh===cxFilters.hh));
  const favBtn=document.getElementById('cxFilterFavoriteBtn');
  if(favBtn) favBtn.classList.toggle('active',cxFilters.favorite);
  updateCxFilterTriggers();
}
/* B-35: 그룹 트리거 칩 라벨(선택값 표시) + 펼침/접힘 */
const CXF_GROUP_LABELS={status:'단지상태',listing:'매물상태',area:'면적',hh:'세대수',line:'노선'};
function updateCxFilterTriggers(){
  [['status','cxFilterStatusTrigger'],['listing','cxFilterListingStatusTrigger'],
   ['area','cxFilterAreaGradeTrigger'],['hh','cxFilterHouseholdGradeTrigger'],
   ['line','cxFilterLineTrigger']].forEach(([key,id])=>{
    const el=document.getElementById(id); if(!el) return;
    const val=cxFilters[key];
    el.innerHTML=`${esc(CXF_GROUP_LABELS[key])}${val?': '+esc(val):''} <span class="cxf-caret">▾</span>`;
    el.classList.toggle('active',!!val);
  });
}
/* cxFilterBar는 좁은 화면에서 가로 스크롤(overflow-x:auto)이 필요한데, 드롭다운을 그
   안(.cxf-group)에 absolute로 두면 overflow-x:auto가 overflow-y도 auto로 강제해(CSS
   스펙상 한쪽만 visible이 아니면 둘 다 auto로 계산됨) 바 아래로 나가는 드롭다운이
   잘려 보이지 않는 문제가 있었음 — showMoreMenu()와 같은 패턴으로 열 때만 body로
   옮기고 position:fixed로 트리거 좌표 기준 배치, 닫으면 원래 자리로 되돌림 */
let _cxfOpenSlot=null;
function closeCxFilterDropdowns(){
  if(_cxfOpenSlot){
    const {el,parent,next}=_cxfOpenSlot;
    el.style.position=''; el.style.display=''; el.style.top=''; el.style.left=''; el.style.zIndex='';
    parent.insertBefore(el,next);
    _cxfOpenSlot=null;
  }
  document.querySelectorAll('.cxf-group.open').forEach(g=>g.classList.remove('open'));
}
function openCxFilterDropdown(group){
  closeCxFilterDropdowns();
  const trigger=group.querySelector('.cxf-trigger');
  const dropdown=group.querySelector('.cxf-dropdown');
  if(!trigger||!dropdown) return;
  _cxfOpenSlot={el:dropdown,parent:dropdown.parentElement,next:dropdown.nextSibling};
  document.body.appendChild(dropdown);
  const rect=trigger.getBoundingClientRect();
  const ddW=Math.min(280,window.innerWidth-24);
  dropdown.style.position='fixed';
  dropdown.style.display='flex';
  dropdown.style.top=(rect.bottom+6)+'px';
  dropdown.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-ddW-8))+'px';
  dropdown.style.zIndex='30';
  group.classList.add('open');
}
{
  const bar=document.getElementById('cxFilterBar');
  if(bar) bar.addEventListener('click',e=>{
    const trigger=e.target.closest('.cxf-trigger');
    if(!trigger) return;
    const group=trigger.closest('.cxf-group');
    const wasOpen=group.classList.contains('open');
    closeCxFilterDropdowns();
    if(!wasOpen) openCxFilterDropdown(group);
  });
  document.addEventListener('click',e=>{
    if(e.target.closest('.cxf-trigger')||e.target.closest('.cxf-dropdown')) return;
    closeCxFilterDropdowns();
  });
}
function cxMatchesFilters(cx){
  if(cxFilters.favorite && !cx.favorite) return false;
  if(cxFilters.region && (cx.regionGroup||'')!==cxFilters.region) return false;
  if(cxFilters.status && (cx.complexStatus||'관심')!==cxFilters.status) return false;
  if(cxFilters.hh && (cx.householdGrade||'')!==cxFilters.hh) return false;
  if(cxFilters.line && (cx.line||'')!==cxFilters.line) return false;
  if(cxFilters.listing||cxFilters.area){
    const cxListings=state.listings.filter(l=>l.complexId===cx.id);
    if(cxFilters.listing && !cxListings.some(l=>l.listingStatus===cxFilters.listing)) return false;
    if(cxFilters.area && !cxListings.some(l=>(l.areaGrade||calcAreaGrade(l.areaM2,state.settings.grades))===cxFilters.area)) return false;
  }
  return true;
}
/* B-38: 검색창(#prop_search, "단지·역·호선·메모 검색")이 단지 이름/위치/역/노선은
   원래도 검색 대상이어야 했는데 v5 전환(단지 카드) 이후 실제로 연결된 적이 없었음
   — verdict(한줄 판단)를 검색 대상에 추가하는 김에 최소한으로 연결. pros/cons
   본문은 노이즈 방지를 위해 검색 대상에서 제외(지시 사항) */
function cxMatchesSearch(cx){
  const pq=(document.getElementById('prop_search')?.value||'').trim().toLowerCase();
  if(!pq) return true;
  return [cx.complexName,cx.loc,cx.station,cx.line,cx.verdict].some(v=>String(v??'').toLowerCase().includes(pq));
}
document.getElementById('cxFilterRegion').onclick=e=>{const c=e.target.closest('[data-fregion]');if(!c)return;cxFilters.region=c.dataset.fregion;closeCxFilterDropdowns();renderComplexes();};
document.getElementById('cxFilterStatus').onclick=e=>{const c=e.target.closest('[data-fstatus]');if(!c)return;cxFilters.status=c.dataset.fstatus;closeCxFilterDropdowns();renderComplexes();};
document.getElementById('cxFilterListingStatus').onclick=e=>{const c=e.target.closest('[data-flisting]');if(!c)return;cxFilters.listing=c.dataset.flisting;closeCxFilterDropdowns();renderComplexes();};
document.getElementById('cxFilterAreaGrade').onclick=e=>{const c=e.target.closest('[data-farea]');if(!c)return;cxFilters.area=c.dataset.farea;closeCxFilterDropdowns();renderComplexes();};
document.getElementById('cxFilterHouseholdGrade').onclick=e=>{const c=e.target.closest('[data-fhh]');if(!c)return;cxFilters.hh=c.dataset.fhh;closeCxFilterDropdowns();renderComplexes();};
document.getElementById('cxFilterLine').onclick=e=>{const c=e.target.closest('[data-fline]');if(!c)return;cxFilters.line=c.dataset.fline;closeCxFilterDropdowns();renderComplexes();};
document.getElementById('cxFilterFavoriteBtn').onclick=()=>{cxFilters.favorite=!cxFilters.favorite;renderComplexes();};

/* ---- v5 stage6c: 주간 상태 UX (화면 표시만, 알림·스케줄링 없음) ---- */
function needsWeeklyCheck(cx,rep){
  if(!['후보','검토중'].includes(cx.complexStatus)) return false;
  if(!rep||!rep.lastCheckedAt) return true;
  return (Date.now()-new Date(rep.lastCheckedAt).getTime())/86400000>=7;
}
function weeklyCheckComplex(cxId){
  const cx=state.complexes.find(c=>c.id===cxId); if(!cx) return;
  const rep=cxRepOf(cx);
  if(!rep) return;
  rep.lastCheckedAt=new Date().toISOString();
  save(); renderComplexes();
  if(cxDetailId===cxId) renderCxListings(cxId);
}

let cxSort='new', myLoc=null, myLocMarker=null;
function cxDistM(cx){ return (myLoc&&cx.lat&&cx.lng)?haversineM(myLoc,{lat:cx.lat,lng:cx.lng}):Infinity; }
/* B-39: 즐겨찾기(favorite)를 항상 최상단으로 — 기존 정렬 위에 1차 키로만 얹음.
   Array.sort는 안정 정렬(ES2019+)이라 이미 정렬된 배열에 이 비교자만 다시
   적용하면 각 그룹(즐겨찾기/일반) 내부의 기존 순서는 그대로 유지된 채
   즐겨찾기만 앞으로 이동함 */
function favoritesFirst(arr){
  return arr.slice().sort((a,b)=>(b.favorite?1:0)-(a.favorite?1:0));
}
function sortComplexes(arr){
  let sorted;
  if(cxSort==='price') sorted=arr.slice().sort((a,b)=>((cxRepOf(a)?.deposit??Infinity)-(cxRepOf(b)?.deposit??Infinity)));
  else if(cxSort==='dist'&&myLoc) sorted=arr.slice().sort((a,b)=>cxDistM(a)-cxDistM(b));
  else sorted=arr.slice().sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
  return favoritesFirst(sorted);
}
function syncSortChips(){
  document.querySelectorAll('[data-cxsort]').forEach(b=>b.classList.toggle('on',b.dataset.cxsort===cxSort));
  const d=document.querySelector('[data-cxsort="dist"]'); if(d) d.disabled=!myLoc;
}
function drawMyLocMarker(){
  if(!overview||!myLoc) return;
  waitNaverMaps(()=>{
    const pos=new naver.maps.LatLng(myLoc.lat,myLoc.lng);
    if(myLocMarker) myLocMarker.setMap(null);
    myLocMarker=new naver.maps.Marker({position:pos,map:overview,icon:{content:'<div class="myloc-pin" aria-label="내 위치"></div>',anchor:new naver.maps.Point(9,9)},zIndex:2000});
    overview.setCenter(pos);
  });
}
function requestMyLoc(){
  if(!navigator.geolocation){ toast('이 브라우저는 위치를 지원하지 않아요'); return; }
  navigator.geolocation.getCurrentPosition(
    p=>{ myLoc={lat:p.coords.latitude,lng:p.coords.longitude}; cxSort='dist'; drawMyLocMarker(); renderComplexes(); syncSortChips(); },
    ()=>{ toast('위치 권한이 필요해요'); if(cxSort==='dist'){cxSort='new';renderComplexes();syncSortChips();} }
  );
}
function renderComplexes(){
  const wrap=document.getElementById('complexSection');
  const filterBar=document.getElementById('cxFilterBar');
  const legacyToggleWrap=document.getElementById('legacyToggleWrap');
  const legacyWrap=document.getElementById('legacyWrap');
  if(!wrap||!legacyToggleWrap||!legacyWrap) return;

  if(!state.complexes.length){
    wrap.innerHTML=`<div class="cx-empty">
      아직 등록된 단지가 없어요. 매물 탭에서 단지를 추가해보세요.
    </div>`;
    if(filterBar) filterBar.style.display='none';
    legacyToggleWrap.style.display='none';
    legacyWrap.style.display='';
    refreshOverview([]);
    return;
  }

  if(filterBar) filterBar.style.display='';
  renderCxFilterOptions();

  /* B-48: 단지 이관 완료(단지 1개 이상) 후엔 레거시 토글·상태 탭칩(.tabs)·목록(.rail)을
     통째로 숨겨 단지 카드 공간을 확보 — properties[]/renderList/renderTabs 로직과 ⋯메뉴
     "레거시 내보내기"(백업 수단)는 그대로 보존, 화면 노출만 제거. 단지 0(미마이그레이션)
     경로는 위 분기에서 legacyWrap을 이미 마이그레이션 유도 화면으로 그대로 씀 */
  legacyToggleWrap.style.display='none';
  legacyWrap.style.display='none';

  const _cxBase=state.complexes.filter(cxMatchesFilters).filter(cxMatchesSearch);
  const filtered=DESKTOP_MQ.matches?favoritesFirst(_cxBase):sortComplexes(_cxBase);
  if(!filtered.length){
    wrap.innerHTML=`<div class="cx-empty">필터 조건에 맞는 단지가 없어요.</div>`;
    refreshOverview([]);
    return;
  }

  wrap.innerHTML=filtered.map(cx=>{
    const rep=cxRepOf(cx);
    const st=cx.complexStatus||'관심';
    const color='var('+(SC_CX[st]||'--hairline')+')';
    /* B-44②: 대표가격은 헤드라인급으로 c-head-text에 별도 노출(c-price)하므로
       c-meta의 deposit 칩은 중복 제거 — "사람은 단지가 아니라 가격을 기억" */
    const priceHTML=(rep&&rep.deposit!=null)?`<div class="c-price tnum">보증금 ${rep.deposit}억 ${depositTrendBadge(rep)}</div>`:'';
    const commuteHTML=commuteCardChips(cx);
    const repHTML=rep?`<div class="c-meta">
        <span class="chip tnum">${rep.areaM2!=null?'전용 '+rep.areaM2+'㎡':(rep.areaText?esc(rep.areaText):'면적 미정')}</span>
        <span class="chip">${esc(rep.areaGrade||calcAreaGrade(rep.areaM2,state.settings.grades)||'—')}</span>
        <span class="chip ${listingStatusChipClass(rep.listingStatus)}">${esc(rep.listingStatus||'확인필요')}</span>
        ${commuteHTML}
        ${fieldNoteChip(cx)}
      </div>
      <div class="cx-listing-meta">최근 확인 ${rep.lastCheckedAt?esc(new Date(rep.lastCheckedAt).toLocaleDateString('ko-KR')):'—'}</div>`
      :`<div class="c-meta"><span class="chip warn">현재 대표매물 없음</span>${commuteHTML}${fieldNoteChip(cx)}</div>`;
    /* B-44①: "이번 주 확인 완료" 버튼은 단지 상세(cxDetailWeeklyCheckBtn)에 이미 있어
       카드에선 제거 — 뱃지·최근확인 날짜만 유지해 카드 높이를 줄이고 노출 수를 늘림 */
    const weeklyBadge=needsWeeklyCheck(cx,rep)?'<span class="chip warn">7일+ 미확인</span>':'';
    const routeCheckHTML = routeMode!=='select' ? '' :
      (cx.lat&&cx.lng
        ? `<label class="c-routecheck-wrap"><input type="checkbox" class="c-routecheck" aria-label="임장 루트에 포함" data-routecheck="${cx.id}"${routeSelected.has(cx.id)?' checked':''}></label>`
        : `<span class="c-routecheck-disabled" title="좌표가 없어 루트에 포함할 수 없어요">${ic('pin','ic-muted')} 위치없음</span>`);
    return `<div class="card" data-cxid="${cx.id}">
      <div class="c-top" data-cxopen="${cx.id}" role="button" tabindex="0">
        ${routeCheckHTML}
        <div class="c-head-text">
          <div class="c-headline">${cx.groupCode?`<span class="chip" style="margin-right:5px">${esc(cx.groupCode)}</span>`:''}${cx.regionGroup?esc(cx.regionGroup)+' · ':''}${esc(cx.complexName||'(이름 없음)')}</div>
          ${priceHTML}
          <div class="c-sub">${esc([cx.station,cx.line,cx.householdGrade].filter(Boolean).join(' · ')||'정보 없음')}${(myLoc&&cx.lat&&cx.lng)?' · <span class="cx-dist">'+(cxDistM(cx)/1000).toFixed(1)+'km</span>':''}</div>
        </div>
        <div class="c-badge-col">
          <button type="button" class="c-fav-btn${cx.favorite?' on':''}" data-favtoggle="${cx.id}" aria-label="즐겨찾기" aria-pressed="${cx.favorite?'true':'false'}">${ic('star')}</button>
          <span class="pill" style="border-left-color:${color}" data-cxstatuspill="${cx.id}"><i class="pill-dot" style="background:${color}"></i>${esc(st)}</span>
        </div>
      </div>
      <div class="cx-card-body">
        ${cx.verdict?`<div class="c-verdict">${esc(cx.verdict)}</div>`:''}
        ${repHTML}
        ${weeklyBadge?`<div class="c-actions">${weeklyBadge}</div>`:''}
      </div>
    </div>`;
  }).join('');
  refreshOverview(filtered);
}
document.getElementById('legacyToggleBtn').onclick=()=>{
  legacyExpanded=!legacyExpanded;
  document.getElementById('legacyWrap').style.display=legacyExpanded?'':'none';
  updateLegacyToggleLabel();
};
/* B-39: 즐겨찾기 토글 — 카드(delegated)·상세(cxDetailFavBtn) 공용. 새 저장
   경로 없이 기존 cx 필드 갱신 + save() + 재렌더 패턴 재사용 */
function toggleFavorite(id){
  const cx=state.complexes.find(c=>c.id===id); if(!cx) return;
  cx.favorite=!cx.favorite; cx.updatedAt=new Date().toISOString();
  save();
  renderComplexes();
  if(cxDetailId===id){
    const btn=document.getElementById('cxDetailFavBtn');
    if(btn){ btn.classList.toggle('on',cx.favorite); btn.setAttribute('aria-pressed',cx.favorite?'true':'false'); }
  }
}
document.getElementById('complexSection').addEventListener('click',e=>{
  if(e.target.closest('.c-routecheck-wrap')) return;
  const favBtn=e.target.closest('[data-favtoggle]');
  if(favBtn){ toggleFavorite(favBtn.dataset.favtoggle); return; }
  /* B-116: 단지 카드 상태 뱃지 빠른 변경 — data-cxopen(카드 전체 클릭 시 상세 열기)의
     조상 요소라 먼저 가로채 return하지 않으면 상세 모달까지 같이 열림 */
  const statusPill=e.target.closest('[data-cxstatuspill]');
  if(statusPill){
    const cx=state.complexes.find(c=>c.id===statusPill.dataset.cxstatuspill);
    if(cx) showCxStatusPicker(statusPill, cx);
    return;
  }
  const el=e.target.closest('[data-cxopen]'); if(!el)return;
  openComplexDetail(el.dataset.cxopen);
});
document.getElementById('complexSection').addEventListener('change', e=>{
  const rc=e.target.closest('[data-routecheck]'); if(!rc) return;
  rc.checked ? routeSelected.add(rc.dataset.routecheck) : routeSelected.delete(rc.dataset.routecheck);
  renderRouteBar();
});
document.getElementById('complexSection').addEventListener('keydown',e=>{
  if(e.key!=='Enter'&&e.key!==' ')return;
  const el=e.target.closest('[data-cxopen]'); if(!el)return;
  e.preventDefault(); openComplexDetail(el.dataset.cxopen);
});
function highlightCxCard(id){
  document.querySelectorAll('#complexSection .card').forEach(c=>c.classList.toggle('active',c.dataset.cxid===id));
}
function cxStripCenterId(){
  const strip=document.getElementById('complexSection'); if(!strip)return null;
  const mid=strip.scrollLeft+strip.clientWidth/2;
  let best=null,bd=Infinity;
  strip.querySelectorAll('.card[data-cxid]').forEach(c=>{
    const d=Math.abs(c.offsetLeft+c.offsetWidth/2-mid);
    if(d<bd){bd=d;best=c;}
  });
  return best?best.dataset.cxid:null;
}
function focusCxCard(id){
  const strip=document.getElementById('complexSection');
  const card=strip&&strip.querySelector('.card[data-cxid="'+id+'"]');
  if(!card){ openComplexDetail(id); return; }
  strip.scrollTo({left:Math.max(0,card.offsetLeft-(strip.clientWidth-card.offsetWidth)/2),behavior:'smooth'});
  highlightCxCard(id); reselectCxMarker(id);
}
let _cxStripRaf=null;
document.getElementById('complexSection').addEventListener('scroll',()=>{
  if(DESKTOP_MQ.matches||_cxStripRaf)return;
  _cxStripRaf=requestAnimationFrame(()=>{
    _cxStripRaf=null;
    const id=cxStripCenterId(); if(!id)return;
    highlightCxCard(id); reselectCxMarker(id);
  });
});
document.querySelectorAll('[data-cxsort]').forEach(b=>b.onclick=()=>{
  if(b.dataset.cxsort==='dist'&&!myLoc){ requestMyLoc(); return; }
  cxSort=b.dataset.cxsort; renderComplexes(); syncSortChips();
});
{ const mlb=document.getElementById('myLocBtn'); if(mlb) mlb.onclick=requestMyLoc; }
syncSortChips();

/* B-12 A안: 모바일 매물탭 지도뷰⇄리스트뷰 토글. #panel-props[data-view]로 CSS 분기,
   마커↔카드 스크롤 연동(focusCxCard 등)은 리스트뷰에선 지도가 안 보이니 애초에 호출될
   경로가 없어(마커 클릭 불가) 별도 가드 불필요 — 세션 간 기억은 안 함(새로고침 시 지도뷰로) */
let propViewMode='map';
/* B-12 재수정A: 리스트뷰 스크롤 중 정렬칩/뷰토글/⋯버튼(지도뷰에선 position:fixed
   오버레이)이 카드 위에 겹쳐 보이던 문제(B-22) — 리스트뷰에서만 이 셋을 실제로
   #cxListToolbar 안으로 옮겨 position:sticky 불투명 바로 묶음(복제 없이 DOM을
   그대로 이동해 이벤트 핸들러 유지, showMoreMenu()와 같은 패턴). 지도뷰로
   돌아가면 원래 자리(.grid/.panel-head 안)로 되돌려 기존 fixed 오버레이 동작 복원.
   B-35: cxFilterBar도 같은 방식으로 옮김(CSS에서 flex-basis:100%로 둘째 줄에 배치) */
let _listToolbarSlots=null;
function syncListToolbar(){
  const toolbar=document.getElementById('cxListToolbar');
  if(!toolbar) return;
  if(propViewMode==='list'){
    if(_listToolbarSlots) return;
    const ids=['cxSortChips','propViewToggleBtn','propMoreBtn','cxFilterBar'];
    const els=ids.map(id=>document.getElementById(id)).filter(Boolean);
    _listToolbarSlots=els.map(el=>({el,parent:el.parentElement,next:el.nextSibling}));
    els.forEach(el=>toolbar.appendChild(el));
  } else {
    if(!_listToolbarSlots) return;
    _listToolbarSlots.forEach(({el,parent,next})=>parent.insertBefore(el,next));
    _listToolbarSlots=null;
  }
}
function applyPropViewMode(){
  const panel=document.getElementById('panel-props');
  if(panel) panel.dataset.view=propViewMode;
  const btn=document.getElementById('propViewToggleBtn');
  if(btn) btn.textContent=propViewMode==='map'?'목록':'지도';
  closeCxFilterDropdowns();
  syncListToolbar();
  if(propViewMode==='map') requestAnimationFrame(()=>requestAnimationFrame(()=>{
    waitNaverMaps(()=>overview&&overview.refresh(true));
  }));
}
{ const vtb=document.getElementById('propViewToggleBtn'); if(vtb) vtb.onclick=()=>{
  propViewMode=propViewMode==='map'?'list':'map'; applyPropViewMode();
}; }
applyPropViewMode();

/* ---- (4) 단지 상세 + 매물 목록 ---- */
let cxDetailId=null, cxDetailMapObj=null, cxDetailMarker=null;
/* B-27-lite: 전세 안전 체크 섹션 기본 접힘 — 펼친 매물 id만 기억(모달 재열림 시 초기화) */
let cxSafetyExpanded=new Set();
/* B-91: 매물 필드(동호수·면적·보증금·매물상태·메모) 편집 — B-63 접이식(기본
   접힘)을 상시 노출 "수정" 버튼→명시적 모드 전환으로 교체(신규 UI 원칙,
   [[avoid-collapsible-hidden-features]]). 편집만 할 뿐 자동 판정·상태
   부수효과 없음(기존 게시중확인/사라짐처리/가격변동기록 버튼과 별개 경로).
   편집모드 진입 id만 기억 — 값은 "저장" 클릭 전까지 listing 객체에 반영
   안 됨("취소" 시 재렌더로 DOM 폐기, 값 무손실) */
let cxListingEditMode=new Set();
let cxDetailInfoEditing=false;
/* B-103 2-3: 매물 행 메모는 f_memo/em_memo와 달리 동시에 2개 이상
   편집모드로 열릴 수 있는 유일한 필드라(cxListingEditMode가 Set)
   싱글턴이 아니라 lid별 인스턴스가 필요 — Map<lid,{editor,mount}>.
   renderCxListings()가 매번 innerHTML을 통째로 재조립하므로, 그
   시작 지점에서 반드시 destroyAllListingMemoEditors()를 먼저 호출해
   이전 렌더의 Tiptap 인스턴스(DOM에서만 사라지고 JS 객체는 안
   사라짐 — destroy() 없인 메모리 누수)를 정리한다 */
let listingMemoEditors=new Map();
/* renderCxListings()는 저장 대상이 아닌 "여전히 편집 중인" 행도 매번
   innerHTML로 통째로 다시 그리는데, 그 새 textarea는 항상 l.memo(마지막
   저장값)로 채워진다 — 즉 행 A를 저장하면 행 B가 여전히 편집 중이어도
   B의 미저장 타이핑이 날아가는 게 이 함수 도입 전부터 있던 B-91의
   구조적 특성이다. destroy 시점에 "아직 편집모드인 행"의 최신 마크다운을
   잠깐 담아뒀다가 재생성 시 l.memo 대신 그걸 쓰면 이 손실을 막을 수 있어
   Tiptap 전환 김에 함께 개선했다(제너릭 저장 루프·재렌더 로직 자체는
   무변경 — 이 파일의 새 함수 내부에서만 처리) */
let listingMemoPendingContent=new Map();
function destroyAllListingMemoEditors(){
  listingMemoEditors.forEach(({editor},lid)=>{
    if(cxListingEditMode.has(lid)){
      try{ listingMemoPendingContent.set(lid,editor.storage.markdown.getMarkdown()); }catch(e){}
    }
    try{editor.destroy();}catch(e){}
  });
  listingMemoEditors.clear();
}
async function initListingMemoEditor(lid){
  if(listingMemoEditors.has(lid)) return;
  const row=document.querySelector(`[data-lid="${CSS.escape(lid)}"]`);
  if(!row) return;
  const ta=row.querySelector('.lst-memo-ta');
  if(!ta) return;
  const mods=await loadTiptapMods().catch(()=>null);
  /* 로드 대기 중 저장/취소/재렌더로 편집모드를 벗어났거나 이미 다른
     경로로 인스턴스가 생겼을 수 있어 재확인 후 진행 */
  if(!cxListingEditMode.has(lid)||listingMemoEditors.has(lid)) return;
  const freshRow=document.querySelector(`[data-lid="${CSS.escape(lid)}"]`);
  if(!freshRow) return;
  const freshTa=freshRow.querySelector('.lst-memo-ta');
  if(!freshTa) return;
  const pending=listingMemoPendingContent.has(lid)?listingMemoPendingContent.get(lid):null;
  listingMemoPendingContent.delete(lid);
  const initialContent=pending!=null?pending:(freshTa.value||'');
  if(!mods){ if(pending!=null) freshTa.value=pending; showEditorFallbackNote(freshTa); return; }
  const mount=document.createElement('div');
  mount.className='lst-memo-mount sc-md-editor sc-md-content';
  mount.dataset.placeholder=freshTa.placeholder||''; // B-110: 기존 textarea placeholder 재사용
  freshTa.insertAdjacentElement('afterend',mount);
  try{
    const listFixExt=buildListBackspaceFix(mods); // B-110: B-109① 전파
    const placeholderExt=buildTiptapPlaceholder(mods,mount); // B-110: B-109② 전파
    const editor=new mods.core.Editor({
      element:mount,
      extensions:[mods.starterKit,mods.Markdown,listFixExt,placeholderExt],
      content:initialContent,
      onUpdate:({editor})=>{ freshTa.value=editor.storage.markdown.getMarkdown(); },
    });
    freshTa.value=initialContent;
    listingMemoEditors.set(lid,{editor,mount});
    freshTa.style.display='none';
    const previewBtn=freshRow.querySelector(`[data-lstmemopreview="${CSS.escape(lid)}"]`);
    if(previewBtn) previewBtn.style.display='none';
  }catch(e){
    mount.remove();
    if(pending!=null) freshTa.value=pending;
    showEditorFallbackNote(freshTa);
  }
}
/* #cxDetailMap은 formMap/propEditMap과 동일하게 컨테이너를 절대 display:none 처리하지 않고
   인스턴스를 한 번만 만들어 재사용한다 — 지도 div를 숨겼다 다시 보이면 네이버 지도 SDK
   내부(비동기 타일 onload 콜백)에서 널 참조 에러가 남(실측 확인). 좌표 없을 땐 지도 위에
   "좌표 확인 필요" 오버레이(#cxDetailNoCoord)만 덮어 시각적으로 가린다 */
function initCxDetailMap(){
  const el=document.getElementById('cxDetailMap'); if(!el)return;
  waitNaverMaps(()=>{
    if(!cxDetailMapObj){
      cxDetailMapObj=new naver.maps.Map('cxDetailMap',{center:new naver.maps.LatLng(CENTER[0],CENTER[1]),zoom:12,zoomControl:true,zoomControlOptions:{position:naver.maps.Position.TOP_RIGHT}});
    }
    cxDetailMapObj.refresh(true);
  });
}
function setCxDetailMapPosition(lat,lng){
  waitNaverMaps(()=>{
    initCxDetailMap();
    if(!cxDetailMapObj)return;
    const pos=new naver.maps.LatLng(lat,lng);
    cxDetailMapObj.setCenter(pos); cxDetailMapObj.setZoom(15);
    if(cxDetailMarker) cxDetailMarker.setMap(null);
    cxDetailMarker=new naver.maps.Marker({position:pos,map:cxDetailMapObj});
  });
}
/* B-28: 재사용 가능한 3상태(known/unknown/na) 세그먼트 컨트롤 — 부정확한 0이
   평가·Gate를 오염시키지 않도록 "값 있음/미확인/해당없음"을 명시적으로 구분.
   단지 상세의 주차(parking)·매물 행의 관리비(managementFee) 양쪽에서 공유해서 씀.
   o = {field, value, state, caption, unit, step, placeholder, lid?} — lid가 있으면
   listings[] 대상(해당 행), 없으면 현재 열린 단지(cxDetailId) 대상으로 이벤트 핸들러가
   판정함. 상태 라벨은 고정 문자열만 삽입(사용자 입력 없음) */
function triStateHTML(o){
  const st=o.state||'unknown';
  const known=st==='known';
  return `<div class="tri-state" data-tri="${o.field}"${o.lid?` data-lid="${esc(o.lid)}"`:''} data-state="${st}">
    <div class="tri-caption">${esc(o.caption)}</div>
    <div class="tri-seg">
      <button type="button" data-trival="known" class="${known?'on':''}">값</button>
      <button type="button" data-trival="unknown" class="${st==='unknown'?'on':''}">미확인</button>
      <button type="button" data-trival="na" class="${st==='na'?'on':''}">해당없음</button>
    </div>
    <div class="tri-input-row" style="${known?'':'display:none'}">
      <input type="number" class="tri-num" data-trifield="${o.field}" step="${o.step||'1'}" min="0" value="${o.value!=null?o.value:''}" placeholder="${o.placeholder||''}">
      <span class="tri-unit">${esc(o.unit||'')}</span>
    </div>
  </div>`;
}
function parkingCaption(cx){
  if(cx.parkingState==='known') return cx.parking!=null?`세대당 ${cx.parking}대`:'세대당 —';
  if(cx.parkingState==='na') return '주차 해당없음';
  return '주차 미확인';
}
function mgmtFeeCaption(l){
  if(l.managementFeeState==='known'){
    if(l.managementFee===0) return '관리비 0만원(포함)';
    return l.managementFee!=null?`관리비 ${l.managementFee}만원`:'관리비 —';
  }
  if(l.managementFeeState==='na') return '관리비 해당없음';
  return '관리비 미확인';
}
/* B-43: listings[].history — deposit·listingStatus 변경만 기록(lastCheckedAt과
   무관), 자동 판정·정렬 개입 없음. 소급 생성 금지 원칙에 따라 기존 매물엔
   과거분을 만들어 넣지 않음 — 오직 이 두 함수를 통과한 시점부터만 쌓인다.
   recordListingHistoryIfChanged: 값이 실제로 바뀔 때만(같은 값 재저장은
   무append) — edit/check/gone/price 등 "변경"류 경로.
   recordListingHistory: 무조건 append — create(최초 상태 자체가 기록 대상)·
   merge(값은 안 바뀌어도 "이관됐다"는 사실 자체를 남겨야 하는 경로) 전용 */
function recordListingHistoryIfChanged(listing,before,source){
  if(listing.deposit===before.deposit&&listing.listingStatus===before.listingStatus) return;
  if(!Array.isArray(listing.history)) listing.history=[];
  listing.history.push({at:new Date().toISOString(),deposit:listing.deposit,listingStatus:listing.listingStatus,source});
}
function recordListingHistory(listing,source){
  if(!Array.isArray(listing.history)) listing.history=[];
  listing.history.push({at:new Date().toISOString(),deposit:listing.deposit,listingStatus:listing.listingStatus,source});
}
/* B-42: 대표가격 변동 배지 — history[]에서 deposit이 있는 가장 최근 인접
   2건을 비교(저장·판정·정렬 개입 없음, 표시용 계산만). 반올림 후 비교해
   부동소수점 오차로 "↓0억" 같은 잘못된 배지가 뜨지 않게 함. 하락=긍정
   (.chip.ok, 기존 토큰)·상승=주의(.chip.warn, 기존 토큰) — 새 색상 없음.
   deposit 있는 이력 2건 미만이거나 최근 두 값이 같으면(가격 변화 없음
   — 예: 상태만 바뀐 edit) 무표시 */
function depositTrendBadge(l){
  const hist=(Array.isArray(l.history)?l.history:[]).filter(h=>h.deposit!=null);
  if(hist.length<2) return '';
  const prev=hist[hist.length-2].deposit, cur=hist[hist.length-1].deposit;
  const diff=Math.round((cur-prev)*100)/100;
  if(diff===0) return '';
  const diffTxt=Math.abs(diff);
  return diff<0
    ? `<span class="chip ok tnum">↓${diffTxt}억</span>`
    : `<span class="chip warn tnum">↑${diffTxt}억</span>`;
}
/* B-42: deposit 추이 미니 스파크라인 — 외부 라이브러리 없이 인라인 SVG
   직접 생성(점+꺾은선, 높이 40px). 표시 전용, 저장·판정 없음. 좌표는
   전부 Math 연산으로 만든 숫자 문자열(toFixed)이라 esc() 대상인 사용자
   문자열이 섞일 경로가 없음 — priceHTML의 `${rep.deposit}` 등 기존
   순수 숫자 보간과 동일 관례로 esc() 생략. deposit 있는 이력 2건
   미만이면 빈 문자열 */
function listingSparklineHTML(l){
  const hist=(Array.isArray(l.history)?l.history:[]).filter(h=>h.deposit!=null);
  if(hist.length<2) return '';
  const W=240,H=40,PAD=4;
  const vals=hist.map(h=>h.deposit);
  const min=Math.min(...vals), max=Math.max(...vals);
  const range=max-min||1; // 전 구간 동일값이면 0 나눗셈 방지(가운데 일직선)
  const stepX=(W-PAD*2)/(vals.length-1);
  const pts=vals.map((v,i)=>({
    x:PAD+stepX*i,
    y:H-PAD-((v-min)/range)*(H-PAD*2),
  }));
  const pathD=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const dots=pts.map(p=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.5" fill="var(--line9-deep)"/>`).join('');
  return `<svg class="cx-listing-spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="보증금 추이 그래프">
    <path d="${pathD}" fill="none" stroke="var(--line9-deep)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}
/* B-27-lite②: 안전 체크 9항목 요약 배지 — SAFETY_ITEMS(state.js) 재사용,
   집계만 함(정렬·필터·숨김·자동판정 없음). 전부 '문제없음'일 때만 예외
   문구, 그 외엔 미확인/주의 개수 + 최신 확인일을 그대로 보여줌 */
function safetyBadgeChip(l){
  const items=SAFETY_ITEMS.map(({key})=>l.safety[key]);
  const uncheckedCnt=items.filter(s=>s.status==='unchecked').length;
  const warningCnt=items.filter(s=>s.status==='warning').length;
  const dates=items.map(s=>s.checkedAt).filter(Boolean).sort();
  const lastCheckedAt=dates.length?dates[dates.length-1].replace(/-/g,'.'):'';
  const allOk=items.every(s=>s.status==='ok');
  if(allOk) return `<span class="chip ok">안전 체크 완료${lastCheckedAt?` · 마지막 확인 ${esc(lastCheckedAt)}`:''}</span>`;
  return `<span class="chip${warningCnt?' warn':''}">미확인 ${uncheckedCnt} · 주의 ${warningCnt}${lastCheckedAt?` · 마지막 확인 ${esc(lastCheckedAt)}`:''}</span>`;
}
/* B-139: 안전 체크 섹션 상단 진행 집계 — 9항목 status 세기만(자동판정·차단 없음).
   색은 기존 안전체크 칩(.chip.ok/.chip.warn/기본)과 동일 */
function safetyCountBadgeHTML(l){
  const items=SAFETY_ITEMS.map(({key})=>l.safety[key]);
  const okCnt=items.filter(s=>s.status==='ok').length;
  const warnCnt=items.filter(s=>s.status==='warning').length;
  const uncheckedCnt=items.filter(s=>s.status==='unchecked').length;
  return `<div class="safety-item-row safety-count-badge">
    <span class="chip ok">확인 ${okCnt}</span>
    <span class="chip warn">경고 ${warnCnt}</span>
    <span class="chip">미확인 ${uncheckedCnt}</span>
  </div>`;
}
/* B-41: 임장 노트 요약 칩 — 별점 매긴 항목이 하나라도 있을 때만 노출(기록
   자체가 없으면 무표시). 평균은 표시용 계산일 뿐 저장·정렬·필터에 전혀
   개입하지 않는다(safetyBadgeChip과 동일하게 집계만) */
function fieldNoteChip(cx){
  const fn=cx.fieldNote; if(!fn) return '';
  const rated=FIELD_NOTE_ITEMS.map(({key})=>fn.items[key]).filter(it=>it&&it.rating!=null);
  if(!rated.length) return '';
  const avg=rated.reduce((s,it)=>s+it.rating,0)/rated.length;
  return `<span class="chip">임장 ★${avg.toFixed(1)} · ${rated.length}/${FIELD_NOTE_ITEMS.length} 기록</span>`;
}
/* B-27-lite: 전세 안전 체크 9항목 — 기록·표시만(자동 판정·차단 없음). 기본
   접힘, 매물 행 안에서 토글해서 펼침 */
function safetySectionHTML(l){
  const expanded=cxSafetyExpanded.has(l.id);
  return `<div class="safety-wrap${expanded?' expanded':''}">
    <button type="button" class="gates-toggle" data-safetoggle="${esc(l.id)}">전세 안전 체크 ${expanded?'접기':'펼치기'} <span class="gates-toggle-caret">▾</span></button>
    <div class="safety-list" style="${expanded?'':'display:none'}">
      ${safetyCountBadgeHTML(l)}
      ${SAFETY_ITEMS.map(item=>{
        const s=l.safety[item.key];
        return `<div class="safety-item">
          <div class="safety-item-head">
            <span class="safety-item-label">${esc(item.label)}</span>
            <select class="safety-status-sel" data-safefield="status" data-safekey="${item.key}" data-lid="${esc(l.id)}">
              ${Object.entries(SAFETY_STATUS_LABEL).map(([v,lb])=>`<option value="${v}" ${s.status===v?'selected':''}>${lb}</option>`).join('')}
            </select>
          </div>
          <div class="safety-item-row">
            <input type="text" class="safety-memo" data-safefield="memo" data-safekey="${item.key}" data-lid="${esc(l.id)}" value="${esc(s.memo)}" placeholder="메모">
            <select class="safety-source-sel" data-safefield="source" data-safekey="${item.key}" data-lid="${esc(l.id)}">
              <option value="">출처 선택</option>
              ${SAFETY_SOURCES.map(src=>`<option value="${src}" ${s.source===src?'selected':''}>${src}</option>`).join('')}
            </select>
            <input type="date" class="safety-date" data-safefield="checkedAt" data-safekey="${item.key}" data-lid="${esc(l.id)}" value="${s.checkedAt||''}">
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}
/* B-91: 매물 필드 편집 — dongHo/areaM2/areaText/deposit/listingStatus/memo.
   areaGrade는 저장하지 않음(항상 calcAreaGrade(l.areaM2,...)로 실시간 계산,
   기존 표시 로직과 동일). "저장" 클릭 전까지는 이 입력값들이 listing 객체에
   전혀 반영되지 않는다(버퍼는 DOM 자체 — "취소"는 그냥 재렌더해서 폐기).
   B-92: 붙여넣기 자동채우기(.paste, ADD 폼 fillBtn과 동일 패턴)를 이 안에
   추가 — 보증금·전용면적·메모 3필드만 대상(파싱이 신뢰성 있게 뽑는 값) */
function listingEditFieldsHTML(l){
  return `<div class="paste">
      <label>매물 정보 붙여넣기 (선택)</label>
      <textarea class="lst-pastebox" placeholder="네이버 매물 글을 붙여넣으면 보증금·전용면적·메모를 자동으로 채워요"></textarea>
      <div class="pa"><button type="button" class="btn-fill" data-lstfill="${esc(l.id)}">정보 자동 채우기</button></div>
    </div>
    <div class="safety-item-row">
      <input type="text" class="safety-memo" data-editfield="dongHo" value="${esc(l.dongHo||'')}" placeholder="동/호 (예: 101동 502호)">
    </div>
    <div class="safety-item-row">
      <input type="number" class="tri-num" data-editfield="areaM2" min="0" step="0.01" value="${l.areaM2!=null?l.areaM2:''}" placeholder="전용면적(㎡)">
      <input type="text" class="safety-memo" data-editfield="areaText" value="${esc(l.areaText||'')}" placeholder="면적 텍스트(예: 24평)">
    </div>
    <div class="safety-item-row">
      <input type="number" class="tri-num" data-editfield="deposit" min="0" step="0.01" value="${l.deposit!=null?l.deposit:''}" placeholder="보증금(억)">
      <select class="safety-status-sel" data-editfield="listingStatus">
        ${LISTING_STATUS_OPTIONS.map(st=>`<option value="${st}" ${(l.listingStatus||'확인필요')===st?'selected':''}>${st}</option>`).join('')}
      </select>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin:6px 0 4px;">
      <label style="font-size:11.5px;font-weight:700;color:var(--ink-soft);">메모</label>
      <button type="button" class="sc-preview-toggle" data-lstmemopreview="${esc(l.id)}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg> 미리보기</button>
    </div>
    <div class="safety-item-row">
      <textarea class="safety-memo lst-memo-ta" data-editfield="memo" placeholder="매물 메모">${esc(l.memo||'')}</textarea>
    </div>
    <div class="lst-memo-preview sc-md-preview sc-md-content" style="display:none;border:1px solid var(--hairline);border-radius:9px;padding:12px;margin-top:6px;"></div>
    <div class="c-actions">
      <button type="button" data-lstsave="${esc(l.id)}">저장</button>
      <button type="button" data-lstcancel="${esc(l.id)}">취소</button>
    </div>`;
}
document.getElementById('cxDetailListings').addEventListener('click',e=>{
  const editBtn=e.target.closest('[data-lstedit]');
  if(editBtn){
    cxListingEditMode.add(editBtn.dataset.lstedit);
    const listing=state.listings.find(l=>l.id===editBtn.dataset.lstedit); if(listing) renderCxListings(listing.complexId);
    return;
  }
  const cancelBtn=e.target.closest('[data-lstcancel]');
  if(cancelBtn){
    cxListingEditMode.delete(cancelBtn.dataset.lstcancel);
    const listing=state.listings.find(l=>l.id===cancelBtn.dataset.lstcancel); if(listing) renderCxListings(listing.complexId);
    return;
  }
  const saveBtn=e.target.closest('[data-lstsave]');
  if(saveBtn){
    const lid=saveBtn.dataset.lstsave;
    const listing=state.listings.find(l=>l.id===lid); if(!listing) return;
    const row=saveBtn.closest('[data-lid]'); if(!row) return;
    const before={deposit:listing.deposit,listingStatus:listing.listingStatus};
    row.querySelectorAll('[data-editfield]').forEach(el=>{
      const field=el.dataset.editfield;
      if(field==='areaM2'||field==='deposit'){
        if(el.value===''){ listing[field]=null; }
        else{
          const v=parseFloat(el.value);
          if(!isNaN(v)&&v>=0) listing[field]=v;
        }
      } else if(field==='listingStatus'){
        listing.listingStatus=el.value;
      } else {
        listing[field]=el.value.trim();
      }
    });
    recordListingHistoryIfChanged(listing,before,'edit');
    cxListingEditMode.delete(lid);
    save();
    renderCxListings(listing.complexId);
    renderComplexes();
    return;
  }
});
/* B-97: 매물 수정모드 메모 미리보기 — 행마다 동적으로 렌더되는 요소라
   고정 ID 대신 data-lid로 스코프해서 찾음(fillBtn과 동일한 위임 패턴) */
document.getElementById('cxDetailListings').addEventListener('click',e=>{
  const btn=e.target.closest('[data-lstmemopreview]'); if(!btn) return;
  const row=btn.closest('[data-lid]'); if(!row) return;
  const ta=row.querySelector('.lst-memo-ta');
  const prev=row.querySelector('.lst-memo-preview');
  if(!ta||!prev) return;
  memoPreviewToggle(btn,ta,prev,null);
});
/* B-92: 정보 자동 채우기 — ADD 폼 fillBtn과 동일하게 정규식 파싱(parseNaver)
   우선, 실패 시 AI 폴백. ADD 폼과 달리 필드가 이미 값을 갖고 있을 수 있어
   덮어쓰기 전 확인([[기록 보존 원칙]]) — listing 객체가 아니라 아직 DOM
   입력값만 바꾼다(저장 전까지 미반영은 위 편집 흐름과 동일) */
document.getElementById('cxDetailListings').addEventListener('click',async e=>{
  const fillBtn=e.target.closest('[data-lstfill]'); if(!fillBtn) return;
  const row=fillBtn.closest('[data-lid]'); if(!row) return;
  const ta=row.querySelector('.lst-pastebox');
  const txt=(ta&&ta.value||'').trim();
  if(!txt){ if(ta) ta.focus(); return; }
  const old=fillBtn.innerHTML;
  let j=parseNaver(txt);
  let promotion=createComplexPromotion(j);
  let got=(j.deposit!=null||j.area!=null||j.memo||promotion);
  if(!got){
    fillBtn.disabled=true; fillBtn.textContent='읽는 중…';
    try{
      const out=await claudeAPI([{role:"user",content:
        `다음 한국 부동산(전세) 매물 글에서 핵심만 JSON으로. 설명·마크다운 금지.\n`+
        `형식:{"deposit":보증금억숫자,"area":전용면적㎡숫자,"memo":"한줄"}\n`+
        `보증금 '2억7천'→2.7. 모르면 null.\n\n${txt}`}]);
      const aj=parseJSON(out);
      if(aj){ j=aj; promotion=createComplexPromotion(j); got=(j.deposit!=null||j.area!=null||j.memo||promotion); }
    }catch(err){/* AI 실패 시 아래에서 못 읽었어요 표시 */}
    fillBtn.disabled=false; fillBtn.innerHTML=old;
    if(!got){ fillBtn.textContent='못 읽었어요 — 직접 입력'; setTimeout(()=>{fillBtn.innerHTML=old;},2000); return; }
  }
  const depositInp=row.querySelector('[data-editfield="deposit"]');
  const areaInp=row.querySelector('[data-editfield="areaM2"]');
  const memoInp=row.querySelector('[data-editfield="memo"]');
  const diffs=[];
  if(j.deposit!=null&&depositInp.value!==''&&parseFloat(depositInp.value)!==j.deposit) diffs.push(`보증금 ${depositInp.value}억→${j.deposit}억`);
  if(j.area!=null&&areaInp.value!==''&&parseFloat(areaInp.value)!==j.area) diffs.push(`전용면적 ${areaInp.value}㎡→${j.area}㎡`);
  if(j.memo&&memoInp.value.trim()&&memoInp.value.trim()!==j.memo) diffs.push('메모 내용 변경');
  if(diffs.length&&!confirm(`다음 값을 덮어쓸까요?\n${diffs.join('\n')}`)) return;
  if(j.deposit!=null) depositInp.value=j.deposit;
  if(j.area!=null) areaInp.value=j.area;
  if(j.memo){
    memoInp.value=j.memo;
    const inst=listingMemoEditors.get(fillBtn.dataset.lstfill);
    if(inst) inst.editor.commands.setContent(j.memo);
  }
  const listing=state.listings.find(l=>l.id===fillBtn.dataset.lstfill);
  const cx=listing&&state.complexes.find(c=>c.id===listing.complexId);
  applyComplexPromotion(cx,promotion);
});
document.getElementById('cxDetailListings').addEventListener('click',e=>{
  const btn=e.target.closest('[data-safetoggle]'); if(!btn) return;
  const lid=btn.dataset.safetoggle;
  if(cxSafetyExpanded.has(lid)) cxSafetyExpanded.delete(lid);
  else cxSafetyExpanded.add(lid);
  const listing=state.listings.find(l=>l.id===lid); if(!listing) return;
  renderCxListings(listing.complexId);
});
document.getElementById('cxDetailListings').addEventListener('change',e=>{
  const el=e.target.closest('[data-safefield]'); if(!el) return;
  const {safefield,safekey,lid}=el.dataset;
  const listing=state.listings.find(l=>l.id===lid); if(!listing) return;
  listing.safety[safekey][safefield]=el.value;
  save();
  renderCxListings(listing.complexId);
});
/* B-103 2-3: 매물 행 메모 편집 중(저장/취소 없이) "닫기"로 모달을 그냥
   닫는 경우 — renderCxListings()가 다시 호출될 때까지 Tiptap 인스턴스가
   DOM에서만 안 보일 뿐 살아있게 되는 걸 막는 안전망. 다음에 아무
   단지든 열면(renderComplexDetailBody→renderCxListings) 어차피
   정리되지만, 닫는 즉시 정리해 누수 창을 0으로 만든다 */
document.getElementById('complexDetailModal').addEventListener('click',e=>{
  if(e.target.closest('[data-close="complexDetailModal"]')) destroyAllListingMemoEditors();
});
/* 단지(parking)·매물(managementFee) 공용 클릭/입력 핸들러 — #complexDetailModal
   안 어디서든(단지 필드 1개 + 매물 행 N개) 위임 처리 */
document.getElementById('complexDetailModal').addEventListener('click',e=>{
  const btn=e.target.closest('[data-trival]'); if(!btn) return;
  const wrap=btn.closest('[data-tri]'); if(!wrap) return;
  const field=wrap.dataset.tri, val=btn.dataset.trival, lid=wrap.dataset.lid;
  const target=lid?state.listings.find(l=>l.id===lid):state.complexes.find(c=>c.id===cxDetailId);
  if(!target) return;
  target[field+'State']=val;
  target[field]=val==='known'?(target[field]!=null?target[field]:0):null;
  save();
  if(lid) renderCxListings(target.complexId);
  else { target.updatedAt=new Date().toISOString(); renderComplexDetailBody(target); }
  renderComplexes();
});
document.getElementById('complexDetailModal').addEventListener('change',e=>{
  const inp=e.target.closest('.tri-num[data-trifield]'); if(!inp) return;
  const wrap=inp.closest('[data-tri]'); if(!wrap) return;
  const field=wrap.dataset.tri, lid=wrap.dataset.lid;
  const target=lid?state.listings.find(l=>l.id===lid):state.complexes.find(c=>c.id===cxDetailId);
  if(!target) return;
  const v=parseFloat(inp.value);
  if(isNaN(v)||v<0){ inp.value=target[field]!=null?target[field]:''; return; }
  target[field]=v; target[field+'State']='known';
  if(!lid) target.updatedAt=new Date().toISOString();
  save();
  if(lid) renderCxListings(target.complexId);
  else renderComplexDetailBody(target);
  renderComplexes();
});
function openComplexDetail(id){
  const cx=state.complexes.find(x=>x.id===id); if(!cx)return;
  cxDetailId=id;
  closeListingDetail(); /* B-117: 이전 단지에서 열려있던 매물 상세 패널 잔존 방지 */
  cxDetailInfoEditing=false;
  document.getElementById('cxDetailInfoEdit').innerHTML='';
  renderComplexDetailBody(cx);
  openModal('complexDetailModal');
  reselectCxMarker(id);
}
/* B-61: 출퇴근 2인 기록 — 자동 경로계산·판정 없음, 사용자가 직접 입력한
   소요시간(분)·환승 횟수만 기록. destSnapshot은 입력 시점의 기준지를 그대로
   복사해두고, 표시 시점에 현재 settings.commuters[i].dest와 다르면 "기준지
   변경됨" 안내만 덧붙임(기록 삭제·초기화 없음). 이름은 index로만 매칭돼
   이름을 바꿔도 기록은 그대로 유지됨 */
function commutesInputHTML(cx){
  const commuters=state.settings.commuters;
  return commuters.map((commuter,i)=>{
    const c=cx.commutes[i]||{minutes:null,transfers:null,destSnapshot:''};
    return `<div class="commute-row" data-ci="${i}">
      <div class="commute-name">${esc(commuter.name)} → ${esc(commuter.dest)}</div>
      <div class="commute-row-inputs">
        <input type="number" class="commute-minutes" data-cfield="minutes" data-ci="${i}" min="0" placeholder="소요시간(분)" value="${c.minutes!=null?c.minutes:''}">
        <input type="number" class="commute-transfers" data-cfield="transfers" data-ci="${i}" min="0" placeholder="환승 횟수" value="${c.transfers!=null?c.transfers:''}">
      </div>
    </div>`;
  }).join('')+`<div class="commute-summary">${commuteSummaryHTML(cx)}</div>`;
}
function commuteSummaryHTML(cx){
  const commuters=state.settings.commuters;
  const parts=commuters.map((commuter,i)=>{
    const c=cx.commutes[i]||{minutes:null,transfers:null,destSnapshot:''};
    const timeText=c.minutes!=null?`${c.minutes}분`:'미확인';
    const changed=c.destSnapshot&&c.destSnapshot!==commuter.dest;
    return `${esc(commuter.name)} ${timeText}${changed?' <span class="chip warn">기준지 변경됨 · 재확인 필요</span>':''}`;
  });
  const c0=cx.commutes[0]||{}, c1=cx.commutes[1]||{};
  const diffText=(c0.minutes!=null&&c1.minutes!=null)?` (차이 ${Math.abs(c0.minutes-c1.minutes)}분)`:'';
  return parts.join(' · ')+diffText;
}
function renderCxDetailCommutes(cx){
  const wrap=document.getElementById('cxDetailCommutes'); if(!wrap) return;
  wrap.innerHTML=commutesInputHTML(cx);
}
document.getElementById('cxDetailCommutes').addEventListener('change',e=>{
  const el=e.target.closest('[data-cfield]'); if(!el) return;
  const i=+el.dataset.ci;
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx) return;
  const v=el.value===''?null:parseInt(el.value,10);
  cx.commutes[i][el.dataset.cfield]=(v!=null&&!isNaN(v))?v:null;
  cx.commutes[i].destSnapshot=state.settings.commuters[i].dest||'';
  cx.updatedAt=new Date().toISOString();
  save();
  renderCxDetailCommutes(cx);
});
document.getElementById('cxDetailCommuteMemo').addEventListener('blur',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.commuteMemo=e.target.value.trim(); cx.updatedAt=new Date().toISOString();
  save();
});
/* B-41: 임장 노트 6항목 — safety(listings[]) 입력 패턴 재사용(항목별 카드+
   메모), 위젯만 select 대신 별점(1~5, 재클릭 시 해제=null로 미입력과 1점
   구분). 판정·합산 저장·필터 연동 없음, 기록·표시 전용 */
function fieldNoteItemsHTML(cx){
  const fn=cx.fieldNote||defaultComplexFieldNote();
  return FIELD_NOTE_ITEMS.map(({key,label})=>{
    const it=fn.items[key]||defaultFieldNoteItem();
    const stars=[1,2,3,4,5].map(n=>`<button type="button" class="fn-star${it.rating!=null&&n<=it.rating?' on':''}" data-fnkey="${key}" data-val="${n}" aria-label="${esc(label)} ${n}점">${ic('star')}</button>`).join('');
    return `<div class="safety-item" data-fnkey="${key}">
      <div class="safety-item-head">
        <span class="safety-item-label">${esc(label)}</span>
        <div class="fn-stars">${stars}</div>
      </div>
      <input type="text" class="safety-memo" data-fnfield="memo" data-fnkey="${key}" value="${esc(it.memo||'')}" placeholder="메모">
    </div>`;
  }).join('');
}
function renderCxDetailFieldNoteItems(cx){
  const wrap=document.getElementById('cxDetailFieldNoteItems'); if(!wrap) return;
  wrap.innerHTML=fieldNoteItemsHTML(cx);
}
/* B-41: 임장 노트 자유 메모 Tiptap 싱글턴 — em_memo(984행 부근)와 동일
   패턴. 모달이 여러 단지에 재사용되므로 최초 1회만 생성, 이후 openComplexDetail
   때마다 setContent()로 내용만 교체. onBlur는 cxDetailPros/Cons/Verdict/Memo와
   동일한 "필드별 blur 저장" 관례를 Tiptap 경로에서도 유지하기 위함(이 모달엔
   전체 저장 버튼이 없음 — em_memo는 별도 저장 버튼이 있어 다른 패턴 사용) */
let cxFnMemoTiptapEditor=null, cxFnMemoTiptapFailed=false, cxFnMemoTiptapInitPromise=null;
async function initCxFnMemoEditor(){
  if(cxFnMemoTiptapEditor) return true;
  if(cxFnMemoTiptapFailed) return false;
  if(cxFnMemoTiptapInitPromise) return cxFnMemoTiptapInitPromise;
  const ta=document.getElementById('cxDetailFieldNoteMemo');
  cxFnMemoTiptapInitPromise=(async()=>{
    const mods=await loadTiptapMods().catch(()=>null);
    if(!mods){ cxFnMemoTiptapFailed=true; showEditorFallbackNote(ta); return false; }
    let mount=document.getElementById('cxDetailFieldNoteMemoMount');
    if(!mount){
      mount=document.createElement('div');
      mount.id='cxDetailFieldNoteMemoMount';
      mount.className='sc-md-editor sc-md-content';
      mount.dataset.placeholder=ta.placeholder||'';
      ta.insertAdjacentElement('afterend',mount);
    }
    try{
      const listFixExt=buildListBackspaceFix(mods);
      const placeholderExt=buildTiptapPlaceholder(mods,mount);
      cxFnMemoTiptapEditor=new mods.core.Editor({
        element:mount,
        extensions:[mods.starterKit,mods.Markdown,listFixExt,placeholderExt],
        content:ta.value||'',
        onUpdate:({editor})=>{ ta.value=editor.storage.markdown.getMarkdown(); },
        onBlur:({editor})=>{
          const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx) return;
          cx.fieldNote.memo=editor.storage.markdown.getMarkdown().trim();
          cx.updatedAt=new Date().toISOString();
          save();
        },
      });
      ta.style.display='none';
      document.getElementById('cxDetailFieldNoteMemoPreviewToggle').style.display='none';
      document.getElementById('cxDetailFieldNoteMemoToolbar').style.display='none';
      document.getElementById('cxDetailFieldNoteMemoPreview').style.display='none';
      return true;
    }catch(e){
      cxFnMemoTiptapFailed=true; cxFnMemoTiptapEditor=null; mount.remove();
      showEditorFallbackNote(ta);
      return false;
    }
  })();
  const ok=await cxFnMemoTiptapInitPromise;
  cxFnMemoTiptapInitPromise=null;
  return ok;
}
document.getElementById('cxDetailFieldNoteMemoToolbar').onclick=e=>{
  const btn=e.target.closest('[data-cxfntgt]'); if(!btn) return;
  const ta=document.getElementById('cxDetailFieldNoteMemo');
  if(btn.dataset.cxfntgt==='wrap'){mdWrap(ta,btn.dataset.open,btn.dataset.close);}
  else if(btn.dataset.cxfntgt==='line'){mdLine(ta,btn.dataset.prefix);}
};
document.getElementById('cxDetailFieldNoteMemo').addEventListener('keydown',e=>{
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();mdWrap(e.target,'**','**');}
  if(mod&&e.key==='i'){e.preventDefault();mdWrap(e.target,'*','*');}
});
document.getElementById('cxDetailFieldNoteMemoPreviewToggle').onclick=function(){
  memoPreviewToggle(this,document.getElementById('cxDetailFieldNoteMemo'),document.getElementById('cxDetailFieldNoteMemoPreview'),document.getElementById('cxDetailFieldNoteMemoToolbar'));
};
document.getElementById('cxDetailFieldNoteMemo').addEventListener('blur',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.fieldNote.memo=e.target.value.trim(); cx.updatedAt=new Date().toISOString();
  save();
});
document.getElementById('cxDetailFieldNoteVisitedAt').addEventListener('change',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.fieldNote.visitedAt=e.target.value||null; cx.updatedAt=new Date().toISOString();
  save();
});
/* B-41: 별점 클릭 — 같은 값 재클릭 시 해제(null), 미입력과 1점을 엄격히
   구분. 카드 요약 칩(fieldNoteChip)이 rating에 의존하므로 renderComplexes()도
   함께 갱신(cxDetailVerdict와 동일하게 카드에 영향 주는 필드만 선택적으로) */
document.getElementById('complexDetailModal').addEventListener('click',e=>{
  const btn=e.target.closest('.fn-star[data-fnkey]'); if(!btn) return;
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx) return;
  const key=btn.dataset.fnkey, val=+btn.dataset.val;
  const item=cx.fieldNote.items[key];
  item.rating=(item.rating===val)?null:val;
  cx.updatedAt=new Date().toISOString();
  save();
  renderCxDetailFieldNoteItems(cx);
  renderComplexes();
});
document.getElementById('complexDetailModal').addEventListener('change',e=>{
  const el=e.target.closest('[data-fnfield="memo"][data-fnkey]'); if(!el) return;
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx) return;
  cx.fieldNote.items[el.dataset.fnkey].memo=el.value;
  cx.updatedAt=new Date().toISOString();
  save();
});
function complexInfoEditHTML(cx){
  return `<div class="field" style="margin-bottom:10px">
      <label>단지명</label>
      <input type="text" data-cxeditfield="complexName" value="${esc(cx.complexName||'')}" placeholder="예: 가양6단지">
    </div>
    <div class="field" style="margin-bottom:10px">
      <label>주소</label>
      <input type="text" data-cxeditfield="loc" value="${esc(cx.loc||'')}" placeholder="예: 강서구 가양동">
    </div>
    <div class="field" style="margin-bottom:10px">
      <label>역</label>
      <input type="text" data-cxeditfield="station" value="${esc(cx.station||'')}" placeholder="예: 가양역 도보 8분">
    </div>
    <div class="field" style="margin-bottom:10px">
      <label>노선</label>
      <input type="text" data-cxeditfield="line" value="${esc(cx.line||'')}" placeholder="예: 9호선">
    </div>
    <div class="field" style="margin-bottom:10px">
      <label>준공연도</label>
      <input type="number" min="0" step="1" data-cxeditfield="yearBuilt" value="${cx.yearBuilt!=null?esc(cx.yearBuilt):''}" placeholder="예: 1992">
    </div>
    <div class="field" style="margin-bottom:10px">
      <label>세대수</label>
      <input type="number" min="0" step="1" data-cxeditfield="households" value="${cx.households!=null?esc(cx.households):''}" placeholder="예: 1476">
    </div>
    <div class="c-actions">
      <button type="button" class="btn-save" data-cxinfosave>저장</button>
      <button type="button" class="btn-ghost" data-cxinfocancel>취소</button>
    </div>`;
}
function renderComplexDetailInfo(cx,resetBuffer=false){
  document.getElementById('cxDetailTitle').textContent=cx.complexName||'(이름 없음)';
  const setDD=(id,val,empty)=>{const el=document.getElementById(id);el.textContent=val||empty;el.classList.toggle('is-empty',!val);};
  setDD('cxDetailLoc',cx.loc,'주소 정보 없음');
  setDD('cxDetailStationLine',[cx.station,cx.line].filter(Boolean).join(' · '),'역·노선 정보 없음');
  setDD('cxDetailYear',cx.yearBuilt!=null?cx.yearBuilt+'년 준공':'','준공연도 미입력');
  setDD('cxDetailHouseholds',cx.households!=null?(cx.households+'세대'+(cx.householdGrade?' · '+cx.householdGrade:'')):'','세대수 미입력');
  setDD('cxDetailCommute',[
    cx.commuteGangnam!=null?'강남역 '+cx.commuteGangnam+'분':null,
    cx.commuteSinsa!=null?'신사역 '+cx.commuteSinsa+'분':null
  ].filter(Boolean).join(' · '),'출퇴근 정보 없음');
  const view=document.getElementById('cxDetailInfoView');
  const edit=document.getElementById('cxDetailInfoEdit');
  view.style.display=cxDetailInfoEditing?'none':'';
  edit.style.display=cxDetailInfoEditing?'':'none';
  if(cxDetailInfoEditing){
    if(resetBuffer||!edit.querySelector('[data-cxeditfield]')) edit.innerHTML=complexInfoEditHTML(cx);
  } else {
    edit.innerHTML='';
  }
}
function readComplexInfoInt(field){
  const input=document.querySelector(`#cxDetailInfoEdit [data-cxeditfield="${field}"]`);
  input.setCustomValidity('');
  const raw=input.value.trim();
  if(raw==='') return {ok:true,value:null};
  const value=Number(raw);
  if(!Number.isInteger(value)||value<0){
    input.setCustomValidity('0 이상의 정수로 입력해주세요.');
    input.reportValidity();
    return {ok:false,value:null};
  }
  return {ok:true,value};
}
document.getElementById('cxDetailInfoEditBtn').onclick=()=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cxDetailInfoEditing=true;
  renderComplexDetailInfo(cx,true);
};
document.getElementById('cxDetailInfoEdit').addEventListener('click',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  if(e.target.closest('[data-cxinfocancel]')){
    cxDetailInfoEditing=false;
    renderComplexDetailInfo(cx);
    return;
  }
  if(!e.target.closest('[data-cxinfosave]')) return;
  const wrap=document.getElementById('cxDetailInfoEdit');
  const nameInput=wrap.querySelector('[data-cxeditfield="complexName"]');
  const complexName=nameInput.value.trim();
  nameInput.setCustomValidity('');
  if(!complexName){
    nameInput.setCustomValidity('단지명을 입력해주세요.');
    nameInput.reportValidity();
    return;
  }
  const year=readComplexInfoInt('yearBuilt');
  const households=readComplexInfoInt('households');
  if(!year.ok||!households.ok) return;
  const loc=wrap.querySelector('[data-cxeditfield="loc"]').value.trim();
  const station=wrap.querySelector('[data-cxeditfield="station"]').value.trim();
  const line=wrap.querySelector('[data-cxeditfield="line"]').value.trim();
  if(cx.complexName!==complexName||cx.loc!==loc) cx.geocodeQuery=buildGeocodeQuery(loc,complexName);
  cx.complexName=complexName;
  cx.loc=loc;
  cx.station=station;
  cx.line=line;
  cx.yearBuilt=year.value;
  cx.households=households.value;
  cx.householdGrade=calcHouseholdGrade(households.value,state.settings.grades);
  cx.updatedAt=new Date().toISOString();
  cxDetailInfoEditing=false;
  save();
  renderComplexDetailBody(cx);
  renderComplexes();
  toast('단지 정보를 저장했어요');
});
function renderComplexDetailBody(cx){
  renderComplexDetailInfo(cx);
  const favBtn=document.getElementById('cxDetailFavBtn');
  if(favBtn){ favBtn.classList.toggle('on',!!cx.favorite); favBtn.setAttribute('aria-pressed',cx.favorite?'true':'false'); }
  const parkingWrap=document.getElementById('cxDetailParkingWrap');
  if(parkingWrap) parkingWrap.innerHTML=triStateHTML({
    field:'parking', value:cx.parking, state:cx.parkingState,
    caption:parkingCaption(cx), unit:'대/세대', step:'0.1', placeholder:'예: 1.2',
  });
  renderCxDetailCommutes(cx);
  document.getElementById('cxDetailCommuteMemo').value=cx.commuteMemo||'';
  document.getElementById('cxDetailStatusSel').value=cx.complexStatus||'관심';
  document.getElementById('cxDetailPros').value=cx.pros||'';
  document.getElementById('cxDetailCons').value=cx.cons||'';
  document.getElementById('cxDetailVerdict').value=cx.verdict||'';
  document.getElementById('cxDetailMemo').value=cx.memo||'';

  if(!cx.fieldNote) cx.fieldNote=defaultComplexFieldNote();
  document.getElementById('cxDetailFieldNoteVisitedAt').value=cx.fieldNote.visitedAt||'';
  renderCxDetailFieldNoteItems(cx);
  document.getElementById('cxDetailFieldNoteMemo').value=cx.fieldNote.memo||'';
  if(cxFnMemoTiptapEditor){
    cxFnMemoTiptapEditor.commands.setContent(cx.fieldNote.memo||'');
  } else if(!cxFnMemoTiptapFailed){
    initCxFnMemoEditor().then(ok=>{
      if(ok&&cxDetailId===cx.id) cxFnMemoTiptapEditor.commands.setContent(cx.fieldNote.memo||'');
    });
  }

  const repForWeekly=cxRepOf(cx);
  const weeklyBtn=document.getElementById('cxDetailWeeklyCheckBtn');
  if(weeklyBtn) weeklyBtn.disabled=!repForWeekly;
  const weeklyBadge=document.getElementById('cxDetailWeeklyBadge');
  if(weeklyBadge) weeklyBadge.style.display=needsWeeklyCheck(cx,repForWeekly)?'':'none';

  const noCoord=document.getElementById('cxDetailNoCoord');
  if(cx.lat&&cx.lng){
    noCoord.style.display='none';
    setTimeout(()=>setCxDetailMapPosition(cx.lat,cx.lng),120);
  } else {
    noCoord.style.display='flex';
  }
  renderCxListings(cx.id);
}
/* B-99: 단지 상세 "위치 재검색" — 좌표 유무와 무관하게 상시 노출(신규 UI
   원칙, [[avoid-collapsible-hidden-features]] — B-92의 "좌표 없을 때만"
   조건부 노출을 확장). B-90 패턴(진행 표시·비차단·실패 문구) 그대로 재사용.
   B-92 자동채우기와 동일 원칙: 이미 좌표가 있는데 재검색이 다른 좌표를
   찾으면 조용히 덮어쓰지 않고 confirm()으로 변경 내역을 보여준 뒤에만
   반영 — 좌표가 없던 경우(hadCoords=false)는 확인할 기존값이 없으므로
   즉시 반영(B-92 이전과 동일) */
document.getElementById('cxDetailFindLocBtn')?.addEventListener('click',async function(){
  const cx=state.complexes.find(c=>c.id===cxDetailId); if(!cx) return;
  const hadCoords=cx.lat!=null&&cx.lng!=null;
  this.disabled=true; const old=this.textContent; this.textContent='찾는 중…';
  try{
    const j=await geocode(cx.geocodeQuery||buildGeocodeQuery(cx.loc,cx.complexName));
    if(j.found){
      if(hadCoords){
        const same=Math.abs(cx.lat-j.lat)<1e-6&&Math.abs(cx.lng-j.lng)<1e-6;
        if(!same&&!confirm(`기존 좌표를 새로 찾은 위치로 바꿀까요?\n기존: ${cx.lat.toFixed(5)}, ${cx.lng.toFixed(5)}\n신규: ${j.lat.toFixed(5)}, ${j.lng.toFixed(5)}`)){
          this.disabled=false; this.textContent=old; return;
        }
      }
      cx.lat=j.lat; cx.lng=j.lng; cx.updatedAt=new Date().toISOString();
      save(); renderComplexDetailBody(cx); renderComplexes(); refreshOverview();
      /* B-99: 버튼이 이제 좌표 유무와 무관하게 상시 노출이라(더 이상
         #cxDetailNoCoord 뒤로 숨겨지지 않음) 성공 경로에서도 반드시
         원복해야 다음 재검색에 다시 쓸 수 있다 */
      this.disabled=false; this.textContent=old;
      return;
    }
    this.textContent='못 찾음 — 주소를 확인해주세요';
  }catch(e){ this.textContent='검색 실패 — 잠시 후 다시 시도'; }
  setTimeout(()=>{ this.disabled=false; this.textContent=old; },1600);
});
/* B-138: 값 없음을 "—"가 아니라 입력폼 placeholder 톤(.is-empty)으로 */
function emptyHint(text){return `<span class="is-empty">${esc(text)}</span>`;}
function renderCxListings(complexId){
  destroyAllListingMemoEditors();
  const wrap=document.getElementById('cxDetailListings'); if(!wrap)return;
  const listings=state.listings.filter(l=>l.complexId===complexId)
    .slice().sort((a,b)=>new Date(a.capturedAt||0)-new Date(b.capturedAt||0));
  if(!listings.length){
    wrap.innerHTML='<p style="font-size:12.5px;color:var(--ink-soft)">등록된 매물이 없어요.</p>';
    renderListingDetailPanel();
    return;
  }
  wrap.innerHTML=listings.map(l=>{
    const safeHref=l.url?safeUrl(l.url):'';
    const editing=cxListingEditMode.has(l.id);
    return `<div class="cx-listing-row" data-lid="${l.id}">
      <div class="cx-listing-top">
        <span class="cx-listing-dongho">${esc(l.dongHo||'동/호 미상')}</span>
        <span class="chip ${listingStatusChipClass(l.listingStatus)}">${esc(l.listingStatus||'확인필요')}</span>
        ${l.isRepresentative?'<span class="chip ok">대표매물</span>':''}
        ${safetyBadgeChip(l)}
      </div>
      <div class="cx-listing-meta tnum">${l.deposit!=null?'보증금 '+l.deposit+'억':'보증금 미정'} ${depositTrendBadge(l)} · ${l.areaM2!=null?'전용 '+l.areaM2+'㎡':(l.areaText?esc(l.areaText):'면적 미정')} · ${(l.areaGrade||calcAreaGrade(l.areaM2,state.settings.grades))?esc(l.areaGrade||calcAreaGrade(l.areaM2,state.settings.grades)):emptyHint('등급 미정')}</div>
      <div class="cx-listing-meta">수집 ${l.capturedAt?esc(new Date(l.capturedAt).toLocaleDateString('ko-KR')):emptyHint('기록 없음')} · 확인 ${l.lastCheckedAt?esc(new Date(l.lastCheckedAt).toLocaleDateString('ko-KR')):emptyHint('기록 없음')}</div>
      ${!editing&&l.memo?`<div class="c-memo sc-md-content">${renderMd(l.memo)}</div>`:''}
      ${triStateHTML({field:'managementFee', value:l.managementFee, state:l.managementFeeState, caption:mgmtFeeCaption(l), unit:'만원', step:'1', placeholder:'예: 15', lid:l.id})}
      ${editing?listingEditFieldsHTML(l):''}
      ${safetySectionHTML(l)}
      <div class="c-actions">
        ${editing?'':`<button type="button" data-lstedit="${l.id}">수정</button>`}
        ${l.isRepresentative?'':`<button data-lact="rep">대표매물로 설정</button>`}
        <button data-lact="check">게시중 확인</button>
        <button data-lact="gone">사라짐 처리</button>
        <button data-lact="price">가격변동 기록</button>
        ${safeHref?`<a href="${safeHref}" target="_blank" rel="noopener">${ic('link')} URL 열기</a>`:''}
        <button data-lact="del" class="c-act-del">삭제</button>
      </div>
    </div>`;
  }).join('');
  listings.forEach(l=>{ if(cxListingEditMode.has(l.id)) initListingMemoEditor(l.id); });
  /* B-117: 매물 목록이 재렌더될 때마다(모든 매물 데이터 변경 경로가 공통으로 이
     함수를 거침) 사이드 패널이 열려있으면 같은 데이터로 다시 그림 — 개별 핸들러마다
     동기화 호출을 따로 추가할 필요 없이 여기 한 곳으로 충분. 보던 매물이 방금
     삭제됐다면 renderListingDetailPanel 내부에서 자동으로 패널을 닫는다 */
  renderListingDetailPanel();
}
/* ============ B-117: 매물 상세 사이드 패널 (읽기 전용, 단지 상세 옆 확장) ============
   편집은 신설하지 않음 — "수정" 버튼은 기존 행 인라인 수정모드(B-91)를 그대로 켠다.
   스키마·자동 판정 없음, esc()/renderMd 기존 경로만 재사용 */
let cxListingDetailId=null;
function daysAgoLabel(iso){
  if(!iso) return '확인 기록 없음';
  const days=Math.floor((Date.now()-new Date(iso).getTime())/86400000);
  if(days<=0) return '오늘 확인';
  return `${days}일 전 확인`;
}
/* safetySectionHTML(편집용 select/input)과 별개의 읽기 전용 렌더러 —
   같은 SAFETY_ITEMS/SAFETY_STATUS_LABEL(state.js)만 재사용, 새 데이터 형태 없음 */
function safetyReadOnlyHTML(l){
  return `<div class="safety-list">
    ${safetyCountBadgeHTML(l)}
    ${SAFETY_ITEMS.map(item=>{
      const s=l.safety[item.key];
      const cls=s.status==='warning'?' warn':(s.status==='ok'?' ok':'');
      const metaParts=[s.memo?esc(s.memo):'',s.source?esc(s.source):'',s.checkedAt?esc(s.checkedAt):''].filter(Boolean);
      return `<div class="safety-item">
        <div class="safety-item-head">
          <span class="safety-item-label">${esc(item.label)}</span>
          <span class="chip${cls}">${esc(SAFETY_STATUS_LABEL[s.status]||'미확인')}</span>
        </div>
        ${metaParts.length?`<div class="cx-listing-meta">${metaParts.join(' · ')}</div>`:''}
      </div>`;
    }).join('')}
  </div>`;
}
/* B-43: 변동 이력 — 시간 역순 리스트만(시각화·추세 화살표는 B-42 몫). deposit·
   listingStatus가 실제로 바뀐 시점만 쌓이므로(자동 판정·정렬 개입 없음), 목록
   자체가 곧 그 매물의 실제 변경 이력. 새 CSS 없이 기존 .cx-listing-meta 재사용 */
function listingHistoryHTML(l){
  const hist=Array.isArray(l.history)?l.history:[];
  if(!hist.length) return '<div class="cx-listing-meta">변동 이력 없음</div>';
  return [...hist].reverse().map(h=>{
    const d=new Date(h.at);
    const dateLabel=isNaN(d.getTime())?'—':`${d.getMonth()+1}/${d.getDate()}`;
    const priceLabel=h.deposit!=null?`${h.deposit}억`:'가격 미정';
    const statusLabel=esc(h.listingStatus||'—');
    const sourceLabel=esc(HISTORY_SOURCE_LABEL[h.source]||h.source||'—');
    return `<div class="cx-listing-meta tnum">${esc(dateLabel)} ${esc(priceLabel)}·${statusLabel} (${sourceLabel})</div>`;
  }).join('');
}
function listingDetailBodyHTML(l){
  const safeHref=l.url?safeUrl(l.url):'';
  return `
    <div class="cx-listing-top">
      <span class="cx-listing-dongho">${esc(l.dongHo||'동/호 미상')}</span>
      <span class="chip ${listingStatusChipClass(l.listingStatus)}">${esc(l.listingStatus||'확인필요')}</span>
      ${l.isRepresentative?'<span class="chip ok">대표매물</span>':''}
    </div>
    <div class="cx-listing-meta tnum">${l.deposit!=null?'보증금 '+l.deposit+'억':'보증금 미정'} · ${l.areaM2!=null?'전용 '+l.areaM2+'㎡':(l.areaText?esc(l.areaText):'면적 미정')} · ${(l.areaGrade||calcAreaGrade(l.areaM2,state.settings.grades))?esc(l.areaGrade||calcAreaGrade(l.areaM2,state.settings.grades)):emptyHint('등급 미정')}</div>
    <div class="cx-listing-meta">${esc(mgmtFeeCaption(l))}</div>
    <div class="cx-listing-meta">수집 ${l.capturedAt?esc(new Date(l.capturedAt).toLocaleDateString('ko-KR')):emptyHint('기록 없음')} · ${esc(daysAgoLabel(l.lastCheckedAt))}</div>
    ${safeHref?`<div class="c-actions" style="margin:6px 0"><a href="${safeHref}" target="_blank" rel="noopener">${ic('link')} URL 열기</a></div>`:''}
    ${l.memo?`<div class="c-memo sc-md-content">${renderMd(l.memo)}</div>`:'<div class="cx-listing-meta">메모 없음</div>'}
    <h3 style="font-size:13px;margin:14px 0 8px">전세 안전 체크</h3>
    ${safetyReadOnlyHTML(l)}
    <h3 style="font-size:13px;margin:14px 0 8px">변동 이력</h3>
    ${listingSparklineHTML(l)}
    ${listingHistoryHTML(l)}
  `;
}
function renderListingDetailPanel(){
  const panel=document.getElementById('cxListingDetailBox');
  if(!panel) return;
  if(!cxListingDetailId){ panel.classList.remove('open'); return; }
  const listing=state.listings.find(l=>l.id===cxListingDetailId);
  if(!listing){ closeListingDetail(); return; }
  const cx=state.complexes.find(c=>c.id===listing.complexId);
  document.getElementById('cxListingDetailTitle').textContent=
    (cx?cx.complexName+' · ':'')+(listing.dongHo||'동/호 미상');
  document.getElementById('cxListingDetailBody').innerHTML=listingDetailBodyHTML(listing);
  panel.classList.add('open');
}
function openListingDetail(lid){
  cxListingDetailId=lid;
  renderListingDetailPanel();
}
function closeListingDetail(){
  cxListingDetailId=null;
  const panel=document.getElementById('cxListingDetailBox');
  if(panel) panel.classList.remove('open');
}
document.getElementById('cxListingDetailBackBtn').onclick=closeListingDetail;
document.getElementById('cxListingDetailEditBtn').onclick=()=>{
  const lid=cxListingDetailId; if(!lid) return;
  const listing=state.listings.find(l=>l.id===lid); if(!listing) return;
  closeListingDetail();
  cxListingEditMode.add(lid);
  renderCxListings(listing.complexId);
  const row=document.querySelector(`#cxDetailListings [data-lid="${CSS.escape(lid)}"]`);
  if(row) row.scrollIntoView({block:'center',behavior:'smooth'});
};
/* 행 클릭(버튼류 제외 영역) → 사이드 패널. a/button/input/select/textarea는 이미
   각자 다른 위임 핸들러(수정·삭제·URL·안전체크 select 등)가 처리하므로 여기서
   제외 — stopPropagation 없이 병행해도 서로 간섭하지 않는다(각자 독립적으로
   closest 매칭 후 return). 수정모드 행은 이미 입력 폼이라 상세 열기 대상에서 제외 */
document.getElementById('cxDetailListings').addEventListener('click',e=>{
  if(e.target.closest('a,button,input,select,textarea')) return;
  const row=e.target.closest('[data-lid]'); if(!row) return;
  if(cxListingEditMode.has(row.dataset.lid)) return;
  openListingDetail(row.dataset.lid);
});
document.getElementById('cxDetailListings').addEventListener('click',e=>{
  const btn=e.target.closest('[data-lact]'); if(!btn)return;
  const row=btn.closest('[data-lid]'); if(!row)return;
  const lid=row.dataset.lid;
  const listing=state.listings.find(l=>l.id===lid); if(!listing)return;
  const act=btn.dataset.lact;
  if(act==='rep'){
    state.listings.filter(l=>l.complexId===listing.complexId).forEach(l=>l.isRepresentative=false);
    listing.isRepresentative=true;
  } else if(act==='check'){
    const before={deposit:listing.deposit,listingStatus:listing.listingStatus};
    listing.lastCheckedAt=new Date().toISOString();
    listing.listingStatus='게시중';
    recordListingHistoryIfChanged(listing,before,'check');
  } else if(act==='gone'){
    const before={deposit:listing.deposit,listingStatus:listing.listingStatus};
    listing.listingStatus='사라짐';
    recordListingHistoryIfChanged(listing,before,'gone');
  } else if(act==='price'){
    const nv=prompt('새 보증금(억)을 입력하세요',listing.deposit!=null?listing.deposit:'');
    if(nv==null)return;
    const num=parseFloat(nv);
    if(isNaN(num))return;
    const before={deposit:listing.deposit,listingStatus:listing.listingStatus};
    listing.deposit=num;
    listing.listingStatus='가격변동';
    listing.lastCheckedAt=new Date().toISOString();
    recordListingHistoryIfChanged(listing,before,'price');
  } else if(act==='del'){
    if(!confirm('이 매물 기록을 삭제할까요? (단지는 유지돼요)'))return;
    state.listings=state.listings.filter(l=>l.id!==lid);
  }
  save();
  renderCxListings(listing.complexId);
  renderComplexes();
});
document.getElementById('cxDetailStatusSel').onchange=e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.complexStatus=e.target.value; cx.updatedAt=new Date().toISOString();
  /* B-116: 카드 빠른 경로(showCxStatusPicker)와 동일하게 요약 카운트(renderStats)도
     같이 갱신 — 두 경로 모두 지도·필터·카운트가 즉시 동기화되도록 맞춤 */
  save(); renderStats(); renderComplexes();
};
document.getElementById('cxDetailFavBtn').onclick=()=>{
  if(!cxDetailId) return;
  toggleFavorite(cxDetailId);
};
document.getElementById('cxDetailWeeklyCheckBtn').onclick=()=>{
  if(!cxDetailId) return;
  weeklyCheckComplex(cxDetailId);
  const cx=state.complexes.find(x=>x.id===cxDetailId);
  if(cx) renderComplexDetailBody(cx);
};
document.getElementById('cxDetailMemo').addEventListener('blur',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.memo=e.target.value.trim(); cx.updatedAt=new Date().toISOString();
  save();
});
/* B-38: 판단메모(장점·단점·한줄판단) — cxDetailMemo와 동일한 blur 저장 패턴
   재사용(새 저장 경로 없음). verdict만 단지 카드에도 노출되므로 저장 후
   renderComplexes() 추가 호출 */
document.getElementById('cxDetailPros').addEventListener('blur',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.pros=e.target.value.trim(); cx.updatedAt=new Date().toISOString();
  save();
});
document.getElementById('cxDetailCons').addEventListener('blur',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.cons=e.target.value.trim(); cx.updatedAt=new Date().toISOString();
  save();
});
document.getElementById('cxDetailVerdict').addEventListener('blur',e=>{
  const cx=state.complexes.find(x=>x.id===cxDetailId); if(!cx)return;
  cx.verdict=e.target.value.trim(); cx.updatedAt=new Date().toISOString();
  save();
  renderComplexes();
});

/* B-21: 바텀시트(단지 상세) 드래그다운 닫기. 배경 딤 탭 닫기는 이미 위쪽
   document.querySelectorAll('.modal').forEach(...) 범용 핸들러가 처리하고 있어
   별도 구현 불필요(확인 완료) — 여기선 드래그다운만 추가.
   핸들(.box::before)+헤더(.mhead)가 .box 맨 위 ~60px 안에 있고, B-59로 헤더가
   sticky 구조(flex:0 0 auto)가 되면서 본문(.mbody)을 아무리 스크롤해도 헤더는
   항상 그 자리에 고정됨 — "상단 ~60px에서 시작"한 터치는 이제 항상 헤더 위에서
   시작한다는 뜻이라 별도 스크롤 안전망 없이도 본문 스크롤과 충돌하지 않음.
   (B-59 이전엔 .box 자체가 스크롤 컨테이너라 body가 스크롤되면 헤더가 밀려날 수
   있었고 그걸 막는 box.scrollTop>0 체크가 있었지만, 지금은 .box가 스크롤되지
   않고 .mbody만 스크롤되므로 box.scrollTop은 항상 0 — 그 체크는 제거) */
(()=>{
  const modal=document.getElementById('complexDetailModal');
  const box=modal&&modal.querySelector('.box');
  if(!modal||!box) return;
  const HANDLE_ZONE=60, THRESHOLD=90;
  let startX=0,startY=0,active=false,dragging=false,curDist=0;

  box.addEventListener('touchstart',e=>{
    if(e.touches.length!==1){ active=false; return; }
    const rect=box.getBoundingClientRect();
    if(e.touches[0].clientY-rect.top>HANDLE_ZONE){ active=false; return; }
    startX=e.touches[0].clientX; startY=e.touches[0].clientY;
    active=true; dragging=false; curDist=0;
  },{passive:true});

  box.addEventListener('touchmove',e=>{
    if(!active) return;
    const dx=e.touches[0].clientX-startX, dy=e.touches[0].clientY-startY;
    if(!dragging){
      if(Math.abs(dx)<6&&Math.abs(dy)<6) return;
      if(dy<=0||Math.abs(dy)<=Math.abs(dx)){ active=false; return; } // 위로·가로 우세 → 드래그닫기 아님
      dragging=true;
      box.style.transition='none';
    }
    curDist=Math.max(0,dy);
    box.style.transform='translateY('+curDist+'px)';
    e.preventDefault();
  },{passive:false});

  function finish(){
    if(!dragging){ active=false; return; }
    box.style.transition='transform .2s ease';
    if(curDist>=THRESHOLD){
      box.style.transform='translateY(100%)';
      setTimeout(()=>{ closeModal('complexDetailModal'); closeListingDetail(); box.style.transition=''; box.style.transform=''; },200);
    } else {
      box.style.transform='translateY(0)';
      setTimeout(()=>{ box.style.transition=''; box.style.transform=''; },200);
    }
    active=false; dragging=false;
  }
  box.addEventListener('touchend',finish);
  box.addEventListener('touchcancel',finish);
})();

/* ---- v5 stage6c: 사이드바↔지도 리사이즈(B-08) — ≥900px 2단 그리드 전용,
   모바일 단일 컬럼에선 핸들이 display:none이라 드래그 자체가 안 걸림.
   폭은 세션 메모리(sessionStorage)에만 남기고 state/Redis엔 저장하지 않음 */
(function initGridResize(){
  const handle=document.getElementById('gridResizeHandle');
  const grid=document.querySelector('.grid');
  if(!handle||!grid) return;
  const MIN=280, MAX=560;
  try{
    const saved=+sessionStorage.getItem('sh_sidebarW');
    if(saved) document.documentElement.style.setProperty('--sidebar-w',Math.max(MIN,Math.min(MAX,saved))+'px');
  }catch(e){/* sessionStorage 접근 불가 시 기본값 유지 */}

  handle.onpointerdown=(e)=>{
    if(window.innerWidth<900) return;
    e.preventDefault();
    const sectionEl=grid.querySelector('section');
    if(!sectionEl) return;
    const startX=e.clientX;
    const startW=sectionEl.getBoundingClientRect().width;
    handle.classList.add('dragging');
    const onMove=(ev)=>{
      const w=Math.max(MIN,Math.min(MAX,startW+(ev.clientX-startX)));
      document.documentElement.style.setProperty('--sidebar-w',w+'px');
    };
    const onUp=()=>{
      document.removeEventListener('pointermove',onMove);
      document.removeEventListener('pointerup',onUp);
      handle.classList.remove('dragging');
      const w=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-w'))||360;
      try{ sessionStorage.setItem('sh_sidebarW',w); }catch(err){/* 세션 메모리 저장 실패는 무시 */}
      waitNaverMaps(()=>overview&&overview.refresh(true));
    };
    document.addEventListener('pointermove',onMove);
    document.addEventListener('pointerup',onUp);
  };
})();
