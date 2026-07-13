# HANDOFF — B-59 모달 sticky 헤더·푸터 통일 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-59 처리. 전 모달(9개)에서 제목·닫기(헤더)와 취소/저장
(푸터)이 스크롤과 무관하게 항상 보이게, 중간 내용만 스크롤되도록 통일.

## 2. 완료
**4단계 커밋 전부 완료, push까지 완료.**

```
44b9850 style: B-59 모달 공통 sticky 규격 + 단순 모달 적용
8bc627c refactor: B-59 수집함 편집 모달 sticky 구조 + 요소 재배치
4b76ea3 refactor: B-59 매물 수정·단지상세 모달 sticky 구조
a4fe1c6 refactor: B-59 임포트 위저드 모달 sticky 헤더
```

- **공통 규격**(`style.css`): `.box{display:flex;flex-direction:column;
  padding:0;overflow:hidden}` + `.mhead`(고정)/`.mbody`(`overflow-y:auto`,
  실제 스크롤 담당)/`.mfoot`(고정, 있는 모달만) 3규칙. 모바일 두
  breakpoint(760px·480px) 모두 패딩을 재분배 + `.mfoot`에 세이프에어리어
  (`env(safe-area-inset-bottom,0)`) 적용.
- **적용된 모달 9개**: exportModal·importModal·assetAiModal·profileModal
  (단순, mhead+mbody+mfoot) → scEditModal(사진·에러 재배치) →
  propEditModal·complexDetailModal(complexDetail은 mfoot 없음, 닫기가
  헤더에) → scImportModal·propImportModal(mhead만, 위저드 액션행은 지시대로
  mbody 흐름 유지, 통일 안 함).
- **인라인 max-height/overflow 제거**: scEdit·propEdit·propImport·
  complexDetail 4곳 전부(공통 규격이 처리하므로 불필요해짐).
- **부수 발견·수정 2건**(작업 중 필요해서 같이 처리, 범위 이탈 아님):
  1. `#complexDetailModal .box{overflow-y:auto}`(모바일 전용 규칙)가 ID
     선택자라 특이도가 base `.modal .box{overflow:hidden}`보다 높아 그대로
     두면 이 모달만 mhead까지 같이 스크롤되는 문제 — 그 속성 제거.
  2. `js/properties.js`의 B-21 바텀시트 드래그다운 닫기 핸들러가
     `box.scrollTop>0`을 안전망으로 썼는데, box가 더 이상 스크롤 컨테이너가
     아니게 되며(이제 mbody가 스크롤) 이 체크가 항상 무의미(box.scrollTop
     항상 0)해져 dead code 제거 — mhead가 이제 항상 고정이라 애초에 그
     안전망이 불필요해짐. 동작 자체는 기존과 동일.
- **검증**(Playwright, 로컬 정적 서버+게스트모드):
  - 데스크톱 1400px: 9개 모달 전부 — mbody에 더미 콘텐츠 주입 후 강제
    스크롤해도 mhead/mfoot 위치가 스크롤 전후 완전 동일(0.5px 이내) 확인.
  - 위저드 2개: `.macts` 액션행이 여전히 mbody 안에 있고 파싱→미리보기
    토글 구조 정상 확인.
  - `.status-picker`/모달 z-index(1100, B-58) 무회귀 확인.
  - 모바일 390px: complexDetailModal 풀높이 시트 헤더 고정·닫기 버튼 항상
    화면 안·드래그다운 닫기 핸들러 무에러 확인. scEditModal 모바일 패딩
    압축·세이프에어리어 계산 확인.
  - `node --check js/properties.js`·CSS 중괄호 균형·`index.html` div
    개폐 균형·`git diff --check` 전부 통과.
  - **JS 무회귀**: 4개 커밋 전체 diff에서 삭제/추가된 `id=`·`data-close=`
    속성 집합을 비교해 완전히 동일함(무손실) 확인.
  - 임시 설치한 `playwright`(`npm install --no-save`)와 검증용 임시
    파일·서버는 세션 종료 전 전부 삭제. `package.json` 변경 없음.

## 3. 미완 / 다음 단계
- **모바일 키보드 충돌 실기기 검증 필요(핵심, 테디 결정 대기)**: 지시서가
  요청한 "`.box` `max-height:88vh`→`100dvh` 검토 또는 입력 모달만
  `.mfoot{position:static}` 폴백"은 iOS Safari 실기기 키보드 실측이
  필요한 항목이라 이번엔 구현하지 않음(헤드리스 Playwright로는 재현
  불가). **실기기에서 입력 많은 모달(scEdit·assetAi·import·propEdit
  메모)에 키보드를 올렸을 때 스크롤 창·푸터가 튀거나 답답하면** 이 폴백
  적용 여부를 테디가 결정 후 후속 작업으로.
- complexDetailModal 모바일 풀높이 시트: 헤더 sticky 추가로 스크롤 창이
  줄어드는 트레이드오프는 지시서에서 이미 감수하기로 한 부분 — 실기기에서
  답답함이 느껴지면 별도 피드백 필요.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- `js/nav.js` 무접촉 원칙 유지(B-56의 일회성 예외 이후 계속 기본 원칙) —
  이번 B-59는 `js/properties.js`(B-21 안전망 정리 1곳)만 JS를 건드림,
  nav.js 무관.
- `index.html`을 다루는 작업이라 착수 전 `git status`로 Codex와의 미커밋
  충돌 여부 확인함(클린 상태였음, 충돌 없었음).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → B-12 관련 다수 작업 → ... →
  B-28 → B-18 → B-38 → B-39(`d943fd5`) → B-30(`4ee58cd`) →
  B-56(`21cb4b9`) → B-57(`2b79d16`) → B-58(`e9d3531`) →
  **이번 세션(B-59, `44b9850`~`a4fe1c6` 4단계, push 완료)**.
