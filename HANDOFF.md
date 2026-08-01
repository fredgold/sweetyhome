# HANDOFF — B-166+B-167+B-168 완료 (2026-08-01) 거리순칩·즐겨찾기별·오버플로 전역감사

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 거리순 칩 권한요청 경로 복구 + 즐겨찾기 별 터치 타깃 + 텍스트 오버플로 전역 감사·일괄 처방

```
d67eb3e fix: 거리순 칩 disabled가 위치 권한 요청 경로를 죽이던 것 수정 (B-166)
1d8c68a feat: 즐겨찾기 별 터치 타깃 개선 — B-164와 동일 처방 (B-167)
131dbbf fix: 텍스트 오버플로·좌우 밀림 전역 감사 및 일괄 처방 (B-168)
```

커맨드센터 지시서(`dispatch-2026-07-31-B166-B168.md`)로 착수. 사용자
iPhone 실사용 피드백 3차. 손 A 단독, 지시대로 3커밋 순서 진행.

**B-166**(`style.css`+`js/properties.js`): `syncSortChips()`가
`d.disabled=!myLoc`로 거리순 칩을 막아 클릭 핸들러(2038행)의
`requestMyLoc()` 분기가 도달불가였음(disabled 버튼은 click 미발화 —
사용자가 "왜 흐릿하냐"고 물은 것이 증거). `disabled` 대신
`.needs-loc` 클래스 토글(+`aria-disabled`)로 교체 — dim은 유지하되
클릭은 항상 발화. Playwright로 위치 권한 grant/deny 양쪽 실측:
grant→`cxSort:'dist'`+칩 `on`+토스트 없음, deny→기존 토스트("위치
권한이 필요해요")+칩 `needs-loc` 유지. 현위치 버튼(`#myLocBtn`) 경로는
무접촉이라 회귀 불가능.

**B-167**(`style.css`만): 즐겨찾기 별(`.c-fav-btn`, 카드+단지상세
mhead 2사용처)에 B-164(`5548cbf`)와 동일 처방 — 모바일만 패딩
11px+아이콘 20px+`:active` 피드백. mhead 이웃 버튼(⋯·닫기,
`.btn-ghost`)과의 정렬 우려는 실측으로 해소 — 셋 다 centerY 차이
<0.01px(기존 `align-items:center`가 커진 행에도 자동 적용), 겹침
없음. 데스크톱 무변경(19.3px) 확인.

**B-168**(`style.css`만, B-162 확장): **감사 먼저** — 실제 긴
영문 토큰(역명·주소·URL)을 주입해 전 탭(대시·자산·매물 리스트뷰·
액션·수집함 목록/갤러리)+주요 모달(단지상세·매물상세 사이드패널·
매물추가폼·수집함편집·프로필·임포트 2종: JSON백업+TSV붙여넣기) **12개
지점**을 `scrollWidth vs clientWidth` + B-162 진단 스니펫으로 실측.
발견: 대시보드 액션요약(`.atx`, 액션탭과 다른 컴포넌트라 B-133 수정
미적용 상태)·매물 리스트뷰 필터·수집함 카드 태그·프로필 마일스톤
행 4곳이 실제로 넘침. **일괄 처방 검토** — `body{overflow-wrap:anywhere}`
1줄 주입 실험 후 재감사: 프로필 마일스톤 행만 빼고 나머지 전부 해소.
`overflow-wrap`은 body로 승격(상속, B-162의 `#complexDetailModal
.mbody` 전용 선언은 흡수돼 삭제), `overflow-x:hidden` 방어는 `.modal
.mbody` 전체로 일반화. **구조적 원인은 분리** — 프로필 마일스톤 행
(`.ms-row input`, 라벨+날짜 두 `flex:1` input에 `min-width:0` 누락)은
overflow-wrap으로 안 잡혀 그 지점만 개별 수정(일괄 처방에 안 욱여넣음).
**의도된 가로 스크롤 무영향 실확인**: `cxFilterFavoriteBtn`·
`.sc-filter-chip`(각각 `cxFilterBar`·`.sc-filter-row` 자체
`overflow-x:auto` 자손이라 패널 레벨 스크롤은 여전히 0, offender
목록엔 잡히지만 false positive)·임포트 표(`#propImportTable` 내부
`<div style="overflow-x:auto">`, scrollWidth 686 vs 326로 내부
스크롤 정상 유지)·수집함 임포트 표(`sc-import-tbl`)·마크다운
코드블록(`.sc-md-content pre`, `white-space:pre`라 overflow-wrap
자체가 개입 안 함, scrollWidth 593 vs 344 유지) 전부 실측 확인.
데스크톱(1440px) 12개 지점 전부 회귀 0.

- **B-166/B-167/B-168 완료·push 완료**(`d67eb3e`/`1d8c68a`/`131dbbf`).
- **사용자 확인 요청**(Safari 실기기, 390px 근처):
  ① 위치 미승인 상태에서 거리순 칩을 탭하면 권한 프롬프트가 뜨는지·
  승인 후 거리순+km 표시가 되는지.
  ② 즐겨찾기 별을 카드·단지상세 양쪽에서 눌러보고 터치가 편해졌는지.
  ③ 평소 좌우로 밀리던 화면(대시보드·수집함 등)이 이제 정상인지.
- **B-164/165잔여**(직전 세션분, 아직 미확인): 매물 메모 행간 정상
  여부·별점 탭 감각. 이번 3항목과 함께 한 번에 확인해도 됨.
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정), 이번 지시서
  범위 밖.

---

# 이전 핸드오프 — B-164+B-165 완료 (2026-08-01) 임장노트 별점 UI + 매물메모 행간

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

