# HANDOFF — B-190~B-194 실사용 피드백 5건 (2026-08-07)

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: 링크 탭해 열기·링크 제목 자동·에디터 목록 깨짐(4커밋) + 진단 2건(커밋 없음)

```
d10cd5d feat: 수집함 카드 링크 칩 + 렌더 링크 새 탭 (B-190)
396bcf8 feat: /api/preview mode=meta에 페이지 제목 추가 (B-191 ①)
480c9b6 feat: 인박스 항목 썸네일 배선 + 링크 제목 자동 백필 (B-191 ②)
7bc2fe7 fix: 폴백 에디터 번호 목록 이어쓰기·마커 공백 유실 + Tiptap 로드 1회 재시도 (B-192)
593ff46 docs: HISTORY 갱신
```

커맨드센터 지시서(`dispatch-2026-08-07-B190-B194.md`), 손 A 단독 순차.
착수·커밋 전 `git status` 클린 확인(추적 파일 미커밋 변경 0).

**B-190**(`js/scraps-render.js`+`js/utils.js`+`style.css`): 리스트·갤러리
카드에 hostname 링크 칩(`scExtractFirstUrl` 재사용 — http/https만
통과하므로 `javascript:`는 칩이 안 생김), 실제 `<a target=_blank>`로
렌더해 네이티브 새 탭(지시서의 `window.open`보다 모바일 Safari에서
확실). `stopPropagation`으로 편집 모달·라이트박스와 분리. renderMd의
DOMPurify에 `afterSanitizeAttributes` 훅 1개 — 모든 `<a>`에
`target=_blank rel="noopener noreferrer"`. `.sc-card-raw` 토글은
`e.target.closest('a')`면 통과(`scRawToggle`).
**검증**(Playwright): 칩 탭→새 탭·모달 0 / 본문 탭→모달 열림(대조) /
raw 링크 탭→새 탭·expand 토글 0, 일반 클릭→토글 정상(대조) / URL 없는
카드 칩 0 / `javascript:` anchor 잔존 0(DOMPurify가 href 자체 제거) /
선택 모드에선 칩 탭이 네비게이션 없이 선택 토글. 콘솔 에러 0.

**B-191 ①**(`api/preview.js`): mode=meta에 `title` 추가(og:title→
twitter:title→`<title>`, 공백 정규화+200자). SSRF 가드·상한·rate limit
무접촉. 실측 7케이스 + 실네트워크 3사이트(example.com·네이버 블로그·
notion.so 전부 제목 정상) + SSRF 5종 400 회귀 확인.
**B-191 ②**(`js/scraps-form.js`): `pullInbox` 저장 확정 후
`scMaybeFetchPreviewThumb` 호출(B-188이 추가폼만 커버하던 누락) +
`scApplyPreviewTitle`이 도착 시점에 제목이 여전히 자동 폴백일 때만 교체.
**검증**: 메모 없는 노션 담기→제목 자동 교체 / 메모 있는 담기→제목
무변경+썸네일은 생성 / 인스타→preview 호출 0회·hostname 유지 /
`<title>`에 태그·스크립트→텍스트로만 반영(innerHTML 경로 없음) /
지연 응답 중 사용자가 제목 수정→덮어쓰지 않음 / 추가폼 경로 회귀 0.

**B-192**(`js/utils.js`+`js/scraps-form.js`+`style.css`): 가설(모바일
Tiptap 로드 실패→폴백)은 **채택**, 다만 폴백 경로 자체에 결함 2겹이
있어 둘 다 수정.
- 실증: esm.sh 차단 상태에서 `1. a`+Enter→`1. `(번호 고정), 이어 타이핑
  →`1.여전히 깨짐`(공백 유실로 목록 아닌 일반 문단) — 사용자 스크린샷과
  동일 형태 재현. Tiptap 정상 경로는 `2. ` 자동 증가로 무결.
- 원인 ②: `.mk` 마커의 끝 공백이 블록 끝이라 `innerText`에서 사라짐
  (`"2. "`→`"2."`) — 폴백은 매 입력마다 innerText로 raw를 되읽으므로
  마커가 파괴됨. 한글 IME `compositionend`에서 특히 빨리 깨짐(재현).
- 수정: `ceListEnter()`(utils.js)로 sc_text·sem_text 중복 로직 통합 —
  `\d+.`은 번호+1, 빈 목록 항목 Enter는 접두 제거(목록 탈출).
  `.sc-md-editor .mk{white-space:pre}`. Enter 핸들러에 `e.isComposing`
  가드. `loadTiptapMods` 1회 재시도.
- **재시도 주의**: 브라우저 모듈맵은 실패한 specifier의 실패까지
  캐시해 같은 URL 재import는 네트워크 요청 없이 즉시 실패한다(실측).
  그래서 재시도는 `?shretry=1`을 붙여 키를 바꾼다 — **최상위 5개
  모듈이 실패한 경우만 복구되고, 전이 의존(요청 ~132개)까지 끊긴
  네트워크 순단은 여전히 폴백**(실측 확인, 부분 방어임을 명시).
  완전 해결하려면 esm.sh `?bundle` 전환이 필요하나 로드 경로가
  크게 바뀌어 이번 스코프 밖.
**검증**: 폴백 강제에서 `1. a`→`2. `→`3. `→빈 항목 Enter 탈출→일반
문단, 불릿(`- x`)도 동일, IME 조합 중 Enter로 마커 파괴 0,
Tiptap 정상 경로 `1. a\n2. b\n\n평문` 회귀 0, sem_text(수정 모달)
폴백도 동일 동작, CDN 1회 실패→재시도로 Tiptap 복구(폴백 안내 없음).

## 진단만 하고 커밋하지 않은 2건 (지시서 규칙: 가설과 다르면 수정 전 보고)

**B-193 이미지 첨부 후 카드 썸네일 깨짐 — 원인 특정 완료(구조적, 발급 대기)**
- **주원인: 압축 완료 전 저장 = 레이스**. `compressImage`는 비동기인데
  저장 핸들러는 `scrapImgsData`를 동기로 읽는다. 압축 전에 저장하면
  `imgs:[]`로 저장되고 → 그 직후 `scMaybeFetchPreviewThumb`가 "이미지
  없음"으로 보고 **링크 og:image를 카드 썸네일로 넣는다**. 실측으로
  확정: 사용자 사진(4032×3024 초록)을 첨부하고 즉시 저장하면 카드
  이미지가 320×320 파랑(og:image) — 픽셀값 `[0,0,254]`로 증명.
- **부수 결함**: 저장 후 `scClearForm()`이 `scrapImgsData=[]`로
  갈아끼우므로, 뒤늦게 끝난 압축 콜백이 **비워진 배열에 push** →
  다음 추가폼을 열면 이전 사진이 이미 첨부돼 있다(실측: 폼 재오픈 시
  썸네일 1장 잔존). 수정 모달(`semImgsData`)도 같은 구조.
- **부수 결함 2**: `compressImage`에 `reader.onerror`·`img.onerror`가
  없어 디코드 실패 파일(손상 HEIC 등)은 **콜백이 영영 발화하지 않고**
  사용자에게 아무 안내도 없다(실측: CALLBACK_NEVER_FIRED). 이 경우도
  저장 시 imgs 비어 → og:image가 대신 들어간다.
- CSS(`.sc-gallery-img` 4:5 cover·`.sc-card-img`)는 무혐의 — 정상
  흐름(압축 후 저장)에선 600×450 JPEG가 그대로 렌더됨(실측).
- **제안 수정**(구조적이라 미착수): 진행 중 압축 건수를 세는 카운터를
  두고 ①저장 시 남아 있으면 "사진 처리 중" 안내 후 중단(또는 완료
  대기) ②압축 콜백이 자기 폼 세션의 배열에만 push하도록 캡처
  ③`compressImage`에 onerror 경로+토스트. 추가폼·수정모달·붙여넣기
  3경로 공통이라 지시서 발급 후 진행 권장.

**B-194 지도 핀 클릭 깜빡임 — B-169 가설(refresh 연쇄) 기각, 진범 특정**
- 계측(B-169 스파이 재사용, iPhone 13 에뮬, 단지 3개):
  **핀 클릭 1회당 `overview.refresh` 0회** → refresh 연쇄 가설 **기각**.
  대신 `reselectCxMarker` **33회**, 마커 `setIcon` **99회**(=3마커×33),
  `highlightCxCard` 33회, 스트립 scroll 이벤트 32회.
- 원인: 모바일 핀 클릭 → `focusCxCard()`의
  `strip.scrollTo({behavior:'smooth'})` → 스무스 스크롤이 ~0.5초 동안
  scroll 이벤트를 32회 발생 → 그 리스너(properties.js:2029)가 매
  프레임 `reselectCxMarker(id)`를 부르고, 이 함수는 **중심 단지가
  그대로여도 모든 마커의 아이콘 HTML을 통째로 갈아끼운다**. 즉
  마커 3개가 33번 재조립되는 것이 깜빡임. 단지 수에 비례해 악화.
- 데스크톱은 핀 클릭이 모달(openComplexDetail)이라 setIcon 3회·
  reselect 1회로 정상 — 사용자 증상이 iPhone 한정인 것과 일치.
- **제안 수정**(1줄급, 승인 시 즉시 가능): `reselectCxMarker`에
  마지막 선택 id 메모를 두고 같은 id면 즉시 return + 마커를 새로
  만드는 지점(properties.js:104 `ovMarkers=[]`)에서 메모 무효화.
  예상 수치: 핀 클릭 1회당 setIcon 99→3, reselect 33→1.
- 계측 한계: 로컬(127.0.0.1)은 네이버 지도 도메인 인증 401이라
  SDK 내부가 죽어 실제 재페인트는 위임하지 않고 **호출 횟수만**
  계측했다. 육안 확인은 사용자 iPhone 실기기 몫.

## 잔여·확인 필요
- **사용자 실기기 확인 필요**:
  1. **B-192**: 추가폼 원문 입력칸 아래에 "편집기를 불러오지 못해 기본
     입력창으로 표시돼요." 문구가 **보였는지**(이게 보였다면 CDN 로드
     실패가 확정, 안 보였다면 다른 경로라 재진단 필요) + 이번 배포 후
     `1. `+Enter가 `2. `로 늘어나는지.
  2. **B-190**: 담긴 카드의 링크 칩 탭 → 새 탭으로 열리는지(사파리
     팝업 차단에 안 걸리는지).
  3. **B-191**: 메모 없이 노션 링크를 담았을 때 제목이 페이지 제목으로
     바뀌는지(인스타는 여전히 `www.instagram.com` — 크롤링 차단 기결정).
- **B-193·B-194는 지시서 발급 대기**(위 진단 참조).
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정).
- 기존 Safari 관찰 목록(audit sticky/`:has()` 2건 + B-182 시나리오 5건)
  변동 없음.

---

# 이전 핸드오프 — B-189 유튜브 썸네일 직행 + 레이스 가드 완료 (2026-08-02)

> **로테이션 규칙**(B-120, 2026-07-19): 최신 3개만 유지, 새 엔트리
> 추가 시 초과분 절삭 — 과거는 git 이력·HISTORY.md 참조.

## 최신 작업: B-188 후속 — 유튜브 og:image 512KB 상한 우회(전용 URL 직행) + 도착 시점 레이스 가드(1커밋)

```
7e7cf12 feat: 유튜브 전용 썸네일 직행 + 레이스 가드 (B-189)
```

커맨드센터 지시서(`dispatch-2026-08-02-B189.md`), 근거는 B-188 완료
보고(결정 ⓑ 채택)+커맨드센터 검수 레이스 지적 1건. 1커밋,
`js/scraps-form.js`만 — `api/preview.js` 무접촉(512KB 상한 완화 금지
재확인).

**유튜브 전용 썸네일(결정 ⓑ)**: 호스트가 youtube.com/*.youtube.com/
youtu.be면 og:image 파싱(`mode=meta`) 없이 비디오 ID→확정 URL
(`i.ytimg.com/vi/{id}/maxresdefault.jpg`) 직행. ID 추출 4형태(watch?v=·
youtu.be/·shorts/·embed/, `[A-Za-z0-9_-]{11}` 검증) — 실패하면(채널·
재생목록 등) `mode=meta`로도 넘어가지 않고 조용히 종료(폴백 누락 시
유튜브 호스트가 일반 og:image 경로로 새 나갈 뻔한 함정을 미리 차단).
`i.ytimg.com`은 IP 리터럴이 아니라 서버 SSRF 가드를 자연 통과.
maxresdefault가 영상별로 없는 경우가 잦아 hqdefault로 1회만 폴백
(480px지만 compressImage 상한 600px라 화질 손실 무의미).

**레이스 가드**: `compressImage` 콜백이 스크랩 존재만 확인하고
`imgs`를 덮어써 온 것 — 비동기 대기 중 사용자가 수정 모달에서 직접
이미지를 첨부하면 유실되는 결함(커맨드센터 검수 지적). "사용자
첨부 우선" 원칙을 도착 시점에도 재적용하는 1줄(`if(s.imgs&&s.imgs.length)
return;`) 추가 — og:image 경로·유튜브 경로 둘 다 공용 헬퍼
(`scApplyPreviewThumb`)로 통합해 가드를 한 곳에만 둠(중복 방지).

**검증**(Playwright, `/api/preview` 라우트 목업):
1. 유튜브 3형태(watch·youtu.be·shorts) 전부 `mode=meta` 호출 0회로
   썸네일 생성, `imgs[0]==img` 확인.
2. `maxresdefault` 404 목업 → `hqdefault`로 폴백 성공(호출 순서까지
   확인).
3. 비유튜브(네이버 블로그) → 기존 `mode=meta` 경로 그대로, 회귀 0.
4. 레이스 재현 — 이미지 응답 지연 목업 중 스크랩에 사용자 이미지를
   먼저 심고 지연 해제 → 도착한 썸네일이 사용자 이미지를 안 덮어씀
   확인.
5. 유튜브 채널·재생목록(ID 추출 불가) → 호출 0회, 무음 확인.
전체 5항 완전 충족. 콘솔 에러는 기존에도 있던 무관 정적서버 404
(state/health/ingest) 4건뿐, 신규 에러 0.

- **B-189 완료·push 완료**(`7e7cf12`). `HISTORY.md`에 1줄 추가.
- **사용자 실기기 확인 불필요**(B-188과 동일 — 순수 API+백그라운드
  fetch, iOS 특이사항 없음). Safari 관찰 목록 변동 없음.
- **B-164~171잔여**(이전 세션들, 아직 미확인): 매물 메모 행간·별점/
  즐겨찾기 별 탭 감각. 대부분은 후속 세션에서 이미 처리됨(B-166~174).
- **B-163 관찰 계속**: 핀치줌 팬 의심(재현 조건 미확정), 이번
  지시서 범위 밖.

---

# 이전 핸드오프 — B-188 수집함 og:image 자동 썸네일 완료 (2026-08-02)

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
- **커맨드센터 결정 필요(유튜브 썸네일) → 해결됨(B-189, ⓑ 채택)**: 옵션 ⓐ 현행 유지(2/3
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
