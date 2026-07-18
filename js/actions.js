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
function actOwnerLabel(owner){return owner&&!OWNERS.includes(owner)?`(이전: ${owner})`:owner;}
function syncActOwnerSelect(){
  const sel=document.getElementById('act_ownerSel'); if(!sel) return;
  const cur=sel.value;
  sel.innerHTML='<option value="">담당 미지정</option>'+OWNERS.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('');
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
}
/* B-30: due는 <input type="date">라 보통 빈 값이거나 유효한 ISO 날짜지만,
   혹시 모를 손상된 값(예: 수동 JSON 편집)에 대비해 렌더 전 형식 가드 */
function actDueValid(due){
  if(!due) return false;
  const d=new Date(due);
  return !isNaN(d.getTime());
}
/* B-30: nav.js의 dday()는 "YYYY-MM-DD"를 new Date(t)로 파싱하는데, 이는 스펙상
   UTC 자정으로 해석돼(로컬 자정과 시차만큼 어긋남 — 한국 시간대 KST=UTC+9라
   매일 어긋남) 마감 당일·경계 부근에서 "지남" 판정이 틀릴 수 있음(실측으로
   발견). nav.js는 무접촉 대상이라 고치는 대신, 연·월·일을 분해해 3-인자
   Date 생성자(로컬 자정으로 확정 해석됨)로 직접 조립해 이 함수만 정확하게 함 */
function actDaysUntilDue(due){
  const [y,m,d]=due.split('-').map(Number);
  const dueLocal=new Date(y,m-1,d);
  const today=new Date(); today.setHours(0,0,0,0);
  return Math.round((dueLocal-today)/86400000);
}
function actDueBadge(a){
  if(!actDueValid(a.due)) return '';
  const diff=actDaysUntilDue(a.due);
  const label=diff>=0?'D-'+diff:'D+'+(-diff);
  const overdue=!a.done && diff<0;
  return `<span class="act-due-badge${overdue?' overdue':''}" title="${esc(a.due)}">${esc(label)}</span>`;
}
function renderActions(){
  syncActOwnerSelect();
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
        <span class="atx">${esc(a.text)}${a.category?`<span class="act-cat-badge">${esc(a.category)}</span>`:''}${a.assignee?`<span class="act-cat-badge">${esc(actOwnerLabel(a.assignee))}</span>`:''}${actDueBadge(a)}</span>
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
        <span class="atx">${esc(a.text)}${a.category?`<span class="act-cat-badge">${esc(a.category)}</span>`:''}${a.assignee?`<span class="act-cat-badge">${esc(actOwnerLabel(a.assignee))}</span>`:''}${actDueBadge(a)}</span>
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
    const legacyOwner=a.assignee&&!OWNERS.includes(a.assignee)?`<option value="${esc(a.assignee)}" selected>${esc(actOwnerLabel(a.assignee))}</option>`:'';
    const owners=legacyOwner+OWNERS.map(o=>`<option value="${esc(o)}"${a.assignee===o?' selected':''}>${esc(o)}</option>`).join('');
    row.innerHTML=`
      <input class="act-edit-inp" value="${esc(a.text)}" style="flex:1;min-width:0;padding:4px 8px;border:1px solid var(--hairline);border-radius:6px;font-size:14px;">
      <select class="act-edit-cat" style="padding:4px 6px;border:1px solid var(--hairline);border-radius:6px;font-size:12px;">
        <option value=""${!a.category?' selected':''}>일반</option>${cats}
      </select>
      <select class="act-edit-owner" style="padding:4px 6px;border:1px solid var(--hairline);border-radius:6px;font-size:12px;">
        <option value=""${!a.assignee?' selected':''}>담당 미지정</option>${owners}
      </select>
      <input type="date" class="act-edit-due" value="${actDueValid(a.due)?esc(a.due):''}" style="padding:4px 6px;border:1px solid var(--hairline);border-radius:6px;font-size:12px;">
      <button class="act-edit-ok" style="padding:4px 10px;background:var(--money);color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;">저장</button>
      <button class="act-edit-cancel" style="padding:4px 8px;background:none;border:1px solid var(--hairline);border-radius:6px;font-size:13px;cursor:pointer;">취소</button>`;
    const inp=row.querySelector('.act-edit-inp');
    const cat=row.querySelector('.act-edit-cat');
    const owner=row.querySelector('.act-edit-owner');
    const due=row.querySelector('.act-edit-due');
    inp.focus(); inp.select();
    const save_=()=>{
      const t=inp.value.trim(); if(!t){inp.focus();return;}
      a.text=t; a.category=cat.value; a.assignee=owner.value; a.due=due.value;
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
  const owner=document.getElementById('act_ownerSel')?.value||'';
  const due=document.getElementById('act_dueInp')?.value||'';
  const max=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
  state.actions.push({id:'a'+Date.now(),text:t,priority:max+1,done:false,category:cat,assignee:owner,due:actDueValid(due)?due:''});
  inp.value=''; save(); renderActions(); renderTop3();
  toast('추가했어요');
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
        state.actions.push({id:'a'+Date.now(),text:b.dataset.suggest,priority:max+1,done:false,category:cat,assignee:'',due:''});
        b.closest('.act-suggest-card').remove();
        save(); renderActions(); renderTop3();
      });
      btn.textContent='✓ 제안 완료';
    } else { btn.textContent='제안을 파싱하지 못했어요'; }
  }catch(e){ btn.textContent=e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 응답 실패'; }
  setTimeout(()=>{btn.disabled=false;btn.innerHTML=old;},2000);
};
