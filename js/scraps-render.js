let scSearchQuery='';
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
  if(!list.length){
    el.innerHTML=`<div class="sc-empty">${state.scraps.length?'조건에 맞는 항목이 없어요.':'아직 항목이 없어요.<br>위 버튼으로 첫 번째 항목을 추가해보세요!'}</div>`;
    return;
  }
  // 갤러리 뷰
  if(scViewMode==='gallery'){
    el.innerHTML='<div class="sc-gallery-grid">'+list.map(s=>{
      const tLabel=SC_TYPE[s.type]||s.type||'';
      const tCls='type-'+(s.type||'subscription');
      const stLabel=SC_STATUS[s.status]||s.status||'신규';
      const stCls='st-'+(s.status||'new');
      const dateStr=s.createdAt?new Date(s.createdAt).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'}):'';
      return `<div class="sc-gallery-card" data-scid="${s.id}">
        ${(s.imgs||[]).length?`<img src="${esc(s.imgs[0])}" class="sc-gallery-img" loading="lazy" alt="${esc(s.title||'스크랩')} 사진">`:`<div class="sc-gallery-no-img"><span class="sc-badge ${tCls}">${tLabel}</span></div>`}
        <div class="sc-gallery-body">
          <div class="sc-gallery-title">${esc(s.title||'(제목 없음)')}</div>
          <div class="sc-gallery-meta">
            <span class="sc-badge ${stCls}">${stLabel}</span>
            ${dateStr?`<span class="sc-gallery-date">${dateStr}</span>`:''}
          </div>
          ${(s.tags||[]).length?`<div class="sc-card-tags" style="margin-top:5px;">${s.tags.slice(0,3).map(t=>`<span class="sc-card-tag">${esc(t)}</span>`).join('')}</div>`:''}
        </div>
      </div>`;
    }).join('')+'</div>';
    el.querySelectorAll('.sc-gallery-card').forEach(c=>c.onclick=()=>openScEdit(c.dataset.scid));
    return;
  }
  el.innerHTML='<div class="sc-list">'+list.map(s=>{
    const tLabel=SC_TYPE[s.type]||s.type||'';
    const stLabel=SC_STATUS[s.status]||s.status||'신규';
    const tCls='type-'+(s.type||'subscription');
    const stCls='st-'+(s.status||'new');
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
    return `<div class="sc-card" data-scid="${s.id}">
      <div class="sc-card-head">
        <div class="sc-card-title">${esc(s.title||'(제목 없음)')}</div>
        <span class="sc-badge ${tCls}">${tLabel}</span>
        <span class="sc-badge ${stCls}">${stLabel}</span>
        ${dateStr?`<span style="font-size:10px;color:var(--ink-faint);margin-left:auto;flex-shrink:0;">${dateStr}</span>`:''}
      </div>
      ${metaParts.length?`<div class="sc-card-meta">${metaParts.map(m=>`<span class="chip sc-meta-chip" title="${esc(m.text)}">${ic(m.icon,'ic-muted')}<span class="sc-meta-chip-text">${esc(m.text)}</span></span>`).join('')}</div>`:''}
      ${(s.tags||[]).length?`<div class="sc-card-tags">${s.tags.map(t=>`<span class="sc-card-tag">${esc(t)}</span>`).join('')}</div>`:''}
      ${s.fit?`<span class="sc-fit-badge ${fitCls}">${fitLbl}</span>`:''}
      ${(s.imgs||[]).length?`<img src="${esc(s.imgs[0])}" class="sc-card-img" loading="lazy" alt="${esc(s.title||'스크랩')} 사진">`:''}      ${rawText?`<div class="sc-card-raw sc-md-content" onclick="this.classList.toggle('expand')">${renderMd(rawText)}</div>`:''}
      <div class="sc-card-actions">
        <select class="sc-status-sel" data-scst="${s.id}">
          ${Object.entries(SC_STATUS).map(([v,l])=>`<option value="${v}"${s.status===v?' selected':''}>${l}</option>`).join('')}
        </select>
        <button data-sc-edit="${s.id}">수정</button>
        <button data-sc-fit="${s.id}" disabled title="AI 자격확인 — 크레딧 필요">${ic('search')} 자격확인</button>
        <button data-sc-del="${s.id}" style="color:var(--s-drop)">삭제</button>
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
}

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
let scViewMode='list';
document.getElementById('sc_viewList').addEventListener('click',()=>{
  scViewMode='list';
  document.getElementById('sc_viewList').dataset.on='1';
  document.getElementById('sc_viewGallery').dataset.on='0';
  renderScraps();
});
document.getElementById('sc_viewGallery').addEventListener('click',()=>{
  scViewMode='gallery';
  document.getElementById('sc_viewList').dataset.on='0';
  document.getElementById('sc_viewGallery').dataset.on='1';
  renderScraps();
});
