/* ============ v2: AI 상담 ============ */
function chatChips(){
  const next=state.profile.milestones.find(m=>m.date&&new Date(m.date)>new Date());
  const chip4=next?`${next.label} 준비 체크`:'다음 일정 확인';
  return ['지금 뭐부터 해야 해?','우리 실탄으로 전세 가능?','후보 매물 비교해줘',chip4];
}
function stateSnapshot(){
  const items=assetItems();
  const aLine=items.length?items.map(it=>`  · ${it.owner} ${it.name} ${comma(it.amount)}원 (${it.type}/${it.liquidity})`).join('\n'):'  (없음)';
  const props=state.properties.map(p=>`- ${p.name||'무명'} | ${p.status} | 보증금 ${p.deposit||'?'}억 | 전용 ${p.area||'?'}㎡ | ${p.loc||''}${p.aiScore!=null?` | AI ${p.aiScore}점`:''}`).join('\n')||'(없음)';
  const acts=state.actions.filter(x=>!x.done).map(x=>`- ${x.text}`).join('\n')||'(없음)';
  const ownerTotals=OWNERS.map(owner=>`${owner} ${won(sumByOwner(owner))}`).join('/');
  return `[자산] 즉시 동원 가능액 ${won(sumMobImmediate())}(=지금 집 자금 실투입 가능), 총 자산 ${won(sumAmount())}, 만기 포함 전체 동원 ${won(sumMob())}. 소유자별 ${ownerTotals}. 예비비 ${state.assets.reserve||0}만원.\n${aLine}\n메모:${state.assets.notes||'없음'}\n[매물]\n${props}\n[미완료 액션]\n${acts}`;
}
function profileLine(){
  const p=state.profile;
  const wedding=p.milestones.find(m=>m.label.includes('결혼'));
  const buy=p.milestones.find(m=>m.label.includes('매수'));
  return `${p.birthYear}년생 예비부부(${p.employment}, ${p.housing}, ${p.city} 거주${wedding?', '+wedding.date.replace(/-/g,'.')+' 결혼':''}${buy?', '+buy.date.slice(0,4)+' 매수 목표':''}). 조건: ${p.city}시 內 필수, 전용 ${p.maxArea}㎡ 이하 필수, 전세 보증금 목표 ${state.settings.targetDeposit}억, ${p.transport} 선호.`;
}
function chatSystem(){
  return `당신은 ${profileLine().replace('. 조건:',')의 내집마련 코치입니다. 한국어로 간결하고 실용적으로, 우선순위 액션 위주로 답하세요. 조건:')} 최신 규제·금리·시세는 web_search로 확인. 답변은 핵심 위주로 너무 길지 않게.\n[현재 데이터]\n${stateSnapshot()}`;
}
function renderChat(){
  const m=document.getElementById('msgs');
  const chips=document.getElementById('chatchips');
  chips.innerHTML=chatChips().map(c=>`<button>${esc(c)}</button>`).join('');
  chips.querySelectorAll('button').forEach(b=>b.onclick=()=>{document.getElementById('chatInput').value=b.textContent;sendChat();});
  const h=state.chatHistory||[];
  if(!h.length){ m.innerHTML=`<div class="chatempty">안녕하세요 👋 우리 자산·매물·액션을 보고 있어요.<br>아래 버튼을 누르거나 직접 물어보세요.</div>`; return; }
  m.innerHTML=h.map(x=>`<div class="msg ${x.role==='user'?'user':'ai'}${x.think?' think':''}">${esc(x.text)}</div>`).join('');
  m.scrollTop=m.scrollHeight;
}
async function sendChat(){
  const inp=document.getElementById('chatInput'); const t=inp.value.trim(); if(!t)return;
  inp.value='';
  state.chatHistory.push({role:'user',text:t});
  state.chatHistory.push({role:'assistant',text:'생각 중…',think:true});
  renderChat();
  const btn=document.getElementById('chatSend'); btn.disabled=true;
  try{
    const msgs=state.chatHistory.filter(x=>!x.think).map(x=>({role:x.role,content:x.text}));
    const out=await claudeAPI(msgs,[{type:"web_search_20250305",name:"web_search"}],chatSystem());
    state.chatHistory=state.chatHistory.filter(x=>!x.think);
    state.chatHistory.push({role:'assistant',text:out||'(응답이 비었어요)'});
  }catch(e){
    state.chatHistory=state.chatHistory.filter(x=>!x.think);
    const aiMsg=e.message==='AI_UNAVAILABLE'?'AI 크레딧이 부족해요. console.anthropic.com에서 충전 후 이용할 수 있어요.':'AI 응답을 받지 못했어요. 잠시 후 다시 시도해주세요.';
    state.chatHistory.push({role:'assistant',text:aiMsg});
  }
  btn.disabled=false; save(); renderChat();
}
document.getElementById('chatSend').onclick=sendChat;
document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat();});
