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



// ── sc_text: 라이브 렌더 + 인스타 감지 ──
document.getElementById('sc_text').addEventListener('input',e=>{
  const el=e.target;
  const raw=el.innerText.replace(/\r\n?/g,'\n').replace(/\n$/,'');
  el.dataset.raw=raw;
  el.classList.toggle('is-empty',!raw.trim());
  if(e.isComposing)return;
  clearTimeout(scRenderTimer);
  scRenderTimer=setTimeout(()=>ceRender(el),200);
  const ogPrev=document.getElementById('sc_ogPreview');
  if(/instagram\.com\/(p|reel)\//.test(raw)){
    ogPrev.style.display='block';
    ogPrev.innerHTML='<div class="og-card"><span class="og-loading">💡 인스타 링크만으로는 내용을 가져올 수 없어요.<br>→ 게시물의 <b>캡션을 복사</b>해서 아래 함께 붙여넣거나 <b>스크린샷</b>을 올려주세요.</span></div>';
  } else { ogPrev.style.display='none'; }
  scDetectSlash(el,'sc_slashMenu');
});

document.getElementById('sc_text').addEventListener('compositionend',e=>{
  const el=e.target;
  const raw=el.innerText.replace(/\r\n?/g,'\n').replace(/\n$/,'');
  el.dataset.raw=raw; el.classList.toggle('is-empty',!raw.trim());
  ceRender(el); scDetectSlash(el,'sc_slashMenu');
});
document.getElementById('sc_text').addEventListener('paste',e=>{
  e.preventDefault();
  const text=(e.clipboardData||window.clipboardData).getData('text/plain');
  const el=e.target, s=ceGetOffset(el);
  const raw=el.dataset.raw||el.innerText.replace(/\r\n?/g,'\n').replace(/\n$/,'');
  const newRaw=raw.slice(0,s)+text.replace(/\r\n?/g,'\n')+raw.slice(s);
  el.dataset.raw=newRaw; el.classList.toggle('is-empty',!newRaw.trim());
  el.innerHTML=newRaw.split('\n').map(ceRenderLine).join('');
  ceSetOffset(el,s+text.length);
});

// ── 키보드 단축키 ──
document.getElementById('sc_text').addEventListener('keydown',e=>{
  const el=e.target;
  if(scSlashActive){
    if(e.key==='Escape'){e.preventDefault();scCloseSlash();return;}
    if(e.key==='ArrowDown'){e.preventDefault();scSlashMove(1);return;}
    if(e.key==='ArrowUp'){e.preventDefault();scSlashMove(-1);return;}
    if(e.key==='Enter'){e.preventDefault();const menu=document.getElementById(scSlashMenuId);const items=menu?[...menu.querySelectorAll('.slash-item')]:[];if(items[scSlashIdx])scApplySlash(el,items[scSlashIdx].dataset.key);return;}
  }
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();ceWrap(el,'**','**');return;}
  if(mod&&e.key==='i'){e.preventDefault();ceWrap(el,'*','*');return;}
  if(e.key==='Enter'&&!scSlashActive){
    e.preventDefault();
    const s=ceGetOffset(el); const raw=el.dataset.raw||'';
    const ls=raw.lastIndexOf('\n',s-1)+1;
    const curLine=raw.slice(ls,s);
    const m=curLine.match(/^([-*+]|\d+\.)\s/);
    const pfx=m?m[0]:'';
    const newRaw=raw.slice(0,s)+'\n'+pfx+raw.slice(s);
    el.dataset.raw=newRaw;
    ceRender(el); ceSetOffset(el,s+1+pfx.length);
  }
});

// ── 툴바 버튼 ──
document.getElementById('sc_mdToolbar').addEventListener('mousedown',e=>e.preventDefault());
document.getElementById('sc_mdToolbar').onclick=e=>{
  const btn=e.target.closest('button[data-mdwrap],button[data-mdline]');
  if(!btn) return;
  const el=document.getElementById('sc_text');
  if(btn.dataset.mdwrap){const parts=btn.dataset.mdwrap.split('||');ceWrap(el,parts[0],parts[1]);}
  else if(btn.dataset.mdline){ceLine(el,btn.dataset.mdline);}
};

// ── 슬래시 커맨드 ──
const SC_SLASH=[
  {key:'h2',icon:'H2',label:'제목',hint:'큰 제목 블록',desc:'## ',type:'line'},
  {key:'h3',icon:'H3',label:'소제목',hint:'중간 제목 블록',desc:'### ',type:'line'},
  {key:'ul',icon:'•',label:'목록',hint:'글머리 기호 목록',desc:'- ',type:'line'},
  {key:'ol',icon:'1.',label:'번호 목록',hint:'번호가 매겨진 목록',desc:'1. ',type:'line'},
  {key:'quote',icon:'❝',label:'인용',hint:'인용구 블록',desc:'> ',type:'line'},
  {key:'hr',icon:'—',label:'구분선',hint:'가로 구분선 삽입',desc:'---\n',type:'text'},
  {key:'bold',icon:'B',label:'굵게',hint:'선택 텍스트를 굵게',desc:'**||**',type:'wrap'},
  {key:'italic',icon:'I',label:'기울임',hint:'선택 텍스트를 이탤릭',desc:'*||*',type:'wrap'},
  {key:'code',icon:'{}',label:'코드',hint:'인라인 코드 서식',desc:'`||`',type:'wrap'},
  {key:'codeblock',icon:'```',label:'코드 블록',hint:'여러 줄 코드 블록',desc:'```\n||\n```\n',type:'wrap'},
];
let scSlashActive=false,scSlashStart=-1,scSlashIdx=0,scSlashMenuId='sc_slashMenu';
let scRenderTimer,semRenderTimer;

function scDetectSlash(el,menuId){
  if(menuId)scSlashMenuId=menuId;
  const s=ceGetOffset(el);
  const before=el.innerText.slice(0,s);
  const lineStart=before.lastIndexOf('\n')+1;
  const lineText=before.slice(lineStart);
  if(lineText.startsWith('/')){
    const q=lineText.slice(1).toLowerCase();
    scSlashStart=lineStart;
    const filtered=SC_SLASH.filter(c=>!q||c.key.startsWith(q)||c.label.includes(q)||c.hint.includes(q));
    if(filtered.length) scShowSlash(filtered,el);
    else scCloseSlash();
  } else { scCloseSlash(); }
}

function scShowSlash(items,el){
  scSlashActive=true; scSlashIdx=0;
  const menu=document.getElementById(scSlashMenuId);
  if(!menu) return;
  menu.innerHTML=items.map((c,i)=>`<div class="slash-item${i===0?' active':''}" data-key="${c.key}"><span class="slash-icon">${c.icon}</span><span class="slash-info"><span class="slash-label">${c.label}</span><span class="slash-hint">${c.hint}</span></span></div>`).join('');
  menu.style.display='block';
  menu.querySelectorAll('.slash-item').forEach(item=>{
    item.addEventListener('mousedown',e=>e.preventDefault());
    item.onclick=()=>scApplySlash(el,item.dataset.key);
  });
}

function scCloseSlash(){
  scSlashActive=false; scSlashStart=-1; scSlashIdx=0;
  const menu=document.getElementById(scSlashMenuId);
  if(menu) menu.style.display='none';
}

function scSlashMove(dir){
  const menu=document.getElementById(scSlashMenuId);
  if(!menu) return;
  const items=[...menu.querySelectorAll('.slash-item')];
  if(!items.length) return;
  scSlashIdx=Math.max(0,Math.min(items.length-1,scSlashIdx+dir));
  items.forEach((el,i)=>el.classList.toggle('active',i===scSlashIdx));
  items[scSlashIdx].scrollIntoView({block:'nearest'});
}

function scApplySlash(el,key){
  const cmd=SC_SLASH.find(c=>c.key===key); if(!cmd) return;
  const cur=ceGetOffset(el);
  const raw=el.dataset.raw||el.innerText.replace(/\r\n?/g,'\n').replace(/\n$/,'');
  const before=raw.slice(0,scSlashStart), after=raw.slice(cur);
  let newRaw,pos;
  if(cmd.type==='line'||cmd.type==='text'){newRaw=before+cmd.desc+after;pos=before.length+cmd.desc.length;}
  else{const p=cmd.desc.split('||');newRaw=before+p[0]+p[1]+after;pos=before.length+p[0].length;}
  el.dataset.raw=newRaw;
  ceRender(el); ceSetOffset(el,pos); scCloseSlash();
}

// ── blur: 클린 렌더 / focus: 라이브 렌더 ──
document.getElementById('sc_text').addEventListener('blur',()=>{
  const el=document.getElementById('sc_text');
  const raw=el.dataset.raw||'';
  el.innerHTML=raw.trim()?renderMd(raw):'';
  el.classList.toggle('is-empty',!raw.trim());
  document.getElementById('sc_mdToolbar').style.display='none';
});
document.getElementById('sc_text').addEventListener('focus',()=>{
  const el=document.getElementById('sc_text');
  const raw=el.dataset.raw||'';
  el.classList.remove('is-empty');
  el.innerHTML=raw?raw.split('\n').map(ceRenderLine).join(''):'';
  document.getElementById('sc_mdToolbar').style.display='';
  // 커서를 끝으로 이동
  const r=document.createRange();r.selectNodeContents(el);r.collapse(false);
  const s=window.getSelection();s.removeAllRanges();s.addRange(r);
});

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
  const scEl=document.getElementById('sc_text');
  const raw=(scEl.dataset.raw||scEl.innerText||'').trim();
  const err=document.getElementById('sc_formErr');
  if(!title){err.textContent='제목을 입력해주세요.';document.getElementById('sc_title').focus();return;}
  if(!raw&&!scrapImgData){err.textContent='원문·메모를 입력하거나 스크린샷을 첨부해주세요.';scEl.focus();return;}
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
  const scEl=document.getElementById('sc_text');
  scEl.innerHTML=''; scEl.dataset.raw=''; scEl.classList.add('is-empty');
  document.getElementById('sc_mdToolbar').style.display='';
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
  // 편집 모달 에디터 초기화
  const semEl=document.getElementById('sem_text');
  semEl.dataset.raw=s.raw||'';
  semEl.innerHTML=(s.raw||'').split('\n').map(ceRenderLine).join('');
  semEl.classList.toggle('is-empty',!s.raw);
  document.getElementById('sem_mdToolbar').style.display='';
  document.getElementById('sem_err').textContent='';
  const sn=document.getElementById('savedNote');
  if(sn){sn.textContent='저장 버튼으로 반영됩니다';sn.style.color='var(--ink-soft)';}
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
// ── 수정 모달 에디터 ──
document.getElementById('sem_mdToolbar').addEventListener('mousedown',e=>e.preventDefault());
document.getElementById('sem_text').addEventListener('input',e=>{
  const el=e.target; const raw=el.innerText.replace(/\r\n?/g,'\n').replace(/\n$/,'');
  el.dataset.raw=raw; el.classList.toggle('is-empty',!raw.trim());
  if(e.isComposing)return;
  clearTimeout(semRenderTimer);
  semRenderTimer=setTimeout(()=>ceRender(el),200);
  scDetectSlash(el,'sem_slashMenu');
});
document.getElementById('sem_text').addEventListener('compositionend',e=>{
  const el=e.target;
  const raw=el.innerText.replace(/\r\n?/g,'\n').replace(/\n$/,'');
  el.dataset.raw=raw; el.classList.toggle('is-empty',!raw.trim()); ceRender(el);
  scDetectSlash(el,'sem_slashMenu');
});
document.getElementById('sem_text').addEventListener('paste',e=>{
  e.preventDefault();
  const text=(e.clipboardData||window.clipboardData).getData('text/plain');
  const el=e.target, s=ceGetOffset(el);
  const raw=el.dataset.raw||el.innerText.replace(/\r\n?/g,'\n').replace(/\n$/,'');
  const newRaw=raw.slice(0,s)+text.replace(/\r\n?/g,'\n')+raw.slice(s);
  el.dataset.raw=newRaw; el.classList.toggle('is-empty',!newRaw.trim());
  el.innerHTML=newRaw.split('\n').map(ceRenderLine).join(''); ceSetOffset(el,s+text.length);
});
document.getElementById('sem_text').addEventListener('blur',()=>{
  const el=document.getElementById('sem_text'); const raw=el.dataset.raw||'';
  el.innerHTML=raw.trim()?renderMd(raw):'';
  el.classList.toggle('is-empty',!raw.trim());
  document.getElementById('sem_mdToolbar').style.display='none';
});
document.getElementById('sem_text').addEventListener('focus',()=>{
  const el=document.getElementById('sem_text'); const raw=el.dataset.raw||'';
  el.classList.remove('is-empty');
  el.innerHTML=raw?raw.split('\n').map(ceRenderLine).join(''):'';
  document.getElementById('sem_mdToolbar').style.display='';
  const r=document.createRange();r.selectNodeContents(el);r.collapse(false);
  const s=window.getSelection();s.removeAllRanges();s.addRange(r);
});
document.getElementById('sem_mdToolbar').onclick=e=>{
  const btn=e.target.closest('[data-semwrap],[data-semline]');if(!btn)return;
  const el=document.getElementById('sem_text');
  if(btn.dataset.semwrap){const parts=btn.dataset.semwrap.split('||');ceWrap(el,parts[0],parts[1]);}
  else if(btn.dataset.semline){ceLine(el,btn.dataset.semline);}
};
document.getElementById('sem_text').addEventListener('keydown',e=>{
  const el=e.target;
  if(scSlashActive){
    if(e.key==='Escape'){e.preventDefault();scCloseSlash();return;}
    if(e.key==='ArrowDown'){e.preventDefault();scSlashMove(1);return;}
    if(e.key==='ArrowUp'){e.preventDefault();scSlashMove(-1);return;}
    if(e.key==='Enter'){e.preventDefault();const menu=document.getElementById(scSlashMenuId);const items=menu?[...menu.querySelectorAll('.slash-item')]:[];if(items[scSlashIdx])scApplySlash(el,items[scSlashIdx].dataset.key);return;}
  }
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();ceWrap(el,'**','**');return;}
  if(mod&&e.key==='i'){e.preventDefault();ceWrap(el,'*','*');return;}
  if(e.key==='Enter'){
    e.preventDefault();
    const s=ceGetOffset(el); const raw=el.dataset.raw||'';
    const ls=raw.lastIndexOf('\n',s-1)+1;
    const m=raw.slice(ls,s).match(/^([-*+]|\d+\.)\s/);
    const pfx=m?m[0]:'';
    const newRaw=raw.slice(0,s)+'\n'+pfx+raw.slice(s);
    el.dataset.raw=newRaw; ceRender(el); ceSetOffset(el,s+1+pfx.length);
  }
});
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
function semResetSavedNote(){
  const sn=document.getElementById('savedNote');
  if(sn){sn.textContent='변경사항은 자동 저장됩니다';sn.style.color='';}
}
document.getElementById('scEditModal').addEventListener('click',e=>{if(e.target===document.getElementById('scEditModal'))semResetSavedNote();});
document.getElementById('sem_cancel').onclick=()=>{
  semImgData=null;
  semResetSavedNote();
  closeModal('scEditModal');
};
document.getElementById('sem_save').onclick=()=>{
  const s=state.scraps.find(x=>x.id===scModalEditId);
  if(!s){closeModal('scEditModal');return;}
  const title=document.getElementById('sem_title').value.trim();
  if(!title){document.getElementById('sem_err').textContent='제목을 입력해주세요.';return;}
  const type=document.querySelector('#sem_typeChips .sc-type-chip.on')?.dataset.type||s.type;
  const tagsRaw=document.getElementById('sem_tags').value;
  Object.assign(s,{
    title,type,
    raw:(document.getElementById('sem_text').dataset.raw||document.getElementById('sem_text').innerText||''),
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
