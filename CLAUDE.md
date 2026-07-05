# 스위티홈 — Claude Code 가이드

예비부부 내집마련 준비 보드. 자산·매물·액션·수집함 관리 + AI 상담.

---

## 스택

- **프론트엔드**: Vanilla JS (빌드 없음), `index.html` + `style.css` + `js/`
- **배포**: Vercel (정적 파일 + `api/` serverless functions)
- **스토리지**: Upstash Redis (`/api/state`) + localStorage fallback
- **인증**: PIN → `/api/login` → UUID Bearer token → `sessionStorage sh_token` (24h TTL)
- **지도**: Leaflet.js (CDN)
- **마크다운**: marked.js v9 (CDN, `renderMd()` in utils.js)
- **AI**: Anthropic Claude API (`/api/messages` 서버리스 프록시)
- **Redis 키**: `'sweetyhome'` — 절대 변경 금지

---

## 파일 구조

```
index.html              HTML 구조 전용 (~670줄)
style.css               CSS 전체 (~700줄)
api/
  login.js              PIN 검증 → Bearer token 발급
  state.js              Redis GET/POST (state 저장·불러오기)
  messages.js           Claude API 프록시 (AI 상담)
  health.js             AI 가용 여부 확인
js/
  utils.js              공통 유틸 (esc, renderMd, mdWrap, compressImage, won, comma, openModal 등)
  auth.js               로그인·로그아웃 (getToken, authHeaders, unlockApp, tryLogin)
  state.js              상수·기본값·applyGuards·load·save·sync (스키마 주석 포함)
  nav.js                탭 전환 (switchPanel) + 대시보드 렌더
  actions.js            액션 목록 렌더·추가·완료
  scraps-form.js        수집함 상수(SC_*)·add form·slash commands·edit modal
  scraps-render.js      renderScraps (list/gallery)·filter/sort/search 핸들러
  scraps-import.js      붙여넣기 임포트 파서·modal + 규제·뉴스
  assets.js             자산 테이블 렌더·편집·노트
  properties.js         매물 폼·카드·지도·AI 평가·가중치·내보내기
  profile.js            프로필 모달·마일스톤
  ai.js                 claudeAPI()·AI 채팅 UI
  boot.js               renderAll() + load() 호출 (최후 로드)
```

**로드 순서**: utils → auth → state → nav → actions → scraps-form → scraps-render → scraps-import → assets → properties → profile → ai → boot

---

## 보안 제약 (반드시 준수)

- `SWEETYHOME_PIN`은 코드·문서·주석·커밋메시지·로그 어디에도 절대 기록 금지
- 금액·PIN·API 키 하드코딩 금지 — 시크릿은 Vercel 환경변수만
- 실제 금액 데이터를 코드 시드로 삽입 금지 (구조·수식만 참고)

---

## 상태 스키마 요약

`js/state.js` 상단 주석에 전체 스키마 기록됨. 핵심:

```
state.scraps[]   — SC_TYPE: subscription|jeonse|sale|area|policy|review|note|ai_log
                   SC_STATUS: new|review|interested|hold|promoted|dropped
                   SC_PROPLESS: new Set(['note','ai_log']) → 가격·면적·일정 필드 숨김
state.properties[] — deposit(억), area(㎡), households, img(base64 JPEG)
state.assets.items[] — amount/mobilizable 단위: 원
```

`applyGuards(raw)` : 새 필드 추가 시 반드시 여기서 기본값 보정 → 기존 데이터 절대 깨지지 않음

---

## 핵심 패턴

**저장**: `save()` → localStorage 즉시 + Redis 800ms 디바운스

**이미지 압축**: `compressImage(file, cb)` → max 600px, JPEG 0.65 → base64 저장

**마크다운**: `renderMd(text)` (marked.js v9) — XSS `<script>` 태그 제거 포함

**슬래시 커맨드**: `sc_text` 줄 처음 `/` 입력 → `scDetectSlash()` → `scShowSlash()` → 방향키·Enter 선택

**모달**: `openModal(id)` / `closeModal(id)` — `.modal` 엘리먼트에 `.open` 클래스 토글

**갤러리 뷰**: `scViewMode='list'|'gallery'` → `renderScraps()` 분기

---

## 주요 ID 레퍼런스

| 영역 | 핵심 DOM ID |
|------|------------|
| 수집함 add form | `sc_form`, `sc_text`, `sc_mdSplit`, `sc_slashMenu` |
| 수집함 edit modal | `scEditModal`, `sem_text`, `sem_title` |
| 수집함 카드 영역 | `sc_cards` |
| 매물 form | `form`, `f_name`, `f_deposit`, `f_area`, `f_households` |
| 자산 노트 | `a_notes`, `an_mdPreview` |
| AI 채팅 | `msgs`, `chatInput`, `chatSend` |

---

## 개발 시 주의사항

- `scraps-form.js`가 먼저 로드되므로 SC_* 상수·state 변수는 여기 선언
- `renderScraps()`는 `scraps-render.js`에 있지만, form 핸들러에서도 호출 가능 (로드 후 실행)
- CSS는 `style.css` 하나. 새 CSS 변수는 기존 `--money`, `--line9`, `--hairline` 등 디자인 토큰 활용
- AI 기능: 현재 크레딧 소진 시 `aiAvailable=false` → 버튼 `disabled` 처리됨, 코드는 보존
- 붙여넣기 임포트 우선순위: frontmatter(`---`) > 마크다운 표(`|`) > `key:val` 블록 > 자유 텍스트
