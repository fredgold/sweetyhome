# HANDOFF — 매물탭 UI 수정 5건 (2026-07-11)

## 1. 목표
`QA_2026-07-11.md` 기반 매물탭 UI 버그·개선 5건. 지도 API(네이버 전환) 작업과는 별도, CSS·카드 마크업·링크 제거 위주.

## 2. 완료
**5건 전부 완료 + 기능 단위 커밋 5개. push는 아직 안 함.**

```
06533af fix: 매물 상태 필터 칩 상단 클리핑
ac72a31 refactor: 매물 외부검색 링크(네이버·호갱노노 등) 제거
8da4f45 feat: 매물 카드 헤드라인을 단지명으로 (위계 변경)
67b05cf style: .wrap 최대폭 1440px로 상향
24501a6 fix: 임장루트 리스트 세로 깨짐 — route-bar 세로 스택
```

파일별 실제 변경 내용:
- **style.css**:
  - `.route-bar`를 `flex-direction:column;align-items:stretch`로 변경(base 승격). `.rb-actions`(버튼 4개, 281px)가 row 레이아웃에서 `.rb-route`를 35px로 압축시켜 매물명이 한 글자씩 세로로 깨지던 문제. 480px 미디어쿼리의 동일 규칙은 중복이라 제거.
  - `.wrap` max-width 1160→1440px. 매물 2단 그리드는 리스트 컬럼이 `minmax(0,360px)`로 고정돼 있어 늘어난 폭은 지도(1fr) 쪽으로 흡수됨.
  - `.c-headline`/`.c-sub` 위계 스왑 관련 주석 갱신("헤드라인=단지명·역·호선, 부제=보증금·전용면적").
  - `unisearch-result`의 `.ur-link*` 관련 CSS(죽은 코드) 제거.
  - `.tabs{flex-shrink:0}` 추가 — 아래 "발견한 이슈" 참고.
- **js/properties.js**:
  - 매물 카드 `.c-headline`/`.c-sub` 내용 스왑: 헤드라인=`subtitleText(p)`(단지명·역·호선), 부제=`headlineText(p)`(보증금·전용, `tnum` 클래스 이동). 상태 뱃지·실사 진행률·확장 토글 위치는 변경 없음.
  - `updateUnisearch()`에서 외부 검색 링크(`ur_land`/`ur_hogang`/`ur_naver`/`ur_rt`) href 채우던 로직과 관련 클릭 핸들러 제거. 검색어 있을 때만 "내 목록 N곳 검색됨" 표시, 없으면 결과 영역 숨김. `prop_search` 필터 기능(line 640 부근)은 그대로 유지.
- **js/utils.js**: `updateUnisearch`에서만 쓰이던 `siteUrl()` 헬퍼 제거(죽은 코드). `gUrl`/`nmapUrl`/`landUrl`/`naverUrl`은 체크리스트·카드 액션에서 계속 쓰여 유지.
- **index.html**: `unisearch-result` 안의 외부 검색 링크 마크업(네이버부동산/호갱노노/네이버지도/실거래가 4개 `<a>`) 제거. 검색 input(`#prop_search`)은 유지.

### 발견한 이슈 — 상태 필터 칩 클리핑 (수정 5)
QA 문서엔 "재현 필요"로 남아있던 항목. Playwright(임시 설치, 세션 종료 후 제거)로 로컬 정적 서버 띄우고 게스트 모드로 매물 25개를 시드해 실측 재현함:
- 원인: `.tabs{overflow-x:auto}`는 CSS 스펙상 `overflow-y`도 `auto`로 승격시키고, 이게 flex 아이템의 "자동 최소높이"를 0으로 만듦. ≥900px 좌측 컬럼(`.grid>section`, `max-height:calc(100vh - nav - 24px)` 고정)에서 매물이 많아 컬럼 내용이 넘치면 flexbox가 `.tabs`를 콘텐츠 높이(31px) 대신 7px대까지 짓눌러 칩이 빈 것처럼 잘려 보임.
- 수정: `.tabs`에 `flex-shrink:0` 추가. 압축은 원래 그 역할이던 `.rail`(`flex:1`, 내부 스크롤)이 전담.
- 실측: 수정 전 `.tabs` 렌더 높이 7.45px(스크롤 높이 22px) → 수정 후 31px(스크롤 높이와 일치, 클리핑 없음). 스크린샷으로도 확인.

검증: `node --check` 전체 통과. Playwright로 대시보드·자산·매물·액션·수집함 5개 탭 전환 + 매물 25개 시드 렌더링 회귀 확인, 콘솔 에러 없음(네이버 지도 도메인 인증 401/404는 로컬 테스트 환경 특성상 예상된 것, 코드 무관).

## 3. 미완
- **push 안 함** — 로컬 커밋 5개만 있는 상태. 사용자 확인 후 push 필요.
- `.route-bar`의 select 모드(매물 선택 단계) UI는 코드 검토로만 확인, 실측 스크린샷은 못 찍음(테스트 시드 매물에 좌표가 없어 실제 루트 생성까지는 못 감. `.rb-info`+`.rb-actions` 컬럼 스택도 로직상 자연스럽게 적용됨).

## 4. 다음 단계
1. 사용자 확인 후 `git push`.
2. 실브라우저에서 매물 카드 헤드라인/부제 위계 변경 체감 확인(특히 단지명이 긴 경우 줄바꿈 여부).
3. 임장 루트 실제 생성(좌표 있는 매물 2곳 이상)해서 세로 스택 레이아웃 최종 확인.

## 5. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- 이번 세션은 지도 API(네이버 전환) 작업과 파일이 겹치지 않게 진행함(`js/properties.js`는 겹쳤지만 수정 영역이 카드 마크업·통합검색 텍스트 로직으로, 지도 인스턴스(`naver.maps.*`) 코드는 건드리지 않음).
- 로컬 회귀 테스트용으로 `playwright`를 `npm install --no-save`로 임시 설치했다가 확인 후 `npm uninstall`로 제거함 — `package.json`엔 흔적 없음(`node_modules`는 gitignore).
- **매 작업(커밋 단위) 완료 후 이 문서를 그 세션 기준으로 갱신하는 규칙 계속 준수**(사용자 명시적 요청, 2026-07-11).

## 6. 컨텍스트
- 이 레포는 "머리(커맨드 센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`.
- 직전 세션(HEAD `dc32ea0` 이전)은 QA 여백 수정 + 로고 통일 + 지도 API 전면 교체(Leaflet→네이버) 완료·push까지 끝난 상태였음. 이번 세션은 그 위에 매물탭 UI 5건을 이어서 진행.
