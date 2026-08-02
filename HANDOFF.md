# HANDOFF — B-188 수집함 og:image 자동 썸네일 완료 (2026-08-02)

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: /api/preview 신설(SSRF 가드) + 수집함 추가 시 og:image 자동 썸네일 배선(2커밋)

```
20e0457 feat: 수집함 링크 og:image 썸네일 프록시 api/preview.js 신설 (B-188 ①)
7a9adbd feat: 수집함 링크 og:image 자동 썸네일 클라 배선 (B-188 ②)
```

착수 조건(B-187·B-181R·B-182 완료) `git log`로 먼저 확인 후 진행.
커맨드센터 지시서(`dispatch-2026-08-02-B188.md`). 사용자 결정
(2026-08-02): 추가 시 자동 가져오기+base64 저장(스키마 무변경, imgs
파이프라인 재사용). 손 A 단독, 커밋 2개(① api/preview.js 신설 ②
scraps-form.js 배선), SSRF 가드 항목 생략·완화 금지 지시 엄수.

**①**(`api/preview.js` 신설): `api/geocode.js`와 동일한 서버리스
프록시 패턴 — `verifySession`(Bearer 인증)+`rateLimit`(120/1h) 재사용.
모드 2개: `mode=meta`(og:image 폴백 twitter:image 정규식 추출)·
`mode=image`(이미지 바이트 스트림, 클라 CORS 우회용).

**SSRF 가드(이 지시서에서 가장 중요, 전부 구현)**:
- http/https만 허용, 호스트가 IP 리터럴이면 사설·루프백·링크로컬
  구분 없이 전부 거부. IPv4는 URL 파서가 8진수/10진수 표기까지
  표준 dotted-decimal로 정규화하므로 정규식 하나로 전부 커버,
  IPv6는 `URL.hostname`이 대괄호 포함 콜론을 항상 남겨 콜론 존재로
  판별(둘 다 Node 실측으로 확인). `localhost`·`*.local`·`*.internal`
  거부.
- `redirect:'manual'`로 매 hop 직접 추적 + 매 hop마다 SSRF 가드
  재적용(허용된 첫 URL이 사설 IP로 튀는 리다이렉트 우회 차단),
  최대 3회.
- `content-length` 헤더를 신뢰하지 않고 스트리밍 read로 실제 수신
  바이트 기준 상한 강제(meta 512KB 도달 시 즉시 취소, image 5MB
  초과 시 거부) — 응답이 큰 상대 서버의 무제한 버퍼링(DoS) 방지.
- 타임아웃 5초(AbortController, hop마다). 일반 브라우저 UA.
- 실패는 상세 스택 노출 없이 4xx/5xx+`{error}`만.

**②**(`js/scraps-form.js`): 스크랩 **추가**(신규만 — 수정 모달·
붙여넣기 임포트는 스코프 밖) 시 원문에서 첫 URL 추출(`api/ingest.js`의
`extractHttpUrl`과 동일 패턴 — 구두점 뗀 값 우선 시도) → `imgs[]`
이미 있음(사용자 첨부 우선)/URL 없음/instagram·facebook(크롤링 차단
기결정, 서버 왕복 낭비 방지) 중 하나면 조용히 종료 → 아니면
`/api/preview` mode=meta→mode=image 왕복 → 기존 `compressImage()`로
재인코딩 → 도착 시점에 스크랩이 아직 있으면(id 확인) `imgs[0]`+`img`
레거시 미러 동시 설정 → `save()`+`renderScraps()`. **저장 자체는 이
백그라운드 작업을 기다리지 않음**(카드는 즉시 나타남) — 모든 실패는
무음(토스트·콘솔 에러 없음).

**검증**(로컬 목업 인증으로 `api/preview.js` handler 직접 호출+실네트워크,
Playwright로 클라 로직 라우트 목업):
1. 실링크 3종 중 **네이버 블로그·뉴스는 정상**(실제 이미지 3.7KB/
   262KB 수신, `imgs[0]==img` 미러 일치 확인) — **유튜브는 실패**:
   og:image가 문서 691KB 지점에 있는데(총 1.3MB) 512KB 안전 상한에
   걸려 못 찾음. SSRF 상한을 완화하지 않는 이상 구조적으로 불가능
   (지시대로 완화하지 않음) — **아래 사용자 결정 필요 항목 참조**.
2. 인스타 링크 → `/api/preview` 호출 0회(Playwright route 인터셉트
   카운트), 스크랩 정상 추가.
3. URL 없는 노트·이미 이미지 첨부한 스크랩 → 둘 다 호출 0회(동작
   무변경).
4. 실패 경로(404 URL·og:image 없는 페이지 `example.com`) → 서버가
   `{image:null}` 200 반환, 클라는 `!meta.image`로 무음 종료 —
   토스트·콘솔 에러 없음.
5. SSRF 가드 9종 실측 전부 4xx: `127.0.0.1`·`10.0.0.1`·`192.168.1.1`·
   `localhost`·`*.local`·`*.internal`·IPv6 루프백·`ftp://` 프로토콜·
   image모드 `127.0.0.1`.
6. 저장 클릭 직후(29ms) 카드가 DOM에 즉시 나타남(네트워크 대기 없음,
   블로킹 0) — 이후 목업 응답 도착 시 `imgs[0]`/`img` 정확히 동일값.
7. 미인증 `/api/preview` 요청 → 401.

**→ 7항 중 6항 완전 충족, 1항(실링크 3종)은 2/3 부분 충족** — 유튜브만
안전 상한과 구조적으로 충돌.

- **B-188 ①② 완료·push 완료**(`20e0457`/`7a9adbd`). `HISTORY.md`에
  1줄 추가.
- **커맨드센터 결정 필요(유튜브 썸네일)**: 옵션 ⓐ 현행 유지(2/3
  사이트 커버, 유튜브는 기존처럼 수동 스크린샷 첨부) ⓑ 유튜브
  전용 URL 패턴(`https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg`,
  video ID를 URL에서 직접 추출 — og:image 파싱 없이 페이지 요청
  자체가 불필요해짐)을 별도 커밋으로 추가(이번 지시서 스코프 밖이라
  미구현, SSRF 가드 무관·완전히 별개 경로라 안전 저해 없음) ⓒ 512KB
  상한 자체를 상향(SSRF 가드 완화 — 이번 지시서에서 명시적으로
  금지된 항목이라 재승인 필요).
- **사용자 실기기 확인 불필요**(og:image 없이 순수 API+백그라운드
  fetch라 iOS 관련 특이사항 없음). Safari 관찰 목록은 기존 그대로
  (audit sticky/`:has()` 2건 + B-182 시나리오 5건).
- **B-164~171잔여**(이전 세션들, 아직 미확인): 매물 메모 행간·별점/
  즐겨찾기 별 탭 감각. 대부분은 후속 세션에서 이미 처리됨(B-166~174).
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정), 이번
  지시서 범위 밖.

---

# 이전 핸드오프 — B-182 모달 포커스 격리·키보드 접근 완료 (2026-08-02)

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
