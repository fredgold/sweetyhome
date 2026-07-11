# HANDOFF — 매물탭 리디자인 (P-01)

## 1. 목표
스위티홈 매물 탭을 덱 스펙(카드 재설계·지도 연동·통합검색·반응형)에 맞춰 이식.

## 2. 완료
**P-01 전 범위 완료 + 커밋 + push까지 끝남. 미완 구현 없음.**

커밋 3개, `origin/master`에 fast-forward push 완료 (HEAD: `db0bad6`):
```
b28a8db feat: 매물 카드 재설계 + 통합검색 (매물탭 이식 2/3단계)
ef490e5 feat: 매물 지도 마커·카드 양방향 연동 (매물탭 이식 3단계)
db0bad6 feat: 매물탭 반응형 2단 그리드 (매물탭 이식 4단계)
```
(주의: 커밋 3개 다 `js/properties.js`, `style.css` 건드림. `index.html`은 b28a8db·db0bad6 두 커밋에서 수정. 세 커밋 모두 push 완료 상태라 새로 이어받는 손이 이 파일들 작업 시 최신 pull 먼저 확인할 것.)

파일별 실제 변경 내용:
- **index.html**: `#panel-props` 내부 — `.searchbar`(외부검색 4버튼)+`.prop-search-bar`(세대수/노선 select) 제거, `.unisearch` 통합검색 1개로 교체. `.mapcard`를 `.grid`의 직속 자식으로, `.unisearch`를 `.grid > section` 내부로 이동(모바일은 DOM 순서, 데스크톱은 CSS order로 재배치).
- **style.css**: 카드 CSS 전면 재설계(`.c-top`/`.c-headline`/`.c-sub`/`.c-badge-col`/`.c-progress`/`.c-body`), `.unisearch`/`.ur-link` 신설, `.prop-marker`/`.prop-marker-pill` 신설(구 `.prop-pin` 대체), `@media(min-width:900px)` 2단 그리드 블록(223번째 줄 부근 `.grid` 규칙 이하), `.mapcard.expanded` 모바일 전용 풀스크린 오버레이(279번째 줄 근처 `.rail::before`와는 별개).
- **js/properties.js**: `headlineText`/`subtitleText`/`bodyMetaChips`/`markerHtml`/`markerLabel`/`visibleProperties`/`selectFromMap`/`scrollCardIntoView`/`reselectMarker`/`setMapExpanded`/`updateNavHeightVar`/`handleBreakpointChange`(96~154번째 줄 부근) 신설. `renderList()`/`refreshOverview()` 전면 재작성. `locate()`를 popup 방식에서 `panTo`+`reselectMarker`로 교체. `propGradeFilter`/`propLineFilter`/`renderLineFilter()` 제거.

검증: 헤드리스 Chrome(CDP 직접 제어)으로 4단계 전부 스크린샷+콘솔에러 확인. 완료 체크리스트 8개(카드밀도·리사이즈·마커연동·필터동기화·검색·터치타깃·aria·타탭회귀) 전부 실측 통과.

세션 중 발견·수정한 버그 3건 (전부 위 커밋 메시지에 상세 기록됨):
1. `.grid` 그리드 아이템 `min-width:auto` 오버플로 → `minmax(0,1fr)`
2. 마커 히트박스 16px로 눌리던 문제 → `.prop-marker` `display:inline-flex`
3. 390↔1280 리사이즈 시 지도 타일 안 채워지던 타이밍 버그 → 이중 `requestAnimationFrame`

### Codex 후속 리뷰
- 후속 수정 커밋: `e38bef4 fix: harden property search and map refresh` (로컬 `master`, push 여부는 다음 작업 시 `git status`/`git log`로 확인).
- 검색 `input` 리스너 중복 등록 제거: 키 입력당 목록·지도 렌더 1회로 정리.
- 지도 갱신 키에 좌표를 포함해 기존 매물 위치 수정 시 뷰포트도 재조정. 마커 표시 상태가 같으면 Leaflet 마커 전체 재생성 생략.
- 통합검색에 `householdGrade`/`households` 포함, 외부 링크에 `rel="noopener"` 보완.
- `js/state.js` 상단 `state.properties` 스키마 주석을 실제 가드 필드와 맞춤.
- 검증: `git diff --check`, `node --check js/properties.js`, `node --check js/state.js` 통과. 브라우저·실기기 재검증은 아래 2건과 함께 진행.
- 남은 확인은 아래 실기기 2건과 `.rail::before` 시각 디테일뿐. `BACKLOG.md`는 수정하지 않음.

## 3. 미완
구현 자체는 없음. 남은 건 **실기기 확인 2건** (헤드리스로는 검증 불가):
- iOS Safari에서 `#prop_search`(통합검색 input) 포커스 시 자동확대 실제로 안 되는지 — `style.css`에 `font-size:16px` 지정은 돼있으나(코드 기준 검증만 완료) 실기기 최종 확인 안 됨
- `js/properties.js`의 `.prop-marker` 마커를 엄지로 눌러본 조작감 — 44px 히트박스는 실측(69×48px)했지만 실기기 촉감 확인 안 됨

백로그 (기능 영향 없음, 후속 처리 대상):
- `style.css:279` `.rail::before`(좌측 타임라인 그라데이션 선) — 데스크톱 `.rail`이 내부 스크롤 컨테이너가 되면서 이 선이 뷰포트 높이 기준으로만 그려짐. 스크롤한 카드까지 선이 안 이어짐(순수 시각 디테일, 타임라인 도트 자체는 각 카드에 정상 표시).

## 4. 다음 단계
1. 배포된 Vercel URL을 실제 아이폰(사파리)으로 열어 위 "미완" 2건 확인
2. 문제없으면 `BACKLOG.md`의 P-01 항목은 손대지 말 것 — **커맨드 센터가 커밋 로그 확인 후 직접 삭제**함(BACKLOG.md는 커맨드 센터 전용 편집권, 손 A/B는 읽기 전용)
3. 문제 있으면 해당 파일만 수정 → 새 커밋(기존 3개에 amend 금지, 이미 push됨)

## 5. 주의점
- **BACKLOG.md 편집 금지.** 읽기 전용. 완료 보고는 커밋 메시지로만 (이미 완료).
- `PSC_01`/신규 지시는 P-01 관련 3개 파일(index.html/js/properties.js/style.css)에 아직 열려있을 수 있으니, 이어받는 손은 작업 전 `git log --oneline -5`로 이 세션 커밋이 반영됐는지 먼저 확인.
- 커밋 3개는 세션 중 `git rebase --onto`로 메시지만 리워드(내용 diff는 백업 브랜치와 바이트 단위 대조 후 삭제 완료, 안전 확인됨) — 이미 push까지 끝나서 추가로 rebase/amend 금지.
- 자산·수집함 탭에 같은 패턴 이식하는 "2차 라운드"는 **아직 시작 안 함** — 매물탭 실사용 몇 주 후로 사용자가 명시적으로 보류.
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함(보안 제약 준수).

## 6. 컨텍스트
- 이 레포는 "머리(커맨드 센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업 구조. SSOT는 CLAUDE.md, 실행 규칙은 AGENTS.md, 이력은 HISTORY.md(단, HISTORY.md 최신 tail은 Kakao Maps API 등 현재 구조와 안 맞는 구버전 내용이 섞여있어 보임 — CLAUDE.md의 Leaflet.js 기준이 맞음).
- 참조 목업(`docs/스위티홈 매물탭 리디자인 (standalone).html`)은 React 기반 번들(DCLogic/x-dc)이라 프레임워크 래퍼는 이식하지 않고 컴포넌트 로직만 추출해 바닐라 JS로 재작성함 — 원본 파일은 22MB(폰트+이미지 포함)라 직접 읽지 말고 필요시 gzip 압축된 `__bundler/manifest` 스크립트 블록을 디코딩해서 볼 것(이번 세션에서 한 방법 그대로).
- 데스크톱(≥900px) 2단 그리드는 덱의 "리스트 480px 고정" 스펙을 있는 그대로 안 따르고 `minmax(0,360px)`로 축소함 — 전역 `.wrap`(max-width:980px)을 안 건드리는 선에서 타협한 것, 사용자 승인됨.
