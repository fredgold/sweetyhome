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
      naver.maps.Event.addListener(m,'click',()=>{ closeCxHoverTip(); openComplexDetail(cx.id); });
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
/* --nav-h 갱신 + sticky 탭 네비 높이가 바뀔 수 있는 모든 계기(리사이즈·브레이크포인트 전환)에서
   지도 refresh(true) 재호출. 900px 경계를 "진입"할 때는 모바일 전용 상태(풀스크린·접기)가
   남아있으면 2단 그리드가 깨지므로 강제 초기화 */
function updateNavHeightVar(){
  const nav=document.querySelector('.apptabs');
  document.documentElement.style.setProperty('--nav-h',(nav?nav.getBoundingClientRect().height:64)+'px');
}
function handleBreakpointChange(e){
  if(e.matches){
    document.getElementById('mapcard').classList.remove('expanded','collapsed');
    const btn=document.getElementById('mapExpand'); if(btn) btn.textContent='크게 보기';
    const tbtn=document.getElementById('mapToggle'); if(tbtn) tbtn.textContent='접기';
  }
  updateNavHeightVar();
  /* --nav-h 변경이 #overviewMap의 calc() 높이에 반영되는 레이아웃·페인트가 끝난 뒤에
     불러야 해서 이중 rAF로 한 프레임 넘김 (동기 호출하면 갱신 전 크기로 refresh(true)가
     실행돼 새로 넓어진 영역의 타일이 안 채워지는 문제가 실측됨) */
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    waitNaverMaps(()=>overview&&overview.refresh(true));
  }));
}
DESKTOP_MQ.addEventListener('change',handleBreakpointChange);
updateNavHeightVar();
(()=>{
  let raf=null;
  window.addEventListener('resize',()=>{
    if(raf) cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      updateNavHeightVar();
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
  const close=ev=>{ if(!menu.contains(ev.target)){ closeRouteMenu(); document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
}
document.getElementById('propRouteBtn').onclick=(e)=>{
  if(routeMode!=='off'){ exitRouteMode(); return; }
  if(!(state.savedRoutes&&state.savedRoutes.length)){ enterRouteSelectMode(false); return; }
  showRouteMenu(e.currentTarget);
};

/* 매물탭 툴바 "⋯ 더보기" — 480px 이하에서 숨겨진 실제 컨트롤을 기존
   .status-picker 플로팅 메뉴 안으로 옮겼다가 닫으면 원래 자리로 되돌림
   (컨트롤을 복제하지 않고 그대로 이동해 이벤트 핸들러도 그대로 유지) */
let _moreMenu=null, _moreHome=null, _moreHomeNext=null;
function closeMoreMenu(){
  if(!_moreMenu) return;
  [..._moreMenu.children].forEach(el=>_moreHome.insertBefore(el,_moreHomeNext));
  _moreMenu.remove(); _moreMenu=null;
}
function showMoreMenu(btn){
  if(_moreMenu){ closeMoreMenu(); return; }
  const ids=['phExportRow','propBulkBtn','propRouteBtn'];
  const els=ids.map(id=>document.getElementById(id));
  _moreHome=els[0].parentElement;
  _moreHomeNext=els[0].nextSibling;
  const menu=document.createElement('div');
  menu.className='status-picker ph-more-menu';
  els.forEach(el=>menu.appendChild(el));
  document.body.appendChild(menu);
  _moreMenu=menu;
  const rect=btn.getBoundingClientRect();
  menu.style.top=(rect.bottom+window.scrollY+4)+'px';
  menu.style.left=Math.max(8,Math.min(rect.left+window.scrollX, window.innerWidth-230))+'px';
  const close=ev=>{ if(!menu.contains(ev.target)&&ev.target!==btn){ closeMoreMenu(); document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
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
  const btn=document.getElementById('fillBtn'); const old=btn.innerHTML;
  const j=parseNaver(txt);
  const got=(j.name||j.deposit!=null||j.area!=null);
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
/* 펼침 본문 메타칩 — 가격·면적은 헤드라인에 이미 있으므로 경고성 신호만 별도 칩으로 */
function bodyMetaChips(p){
  const chips=[];
  const dn=p.depositNum!=null?p.depositNum:parseFloat(p.deposit);
  if(!isNaN(dn)&&dn>5) chips.push(`<span class="chip warn tnum">예산↑? · 보증금 ${dn}억</span>`);
  const a=p.area!=null&&p.area!==''?parseFloat(p.area):null;
  if(a!=null&&!isNaN(a)&&a>85) chips.push(`<span class="chip warn tnum">전용 ${a}㎡ · 청약 영향 ⚠</span>`);
  if(p.householdGrade) chips.push(`<span class="chip">${esc(p.householdGrade)}</span>`);
  else if(p.households) chips.push(`<span class="chip tnum">${p.households}세대</span>`);
  if(p.jeonseRatio!=null) chips.push(`<span class="chip tnum">전세가율 ${p.jeonseRatio}%</span>`);
  if(p.commuteGangnam) chips.push(`<span class="chip tnum">강남 ${esc(p.commuteGangnam)}</span>`);
  if(p.commuteSinsa) chips.push(`<span class="chip tnum">신사 ${esc(p.commuteSinsa)}</span>`);
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
      ${p.img?`<img src="${p.img}" class="card-img-thumb" loading="lazy" alt="${esc(p.name||'매물')} 사진">`:''}
      ${p.memo?`<div class="c-memo">${esc(p.memo)}</div>`:''}
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
  tempChecks=null;clearFormPin();
  propImgData=null;
  document.getElementById('f_img').value='';
  document.getElementById('f_imgLabel').innerHTML=ic('camera')+' 사진 추가';
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
    }
  }catch(e){}
  this.disabled=false; this.innerHTML=ic('pin')+' 위치 자동 찾기';
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
  if(existing){
    Object.assign(existing,data);
  } else {
    /* v5 stage5a: 신규 매물은 properties[]가 아니라 단지(complexes)/매물(listings)
       2계층으로 라우팅. properties[]는 기존 데이터 백업용으로 손대지 않는다 */
    await saveAsComplexListing(data);
  }
  closeForm(); save(); renderProps(); refreshOverview();
};
/* 파싱·입력 UX는 그대로, 저장 목적지만 단지/매물로 변경(Stage2 규칙 재사용) */
async function saveAsComplexListing(data){
  const {complexName,groupCode,dongHo}=migParseName(data.name);
  const loc=data.loc||'';
  const geocodeQuery=`${loc} ${complexName}`.trim();
  const mergeKey=normalizeStr(complexName)+'|'+normalizeStr(loc||data.station||'');
  let cx=state.complexes.find(c=>normalizeStr(c.complexName)+'|'+normalizeStr(c.loc||c.station||'')===mergeKey);
  const isNewComplex=!cx;

  if(isNewComplex){
    const hh=data.households?parseInt(data.households)||null:null;
    const now=new Date().toISOString();
    cx={
      id:'cx'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
      complexName:complexName||data.name, loc, geocodeQuery, groupCode, regionGroup:'',
      station:data.station||'', line:data.line||'',
      yearBuilt:null, households:hh, householdGrade:hh?calcHouseholdGrade(hh):'',
      commuteGangnam:null, commuteSinsa:null,
      complexStatus:migComplexStatus(data.status),
      lat:data.lat??null, lng:data.lng??null,
      memo:data.memo||'',
      createdAt:now, updatedAt:now,
    };
    state.complexes.push(cx);
    if(!(cx.lat&&cx.lng)){
      try{
        const j=await geocode(geocodeQuery);
        if(j.found){ cx.lat=j.lat; cx.lng=j.lng; }
      }catch(e){/* 좌표 확인 필요 상태로 남음 */}
    }
  }

  const isFirstListing=state.listings.filter(l=>l.complexId===cx.id).length===0;
  const areaNum=data.area!=null&&data.area!==''?parseFloat(data.area):null;
  const now2=new Date().toISOString();
  state.listings.push({
    id:'lst'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    complexId:cx.id, source:'', url:data.url||'',
    capturedAt:now2, lastCheckedAt:now2,
    dongHo, areaM2:(areaNum!=null&&!isNaN(areaNum))?areaNum:null,
    areaText:data.area?String(data.area):'', areaGrade:'',
    deposit:data.deposit?parseEok(data.deposit):null,
    managementFee:null, listingStatus:'게시중',
    isRepresentative:isFirstListing,
    memo:data.memo||'',
  });

  showPropToast(isNewComplex
    ? `새 단지 "${cx.complexName}"가 등록됐어요${(cx.lat&&cx.lng)?'':' · 좌표 확인 필요'}`
    : `기존 단지 "${cx.complexName}"에 매물이 추가됐어요`);
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
    l.dongHo||'',l.areaM2??'',l.areaGrade||getAreaGrade(l.areaM2)||'',
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
  const menu=document.createElement('div');
  menu.className='status-picker route-menu';
  menu.innerHTML=`
    <button class="sp-opt" data-exp="cx" data-fmt="csv">단지 목록 (CSV)</button>
    <button class="sp-opt" data-exp="cx" data-fmt="tsv">단지 목록 (TSV)</button>
    <div class="rm-sep"></div>
    <button class="sp-opt" data-exp="listing" data-fmt="csv">매물 목록 (CSV)</button>
    <button class="sp-opt" data-exp="listing" data-fmt="tsv">매물 목록 (TSV)</button>
    <div class="rm-sep"></div>
    <button class="sp-opt" data-exp="combined" data-fmt="csv">단지+대표매물 통합 (CSV)</button>
    <button class="sp-opt" data-exp="combined" data-fmt="tsv">단지+대표매물 통합 (TSV)</button>
    <div class="rm-sep"></div>
    <button class="sp-opt" data-exp="legacy" data-fmt="csv">레거시(기존 매물) CSV</button>
    <button class="sp-opt" data-exp="legacy" data-fmt="tsv">레거시(기존 매물) TSV</button>
  `;
  document.body.appendChild(menu);
  _exportMenu=menu;
  const rect=btn.getBoundingClientRect();
  menu.style.top=(rect.bottom+window.scrollY+4)+'px';
  menu.style.left=Math.max(8,Math.min(rect.left+window.scrollX, window.innerWidth-240))+'px';
  menu.querySelectorAll('[data-exp]').forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    const kind=b.dataset.exp, fmt=b.dataset.fmt;
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

/* v5 stage5b: 상태 매핑 — parseTSV()의 mapImportStatus()가 이미 한 번 정규화한
   값(관심/검토중/문의예정/방문예정/후보/보류/탈락)을 입력받아 단지 상태 어휘로 재매핑 */
function mapCxImportStatus(s){
  const statusMap={관심:'관심',검토중:'검토중',후보:'후보',후보확정:'후보',
    문의예정:'문의예정',방문예정:'임장예정',임장예정:'임장예정',보류:'보류',탈락:'탈락'};
  return statusMap[s]||'관심';
}
/* 단지 중복은 normalize(complexName)+'|'+normalize(loc||station), 매물 중복은
   URL 우선(없으면 complexId+dongHo+areaM2+deposit)으로 별도 판정. 같은 배치 안의
   행끼리도 병합/중복 감지가 되도록 배치 내 상태를 누적하며 순회한다 */
function calcCxImportStatus(parsed){
  const existingCxByKey=new Map();
  state.complexes.forEach(cx=>{
    const key=normalizeStr(cx.complexName)+'|'+normalizeStr(cx.loc||cx.station||'');
    if(!existingCxByKey.has(key)) existingCxByKey.set(key,cx.id);
  });
  const listingKey=(cxId,url,dongHo,areaM2,deposit)=>url
    ?cxId+'|url:'+normalizeStr(url)
    :cxId+'|'+normalizeStr(dongHo)+'|'+normalizeStr(areaM2==null?'':String(areaM2))+'|'+normalizeStr(deposit==null?'':String(deposit));
  const listingKeySet=new Set(state.listings.map(l=>listingKey(l.complexId,l.url,l.dongHo,l.areaM2,l.deposit)));

  const batchCxPseudoId=new Map();
  let pseudoSeq=0;
  return parsed.map(row=>{
    const {complexName,groupCode,dongHo}=migParseName(row.name);
    const loc=row.loc||'';
    const geocodeQuery=`${loc} ${complexName}`.trim();
    const mergeKey=normalizeStr(complexName)+'|'+normalizeStr(loc||row.station||'');

    let cxId, cxJudgment, existingComplexId=null;
    if(existingCxByKey.has(mergeKey)){
      cxId=existingCxByKey.get(mergeKey); existingComplexId=cxId; cxJudgment='existing';
    } else if(batchCxPseudoId.has(mergeKey)){
      cxId=batchCxPseudoId.get(mergeKey); cxJudgment='existing';
    } else {
      cxId='batch'+(++pseudoSeq); batchCxPseudoId.set(mergeKey,cxId); cxJudgment='new';
    }

    const lk=listingKey(cxId,row.url,dongHo,row.area,row.depositNum);
    const listingDup=listingKeySet.has(lk);
    if(!listingDup) listingKeySet.add(lk);

    return {...row,complexName,groupCode,dongHo,geocodeQuery,mergeKey,cxId,cxJudgment,existingComplexId,listingDup};
  });
}

let importParsedRows=[];
function renderImportPreview(rows){
  if(!rows.length){
    document.getElementById('propImportErr').textContent='파싱된 행이 없어요. 데이터를 확인해주세요.';
    return;
  }
  document.getElementById('propImportErr').textContent='';
  const newCxCount=new Set(rows.filter(r=>r.cxJudgment==='new').map(r=>r.mergeKey)).size;
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
      <td><span class="dup-badge ${r.cxJudgment==='new'?'dup-신규':'dup-이름유사'}">${r.cxJudgment==='new'?'신규 단지':'기존 단지 있음 · 매물 추가'}</span></td>
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
  updateCount();
  document.getElementById('propImportSummary').textContent=`총 ${rows.length}행 · 신규 단지 ${newCxCount}개 · 중복 매물 ${dupListingCount}건 자동 해제`;
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
      if(row.existingComplexId){
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
      managementFee:null, listingStatus:'확인필요',
      isRepresentative:isFirstListing,
      memo:row.memo||'',
    });
    newListingCount++;
  });

  const dupSkip=importParsedRows.filter(r=>r.listingDup).length;
  closeModal('propImportModal');
  save();renderProps();refreshOverview();
  showPropToast(`단지 ${newCxCount}개 신규 · 매물 ${newListingCount}개 등록 완료 / 중복 매물 ${dupSkip}건 건너뜀`);
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
    const geocodeQuery=`${loc} ${complexName}`.trim();
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
      <th>주소</th><th>geocodeQuery</th><th>병합예정 단지</th>
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
  let newComplexes=0, newListings=0;
  groups.forEach(rowsInGroup=>{
    const first=rowsInGroup[0].p;
    const groupCode=rowsInGroup.map(r=>r.groupCode).find(Boolean)||'';
    const complexId='cx'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
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
      createdAt:now, updatedAt:now,
    };
    if(first.aiScore!=null) cx.aiScore=first.aiScore;
    if(first.aiComment) cx.aiComment=first.aiComment;
    if(first.aiReport) cx.aiReport=first.aiReport;
    state.complexes.push(cx);
    newComplexes++;
    rowsInGroup.forEach((r,idx)=>{
      const p=r.p;
      const areaNum=p.area!=null&&p.area!==''?parseFloat(p.area):null;
      state.listings.push({
        id:'lst'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)+idx,
        complexId,
        source:p.importSource||'',
        url:p.url||'',
        capturedAt:p.created?new Date(p.created).toISOString():now,
        lastCheckedAt:now,
        dongHo:r.dongHo||'',
        areaM2:(areaNum!=null&&!isNaN(areaNum))?areaNum:null,
        areaText:p.area!=null&&p.area!==''?String(p.area):'',
        areaGrade:'',
        deposit:p.depositNum!=null?p.depositNum:(p.deposit?parseEok(p.deposit):null),
        managementFee:null,
        listingStatus:'확인필요',
        isRepresentative:idx===0,
        memo:p.memo||'',
      });
      newListings++;
    });
  });
  save();
  closeModal('migPreviewModal');
  renderProps();
  showPropToast(`단지 ${newComplexes}개 · 매물 ${newListings}건 적용 완료 (기존 매물 목록은 그대로 유지돼요)`);
}
(function migInjectUI(){
  const phActions=document.querySelector('.ph-actions');
  if(phActions) phActions.insertAdjacentHTML('beforeend',
    `<button class="addbtn" id="migStartBtn">${ic('listings')} 기존 매물을 단지로 정리</button>`);
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
  document.getElementById('migStartBtn').onclick=()=>{ renderMigPreview(); openModal('migPreviewModal'); };
})();

/* ============ v5 Stage 3+4: 단지 카드 목록 + 단지 상세·매물 목록 (properties[] 뷰 공존) ============ */
const SC_CX=Object.assign({},SC,{임장예정:SC['방문예정']});
const HEX_CX=Object.assign({},HEX,{임장예정:HEX['방문예정']});
/* 대표매물(isRepresentative), 없으면 첫 매물 — 지도·카드·통계·루트가 공통으로 씀 */
function cxRepOf(cx){
  const ls=state.listings.filter(l=>l.complexId===cx.id);
  return ls.find(l=>l.isRepresentative)||ls[0]||null;
}
function getAreaGrade(areaM2){
  if(areaM2==null||isNaN(areaM2))return'';
  const v=+areaM2;
  if(v>=85)return'85㎡+';
  if(v>=60)return'60~84㎡';
  return'59㎡ 이하';
}
function listingStatusChipClass(st){
  if(st==='게시중')return'ok';
  if(st==='가격변동')return'warn';
  if(st==='사라짐')return'gone';
  return'';
}

/* ---- (3) 단지 카드 목록 ---- */
let legacyExpanded=null;
function updateLegacyToggleLabel(){
  const btn=document.getElementById('legacyToggleBtn'); if(!btn)return;
  btn.textContent=`${legacyExpanded?'▾':'▸'} 기존(미정리) 매물 (${state.properties.length})`;
}

/* ---- v5 stage6c: 단지 목록 필터 (6종) ---- */
let cxFilters={region:'',status:'',listing:'',area:'',hh:'',line:''};
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
}
function cxMatchesFilters(cx){
  if(cxFilters.region && (cx.regionGroup||'')!==cxFilters.region) return false;
  if(cxFilters.status && (cx.complexStatus||'관심')!==cxFilters.status) return false;
  if(cxFilters.hh && (cx.householdGrade||'')!==cxFilters.hh) return false;
  if(cxFilters.line && (cx.line||'')!==cxFilters.line) return false;
  if(cxFilters.listing||cxFilters.area){
    const cxListings=state.listings.filter(l=>l.complexId===cx.id);
    if(cxFilters.listing && !cxListings.some(l=>l.listingStatus===cxFilters.listing)) return false;
    if(cxFilters.area && !cxListings.some(l=>l.areaGrade===cxFilters.area)) return false;
  }
  return true;
}
document.getElementById('cxFilterRegion').onclick=e=>{const c=e.target.closest('[data-fregion]');if(!c)return;cxFilters.region=c.dataset.fregion;renderComplexes();};
document.getElementById('cxFilterStatus').onclick=e=>{const c=e.target.closest('[data-fstatus]');if(!c)return;cxFilters.status=c.dataset.fstatus;renderComplexes();};
document.getElementById('cxFilterListingStatus').onclick=e=>{const c=e.target.closest('[data-flisting]');if(!c)return;cxFilters.listing=c.dataset.flisting;renderComplexes();};
document.getElementById('cxFilterAreaGrade').onclick=e=>{const c=e.target.closest('[data-farea]');if(!c)return;cxFilters.area=c.dataset.farea;renderComplexes();};
document.getElementById('cxFilterHouseholdGrade').onclick=e=>{const c=e.target.closest('[data-fhh]');if(!c)return;cxFilters.hh=c.dataset.fhh;renderComplexes();};
document.getElementById('cxFilterLine').onclick=e=>{const c=e.target.closest('[data-fline]');if(!c)return;cxFilters.line=c.dataset.fline;renderComplexes();};

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

function renderComplexes(){
  const wrap=document.getElementById('complexSection');
  const filterBar=document.getElementById('cxFilterBar');
  const legacyToggleWrap=document.getElementById('legacyToggleWrap');
  const legacyWrap=document.getElementById('legacyWrap');
  if(!wrap||!legacyToggleWrap||!legacyWrap) return;

  if(!state.complexes.length){
    wrap.innerHTML=`<div class="cx-empty">
      아직 정리된 단지가 없어요. 기존 매물을 단지로 정리하면 여기 카드로 모여요.<br>
      <button class="btn-save" id="cxGoMigrateBtn" style="margin-top:10px">${ic('listings')} 기존 매물을 단지로 정리</button>
    </div>`;
    const goBtn=document.getElementById('cxGoMigrateBtn');
    if(goBtn) goBtn.onclick=()=>{ renderMigPreview(); openModal('migPreviewModal'); };
    if(filterBar) filterBar.style.display='none';
    legacyToggleWrap.style.display='none';
    legacyWrap.style.display='';
    refreshOverview([]);
    return;
  }

  if(filterBar) filterBar.style.display='';
  renderCxFilterOptions();

  legacyToggleWrap.style.display='';
  if(legacyExpanded===null) legacyExpanded=false;
  legacyWrap.style.display=legacyExpanded?'':'none';
  updateLegacyToggleLabel();

  const filtered=state.complexes.filter(cxMatchesFilters);
  if(!filtered.length){
    wrap.innerHTML=`<div class="cx-empty">필터 조건에 맞는 단지가 없어요.</div>`;
    refreshOverview([]);
    return;
  }

  wrap.innerHTML=filtered.map(cx=>{
    const rep=cxRepOf(cx);
    const st=cx.complexStatus||'관심';
    const color='var('+(SC_CX[st]||'--hairline')+')';
    const repHTML=rep?`<div class="c-meta">
        <span class="chip deposit tnum">${rep.deposit!=null?'보증금 '+rep.deposit+'억':'보증금 미정'}</span>
        <span class="chip tnum">${rep.areaM2!=null?'전용 '+rep.areaM2+'㎡':(rep.areaText?esc(rep.areaText):'면적 미정')}</span>
        <span class="chip">${esc(rep.areaGrade||getAreaGrade(rep.areaM2)||'—')}</span>
        <span class="chip ${listingStatusChipClass(rep.listingStatus)}">${esc(rep.listingStatus||'확인필요')}</span>
      </div>
      <div class="cx-listing-meta">최근 확인 ${rep.lastCheckedAt?esc(new Date(rep.lastCheckedAt).toLocaleDateString('ko-KR')):'—'}</div>`
      :`<div class="c-meta"><span class="chip warn">현재 대표매물 없음</span></div>`;
    const weeklyBadge=needsWeeklyCheck(cx,rep)?'<span class="chip warn">7일+ 미확인</span>':'';
    const weeklyBtn=rep?`<button data-weeklycheck="${cx.id}">${ic('sync')} 이번 주 확인 완료</button>`:'';
    const routeCheckHTML = routeMode!=='select' ? '' :
      (cx.lat&&cx.lng
        ? `<label class="c-routecheck-wrap"><input type="checkbox" class="c-routecheck" aria-label="임장 루트에 포함" data-routecheck="${cx.id}"${routeSelected.has(cx.id)?' checked':''}></label>`
        : `<span class="c-routecheck-disabled" title="좌표가 없어 루트에 포함할 수 없어요">${ic('pin','ic-muted')} 위치없음</span>`);
    return `<div class="card" data-cxid="${cx.id}">
      <div class="c-top" data-cxopen="${cx.id}" role="button" tabindex="0">
        ${routeCheckHTML}
        <div class="c-head-text">
          <div class="c-headline">${cx.groupCode?`<span class="chip" style="margin-right:5px">${esc(cx.groupCode)}</span>`:''}${cx.regionGroup?esc(cx.regionGroup)+' · ':''}${esc(cx.complexName||'(이름 없음)')}</div>
          <div class="c-sub">${esc([cx.station,cx.line,cx.householdGrade].filter(Boolean).join(' · ')||'정보 없음')}</div>
        </div>
        <div class="c-badge-col">
          <span class="pill" style="border-left-color:${color}"><i class="pill-dot" style="background:${color}"></i>${esc(st)}</span>
        </div>
      </div>
      <div style="padding:0 15px 14px">
        ${repHTML}
        ${(weeklyBadge||weeklyBtn)?`<div class="c-actions">${weeklyBadge}${weeklyBtn}</div>`:''}
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
document.getElementById('complexSection').addEventListener('click',e=>{
  const wc=e.target.closest('[data-weeklycheck]');
  if(wc){ weeklyCheckComplex(wc.dataset.weeklycheck); return; }
  if(e.target.closest('.c-routecheck-wrap')) return;
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

/* ---- (4) 단지 상세 + 매물 목록 ---- */
let cxDetailId=null, cxDetailMapObj=null, cxDetailMarker=null;
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
function openComplexDetail(id){
  const cx=state.complexes.find(x=>x.id===id); if(!cx)return;
  cxDetailId=id;
  renderComplexDetailBody(cx);
  openModal('complexDetailModal');
  reselectCxMarker(id);
}
function renderComplexDetailBody(cx){
  document.getElementById('cxDetailTitle').textContent=cx.complexName||'(이름 없음)';
  document.getElementById('cxDetailLoc').textContent=cx.loc||'주소 정보 없음';
  document.getElementById('cxDetailStationLine').textContent=[cx.station,cx.line].filter(Boolean).join(' · ')||'—';
  document.getElementById('cxDetailYear').textContent=cx.yearBuilt?cx.yearBuilt+'년 준공':'—';
  document.getElementById('cxDetailHouseholds').textContent=cx.households?(cx.households+'세대'+(cx.householdGrade?' · '+cx.householdGrade:'')):'—';
  document.getElementById('cxDetailCommute').textContent=[
    cx.commuteGangnam!=null?'강남역 '+cx.commuteGangnam+'분':null,
    cx.commuteSinsa!=null?'신사역 '+cx.commuteSinsa+'분':null
  ].filter(Boolean).join(' · ')||'—';
  document.getElementById('cxDetailStatusSel').value=cx.complexStatus||'관심';
  document.getElementById('cxDetailMemo').value=cx.memo||'';

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
function renderCxListings(complexId){
  const wrap=document.getElementById('cxDetailListings'); if(!wrap)return;
  const listings=state.listings.filter(l=>l.complexId===complexId)
    .slice().sort((a,b)=>new Date(a.capturedAt||0)-new Date(b.capturedAt||0));
  if(!listings.length){
    wrap.innerHTML='<p style="font-size:12.5px;color:var(--ink-soft)">등록된 매물이 없어요.</p>';
    return;
  }
  wrap.innerHTML=listings.map(l=>{
    const safeHref=l.url?safeUrl(l.url):'';
    return `<div class="cx-listing-row" data-lid="${l.id}">
      <div class="cx-listing-top">
        <span class="cx-listing-dongho">${esc(l.dongHo||'동/호 미상')}</span>
        <span class="chip ${listingStatusChipClass(l.listingStatus)}">${esc(l.listingStatus||'확인필요')}</span>
        ${l.isRepresentative?'<span class="chip ok">대표매물</span>':''}
      </div>
      <div class="cx-listing-meta tnum">${l.deposit!=null?'보증금 '+l.deposit+'억':'보증금 미정'} · ${l.areaM2!=null?'전용 '+l.areaM2+'㎡':(l.areaText?esc(l.areaText):'면적 미정')} · ${esc(l.areaGrade||getAreaGrade(l.areaM2)||'—')}</div>
      <div class="cx-listing-meta">수집 ${l.capturedAt?esc(new Date(l.capturedAt).toLocaleDateString('ko-KR')):'—'} · 확인 ${l.lastCheckedAt?esc(new Date(l.lastCheckedAt).toLocaleDateString('ko-KR')):'—'}</div>
      <div class="c-actions">
        ${l.isRepresentative?'':`<button data-lact="rep">대표매물로 설정</button>`}
        <button data-lact="check">게시중 확인</button>
        <button data-lact="gone">사라짐 처리</button>
        <button data-lact="price">가격변동 기록</button>
        ${safeHref?`<a href="${safeHref}" target="_blank" rel="noopener">${ic('link')} URL 열기</a>`:''}
        <button data-lact="del" class="c-act-del">삭제</button>
      </div>
    </div>`;
  }).join('');
}
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
    listing.lastCheckedAt=new Date().toISOString();
    listing.listingStatus='게시중';
  } else if(act==='gone'){
    listing.listingStatus='사라짐';
  } else if(act==='price'){
    const nv=prompt('새 보증금(억)을 입력하세요',listing.deposit!=null?listing.deposit:'');
    if(nv==null)return;
    const num=parseFloat(nv);
    if(isNaN(num))return;
    listing.deposit=num;
    listing.listingStatus='가격변동';
    listing.lastCheckedAt=new Date().toISOString();
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
  save(); renderComplexes();
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
