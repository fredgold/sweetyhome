// ── 공통 유틸리티 ──
// 모든 모듈보다 먼저 로드됩니다.

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safeUrl(u){
  try{const url=new URL(u);if(!['http:','https:'].includes(url.protocol))return'';return url.href;}catch(e){return'';}
}
function toast(msg){
  let t=document.getElementById('appToast');
  if(!t){
    t=document.createElement('div');
    t.id='appToast';
    t.className='prop-toast';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(t._hideTimer);
  t._hideTimer=setTimeout(()=>t.classList.remove('show'),3500);
}
function nmapUrl(q){return 'https://map.naver.com/p/search/'+encodeURIComponent(q);}
function landUrl(q){return 'https://m.land.naver.com/search/result/'+encodeURIComponent(q);}
function stripLabelPrefix(s){return String(s||'').replace(/^(\s*\[[^\]]*\])+\s*/,'');} // "[G1] 가양6단지" → "가양6단지" (네이버지도 검색 정확도용)
function naverUrl(p){return 'https://map.naver.com/p/search/'+encodeURIComponent(stripLabelPrefix(p.name)+' '+(p.loc||''));}
function won(w){ // w in 원 → 억/만 표시
  w=Math.round(w||0); const neg=w<0?'-':''; w=Math.abs(w);
  const eok=Math.floor(w/100000000), man=Math.floor((w%100000000)/10000);
  if(eok&&man) return neg+eok+'억 '+man.toLocaleString()+'만';
  if(eok) return neg+eok+'억';
  if(man) return neg+man.toLocaleString()+'만';
  return neg+w.toLocaleString();
}
function comma(n){return Math.round(n||0).toLocaleString();}
function compressImage(file,cb){
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const MAX=600,w=img.width,h=img.height;
      const scale=Math.min(1,MAX/Math.max(w,h));
      const cv=document.createElement('canvas');
      cv.width=Math.round(w*scale); cv.height=Math.round(h*scale);
      cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
      cb(cv.toDataURL('image/jpeg',0.65));
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}
// ── Contenteditable 커서 유틸 ──
function _ceIsBlock(n){return n.nodeType===1&&/^(DIV|P|H[1-6]|LI|BLOCKQUOTE)$/.test(n.tagName);}
function ceGetOffset(el){
  const sel=window.getSelection();
  if(!sel||!sel.rangeCount)return 0;
  const range=sel.getRangeAt(0);
  if(!el.contains(range.startContainer)&&el!==range.startContainer)return 0;
  let chars=0,found=false;
  function walk(node,firstBlock){
    if(found)return;
    if(!firstBlock&&_ceIsBlock(node)){
      if(node===range.startContainer&&range.startOffset===0){found=true;return;}
      chars++;
    }
    if(node===range.startContainer&&node.nodeType!==1){chars+=range.startOffset;found=true;return;}
    if(node.nodeType===3){chars+=node.length;return;}
    if(node.nodeName==='BR'){chars++;return;}
    let f=true;
    for(const c of node.childNodes){walk(c,firstBlock&&f);f=false;if(found)return;}
    if(node===range.startContainer)found=true;
  }
  walk(el,true);
  return chars;
}
function ceSetOffset(el,offset){
  const sel=window.getSelection();const range=document.createRange();
  let chars=0,done=false;
  function walk(node,firstBlock){
    if(done)return;
    if(!firstBlock&&_ceIsBlock(node)){
      if(chars===offset){range.setStart(node,0);range.collapse(true);done=true;return;}
      chars++;
    }
    if(node.nodeType===3){
      if(chars+node.length>=offset){range.setStart(node,offset-chars);range.collapse(true);done=true;}
      else chars+=node.length;
      return;
    }
    if(node.nodeName==='BR'){
      if(chars===offset){const idx=[...node.parentNode.childNodes].indexOf(node);range.setStart(node.parentNode,idx);range.collapse(true);done=true;}
      else chars++;
      return;
    }
    let f=true;
    for(const c of node.childNodes){walk(c,firstBlock&&f);f=false;if(done)return;}
  }
  walk(el,true);
  if(!done){range.selectNodeContents(el);range.collapse(false);}
  sel.removeAllRanges();sel.addRange(range);
}
// ── 라이브 마크다운 렌더 (마커 보존) ──
function ceInline(text){
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g,'<strong><span class="mk">**</span>$1<span class="mk">**</span></strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,'<em><span class="mk">*</span>$1<span class="mk">*</span></em>')
    .replace(/~~(.+?)~~/g,'<del><span class="mk">~~</span>$1<span class="mk">~~</span></del>')
    .replace(/`(.+?)`/g,'<code><span class="mk">`</span>$1<span class="mk">`</span></code>');
}
function ceRenderLine(line){
  const hm=line.match(/^(#{1,3}) (.*)/);
  if(hm)return`<div class="md-h${hm[1].length}"><span class="mk">${esc(hm[1])} </span>${ceInline(hm[2])}</div>`;
  const lim=line.match(/^([-*+]) (.*)/);
  if(lim)return`<div class="md-li"><span class="mk">${lim[1]} </span>${ceInline(lim[2])}</div>`;
  const olm=line.match(/^(\d+\.) (.*)/);
  if(olm)return`<div class="md-ol"><span class="mk">${olm[1]} </span>${ceInline(olm[2])}</div>`;
  const qm=line.match(/^> (.*)/);
  if(qm)return`<div class="md-bq"><span class="mk">&gt; </span>${ceInline(qm[1])}</div>`;
  if(/^-{3,}$/.test(line.trim()))return'<div class="md-hr"><span class="mk">---</span></div>';
  if(!line)return'<div class="md-p"><br></div>';
  return`<div class="md-p">${ceInline(line)}</div>`;
}
function ceRender(el){
  const raw=el.dataset.raw!=null?el.dataset.raw:el.innerText.replace(/\r\n?/g,'\n').replace(/\n+$/,'');
  /* B-105: 직전 렌더와 raw가 같으면 innerHTML 재조립·커서 전체 순회를
     스킵 — 이 파이프라인은 B-103(에디터 교체)이 대체할 예정이라 구조는
     안 바꾸고 비용만 줄인다. focus/blur 등 ceRender를 거치지 않는
     수동 렌더 경로도 있어 이 캐시가 완벽히 최신은 아닐 수 있지만,
     불일치해도 "생략해야 할 렌더를 한 번 더 하는" 방향으로만 어긋나
     안전하다(반대 방향, 즉 필요한 렌더를 건너뛰는 경우는 없음 —
     불일치 시 항상 raw!==renderedRaw가 되어 렌더가 그대로 진행됨) */
  if(raw===el.dataset.renderedRaw) return;
  const isActive=document.activeElement===el;
  const off=isActive?ceGetOffset(el):0;
  el.innerHTML=raw?raw.split('\n').map(ceRenderLine).join(''):'';
  el.dataset.renderedRaw=raw;
  if(isActive&&raw)ceSetOffset(el,off);
}
/* B-105: 연속 키 입력 중 프레임당 1회로 묶어 렌더 — 매 keystroke마다
   ceGetOffset(전체 순회)+innerHTML 재조립+ceSetOffset(전체 순회)를
   반복하던 비용을 줄인다. 같은 엘리먼트에 대해 이미 예약된 프레임이
   있으면 취소하고 다시 예약(코얼레싱) — 마지막 raw 기준으로 딱 한 번만
   렌더된다. el에 직접 rAF id를 붙여 두 함수가 같은 엘리먼트를 공유 */
function ceRenderDebounced(el){
  if(el._ceRafId) cancelAnimationFrame(el._ceRafId);
  el._ceRafId=requestAnimationFrame(()=>{ el._ceRafId=null; ceRender(el); });
}
function ceCancelDebounced(el){
  if(el._ceRafId){ cancelAnimationFrame(el._ceRafId); el._ceRafId=null; }
}
/* B-107: B-105 회귀 핫픽스 — rAF로 렌더가 미뤄지는 동안 DOM(구)과
   dataset.raw(신)가 어긋난 상태에서 ceGetOffset으로 오프셋을 읽고
   그 오프셋으로 raw를 자르는 동기 경로들(Enter·ceWrap·ceLine·
   scApplySlash 등)이 잘못된 위치에 개행/마커를 삽입하던 문제.
   "raw를 읽어 오프셋 기준으로 자르는" 모든 동기 진입점의 첫 줄에서
   호출 — 예약된 렌더가 있으면 즉시(동기) 실행해 DOM을 raw와 다시
   맞춘 뒤에야 그 함수의 나머지 로직(ceGetOffset 등)이 진행된다.
   예약이 없으면(이미 최신) 그냥 통과 */
function ceFlushDebounced(el){
  if(el._ceRafId){ cancelAnimationFrame(el._ceRafId); el._ceRafId=null; ceRender(el); }
}
function ceWrap(el,open,close){
  /* B-107: ceFlushDebounced가 내부적으로 ceRender→innerHTML 재조립을
     하면 커서는 (offset 하나로) 복원되지만 "선택 범위"는 collapse
     돼버려 사라진다 — 선택한 텍스트를 먼저 읽어둔 뒤에 flush해야
     ceWrap이 감쌀 대상을 잃지 않는다(다른 ceGetOffset 호출부는 커서
     한 점만 필요해 이 문제가 없음, ceWrap만 특별 처리) */
  const sel=window.getSelection();
  const selected=sel.rangeCount?sel.getRangeAt(0).toString():'';
  const s=ceGetOffset(el);
  ceFlushDebounced(el);
  const raw=el.dataset.raw!=null?el.dataset.raw:el.innerText.replace(/\r\n?/g,'\n').replace(/\n+$/,'');
  const e=s+selected.length;
  const word=selected||'텍스트';
  el.dataset.raw=raw.slice(0,s)+open+word+close+raw.slice(e);
  ceRender(el); ceSetOffset(el,s+open.length+word.length+close.length);
}
function ceLine(el,prefix){
  ceFlushDebounced(el);
  const s=ceGetOffset(el);
  const raw=el.dataset.raw!=null?el.dataset.raw:el.innerText.replace(/\r\n?/g,'\n').replace(/\n+$/,'');
  const ls=raw.lastIndexOf('\n',s-1)+1;
  const le=raw.indexOf('\n',s);
  const line=raw.slice(ls,le===-1?undefined:le);
  const stripped=line.replace(/^(#{1,3}|[-*+]|\d+\.|>)\s/,'');
  const newLine=prefix+stripped;
  el.dataset.raw=raw.slice(0,ls)+newLine+(le===-1?'':raw.slice(le));
  ceRender(el); ceSetOffset(el,ls+newLine.length);
}
// ── 마크다운 렌더 ──
function renderMd(text){
  if(!text) return '';
  try{
    marked.setOptions({breaks:true,gfm:true});
    const html=marked.parse(text);
    return DOMPurify.sanitize(html,{USE_PROFILES:{html:true}});
  }catch(e){ return '<pre>'+esc(text)+'</pre>'; }
}
function mdWrap(ta,open,close){
  const s=ta.selectionStart, e=ta.selectionEnd;
  const sel=ta.value.slice(s,e)||'텍스트';
  ta.value=ta.value.slice(0,s)+open+sel+close+ta.value.slice(e);
  ta.selectionStart=s+open.length; ta.selectionEnd=s+open.length+sel.length;
  ta.focus(); autoResizeTa(ta);
}
function mdLine(ta,prefix){
  const s=ta.selectionStart;
  const ls=ta.value.lastIndexOf('\n',s-1)+1;
  ta.value=ta.value.slice(0,ls)+prefix+ta.value.slice(ls);
  ta.selectionStart=ta.selectionEnd=s+prefix.length;
  ta.focus(); autoResizeTa(ta);
}
function autoResizeTa(ta){
  ta.style.height='auto';
  ta.style.height=Math.min(ta.scrollHeight,400)+'px';
}
function parseJSON(t){try{return JSON.parse((t||'').replace(/```json|```/g,'').trim());}catch(e){return null;}}

/* B-12 버그3: 모달/시트/⋯메뉴가 열려 있는 동안 뒤 배경(주로 매물탭 리스트뷰의 페이지
   스크롤)이 같이 움직이는 문제 — body를 position:fixed로 고정해 잠금(iOS Safari에서
   overflow:hidden만으론 러버밴드 스크롤이 안 막히는 문제를 우회하는 표준 기법).
   카운터를 둬서 모달 위에 또 다른 모달/메뉴가 겹쳐 열려도(예: 상세시트 안에서 메뉴)
   먼저 열린 것보다 먼저 닫혀도 잠금이 풀리지 않게 함 — 마지막 하나가 닫힐 때만 해제.
   openModal/closeModal(모든 .modal 공용) + openForm/closeForm(매물추가 폼시트) +
   showMoreMenu/closeMoreMenu(⋯ 더보기, properties.js)가 공유해서 씀 */
let _scrollLockCount=0, _scrollLockY=0;
function lockBodyScroll(){
  if(_scrollLockCount===0){
    _scrollLockY=window.scrollY;
    document.body.style.position='fixed';
    document.body.style.top='-'+_scrollLockY+'px';
    document.body.style.left='0';
    document.body.style.right='0';
  }
  _scrollLockCount++;
}
function unlockBodyScroll(){
  _scrollLockCount=Math.max(0,_scrollLockCount-1);
  if(_scrollLockCount===0){
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.left='';
    document.body.style.right='';
    window.scrollTo(0,_scrollLockY);
  }
}
function openModal(id){document.getElementById(id).classList.add('open');lockBodyScroll();}
function closeModal(id){document.getElementById(id).classList.remove('open');unlockBodyScroll();}

/* ── 금액 단위 파싱 (억 숫자로 통일) ── */
function parseEok(text){
  if(text==null)return null;
  const t=String(text).replace(/[,\s]/g,'').trim();
  if(!t||t==='-'||t==='—'||t==='--')return null;
  // 범위 a~b → 평균
  const rm=t.match(/^(.+)[~–](.+)$/);
  if(rm){const a=parseEok(rm[1]),b=parseEok(rm[2]);if(a!=null&&b!=null)return+((a+b)/2).toFixed(2);}
  // N억M천 (예: 3억3천 → 3.3)
  const eokc=t.match(/^(\d+(?:\.\d+)?)억(\d+)천/);
  if(eokc)return+(parseFloat(eokc[1])+parseInt(eokc[2])/10).toFixed(2);
  // N억M만 (예: 3억3000만 → 3.3)
  const eokm=t.match(/^(\d+(?:\.\d+)?)억(\d+)만/);
  if(eokm)return+(parseFloat(eokm[1])+parseInt(eokm[2])/10000).toFixed(4);
  // N억 (예: 3억, 3.3억)
  const eok=t.match(/^(\d+(?:\.\d+)?)억$/);
  if(eok)return parseFloat(eok[1]);
  // N만원/만 (예: 33000만원 → 3.3)
  const man=t.match(/^(\d+(?:\.\d+)?)만원?$/);
  if(man)return+(parseFloat(man[1])/10000).toFixed(4);
  // 맨숫자 안전망
  const n=parseFloat(t);
  if(isNaN(n))return null;
  if(n>=1000)return+(n/10000).toFixed(4); // 만원 단위
  if(n<100)return n;                       // 억 단위
  return null;                             // 100~999 애매 → null
}

/* ── B-18: 등급 컷 단일 소스 (면적·세대수·대단지 자동판정 기준) ──
   state.js(applyGuards 마이그레이션)와 properties.js(렌더) 양쪽에서 공유.
   utils.js가 두 파일보다 먼저 로드되므로 여기 둠. grades 인자를 안 주거나
   일부 키가 비어 있으면 이 기본값(= 과거 하드코딩 리터럴과 동일)으로
   폴백해 등급 판정 결과가 항상 이전과 같게 유지된다 */
const GRADE_DEFAULTS={area:[85,60],households:[1000,500,300,150],bigComplex:500};
function calcAreaGrade(areaM2,grades){
  if(areaM2==null||isNaN(areaM2))return'';
  const [g1,g2]=(grades&&grades.area)||GRADE_DEFAULTS.area;
  const v=+areaM2;
  if(v>=g1)return g1+'㎡+';
  if(v>=g2)return g2+'~'+(g1-1)+'㎡';
  return(g2-1)+'㎡ 이하';
}
function calcHouseholdGrade(n,grades){
  if(n==null)return'';
  const v=parseInt(n); if(isNaN(v))return'';
  const [h1,h2,h3,h4]=(grades&&grades.households)||GRADE_DEFAULTS.households;
  if(v>=h1)return h1+'세대+';
  if(v>=h2)return h2+'세대+';
  if(v>=h3)return h3+'세대+';
  if(v>=h4)return'소규모조건부';
  return'소규모주의';
}
