/* ============ 스크랩 ============ */
let scrapImgData=null;
let scFilterType='', scFilterStatus='', scEditId=null;
const SC_TYPE={subscription:'청약공고',jeonse:'전세',sale:'매매',area:'동네·시세',policy:'정책·뉴스',review:'임장후기',note:'메모',ai_log:'AI기록'};
/* ── 이미지 압축 유틸 (max 600px, JPEG 0.65) ── */

const SC_STATUS={new:'신규',review:'검토중',interested:'관심',hold:'보류',promoted:'매물등록',dropped:'제외'};
const SC_PROPLESS=new Set(['note','ai_log']);

function scUpdatePropFields(type){
  const hide=SC_PROPLESS.has(type);
  document.getElementById('sc_fieldPrice').style.display=hide?'none':'';
  document.getElementById('sc_rowAreaSchedule').style.display=hide?'none':'';
  const lbl=document.getElementById('sc_moreLabel');
  if(lbl) lbl.textContent=hide?' 위치·조건 등 추가 입력':' 위치·가격·일정 등 추가 입력';
}



// ── sc_text: 인스타 감지 + 자동 높이 ──
document.getElementById('sc_text').addEventListener('input',e=>{
  autoResizeTa(e.target);
  const v=e.target.value.trim();
  const ogPrev=document.getElementById('sc_ogPreview');
  if(/instagram\.com\/(p|reel)\//.test(v)){
    ogPrev.style.display='block';
    ogPrev.innerHTML='<div class="og-card"><span class="og-loading">💡 인스타 링크만으로는 내용을 가져올 수 없어요.<br>→ 게시물의 <b>캡션을 복사</b>해서 아래 함께 붙여넣거나 <b>스크린샷</b>을 올려주세요.</span></div>';
  } else { ogPrev.style.display='none'; }
  // 실시간 미리보기
  const mdPrev=document.getElementById('sc_mdPreview');
  if(mdPrev&&!document.getElementById('sc_mdSplit')?.classList.contains('preview-hidden')){
    mdPrev.innerHTML=e.target.value?renderMd(e.target.value):'<span class="split-placeholder">입력하면 여기에 미리보기가 표시됩니다.</span>';
  }
  // 슬래시 커맨드 감지
  scDetectSlash(e.target);
});

// ── 키보드 단축키 ──
document.getElementById('sc_text').addEventListener('keydown',e=>{
  const ta=e.target;
  if(scSlashActive){
    if(e.key==='Escape'){e.preventDefault();scCloseSlash();return;}
    if(e.key==='ArrowDown'){e.preventDefault();scSlashMove(1);return;}
    if(e.key==='ArrowUp'){e.preventDefault();scSlashMove(-1);return;}
    if(e.key==='Enter'){
      e.preventDefault();
      const items=[...document.querySelectorAll('#sc_slashMenu .slash-item')];
      if(items[scSlashIdx]) scApplySlash(ta,items[scSlashIdx].dataset.key);
      return;
    }
  }
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();mdWrap(ta,'**','**');return;}
  if(mod&&e.key==='i'){e.preventDefault();mdWrap(ta,'*','*');return;}
  if(e.key==='Enter'&&!scSlashActive){
    const s=ta.selectionStart;
    const ls=ta.value.lastIndexOf('\n',s-1)+1;
    const curLine=ta.value.slice(ls,s);
    const m=curLine.match(/^(\s*)([-*+]|\d+\.)\s/);
    if(m){
      e.preventDefault();
      const pfx=m[0];
      ta.value=ta.value.slice(0,s)+'\n'+pfx+ta.value.slice(s);
      ta.selectionStart=ta.selectionEnd=s+1+pfx.length;
      autoResizeTa(ta);
    }
  }
});

// ── 툴바 버튼 ──
document.getElementById('sc_mdToolbar').onclick=e=>{
  const btn=e.target.closest('button[data-mdwrap],button[data-mdline]');
  if(!btn) return;
  const ta=document.getElementById('sc_text');
  if(btn.dataset.mdwrap){
    const parts=btn.dataset.mdwrap.split('||');
    mdWrap(ta,parts[0],parts[1]);
  } else if(btn.dataset.mdline){
    mdLine(ta,btn.dataset.mdline);
  }
  // 툴바 조작 후 미리보기 갱신
  const mdPrev=document.getElementById('sc_mdPreview');
  if(mdPrev&&!document.getElementById('sc_mdSplit')?.classList.contains('preview-hidden')){
    mdPrev.innerHTML=ta.value?renderMd(ta.value):'<span class="split-placeholder">입력하면 여기에 미리보기가 표시됩니다.</span>';
  }
};

// ── 슬래시 커맨드 ──
const SC_SLASH=[
  {key:'h2',icon:'H2',label:'제목 (H2)',desc:'## ',type:'line'},
  {key:'h3',icon:'H3',label:'소제목 (H3)',desc:'### ',type:'line'},
  {key:'ul',icon:'•',label:'목록 항목',desc:'- ',type:'line'},
  {key:'ol',icon:'1.',label:'번호 목록',desc:'1. ',type:'line'},
  {key:'quote',icon:'❝',label:'인용',desc:'> ',type:'line'},
  {key:'hr',icon:'—',label:'구분선',desc:'---\n',type:'text'},
  {key:'bold',icon:'B',label:'굵게',desc:'**||**',type:'wrap'},
  {key:'italic',icon:'I',label:'기울임',desc:'*||*',type:'wrap'},
  {key:'code',icon:'{}',label:'인라인 코드',desc:'`||`',type:'wrap'},
  {key:'codeblock',icon:'```',label:'코드 블록',desc:'```\n||\n```\n',type:'wrap'},
];
let scSlashActive=false,scSlashStart=-1,scSlashIdx=0;

function scDetectSlash(ta){
  const s=ta.selectionStart;
  const before=ta.value.slice(0,s);
  const lineStart=before.lastIndexOf('\n')+1;
  const lineText=before.slice(lineStart);
  if(lineText.startsWith('/')){
    const q=lineText.slice(1).toLowerCase();
    scSlashStart=lineStart;
    const filtered=SC_SLASH.filter(c=>!q||c.key.startsWith(q)||c.label.includes(q));
    if(filtered.length) scShowSlash(filtered);
    else scCloseSlash();
  } else {
    scCloseSlash();
  }
}

function scShowSlash(items){
  scSlashActive=true; scSlashIdx=0;
  const menu=document.getElementById('sc_slashMenu');
  if(!menu) return;
  menu.innerHTML=items.map((c,i)=>`<div class="slash-item${i===0?' active':''}" data-key="${c.key}"><span class="slash-icon">${c.icon}</span><span class="slash-label">${c.label}</span></div>`).join('');
  menu.style.display='';
  menu.querySelectorAll('.slash-item').forEach(item=>{
    item.onclick=()=>scApplySlash(document.getElementById('sc_text'),item.dataset.key);
  });
}

function scCloseSlash(){
  scSlashActive=false; scSlashStart=-1; scSlashIdx=0;
  const menu=document.getElementById('sc_slashMenu');
  if(menu) menu.style.display='none';
}

function scSlashMove(dir){
  const items=[...document.querySelectorAll('#sc_slashMenu .slash-item')];
  if(!items.length) return;
  scSlashIdx=Math.max(0,Math.min(items.length-1,scSlashIdx+dir));
  items.forEach((el,i)=>el.classList.toggle('active',i===scSlashIdx));
  items[scSlashIdx].scrollIntoView({block:'nearest'});
}

function scApplySlash(ta,key){
  const cmd=SC_SLASH.find(c=>c.key===key); if(!cmd) return;
  const cur=ta.selectionStart;
  const before=ta.value.slice(0,scSlashStart);
  const after=ta.value.slice(cur);
  let newVal,pos;
  if(cmd.type==='line'){
    newVal=before+cmd.desc+after;
    pos=before.length+cmd.desc.length;
  } else if(cmd.type==='text'){
    newVal=before+cmd.desc+after;
    pos=before.length+cmd.desc.length;
  } else if(cmd.type==='wrap'){
    const parts=cmd.desc.split('||');
    newVal=before+parts[0]+parts[1]+after;
    pos=before.length+parts[0].length;
  }
  ta.value=newVal;
  ta.selectionStart=ta.selectionEnd=pos;
  scCloseSlash();
  autoResizeTa(ta);
  // 미리보기 갱신
  const prev=document.getElementById('sc_mdPreview');
  if(prev&&!document.getElementById('sc_mdSplit')?.classList.contains('preview-hidden')){
    prev.innerHTML=ta.value?renderMd(ta.value):'<span class="split-placeholder">입력하면 여기에 미리보기가 표시됩니다.</span>';
  }
  ta.focus();
}

// ── 미리보기 토글 (split view) ──
document.getElementById('sc_previewToggle').onclick=function(){
  const split=document.getElementById('sc_mdSplit');
  const hiding=split.classList.toggle('preview-hidden');
  this.textContent=hiding?'👁 미리보기':'◀ 숨기기';
};

document.getElementById('sc_file').onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  compressImage(f,dataUrl=>{
    scrapImgData=dataUrl;
    document.getElementById('sc_preview').innerHTML=`<img src="${dataUrl}" class="sc-card-img">`;
    document.getElementById('sc_uploadLabel').textContent='📷 '+f.name;
  });
};

document.getElementById('sc_typeChips').onclick=e=>{
  const chip=e.target.closest('.sc-type-chip'); if(!chip)return;
  document.querySelectorAll('.sc-type-chip').forEach(c=>c.classList.remove('on'));
  chip.classList.add('on');
  scUpdatePropFields(chip.dataset.type);
};

document.getElementById('sc_moreToggle').onclick=()=>{
  const f=document.getElementById('sc_moreFields');
  const a=document.getElementById('sc_moreArrow');
  const open=f.classList.toggle('open');
  a.textContent=open?'▼':'▶';
};

document.getElementById('sc_saveBtn').onclick=()=>{
  const title=document.getElementById('sc_title').value.trim();
  const type=document.querySelector('.sc-type-chip.on')?.dataset.type||'subscription';
  const raw=document.getElementById('sc_text').value.trim();
  const err=document.getElementById('sc_formErr');
  if(!title){err.textContent='제목을 입력해주세요.';document.getElementById('sc_title').focus();return;}
  if(!raw&&!scrapImgData){err.textContent='원문·메모를 입력하거나 스크린샷을 첨부해주세요.';document.getElementById('sc_text').focus();return;}
  err.textContent='';
  const tagsRaw=document.getElementById('sc_tags').value;
  const fields={
    title,type,
    raw:raw||'',
    img:scrapImgData||'',
    location:document.getElementById('sc_location').value.trim(),
    price:document.getElementById('sc_price').value.trim(),
    area:document.getElementById('sc_area').value.trim(),
    schedule:document.getElementById('sc_schedule').value.trim(),
    condition:document.getElementById('sc_condition').value.trim(),
    source:document.getElementById('sc_source').value.trim(),
    fit:document.getElementById('sc_fit').value,
    tags:tagsRaw?tagsRaw.split(/[,、]+/).map(t=>t.trim()).filter(Boolean):[],
  };
  if(scEditId){
    const s=state.scraps.find(x=>x.id===scEditId);
    if(s) Object.assign(s,fields);
  } else {
    state.scraps.unshift({
      id:'sc'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),
      createdAt:Date.now(),status:'new',parsed:null,...fields
    });
  }
  scCloseForm();save();renderScraps();
};

function scClearForm(){
  ['sc_title','sc_text','sc_location','sc_price','sc_area','sc_schedule','sc_condition','sc_source','sc_tags'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('sc_fit').value='';
  document.getElementById('sc_formErr').textContent='';
  document.getElementById('sc_preview').innerHTML='';
  document.getElementById('sc_uploadLabel').textContent='📷 스크린샷 첨부';
  document.getElementById('sc_file').value='';
  document.getElementById('sc_ogPreview').style.display='none';
  const scTa=document.getElementById('sc_text');
  const scPrev=document.getElementById('sc_mdPreview');
  scTa.style.display=''; scTa.style.height='auto';
  scPrev.innerHTML='<span class="split-placeholder">입력하면 여기에 미리보기가 표시됩니다.</span>';
  const scSplit=document.getElementById('sc_mdSplit');
  if(scSplit) scSplit.classList.remove('preview-hidden');
  document.getElementById('sc_mdToolbar').style.display='';
  const scPToggle=document.getElementById('sc_previewToggle');
  scPToggle.textContent='◀ 숨기기';
  scCloseSlash();
  scrapImgData=null; scEditId=null;
  document.getElementById('sc_formTitle').textContent='➕ 추가';
  document.getElementById('sc_cancelBtn').style.display='none';
  document.querySelectorAll('.sc-type-chip').forEach((c,i)=>c.classList.toggle('on',i===0));
  scUpdatePropFields('subscription');
}

function scOpenForm(){ document.getElementById('sc_form').classList.add('open'); document.getElementById('sc_addToggle').textContent='▲ 접기'; document.getElementById('sc_form').scrollIntoView({behavior:'smooth',block:'nearest'}); }
function scCloseForm(){ scClearForm(); document.getElementById('sc_form').classList.remove('open'); document.getElementById('sc_addToggle').textContent='➕ 추가'; }
document.getElementById('sc_addToggle').onclick=()=>{ const isOpen=document.getElementById('sc_form').classList.contains('open'); isOpen?scCloseForm():scOpenForm(); };
document.getElementById('sc_formClose').onclick=scCloseForm;
document.getElementById('sc_cancelBtn').onclick=()=>{scCloseForm();renderScraps();};
document.getElementById('sc_analyzeBtn').onclick=()=>{};

/* ── 수정 모달 ── */
let scModalEditId=null, semImgData=null;
function semUpdatePropFields(type){
  const hide=SC_PROPLESS.has(type);
  const fp=document.getElementById('sem_fieldPrice');
  const ra=document.getElementById('sem_rowAreaSchedule');
  const lbl=document.getElementById('sem_moreLabel');
  if(fp) fp.style.display=hide?'none':'';
  if(ra) ra.style.display=hide?'none':'';
  if(lbl) lbl.textContent=hide?' 위치·조건 등':' 위치·가격·일정 등';
}
function openScEdit(id){
  const s=state.scraps.find(x=>x.id===id); if(!s)return;
  scModalEditId=id;
  document.getElementById('sem_title').value=s.title||'';
  document.getElementById('sem_text').value=s.raw||'';
  document.getElementById('sem_status').innerHTML=Object.entries(SC_STATUS).map(([v,l])=>`<option value="${v}"${s.status===v?' selected':''}>${l}</option>`).join('');
  document.getElementById('sem_location').value=s.location||'';
  document.getElementById('sem_price').value=s.price||'';
  document.getElementById('sem_area').value=s.area||'';
  document.getElementById('sem_schedule').value=s.schedule||'';
  document.getElementById('sem_condition').value=s.condition||'';
  document.getElementById('sem_source').value=s.source||'';
  document.getElementById('sem_fit').value=['high','mid','low'].includes(s.fit)?s.fit:'';
  document.getElementById('sem_tags').value=(s.tags||[]).join(', ');
  document.querySelectorAll('#sem_typeChips .sc-type-chip').forEach(c=>c.classList.toggle('on',c.dataset.type===s.type));
  semUpdatePropFields(s.type);
  document.getElementById('sem_moreFields').classList.remove('open');
  document.getElementById('sem_moreArrow').textContent='▶';
  // reset markdown preview
  document.getElementById('sem_text').style.display='';
  document.getElementById('sem_mdPreview').style.display='none';
  document.getElementById('sem_mdToolbar').style.display='';
  const pt=document.getElementById('sem_previewToggle');
  pt.classList.remove('on'); pt.textContent='👁 미리보기';
  document.getElementById('sem_err').textContent='';
  // 이미지 초기화
  semImgData=null;
  const semPrev=document.getElementById('sem_imgPreview');
  const semClr=document.getElementById('sem_imgClear');
  if(s.img){semPrev.src=s.img;semPrev.style.display='';semClr.style.display='';}
  else{semPrev.style.display='none';semClr.style.display='none';}
  document.getElementById('sem_imgLabel').textContent='📷 첨부/변경';
  document.getElementById('sem_img').value='';
  openModal('scEditModal');
}

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
        ${s.img?`<img src="${s.img}" class="sc-gallery-img" loading="lazy">`:`<div class="sc-gallery-no-img"><span class="sc-badge ${tCls}">${tLabel}</span></div>`}
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
    if(s.fit==='high'||s.fit==='가능'){fitCls='high';fitLbl='✅ 적합';}
    else if(s.fit==='low'||s.fit==='불가'){fitCls='low';fitLbl='❌ 부적합';}
    else if(s.fit){fitCls='mid';fitLbl='⚠️ '+esc(s.fit);}
    const isPropLess=SC_PROPLESS.has(s.type);
    const metaParts=[s.location&&`📍 ${esc(s.location)}`,!isPropLess&&s.price&&`💰 ${esc(s.price)}`,!isPropLess&&s.area&&`📐 ${esc(s.area)}`,!isPropLess&&s.schedule&&`📅 ${esc(s.schedule)}`].filter(Boolean);
    const rawText=s.raw||'';
    const dateStr=s.createdAt?new Date(s.createdAt).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'}):'';
    return `<div class="sc-card" data-scid="${s.id}">
      <div class="sc-card-head">
        <div class="sc-card-title">${esc(s.title||'(제목 없음)')}</div>
        <span class="sc-badge ${tCls}">${tLabel}</span>
        <span class="sc-badge ${stCls}">${stLabel}</span>
        ${dateStr?`<span style="font-size:10px;color:var(--ink-faint);margin-left:auto;flex-shrink:0;">${dateStr}</span>`:''}
      </div>
      ${metaParts.length?`<div class="sc-card-meta">${metaParts.join(' &nbsp;·&nbsp; ')}</div>`:''}
      ${(s.tags||[]).length?`<div class="sc-card-tags">${s.tags.map(t=>`<span class="sc-card-tag">${esc(t)}</span>`).join('')}</div>`:''}
      ${s.fit?`<span class="sc-fit-badge ${fitCls}">${fitLbl}</span>`:''}
      ${s.img?`<img src="${s.img}" class="sc-card-img" loading="lazy">`:''}      ${rawText?`<div class="sc-card-raw sc-md-content" onclick="this.classList.toggle('expand')">${renderMd(rawText)}</div>`:''}
      <div class="sc-card-actions">
        <select class="sc-status-sel" data-scst="${s.id}">
          ${Object.entries(SC_STATUS).map(([v,l])=>`<option value="${v}"${s.status===v?' selected':''}>${l}</option>`).join('')}
        </select>
        <button data-sc-edit="${s.id}">수정</button>
        <button data-sc-fit="${s.id}" disabled title="AI 자격확인 — 크레딧 필요">🔍 자격확인</button>
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

/* ── 수정 모달 이벤트 ── */
document.getElementById('sem_typeChips').onclick=e=>{
  const chip=e.target.closest('.sc-type-chip');if(!chip)return;
  document.querySelectorAll('#sem_typeChips .sc-type-chip').forEach(c=>c.classList.remove('on'));
  chip.classList.add('on');
  semUpdatePropFields(chip.dataset.type);
};
document.getElementById('sem_moreToggle').onclick=()=>{
  const f=document.getElementById('sem_moreFields');
  const a=document.getElementById('sem_moreArrow');
  const open=f.classList.toggle('open');
  a.textContent=open?'▼':'▶';
};
document.getElementById('sem_previewToggle').onclick=function(){
  const ta=document.getElementById('sem_text');
  const prev=document.getElementById('sem_mdPreview');
  const on=prev.style.display==='none';
  prev.style.display=on?'':'none';
  ta.style.display=on?'none':'';
  document.getElementById('sem_mdToolbar').style.display=on?'none':'';
  this.classList.toggle('on',on);
  this.textContent=on?'✏️ 편집':'👁 미리보기';
  if(on) prev.innerHTML=renderMd(ta.value)||'<span style="color:var(--ink-faint);font-size:12px;">내용을 입력하면 미리보기가 표시됩니다.</span>';
};
document.getElementById('sem_mdToolbar').onclick=e=>{
  const btn=e.target.closest('[data-semwrap],[data-semline]');if(!btn)return;
  const ta=document.getElementById('sem_text');
  if(btn.dataset.semwrap){const parts=btn.dataset.semwrap.split('||');mdWrap(ta,parts[0],parts[1]);}
  else if(btn.dataset.semline){mdLine(ta,btn.dataset.semline);}
};
document.getElementById('sem_text').addEventListener('keydown',e=>{
  const ta=e.target, mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();mdWrap(ta,'**','**');return;}
  if(mod&&e.key==='i'){e.preventDefault();mdWrap(ta,'*','*');return;}
});
document.getElementById('sem_text').addEventListener('input',e=>autoResizeTa(e.target));
document.getElementById('sem_img').onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  compressImage(f,dataUrl=>{
    semImgData=dataUrl;
    const prev=document.getElementById('sem_imgPreview');
    prev.src=dataUrl; prev.style.display='';
    document.getElementById('sem_imgLabel').textContent='📷 '+f.name;
    document.getElementById('sem_imgClear').style.display='';
  });
};
document.getElementById('sem_imgClear').onclick=()=>{
  semImgData=''; // empty string = remove image
  document.getElementById('sem_imgPreview').style.display='none';
  document.getElementById('sem_img').value='';
  document.getElementById('sem_imgLabel').textContent='📷 첨부/변경';
  document.getElementById('sem_imgClear').style.display='none';
};
document.getElementById('sem_cancel').onclick=()=>{semImgData=null;closeModal('scEditModal');};
document.getElementById('sem_save').onclick=()=>{
  const s=state.scraps.find(x=>x.id===scModalEditId);
  if(!s){closeModal('scEditModal');return;}
  const title=document.getElementById('sem_title').value.trim();
  if(!title){document.getElementById('sem_err').textContent='제목을 입력해주세요.';return;}
  const type=document.querySelector('#sem_typeChips .sc-type-chip.on')?.dataset.type||s.type;
  const tagsRaw=document.getElementById('sem_tags').value;
  Object.assign(s,{
    title,type,
    raw:document.getElementById('sem_text').value,
    status:document.getElementById('sem_status').value,
    location:document.getElementById('sem_location').value.trim(),
    price:document.getElementById('sem_price').value.trim(),
    area:document.getElementById('sem_area').value.trim(),
    schedule:document.getElementById('sem_schedule').value.trim(),
    condition:document.getElementById('sem_condition').value.trim(),
    source:document.getElementById('sem_source').value.trim(),
    fit:document.getElementById('sem_fit').value,
    tags:tagsRaw?tagsRaw.split(/[,、]+/).map(t=>t.trim()).filter(Boolean):[],
    img:semImgData===null?s.img:(semImgData||''),
  });
  semImgData=null;
  save();renderScraps();closeModal('scEditModal');
};

async function checkFit(id){
  const s=state.scraps.find(x=>x.id===id); if(!s)return;
  const p=s.parsed||{};
  const card=document.querySelector(`[data-scid="${id}"]`);
  const fitEl=card?.querySelector('.sc-fit-badge');
  if(fitEl){fitEl.className='sc-fit-badge mid';fitEl.textContent='확인 중…';}
  try{
    const out=await claudeAPI([{role:'user',content:
      `우리 조건으로 이 매물/청약에 지원 가능한지 판단해. 설명·마크다운 금지, JSON만.\n`+
      `형식:{"fit":"가능|불가|확인필요","reason":"한 줄 이유"}\n`+
      `[우리 조건] ${profileLine()}\n`+
      `[매물/청약] ${s.title||'?'} / 일정:${s.schedule||p.schedule||'?'} / 자격:${s.condition||p.qualification||'?'} / 면적:${s.area||p.area||'?'} / 가격:${s.price||p.price||'?'}`}]);
    const j=parseJSON(out);
    if(j){s.fit=j.fit+(j.reason?' — '+j.reason:'');save();renderScraps();}
  }catch(e){ if(fitEl){fitEl.className='sc-fit-badge low';fitEl.textContent=e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 연결 실패';} }
}


/* ============ 스크랩 임포트 ============ */
const SC_FIELD_MAP={
  '제목':'title','타이틀':'title','단지명':'title','물건':'title','title':'title',
  '유형':'type','분류':'type','종류':'type','type':'type',
  '위치':'location','동네':'location','지역':'location','주소':'location','소재지':'location','location':'location',
  '가격':'price','전세가':'price','분양가':'price','보증금':'price','매매가':'price','호가':'price','실거래가':'price','price':'price',
  '면적':'area','평형':'area','크기':'area','전용면적':'area','전용':'area','area':'area',
  '일정':'schedule','청약일':'schedule','입주':'schedule','입주예정':'schedule','모집공고일':'schedule','청약일정':'schedule','schedule':'schedule',
  '조건':'condition','자격':'condition','자격요건':'condition','조건자격':'condition','신청자격':'condition','청약자격':'condition','condition':'condition',
  '출처':'source','링크':'source','url':'source','참고':'source','source':'source',
  '태그':'tags','키워드':'tags','tags':'tags',
  '메모':'raw','원문':'raw','내용':'raw','본문':'raw',
  '적합도':'fit','판단':'fit','fit':'fit',
};
const SC_TYPE_MAP={
  '청약공고':'subscription','청약':'subscription',
  '전세':'jeonse',
  '매매':'sale',
  '동네·시세':'area','동네':'area','시세':'area',
  '정책·뉴스':'policy','정책':'policy','뉴스':'policy',
  '임장후기':'review','임장':'review',
  '메모':'note','note':'note',
  'AI기록':'ai_log','ai기록':'ai_log','ai_log':'ai_log',
};
const SC_FIT_MAP={
  '높음':'high','고':'high','가능':'high','적합':'high','high':'high',
  '중간':'mid','보통':'mid','중':'mid','mid':'mid',
  '낮음':'low','저':'low','불가':'low','부적합':'low','low':'low',
};

function scMapField(h){
  const k=h.trim();
  return SC_FIELD_MAP[k]||SC_FIELD_MAP[k.toLowerCase()]||null;
}
function scMapType(v){ return SC_TYPE_MAP[v.trim()]||null; }
function scMapFit(v){ return SC_FIT_MAP[v.trim()]||SC_FIT_MAP[v.trim().toLowerCase()]||null; }

/* ── 프론트매터 파서 ---\nkey: val\n---\nbody ── */
function scParseFrontmatter(text){
  const m=text.match(/^---[ \t]*\r?\n([\s\S]*?)\n---[ \t]*(\r?\n|$)([\s\S]*)/);
  if(!m) return null;
  const fmBlock=m[1], body=(m[3]||'').trim();
  const item={};
  for(const line of fmBlock.split('\n')){
    const ci=line.indexOf(':');
    if(ci<=0) continue;
    const key=line.slice(0,ci).trim();
    const val=line.slice(ci+1).trim();
    if(!val) continue;
    const field=scMapField(key);
    if(!field) continue;
    if(field==='type'){ const t=scMapType(val); if(t) item.type=t; }
    else if(field==='fit'){ const f=scMapFit(val); if(f) item.fit=f; }
    else if(field==='tags') item.tags=val.split(/[,、·]+/).map(t=>t.trim()).filter(Boolean);
    else item[field]=val;
  }
  if(body) item.raw=(item.raw?item.raw+'\n':'')+body;
  return (item.title||item.raw)?[item]:null;
}

/* ── 마크다운 표 파서 ── */
function scParseMdTable(text){
  const lines=text.split('\n').map(l=>l.trim()).filter(l=>l.startsWith('|'));
  if(lines.length<2) return null;
  const headers=lines[0].split('|').slice(1,-1).map(h=>h.trim());
  const fieldKeys=headers.map(scMapField);
  const dataLines=lines.slice(1).filter(l=>!/^\|[\s\-:|]+\|/.test(l));
  if(!dataLines.length) return null;
  const items=[];
  for(const line of dataLines){
    const cells=line.split('|').slice(1,-1).map(c=>c.trim());
    const item={extra:[]};
    fieldKeys.forEach((field,i)=>{
      const val=cells[i]||''; if(!val) return;
      if(field==='type'){ const t=scMapType(val); if(t) item.type=t; }
      else if(field==='fit'){ const f=scMapFit(val); if(f) item.fit=f; }
      else if(field==='tags') item.tags=val.split(/[,、·]+/).map(t=>t.trim()).filter(Boolean);
      else if(field) item[field]=val;
      else item.extra.push(headers[i]+': '+val);
    });
    if(item.extra.length) item.raw=(item.raw?item.raw+'\n':'')+item.extra.join('\n');
    delete item.extra;
    if(item.title||item.raw) items.push(item);
  }
  return items.length?items:null;
}

/* ── key: val 블록 파서 (빈 줄로 구분) ── */
function scParseBlocks(text){
  const blocks=text.trim().split(/\n[ \t]*\n/);
  const items=[];
  for(const block of blocks){
    if(!block.trim()) continue;
    const lines=block.trim().split('\n');
    const item={extra:[]};
    for(const line of lines){
      const ci=line.indexOf(':');
      if(ci>0){
        const key=line.slice(0,ci).trim(), val=line.slice(ci+1).trim();
        const field=scMapField(key);
        if(field==='type'){ const t=scMapType(val); if(t) item.type=t; }
        else if(field==='fit'){ const f=scMapFit(val); if(f) item.fit=f; }
        else if(field==='tags') item.tags=val.split(/[,、·]+/).map(t=>t.trim()).filter(Boolean);
        else if(field) item[field]=val;
        else item.extra.push(line);
      } else { item.extra.push(line); }
    }
    if(item.extra.length) item.raw=(item.raw?item.raw+'\n':'')+item.extra.join('\n');
    delete item.extra;
    if(item.title||item.raw) items.push(item);
  }
  return items.length?items:null;
}

/* ── 자유 텍스트 폴백 — 첫 제목줄 추출, 전체를 raw ── */
function scFreeText(text){
  const t=text.trim(); if(!t) return null;
  const headingM=t.match(/^#{1,3}\s+(.+)/m);
  const firstLine=t.split('\n').find(l=>l.trim());
  const title=headingM?headingM[1].trim():(firstLine||'').replace(/^[#\-*>\s]+/,'').slice(0,60).trim();
  return [{ title, raw: t }];
}

/* ── 자동 감지 ── */
function scAutoDetect(text){
  const fm=scParseFrontmatter(text); if(fm) return fm;
  if(/^\|.+\|/m.test(text)) return scParseMdTable(text);
  if(/^[가-힣a-zA-Z\w·\s]{1,15}:/m.test(text)) return scParseBlocks(text);
  return scFreeText(text);
}

let scImportItems=[];

function scShowImportPreview(items){
  scImportItems=items;
  const rows=items.map((it,i)=>`<tr>
    <td><input type="checkbox" class="sc-imp-chk" data-idx="${i}" checked></td>
    <td class="sc-it">${esc(it.title||'(제목 없음)')}</td>
    <td>${it.type?`<span class="sc-badge type-${it.type}" style="font-size:10px;">${SC_TYPE[it.type]||it.type}</span>`:'-'}</td>
    <td class="sc-im">${[it.location,it.price].filter(Boolean).map(esc).join(' / ')||'-'}</td>
    <td class="sc-im">${esc(it.schedule||'-')}</td>
  </tr>`).join('');
  document.getElementById('sc_importPreviewContent').innerHTML=`
    <div style="font-size:12px;font-weight:700;color:var(--money-deep);margin:8px 0 6px;">${items.length}개 파싱됨 — 등록할 항목을 선택하세요.</div>
    <div style="overflow-x:auto;">
    <table class="sc-import-tbl">
      <thead><tr>
        <th><input type="checkbox" id="sc_checkAll" checked></th>
        <th>제목</th><th>유형</th><th>위치/가격</th><th>일정</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  document.getElementById('sc_importTextArea').style.display='none';
  document.getElementById('sc_importParseRow').style.display='none';
  document.getElementById('sc_importPreview').style.display='';
  document.getElementById('sc_importErr').textContent='';
  const allChk=document.getElementById('sc_checkAll');
  allChk.onchange=()=>document.querySelectorAll('.sc-imp-chk').forEach(c=>c.checked=allChk.checked);
  document.querySelectorAll('.sc-imp-chk').forEach(c=>c.onchange=scUpdateConfirmBtn);
  scUpdateConfirmBtn();
}

function scUpdateConfirmBtn(){
  const n=document.querySelectorAll('.sc-imp-chk:checked').length;
  const btn=document.getElementById('sc_importConfirm');
  btn.textContent=`${n}개 등록`;
  btn.disabled=n===0;
}

document.getElementById('sc_importTrigger').onclick=()=>{
  openModal('scImportModal');
  document.getElementById('sc_importTextArea').style.display='';
  document.getElementById('sc_importParseRow').style.display='';
  document.getElementById('sc_importPreview').style.display='none';
  document.getElementById('sc_importInput').value='';
  document.getElementById('sc_importErr').textContent='';
};

document.getElementById('sc_importParseBtn').onclick=()=>{
  const text=document.getElementById('sc_importInput').value.trim();
  const err=document.getElementById('sc_importErr');
  if(!text){err.textContent='텍스트를 붙여넣어 주세요.';return;}
  const items=scAutoDetect(text);
  if(!items||!items.length){
    err.textContent="텍스트를 인식하지 못했어요. GPT 응답이나 자유 텍스트도 괜찮아요.";
    return;
  }
  scShowImportPreview(items);
};

document.getElementById('sc_importBack').onclick=()=>{
  document.getElementById('sc_importTextArea').style.display='';
  document.getElementById('sc_importParseRow').style.display='';
  document.getElementById('sc_importPreview').style.display='none';
};

document.getElementById('sc_importConfirm').onclick=()=>{
  const checkedIdxs=Array.from(document.querySelectorAll('.sc-imp-chk:checked')).map(c=>+c.dataset.idx);
  const now=Date.now();
  checkedIdxs.slice().reverse().forEach(i=>{
    const it=scImportItems[i];
    state.scraps.unshift({
      id:'sc'+now.toString(36)+Math.random().toString(36).slice(2,5),
      createdAt:now,status:'new',parsed:null,
      title:it.title||'',type:it.type||'area',
      raw:it.raw||'',location:it.location||'',
      price:it.price||'',area:it.area||'',
      schedule:it.schedule||'',condition:it.condition||'',
      source:it.source||'',fit:it.fit||'',
      tags:it.tags||[],
    });
  });
  save();renderScraps();
  closeModal('scImportModal');
};


/* ============ 규제·뉴스 ============ */
function renderRegNews(){
  const cards=document.getElementById('rn_cards');
  if(!state.regNews.length){
    cards.innerHTML='<div class="rn-empty">아직 수집된 뉴스가 없어요.<br><b>🔍 최신 규제 확인</b> 버튼을 눌러보세요.</div>';
    return;
  }
  cards.innerHTML='<div class="rn-list">'+state.regNews.map(n=>`
    <div class="rn-card" data-rnid="${esc(n.id)}">
      <div class="rn-title">${esc(n.title||'')}</div>
      <div class="rn-summary">${esc(n.summary||'')}</div>
      <div class="rn-meta">
        ${n.date?`<span class="rn-date">${esc(n.date)}</span>`:''}
        ${n.source?`<span class="rn-src">🔗 출처 보기</span>`:''}
      </div>
    </div>`).join('')+'</div>';
  cards.querySelectorAll('.rn-card[data-rnid]').forEach(el=>{
    const n=state.regNews.find(x=>x.id===el.dataset.rnid);
    if(n&&n.source) el.onclick=()=>window.open(n.source,'_blank');
  });
}
function updateDashRegline(){}
document.getElementById('rn_fetchBtn').onclick=async()=>{
  const btn=document.getElementById('rn_fetchBtn');
  btn.disabled=true; const old=btn.textContent; btn.textContent='검색 중…';
  try{
    const queries=[
      '서울 신혼부부 전세자금대출 버팀목 금리 변경 2026',
      '서울시 신혼부부 특별공급 자격기준 2026',
      '신혼부부 전세보증금 이자지원 2026',
      '전세사기 보증보험 HUG 변경사항 2026'
    ];
    const out=await claudeAPI([{role:'user',content:
      `우리는 ${profileLine()}\n`+
      `다음 키워드로 최신 규제·정책·금리 뉴스를 웹에서 찾아 JSON 배열로 정리해. 설명·마크다운 금지, JSON 배열만 출력.\n`+
      `키워드: ${queries.join(' / ')}\n`+
      `형식: [{"title":"제목","summary":"1~2문장 요약","date":"YYYY-MM-DD 또는 YYYY-MM","source":"출처URL"}]\n`+
      `최신순 정렬, 최대 6건. 날짜를 모르면 빈 문자열. 출처URL을 모르면 빈 문자열.`}],
      [{type:'web_search_20250305',name:'web_search'}]);
    const arr=parseJSON(out);
    if(Array.isArray(arr)&&arr.length){
      state.regNews=arr.map(n=>({id:'rn'+Date.now()+Math.random().toString(36).slice(2,6),title:n.title||'',summary:n.summary||'',date:n.date||'',source:n.source||''}));
      save(); renderRegNews(); updateDashRegline();
      btn.textContent='✓ 업데이트 완료';
    } else {
      btn.textContent='결과를 파싱하지 못했어요';
    }
  }catch(e){
    btn.textContent=aiAvailable===false?aiUnavailableMsg():'AI 응답 실패';
  }
  setTimeout(()=>{btn.disabled=false;btn.textContent=old;},2000);
};
