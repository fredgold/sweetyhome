# HANDOFF — B-41 완료 (2026-07-20) 임장 노트

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 단지 임장 노트 — 6항목 별점+메모 기록

```
4391487 feat: 임장 노트 스키마+입력 UI (B-41 ①)
0b66556 feat: 임장 노트 카드 요약 칩 (B-41 ②)
```

커맨드센터·사용자가 2026-07-19 확정한 스펙 지시서로 착수(BACKLOG의
"스펙 확정 선행" 조건 충족, B-27-lite 중복 검토 완료 — 안전체크는
매물 단위 계약·서류, 임장 노트는 단지 단위 현장 관찰로 비중복, 입력
패턴만 재사용). 손 B 부재로 파일 락 제약 없이 진행, 2커밋 분리.

**스키마**(`state.js`): `complexes[].fieldNote = {visitedAt(날짜|null),
items:{주차·밤길·상권·소음·경사도·관리상태 각 {rating:null|1~5정수,
memo}}, memo(자유 메모)}`. `FIELD_NOTE_ITEMS` 상수를 `SAFETY_ITEMS`와
동일 패턴으로 신설. `applyGuards`가 `safety`(listings[])와 동일하게
항목별 무손실 병합 — 일부 항목만 있던 구 데이터도 나머지가
`defaultFieldNoteItem()`로 채워짐. `rating`은 `Number()`로 관대
변환(다른 필드 관례와 동일, `'3'`→3) 후 1~5 정수만 통과, 범위밖·
소수·비수치 문자열·0·음수는 전부 `null`로 보정(미입력과 1점을
엄격히 구분하는 스펙 보호). 신규 단지 생성 3곳(`commutes:
defaultComplexCommutes()` 있는 곳 전부)에 `fieldNote:
defaultComplexFieldNote()` 동반 추가 — 안 하면 생성 직후(다음
`applyGuards` 전) 단지 상세를 열 때 크래시 위험이 있었음(실제로
`renderComplexDetailBody`에도 방어적 자동 생성 폴백을 별도로 넣어
이중 안전망).

**입력 UI**(`properties.js`+`index.html`+`style.css`): 단지 상세에
"임장 노트" 섹션(판단메모 다음, 매물 목록 앞) — 방문일 입력,
`safety-item`/`safety-item-head`/`safety-item-label`/`safety-memo`
(B-27-lite 클래스 그대로 재사용, 신규 CSS 0) + 별점 5개 버튼
(`.fn-star`, `.c-fav-btn`과 동일 토큰: off=외곽선 `--ink-faint`,
on=골드 채움 `--line9`/`--line9-deep`, 신규 색상 없음). 별점 재클릭
시 해제(rating→null)로 미입력/1점 구분. 자유 메모는 CLAUDE.md
에디터 표준 그대로 적용 — `loadTiptapMods()`+`buildListBackspaceFix`+
`buildTiptapPlaceholder`, 로드 실패 시 툴바+미리보기+textarea 폴백
(`showEditorFallbackNote`), 저장은 마크다운·읽기는 `renderMd`.
`em_memo`(984행 부근)와 동일한 모달 재사용 싱글턴 패턴이지만, 이
모달엔 전체 저장 버튼이 없어 Tiptap `onBlur` 콜백으로 필드별 blur
저장 관례(`cxDetailPros`/`Cons`/`Verdict`/`Memo`와 동일)를 유지.

**카드 칩**(2번째 커밋): `fieldNoteChip(cx)` — 별점 매긴 항목이
하나라도 있을 때만 "임장 ★평균 · n/6 기록" 칩 노출, 미기록 시
완전 무표시. 평균은 `toFixed(1)` 표시용 계산일 뿐 저장·정렬·필터
전혀 개입 없음(`safetyBadgeChip`과 동일하게 집계만).

**검증**(Playwright, 로컬 Node UTF-8 정적 서버+`window.naver` 스텁,
esm.sh는 `route().abort()`로 의도적 차단해 Tiptap 폴백 경로 검증 —
성공 경로는 기존 6필드가 이미 공유 검증된 인프라라 재검증 불필요로
판단) 데스크톱 1440×900+모바일 390×844 양쪽 66개 체크 전부 통과:
별점 클릭→3, 재클릭→null(1점 아님 확인), 1→5 순차 전환 무정체,
항목 메모 XSS payload(`<img onerror>`) 저장은 raw 그대로+재렌더 시
`esc()`로 미실행 확인, 방문일 저장, 자유 메모 폴백 textarea blur
저장+`<script>`/`<img onerror>` payload에 대해 `renderMd` 무크래시,
`applyGuards` 4개 케이스(완전 누락→6항목 전부 기본값, 부분 병합→
있는 항목 보존+없는 항목만 기본값, 오염값 6종→전부 올바르게 null/
변환, 재적용 idempotent), 카드 칩 표시(평균 3.0·2/6 기록)/미기록시
무표시, **B-27-lite 안전체크 9항목 무회귀**, **B-117 매물 상세
사이드 패널 오픈 무크래시**, 모바일 390 실제 `tap()`으로 별점 동작
확인, 콘솔 에러 0건(esm.sh 의도적 차단·파비콘 404 제외). `node
--check` 13개 js 파일 전부 통과. 스크래치 테스트 스크립트는 실행
후 삭제(레포 무잔존).

**범위 밖(지시대로 보고만)**: CSV 내보내기에 임장 노트 반영 여부는
손대지 않음 — 필요 여부는 사용자 판단 대기.

- **B-41 완료·push 완료**(`4391487`/`0b66556`).
- **다음**: 사용자 별도 지시 대기.

---

# 이전 핸드오프 — B-122 완료 (2026-07-19) 지침 강화 — 확립 원칙 명문화

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

