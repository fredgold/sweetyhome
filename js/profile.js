/* ============ 프로필 모달 ============ */
function renderProfileMilestones(){
  const box=document.getElementById('pf_milestones');
  const ms=state.profile.milestones;
  box.innerHTML=ms.map((m,i)=>`<div class="ms-row"><input class="ms-label" data-i="${i}" value="${esc(m.label)}" placeholder="이름"><input class="ms-date" data-i="${i}" type="date" value="${m.date||''}"><button class="ms-del" data-i="${i}" aria-label="마일스톤 삭제">✕</button></div>`).join('');
  box.querySelectorAll('.ms-del').forEach(b=>b.onclick=()=>{ms.splice(+b.dataset.i,1);renderProfileMilestones();});
}
let profileOwnersDraft=[];
function renderProfileOwners(){
  const box=document.getElementById('pf_owners');
  box.innerHTML=profileOwnersDraft.map((owner,i)=>`<div class="ms-row"><input class="pf-owner-name" data-i="${i}" value="${esc(owner)}" maxlength="20" placeholder="담당자 이름"><button class="ms-del" data-owner-del="${i}" aria-label="담당자 삭제">✕</button></div>`).join('');
  box.querySelectorAll('[data-owner-del]').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#pf_owners .pf-owner-name').forEach(input=>{profileOwnersDraft[+input.dataset.i]=input.value;});
    profileOwnersDraft.splice(+b.dataset.ownerDel,1);
    renderProfileOwners();
  });
}
function openProfile(){
  const p=state.profile;
  document.getElementById('pf_names').value=p.names||'';
  document.getElementById('pf_birthYear').value=p.birthYear||'';
  document.getElementById('pf_employment').value=p.employment||'';
  document.getElementById('pf_housing').value=p.housing||'';
  document.getElementById('pf_city').value=p.city||'';
  document.getElementById('pf_maxArea').value=p.maxArea||'';
  document.getElementById('pf_depositRange').value=p.depositRange||'';
  document.getElementById('pf_transport').value=p.transport||'';
  const commuters=state.settings.commuters;
  document.getElementById('pf_commuter0_name').value=commuters[0].name||'';
  document.getElementById('pf_commuter0_dest').value=commuters[0].dest||'';
  document.getElementById('pf_commuter1_name').value=commuters[1].name||'';
  document.getElementById('pf_commuter1_dest').value=commuters[1].dest||'';
  profileOwnersDraft=[...state.settings.owners];
  renderProfileOwners();
  renderProfileMilestones();
  openModal('profileModal');
}
document.getElementById('profileBtn').onclick=openProfile;
document.getElementById('pf_addMs').onclick=()=>{
  document.querySelectorAll('#pf_milestones .ms-row').forEach(row=>{
    const i=+row.querySelector('.ms-label').dataset.i;
    state.profile.milestones[i].label=row.querySelector('.ms-label').value.trim();
    state.profile.milestones[i].date=row.querySelector('.ms-date').value;
  });
  state.profile.milestones.push({label:'',date:''});
  renderProfileMilestones();
};
document.getElementById('pf_addOwner').onclick=()=>{
  document.querySelectorAll('#pf_owners .pf-owner-name').forEach(input=>{profileOwnersDraft[+input.dataset.i]=input.value;});
  profileOwnersDraft.push('');
  renderProfileOwners();
  document.querySelector('#pf_owners .ms-row:last-child input').focus();
};
document.getElementById('pf_save').onclick=()=>{
  const p=state.profile;
  p.names=document.getElementById('pf_names').value.trim()||p.names;
  p.birthYear=+document.getElementById('pf_birthYear').value||p.birthYear;
  p.employment=document.getElementById('pf_employment').value.trim()||p.employment;
  p.housing=document.getElementById('pf_housing').value.trim()||p.housing;
  p.city=document.getElementById('pf_city').value.trim()||p.city;
  p.maxArea=+document.getElementById('pf_maxArea').value||p.maxArea;
  p.depositRange=document.getElementById('pf_depositRange').value.trim()||p.depositRange;
  p.transport=document.getElementById('pf_transport').value.trim()||p.transport;
  const commuters=state.settings.commuters;
  commuters[0].name=document.getElementById('pf_commuter0_name').value.trim()||commuters[0].name;
  commuters[0].dest=document.getElementById('pf_commuter0_dest').value.trim()||commuters[0].dest;
  commuters[1].name=document.getElementById('pf_commuter1_name').value.trim()||commuters[1].name;
  commuters[1].dest=document.getElementById('pf_commuter1_dest').value.trim()||commuters[1].dest;
  const owners=[...new Set([...document.querySelectorAll('#pf_owners .pf-owner-name')].map(input=>input.value.trim()).filter(Boolean))];
  state.settings.owners=owners.length?owners:[...DEFAULT_OWNERS];
  syncOwners();
  document.querySelectorAll('#pf_milestones .ms-row').forEach(row=>{
    const i=+row.querySelector('.ms-label').dataset.i;
    p.milestones[i].label=row.querySelector('.ms-label').value.trim();
    p.milestones[i].date=row.querySelector('.ms-date').value;
  });
  p.milestones=p.milestones.filter(m=>m.label||m.date);
  save(); renderJourney(); renderAll();
  closeModal('profileModal');
  toast('저장했어요');
};

document.getElementById('exportBtn').onclick=()=>{
  document.getElementById('exportText').value=makeBackup();
  document.getElementById('exportOk').textContent='';
  openModal('exportModal');
};
document.getElementById('copyExport').onclick=async()=>{
  const ta=document.getElementById('exportText'); const ok=document.getElementById('exportOk');
  try{ await navigator.clipboard.writeText(ta.value); ok.textContent='✓ 복사됐어요. 안전한 곳에 붙여넣어 보관하세요.'; }
  catch(e){
    ta.focus(); ta.select();
    try{ document.execCommand('copy'); ok.textContent='✓ 복사됐어요. 안전한 곳에 붙여넣어 보관하세요.'; }
    catch(e2){ ok.textContent='위 칸을 전체 선택(Ctrl/Cmd+A) 후 복사(Ctrl/Cmd+C) 해주세요.'; }
  }
};
document.getElementById('importBtn').onclick=()=>{
  document.getElementById('importText').value='';
  document.getElementById('importOk').textContent='';
  openModal('importModal');
};
document.getElementById('doImport').onclick=()=>{
  const code=document.getElementById('importText').value;
  const ok=document.getElementById('importOk');
  const o=readBackup(code);
  if(!o){ ok.style.color='var(--s-drop)'; ok.textContent='백업 코드를 읽을 수 없어요. 코드 전체를 정확히 붙여넣었는지 확인해주세요.'; return; }
  if(o.kind==='full'){
    if(!confirm('지금 보드 내용을 백업본으로 전부 교체할까요?')) return;
    applyGuards(o.state);
    save(); renderAll();
    ok.style.color='var(--s-final)'; ok.textContent=`✓ 전체 보드를 복원했어요. (매물 ${state.properties.length}곳)`;
  } else {
    if(state.properties.length && !confirm(`현재 매물 ${state.properties.length}곳을 백업본(매물 ${o.properties.length}곳)으로 교체할까요?`)) return;
    state.properties=o.properties||[];
    state.properties.forEach(p=>{if(!p.checks)p.checks={};});
    if(o.prep)state.prep=o.prep; if(o.steps)state.steps=o.steps;
    save(); renderAll();
    ok.style.color='var(--s-final)'; ok.textContent=`✓ 매물 ${state.properties.length}곳을 복원했어요.`;
  }
  setTimeout(()=>closeModal('importModal'),1300);
};

/* 헤더 "⋯ 더보기" — 480px 이하에서 숨겨진 동기화칩·내보내기·가져오기를
   기존 .status-picker 플로팅 메뉴로 옮겼다가 닫으면 원래 자리로 되돌림 */
let _hMoreMenu=null, _hMoreHome=null, _hMoreHomeNext=null;
function closeHeaderMoreMenu(){
  if(!_hMoreMenu) return;
  [..._hMoreMenu.children].forEach(el=>_hMoreHome.insertBefore(el,_hMoreHomeNext));
  _hMoreMenu.remove(); _hMoreMenu=null;
}
function showHeaderMoreMenu(btn){
  if(_hMoreMenu){ closeHeaderMoreMenu(); return; }
  const ids=['.sync-wrap','#exportBtn','#importBtn'];
  const els=ids.map(sel=>document.querySelector(sel));
  _hMoreHome=els[0].parentElement;
  _hMoreHomeNext=els[0].nextSibling;
  const menu=document.createElement('div');
  menu.className='status-picker header-more-menu';
  els.forEach(el=>menu.appendChild(el));
  document.body.appendChild(menu);
  _hMoreMenu=menu;
  const rect=btn.getBoundingClientRect();
  menu.style.top=(rect.bottom+window.scrollY+4)+'px';
  menu.style.left=Math.max(8,Math.min(rect.left+window.scrollX, window.innerWidth-200))+'px';
  const close=ev=>{ if(!menu.contains(ev.target)&&ev.target!==btn){ closeHeaderMoreMenu(); document.removeEventListener('click',close,true); } };
  setTimeout(()=>document.addEventListener('click',close,true),0);
}
document.getElementById('headerMoreBtn').onclick=(e)=>showHeaderMoreMenu(e.currentTarget);
