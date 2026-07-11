# 스위티홈 — Claude Code 가이드

예비부부 내집마련 준비 보드. 자산·매물·액션·수집함 관리 + AI 상담.

---

## 스택

- **프론트엔드**: Vanilla JS (빌드 없음), `index.html` + `style.css` + `js/`
- **배포**: Vercel (정적 파일 + `api/` serverless functions)
- **스토리지**: Upstash Redis (`/api/state`) + localStorage fallback
- **인증**: PIN → `/api/login` → UUID Bearer token → `sessionStorage sh_token` (24h TTL)
- **지도**: 네이버 지도 JS API v3 (CDN) — 지오코딩은 `/api/geocode` 서버리스 프록시(네이버 Geocoding API)
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

---

## 핵심 원칙 (항상 적용, 어떤 작업에서도)

### 1. 보안 최우선
- 코드 작성·리뷰·답변 전에 XSS·인젝션·노출 위험 항상 먼저 점검.
- 취약점 발견 시 다른 작업보다 먼저 언급하고 수정 제안.
- 적용 범위: innerHTML·eval·URL 삽입·사용자 입력 처리·API 키 노출 등 모든 보안 접점.

### 2. 컨텍스트 과부하 방지
- 채팅 히스토리가 길어져 토큰 낭비 우려가 생기면 새 채팅 시작을 먼저 권고.
- 필요 시 핵심 상태를 HISTORY.md 또는 별도 파일에 저장 후 이월.

### 3. 코드 작성 후 자기 리뷰
- 구현 완료 후 반드시: (a) 보안 문제 없는지, (b) 불필요한 파일 Read가 없었는지, (c) 중복·과도한 코드가 없는지 점검.
- 사전에 계획을 먼저 세우고 코딩 시작. 계획 없이 바로 코딩 금지.

---

## 작업 규칙 (토큰 효율)

### Claude가 따르는 규칙

**세션 시작**
- 모든 작업·리뷰·커밋 전 `CLAUDE.md` → `AGENTS.md` → `HANDOFF.md` 순서로 반드시 읽고 시작. 전체 파일 스캔 금지.
- 문서 역할: `CLAUDE.md`=프로젝트 SSOT, `AGENTS.md`=다중 에이전트 실행 규칙, `HANDOFF.md`=최신 작업 상태·검증·남은 일.
- `HANDOFF.md`가 없으면 사람에게 알리고 현재 Git 상태와 진행 중인 작업을 확인한 뒤 진행.
- 세 문서가 충돌하면 `CLAUDE.md` → `AGENTS.md` → `HANDOFF.md` 순으로 따르고 사람(테디)에게 충돌을 알림.
- 기능 위치는 "파일 구조" + "주요 ID 레퍼런스" 표로 먼저 파악.
- 불확실할 때만 해당 파일 Read. 확실하면 바로 Edit.

**파일 읽기**
- 수정 대상 파일만 Read → Edit. cascade read(연관 파일 연달아 읽기) 금지.
- `index.html` 전체 읽기 금지 — DOM ID는 CLAUDE.md 참조, 필요 시 특정 줄만.
- `style.css` 전체 읽기 금지 — 기존 토큰(`--money`, `--hairline`, `--line9` 등) 재사용 전제.

**상태 스키마 변경**
- 새 필드 추가 시: `applyGuards()` 기본값 보정 + `state.js` 상단 JSDoc 동시 업데이트.
- 기존 필드명·단위 절대 변경 금지 (Redis 데이터 파괴).

**코드 작성**
- 기능 단위로 최소 파일 수정. 관련 없는 정리·리팩터 금지.
- 새 JS 파일 생성 금지 — 기존 13개 파일 구조 유지.
- 새 CSS 파일 생성 금지 — `style.css`에 추가.
- 주석 금지 (WHY가 명백하지 않으면). 함수명으로 의도 전달.

**커밋**
- 기능 단위 atomic 커밋. 보안 제약(PIN·금액·키 기록 금지) 준수.
- 커밋 메시지: `feat|fix|refactor|style: 한 줄 요약` 형식.

---

### 사용자가 요청할 때 효율적인 방식

| 비효율 | 효율 |
|--------|------|
| "수집함 좀 고쳐줘" | "수집함 카드에 태그 표시 추가 (`scraps-render.js`)" |
| 여러 기능을 하나의 긴 메시지로 | 파일 기준으로 묶어서 요청 |
| "전체적으로 리팩터해줘" | 구체적인 개선 목표 명시 |
| 코드 전체 붙여넣기 | 파일명 + 줄 번호로 위치 지정 |

**기능 → 파일 빠른 매핑**

| 작업 영역 | 수정 파일 |
|----------|-----------|
| 수집함 카드/목록/갤러리 | `scraps-render.js` |
| 수집함 입력폼/슬래시/편집모달 | `scraps-form.js` |
| 수집함 붙여넣기 임포트 | `scraps-import.js` |
| 매물 카드/폼/지도/AI평가 | `properties.js` |
| 자산 테이블/노트 | `assets.js` |
| 대시보드/탭 | `nav.js` |
| AI 채팅 | `ai.js` |
| 상태 스키마/저장 | `js/state.js` |
| 로그인/인증 | `auth.js` |
| 공통 유틸 | `utils.js` |
| 레이아웃/디자인 | `style.css` |
| HTML 구조 | `index.html` |
