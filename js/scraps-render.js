let scSearchQuery='';
/* B-97: 카드별 "원문 보기" 토글 — 렌더가 입력 의도와 달라질 때(lazy
   continuation 등, 1단계 진단) 사용자가 원문과 즉시 대조할 수 있는
   탈출구. 뷰 상태일 뿐이라 state 스키마엔 저장하지 않음(세션 내에만
   유지, 새로고침하면 초기화) — cxListingEditMode 등과 동일한 패턴 */
let scRawViewIds=new Set();
/* B-174: 다중선택 일괄 삭제(만) — 상태는 scRawViewIds와 동일하게 순수 UI
   메모리(state 스키마 무접촉, 저장 안 함). scSelectedIds는 renderScraps()
   끝에서 매번 "현재 화면에 실제로 보이는 id" 교집합으로 정리(prune)해,
   필터·정렬 변경으로 화면에서 사라진 항목이 눈에 안 보인 채로 함께
   삭제되는 사고를 막는다(선택 개수 표시=실제 삭제 개수 항상 일치). */
let scSelectMode=false, scSelectedIds=new Set();
function scSelectCheckHTML(id){
  const on=scSelectedIds.has(id);
  return `<div class="sc-select-check${on?' on':''}">${on?CHECK:''}</div>`;
}
function scUpdateSelectBar(){
  const bar=document.getElementById('scSelectBar');
  if(!bar) return;
  bar.style.display=scSelectMode?'flex':'none';
  if(scSelectMode) document.getElementById('scSelectCount').textContent=scSelectedIds.size+'개 선택';
}
function scEnterSelectMode(){
  if(scSelectMode) return;
  scSelectMode=true;
  document.body.classList.add('sc-select-mode');
  document.getElementById('sc_selectModeBtn').dataset.on='1';
  renderScraps();
}
function scExitSelectMode(){
  if(!scSelectMode) return;
  scSelectMode=false; scSelectedIds.clear();
  document.body.classList.remove('sc-select-mode');
  document.getElementById('sc_selectModeBtn').dataset.on='0';
  renderScraps();
}
function scToggleSelect(id){
  if(scSelectedIds.has(id)) scSelectedIds.delete(id); else scSelectedIds.add(id);
  renderScraps();
}
/* B-190: 단축어로 담긴 항목은 raw가 "메모\n\nURL" 형태라 링크를 열려면
   텍스트를 복사해야 했다 — 카드에서 바로 열 수 있게 호스트명 칩을 단다.
   scExtractFirstUrl(scraps-form.js)이 http/https만 통과시키므로
   javascript: 스킴은 칩으로 살아남지 못한다 */
function scLinkChipHTML(raw){
  const url=scExtractFirstUrl(raw||'');
  if(!url) return '';
  let label=url;
  try{ label=new URL(url).hostname.replace(/^www\./,''); }catch(e){}
  return `<a class="sc-link-chip" data-sclink="1" href="${esc(url)}" target="_blank" rel="noopener noreferrer" title="${esc(url)}">${ic('link')}<span>${esc(label)}</span></a>`;
}
/* 링크 칩 탭이 카드 본문 클릭(편집 모달·라이트박스)으로 번지지 않게 —
   B-123 data-sclight와 같은 분리 패턴 */
function scBindLinkChips(el){
  el.querySelectorAll('[data-sclink]').forEach(a=>{
    a.onclick=e=>e.stopPropagation();
    a.onkeydown=e=>{ if(e.key==='Enter'||e.key===' ') e.stopPropagation(); };
  });
}
/* 원문 안 링크 탭은 새 탭 열기로만 — 더보기/접기 토글로 오인되지 않게 */
function scRawToggle(e,el){
  if(e.target.closest('a')) return;
  el.classList.toggle('expand');
}
function renderScraps(){
  document.querySelectorAll('[data-ftype]').forEach(c=>c.classList.toggle('on',c.dataset.ftype===scFilterType));
  document.querySelectorAll('[data-fstatus]').forEach(c=>c.classList.toggle('on',c.dataset.fstatus===scFilterStatus));
  const el=document.getElementById('sc_cards');
  const sortKey=document.getElementById('sc_sort')?.value||'newest';
  let list=state.scraps.slice();
  if(scFilterType) list=list.filter(s=>s.type===scFilterType);
  if(scFilterStatus) list=list.filter(s=>s.status===scFilterStatus);
  if(scSearchQuery){
    const q=scSearchQuery.toLowerCase();
    list=list.filter(s=>(s.title||'').toLowerCase().includes(q)||(s.raw||'').toLowerCase().includes(q)||(s.tags||[]).some(t=>t.toLowerCase().includes(q))||(s.location||'').toLowerCase().includes(q));
  }
  if(sortKey==='oldest') list.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
  else if(sortKey==='status') list.sort((a,b)=>a.status.localeCompare(b.status));
  else if(sortKey==='type') list.sort((a,b)=>a.type.localeCompare(b.type));
  else list.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  if(scSelectedIds.size){
    const visibleIds=new Set(list.map(s=>s.id));
    for(const id of [...scSelectedIds]) if(!visibleIds.has(id)) scSelectedIds.delete(id);
  }
  scUpdateSelectBar();
  if(!list.length){
    el.innerHTML=`<div class="sc-empty">${state.scraps.length?'조건에 맞는 항목이 없어요.':'아직 항목이 없어요.<br>위 버튼으로 첫 번째 항목을 추가해보세요!'}</div>`;
    return;
  }
  // 갤러리 뷰
  if(scViewMode==='gallery'){
    el.innerHTML='<div class="sc-gallery-grid">'+list.map(s=>{
      const knownType=Object.prototype.hasOwnProperty.call(SC_TYPE,s.type);
      const knownStatus=Object.prototype.hasOwnProperty.call(SC_STATUS,s.status);
      const typeKey=knownType?s.type:'note';
      const statusKey=knownStatus?s.status:'new';
      const tLabel=knownType?SC_TYPE[s.type]:(s.type||'메모');
      const stLabel=knownStatus?SC_STATUS[s.status]:(s.status||'신규');
      const tCls='type-'+typeKey;
      const stCls='st-'+statusKey;
      const isPropLess=SC_PROPLESS.has(s.type);
      const dateStr=s.createdAt?new Date(s.createdAt).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'}):'';
      const metaParts=[
        s.location&&{icon:'pin',text:s.location},
        !isPropLess&&s.price&&{icon:'price',text:s.price},
        !isPropLess&&s.schedule&&{icon:'calendar',text:s.schedule},
        !isPropLess&&s.area&&{icon:'area',text:s.area},
      ].filter(Boolean).slice(0,2);
      if(metaParts.length<2&&dateStr) metaParts.push({icon:'calendar',text:dateStr});
      const title=s.title||'(제목 없음)';
      const imgs=s.imgs||[];
      const linkChip=scLinkChipHTML(s.raw);
      /* B-123①: 사진 있는 카드는 이미지가 주인공 — 클릭 영역을 카드
         본문(편집)과 분리해 별도 라이트박스로 열리게 한다 */
      return `<div class="sc-gallery-card" data-scid="${esc(s.id)}" role="button" tabindex="0" aria-label="${esc(title)} 편집">
        ${scSelectCheckHTML(s.id)}
        ${imgs.length?`<div class="sc-gallery-imgwrap" data-sclight="${esc(s.id)}" role="button" tabindex="0" aria-label="${esc(title)} 사진 크게 보기">
          <img src="${esc(imgs[0])}" class="sc-gallery-img" loading="lazy" alt="${esc(title)} 사진">
          ${imgs.length>1?`<span class="sc-gallery-imgcount">⧉${imgs.length}</span>`:''}
        </div>`:`<div class="sc-gallery-preview ${tCls}" aria-hidden="true"><span class="sc-gallery-preview-mark">${ic(typeKey==='policy'?'tip':typeKey==='note'?'edit':typeKey==='ai_log'?'sparkle':'home')}</span><span>${esc(tLabel)}</span></div>`}
        <div class="sc-gallery-body">
          <div class="sc-gallery-badges">
            <span class="sc-badge ${tCls}">${esc(tLabel)}</span>
            <span class="sc-badge ${stCls}">${esc(stLabel)}</span>
          </div>
          <div class="sc-gallery-title">${esc(title)}</div>
          ${metaParts.length?`<div class="sc-gallery-details">${metaParts.map(m=>`<span class="sc-gallery-detail" title="${esc(m.text)}">${ic(m.icon,'ic-muted')}<span>${esc(m.text)}</span></span>`).join('')}</div>`:''}
          ${linkChip?`<div class="sc-gallery-links">${linkChip}</div>`:''}
        </div>
      </div>`;
    }).join('')+'</div>';
    el.querySelectorAll('.sc-gallery-card').forEach(c=>{
      c.onclick=()=>openScEdit(c.dataset.scid);
      c.onkeydown=e=>{
        if(e.key!=='Enter'&&e.key!==' ') return;
        e.preventDefault();
        openScEdit(c.dataset.scid);
      };
    });
    /* B-123①: 이미지 클릭 = 라이트박스, stopPropagation으로 카드 본문
       클릭(편집 모달 오픈)과 버블링 분리 */
    el.querySelectorAll('[data-sclight]').forEach(w=>{
      w.onclick=e=>{ e.stopPropagation(); scOpenLightbox(w.dataset.sclight); };
      w.onkeydown=e=>{
        if(e.key!=='Enter'&&e.key!==' ') return;
        e.preventDefault(); e.stopPropagation();
        scOpenLightbox(w.dataset.sclight);
      };
    });
    scBindLinkChips(el);
    return;
  }
  el.innerHTML='<div class="sc-list">'+list.map(s=>{
    const knownType=Object.prototype.hasOwnProperty.call(SC_TYPE,s.type);
    const knownStatus=Object.prototype.hasOwnProperty.call(SC_STATUS,s.status);
    const tLabel=knownType?SC_TYPE[s.type]:(s.type||'메모');
    const stLabel=knownStatus?SC_STATUS[s.status]:(s.status||'신규');
    const tCls='type-'+(knownType?s.type:'note');
    const stCls='st-'+(knownStatus?s.status:'new');
    let fitCls='', fitLbl='';
    if(s.fit==='high'||s.fit==='가능'){fitCls='high';fitLbl='✓ 적합';}
    else if(s.fit==='low'||s.fit==='불가'){fitCls='low';fitLbl='✕ 부적합';}
    else if(s.fit){fitCls='mid';fitLbl='⚠ '+esc(s.fit);}
    const isPropLess=SC_PROPLESS.has(s.type);
    /* B-72: 위치·가격·면적·일정을 한 줄로 이어붙이면 안 읽혀서 칩으로 분리 —
       값마다 title 툴팁을 달아 CSS 말줄임(.sc-meta-chip-text)으로 잘려도
       전체 텍스트를 확인할 수 있게 함 */
    const metaParts=[s.location&&{icon:'pin',text:s.location},!isPropLess&&s.price&&{icon:'price',text:s.price},!isPropLess&&s.area&&{icon:'area',text:s.area},!isPropLess&&s.schedule&&{icon:'calendar',text:s.schedule}].filter(Boolean);
    const rawText=s.raw||'';
    const dateStr=s.createdAt?new Date(s.createdAt).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'}):'';
    const rawMode=scRawViewIds.has(s.id);
    const linkChip=scLinkChipHTML(rawText);
    return `<div class="sc-card" data-scid="${esc(s.id)}">
      ${scSelectCheckHTML(s.id)}
      <div class="sc-card-head">
        <div class="sc-card-title">${esc(s.title||'(제목 없음)')}</div>
        <span class="sc-badge ${tCls}">${esc(tLabel)}</span>
        <span class="sc-badge ${stCls}">${esc(stLabel)}</span>
        ${dateStr?`<span style="font-size:10px;color:var(--ink-faint);margin-left:auto;flex-shrink:0;">${dateStr}</span>`:''}
      </div>
      ${metaParts.length?`<div class="sc-card-meta">${metaParts.map(m=>`<span class="chip sc-meta-chip" title="${esc(m.text)}">${ic(m.icon,'ic-muted')}<span class="sc-meta-chip-text">${esc(m.text)}</span></span>`).join('')}</div>`:''}
      ${linkChip?`<div class="sc-card-links">${linkChip}</div>`:''}
      ${(s.tags||[]).length?`<div class="sc-card-tags">${s.tags.map(t=>`<span class="sc-card-tag">${esc(t)}</span>`).join('')}</div>`:''}
      ${s.fit?`<span class="sc-fit-badge ${fitCls}">${fitLbl}</span>`:''}
      ${(s.imgs||[]).length?`<img src="${esc(s.imgs[0])}" class="sc-card-img" loading="lazy" alt="${esc(s.title||'스크랩')} 사진">`:''}
      ${rawText?`<div style="display:flex;justify-content:flex-end;margin-top:8px;">
        <button type="button" class="sc-preview-toggle" data-scraw="${esc(s.id)}">${rawMode?ic('eye')+' 서식 보기':ic('edit')+' 원문 보기'}</button>
      </div>
      <div class="sc-card-raw sc-md-content" onclick="scRawToggle(event,this)">${rawMode?`<pre style="white-space:pre-wrap;word-break:break-word;margin:0;font-family:inherit;">${esc(rawText)}</pre>`:renderMd(rawText)}</div>`:''}
      <div class="sc-card-actions">
        <select class="sc-status-sel" data-scst="${esc(s.id)}">
          ${Object.entries(SC_STATUS).map(([v,l])=>`<option value="${v}"${s.status===v?' selected':''}>${l}</option>`).join('')}
        </select>
        <button data-sc-edit="${esc(s.id)}">수정</button>
        <button data-sc-fit="${esc(s.id)}" disabled title="AI 자격확인 — 크레딧 필요">${ic('search')} 자격확인</button>
        <button data-sc-del="${esc(s.id)}" style="color:var(--s-drop)">삭제</button>
      </div>
    </div>`;
  }).join('')+'</div>';
  el.querySelectorAll('.sc-status-sel').forEach(sel=>sel.onchange=()=>{
    const s=state.scraps.find(x=>x.id===sel.dataset.scst);
    if(s){s.status=sel.value;save();renderScraps();}
  });
  el.querySelectorAll('[data-sc-edit]').forEach(b=>b.onclick=()=>openScEdit(b.dataset.scEdit));
  el.querySelectorAll('[data-sc-del]').forEach(b=>b.onclick=()=>{
    if(!confirm('이 항목을 삭제할까요?'))return;
    state.scraps=state.scraps.filter(x=>x.id!==b.dataset.scDel);save();renderScraps();
  });
  el.querySelectorAll('[data-scraw]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.scraw;
    if(scRawViewIds.has(id)) scRawViewIds.delete(id); else scRawViewIds.add(id);
    renderScraps();
  });
  scBindLinkChips(el);
}

/* B-174: 다중선택 진입 ①명시적 "선택" 버튼 */
document.getElementById('sc_selectModeBtn').onclick=()=>{
  if(scSelectMode) scExitSelectMode(); else scEnterSelectMode();
};
document.getElementById('scSelectCancelBtn').onclick=scExitSelectMode;
document.getElementById('scSelectDelBtn').onclick=()=>{
  const n=scSelectedIds.size;
  if(!n) return;
  if(!confirm(`선택한 ${n}개 항목을 삭제할까요?`)) return;
  state.scraps=state.scraps.filter(x=>!scSelectedIds.has(x.id));
  save();
  scExitSelectMode();
};
/* 선택 모드 중 카드 탭 = 토글. 캡처 단계라 기존 카드별 핸들러(수정 열기·
   라이트박스·개별 삭제·상태 select 등)보다 먼저 걸려 도달 자체를 막는다
   (평소=scSelectMode false엔 즉시 return이라 기존 동작 100% 무변경).
   <select>의 네이티브 드롭다운은 click 이전(mousedown/터치)에 열려
   stopPropagation으로 못 막으므로 style.css의 pointer-events:none이
   1차 방어, 이건 2차 안전망 */
document.getElementById('sc_cards').addEventListener('click',e=>{
  if(!scSelectMode) return;
  const card=e.target.closest('.sc-card,.sc-gallery-card');
  if(!card) return;
  e.preventDefault(); e.stopPropagation();
  scToggleSelect(card.dataset.scid);
},true);
/* 진입 ②카드 long-press(~500ms, 보조 지름길). touchmove로 10px 넘게
   움직이면 스크롤로 보고 타이머 취소 — 오발동 방지. long-press가 실제
   발동했으면 touchend에서 preventDefault로 뒤이어 오는 합성 click을
   무력화(안 그러면 캡처 핸들러가 한 번 더 토글해 방금 켠 선택이 바로
   꺼짐) */
let scLongPressTimer=null, scLongPressFired=false, scTouchStartX=0, scTouchStartY=0;
document.getElementById('sc_cards').addEventListener('touchstart',e=>{
  const card=e.target.closest('.sc-card,.sc-gallery-card');
  if(!card) return;
  scLongPressFired=false;
  const t=e.touches[0];
  scTouchStartX=t.clientX; scTouchStartY=t.clientY;
  scLongPressTimer=setTimeout(()=>{
    scLongPressTimer=null; scLongPressFired=true;
    if(!scSelectMode){
      scSelectMode=true;
      document.body.classList.add('sc-select-mode');
      document.getElementById('sc_selectModeBtn').dataset.on='1';
    }
    scToggleSelect(card.dataset.scid); // 1회만 재렌더
  },500);
},{passive:true});
document.getElementById('sc_cards').addEventListener('touchmove',e=>{
  if(!scLongPressTimer) return;
  const t=e.touches[0];
  if(Math.abs(t.clientX-scTouchStartX)>10||Math.abs(t.clientY-scTouchStartY)>10){
    clearTimeout(scLongPressTimer); scLongPressTimer=null;
  }
},{passive:true});
document.getElementById('sc_cards').addEventListener('touchend',e=>{
  if(scLongPressTimer){ clearTimeout(scLongPressTimer); scLongPressTimer=null; }
  if(scLongPressFired){ e.preventDefault(); scLongPressFired=false; }
},{passive:false});

document.getElementById('sc_typeFilter').onclick=e=>{
  const c=e.target.closest('[data-ftype]');if(!c)return;
  scFilterType=c.dataset.ftype;renderScraps();
};
document.getElementById('sc_statusFilter').onclick=e=>{
  const c=e.target.closest('[data-fstatus]');if(!c)return;
  scFilterStatus=c.dataset.fstatus;renderScraps();
};
document.getElementById('sc_search').addEventListener('input',e=>{scSearchQuery=e.target.value.trim();renderScraps();});
document.getElementById('sc_sort').addEventListener('change',()=>renderScraps());
/* B-104-3: 콤팩트 카드 그리드가 기본 진입 뷰. 뷰 상태는 기존처럼
   메모리에만 두고 renderScraps() 때 덮어쓰지 않아 세션 중 선택을 보존한다. */
let scViewMode='gallery';
const scViewListBtn=document.getElementById('sc_viewList');
const scViewGalleryBtn=document.getElementById('sc_viewGallery');
scViewListBtn.dataset.on='0';
scViewGalleryBtn.dataset.on='1';
scViewListBtn.addEventListener('click',()=>{
  scViewMode='list';
  scViewListBtn.dataset.on='1';
  scViewGalleryBtn.dataset.on='0';
  renderScraps();
});
scViewGalleryBtn.addEventListener('click',()=>{
  scViewMode='gallery';
  scViewListBtn.dataset.on='0';
  scViewGalleryBtn.dataset.on='1';
  renderScraps();
});

/* ── B-123① 갤러리 라이트박스: 기존 .modal(openModal/closeModal) 패턴
   재사용, imgs[] 좌우 넘김만 자체 구현(신규 라이브러리 없음) ── */
let scLightboxId=null, scLightboxIdx=0;
function scLightboxImgs(){
  const s=state.scraps.find(x=>x.id===scLightboxId);
  return (s&&Array.isArray(s.imgs))?s.imgs:[];
}
function scRenderLightbox(){
  const imgs=scLightboxImgs();
  if(!imgs.length){ closeModal('scLightboxModal'); return; }
  if(scLightboxIdx>=imgs.length) scLightboxIdx=imgs.length-1;
  if(scLightboxIdx<0) scLightboxIdx=0;
  const s=state.scraps.find(x=>x.id===scLightboxId);
  const title=s?.title||'사진';
  document.getElementById('scLightboxImg').src=imgs[scLightboxIdx];
  document.getElementById('scLightboxImg').alt=title+' 사진 '+(scLightboxIdx+1);
  document.getElementById('scLightboxTitle').textContent=title;
  document.getElementById('scLightboxCounter').textContent=(scLightboxIdx+1)+' / '+imgs.length;
  const multi=imgs.length>1;
  document.getElementById('scLightboxPrev').style.display=multi?'':'none';
  document.getElementById('scLightboxNext').style.display=multi?'':'none';
}
function scOpenLightbox(id){
  scLightboxId=id; scLightboxIdx=0;
  scRenderLightbox();
  openModal('scLightboxModal');
}
function scLightboxMove(dir){
  const imgs=scLightboxImgs(); if(imgs.length<2) return;
  scLightboxIdx=(scLightboxIdx+dir+imgs.length)%imgs.length;
  scRenderLightbox();
}
document.getElementById('scLightboxPrev').onclick=()=>scLightboxMove(-1);
document.getElementById('scLightboxNext').onclick=()=>scLightboxMove(1);
document.addEventListener('keydown',e=>{
  if(!document.getElementById('scLightboxModal').classList.contains('open'))return;
  if(e.key==='ArrowLeft'){e.preventDefault();scLightboxMove(-1);}
  else if(e.key==='ArrowRight'){e.preventDefault();scLightboxMove(1);}
});
