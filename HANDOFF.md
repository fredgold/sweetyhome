# HANDOFF — B-67 사진 UX 개선 완료 (2026-07-18)

## 1. 목표
`BACKLOG.md` ⭐ 섹션 B-67. ① 추가 시점 사진 제거·교체(스키마 무변경)
② 수집함 다중 사진(스키마 확장, `img`→`imgs[]`). 손 B가 `nav.js`로
B-70 작업 중이라 `nav.js` 무접촉.

## 2. 완료
**커밋 2개, 검증 완료 후 push.**

```
5cd66c8 fix: 사진 추가 시점 제거·교체 가능 (B-67 ①)
f8ef386 feat: 수집함 다중 사진 (B-67 ②)
```

**커밋①** — 진단 결과 매물 폼(`#form`, `f_img`)은 이미 추가 시점
제거·교체가 완전히 동작 중이었음(변경 없음, Playwright로 재확인만).
실제 문제는 수집함 추가폼(`sc_file`/`sc_preview`) 1곳 — 첨부 후
제거 UI 자체가 없었음. `f_imgClear`/`sem_imgClear`와 동일 패턴의
`sc_imgClear`(✕ 제거) 버튼 추가, `compressImage()` 기존 경로 그대로
재사용.

**커밋②** — `state.scraps[].img`(1장, 레거시) 옆에 `imgs[]`(배열,
신규) 추가. `applyGuards()`에서 `img`만 있고 `imgs`가 없으면
`imgs=[img]`로 무손실 이관, **`img` 필드는 삭제·개명 안 하고
`imgs[0]` 미러로 계속 유지**(이중 하위호환). 장수 상한
`SC_MAX_IMGS=5`(상수, `compressImage()` 압축 스펙은 그대로 유지한 채
개수만 제한). 카드·갤러리 렌더 2곳 전부 `imgs[0]` 기준으로 전환.
추가폼·편집모달 둘 다 `multiple` 첨부 + 개별 삭제 가능한 썸네일
그리드로 교체(커밋①의 단일-슬롯 `sc_imgClear`/`sem_imgClear`/
`sem_imgPreview`는 이 다중 슬롯 UI로 완전히 대체됨). 새 CSS 파일
없이 `style.css`에 클래스 3개만 추가.

**매물(listings/complexes) 사진 점검** — `state.listings[]`·
`state.complexes[]`엔 사진 필드 자체가 아예 없음(레거시
`state.properties[].img`만 보유, 이미 완전한 제거·교체 지원 중).
"같은 버그"가 아니라 "애초에 없는 기능"이라 구조가 근본적으로 달라
이번 범위에서 제외 — 필요하면 신규 기능 추가로 별도 지시 필요.

- **검증**(Playwright, 데스크톱 1280px+모바일 390px):
  - 구 데이터(`img`만 있는 스크랩) → `imgs=[img]` 정확 이관, `img`
    보존, 카드·갤러리 양쪽 정상 표시(무손실).
  - 추가폼: 3장→1장 제거→2장, 4장 추가 시도 시 정확히 5장에서 캡+
    경고 노출. 저장된 스크랩 `imgs.length===5`, `img===imgs[0]` 미러
    정확. 저장 후 폼 리셋 확인.
  - 편집모달: 기존 5장 표시→2장 제거→3장 저장 정확 반영.
  - `applyGuards()` 라운드트립 무손실 확인.
  - 데스크톱·모바일 전 시나리오 동일 통과, 모바일 썸네일 그리드
    가로 스크롤·잘림 없음(스크린샷 확인).
  - `node --check` 3개 파일 통과, CSS 중괄호 균형 통과.
  - 로컬 테스트 서버·Playwright 스크립트·테스트 이미지는 레포 바깥
    scratchpad에서만 실행, 세션 종료 전 전부 삭제.

**🚀 지시대로 검증 완료 후 push 진행**(보류 아님).

## 3. 미완 / 다음 단계
- **B-67 완료** — BACKLOG.md ⭐ 섹션에서 커맨드센터가 삭제 처리할 차례.
- 매물(listings/complexes) 사진 기능 자체가 없다는 점 확인함 — 필요
  여부는 사람(테디) 판단 필요, 이번 지시 범위 밖이라 별도 백로그
  항목으로 남겨둘지는 커맨드센터가 결정.

## 4. 주의점
- PIN·API 키·실제 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- **`nav.js` 무접촉 준수** — 착수 시점에 손 B(Codex)가 `nav.js`+
  `HISTORY.md`를 B-70 작업으로 이미 수정 중(커밋 안 된 상태)이었음.
  내 커밋①은 그 두 파일을 건드리지 않고 `index.html`+
  `js/scraps-form.js`만 스테이징해 커밋 — Codex의 진행 중 작업을
  건드리지 않음. 커밋② 착수 시점엔 Codex가 이미 `03fdfa6`로 커밋
  완료한 상태라 이후엔 정상적으로 `HISTORY.md`에 이어서 기록.
- 스키마 확장 1건(`scraps[].imgs`) — `img` 필드는 절대 삭제·개명하지
  않음(지시 명시), `applyGuards()`+JSDoc 동시 갱신 완료.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code) — 손
  B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은
  `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터
  전용).
- 직전 세션들: ... → B-75(XSS 핫픽스+매물 메모 렌더, push 완료) →
  B-70(손 B, 대시보드 액션 더보기, `03fdfa6`) → **이번 세션(B-67,
  push 완료) — 사진 UX 개선(제거·교체+다중 사진)**. B-70과 파일
  무충돌 병렬 진행(`nav.js` vs `scraps-form.js`/`state.js`/
  `scraps-render.js`).
