# HANDOFF — B-164+B-165 완료 (2026-08-01) 임장노트 별점 UI + 매물메모 행간

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 임장 노트 별점 터치 타깃·정렬 개선 + 매물 메모 행간 폭발 버그 수정

```
9263b33 fix: 매물 메모 행간 폭발 — .c-memo white-space:pre-wrap 제거 (B-165)
5548cbf feat: 임장 노트 별점 터치 타깃·정렬 개선 (B-164)
```

커맨드센터 지시서(`dispatch-2026-07-31-B164-B165.md`)로 착수. 사용자
iPhone 실사용 피드백 2건. 손 A 단독, 지시대로 버그(B-165) 먼저·2커밋
분리. 둘 다 `style.css`만(properties.js 무접촉, 로직 무변경).

**B-165**(1줄): `.c-memo{white-space:pre-wrap}`이 평문 시절 유물로
남아있었는데, 지금 `.c-memo`는 `renderMd()` HTML(properties.js 2곳:
매물 행 메모·상세 패널 메모)과만 쓰여 marked.js가 블록 태그 사이에
넣는 소스 개행을 pre-wrap이 실제 빈 줄로 렌더 → 불릿·문단 사이 과도한
간격. 커밋 전 `grep -rn "c-memo" js/ index.html`로 사용처 2곳 재확인
후 pre-wrap 제거.

**B-164**(모바일 미디어쿼리만): `.fn-star`(임장 노트 별점) 터치 타깃이
패딩 2px+아이콘 1.15em으로 ~19px(iOS 44px 미달)·gap 1px·hover만
있던 것을 `@media(max-width:899.98px)` 안에서만 패딩 11px+아이콘
20px 고정+gap 4px+`:active` 배경 피드백으로 개선(B-136 hit area
전례처럼 시각 크기와 터치 영역 분리). `.safety-item-head`의 기존
`align-items:center`가 별점 행이 커져도 라벨과 자동 정렬해줘 별도
정렬 규칙 불필요했음. 메모 입력 전체폭은 `.safety-item>.safety-memo`
자식결합자로 좁혀 적용 — 매물 안전체크의 `.safety-item-row` 안
`.safety-memo`(select·date와 flex 공유, 폭 지정 필요)는 그대로 유지,
두 용도가 클래스는 같지만 부모 구조가 달라 안전하게 분리됨.

**검증**(Playwright, 로컬 Node UTF-8 정적 서버+게스트 모드+주입한
샘플 데이터, `node --check` 불필요(CSS만)): B-165 — 불릿 목록/불릿+
빈 줄/일반 문단 2개 세 케이스 전부 `white-space`가 `normal`로 계산되고
간격이 `.sc-md-content li/p` 마진(3.9px)만 남음 실측 확인(이전엔 pre-wrap
때문에 훨씬 큰 간격이었을 자리). B-164 — 390px에서 `.fn-star`
`getBoundingClientRect()` 42×42.3(≥40 충족), 별 사이 gap 4px 일관,
라벨-별점행 중심Y 차이 0.008px(정렬 확인), 임장노트 메모 폭
366px=`.safety-item` 폭과 동일(전체폭) vs 매물 안전체크 메모는 여전히
230px(select·date와 공유, 무회귀) 확인. 데스크톱(1440px)은 별
19.3×19.7px·패딩 2px·메모 163px로 완전 무변경 확인.

- **B-164/B-165 완료·push 완료**(`9263b33`/`5548cbf`).
- **사용자 확인 요청**(Safari 실기기, 390px 근처):
  ① 매물 메모(불릿·문단 있는 실제 메모)에서 줄 간격이 정상으로 보이는지.
  ② 임장 노트 별점을 실제 손가락으로 눌러보고 터치가 편해졌는지·
  `:active` 눌림 피드백이 보이는지·별 5개가 서로 안 붙어 보이는지.
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정) — 이번 지시서
  범위 밖, 별도 관찰 지속.

---

# 이전 핸드오프 — B-161+B-162 완료 (2026-07-31) 모바일 지도뷰 카드 위치 + 단지상세 가로스크롤

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 지도뷰 카드 스트립 재배치 + 단지·매물 상세 시트 가로 스크롤 제거

```
51bbe68 fix: 모바일 지도뷰 카드 스트립을 탭바 위로 재배치 (B-161)
c7ce20e fix: 단지·매물 상세 시트 가로 스크롤 제거 (B-162)
518abcd fix: 지도뷰 카드 하단이 탭바에 가려지던 회귀 수정 (B-161, 이후 오판으로 확인)
32e4723 fix: 지도뷰 카드 하단 위치 재수정 — flat 12px 복원 (B-161)
```

**B-161 왕복 정리(`518abcd`→`32e4723`)**: 사용자가 실기기에서 카드
하단이 `.apptabs`에 가려짐을 리포트해 `518abcd`에서 `padding-bottom`을
`calc(app-bottom-h+12px)`로 되돌렸으나, 이 진단(“컨테이닝 블록 정렬이
실기기에서 깨짐”)이 **오판**이었음이 이후 커맨드센터 확인으로 밝혀짐.
실제로는 `#panel-props`가 B-31 override(1465행,
`bottom:auto;height:calc(...-app-bottom-h)`)로 323행 `bottom:0`을
덮어써 패널 바닥이 이미 탭바 상단과 정확히 일치 — `padding-bottom`에
`app-bottom-h`를 또 더한 `518abcd`가 오히려 이중 가산이 되어 카드를
탭바 위 ~104px에 띄우는 회귀를 냄(사용자 실기기 실측이 이를 확인).
`32e4723`에서 `51bbe68`의 원래 값(flat `12px`)으로 복원하고, 주석의
잘못된 진단도 정확한 근거(1465행 override)로 교체. `--cx-strip-h`·
FAB 규칙은 `apptabs.top` 기준 실측이라 두 왕복 내내 무접촉·무영향.
**검증은 육안이 아니라 수치로**: Playwright 390px에서
`apptabs.getBoundingClientRect().top(786) − card.getBoundingClientRect().bottom(774) = 12` —
목표(~12px)와 정확히 일치 확인.

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

- **B-161/B-162 완료·push 완료**(`51bbe68`/`c7ce20e`/`518abcd`/`32e4723`).
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

