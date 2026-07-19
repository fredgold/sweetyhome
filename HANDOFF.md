# HANDOFF — B-122 완료 (2026-07-19) 지침 강화 — 확립 원칙 명문화

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: CLAUDE.md/AGENTS.md에 확립 원칙 8개 명문화 (코드 무변경)

```
d530796 docs: 지침 강화 — 확립 원칙 CLAUDE.md/AGENTS.md 명문화 (B-122)
```

B-41(임장 노트)보다 먼저 발급된 문서 전용 지시. 최근 세션들에서
이미 실무로 확립됐지만 문서화되지 않았던 원칙 8개를 CLAUDE.md 4개+
AGENTS.md 4개로 추가·보강만 함(기존 구조·규칙 삭제 없음, 1커밋).

**CLAUDE.md 추가 4건**:
1. `## UI/레이아웃 정책` 신설 — 전 탭 전체폭 프레임+탭별 폭 흡수
   장치(매물=지도·액션=그룹 칼럼·수집함=카드 그리드·자산=2구역·
   대시=콤팩트 행, 2026-07-19 확정) 명문화, 중앙 고정폭 신설 금지.
2. 같은 섹션에 접기 지양 원칙(2026-07-18 확정) — 명시적 버튼·모드
   전환 원칙, 말줄임은 접기와 구분해 허용으로 명시.
3. `## 핵심 패턴`에 **에디터(Tiptap) 표준** 항목 추가 —
   `loadTiptapMods()`+`buildListBackspaceFix`+`buildTiptapPlaceholder`
   +로드 실패 폴백(`showEditorFallbackNote`)+마크다운 저장/renderMd
   읽기 패턴. 현재 6필드(자산 노트 1·수집함 2·매물 메모 3) 전부
   적용 완료됨을 전례로 명시 — 실코드 대조로 정확히 6곳(properties.js
   3+assets.js 1+scraps-form.js 2) 확인 후 기입.
4. 파일 구조 표의 `style.css` 줄수를 B-121 CSS 정리 이후 실측치로
   재정정(~1,510→~1,460줄, `index.html`은 무변경이라 유지).

**AGENTS.md 추가 4건**(`## 검증 표준` 신설):
5. 실기기 관문 — 한글 IME·safe-area·실키보드·PWA PTR 등 자동화
   한계 항목은 "사용자 실기기 확인"을 완료 조건으로 HANDOFF 명시
   (B-31 인수 사례 근거).
6. 렌더 타이밍 변경 시 "지연 중 동기 상호작용" 케이스 검증 필수 —
   `utils.js`의 `ceFlushDebounced()` 패턴 참고(B-107 회귀 교훈).
7. CSS 변수 도입·폐기 시 소비자 전수 grep 확인 — B-121에서 발견한
   `--nav-h`/`--topbar-h`/`--overlay-top` 무소비 변수 교훈.
8. 파일 락 프로토콜 명문화 — 착수·커밋 직전 `git status`, 본인
   파일만 명시적 `git add`, 상대 미커밋 변경 무접촉·무스테이징
   (B-84·B-118·B-31 실제 적용 사례 근거).

**검증**: 추가 서술에 인용한 함수명·파일명·수치를 실코드로 전수
재확인 — `ceFlushDebounced`(`utils.js:157`), `showEditorFallbackNote`
(`utils.js:463`) 실존 확인, `style.css` 1,462줄 실측, `index.html`
1,042줄 실측 무변경, 6필드 호출부(`buildListBackspaceFix(mods)`)
grep으로 properties.js 3+assets.js 1+scraps-form.js 2=6 정확히 일치
확인. `git diff` 전체 재검토로 삭제 없이 추가·수치정정만 있음을
확인(AGENTS.md +7줄, CLAUDE.md +11/-1줄).

- **B-122 완료·push 완료**(`d530796`).
- **다음**: 기발급 지시서대로 B-41(임장 노트) 착수 — 단,
  BACKLOG.md상 "착수 전 커맨드센터가 B-27-lite 안전체크 입력 UI와
  중복 검토 후 스펙 확정" 전제 미충족 확인됨(사용자 몫).

---

# 이전 핸드오프 — B-120+B-121 완료 (2026-07-19) 감사 후속: 문서 로테이션+소형 정리

## 최신 작업: B-119 감사 후속 — HANDOFF 로테이션·CLAUDE.md 정정·소형 정리 3건

```
32dc48f docs: HANDOFF.md 로테이션 — 최신 3개만 유지 (B-120)
4e7238b docs: CLAUDE.md 파일 규모 서술 갱신 (B-120)
b1bf51b refactor: 감사 소형 정리 묶음 (B-121)
```

B-119 감사 보고(`f6a017c`)에서 사용자가 전건 승인한 후속 작업.
손 B 부재로 파일 락 제약 없이 진행. 커밋 3개로 분리.

**커밋① HANDOFF.md 로테이션**: 47개 엔트리·2,162줄(B-84까지 소급)을
최신 3개(당시 B-31/B-118/B-114)만 남기고 절삭, 최상단에 로테이션
규칙 명시. 절삭분은 git 이력·`HISTORY.md`에 그대로 남아있어 정보
손실 아님(B-119가 샘플 대조로 중복 확인함).

**커밋② CLAUDE.md 서술 갱신**: `index.html` "~670줄"→실제 1,042줄,
`style.css` "~700줄"→실제 1,509줄로 정정. 구조 개편 없이 수치만.

**커밋③ 감사 소형 정리**(`properties.js`+`utils.js`+`nav.js`+
`style.css`+`CLAUDE.md`):
- `properties.js`의 `--nav-h`/`--topbar-h`/`--overlay-top` 계산
  코드(생산 함수 2개+스크롤 리스너+호출 5곳) 삭제 — B-53(`13a4b37`)
  이후 `style.css` 소비처가 0건이었음을 삭제 전 재확인(grep). 매
  스크롤 프레임마다 발생하던 `getBoundingClientRect`/
  `getComputedStyle`/`setProperty` 호출이 사라짐(성능 개선,
  시각적 변화 없음 — 애초에 아무 CSS도 이 값을 안 읽었으므로).
- `claudeAPI`+`aiAvailable`+`aiUnavailableMsg`+`updateAiButtons`를
  `properties.js`(로드순서 10번째)에서 `utils.js`(1번째)로 이관.
  `actions.js`/`assets.js`/`scraps-form.js`/`scraps-import.js`가
  `properties.js`보다 먼저 로드되면서도 `claudeAPI`를 참조하던
  역방향 결합을 해소. `CLAUDE.md`의 `ai.js` 서술도 함께 정정
  (claudeAPI 실제 위치가 ai.js가 아니었던 기존 오기까지 바로잡음).
- 고아 함수 `assetTotal()`(`nav.js`, 정의 외 참조 0건) 삭제.
- 미사용 CSS 셀렉터 25개 삭제 — 삭제 직전 각각 `index.html`+
  `js/*.js`+`mockups/`까지 재검증(따옴표/경계 포함 정밀 grep,
  동적 클래스 조합 오탐 없음 확인). `.side`/`.scard`/`.task`
  (+`.box`/`.tx`)/`.arow`/`.atotal`/`.c-top-left`/`.og-info`/
  `.og-title`/`.og-desc`/`.split-placeholder`/`.slash-desc`/
  `.slash-none`/`.pam-*`(5개)/`.c-line`/`.atab.soon` 계열.
- **레거시 `state.properties[]` CRUD 23곳·마이그레이션 프리뷰
  죽은 코드(~160줄)는 지시대로 무접촉** — B-05 몫.
- **`properties.js` 분할은 이번에 손대지 않음** — B-05 완료 후
  재평가 확정 사항(사용자 결정, 2026-07-19).

**검증**: `node --check` 전체 13개 js 파일 통과. `style.css` 중괄호
balance(1005/1005) 확인. Playwright(로컬 Node UTF-8 정적 서버 —
Python `http.server`는 Content-Type charset 누락으로 한글 정규식이
깨져 오탐 발생하는 걸 발견해 자체 Node 서버로 교체, `window.naver`
최소 스텁, marked/DOMPurify/Tiptap CDN 스텁) 데스크톱 1440×900+
모바일 390×844 양쪽에서 게스트 로그인 후 5개 탭(대시/자산/매물/
액션/수집함) 전환+스크롤 실행 — **콘솔 에러 0건**(파비콘 404 2건은
테스트 서버 자체의 정적 경로 처리 차이일 뿐 실제 파일 존재, 코드
무관). `typeof claudeAPI==='function'` 양쪽 뷰포트 확인(참조
오류 없음, 이관 성공). `typeof assetTotal==='undefined'`로 완전
제거 확인. `--nav-h` computed value가 빈 문자열로 소비처 0 재확인.

- **B-120+B-121 완료. 커밋 3개(`32dc48f`/`4e7238b`/`b1bf51b`)**.
- **다음**: 사용자 별도 지시 대기. B-05(레거시 완전 삭제, 손 B
  복귀 후) 착수 시 이번에 무접촉한 23곳+~160줄이 그 대상.

---

# 이전 핸드오프 — B-31 완료 (2026-07-19) ⚠️ 손 B 구현 → 손 A 인수 마무리

## 최신 작업: 모바일 하단 탭바

```
378d0b5 feat: 모바일 하단 탭바 (B-31)
```

**인계 경위(손 B 복귀 시 필독)**: B-31은 **손 B가 구현+자체 검증까지
마쳤으나 실행 환경 제약으로 커밋 전에 중단**된 작업이다. 손 B가
7/25까지 부재 상태가 되면서, 커맨드센터 승인 하에 **예외적으로
손 A가 작업 트리의 미커밋 변경(`index.html`+`js/nav.js`+
`style.css`)을 그대로 인수해 재검증·커밋·push만 수행**했다. `git
stash`를 쓰지 않고 작업 트리를 그대로 이어받았다. **코드 자체는
100% 손 B 원작업물이며, 손 A는 아래 재검증만 수행하고 로직을
임의로 수정하지 않았다** — 재검증 결과 문제를 하나도 발견하지
못해 실제 코드 수정은 0줄이었다(아래 "인수 검증 결과" 참고).

### 구현 개요(diff 리뷰로 파악한 내용)

`index.html`(+1줄, viewport meta에 `viewport-fit=cover` 추가)+
`js/nav.js`(+91줄)+`style.css`(+119/-9줄). 새 DOM을 추가하지 않고
**기존 `.apptabs`(5탭)·`#headerMoreBtn`을 모바일에서 재배치**하는
방식 — B-53 단일 topbar 인프라가 이미 있어 비용이 낮아졌다는
게 앞선 발급 사유였는데, 실제로 그 판단이 맞았다.

- **5탭+safe-area**: `viewport-fit=cover`가 있어야 `env(safe-area-
  inset-*)`가 0이 아닌 실제 값을 반환한다(iOS 필수 전제조건).
  `.apptabs`를 `position:fixed;bottom:0`로 옮기고 5칼럼 그리드로
  배치, 좌우/하단 패딩에 전부 `env(safe-area-inset-*)`를 반영했다.
- **`--app-bottom-h` 앱쉘 연동**: 새 CSS 변수(기본 `calc(58px +
  safe-area-inset-bottom)`, 데스크톱은 `0px`)를 만들어 5개 패널의
  높이·매물탭 각종 플로팅 버튼(추가 FAB·현위치·토스트)의 위치·
  매물 추가 폼 시트의 `bottom` 전부가 이 변수 하나를 참조하게
  했다 — 탭바 높이가 바뀌어도 한 곳만 고치면 되는 단일 소스 설계.
- **상단 ⋯더보기 수납**: 기존 `#headerMoreBtn`(이미 480px 미만
  전용으로 존재하던 버튼)을 899.98px 미만으로 임계값을 넓히고,
  프로필/내보내기/가져오기/잠금 4개 버튼을 실제 DOM 재배치(복제
  아님)로 드롭다운에 넣었다 뺐다 한다 — `properties.js`의
  `syncListToolbar()`가 이미 쓰던 "재부모" 패턴과 동일.
- **visualViewport/포커스 키보드 처리**: `focusin`/`focusout`(포커스
  기반, textarea·select·contenteditable·`.ProseMirror`·텍스트류
  input 대상)과 `visualViewport.resize/scroll`(실측 뷰포트 축소
  기반) **두 신호를 OR로 묶어** `html.mobile-keyboard-open`을
  토글한다 — 포커스 신호가 즉시성이 있고, visualViewport 신호가
  실제 키보드 유무를 보강 확인. 키보드가 뜨면 탭바를 `opacity:0;
  pointer-events:none`으로 숨기고 `--app-bottom-h`를 0으로 접어
  시트가 탭바 자리까지 확장되게 한다.
- **PTR 가드**: 기존 `APP_SCROLL_PANEL_IDS`(패널 자체 스크롤 중엔
  document로 touchstart를 안 넘겨 iOS PTR 오발동을 막는 Set)에
  `panel-props`를 추가했다 — 이전엔 매물탭이 빠져있어 모바일
  목록뷰를 깊이 스크롤한 상태에서 당겨도 오발동 여지가 있었는데
  이번에 같이 막혔다(개선이지 회귀 아님).

### 인수 검증 결과 — 원지시서 항목 전체 재실행

Playwright(로컬 node UTF-8 정적 서버, `window.naver` 최소 스텁,
`hasTouch:true`) 모바일 390×844+데스크톱 1440×900으로 **원지시서
검증 항목을 전부 재실행해 45개 체크 전부 통과**했다:

- **5탭 전환+maxScroll 0**: dash/assets/props/actions/scraps 5개
  전부 `document maxScroll ≤1px`, 탭바 `position:fixed` 하단
  고정+노출, 활성 패널이 탭바 위에서 정확히 끝남(겹침 0).
- **상단 ⋯더보기**: 모바일에서 프로필 등 4개 버튼 상단 비노출→
  ⋯ 클릭 시 드롭다운으로 실제 이동→재클릭 시 원위치 복귀 확인.
- **탭바-시트-키보드 3자 충돌**: 매물 추가 폼 시트를 열었을 때
  (입력 전) 탭바 위에서 정확히 끝나고 탭바도 그대로 보임 확인.
  필드에 실제 포커스하면 `mobile-keyboard-open` 부여+탭바 숨김+
  `--app-bottom-h`가 0으로 줄어 시트가 화면 바닥까지 확장됨을
  실측(포커스 해제 시 전부 원상복구). 별도로 `.modal` 하나를
  열어도(`:has(.modal.open)`) 탭바가 숨는지 확인.
- **매물 지도/목록**: 기본 지도뷰 무크래시, `propViewMode='list'`
  전환 시 `#panel-props[data-view="list"]`가 `overflow-y:auto`로
  내부 스크롤하며 카드 정상 렌더+document maxScroll 0 유지.
- **가로 모드**: 844×390으로 리사이즈해도 탭바 하단 고정 유지+
  document maxScroll 0.
- **데스크톱 1440 완전 무변화**: 탭바가 `position:fixed`가 아님
  (원래 상단 배치 그대로), 프로필 등 버튼 상시 노출(⋯로 안 숨음),
  `#headerMoreBtn` 자체가 `display:none`, `--app-bottom-h`가
  `0px`(레이아웃 영향 없음), 매물탭 포함 document maxScroll 0 —
  전부 실측 확인. 새 CSS가 전부 `@media(max-width:899.98px)` 안에
  간혀 있어 구조적으로도 데스크톱은 영향받을 수 없음을 diff로도
  재확인했다.
- **B-21 드래그다운 무회귀**: 단지 상세를 열고 `.box`에 합성
  `TouchEvent`(touchstart→touchmove 연속→touchend)로 실제 아래
  스와이프를 재현 — 모달이 정상적으로 닫힘을 실측 확인. `properties.js`
  자체가 이번 diff에서 **한 줄도 안 바뀌어** 구조적으로도 회귀
  불가능함을 diff로 재확인.
- **PTR(B-52) 무회귀**: `js/boot.js`(B-23/B-52 PTR 구현 본체)도
  이번 diff에서 **한 줄도 안 바뀌었다**. `navigator.standalone`
  게이트(iOS 홈화면 PWA 전용) 때문에 실제 터치 제스처를 헤드리스
  환경에서 신뢰성 있게 재현하기 어려워, boot.js 무변경(구조적
  회귀 불가) + nav.js의 유일한 관련 변경(`APP_SCROLL_PANEL_IDS`에
  `panel-props` 추가)이 기존 게이트 로직과 논리적으로 상충하지
  않음을 코드 검토로 확인하는 방식으로 대체했다 — 아래 "확인 못한
  것" 참고.
- `node --check js/nav.js js/properties.js js/boot.js`,
  `git diff --check` 전부 통과.

**수정한 것: 0줄.** 재검증 중 실제 버그처럼 보였던 것 2건은 전부
내 테스트 스크립트 쪽 문제였다 — ①`openForm()`이 기존 코드(B-31
이전부터 존재)로 필드에 자동 focus를 걸어 "시트 열림 직후"를
"입력 시작 후"와 혼동해 테스트했던 것, ②시트 오픈 애니메이션
(`.form.open{animation:drop .18s}`)+지도/에디터 비동기 초기화가
끝나기 전(200ms)에 위치를 측정해 ~3px 오차가 났던 것 — 둘 다
테스트 스크립트를 고쳐서 해소했고, 실제 제품 코드에는 손대지
않았다.

**확인 못한 것(실기기 확인 필요, 사용자 몫)**:
- `env(safe-area-inset-*)`의 **실제 0이 아닌 값**(노치·다이나믹
  아일랜드·홈 인디케이터) — 헤드리스 Chromium은 항상 0을 반환해
  코드 리뷰(`viewport-fit=cover`+`env()` 사용 확인)로만 검증했다.
- `visualViewport.resize`(실제 iOS 키보드가 뜰 때 뷰포트가
  실측으로 줄어드는 신호) — 헤드리스 환경엔 진짜 키보드가 없어
  `focusin`/`focusout` 기반 대체 신호 경로만 실측했다.
- B-23 PTR의 실제 스와이프 제스처(`navigator.standalone` 게이트로
  실기기 PWA 환경 전용) — 위에 설명한 대로 구조적 diff 확인으로
  대체.
- iOS Safari(사파리 자체, PWA 아닌 일반 브라우저 탭) 최종 확인.

- **B-31 완료·push 완료**(`378d0b5`, 손 B 원작업물 그대로 커밋).
- **손 B 복귀(7/25) 시**: 이 HANDOFF 항목으로 인계 내역 확인 가능.
  재검증에서 발견된 문제 없음, 코드 수정 없음.
- **다음**: 완료 후 대기 — 다음 배정은 커맨드센터가 별도 발급.

