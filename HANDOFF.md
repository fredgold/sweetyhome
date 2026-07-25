# HANDOFF — B-05 완료 (2026-07-25) 레거시 properties[] 완전 삭제

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

---

# 이전 핸드오프 — B-127+B-128 완료 (2026-07-20) ESC 모달 닫기 + 편집 모달 삭제 버튼

## 최신 작업: ESC로 모달 닫기(중첩 3겹 대응) + 수집함 편집 모달 삭제 버튼

```
0e0efda feat: ESC로 모달 닫기 (B-127)
fc9e1ec feat: 수집함 편집 모달에 삭제 버튼 (B-128)
```

커맨드센터 발급 지시서로 착수(사용자 피드백 2건). 손 A 단독,
지시대로 2커밋 분리. 파일 락: `utils.js`(①)·`scraps-form.js`+
`index.html`(②) — `properties.js`는 이번엔 무편집(닫기 함수를
전역 식별자로 참조만 해서 됨, 아래 설명).

**B-127**(`utils.js`, `openModal`/`closeModal` 바로 아래): 전역
`keydown` 리스너 1개로 라이트박스(`scLightboxModal`) > 매물 상세
사이드 패널(`cxListingDetailBox`, `complexDetailModal` 안에 중첩) >
`.modal.open` 본체(DOM상 마지막 = 최상위) 순으로 한 겹씩만 닫음 —
`closeModal`/`closeListingDetail`은 properties.js가 정의한 전역
식별자를 utils.js에서 이름으로 그대로 참조(클래식 스크립트라 로드
순서와 무관하게 실행 시점엔 이미 정의돼 있음 — properties.js 무편집
가능했던 이유). **우선순위 판정**: ①`e.defaultPrevented`면 즉시
리턴 — 슬래시 메뉴가 Tiptap Suggestion 경로든 폴백 경로든 둘 다
Escape에서 `preventDefault()` 후 자체 처리하므로 이걸로 위임(Tiptap
쪽은 `@tiptap/suggestion`이 `onKeyDown`이 `true` 리턴 시 내부적으로
preventDefault 호출한다는 걸 실제 CDN 로드 성공 케이스로 3회 반복
재현해 확인 — 문서로만 신뢰하지 않음). ②`.slash-menu` 요소가 실제
`display:block`인지 추가 확인(이중 안전망). ③로그인 오버레이가
안 숨겨져 있으면 완전 제외(로그인 화면에서 ESC 무동작, 기존 그대로).
④`document.activeElement`가 input/textarea/contenteditable이면
`blur()`만 하고 리턴 — **1차 ESC는 포커스 해제, 2차 ESC부터 실제로
닫힘**(오타로 긴 메모 작성 중 실수로 모달이 통째로 닫히는 사고 방지).
status-picker는 `.modal` 클래스가 아니라(`position:absolute` 플로팅
메뉴, 기존 바깥클릭으로만 닫힘) 이 로직 자체가 손대지 않아 자연히
제외됨 — 별도 예외처리 코드 불필요.

**검증**(Playwright, 로컬 Node UTF-8 정적 서버+`/api/state` 목업):
3겹 인위 스택(`complexDetailModal`+`cxListingDetailBox`+
`scLightboxModal` 동시 open) → ESC 3연타로 라이트박스→패널→모달
순서대로 한 겹씩만 닫힘 실측. 에디터 포커스 케이스 — `sem_title`
포커스 중 1차 ESC는 blur만(모달 유지), 2차 ESC에서 닫힘. 슬래시
메뉴 — 폴백 경로(esm.sh `route().abort()`로 강제)와 Tiptap 성공
경로(재시도로 3회 모두 CDN 도달) **양쪽 다** 실측: ESC 1회에 메뉴만
닫히고 모달은 안 닫히고 포커스도 안 풀림(슬래시 처리가 전량 소비),
그 다음 ESC로 blur, 그 다음 ESC로 모달 닫힘 — 3단 체인 전부 확인.
로그인 오버레이에서 ESC 무동작(오버레이 계속 표시) 확인. 아무것도
안 열려있을 때 ESC 눌러도 에러 없음(no-op) 확인. 모바일 390에서
기존 취소 버튼 닫기 무회귀 확인. `node --check` 전체 js 통과.

**B-128**(`index.html`+`scraps-form.js`): B-123이 카드뷰를 압축하며
카드 자체에 버튼을 없앤 부작용으로, 카드뷰에서 삭제하려면 리스트뷰로
가야 했던 것 해소 — 편집 모달(`scEditModal`) `mfoot`에 "삭제" 버튼
추가(왼쪽 끝 `margin-right:auto`로 저장/취소와 시각 분리, 기존
`--s-drop` 위험 톤 재사용 — 리스트뷰 삭제 버튼과 동일 색상 재사용,
새 색상 없음). 클릭 시 `scraps-render.js`의 목록 삭제(`data-sc-del`)
와 **완전히 동일한 confirm 문구·동일 필터 경로** 재사용(`state.
scraps=state.scraps.filter(...)`+`save()`+`renderScraps()`), 성공
시 `closeModal('scEditModal')`.

**검증**: 갤러리 카드 클릭(카드 본문, B-123①의 이미지 클릭과 분리된
그 영역) → 편집 모달 열림 → 삭제 클릭 → confirm **거부** 시 항목·
모달 상태 완전 무변화 확인 → 삭제 다시 클릭 → confirm **수락** 시
해당 항목만 제거되고 다른 항목은 그대로, 갤러리 DOM에서도 카드
사라짐, 모달 닫힘 확인. **Redis 왕복**: `/api/state` POST 바디를
목업 서버로 캡처해 삭제된 스크랩 id가 실제로 전송 바디에서 빠져있고
남은 항목만 있음을 실측(로컬 상태만이 아니라 동기화 페이로드까지
확인). 모바일 390에서 버튼 노출·좌우 위치(삭제 x=32, 취소 x=256로
확연히 분리)·클릭 동작 확인. `node --check` 통과.

- **B-127/B-128 완료·push 완료**(`0e0efda`/`fc9e1ec`).
- **다음**: 사용자 별도 지시 대기.

---

# 이전 핸드오프 — B-126 완료 (2026-07-20) 액션 번호 그룹 로컬화

## 최신 작업: 액션 행 번호 전역 일련→그룹 내 로컬(1부터)

```
8a1f6f3 fix: 액션 행 번호를 그룹 내 로컬 번호로 (B-126)
```

커맨드센터 발급 지시서로 착수(사용자 스크린샷 지적 — 그룹 칼럼 분리
후에도 번호가 전역이라 매물준비 5부터·계약 9부터 시작해 칼럼별
우선순위가 안 나뉜 것처럼 보임). 손 A 단독 파일 락(`actions.js`),
지시대로 1커밋.

**수정**(`actions.js` `renderActions()`): 표시 번호만 전역
`liveRanks`(전체 `live` 배열 인덱스+1) → 그룹별 `groupLiveRanks`로
교체 — `ACT_GROUPS` 각 그룹 키로 `live`(이미 우선순위 정렬+검색/분류
필터 반영된 배열)를 필터링해 그룹 내 인덱스+1을 매핑. 이 필터 로직은
바로 아래 실제 렌더 루프(`live.filter(a=>actGroupKey(a)===group.key)`)
와 완전히 동일해 번호와 실제 표시 순서가 항상 일치. **priority
값·정렬·드래그(`actReorder`/`actMoveByButton`)·`groupOrders`(▲▼
활성화 판정용)는 전혀 손대지 않음** — 이미 그룹 내 독립 동작이던
내부 로직 그대로, 렌더 시 번호 계산 한 곳만 교체(순수 표시 버그
수정, 스키마·로직 무변경).

**검증**(Playwright, 로컬 Node UTF-8 정적 서버, 데스크톱 1440×900+
모바일 390×844): 3그룹(일반·매물준비·계약) 각각 독립 데이터로 seed
→ 전부 1부터 시작 확인. 완료 행은 `.rank` 엘리먼트 자체는 존재하되
텍스트가 빈 문자열(기존 동작 그대로, 번호 미표시) 확인. **드래그
재정렬**(B-124와 동일한 네이티브 마우스 드래그 시뮬로 a3→a1 앞으로
이동) 후 매물준비 그룹만 1·2·3으로 재계산되고 다른 그룹(일반) 번호는
영향 없음 확인. **완료 처리**(a1 done) 후 같은 그룹 나머지 항목이
1부터로 당겨짐 확인, **삭제**(a2) 후에도 마찬가지로 당겨짐 확인.
**분류 필터 탭**(매물준비 단독·계약 단독·일반(`__none__`) 단독)
각각에서도 보이는 항목이 1부터 시작 확인. **모바일 390px**에서
동일하게 그룹별 1부터 시작 확인 + 모바일 전용 ▲ 버튼으로 이동해도
번호가 정상 재계산됨을 실측(드래그 핸들이 숨겨지는 폭이라 ▲▼ 경로
별도 확인 필요했음). `node --check` 전체 js 통과.

- **B-126 완료·push 완료**(`8a1f6f3`).
- **다음**: 사용자 별도 지시 대기.
