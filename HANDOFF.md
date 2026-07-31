# HANDOFF — B-161+B-162 완료 (2026-07-31) 모바일 지도뷰 카드 위치 + 단지상세 가로스크롤

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 지도뷰 카드 스트립 재배치 + 단지·매물 상세 시트 가로 스크롤 제거

```
51bbe68 fix: 모바일 지도뷰 카드 스트립을 탭바 위로 재배치 (B-161)
c7ce20e fix: 단지·매물 상세 시트 가로 스크롤 제거 (B-162)
518abcd fix: 지도뷰 카드 하단이 탭바에 가려지던 회귀 수정 (B-161)
```

**B-161 회귀 수정**(`518abcd`): 사용자가 실기기에서 카드 하단·"최근
확인" 줄이 `.apptabs`(fixed)에 가려짐을 확인해 리포트. 원인 — `51bbe68`
에서 `padding-bottom`을 flat `12px`로 줄이며 "bottom:0인 `#complexSection`
컨테이너 바닥이 `.apptabs` 상단과 항상 일치한다"고 가정했는데, 로컬
헤드리스 Chromium(env(safe-area-inset-*) 항상 0, 100dvh 고정)에선
성립해도 실기기(동적 safe-area·100dvh)에선 깨짐. 지시서 원안대로
`padding-bottom:calc(var(--app-bottom-h) + 12px)`로 되돌려 탭바 높이만큼
확실히 띄우도록 수정(`--cx-strip-h` 측정 로직은 `apptabs.top` 기준
실측이라 무변경). Playwright 스크린샷(390px)으로 카드 전체(뱃지·
"최근 확인" 줄 포함)가 탭바 위에 완전히 노출됨을 육안 확인.

커맨드센터 지시서(`dispatch-2026-07-31-B161-B162.md`)로 착수. 손 A
단독, 지시대로 2커밋 분리. 파일 락: `style.css`+`js/properties.js`
(①)·`style.css`(②) — 겹치는 파일이지만 순차 단독 작업이라 충돌 없음.

**B-161**(`style.css`+`js/properties.js`): 모바일 지도뷰에서 카드
캐러셀 하단이 탭바에서 최대 184px 위에 떠 있던 버그 — `#complexSection`의
`bottom:14px`(위치)과 `padding-bottom:calc(app-bottom-h+78px)`이
이중으로 가산되던 게 원인(B-131에서 FAB 겹침을 피하려 카드 전체를
위로 올린 구조적 부작용). `bottom:0`+`padding-bottom:12px`로 단순화해
탭바 바로 위 12px로 내림. FAB(`#toggleForm`)·현위치(`.my-loc-btn`)는
카드 높이가 verdict·뱃지 유무로 가변이라 고정값을 쓸 수 없어,
`measureCxStripH()`(`ResizeObserver`가 `#complexSection` 크기 변화를
자동 포착)로 실측한 높이를 `--cx-strip-h` CSS 변수에 반영하고 두
버튼의 `bottom`을 그 위로 쌓음(`#panel-props:not([data-view="list"])`
로 지도뷰만 스코프, 리스트뷰는 기존 `calc` 그대로 무변경).

**B-162**(`style.css`): 단지 상세(`#complexDetailModal`)·매물 상세
(`#cxListingDetailBody`) 시트를 세로 스크롤하다 좌우로도 밀려 라벨이
잘려 보이던 버그. 지시서의 진단 스니펫(`mb.getBoundingClientRect()`
기준 우측 초과 자식 찾기)을 실제 렌더에 돌려 범인을 실측 — 지시서가
제시한 후보(②편집 폼 flex·③정보수정 폼)는 재현 안 됨(`.row`가
`display:grid`가 아니라 `block`으로 세로 쌓여 애초에 겹칠 구조가
아니었음, `node`로 컴퓨티드 스타일 직접 확인). 대신 **영문 역명·주소
등 공백 없는 긴 토큰**을 넣어보니 재현됨(`mbody.scrollWidth` 561
vs `clientWidth` 390) — 앱 전체에 `overflow-wrap`/`word-break`가
어디에도 없어 텍스트가 박스를 그냥 넘치는 게 근본 원인이었음(라벨
잘림 증상은 이 오버플로 상태에서 스와이프 도중 옆으로 밀렸을 때
보이는 것). `#complexDetailModal .mbody{overflow-wrap:anywhere}`
하나로 근본 수정(상속 속성이라 dt/dd·메모·안전체크 등 모든 자손에
자동 적용, `#cxListingDetailBody`도 같은 조상의 자손이라 함께 커버)
+`overflow-x:hidden` 방어선 추가. 지시서 후보①(네이버 지도 내부
절대배치 타일)은 `#formMap,#propEditMap,#cxDetailMap`에
`overflow:hidden` 방어를 추가했으나, 로컬은 네이버 API 키가 배포
도메인으로 제한돼 있어 지도 자체가 초기화되지 않아(500 에러) 재현·
검증 불가 — Safari 실기기 확인 시 이 후보도 함께 봐 주시면 좋음.

**검증**(Playwright, 로컬 Node UTF-8 정적 서버+게스트 모드+주입한
샘플 단지·매물 데이터, `node --check js/properties.js` 통과): B-161 —
390px에서 카드 하단~탭바 여백 12px(목표 부합), FAB·현위치가 카드
1장/2장(verdict 긴 카드 포함)에서 전부 안 겹침(gap 12~16px), 리스트뷰
전환 후 되돌아와도 무회귀, 리스트뷰 자체 calc·매물추가 시트 동작
무변경 확인. B-162 — 390px·360px 양쪽에서 단지 상세(수정모드+안전
체크 펼침+긴 토큰 전부 넣은 상태)·매물 상세 사이드 패널 모두
`scrollWidth===clientWidth`(가로 스크롤 0) 확인, 세로 스크롤 후
`mhead` 위치 불변(B-59 sticky 무회귀) 확인. 두 항목 모두 신규 콘솔
에러 0.

- **B-161/B-162 완료·push 대기**(`51bbe68`/`c7ce20e`/`518abcd`).
- **B-158잔여 확인**: BACKLOG의 "다음 세션 HANDOFF에 B-158 엔트리
  추가" 항목 — 아래 이전 섹션에 이미 `**B-158**: iOS PWA가...` 전체
  단락이 존재함(2026-07-26 세션에서 이미 기록 완료). 추가 기록 불필요,
  BACKLOG에서 삭제 검토 요청.
- **사용자 확인 요청**(Safari 실기기, 390px 근처 실제 화면):
  ① 지도뷰에서 카드 하단이 탭바 바로 위(safe-area 포함)로 붙었는지,
  스와이프 중 어느 카드에서도 FAB·현위치에 안 가려지는지.
  ② 단지 상세·매물 상세 시트를 세로로 쭉 스크롤해도 좌우로 안 밀리는지
  (특히 영문 단지명·역명이 있는 실데이터가 있다면 그 항목으로).
  ③ 후보① 네이버 지도 타일이 시트 밖으로 삐져나오지 않는지(로컬
  미검증 항목).

---

# 이전 핸드오프 — B-158+B-160 완료 (2026-07-26) 모바일 수집 인박스 + 입력 관용화

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: iPhone 공유 링크 직송 인박스와 비일관 입력 후속 보강

```
c26d2e0 feat: 모바일 수집 인박스 API 추가
a7ddd9a feat: 인박스 항목을 수집함에 안전 병합
de673ff docs: iPhone 인박스 단축어 설정 안내
9e6a014 fix: 인박스 요청에서 링크 추출 관용화 (B-160)
```

**B-158**: iOS PWA가 share target을 지원하지 않는 제약을 단축어
직송 방식으로 우회. `api/ingest.js`는 별도 `INGEST_TOKEN`으로 POST를
받아 Redis `sweetyhome:inbox`에 최대 100건을 적재하고, GET/DELETE는
기존 세션 인증으로 분리. IP+전역 rate limit과 8KB 상한을 적용했으며
`sweetyhome:state`는 서버에서 직접 쓰지 않음. 클라이언트는 앱 로드
후 인박스 항목을 `new` 수집함 카드로 병합하고, 저장 성공을 확인한
뒤에만 ack하며 `inboxId`로 중복을 막음. iPhone 단축어에서 실전송해
수집함 카드 반영까지 확인했으나, 공유 앱·입력 종류에 따라 `url`이
제목 포함 텍스트나 빈 값으로 전달돼 기존 엄격 URL 검증이 반복 실패한
것이 실기기 후속으로 확인됨.

**B-160**(`api/ingest.js` POST만): `url`·`memo`를 optional 문자열로
받고, ① `url` 전체가 정상 http(s) URL이면 기존대로 사용 ② 아니면
두 필드 결합 텍스트의 첫 `https?://` 링크를 추출 ③ 추출 후보 끝의
`)`, `]`, `,`, `.`, `;`, `!`, `?`를 한 번 정리한 뒤 재검증하도록
완화. 추출에 사용해도 저장 `memo`는 기존 원문 유지. 링크를 못 찾은
400은 본문을 에코하지 않고 `urlLen`/`memoLen` 숫자만 돌려줘 빈 입력과
링크 없는 텍스트를 원격 구분할 수 있게 함. item 구조·GET/DELETE·
토큰 검증·rate limit·8KB 상한·100건 상한은 무변경.

**검증**: 임시 in-memory Redis 목업으로 9시나리오 통과 — 정상 URL,
제목 포함 URL, 빈 url+memo URL, 양쪽 빈 값의 길이 0, 링크 없는 텍스트
길이와 내용 비에코, 꼬리문자 제거, 8KB 초과 413, 토큰 불일치 401,
동일 IP 31번째 429. 저장 URL 정규화와 memo 보존도 함께 확인.
`node --check`로 `api/`+`js/` 20개 전부 통과. B-160 코드 변경은
`api/ingest.js` 단독이며 완료 기록을 위해 이 HANDOFF 엔트리만 함께 갱신.

- **B-158/B-160 완료**(B-160 `9e6a014`). master push 시 Vercel
  자동 배포.
- **사용자 확인**: Vercel 배포 뒤 기존 iPhone 단축어로 Safari·실패했던
  공유 입력을 다시 보내 수집함 `new` 카드 생성 확인. 실패 시 응답의
  `received.urlLen`/`memoLen` 숫자만 전달(원문·토큰 공유 금지).

---

# 이전 핸드오프 — B-05 완료 (2026-07-25) 레거시 properties[] 완전 삭제

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 레거시 `state.properties[]`(flat 스키마) 활성 CRUD·죽은 코드·스키마·데이터 완전 삭제 (B-81 동시 종결)

```
ad4a9d0 refactor: 마이그레이션 프리뷰 죽은 코드 삭제 (B-05 ①)
be5760e refactor: 활성 레거시 매물 CRUD·렌더·내보내기 삭제 (B-05 ②)
5acbed5 feat: 레거시 properties 스키마·가드·복원·AI 컨텍스트 정리 (B-05 ③)
```

커맨드센터 지시서(`dispatch-2026-07-25-B05.md`)로 착수. 사용자
백업 완료 확인 후 게이트 통과. 손 A 단독, 지시대로 3커밋 분리
(도달불가 죽은 코드 → 활성 CRUD → 스키마/데이터). 총 54줄 추가·
905줄 삭제(순감소 851줄).

**커밋①**(`properties.js`, 최저위험): `migBuildRows`/
`renderMigPreview`/`migApply`/`migInjectUI`(진입 버튼 이미 제거된
도달불가 마이그레이션 프리뷰 모달, B-68 주석 대상) + "기존(미정리)
매물" 접기 토글(`legacyExpanded`/`updateLegacyToggleLabel`/
`legacyToggleBtn` 핸들러) 삭제. `migComplexStatus`/`migParseName`은
`saveAsComplexListing`·TSV 임포트가 여전히 써서 유지.

**커밋②**(`properties.js`+`index.html`+`style.css`, 최대 덩어리):
레거시 렌더 전체 — `renderTabs`/`renderList`/`actionsHTML`/
`headlineText`/`subtitleText`/`parseDepositUpper`/`bodyMetaChips`/
`checklistHTML`/`aiBlock`/`aiAnalyze`/`locate`/`reselectMarker`
(단, `commuteCardChips`는 `renderComplexes`도 써서 유지). 편집 모달
전체 — `openEdit`/`initEditMap`/`initEMMemoEditor`(Tiptap)/
`em_saveBtn`/`em_cancelBtn`/`em_findBtn`/`em_img*`/`em_mdToolbar`/
`propEditModal`(index.html). `delProp`/레거시 `showStatusPicker`
(`showCxStatusPicker`와는 `.status-picker` 클래스만 공유, 별개 함수 —
트랩① 확인 후 신규만 유지)/`#list` 클릭·키보드 위임/`updateUnisearch`.
AI 자동평가 클러스터 — `WEIGHTS`/`renderWeights`/`weightLine`/
`evalBtn`(`.wcard`는 실사용 `display:none` 하드코딩이라 이미 죽어있던
UI, 감사 스코프 밖이지만 `state.properties` 유일 소비처라 동시 삭제).
레거시 CSV 내보내기 `exportProps`+내보내기 메뉴 "레거시(기존 매물)"
옵션. `saveBtn`은 트랩②대로 정확히 갈라냄 — `editId`가 실제로는
아무 데서도 set되지 않아(`clearForm`이 매번 비움) `existing` 분기가
100% 도달불가였음을 확인 후 그 죽은 분기만 제거, `saveAsComplexListing`
호출(활성 2계층 저장 라우팅)은 무변경. `index.html`: `propEditModal`
전체, `legacyToggleWrap`/`legacyWrap`(`#tabs`/`#list`), `.wcard`,
`propSortSel`(레거시 정렬 전용, 단지엔 별도 `cxSort` 존재), `editId`
히든필드, `unisearchResult`(레거시 렌더만 갱신하던 죽은 카운터)
삭제. `style.css`: 위 DOM 전용 셀렉터(`.wcard`/`.tabs`/`.tab`/`.rail`/
`.ck-*`/`.airep`/`.aiload`/`.card[data-st]`/`.card.dim`/
`.card.expanded`/`.c-progress*`/`.c-body`) 삭제, `#complexSection`과
공유하는 규칙(`.card`/`.c-actions`/`.card::before` 등)은 selector만
좁혀 유지 — 전수 grep으로 각 클래스가 남은 코드에서 실제로 쓰이는지
개별 확인 후 삭제(예: `.c-act-del`은 매물 상세 삭제 버튼이 여전히
써서 유지, `.c-actions a.naver`는 무소비 확인 후 삭제).

**커밋③**(`state.js`+`profile.js`+`ai.js`): `state.js` JSDoc의
`state.properties` 스키마 블록, `DEFAULT`/`GUEST_STATE`의 `properties`
시드, `applyGuards`의 `guardArr` 보정 블록 삭제 → `delete
state.properties`로 교체(로드마다 옛 백업·미동기 클라이언트가 보낸
필드를 폐기, 다음 save에서 Redis 반영 — 백업 게이트가 선행조건이던
이유). `checklistHTML` 삭제로 유일 소비처를 잃은 `CHECKLIST`/`ORDER`
상수도 함께 삭제(`CHECK`/`SC`/`HEX`는 `SC_CX`/`HEX_CX`가 파생해 쓰므로
유지). **트랩③**: `profile.js`의 `doImport`(백업 복원) — 'full' 백업
안 옛 `properties` 배열은 `applyGuards`가 조용히 버리므로, 복원 전
개수를 미리 세어 "구버전 매물 N곳은 복원 대상 아님" 안내로 표시.
'legacy'(구버전 properties-only, `집구하기맵::` 접두 포함) 백업은
매물 복원 없이 prep/steps만 복원하도록 confirm 문구도 갱신 — 복원
기능 자체는 유지, 조용히 버리지 않음. **B-81 동시 종결**: `ai.js`의
`stateSnapshot()` AI 상담 프롬프트 `[매물]` 컨텍스트를
`state.properties.map` → `state.complexes.map`+`cxRepOf`(대표매물)
기준으로 교체(단지명/상태/대표매물 보증금·전용면적/위치/aiScore).
AI 크레딧 소진으로 실행 검증 불가 — `node --check`+코드 리뷰로 갈음.

**검증**: `node --check` 13개 파일 전부 통과. `grep -rn
"state\.properties|properties\[" js/ index.html` 잔여 **1건**
(`state.js`의 `delete state.properties` 자기 자신 — 삭제 코드가
필연적으로 그 이름을 언급하는 것으로, 데이터를 읽거나 쓰는 잔재
아님. `profile.js`의 백업 복원 코드는 외부 백업 객체(`o.state`)의
필드를 읽는 것이라 대괄호 표기(`o.state['properties']`)로 실질
분리). 나머지 읽기/쓰기 잔재 0건. Playwright 스모크(로컬 Node
UTF-8 정적 서버, 게스트 로그인, 데스크톱 1440+모바일 390, 5탭
순회 + 매물탭 폼 열기/내보내기 메뉴)로 커밋 전(3d0e5c1)·후 콘솔
에러를 비교 — 둘 다 동일한 사전 존재 노이즈(오프라인 샌드박스의
`/api/*` 404·네이버맵 401·무관한 `.box` null 오류 1건, 전부 이번
세션 착수 전부터 재현됨)뿐이고 신규 에러 0건. `/api/login`+
`/api/state` 목업으로 실제 로그인→state 변경→`save()` 왕복 재현 —
POST 바디 최상위 키에 `properties` 부재, `complexes`/`listings`
등 나머지 13개 키 정상 확인.

**동시 작업 발견**: 이번 세션 도중 커맨드센터가 별도로 `api/ingest.js`
(모바일 수집 인박스 API)+`js/boot.js`+`js/scraps-form.js`에
직접 커밋 3개(`c26d2e0`/`a7ddd9a`/`de673ff`)를 올림 — B-05가 손댄
파일과 완전히 겹치지 않아 충돌 없음, 파일 락 위반 아님. 참고로만 기록.

- **B-05 완료·미푸시**(`ad4a9d0`/`be5760e`/`5acbed5`).
- **다음**: properties.js 2분할 재평가(사용자 결정 2026-07-19, 이
  지시서 범위 밖) — 커맨드센터가 별도 발급 예정. 사용자 실기기·
  실배포 확인 권장(특히 백업 복원 문구, 매물 폼 저장 흐름).
