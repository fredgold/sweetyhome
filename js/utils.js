// ── 공통 유틸리티 ──
// 모든 모듈보다 먼저 로드됩니다.

function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function gUrl(q){return 'https://www.google.com/search?q='+encodeURIComponent(q);}
function nmapUrl(q){return 'https://map.naver.com/p/search/'+encodeURIComponent(q);}
function landUrl(q){return 'https://m.land.naver.com/search/result/'+encodeURIComponent(q);}
function naverUrl(p){return 'https://map.naver.com/p/search/'+encodeURIComponent((p.name||'')+' '+(p.loc||''));}
function siteUrl(site,q){
  q=(q||'').trim();
  if(site==='naver') return 'https://map.naver.com/p/search/'+encodeURIComponent(q);
  if(site==='land')  return 'https://m.land.naver.com/search/result/'+encodeURIComponent(q);
  if(site==='hogang')return 'https://hogangnono.com/search/'+encodeURIComponent(q);
  if(site==='rt')    return 'https://rt.molit.go.kr/';
  return 'https://map.naver.com/p/search/'+encodeURIComponent(q);
}
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
// ── 마크다운 렌더 ──
function renderMd(text){
  if(!text) return '';
  try{
    marked.setOptions({breaks:true,gfm:true});
    const html=marked.parse(text);
    return html.replace(/<script[\s\S]*?<\/script>/gi,'');
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
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
