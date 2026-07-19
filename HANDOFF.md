# HANDOFF — B-120+B-121 완료 (2026-07-19) 감사 후속: 문서 로테이션+소형 정리

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

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

---

# 이전 핸드오프 — B-118 완료 (2026-07-19)

## 최신 작업: 단지 병합 도구 — 중복 단지 정리 (실사례: 가양6단지 2개)

```
cbe5917 feat: 단지 병합 도구 — 중복 단지 정리 (B-118)
```

`index.html`(+1줄, "⋯" 버튼 하나)+`js/properties.js`(+261줄).
`style.css` 무접촉(기존 `.modal`/`.box`/`.mhead`/`.mbody`/`.cx-dl`/
`.status-picker`/`.sp-opt`/`.btn-ghost`/`.btn-save` 전부 재사용해 새
CSS가 필요 없었음). `state.js`/`BACKLOG.md` 무접촉, 스키마 변경 없음.
손 B는 이번 턴 중 B-31(파킹 해제, `nav.js`+`style.css`)에 착수해
미커밋 변경이 있었으나 diff 겹침 0(커밋 전 `git status`/`git diff`로
매번 확인).

**진입점**: 단지 상세 mhead에 "⋯" 버튼(`cxDetailMoreBtn`) 신설 →
클릭 시 항목 1개짜리 드롭다운("다른 단지와 병합", 기존
`showRouteMenu`/`showExportMenu`와 동일한 `.status-picker.route-menu`
패턴 재사용) — 접기 숨김이 아니라 명시 항목.

**3단계 마법사, 매 단계 사용자 확정**(자동 병합 절대 금지):
1. **후보 선택**: `findComplexCandidates()`/`cxMatchReason()`(B-19확
   매칭 제안 로직) 그대로 재사용해 이름 유사·좌표 300m 이내 후보를
   먼저 보여주고, 직접 검색 입력도 병행 제공.
2. **방향 선택**: 두 단지를 나란히 보여주고(각자 소속 매물 건수
   포함) 어느 쪽을 남길지 명시적으로 선택.
3. **필드별 충돌 미리보기**: 남길 값 기본 + keep 쪽이 빈 값일
   때만 drop 값으로 채우는 규칙(`cxComputeMerge()`, 순수 함수 —
   실행 전까지 실제 state는 손대지 않음)을 계산해 최종 반영값을
   전부 나열하고, 채워진 필드는 "(상대 단지 값으로 채움)" 표시.
   대표매물이 양쪽 다 있으면 경고 문구로 결과(남는 단지 것 유지)를
   먼저 알림. "병합 확정" 버튼을 눌러야만 다음 단계(실행)로 진행.

**병합 규칙**(필드 종류별):
- 단순 텍스트/숫자 14종(주소·역·노선·준공연도·메모·장단점·판단·
  출퇴근메모 등)은 keep이 비어있을 때만 drop 값으로 채움.
- 세대수/세대수등급, 좌표(lat+lng), 주차/주차상태는 **짝으로 함께**
  채움(하나만 채우면 불일치 데이터가 생기므로).
- `favorite`은 OR 규칙(둘 중 하나라도 즐겨찾기면 병합 후에도 유지).
- `commutes[]`는 인덱스별로(설정상 통근 기준지 2인과 매칭) 개별
  빈값 판정 후 채움.
- 단지명·`complexStatus`·`id`·`createdAt`은 항상 keep 쪽 고정(채움
  대상 아님) — "어느 쪽 정보를 우선할지"의 핵심 의미.

**실행**(`cxMergeExecute`): `backupBeforeMerge()`로 두 단지+소속
매물 전체를 `localStorage` `sh_mergeBackup_<timestamp>` 키에 JSON
스냅샷 저장 — **백업 실패 시(용량 초과 등) 병합 자체를 진행하지
않고 alert로 중단**(방식 명시: 기존 내보내기 파일 다운로드가 아니라
localStorage 백업 키 저장을 선택 — 다운로드 팝업 차단·저장 위치
확인 등 사용자 액션 없이 항상 확실히 남는 쪽을 택함). 이후
`listings[].complexId`를 keep으로 일괄 이관, 양쪽 다 대표매물이면
keep 쪽 유지+drop 쪽 대표 해제, `state.complexes`에서 drop 제거,
`routeSelected`(임장 루트 선택 Set)에서 drop id 제거, `save()`.
모달은 병합 도구만 닫고 단지 상세는 열어둔 채 keep 기준으로
새로 그림(`openComplexDetail()` 재호출 대신 `cxDetailId` 직접
전환+`renderComplexDetailBody`+`renderComplexes`만 호출 — 이유는
아래 부수 발견 참고).

**부수 발견·수정**: 처음엔 병합 후 화면 갱신에 `openComplexDetail
(keep.id)`를 그대로 재사용하려 했으나, 이미 열려있는
`complexDetailModal`에 `openModal()`을 한 번 더 호출하면
`lockBodyScroll()`의 카운터가 여분으로 하나 더 늘어 이후 모달을
닫아도 `unlockBodyScroll()` 카운트가 0에 도달하지 못해 스크롤
잠금이 안 풀리는 버그가 될 뻔했다(실코드 확인 후 실행 전 수정) —
모달을 다시 열지 않고 `cxDetailId` 갱신+내용 재렌더만으로 해결.

**삭제된 단지 참조 잔존 0 — 전수 확인 방법·결과**: `properties.js`
전체에서 `complexId`/`cxDetailId`/`.complexes` 참조를 grep해 상태를
지속적으로 들고 있을 수 있는 지점을 전수 조사했다. 결과 **복합
id를 실제로 캐싱하는 곳은 `cxDetailId`(전역 변수)와 `routeSelected`
(Set) 단 둘뿐**이었다 — 나머지(`ovMarkers[]._cxid`, `lastVisibleMapKey`
/`lastMarkerRenderKey`, `highlightCxCard`/`cxStripCenterId` 등)는 전부
매 렌더마다 `state.complexes`/`state.listings`에서 새로 계산하는
파생값이라 별도 정리가 불필요했다. 다른 파일(`nav.js`/`boot.js`/
`actions.js`/`assets.js`/`scraps-*.js`/`ai.js`/`profile.js`)도 grep한
결과 `nav.js`의 대시보드 요약 카운트 계산 1곳만 `state.complexes`를
참조했는데 이 역시 매 렌더 시점에 `state.complexes`를 그대로 읽는
파생 계산이라 무관했다. `cxListingEditMode`/`cxSafetyExpanded`는
매물(listing) id 기준이라 애초에 무관(매물 자체는 삭제되지 않고
`complexId`만 바뀌므로 편집 중이던 상태도 그대로 유효).

**검증**: Playwright(로컬 node UTF-8 정적 서버, `window.naver` 최소
스텁, 비guest 세션+`/api/state` 모킹) 데스크톱 1440×900, 단지 2개
(가양6단지/가양6단지(재건축))·매물 3+2건 fixture로 57개 체크 전부
통과 — ⋯ 메뉴 진입점 노출, 1~3단계 각각의 화면 전환, **취소
4가지 경로**(1단계 닫기버튼·1단계 배경클릭·2단계 취소·3단계
취소, 뒤로 버튼 2곳도 별도 확인) **전부 데이터 무변경+백업 키
미생성 확인**, 3단계 미리보기의 XSS 페이로드(`<img onerror>`,
drop측 `commuteMemo`에 삽입)가 실제 `<img>` 태그로 파싱되지
않고 이스케이프 텍스트로만 노출+스크립트 미실행, 실행 후 단지
1개로 감소+매물 5건 손실 없이 전부 이관+대표매물 정확히 1개
보장(남는 쪽 유지·이관된 쪽 해제)+14개 텍스트 필드 중 빈 필드만
정확히 채움+세대수/좌표/주차 짝 채움+`commutes[0]` 채움+이미 값
있는 필드(주소·좌표)는 유지+favorite OR 규칙+`complexStatus`는
채움 대상 아님(keep 값 고정) 전부 실측 확인, 병합 도구 모달만
닫히고 단지 상세는 유지된 채 keep 기준으로 갱신, 백업 스냅샷에
두 단지+매물 5건 전체 포함 확인, **잔존 검사**(`JSON.stringify
(state)`에 삭제된 단지 id 없음+`routeSelected`에 없음+`cxDetailId`가
가리키지 않음) 전부 통과, 병합 후 요약 카운트·지도 마커 배열·
단지 카드 목록이 1개로 갱신, Redis 왕복(`flushPendingSync()`
강제 후 POST 바디에 병합된 단지 1개+매물 5건+삭제 id 잔존 없음
확인). `node --check` 통과.

- **B-118 완료·push 완료**. 손 B의 B-31(`nav.js`+`style.css`)
  미커밋 변경과 파일 충돌 없음.
- **다음**: 별도 지시 대기(B-118로 실사용 피드백 3차 5건 전부
  발급 완료 — 커맨드센터 후속 판단).

