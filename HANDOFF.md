# HANDOFF — B-182 모달 포커스 격리·키보드 접근 완료 (2026-08-02)

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 모달 inert/포커스trap 중앙화 + 로그인오버레이 + 포인터전용 컨트롤 키보드화(3커밋)

```
42efb49 feat: 모달 포커스 격리·키보드 접근 — openModal/closeModal 중앙화 (B-182 ①)
81a08a5 feat: 로그인 오버레이 포커스 격리 (B-182 ②)
bb54b2f feat: 포인터 전용 컨트롤 키보드화 — 게스트·필터칩·매물행 (B-182 ③)
```

커맨드센터 승인(기존 계획·승인 조건 그대로: ①openModal/closeModal
중앙화+inert+trap ②로그인 overlay ③UX-03 포인터전용 컨트롤, 3분할
커밋)으로 착수. 근거는 `audit-2026-08-01.md` UX-02/UX-03. 손 A 단독,
①→②→③ 순서. 착수/커밋 전후 `git status`로 손 B(B-160) 미확정 변경
확인 — 전 구간 클린.

**①**(`js/utils.js`): `openModal`/`closeModal` 두 곳에 중앙화 —
B-176에서 이미 모든 닫기 경로(X·backdrop·ESC)가 `closeModal()` 하나로
통일돼 있어 9개 모달 개별 수정 없이 자연히 다 커버됨.
- `_modalOpenStack`으로 겹쳐 열리는 경우 최상단만 상호작용 가능하게,
  나머지(배경 앱 콘텐츠 + 그 아래 모달)는 `inert`.
- 트리거는 호출부 수정 없이 열릴 때 시점 `document.activeElement`를
  자동 캡처(거의 항상 클릭한 버튼 자신) — 닫히면 그 트리거로 포커스
  복귀.
- 열릴 때 모달 내부 첫 focusable로 초기 포커스 이동(`requestAnimationFrame`,
  없으면 모달 자체에 `tabindex=-1` 부여 후 포커스).
- `inert` 미지원 브라우저 폴백: keydown Tab 트랩을 **항상** 병행 등록
  (지원 브라우저에선 배경이 애초에 focusable 후보에서 빠져 사실상
  중복 방어, 미지원 브라우저에선 이게 유일한 방어선 — 조건분기 없이
  둘 다 항상 실행되는 구조라 "폴백 단독 작동"이 설계상 보장됨).

**②**(`js/auth.js`+`js/utils.js`): 로그인 overlay도 같은 이유(UX-02)로
보이는 동안 `.wrap` 전체를 inert. `_syncLoginOverlayA11y()`를
`unlockApp`/`forceLogin`/IIFE 유효토큰 분기 3곳에 연결 — 오버레이가
보이면 `.wrap` inert+`#loginInput` 자동포커스, 숨겨지면 해제. `①`의
`_activeTrapContainer()`를 로그인 오버레이도 확인하도록 확장해 Tab
트랩 공유(로그인 중엔 모달이 열릴 수 없어 우선순위 충돌 없음).

**③**(`index.html`+`js/properties.js`+`style.css`): UX-03 포인터 전용
컨트롤 3종.
- 로그인 게스트: `<div>`→`<button type="button">`(전역 button 리셋이
  이미 있어 시각 변화 없이 네이티브 Enter/Space 확보).
- `.sc-filter-chip`(수집함 2곳+단지 필터 5곳+지역/노선 동적 렌더,
  총 41개 정적+2개 동적 템플릿): `role="button" tabindex="0"` 추가 +
  기존 click 위임은 그대로 두고 공용 keydown 리스너 1개로 Enter/Space
  →`click()` 전환(델리게이션 중복 없음). `:focus-visible` 링 추가
  (`.c-top` 전례).
- `.cx-listing-row`(매물 행): 수정모드가 아닐 때만 조건부
  `role="button" tabindex="0"`(기존 클릭 핸들러의 편집모드 제외
  가드와 동일 조건). 같은 위임 컨테이너에 keydown 추가 — 자식
  버튼/입력은 네이티브 키 처리가 있어 `e.target===row`일 때만 반응.

**검증**(Playwright 1440×900):
- 모달 9개 중 8개 실측(exportModal-X, importModal-backdrop,
  scEditModal-ESC, scLightboxModal-X, assetAiModal-X, profileModal-ESC,
  propImportModal-X, complexDetailModal-backdrop — 3경로 전부 대표
  포함) 전부: 열 때 모달 자신은 inert 없음+배경(`#appTopbar`) inert
  있음+스택에 자기 id만, 닫을 때 모달 닫힘+배경 inert 해제+스택
  비워짐 확인. scImportModal은 별도 실측은 안 했으나 동일
  openModal/closeModal 경로라 코드상 동일 동작(9번째, 스팟체크
  생략).
- **inert 미지원 폴백 단독 작동**: `Element.prototype.setAttribute`를
  몽키패치해 `inert` 설정을 완전히 무력화(실제 미지원 브라우저 시뮬레이션)
  → 모달·배경 둘 다 `inert` 속성이 실제로 안 붙은 상태에서도 Tab
  30회 반복이 모달 안에 계속 갇힘, Shift+Tab이 첫 요소에서 마지막으로
  정상 순환 — keydown 트랩만으로 완전히 동작함을 확인.
  (참고: `importModal`처럼 첫 focusable이 textarea인 모달은 자동
  포커스가 그 안으로 들어가 B-127의 기존 "1차 ESC는 blur만, 2차부터
  닫힘"(작성 중 텍스트 유실 방지) 보호가 적용됨 — 이전엔 트리거
  버튼에 포커스가 남아 단일 ESC로 닫혔던 것과 다른 동작이지만, 마우스로
  직접 클릭했던 사용자는 원래도 겪던 동작이라 일관성 개선이지 새 버그
  아님.)
- 필터칩 Enter/Space 활성화(정적+동적 렌더 둘 다), 매물행 Enter로
  상세패널 오픈·수정모드에선 role/tabindex 자체가 없음, 게스트 버튼
  Enter로 잠금해제, 로그인 최초 로드 시 `.wrap` inert+입력창 자동포커스
  +Tab이 오버레이 밖으로 안 나감. 마우스 클릭 경로(필터칩·매물행·
  프로필저장 등) 전부 무회귀.

- **B-182 ①②③ 완료·push 완료**(`42efb49`/`81a08a5`/`bb54b2f`).
- **사용자 Safari 실기기 확인 필요**(inert·포커스·VoiceOver는
  Chromium으로 authentic하게 검증 불가한 영역):
  1. **VoiceOver + 프로필 모달**: `#profileBtn`으로 열기 → VoiceOver
     스와이프로 배경(상단 탭바·헤더 버튼들)이 여전히 읽히는지 vs
     건너뛰는지(`inert`가 스크린리더에도 실제 적용되는지). X 버튼으로
     닫기 → 포커스가 "프로필" 버튼으로 돌아왔다는 음성 안내가 나오는지.
  2. **가져오기 모달(`importModal`)**: `#importBtn`으로 열기 → 텍스트
     영역에 자동 포커스되면서 iOS 자동 확대/스크롤이 튀는지, 튄다면
     모달 오픈 애니메이션과 겹쳐 어색해 보이는지.
  3. **프로필 모달**: 동일하게 이름 입력칸(`#pf_names`) 자동포커스로
     확대/스크롤 튐 여부.
  4. **로그인 화면 게스트 버튼**: `<div>`→`<button>` 전환 후 이전과
     동일한 밑줄 텍스트 링크로 보이는지(버튼 기본 테두리/배경 등이
     새치 않는지).
  5. **매물 탭 → 단지 상세 → 매물 행**: 블루투스 키보드 연결 시(또는
     VoiceOver 스와이프) 행에 포커스 이동 → Enter(또는 더블탭)로 상세
     패널이 열리는지.
  - 기존 audit 플래그 2건(sticky/`:has()`)은 이번 배치와 무관하게
    그대로 유효.
- **B-164~171잔여**(이전 세션들, 아직 미확인): 매물 메모 행간·별점/
  즐겨찾기 별 탭 감각. 대부분은 후속 세션에서 이미 처리됨(B-166~174).
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정), 이번
  지시서 범위 밖.

---

# 이전 핸드오프 — B-187+B-181R 완료, B-182 재개 대기 (2026-08-02) 검증 FAIL 재작업

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 900~1199.98px 탭 가림 회귀 수정 + 터치 타깃 검증 FAIL 3종 재작업(R-1/R-2/R-3)

```
24dcd93 fix: 900~1199.98px에서 뒤 3개 탭이 우측 액션 아래로 가려지는 회귀 (B-187)
e26c840 fix: 터치 타깃 재작업 — 검증 FAIL 3종 해소 (B-181R)
```

커맨드센터 지시서(`dispatch-2026-08-02-B181R-B187.md`), 근거는
`verify-2026-08-02.md`(손 B 검증). B-182 착수 전 발견된 회귀·FAIL
재작업이 우선이라 순서 끼워넣기(B-187→B-181R→B-182 재개). 손 A
단독, B-187→B-181R 순서 엄수, 각 1커밋. 착수/커밋 전후 `git status`로
손 B(B-160) 미확정 변경 확인 — 전 구간 클린.

**B-187**(`style.css` 1개 신규 미디어쿼리): 원인은 B-178의 `.atab{
white-space:nowrap;flex-shrink:0}`로 탭 실폭 합계(447px)가 apptabs
열 폭(212px, topacts가 383px 다 차지)을 초과 — `overflow-x:auto`로
스크롤은 되지만 스크롤 안 한 기본 위치에서 뒤 탭 3개의 미스크롤
bounding rect가 topacts 열과 같은 화면 좌표를 차지해(overflow로
클리핑돼 실제로는 안 그려짐) `elementFromPoint()`가 `#syncChip`/
`#profileBtn`/`#exportBtn`을 반환 — 매물·액션·수집함 탭 클릭 불가.
**수정 방향(①grid 재배분)**: 900~1199.98px에서 topacts 4버튼(프로필·
내보내기·가져오기·잠금)을 기존 모바일 header-more 축소 패턴으로
숨기고 ⋯더보기만 노출 — apptabs 열 폭 212px→479px 확보. **부수 발견**:
`#headerMoreBtn`의 실제 동작 핸들러는 `js/nav.js`의
`showMobileHeaderMoreMenu`(DOMContentLoaded 시점에 onclick을 나중에
덮어씀) — `js/profile.js`의 `showHeaderMoreMenu`는 로드 순서상 이미
죽은 코드(이번 스코프 밖, 무접촉). 실제 핸들러는 CSS 표시 여부와
무관하게 4버튼을 늘 더보기 메뉴로 옮기므로 4개 다 숨겨도 접근성
회귀 없음(메뉴 오픈→4버튼 존재, 닫기→topacts 원복 Playwright 확인).
검증(900/950/1000/1100/1199/1200/1440 실측): 5탭 각 중심
`elementFromPoint()`===자기 자신 전부 PASS, 탭 h40/scrollH38 무변경
(세로줄바꿈 0), brand-apptabs/apptabs-topacts 경계 16px 갭 유지(겹침
0), 899 하단앱바·1200/1440 무변경, 5탭 실제 클릭 전부 정상.

**B-181R**(`style.css`): verify §7 FAIL 3종 재작업.
- **R-1 데스크톱 누수 원복**: B-181-3이 `min-height:38px`를 미디어쿼리
  스코프 없이 전역 추가한 10개 규칙(`.addact input/button`,
  `.atarget .trow input`, `.btn-ghost`, `.btn-save`, `.tri-num`,
  `.sc-search-input`, `.act-search-input`/`.asset-search-input`,
  `.asset-owner-sel`, `.sc-sort-select`)을 전부
  `@media(max-width:899.98px)`로 재스코프 + 붙어있던 중복
  `box-sizing:border-box`(전역 `*{box-sizing:border-box}` 이미 있음)
  정리. B-181 전체 diff 재확인 — 이 10개 외 추가 누수 없음(다른
  추가분은 전부 `position:relative` 등 무해). 1440 재측정 7항목 전부
  38 고정 해제, 30~36 범위로 원복(폰트 로딩 등 환경차 1px 내외,
  38 고정 해제 자체가 핵심).
- **R-2 미달 항목 8개 보정**(전부 데스크톱 무변경): 대시 빠른 링크
  h36→38(오프셋 -9→-10), 자산 노트 저장 규칙 없었음→`.btn-primary`
  모바일 min-height 신설(단독행, h38), 액션 수정 h37→38(세로만
  -9→-9.5, 가로 31.3은 gap 1.5px 절반 원칙상 유지), 액션 select
  규칙 없었음→`.prop-filter-sel` 모바일 min-height 신설(h38), 수집함
  원문토글 h37→38(-11→-11.5), 안전체크 토글 h37→38~39(-10→-10.5).
  **수집함 수정/삭제**는 실측 재확인 결과 h32(gap 6px 절반 원칙 이미
  적용된 구조적 최대) — 코드 변경 없이 이전 커밋 설명의 h37 오기를
  h32로 정정. **tri-state**는 세로 확대 시도 중 실측으로 겹침 발견
  (위쪽은 캡션 텍스트, 펼친 상태 아래쪽은 tri-num 입력행) — 겹치면
  라벨 클릭이 버튼을 오발화하는 실사용 버그가 되므로, top:-4px/
  bottom:-6px로 재조정해 양쪽 다 겹침 0(1px 여유) 확인되는 선에서
  h24→34 유지(38 미달, 구조적 최대로 문서화 — 인접 콘텐츠 오클릭
  방지가 38px 달성보다 우선).
- **R-3 겹침 해소**: `.sc-view-toggle` 갤러리 버튼(⊞) 우측 오프셋
  -6px→-5px로 1px 축소, `#sc_selectModeBtn`과의 가로 겹침 제거
  (실측 overlapPx 0.00).

검증(Playwright 390×844+1440×900): R-2 8개 항목 재측정(6개 38+
도달, 2개는 인접 겹침 방지 우선한 구조적 최대로 확인·문서화), 인접
겹침 전수 재확인(⊞/선택 0px, tri-seg/caption·입력행 각 1px 여유),
1440 데스크톱 7항목 38 고정 해제 확인, 390 기능 회귀 0(뷰토글 갤러리
전환·선택모드 진입·tri-state 클릭 전부 정상).

- **B-187/B-181R 완료·push 완료**(`24dcd93`/`e26c840`).
- **Safari 실기기 확인 필요**: 이번 배치(B-187/B-181R)도 전부
  Chromium computed-style 정밀 측정으로 검증, 새 Safari 전용 우려
  없음. 기존 audit 플래그 2건(sticky/`:has()`)은 그대로 유효.
- **B-164~171잔여**(이전 세션들, 아직 미확인): 매물 메모 행간·별점/
  즐겨찾기 별 탭 감각. 대부분은 후속 세션에서 이미 처리됨(B-166~174).
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정), 이번
  지시서 범위 밖.

---

# 이전 핸드오프 — B-176~B-181 완료, B-182 계획 승인 대기 (2026-08-02) 감사2회차 후속

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: backdrop 스크롤잠금·esc()일관화·900px탭깨짐·AA대비·안전체크상시노출·터치타깃38px 일괄(3커밋)

```
88165cf fix: 모달 backdrop 닫기 시 body 스크롤 잠금 잔류 (B-176)
c9dd145 fix: 동적 속성 삽입 esc() 일관화 (B-177)
c3d19d0 fix: 900px 정확 지점 상단 탭 세로 파손 (B-178)
caf224a fix: 상태 텍스트 5종 AA 대비 미달 수정 (B-179)
fe589c7 feat: 전세 안전체크 9필드 데스크톱 상시 노출 전환 (B-180)
874e7d3 fix: 모바일 터치 타깃 38px 일괄 ①파괴·정밀 조작 우선 (B-181-1)
2d9bf68 fix: 모바일 터치 타깃 38px 일괄 ②대시보드·자산·액션나머지·로그인 (B-181-2)
a82f733 style: 터치 타깃 38px 확대 — 수집함·매물·모달 나머지 (B-181-3)
```

커맨드센터 지시서(`dispatch-2026-08-02-B176-B182.md`)로 착수. 근거는
`audit-2026-08-01.md`(감사 2회차). 손 A 단독, B-176→...→B-181 순서
엄수(한 항목=한 커밋, B-181만 영역별 분할 허용). 착수/커밋 전후
`git status`로 손 B(B-160) 미확정 변경 확인 — 이번 세션 전 구간에서
충돌 없었음(작업 내내 클린).

**B-176**(`js/properties.js` 1줄): 공용 backdrop 핸들러가
`m.classList.remove('open')`만 호출해 `unlockBodyScroll()` 미호출 →
lock count 잔류 → `body.style.position:fixed` 영구 고착. `closeModal(m.id)`
경유로 교체(`complexDetailModal`의 `closeListingDetail()` 분기는 유지).
`classList.remove('open')` 직접 호출 전수 grep — 모달 아닌 `.open`
사용처(폼시트 등)는 무접촉 확인. 검증: backdrop 닫기 후
`body.style.position===''`, ESC 중첩(B-127)·라이트박스 backdrop·
모달 2개 연속 열기/닫기 lock count 회귀 없음.

**B-177**(`assets.js`+`nav.js`+`actions.js`+`scraps-render.js`+
`properties.js`+`profile.js`): 백업 임포트로 유입되는 `id`가 다수
`data-*` 속성에 비이스케이프 삽입되던 것 전수 `esc()` 적용(리스트뷰
vs 갤러리뷰 불일치가 실증 사례). `properties.js`의 `CSS.escape(lid)`
4곳은 전부 `querySelector()` CSS셀렉터 컨텍스트라 정상 사용 확인(false
alarm, 무수정). 오염 ID(`sc7" data-audit-x="1`) 합성 주입 검증 —
임의 속성 미생성, `data-scid` 원문 보존, 수정/삭제 핸들러 정상.
**applyGuards ID 형식 제한은 계획만**(코딩 안 함) — 기존 백업 비정형
ID 마이그레이션 매핑, `complexId` 등 관계키 참조무결성, 정규식 밖
ID 처리 정책 3가지가 걸려있어 별도 지시 필요.

**B-178**(`style.css` 1줄): `@media(min-width:900px)`에서 `.atab`에
`white-space:nowrap`+`flex-shrink:0` 추가 — 정확히 900px 지점에서
"대시보드" 등이 한 글자씩 세로줄바꿈되던 것 해소. 899(하단앱바
58px)/900/901/1440(상단탭 40px) 4점 실측 — 900px 탭 높이 40px대,
세로줄바꿈 0, 로고·동기화칩 밀림 없음. (**후속 발견**: 같은 폭에서
탭이 옆 액션 영역에 가려 클릭 불가한 신규 회귀 NEW-01 → B-187로 수정.)

**B-179**(`style.css` 5개 색상값): 전경색만 진하게(배경·hue 유지,
B-129/130 선례) — 액션 마감초과 `#B16A63`→`#9B554E`, 수집함 매매
`#6B7C93`→`#5F6F83`, 제외 `#B5602F`→`#A6582B`, 메모 `#7A7A50`→
`#73734B`, `.chip.ok` `#3C7A4C`→`#3B784B`. 5종 전부 4.5:1 이상
확보, `--sc-*` 토큰 공유 소비처 전수 재검산 완료(개선만, 악화 없음).

**B-180**(`js/properties.js`+`style.css`): `safetySectionHTML()`의
인라인 `style="display:none"`을 클래스+미디어쿼리로 전환 —
데스크톱(≥900px) 9필드 상시노출, 모바일 접기 유지(B-147b 반응형
예외 패턴). **함정 발견·수정**: `.safety-list` 클래스가 읽기전용
패널(`safetyReadOnlyHTML()`)과 공유돼 있어 바레 셀렉터로 숨기면
읽기전용 패널까지 깨짐 — `.safety-wrap .safety-list` 자손 셀렉터로
스코프. 데스크톱 즉시노출·입력동작, 모바일 접기/펼치기, safety 상태
저장 무변경 확인.

**B-181**(`style.css`, 3커밋 분할): audit §3.14 터치 타깃 38px
미달 표 전체 — 시각 크기 유지 + pseudo hit-area(`::after`)/
min-height(B-136 패턴). ①파괴·정밀 우선(액션 수정·별·삭제,
마일스톤삭제, 안전체크토글) ②대시보드·자산·액션나머지·로그인게스트
③수집함(검색/정렬/뷰토글/필터칩/카드액션/원문토글)·매물(정렬칩/
더보기/필터/tri-state/입력)·모달(라이트박스·footer버튼). **구조적
블로커 2건 해결**: `.sc-view-toggle`·`.tri-seg` 둘 다 `overflow:hidden`
컨테이너라 `::after` 확장이 부모에 잘렸음 — overflow:hidden을 빼고
`:first-child`/`:last-child`에 개별 모서리 radius를 줘서 같은 시각을
유지하며 해제, 세그먼트 사이 0px 인접이라 바깥쪽 모서리만 확장(가운데
겹침 방지). gap 기반 항목(필터칩·카드액션·정렬칩 등)은 gap의 절반만
확장해 형제와 안 겹치게 — 이 경우들은 38px에 못 미쳐도 구조적 최대치로
문서화(B-136/①의 전례). (**후속 손 B 검증**: 전역 `min-height:38px`
누수 1건·미달 8건·겹침 1건 FAIL → B-181R로 재작업.)

- **B-176~B-181 완료·push 완료**(`88165cf`~`a82f733`).
- **Safari 실기기 확인 필요**: 이번 배치는 전부 Chromium
  computed-style 정밀 측정으로 검증, 새로 추가된 Safari 전용 우려
  없음. 기존 audit 플래그 2건(sticky/`:has()`)은 그대로 유효.
- **B-164~171잔여**(이전 세션들, 아직 미확인): 매물 메모 행간·별점/
  즐겨찾기 별 탭 감각. 대부분은 후속 세션에서 이미 처리됨(B-166~174).
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정), 이번
  지시서 범위 밖.
