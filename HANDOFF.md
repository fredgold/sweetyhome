# HANDOFF — B-93 전역 토스트 완료 (2026-07-18)

## 최신 작업: B-93

- `utils.js`에 `toast(msg)`를 추가했다. `#appToast`가 기존
  `.prop-toast` CSS를 재사용하며 매물용 `#propToast`와 공존하고,
  마지막 호출 3.5초 뒤 자동 소멸한다.
- 수집함 추가·편집 모달 저장, 액션 추가, 자산 항목 추가·노트 저장,
  프로필 저장에만 짧은 성공 토스트를 연결했다.
- 자산 행 편집은 별도 저장 버튼 없는 입력 즉시 자동저장이므로 지시의
  스팸 금지에 따라 토스트를 붙이지 않았다. 타이핑·blur·완료 토글 등
  나머지 자동저장/즉시 피드백 경로도 무토스트다.
- Playwright 1440×900 + 390×844에서 모든 연결 지점, 자동 소멸,
  `propToast` 공존, 모달 상단 적층(9999 > 1100), 자동저장
  무토스트를 통과했다. 변경 JS `node --check`와
  `git diff --check`도 통과했다.
- `properties.js`·`api/` 무접촉. 매물 `showPropToast()` 통합은
  후속으로 남겼다.

---

# 이전 핸드오프 — B-99 위치찾기 근본 수리 완료 (2026-07-18)

## 최신 작업: B-99

```
593c2e9 feat: geocode 검색 API 폴백
a073fad feat: 단지 상세 위치 재검색 상시화
```

⚠️ **좌표 스케일 미실측 고지**: `vercel env pull`로 프로덕션
시크릿을 로컬에 받으려는 시도가 세션 안전장치에 차단됐고(정당한
차단으로 판단, 우회 시도 안 함), `/api/geocode`는 Bearer 인증이
걸려 있어 실PIN 없이는 직접 호출도 불가능하다. mapx/mapy 스케일은
네이버 검색(Local) API v1의 **공개 문서화된 동작**(경도/위도×10^7,
WGS84)에 근거해 구현하고, 가정이 틀려도 잘못된 좌표가 조용히
반영되지 않도록 대한민국 좌표 범위(위도 32~39·경도 124~132) 밖이면
실패 처리하는 방어선을 넣었다. **지시서가 요구한 "가양6단지" 등
실단지 커버리지 표는 이번엔 채우지 못함** — 로그인이 필요해 배포
후 사용자 직접 확인 요청.

**커밋① `api/geocode.js`**: 기존 Geocoding 실패 시 네이버 검색
(Local) API로 2차 폴백. 원쿼리 1회 → 실패 시 시/도·구/군·동 접두
제거한 "단지명만" 쿼리 1회, 총 2회 상한. 응답 계약
`{ok,lat,lng,address}` 동일 유지(프론트 무변경). 키는 요청 헤더
에만, URL·로그·응답 노출 없음(격리 테스트 확인). 기존 Bearer
인증·레이트리밋 가드 유지.

**커밋② `index.html`+`js/properties.js`**: `#cxDetailFindLocBtn`을
좌표 없을 때만 뜨던 오버레이에서 꺼내 단지 상세 상시 노출 "위치
재검색" 버튼으로 승격(신규 UI 원칙). 좌표가 이미 있는데 재검색이
다른 값을 찾으면 `confirm()` 확인 후에만 반영(B-92와 동일 원칙),
동일 좌표면 확인 생략, 좌표 없던 경우는 즉시 반영. **부수 발견**:
버튼이 상시 노출로 바뀌며 B-92의 잠재 버그(성공 경로에서 버튼
disabled 원복 누락 — 예전엔 오버레이가 숨어 안 보였음)가 드러나
같이 수정.

**검증**: 로컬 Playwright(데스크톱 1280px+모바일 390px 18개) +
고립 유닛테스트(fetch 모킹, 12개) + 좌표없음 경로(4개) = 34개 전부
통과. `node --check` 통과. B-90 추가흐름·B-91/92 수정모드 무회귀.
손 B가 B-93(전역 토스트)으로 `utils.js`·`actions.js`·`assets.js`·
`profile.js`·`scraps-form.js` 동시 작업 중이라 5개 파일 전혀
건드리지 않고 스테이징도 안 함(작업 전·커밋 직전 매번 `git status`
확인).

- **B-99 완료(코드)**. push는 검증 완료 후 진행.
- **사용자 확인 요청**: 배포 후 "가양6단지" 포함 좌표 없는 단지들
  재검색 실행 → 성공 여부 알려주시면 커버리지 HISTORY에 추가 기록.

---

# 이전 핸드오프 — B-98 매물탭 높이·스크롤 복구 완료 (2026-07-18)

## 최신 작업: B-98

- 데스크톱 `#panel-props` 높이를 실제 panel top 기반
  `100dvh - --props-panel-top`으로 일원화하고 과거 `-20px` 보정을
  제거했다. 매물 활성 `.wrap`은 정확한 viewport shell로 제한했다.
- `#complexSection`, `.rail`, `.modal .mbody`에 overscroll contain.
- 추가 폼은 데스크톱 좌측 section, 모바일 하단 시트가 각각 독립
  스크롤해 저장 버튼까지 도달한다.
- Playwright 1440×900 document maxScroll=0, panel bottom=900px.
  모바일 390×844 폼 608px 스크롤 후 저장 버튼 도달. 폼 개폐,
  지도↔목록, 모달 왕복 통과.
- 변경 파일: `style.css`, `js/nav.js`, 기록 문서. `properties.js`
  무접촉.

---

# 이전 핸드오프 — B-91+B-92 매물 수정모드 전환 완료 (2026-07-18)

## 최신 작업: B-91+B-92 (신규 UI 원칙 적용 1호)

```
fefb0ec feat: 매물 수정모드 전환 UI (B-91)
7bbb381 feat: 매물 수정모드 자동찾기·자동채우기 (B-92)
```

`js/properties.js`(+`index.html` 1줄, B-92만)만 수정. `style.css`는
손 B의 B-96 작업 중이라 무접촉 — 기존 `.paste`/`.btn-fill`/
`.btn-find`/`.c-actions` 클래스만 재사용, 신규 CSS 없음. 스키마
변경 없음.

**B-91**: B-63 접이식("매물 정보 수정 펼치기/접기")을 제거하고 매물
행에 항상 보이는 "수정" 버튼으로 교체 — 클릭 시 6필드(dongHo·
areaM2·areaText·deposit·listingStatus·memo) 입력폼 노출, "저장"/
"취소" 명시 버튼으로 종료. 값은 "저장" 클릭 전까지 `listing`
객체에 반영 안 됨(DOM 자체가 버퍼, "취소"는 재렌더로 폐기 —
값 무손실). `cxListingEditExpanded`→`cxListingEditMode`로 개명.

**B-92**: ADD 폼 전용이던 위치 자동찾기·정보 자동채우기를 수정모드에
연결. 자동채우기(보증금·전용면적·메모, `parseNaver`+AI 폴백)는
편집폼 안에 `.paste` 재사용해 추가 — 기존 값을 덮어쓸 땐
`confirm()`으로 변경 내역 보여주고 확인(조용히 덮어쓰기 금지).
위치 자동찾기는 실제로는 단지(`complexes[]`) 소유 필드라(listings엔
lat/lng 없음) 단지 상세의 "좌표 확인 필요" 오버레이에 재검색 버튼을
신설 — B-90 패턴(진행 표시·실패 문구·실패가 다른 동작을 막지 않음)
재사용.

**검증**: Playwright 데스크톱 1280px+모바일 390px, 51개 체크 전부
통과 — 수정 버튼 상시노출, 구 아코디언 완전 제거, 저장/취소 왕복
무손실, 자동채우기 확인 다이얼로그(수락/거부 각각), 위치 자동찾기
성공/실패, B-90 추가흐름·B-27-lite 안전체크·대표매물·관리비
tri-state 무회귀. 커밋 분리를 위해 B-91 단독 버전도 별도 검증 후
커밋, B-92 복원 후 전체 재확인 후 커밋 — 두 커밋 모두 각자 단독
동작 확인.

- **B-91+B-92 완료**. push는 검증 완료 후 진행 가능(지시대로).

---

# 이전 핸드오프 — B-96 완료 + B-94 스크롤 진단 완료 (2026-07-18)

## 최신 작업: B-94 진단

- 제품 코드 변경 없이 `HISTORY.md`에 데스크톱·모바일 전 탭 스크롤
  컨테이너, sticky/fixed/z-index, 문제점과 후속 규모를 기록했다.
- 핵심: 문서형 4탭=document 스크롤, 매물 데스크톱=내부 목록 스크롤,
  모바일 매물 지도=fixed/목록=document 스크롤.
- B-46 잔여를 1440×900에서 document maxScroll 53px로 재현했다.
  panel 실제 시작 y와 `--topbar-h` 기반 height 계산의 좌표계 불일치,
  과거 20px 상수가 직접 원인이다.
- 권장 순서: ①매물 높이 좌표계 일원화+overscroll 차단(10~25줄)
  ②B-53 topbar wrapper(30~70줄). 전 탭 app-shell 재편은 보류.
- 손 A 작업 중인 `properties.js`는 읽기 진단만 했고 수정·스테이징하지
  않았다.

---

# 이전 핸드오프 — B-96 대시보드 더보기 커서 완료 (2026-07-18)

## 최신 작업: B-96

- 커밋 예정: `style: 대시보드 더보기 cursor pointer (B-96)`
- `style.css`의 `.actmore` 한 줄에 `cursor:pointer` 추가.
- Playwright 데스크톱·390px 모바일에서 계산 커서와 액션탭 이동·목록
  표시 통과.
- 손 A의 `properties.js`는 수정·스테이징하지 않았다.
- 이어서 B-94 스크롤 아키텍처 진단을 코드 변경 없이 진행한다.

---

# 이전 핸드오프 — B-90 매물 추가 흐름 파손 진단·수정 완료 (2026-07-18)

## 최신 작업: B-90 (🔴 코어 파손)

```
3f6652c fix: 매물 추가 흐름 — 반영·스크롤·지오코딩 (B-90)
```

**진단 결론(중요)**: 지시서가 의심한 B-19확(`696bdb7`) 매칭 제안
모달의 콜백 누락/저장 경로 누락은 **재현 안 됨** — 신규 단지·완전
일치·후보 수락·후보 거절 후 신규·후보 취소·새로고침 영속성까지 6개
경로를 Playwright로 직접 실행해 매번 정상 동작 확인. **①은 데이터
유실이 아니라 표시(인지) 문제로 확정.**

**실제 원인**: `saveAsComplexListing()`이 신규 단지 좌표 조회
(`/api/geocode`)를 `await`로 막고 있었고, `saveBtn`은 그 동안
disabled·로딩 표시가 전혀 없었음. 지오코딩이 느리면(레이트리밋 등)
클릭 후 몇 초간 화면이 무반응으로 보여 "반영 안 됨"·"스크롤 안 먹음"
둘 다로 느껴졌고, 그 사이 버튼이 계속 눌려 있어 **더블클릭 시 매물이
실제로 중복 생성되는 데이터 버그**를 재현·확인(지오코딩 3초 지연 +
더블클릭 → listings 2건 생성).

③(raw JSON)은 현재 코드 어디서도 문자 그대로 재현 안 됨(추가 폼
`findBtn`은 이미 사람이 읽는 문구 사용 중) — 가장 가까운 실제 결함인
수정 모달 `em_findBtn`의 완전 무반응(실패해도 문구 없이 조용히 원상
복구)을 신고의 실체로 보고 수정.

**수정**(`js/properties.js` 1파일, 스키마 변경 없음, 신규 접이식 UI
없음):
1. 신규 단지 좌표 조회를 `await`→`.then()`으로 비차단화 — 좌표 없이
   먼저 저장·폼닫기·렌더 완료, 지오코딩은 백그라운드에서 성공 시
   `cx.lat/lng` 갱신+재저장+재렌더.
2. `saveBtn.onclick`을 `try/finally`로 감싸 클릭 즉시 disabled+"처리
   중…" 표시, 모든 경로(성공/취소/에러)에서 항상 복구.
3. `em_findBtn` 실패 시 `findBtn`과 동일한 패턴으로 "못 찾음 — 지도
   탭"/"검색 실패" 문구 추가.

**검증**: Playwright 데스크톱 1280px+모바일 390px — 추가 5경로 저장·
표시 확인, 새로고침 영속성 확인(POST 캡처→GET 재생 모킹), 지오코딩
3초 지연 시 폼 즉시 닫힘+스크롤 즉시 해제 확인(이전엔 3초간 잠김),
같은 지연 상황 더블클릭 시 중복 생성 재발 안 함(첫 클릭으로 폼이 이미
닫혀 2번째 클릭 무효), 백그라운드 지오코딩 성공 시 좌표 갱신 확인,
`em_findBtn` 실패 문구·정상 원복 확인. `node --check` 통과.
테스트환경 고유(가짜 네이버 키) SDK 내부 오류는 우리 코드와 무관 확인.

- **B-90 완료**. 다른 파일 작업자 없다고 명시돼 `properties.js` 외
  접촉 없음. 저장 성공 토스트는 지시대로 B-93 범위로 남김.
- push는 검증 완료 후 진행(지시대로).

---

# 이전 핸드오프 — B-82 CLAUDE.md(SSOT) 갱신 완료 (2026-07-18)

## 최신 작업: B-82

코드 무변경, `CLAUDE.md` 1파일만 수정.

```
87ebb2e docs: CLAUDE.md 스키마·저장·인증 서술 실코드 동기화 (B-82)
```

- **상태 스키마 요약**을 flat `properties[]` 단일 서술 → 2계층
  (`complexes[]`/`listings[]`) 기준으로 교체. `listings[].safety`
  9항목, `complexes[].commutes`/`commuteMemo`, `scraps[].imgs`+`img`
  미러 규칙, `settings.owners`/`commuters` 반영. 레거시
  `properties[]`는 "은퇴 예정(B-05)·수정 경로 일부 활성" 명시.
- **Redis 키**: 서버 `'sweetyhome:state'`와 localStorage
  `'sweetyhome'` 분리 명기(기존 문서는 혼동 소지 있었음).
- **저장 패턴**: B-84/B-80 반영 — 디바운스 800ms+maxWait 5s, 이탈
  flush(keepalive), `sh_unsynced` 플래그, 동기화 칩 6개 상태 전부
  나열, 서버 4MB 상한(413).
- **주요 ID 레퍼런스**: 단지 매칭 제안 모달·단지 상세 출퇴근·통근
  기준지 설정 3영역 4행만 소량 보충(안전 체크는 class+data속성
  패턴으로 기록, 과도한 확장 자제).
- **인증**: `sessionStorage` → `localStorage sh_token`+
  `sh_token_exp`로 서술 갱신.
- renderMd 방어범위 서술(B-64 갱신분)은 그대로 유지.

**검증**: 갱신 내용 전부(파일명·키·필드명·함수명)를 실코드와
교차 확인 — `js/state.js` 상단 JSDoc, `js/auth.js`, `api/state.js`
KEY/MAX_STATE_BYTES, `index.html`+`js/properties.js`의 신규 ID
grep 실존 확인. 문서만 변경이라 별도 실행 검증 불필요.

- **B-82 완료**. push는 검증 완료 후 진행(지시대로).
- BACKLOG.md "코드 점검 발견" 섹션의 감사 발견 트랙(B-80~B-89)
  전부 완료 — B-81(AI 크레딧 복구 시)·B-85(사용자 결정 대기)만
  잔여.

---

# 이전 핸드오프 — B-80 저장 실패·미동기·만료 상태 표시 완료 (2026-07-18)

## 최신 작업: B-80

원칙: 실패·미동기를 **드러내기만** 한다. 자동 삭제·자동 압축·자동
복구는 하지 않는다.

```
dd99e99 fix: 저장 실패·미동기·만료 상태 표시 (B-80 ①)
3145fc5 fix: state POST 크기 상한 (B-80 ②)
```

**커밋① (`js/state.js`·`index.html`·`style.css`)**
- `save()`의 `localStorage.setItem` 실패를 `localfail` 칩 상태로
  드러내고, 콘솔 warn에 실패 시점 state 크기(KB) 포함.
- B-84가 남긴 `sh_unsynced` 플래그를 `load()`에서 확인해 1회성
  배너(`#unsyncedBanner`) 노출, 실제 동기화 성공 시에만 플래그+배너
  자동 해제(배너 닫기는 표시만 숨기고 플래그는 유지).
- `syncToRedis()` 401 → 신규 `expired` 상태 + 기존 `forceLogin()`
  재사용으로 로그인 오버레이 재노출(`auth.js`는 무수정). 413 → 신규
  `toolarge` 상태.
- `style.css`는 기존 `.chip-warn` 경고 색 재사용, 신규 변수·파일
  없음.

**커밋② (`api/state.js`)**
- POST body 4MB 상한 추가, 초과 시 413 + 용량 안내 메시지. 구조
  검증은 객체 여부만(과검증 안 함).

**검증**: Playwright 데스크톱 1280px + 모바일 390px, 24개 체크 전부
통과(localStorage 실패, 배너 노출/해제, 세션 중 401→재로그인 안내,
413→용량 초과 표시, 정상 흐름 무회귀). `node --check js/state.js`·
`node --check api/state.js` 통과. 서버 413 분기는 로컬에 Redis
자격증명이 없어 경계값 계산 검증+문법 검사+클라이언트 반응 모킹
검증으로 대체(실제 배포 핸들러 end-to-end는 아님).

- **B-80 완료**. `js/auth.js`는 지시에 수정 가능 파일로 포함됐으나
  기존 `forceLogin()` 재사용만으로 충분해 무수정.
  `scraps-import.js`·`api/_auth.js`는 손 B의 B-88·B-89 대상이라
  무접촉(착수 전 확인 시점에 이미 커밋 완료 상태).
- push는 검증 완료 후 진행(보류 아님, 지시대로).
- BACKLOG.md "코드 점검 발견" 섹션에서 B-80은 커맨드센터가 확인 후
  정리할 차례. B-84·B-86·B-83·B-87·B-88·B-89·B-80까지 감사 발견
  항목 완료.

---

# 이전 핸드오프 — B-88+B-89 감사 후속 2건 완료 (2026-07-18)

## 최신 작업: B-89

- 커밋 예정: `fix: 프로덕션 CORS localhost 오리진 제거 (B-89)`
- 배포 도메인은 계속 허용하고 localhost는
  `VERCEL_ENV !== 'production'`인 경우에만 정확한 오리진 형식으로
  허용한다.
- CORS 단위 검증과 Playwright 데스크톱·390px 모바일 게스트 전체 탭
  스모크 통과.
- `node --check api/_auth.js`, `git diff --check` 통과.
- 손 A의 `state.js`·`auth.js`·`api/state.js`는 수정·스테이징하지
  않았다.

---

# 이전 핸드오프 — B-88 수집함 임포트 ID 충돌 방지 완료 (2026-07-18)

## 최신 작업: B-88

- 커밋 예정: `fix: 수집함 배치 임포트 id 시퀀스 부가 (B-88)`
- 기존 시간+랜덤 ID 뒤에 배치 내 증가 시퀀스를 추가해 형식 호환을
  유지하면서 같은 배치의 충돌을 제거했다.
- Playwright 데스크톱·390px 모바일에서 30행×3회 임포트의 90개 ID
  전부 유일 확인, 기존 스크랩 수정·삭제 회귀 검증 통과.
- `node --check js/scraps-import.js`, `git diff --check` 통과.
- 손 A의 `state.js`·`auth.js`·`api/state.js`는 수정·스테이징하지
  않았다.

---

# 이전 핸드오프 — B-86 applyGuards 배열·구조 가드 완료 (2026-07-18)

## 최신 작업: B-86

`BACKLOG.md` "코드 점검 발견" 섹션 B-86(감사 발견, 중·견고성).
`applyGuards`의 핵심 배열 5종(actions·properties·complexes·
listings·scraps)에 `Array.isArray` 가드가 없어 truthy 비배열 오염
1회로 앱 전체가 빈 화면으로 멈추는 단일 실패점을 해소하고, 부수 가드
4건(grades.area/households·safety 비객체·priority NaN·milestone
label)을 추가했다. 손 B가 `properties.js`로 B-87 작업 중이라
`properties.js` 무접촉 — `state.js` 1파일만 수정(+42/-7줄).

- 커밋: `fix: applyGuards 배열·구조 가드 강화 (B-86)`
- 공용 헬퍼 `guardArr(val,fallback,label)`을 신설해 배열 5종에 적용
  (falsy 폴백은 기존과 동일하게 유지, truthy 비배열만 새로 막음).
  값이 있는데 타입이 틀린 경우만 `console.warn`, 단순 누락은 조용히
  기본값 적용.
- `settings.grades.area`/`households` 비배열 가드로 utils.js의
  `calcAreaGrade`/`calcHouseholdGrade` 구조분해 크래시 예방(utils.js
  자체는 안 건드림).
- `listings[].safety[key]` 비객체 가드로 스프레드 오염 방지.
- `actions` priority 이관부는 숫자 priority만 필터링해 `Math.max`에
  전달, NaN 오염 방지.
- `milestone.label` 누락·오염을 `applyGuards`에서 문자열로 보정해
  `ai.js`(안 건드림)의 `profileLine()` 크래시 예방.
- Playwright 73개 체크: 배열 5종×오염 3종(문자열/객체/null) 무크래시+
  정확한 warn, grades·safety·priority·milestone 오염 각각 무크래시,
  정상 state 라운드트립 순서 무관 완전 동일(무손실), 5개 탭 전부
  동시 오염시켜도 실제 콘텐츠 정상 렌더(빈 화면 아님) 확인.
- `node --check js/state.js`, `git diff --check` 통과.
- 손 B의 B-87 대상 `properties.js`는 건드리지 않았다. `BACKLOG.md`
  및 기존 미추적 문서 3개는 수정·커밋하지 않았다.
- push는 검증 완료 후 진행 가능(보류 아님). 다음 순번: B-80(저장
  실패 표시, B-84가 남긴 `sh_unsynced` 플래그 소비 예정)·B-88·B-89.

---

# 이전 핸드오프 — B-87 매물 루트 메뉴 리스너 수정 완료 (2026-07-18)

## 최신 작업: B-87

- 커밋 예정: `fix: 루트 메뉴 재오픈 시 즉시 닫힘 (B-87)`
- 루트 메뉴가 닫힐 때 자기 document capture 리스너를 반드시
  해제하도록 메뉴 인스턴스에 참조를 저장했다.
- `⋯ 더보기` 메뉴도 같은 원인으로 판정해 동일하게 수정했다.
- Playwright 데스크톱·390px 모바일에서 두 메뉴 각각 10회 반복
  재오픈·외부 닫기 통과. 루트 삭제 후 재렌더·새 루트 항목도 통과.
- `node --check js/properties.js`, `git diff --check` 통과.
- 손 A의 `state.js`·`utils.js` 작업은 수정·스테이징하지 않았다.

---

# 이전 핸드오프 — B-83 보안 방어 강화 완료 (2026-07-18)

## 최신 작업: B-83

- 커밋: `fix: URL 스킴 검증·img src esc·esc 따옴표 강화 (B-83)`
- `safeUrl()`을 `properties.js`에서 공통 `utils.js`로 옮기고, 규제뉴스
  출처는 `http:`/`https:`일 때만 `noopener` 새 창으로 연다.
- 매물·수집함 이미지 `src` 보간값에 `esc()`를 적용하고, `esc()`가
  작은따옴표도 `&#39;`로 변환하도록 보강했다.
- Playwright 데스크톱·390px 모바일에서 정상 뉴스 URL, `javascript:`
  차단, data URL 이미지, `O'PARK` 텍스트, 주요 탭 스모크 통과.
  대상 JavaScript `node --check`와 `git diff --check`도 통과했다.
- 병행 작업 대상 `state.js`·`boot.js`는 건드리지 않았다.
- `BACKLOG.md` 및 기존 미추적 문서 3개는 수정·커밋하지 않았다.

---

# 이전 핸드오프 — 🔴 B-84 저장 유실 방지 완료 (2026-07-18)

## 1. 목표
`BACKLOG.md` "코드 점검 발견" 섹션 B-84(감사 확정 발견, 높음·데이터
유실). ①페이지 이탈 시 대기 중인 Redis 동기화가 있으면 즉시 flush
②디바운스에 maxWait(5s) 추가해 연타 입력 중에도 손실 창이 무한정
늘어나지 않게 함. 손 B가 `utils.js`·`scraps-import.js`·
`scraps-render.js`·`scraps-form.js`·`properties.js`로 B-83 작업
중이라 `state.js`·`boot.js` 외 무접촉.

## 2. 완료
**커밋 2개(코드 1 + 문서 1), 검증 완료. push는 검증 후 진행 가능.**

```
c8a2138 fix: 이탈 시 Redis flush + 디바운스 maxWait (B-84)
2ef6d6f docs: B-84 HISTORY 기록
```

`state.js` 1파일만 수정(+44/-5줄). `boot.js`는 안 건드림 — 기존
`pagehide`/`visibilitychange`(뷰 상태 저장용)는 그대로 두고
`state.js`에 별도 리스너를 추가로 등록(이벤트 리스너는 여러 개
등록해도 서로 방해 없이 전부 실행됨). 손 B의 B-83 대상 5개 파일도
전혀 안 건드림.

**구현**:
1. `flushPendingSync()` 신설 — `pagehide`+`visibilitychange`(hidden)
   등록, 대기 중인 디바운스 타이머(`syncTimer`)가 있을 때만 동작.
   Bearer 토큰 헤더 필요해 `sendBeacon()` 대신
   `fetch(url,{keepalive:true,...})`.
2. 미동기 플래그(`localStorage.sh_unsynced`, B-80 대비) — keepalive
   64KB 제한·응답 못 받고 페이지가 죽을 가능성 고려해 "먼저
   미동기로 표시 → 성공 응답 받으면 지움" 순서로 실패를 조용히
   삼키지 않게 함. `syncToRedis()`(기존 800ms 경로)도 같은 플래그를
   갱신해 플러시/일반 경로 신호를 통일. 표시 UI 자체는 B-80 몫,
   이번엔 플래그만 정확히 남김.
3. 디바운스 maxWait — `SYNC_DEBOUNCE_MS=800`(무변경)에
   `SYNC_MAX_WAIT_MS=5000` 추가, 최초 `save()` 시각 기준 경과 계산해
   5초 넘으면 다음 지연 0(즉시), 아니면 `min(800,5000-경과)`. 타이머
   발화 시 `syncTimer`/`syncBurstStartedAt`을 `null`로 되돌려 "대기
   중" 판별을 정확하게 함(이전엔 발화 후에도 만료 ID를 계속 들고
   있어 부정확했음).

- **검증**(Playwright, `/api/state` 라우트 모킹):
  - 일반 흐름: `save()` 1회 → 정확히 800ms 후 POST 1건만(무회귀).
  - maxWait: 300ms 간격 10초 연타 → POST가 ~5005ms·~10157ms 시점
    총 2건(디바운스만이었다면 ~10.3초에 1건뿐이었을 것).
  - 이탈 flush: `save()` 후 100ms(800ms 되기 전)에 `pagehide` →
    즉시 POST 1건, `Authorization: Bearer` 헤더 정상, 성공 후
    `sh_unsynced` 정상 해제.
  - flush 가드: 대기 타이머 없을 때 이탈 → POST 0건(불필요한 요청
    없음).
  - flush 실패: POST abort 모킹 → `sh_unsynced` 플래그 정확히 설정.
  - `visibilitychange`(hidden) 경로도 `pagehide`와 동일하게 동작.
  - `node --check js/state.js` 통과.
  - 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
    scratchpad에서만 실행, 세션 종료 전 전부 삭제.

## 3. 미완 / 다음 단계
- **B-84 완료** — BACKLOG.md "코드 점검 발견" 섹션에서 커맨드센터가
  삭제 처리할 차례.
- **B-80(저장 실패 표시)이 이번에 남긴 `sh_unsynced` 플래그를 소비할
  예정** — 이번 세션은 플래그를 정확히 남기는 것까지만, 사람이 보는
  UI(재로그인 시 배너 등)는 B-80 범위.
- push는 이 세션에서 검증 완료 후 진행(보류 아님, 지시대로).

## 4. 주의점
- PIN·API 키·실제 데이터는 이 문서 어디에도 기록 안 함. 테스트는
  가짜 토큰(`faketoken123`)만 사용.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- **`state.js`·`boot.js` 외 무접촉 준수** — 착수 시점에 손 B가
  B-83으로 `utils.js`·`scraps-import.js`·`scraps-render.js`·
  `scraps-form.js`·`properties.js`를 작업 중(커밋 안 된 상태)이었음.
  커밋마다 매번 `git status` 확인해 내 파일(`state.js`)만 스테이징,
  Codex의 진행 중 작업(5개 파일)은 전혀 건드리지 않음. `HISTORY.md`도
  Codex가 아직 손대지 않은 상태를 확인 후 내 항목만 추가.
- 스키마 변경 없음 — `sh_unsynced`는 `state` 객체 필드가 아니라
  독립적인 localStorage 플래그라 `state.js` 상단 JSDoc 스키마 갱신
  대상 아님.
- 기존 800ms 디바운스 값·localStorage 즉시 저장 semantics 전부
  무변경 — maxWait는 "5초 넘도록 디바운스가 계속 리셋되는 경우"에만
  개입.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code) — 손
  B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은
  `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터
  전용).
- 이번 세션은 커맨드센터의 "심층 코드 감사 2건"(보안 / 상태·레거시)
  결과 등록된 B-80~B-89 중 최우선(🔴 데이터 유실) 항목. 직전
  세션들: ... → B-72+B-74(카드 가독성+레이아웃) → **이번 세션(B-84,
  검증 완료) — 저장 유실 방지**. 손 B의 B-83(보안 방어 강화 묶음)과
  파일 무충돌 병렬 진행(`state.js` vs `utils.js`/`scraps-*.js`/
  `properties.js`). 착수 순서상 다음은 B-80(저장 실패 표시)·나머지
  B-8x 감사 항목들.
