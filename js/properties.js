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
  /* switchPanel('props') 진입마다 재측정 — 로그인 게이트 해제 직후 등 최초 --topbar-h
     측정 시점에 header/apptabs 레이아웃이 아직 최종 상태가 아니었을 수 있는 경우 보정 */
  updateNavHeightVar();
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
/* --nav-h 갱신 + sticky 탭 네비 높이가 바뀔 수 있는 모든 계기(리사이즈·브레이크포인트 전환)에서
   지도 refresh(true) 재호출. 900px 경계를 "진입"할 때는 모바일 전용 상태(풀스크린·접기)가
   남아있으면 2단 그리드가 깨지므로 강제 초기화 */
function updateNavHeightVar(){
  const nav=document.querySelector('.apptabs');
  document.documentElement.style.setProperty('--nav-h',(nav?nav.getBoundingClientRect().height:64)+'px');
  /* --topbar-h: header+apptabs를 합친, 뷰포트 상단에서 실제 콘텐츠가 시작되는 지점.
     switchPanel()이 매번 scrollTo(top:0)을 호출하므로 이 시점의 .apptabs bottom이
     header 높이까지 포함한 안정적인 값 — 모바일 매물탭 풀스크린 지도뷰(#panel-props)의
     top 기준으로 사용(--nav-h는 apptabs 자체 높이만이라 헤더와 겹침) */
  document.documentElement.style.setProperty('--topbar-h',(nav?nav.getBoundingClientRect().bottom:110)+'px');
  updateOverlayTopVar();
}
/* --overlay-top: 모바일 매물탭 지도 위 오버레이(정렬칩·뷰토글·⋯버튼)의 top 기준값.
   지도뷰는 #panel-props가 overflow:hidden이라 페이지가 항상 scrollY=0 → --topbar-h와 동일.
   리스트뷰는 페이지가 실제로 스크롤되는데, header는 sticky가 아니라 스크롤에 딸려 올라가고
   .apptabs만 top:0에 들러붙어 남음 — 오버레이가 --topbar-h(헤더 포함 높이)에 고정된 채면
   스크롤 후 apptabs만 남은 좁은 공간을 넘어 카드 위에 얹힘. scrollY만큼 topbar-h에서 빼되
   apptabs 자체 높이(nav-h) 밑으로는 내려가지 않게 클램프해 항상 탭바 바로 아래에 붙게 함 */
function updateOverlayTopVar(){
  const navH=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||64;
  const topbarH=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h'))||110;
  const top=Math.max(navH,topbarH-window.scrollY);
  document.documentElement.style.setProperty('--overlay-top',top+'px');
}
let _overlayTopRaf=null;
window.addEventListener('scroll',()=>{
  if(_overlayTopRaf) return;
  _overlayTopRaf=requestAnimationFrame(()=>{ _overlayTopRaf=null; updateOverlayTopVar(); });
},{passive:true});
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

/* 매물탭 툴바 "⋯ 더보기" — 480px 이하(데스크톱)/900px 이하(모바일 풀스크린 지도뷰)에서
   숨겨진 실제 컨트롤을 기존 .status-picker 플로팅 메뉴 안으로 옮겼다가 닫으면 원래
   자리로 되돌림(컨트롤을 복제하지 않고 그대로 이동해 이벤트 핸들러도 그대로 유지).
   모바일에서는 검색(unisearch)도 함께 옮기는데, 원래 부모가 .ph-actions가 아니므로
   요소별로 (parent,next)를 따로 기억해야 닫을 때 서로 다른 원래 자리로 정확히 되돌아감.
   B-35: 필터(cxFilterBar)는 상단 칩 바로 상시 노출되므로 이 메뉴에서 제외 */
let _moreMenu=null, _moreSlots=null;
function closeMoreMenu(){
  if(!_moreMenu) return;
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
function applyFill(j){
  if(j.name) document.getElementById('f_name').value=j.name;
  if(j.loc) document.getElementById('f_loc').value=j.loc;
  if(j.deposit!=null&&j.deposit!=='') document.getElementById('f_deposit').value=j.deposit;
  if(j.area!=null&&j.area!=='') document.getElementById('f_area').value=j.area;
  if(j.memo) document.getElementById('f_memo').value=j.memo;
  if(j._auto) tempChecks=Object.assign(tempChecks||{},j._auto);
  /* B-28: 파싱이 주차·관리비를 읽었을 때만 저장 — 저장 시점(saveAsComplexListing)에
     반영, 실패 시 각 state는 기존대로 'unknown' */
  if(j.parking!=null) tempParking=j.parking;
  if(j.managementFee!=null) tempManagementFee=j.managementFee;
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
/* B-18: depositRange("4~5")에서 경고선 상한(마지막 숫자)만 추출 — 파싱 실패
   시 fallback(과거 하드코딩 5) 유지, 동작 변화 없음 */
function parseDepositUpper(rangeStr,fallback){
  const nums=String(rangeStr||'').match(/[\d.]+/g);
  if(!nums||!nums.length) return fallback;
  const last=parseFloat(nums[nums.length-1]);
  return isNaN(last)?fallback:last;
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
  tempChecks=null;tempParking=null;tempManagementFee=null;clearFormPin();
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
}
function closeForm(){
  form.classList.remove('open');clearForm();
  if(_formLocked){ unlockBodyScroll(); _formLocked=false; }
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
    const saved=await saveAsComplexListing(data);
    /* B-19확: 매칭 제안에서 "취소"를 고르면 저장을 중단하고 폼을 그대로 둔다
       (입력값 유실 방지) */
    if(saved===false) return;
  }
  closeForm(); save(); renderProps(); refreshOverview();
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
    /* B-28: 붙여넣기 파싱이 관리비(만원)를 읽었을 때만 known으로 승격 */
    managementFee:tempManagementFee!=null?tempManagementFee:null,
    managementFeeState:tempManagementFee!=null?'known':'unknown',
    listingStatus:'게시중',
    isRepresentative:isFirstListing,
    memo:data.memo||'',
    safety:defaultListingSafety(),
  });

  showPropToast(isNewComplex
    ? `새 단지 "${cx.complexName}"가 등록됐어요${(cx.lat&&cx.lng)?'':' · 좌표 확인 필요'}`
    : `기존 단지 "${cx.complexName}"에 매물이 추가됐어요`);
  tempParking=null; tempManagementFee=null;
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
      });
      newListings++;
    });
  });
  save();
  closeModal('migPreviewModal');
  renderProps();
  showPropToast(`단지 ${newComplexes}개 신규 · 매물 ${newListings}건 등록${skippedListings?` · 중복 ${skippedListings}건 건너뜀`:''} (기존 매물 목록은 그대로 유지돼요)`);
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
  if(!navigator.geolocation){ showPropToast('이 브라우저는 위치를 지원하지 않아요'); return; }
  navigator.geolocation.getCurrentPosition(
    p=>{ myLoc={lat:p.coords.latitude,lng:p.coords.longitude}; cxSort='dist'; drawMyLocMarker(); renderComplexes(); syncSortChips(); },
    ()=>{ showPropToast('위치 권한이 필요해요'); if(cxSort==='dist'){cxSort='new';renderComplexes();syncSortChips();} }
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
    const priceHTML=(rep&&rep.deposit!=null)?`<div class="c-price tnum">보증금 ${rep.deposit}억</div>`:'';
    const repHTML=rep?`<div class="c-meta">
        <span class="chip tnum">${rep.areaM2!=null?'전용 '+rep.areaM2+'㎡':(rep.areaText?esc(rep.areaText):'면적 미정')}</span>
        <span class="chip">${esc(rep.areaGrade||calcAreaGrade(rep.areaM2,state.settings.grades)||'—')}</span>
        <span class="chip ${listingStatusChipClass(rep.listingStatus)}">${esc(rep.listingStatus||'확인필요')}</span>
      </div>
      <div class="cx-listing-meta">최근 확인 ${rep.lastCheckedAt?esc(new Date(rep.lastCheckedAt).toLocaleDateString('ko-KR')):'—'}</div>`
      :`<div class="c-meta"><span class="chip warn">현재 대표매물 없음</span></div>`;
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
          <span class="pill" style="border-left-color:${color}"><i class="pill-dot" style="background:${color}"></i>${esc(st)}</span>
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
/* B-63: 매물 필드(동호수·면적·보증금·매물상태·메모) 편집 — B-27-lite 접이식
   패턴 재사용, 기본 접힘. 편집만 할 뿐 자동 판정·상태 부수효과 없음(기존
   게시중확인/사라짐처리/가격변동기록 버튼과 별개 경로) */
let cxListingEditExpanded=new Set();
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
/* B-27-lite: 전세 안전 체크 9항목 — 기록·표시만(자동 판정·차단 없음). 기본
   접힘, 매물 행 안에서 토글해서 펼침 */
function safetySectionHTML(l){
  const expanded=cxSafetyExpanded.has(l.id);
  return `<div class="safety-wrap${expanded?' expanded':''}">
    <button type="button" class="gates-toggle" data-safetoggle="${esc(l.id)}">전세 안전 체크 ${expanded?'접기':'펼치기'} <span class="gates-toggle-caret">▾</span></button>
    <div class="safety-list" style="${expanded?'':'display:none'}">
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
/* B-63: 매물 필드 편집 — dongHo/areaM2/areaText/deposit/listingStatus/memo.
   areaGrade는 저장하지 않음(항상 calcAreaGrade(l.areaM2,...)로 실시간 계산,
   기존 표시 로직과 동일). deposit·areaM2는 숫자 검증 + 0 vs null(미입력)
   엄격 구분(triState 숫자 입력과 동일 패턴) */
function listingEditHTML(l){
  const expanded=cxListingEditExpanded.has(l.id);
  return `<div class="safety-wrap${expanded?' expanded':''}">
    <button type="button" class="gates-toggle" data-edittoggle="${esc(l.id)}">매물 정보 수정 ${expanded?'접기':'펼치기'} <span class="gates-toggle-caret">▾</span></button>
    <div class="safety-list" style="${expanded?'':'display:none'}">
      <div class="safety-item-row">
        <input type="text" class="safety-memo" data-editfield="dongHo" data-lid="${esc(l.id)}" value="${esc(l.dongHo||'')}" placeholder="동/호 (예: 101동 502호)">
      </div>
      <div class="safety-item-row">
        <input type="number" class="tri-num" data-editfield="areaM2" data-lid="${esc(l.id)}" min="0" step="0.01" value="${l.areaM2!=null?l.areaM2:''}" placeholder="전용면적(㎡)">
        <input type="text" class="safety-memo" data-editfield="areaText" data-lid="${esc(l.id)}" value="${esc(l.areaText||'')}" placeholder="면적 텍스트(예: 24평)">
      </div>
      <div class="safety-item-row">
        <input type="number" class="tri-num" data-editfield="deposit" data-lid="${esc(l.id)}" min="0" step="0.01" value="${l.deposit!=null?l.deposit:''}" placeholder="보증금(억)">
        <select class="safety-status-sel" data-editfield="listingStatus" data-lid="${esc(l.id)}">
          ${LISTING_STATUS_OPTIONS.map(st=>`<option value="${st}" ${(l.listingStatus||'확인필요')===st?'selected':''}>${st}</option>`).join('')}
        </select>
      </div>
      <div class="safety-item-row">
        <textarea class="safety-memo" data-editfield="memo" data-lid="${esc(l.id)}" placeholder="매물 메모">${esc(l.memo||'')}</textarea>
      </div>
    </div>
  </div>`;
}
document.getElementById('cxDetailListings').addEventListener('click',e=>{
  const btn=e.target.closest('[data-edittoggle]'); if(!btn) return;
  const lid=btn.dataset.edittoggle;
  if(cxListingEditExpanded.has(lid)) cxListingEditExpanded.delete(lid);
  else cxListingEditExpanded.add(lid);
  const listing=state.listings.find(l=>l.id===lid); if(!listing) return;
  renderCxListings(listing.complexId);
});
document.getElementById('cxDetailListings').addEventListener('change',e=>{
  const el=e.target.closest('[data-editfield]'); if(!el) return;
  const {editfield,lid}=el.dataset;
  const listing=state.listings.find(l=>l.id===lid); if(!listing) return;
  if(editfield==='areaM2'||editfield==='deposit'){
    if(el.value===''){ listing[editfield]=null; }
    else{
      const v=parseFloat(el.value);
      if(isNaN(v)||v<0){ el.value=listing[editfield]!=null?listing[editfield]:''; return; }
      listing[editfield]=v;
    }
  } else if(editfield==='listingStatus'){
    listing.listingStatus=el.value;
  } else {
    listing[editfield]=el.value.trim();
  }
  save();
  renderCxListings(listing.complexId);
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
function renderComplexDetailBody(cx){
  document.getElementById('cxDetailTitle').textContent=cx.complexName||'(이름 없음)';
  const favBtn=document.getElementById('cxDetailFavBtn');
  if(favBtn){ favBtn.classList.toggle('on',!!cx.favorite); favBtn.setAttribute('aria-pressed',cx.favorite?'true':'false'); }
  document.getElementById('cxDetailLoc').textContent=cx.loc||'주소 정보 없음';
  document.getElementById('cxDetailStationLine').textContent=[cx.station,cx.line].filter(Boolean).join(' · ')||'—';
  document.getElementById('cxDetailYear').textContent=cx.yearBuilt?cx.yearBuilt+'년 준공':'—';
  document.getElementById('cxDetailHouseholds').textContent=cx.households?(cx.households+'세대'+(cx.householdGrade?' · '+cx.householdGrade:'')):'—';
  document.getElementById('cxDetailCommute').textContent=[
    cx.commuteGangnam!=null?'강남역 '+cx.commuteGangnam+'분':null,
    cx.commuteSinsa!=null?'신사역 '+cx.commuteSinsa+'분':null
  ].filter(Boolean).join(' · ')||'—';
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
        ${safetyBadgeChip(l)}
      </div>
      <div class="cx-listing-meta tnum">${l.deposit!=null?'보증금 '+l.deposit+'억':'보증금 미정'} · ${l.areaM2!=null?'전용 '+l.areaM2+'㎡':(l.areaText?esc(l.areaText):'면적 미정')} · ${esc(l.areaGrade||calcAreaGrade(l.areaM2,state.settings.grades)||'—')}</div>
      <div class="cx-listing-meta">수집 ${l.capturedAt?esc(new Date(l.capturedAt).toLocaleDateString('ko-KR')):'—'} · 확인 ${l.lastCheckedAt?esc(new Date(l.lastCheckedAt).toLocaleDateString('ko-KR')):'—'}</div>
      ${triStateHTML({field:'managementFee', value:l.managementFee, state:l.managementFeeState, caption:mgmtFeeCaption(l), unit:'만원', step:'1', placeholder:'예: 15', lid:l.id})}
      ${listingEditHTML(l)}
      ${safetySectionHTML(l)}
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
      setTimeout(()=>{ closeModal('complexDetailModal'); box.style.transition=''; box.style.transform=''; },200);
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
