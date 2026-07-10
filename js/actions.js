/* ============ 액션 (전체) ============ */
let actSearchQuery='', actCategoryFilter='';
const ACT_CATS=['매물준비','계약'];
function renderCatChips(){
  const el=document.getElementById('act_cat_chips'); if(!el)return;
  const hasCats=state.actions.some(a=>ACT_CATS.includes(a.category));
  if(!hasCats){el.innerHTML='';return;}
  const all=['전체','일반',...ACT_CATS];
  el.innerHTML=all.map(c=>{
    const val=c==='전체'?'':c==='일반'?'__none__':c;
    const on=actCategoryFilter===val;
    return `<button class="sc-chip act-cat-chip${on?' on':''}" data-actcat="${val}">${esc(c)}</button>`;
  }).join('');
  el.querySelectorAll('[data-actcat]').forEach(b=>b.onclick=()=>{actCategoryFilter=b.dataset.actcat;renderCatChips();renderActions();});
}
function renderActions(){
  const aq=(document.getElementById('act_search')?.value||'').trim().toLowerCase();
  const sorted=[...state.actions].sort((a,b)=>(a.done-b.done)||(a.priority-b.priority));
  let live=sorted.filter(a=>!a.done);
  let done=sorted.filter(a=>a.done);
  if(actCategoryFilter==='__none__'){
    live=live.filter(a=>!a.category||a.category==='');
    done=done.filter(a=>!a.category||a.category==='');
  } else if(actCategoryFilter){
    live=live.filter(a=>a.category===actCategoryFilter);
    done=done.filter(a=>a.category===actCategoryFilter);
  }
  if(aq){ live=live.filter(a=>(a.text||'').toLowerCase().includes(aq)); done=done.filter(a=>(a.text||'').toLowerCase().includes(aq)); }
  const el=document.getElementById('act_list');
  if(!state.actions.length){
    el.innerHTML='<div class="empty"><div class="big">아직 액션이 없어요</div>아래에 할 일을 적어보세요.</div>';
    return;
  }
  let html='<div class="actfull">';
  if(live.length){
    html+=live.map((a,i)=>`
      <div class="actrow" data-done="0" data-id="${a.id}">
        <span class="rank tnum">${i+1}</span>
        <span class="box" data-actf-done="${a.id}">${CHECK}</span>
        <span class="atx">${esc(a.text)}${a.category?`<span class="act-cat-badge">${esc(a.category)}</span>`:''}</span>
        <button class="act-edit" data-actf-edit="${a.id}" title="수정" aria-label="수정">${ic('edit')}</button>
        <button class="star ${a.priority<=Math.min(...live.map(x=>x.priority))?'on':''}" data-actf-top="${a.id}" title="맨 위로" aria-label="맨 위로">${ic('star')}</button>
        <button class="xx" data-actf-del="${a.id}" aria-label="삭제">✕</button>
      </div>`).join('');
  } else {
    html+='<div class="empty"><div class="big">모든 액션 완료!</div>새 할 일을 추가하거나 AI 제안을 받아보세요.</div>';
  }
  if(done.length){
    html+=`<div class="done-section"><div class="done-head" id="act_doneToggle"><span class="arw">▾</span> 완료 ${done.length}개</div><div class="done-body">`;
    html+=done.map(a=>`
      <div class="actrow" data-done="1" data-id="${a.id}">
        <span class="rank tnum"></span>
        <span class="box" data-actf-done="${a.id}">${CHECK}</span>
        <span class="atx">${esc(a.text)}${a.category?`<span class="act-cat-badge">${esc(a.category)}</span>`:''}</span>
        <button class="act-edit" data-actf-edit="${a.id}" title="수정" aria-label="수정">${ic('edit')}</button>
        <button class="xx" data-actf-del="${a.id}" aria-label="삭제">✕</button>
      </div>`).join('');
    html+='</div></div>';
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-actf-done]').forEach(b=>b.onclick=()=>{
    const a=state.actions.find(x=>x.id===b.dataset.actfDone);
    if(a){a.done=!a.done;save();renderActions();renderTop3();}
  });
  el.querySelectorAll('[data-actf-top]').forEach(b=>b.onclick=()=>{
    const a=state.actions.find(x=>x.id===b.dataset.actfTop);
    if(a){const min=Math.min(...state.actions.map(x=>x.priority));a.priority=min-1;a.done=false;save();renderActions();renderTop3();}
  });
  el.querySelectorAll('[data-actf-del]').forEach(b=>b.onclick=()=>{
    if(!confirm('이 액션을 삭제할까요?'))return;
    state.actions=state.actions.filter(x=>x.id!==b.dataset.actfDel);save();renderActions();renderTop3();
  });
  el.querySelectorAll('[data-actf-edit]').forEach(b=>b.onclick=()=>{
    const a=state.actions.find(x=>x.id===b.dataset.actfEdit); if(!a)return;
    const row=b.closest('.actrow');
    const cats=ACT_CATS.map(c=>`<option value="${esc(c)}"${a.category===c?' selected':''}>${esc(c)}</option>`).join('');
    row.innerHTML=`
      <input class="act-edit-inp" value="${esc(a.text)}" style="flex:1;min-width:0;padding:4px 8px;border:1px solid var(--hairline);border-radius:6px;font-size:14px;">
      <select class="act-edit-cat" style="padding:4px 6px;border:1px solid var(--hairline);border-radius:6px;font-size:12px;">
        <option value=""${!a.category?' selected':''}>일반</option>${cats}
      </select>
      <button class="act-edit-ok" style="padding:4px 10px;background:var(--money);color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;">저장</button>
      <button class="act-edit-cancel" style="padding:4px 8px;background:none;border:1px solid var(--hairline);border-radius:6px;font-size:13px;cursor:pointer;">취소</button>`;
    const inp=row.querySelector('.act-edit-inp');
    const cat=row.querySelector('.act-edit-cat');
    inp.focus(); inp.select();
    const save_=()=>{
      const t=inp.value.trim(); if(!t){inp.focus();return;}
      a.text=t; a.category=cat.value;
      save(); renderActions(); renderTop3();
    };
    row.querySelector('.act-edit-ok').onclick=save_;
    row.querySelector('.act-edit-cancel').onclick=()=>{renderActions();};
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter')save_(); if(e.key==='Escape'){renderActions();} });
  });
  const dt=document.getElementById('act_doneToggle');
  if(dt) dt.onclick=()=>dt.parentElement.classList.toggle('collapsed');
  renderCatChips();
}
function addActionFull(){
  const inp=document.getElementById('act_input'); const t=inp.value.trim(); if(!t){inp.focus();return;}
  const cat=document.getElementById('act_catSel')?.value||'';
  const max=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
  state.actions.push({id:'a'+Date.now(),text:t,priority:max+1,done:false,category:cat});
  inp.value=''; save(); renderActions(); renderTop3();
}
document.getElementById('act_addBtn').onclick=addActionFull;
document.getElementById('act_search').addEventListener('input',e=>{actSearchQuery=e.target.value.trim();renderActions();});
document.getElementById('act_input').addEventListener('keydown',e=>{if(e.key==='Enter')addActionFull();});

document.getElementById('act_suggestBtn').onclick=async()=>{
  const btn=document.getElementById('act_suggestBtn');
  const box=document.getElementById('act_suggestions');
  btn.disabled=true; const old=btn.innerHTML; btn.textContent='생각 중…';
  box.innerHTML='';
  try{
    const out=await claudeAPI([{role:'user',content:
      `우리 현재 상황을 보고, 지금 해야 할 다음 액션 2~3개를 제안해줘. 설명·마크다운 금지, JSON 배열만.\n`+
      `형식: [{"text":"액션 내용(구체적으로, 20자 이내)"}]\n`+
      `이미 있는 액션과 겹치지 않게. 실용적이고 바로 실행 가능한 것 위주.\n\n`+
      `[현재 데이터]\n${stateSnapshot()}`}],
      [{type:'web_search_20250305',name:'web_search'}],
      `당신은 ${profileLine()} 내집마련 코치. 한국어. 최신 정보는 web_search로 확인.`);
    const arr=parseJSON(out);
    if(Array.isArray(arr)&&arr.length){
      box.innerHTML=arr.map(s=>`
        <div class="act-suggest-card">
          <span class="stx">💡 ${esc(s.text)}</span>
          <button class="btn-adopt" data-suggest="${esc(s.text)}">＋ 채택</button>
        </div>`).join('');
      box.querySelectorAll('[data-suggest]').forEach(b=>b.onclick=()=>{
        const max=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
        const cat=document.getElementById('act_catSel')?.value||'';
        state.actions.push({id:'a'+Date.now(),text:b.dataset.suggest,priority:max+1,done:false,category:cat});
        b.closest('.act-suggest-card').remove();
        save(); renderActions(); renderTop3();
      });
      btn.textContent='✓ 제안 완료';
    } else { btn.textContent='제안을 파싱하지 못했어요'; }
  }catch(e){ btn.textContent=e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 응답 실패'; }
  setTimeout(()=>{btn.disabled=false;btn.innerHTML=old;},2000);
};
