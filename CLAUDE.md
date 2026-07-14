# Lab site — 연구실 홈페이지

> Claude Code가 이 폴더에서 작업할 때 항상 참고하는 프로젝트 안내서.
> 작성 시작: 2026-07-08

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **주제** | 《학과 연구실 이름》 연구실(Lab) 홈페이지 |
| **목적** | 연구실 소개 · 구성원 · 연구분야 · 논문/성과 · 소식(공지)을 한 사이트에 정리해 소개 |
| **지도교수** | 학과 교수 5명 / 연구실 3개 (아래 3-3 참고) |
| **소속** | 한남대학교 AI데이터사이언스학과 |
| **기술 스택** | HTML + CSS + JavaScript (프레임워크·빌드도구 없이 순수 정적 사이트) |
| **범위** | 화면(UI) + 가벼운 동적 기능(탭 전환·필터 등)까지. 서버/DB 연동은 이후 단계 |
| **언어** | 화면에 보이는 텍스트는 **전부 영문**. 인명·주소·기관명도 국문 병기 없이 영문 표기만 사용 (예: `Jisup Shim`, `Hannam University`). 본 문서(설계서)만 국문. |

---

## 2. 파일·폴더 구조 (현행 — 2026-07-11 기준)

```
Lab site/
├── CLAUDE.md          ← (본 문서) 프로젝트 안내서
├── index.html         ← 메인 페이지 (연구실 소개 + 대표 섹션) — 사이트 기본 진입 문서
├── members.html       ← 구성원 (교수 · 학생)
├── research.html      ← 연구분야 소개
├── news.html          ← 학과·랩 소식(News) 목록 · 랩 공지사항(Notices)
├── news-*.html        ← News 개별 상세 페이지 (뉴스 1건당 1파일). 현재 4건: news-its-award / news-paper / news-event / news-mobility-workshop
├── support.html       ← 구성원 정보 수정요청 (Support)
├── contact.html 	  ← 찾아오는 길 · 연구실 연락처 · 문의(Contact Us)
├── css/
│   └── style.css      ← 전체 공통 스타일
├── js/
│   └── main.js        ← 공통 스크립트 (탭·아코디언·Support 전환·News 필터)
└── assets/
    ├── img/           ← 교수 사진 5장 + 뉴스 사진 1장(69f1c0e622e929614787.jpg)
    ├── fonts/         ← unica77.woff2 · unica77.woff (self-host 웹폰트, 4장)
    └── AIDS logo.png  ← 헤더 로고 — 흰색·투명배경
```

- 본체 7개 HTML + 뉴스 상세 4개 + `style.css`(843줄) + `main.js`(106줄) **모두 생성 완료** (2026-07-11 기준). 뉴스 상세 4건은 실제 내용이 들어갔고, 나머지 페이지 본문은 아직 더미가 남아 있다 (5-2 주석 참고 · 잔여 20곳은 6장 To Do 11).
- **자산 정리 완료 (2026-07-10)** — 사용하지 않는 이미지를 전부 삭제했다. 이후 교수 사진 5장 · 뉴스 사진 1장 · 웹폰트 2개가 추가됐다.
  - 삭제한 파일: `assets/image.jpg`(로고 원본 JPEG) · `assets/AIDS logo.svg`(이름만 svg, 내용은 JPEG) · `assets/hnu logo.png` · `assets/hnu.svg` · 루트 `GNB.png`
  - ⚠️ **`AIDS logo.png`가 유일본이다.** 로고 원본(`image.jpg`)을 지웠으므로 이 PNG를 잃으면 재생성할 수 없다.
- **헤더 로고 = `assets/AIDS logo.png`**. 7개 페이지 모두 동일.
  - 파일명에 공백이 있어 HTML에서는 `src="assets/AIDS%20logo.png"`로 **인코딩해 참조**한다.
  - 검은 글자 + 흰 배경 JPEG를 **흰색 글자 + 투명 배경 PNG로 변환**해 만든 자산 (1066×366, 여백 제거).
  - `.logo-img`는 `height:26px; width:auto`. **`filter`를 쓰지 않는다** — PNG가 이미 흰색이다. (JPEG는 투명도가 없어 그대로 쓰면 흰 사각형이 남는다.)
  - 로고를 다시 바꿀 때는 **투명 배경 PNG/SVG**를 쓰고, 어두운 헤더 위이므로 **밝은 색**이어야 한다.

**헤더 로고 블록 (확정, 2026-07-10)**

- 구조: `a.logo` 안에 **로고 이미지(위) + 랩 이름 텍스트(아래)** 를 세로로 쌓는다 (`flex-direction: column`).
- 텍스트는 **`HNU AI DataScience Labs`** 로 전 페이지 통일 (2026-07-11 갱신 — `DataScience` 붙여쓰기, `&` 없음).
- 텍스트 크기는 **GNB 링크와 동일한 `15px`** (`.gnb > a`와 맞춘다). 헤더 높이 64px 안에 들어가도록 `line-height: 1.2`.

> 페이지가 늘어나도 **헤더/푸터는 모든 페이지 공통**으로 유지해 통일감을 준다.
> (Dashboard 프로젝트와 동일한 원칙)

---

## 3. 페이지 구성

### 3-1. 공통 레이아웃

```
┌────────────────────────────────────┐
│  헤더: 로고(연구실명) | 메뉴          │  ← 모든 페이지 공통
├────────────────────────────────────┤
│           본문 (페이지별 다름)        │
├────────────────────────────────────┤
│  푸터: 연구실 정보 / 연락처 / 저작권   │  ← 모든 페이지 공통
└────────────────────────────────────┘
```

- 상단 메뉴(GNB): `Home · Members · Research / Project · News · Support · Contact`
  - **`Research / Project`는 드롭다운 없는 단일 링크** (2026-07-11 변경 — 아래 3-5). 라벨 구분자는 슬래시 `/`를 쓴다 (`&`에서 변경).
  - 라벨이 길어 줄바꿈·축소되지 않도록 `.gnb > a`에 `white-space: nowrap; flex-shrink: 0`을 주고, 항목 간격은 `.gnb { gap: 34px }`로 넓혔다. 모든 GNB 항목은 같은 `15px`.
- 현재 페이지 메뉴 항목에 `active` 표시.
- **드롭다운(hover 목록) 메뉴**: `Members` · `News`에 적용 (`Research`는 드롭다운 폐지).
  - `Members` hover → `Professor / Students`
  - `News` hover → `News / Notices`
  - **부모 메뉴를 직접 클릭**하면(드롭다운에서 고르지 않고) 해당 페이지의 **기본 탭**이 열린다 → `Members`=`Professor`, `News`=`News`.
  - 드롭다운에서 하위 항목을 고르면 해당 탭으로 바로 이동.
  - 나머지 메뉴(`Home` / `Support` / `Contact`)는 단일 페이지.
  - (UNIST VIP Lab · 3D Vision & Robotics Lab 사이트 방식 참고)

> **`Publications` 메뉴는 폐지했다 (2026-07-10).** `publications.html`을 삭제하고, 대신 Members > Professor 탭의 각 연구실 그룹에 **`Lab Info` 버튼**을 두어 해당 연구실의 자체 홈페이지로 보낸다 (3-3 참고). 논문 목록은 각 랩 홈페이지가 담당한다.

**탭 상태 표현 — 해시(`#`) 방식으로 확정 (2026-07-09)**

- 드롭다운 하위 항목의 링크는 `페이지.html#탭이름` 형태로 쓴다.
  - 예: `members.html#professor` · `members.html#students` · `news.html#notices`
- 부모 메뉴 직접 클릭 = 해시 없는 `members.html` → **기본 탭**이 열린다 (3-1의 기본 탭 규칙).
- `js/main.js`는 페이지 로드 시 `location.hash`를 읽어 해당 탭에 `.is-active`를 준다. 해시가 없거나 모르는 값이면 기본 탭으로 폴백.
- 탭을 바꿀 때 `location.hash`도 갱신한다 → 새로고침·북마크·뒤로가기에서 같은 탭이 유지된다.
- ⚠️ 쿼리(`?tab=`) 방식은 쓰지 않는다. 정적 사이트라 서버가 쿼리를 읽지 못하고, 결국 JS로 파싱해야 해서 해시보다 이점이 없다.

**대상 환경** — **데스크톱(PC) 동작을 우선**한다. hover 드롭다운의 모바일/터치 대응은 이번 설계 범위에서 **보류** (To Do 10 이후 별도 결정).

### 3-2. 페이지별 핵심 내용

| 페이지 | 핵심 구성 |
|--------|-----------|
| `index.html` | 히어로(연구실 한 줄 소개) · 연구실 개요 · 연구분야 미리보기 · 최근 소식 미리보기 |
| `members.html` | Professor / Students 탭 — 지도교수 프로필 · 대학원생/학부연구생 (졸업생 페이지는 만들지 않음) |
| `research.html` | 연구 키워드 · 주제별 설명 카드 · (선택) 대표 프로젝트 |
| `news.html` | News 탭 = 카테고리 필터(All·Award·Paper·Event) + 카드 클릭 시 개별 상세 페이지(`news-*.html`)로 이동 / Notices 탭 = 같은 카드 리스트(필터 없음) (3-8) |
| `support.html` | 구성원 정보 수정요청 게시판 (Request Information Update — 3-7) |
| `contact.html` | Contact us — Google 지도(pin) + Contact Info (공통 주소 · 연구실별 호실/E-mail/TEL ×3) (3-9) |

### 3-3. Members 페이지 상세 (`members.html`)

**학과 연구실 구성 (교수 5명 / 연구실 3개)** — 2026-07-10 갱신

| 연구실 | 지도교수 | 화면 표기(영문) |
|--------|----------|-----------------|
| Lab 1 | 박영호 | Youngho Park |
| Lab 2 | 박민주 · 고은정 · 심지섭 (3인 공동 운영) | Minju Park · Eunjeong Ko · Jisup Shim |
| Lab 3 | 한소율 | Soyul Han |

> **김명준 교수는 이 사이트의 연구실 구성에서 제외한다** (2026-07-10 결정). 학과 교수진에는 있으나 본 랩 사이트에는 싣지 않는다.

**교수 상세 정보 (2026-07-10 반영 완료)**

출처: [학과 교수진소개](https://bigdata.hannam.ac.kr/교수진소개/) — 직급 · 전공분야 · 전화번호.
직급 영문 표기는 UNIST 학과 faculty 페이지 관례를 따른다 (`교수`=Professor / `부교수`=Associate Professor / `조교수`=Assistant Professor).

| 연구실 | 이름 | 직급 | 전공분야 | TEL | E-mail | 사진 |
|--------|------|------|----------|-----|--------|------|
| Lab 1 | Youngho Park | Associate Professor · Department Chair | Image Analysis · Web Applications · Big Data | 042-629-7513 | yhpark@hnu.kr | `assets/img/yhpark.png` |
| Lab 2 | Minju Park | Associate Professor | Smart Mobility · Autonomous Driving · AI · Big Data | 042-629-8484 | parkmj@hnu.kr | `assets/img/mjpark.png` |
| Lab 2 | Eunjeong Ko | Assistant Professor | Big Data Analytics · Mobility · ITS · Data Economy | 042-629-7654 | eunjeong.ko@hnu.kr | `assets/img/ejkoh.jpg` |
| Lab 2 | Jisup Shim | Assistant Professor | AI Mobility · Geospatial Information · Big Data | 042-629-7653 | gis.up@hnu.kr | `assets/img/ShinJiseop.jpg` |
| Lab 3 | Soyul Han | Assistant Professor | Deep Learning · Audio Anomaly Detection | 042-629-7634 | soyul5458@hnu.kr | `assets/img/syhan.jpg` |

**표기 규칙 (확정, 2026-07-10)**

- 한 구성원의 세부는 **문단(`<p>`)을 나눠 한 줄에 하나씩** 쓴다. `E-mail` 다음 줄에 `TEL`이 온다. 옆으로 나열하지 않는다.
- 전화 라벨은 **`TEL.`** 로 쓴다 (`Phone:` 아님). 예: `<p>TEL. 042-629-7653</p>`
- 이메일은 `mailto:` 링크로 건다. 예: `<p>E-mail: <a href="mailto:gis.up@hnu.kr">gis.up@hnu.kr</a></p>`

**⚠️ 이메일 출처 주의 (기록용)**

- 학과 사이트의 `상세보기` 버튼은 **모두 같은 페이지로 연결되며 이메일을 보여주지 않는다.** 주소는 페이지 HTML의 **주석 처리된 `mailto:` 링크**에만 남아 있었다.
- 그 주석 중 **심지섭 · 고은정 · 한소율 세 명은 박영호 교수의 주소(`yhpark@hnu.kr`)가 그대로 복사**돼 있어 쓸 수 없었다.
- → 세 명의 실제 주소(`gis.up@` / `eunjeong.ko@` / `soyul5458@`)는 **사용자가 직접 제공**했다. 나머지 3명은 사이트 주석값 사용 (`parkmj` / `mkim` / `yhpark`).

**영문 이름 근거** — `Jisup Shim`(Google Scholar 본인 프로필, "Assistant Professor, Hannam University") · `Eunjeong Ko`(Google Scholar) · `Soyul Han`(Google Scholar) · `Minju Park`(sciprofiles / ORCID). 학과 사이트 이미지 파일명이 `ShinJiseop.jpg`이지만 **본인 표기는 `Shim`**이다.

**메뉴 동작** — `Members` hover 시 `Professor / Students` 드롭다운. **헤더 `Members`를 직접 클릭하면 기본으로 `Professor` 탭이 열린다.** 드롭다운에서 항목을 고르면 해당 탭으로 이동. (공통 규칙 3-1 참고)

**레이아웃** — Research(3-5)와 **동일한 배치**. 왼쪽 상단에 선택된 탭 이름 하나(`Professor` 또는 `Students`)만 큰 제목으로 표시하고, 그 아래에 구성원 목록을 세로로 나열한다. 각 항목의 구성은 3-5와 같으며 **매핑**은 다음과 같다:
- **이미지 → 프로필 사진**
- **제목 → 이름 (영문 표기만)**
- **설명 문단 → 해당 구성원의 세부 항목**

```
┌──────────────────────────────────────┐
│  Professor          ← 좌측 상단: 선택된 탭 이름 하나(대형 제목)
│                                       │
│  ┌────────┐  Jisup Shim               │
│  │ 프로필  │  직함 · 연구분야           │  ← 구성원 1
│  │  사진   │  이메일 · 연락처           │
│  └────────┘                          │
│  ┌────────┐  Soyul Han               │
│  │ 프로필  │  ...                      │  ← 구성원 2
│  └────────┘                          │
└──────────────────────────────────────┘
```

**Professor 탭**
- 설명(세부) 영역 항목: **직함 · 연구분야 · 이메일 · 연락처 · 경력(수상·이력 등)** (+ 프로필 사진, 이름).
- 교수 5명을 위 형식으로 나열. **연구실 단위(Lab 1 → Lab 2 3명 → Lab 3)로 묶어** 보여줌.
- 세부 정보는 **한 줄에 하나씩 문단(`<p>`)으로** 쓴다. `E-mail` 다음 줄에 `TEL.` (라벨은 `Phone:` 아님).

**`Lab Info` 버튼 — 랩 홈페이지 바로가기 (확정, 2026-07-10)**

- 폐지된 `Publications` 메뉴를 대신하는 장치다. **각 연구실은 자체 홈페이지를 운영**하므로, 논문·성과는 그쪽에서 본다.
- 위치: **각 `lab-group`의 제목 줄 오른쪽 끝.** 연구실 이름(`Lab 1`)과 같은 행에 둔다.
- 표기: `Lab Info →` — index의 `See more →`와 같은 결(`.more-link` 계열) 버튼.
- 동작: 클릭 시 해당 연구실 홈페이지로 이동. **새 탭으로 연다** (`target="_blank"` + `rel="noopener noreferrer"`). 외부 사이트이므로 현재 탭을 뺏지 않는다.
- 클래스: `.btn-lab-info`.

```html
<div class="lab-group__head">
    <h2 class="lab-group__title">Lab 1</h2>
    <a class="btn-lab-info" href="…" target="_blank" rel="noopener noreferrer">Lab Info →</a>
</div>
```

> ⚠️ **랩 홈페이지 URL 3개는 아직 미확정** — `TODO(dummy)` 상태. 확인되면 `href`를 채운다.

**Students 탭**
- 같은 항목 형식(프로필 사진 + 이름 + 세부)이되, **세부 = 신분 표기**(석사 / 학부연구생 등) 위주 + **경력(수상 등, 있는 경우)**.
- **연구실 단위 3그룹으로 구분** (1-a 방식) — box 또는 구분선(line)으로 그룹을 나눔:
  - `[ Lab 1 — 박영호 ]`
  - `[ Lab 2 — 박민주·고은정·심지섭 ]`
  - `[ Lab 3 — 한소율 ]`
- 그룹 안에는 학부연구생 다수 + 대학원생 일부. **이름 옆에 신분 표기**를 단다. 예: `Gildong Hong (M.S. Student)`, `Chulsoo Kim (Undergraduate Researcher)`.
- **졸업생(Alumni) 탭·목록은 만들지 않는다** (2026-07-09 결정).

> 실제 학생·교수 상세 정보가 없으면 **더미 데이터**로 채우고 5-2의 고정 주석으로 표시한다.

### 3-4. Main 페이지 상세 (`index.html`)

**성격** — 특정 랩 하나가 아니라 AI데이터사이언스학과의 **3개 연구실(교수 5명)을 대표하는 통합 랜딩 페이지**.

**섹션 구성 (위 → 아래)**

1. **Header** (공통) — 짙은 남색 배경.
2. **Hero**
   - 배경: **사이트 공통 배경(밝은 남색 단색)과 동일** — 별도 배경이미지·그라디언트 없음. 헤더(짙은 남색)와 톤 대비.
   - 내용: 대표 타이틀(영문) + 학교명 + 한 줄 태그라인. **CTA 버튼 없음 (텍스트만).**
   - 타이틀: `AI DataScience Labs` / `Hannam University` (2026-07-11 — 정식명칭 반영).
3. **About** — 연구 그룹 소개 문단. *(숫자 지표 strip 미포함)*
   - ⚠️ **현재 본문이 국문이다.** 전 화면 영문 규칙(1장) 위반 — 영문으로 교체 필요.
4. **Research / Project 미리보기** ✅ **구현 완료 (2026-07-11)** — `.card-grid` 카드 3장 + `See more →` (→ `research.html`).
   - **Lab 2 · Lab 3 · Lab 1 에서 한 항목씩** 뽑아 이 순서로 놓는다. 현재: `Smart Mobility and Autonomous Driving`(Lab 2 Research) · `Deep Learning for Audio Anomaly Detection`(Lab 3 Research) · `Deep Learning Based Image Analysis`(Lab 1 **Project**).
   - 각 카드 맨 위에 출처 라벨 `.card__lab` (예: `Lab 2 · Research`). Lab 1 항목만 Project 소속이라 라벨이 없으면 셋이 같은 성격으로 오인된다.
   - 카드 제목은 **`research.html`의 실제 항목명과 문자열이 일치**해야 한다. 항목명을 바꾸면 두 파일을 함께 고친다.
   - 카드는 텍스트 전용이다 (`.card`에 썸네일 구조 없음).
5. ~~**Our Labs 미리보기**~~ — **미구현.** index에 섹션 자체가 없다. 만들 계획이면 `Lab 1/2/3` 3개 카드 (→ `members.html`).
6. ~~**Recent News 미리보기**~~ — **미구현.** index에 섹션 자체가 없다. 만들 계획이면 최신 소식 3~4건 + `See more →` (→ `news.html`).
7. **Footer** (공통).

> ⚠️ **현재 index.html의 실제 섹션은 `Header · Hero · About · Research/Project 미리보기 · Footer` 5개뿐이다** (2026-07-11 확인). 위 5·6번은 설계에만 있고 만들지 않았다.

> **Publications 하이라이트 섹션은 폐지** (2026-07-10, 3-6). Our Labs 카드의 `Lab Info`가 그 역할을 대신한다.

> **미포함(이번 결정)**: Stats strip(숫자 지표), Contact/Location 티저.

### 3-5. Research 페이지 상세 (`research.html`)

**메뉴 동작 (2026-07-11 변경)** — 드롭다운·탭을 폐지하고 **`Research / Project` 단일 페이지**로 합쳤다. 헤더 `Research / Project`를 클릭하면 research.html 한 페이지에 **Research 섹션과 Project 섹션이 세로로 이어져** 표시된다. (이전: `Research`/`Project` 하위 탭을 드롭다운으로 전환)

**레이아웃** — 한 페이지에 **Research 섹션 → (여백) → Project 섹션**을 세로로 이어 배치한다. 각 섹션은 왼쪽 상단에 큰 제목(`Research` / `Project`)을 두고 그 아래 항목 목록(이미지 + 내용)을 세로로 나열한다. 아래 Project 섹션은 `<section id="project" class="section-below">`로 상단 여백(`.section-below { margin-top: 64px }`)을 줘 앞 섹션과 구분한다. (탭 전환·드롭다운 없음)

```
┌──────────────────────────────────────┐
│  Research           ← 섹션 1 제목 (대형)
│  ┌────────┐  주제 제목               │
│  │ 이미지  │  설명 문단 · Read more → │  ← 항목들
│  └────────┘                          │
│                                       │
│  Project            ← 섹션 2 제목 (그 아래에 이어짐)
│  ┌────────┐  프로젝트명              │
│  │ 이미지  │  설명 ...               │
│  └────────┘                          │
└──────────────────────────────────────┘
```

**Research 탭**
- 연구 주제를 **세로 목록**으로 나열. 각 항목 = **이미지 + 주제 제목 + 설명 문단 (+ `Read more →`)**.
- (UNIST VIP Lab의 Research 페이지 형식 참고)

**`Read more →` 동작 — 인라인 확장(아코디언)으로 확정 (2026-07-09)**

- 별도 상세 페이지(`research-detail.html` 등)를 **만들지 않는다**. 페이지 이동도 없다.
- 각 항목의 설명은 **요약 2~3줄만 먼저 보이고**, `Read more →`를 누르면 **그 자리에서 아래로 펼쳐져** 전체 문단이 드러난다. 다시 누르면 접힌다(`Read less ←`).
- 구현: 설명 컨테이너에 `.is-open` 토글 (`js/main.js`). 접근성 위해 버튼은 `<button>` + `aria-expanded`.
- Project 탭 항목도 설명이 길면 같은 아코디언을 재사용한다.

**Project 탭**
- 진행/완료 프로젝트를 목록으로 나열. 각 항목 = **이미지 + 프로젝트명 + 설명** (+ 기간·지원기관 등은 선택).

**현재 내용 (2026-07-11)** — ⚠️ **랩 배치는 이대로 고정한다.** Research = Lab 2·Lab 3, Project = Lab 1(Youngho Park). Lab 1을 Research 쪽으로 옮기지 않는다.

| 섹션 | 랩 | 항목명 | 이미지 |
|------|----|--------|--------|
| Research | Lab 2 | Smart Mobility and Autonomous Driving | `assets/img/LAb2-1.jpg` |
| Research | Lab 2 | Transportation Big Data and Intelligent Transport Systems | `assets/img/LAb2-2.jpg` |
| Research | Lab 3 | Deep Learning for Audio Anomaly Detection | `assets/img/audio.jpg` |
| Project | Lab 1 | Deep Learning Based Image Analysis | `assets/img/project2.jpg` (노이즈 제거 비교) |
| Project | Lab 1 | Web Applications for Big Data Services | `assets/img/project1.jpg` (아키텍처 다이어그램) |

- ⚠️ **파일명이 순서와 엇갈려 있다** — `project2.jpg`가 1번, `project1.jpg`가 2번 항목에 붙는다. 이미지 교체 과정에서 생긴 것이며 동작에는 문제 없다.
- 이미지는 전부 `.profile-item__thumb--wide` (5-1)를 쓴다. 인물용 기본 thumb를 쓰면 가로형 이미지가 세로로 잘린다.
- **본문 텍스트는 교수 전공분야(3-3 표)에서 도출한 초안**이며 실제 연구내용 확인이 필요하다 (`TODO(dummy)` 표시). 기간·지원기관은 지어낼 수 없어 자리표시자로 비워 뒀다.
- 이 5개 항목 중 3개(Lab 2·Lab 3·Lab 1 각 1개)를 index 미리보기 카드가 그대로 인용한다 (3-4). **항목명을 바꾸면 index.html도 함께 고친다.**

> 실제 연구·프로젝트 내용이 없으면 **더미 데이터**로 채우고 5-2의 고정 주석으로 표시한다.

### 3-6. ~~Publications 페이지~~ — **폐지 (2026-07-10)**

`publications.html`을 **삭제했다.** 논문·성과 목록은 이 사이트에서 관리하지 않는다.

- **이유** — 연구실마다 자체 홈페이지가 있고, 논문 목록은 그쪽에서 이미 관리한다. 사이트를 두 곳에서 중복 갱신할 필요가 없다.
- **대체** — Members > Professor 탭의 각 연구실 그룹에 `Lab Info →` 버튼을 두고, 해당 랩 홈페이지로 새 탭에서 이동시킨다 (3-3).
- **함께 제거된 것**
  - GNB의 `Publications` 메뉴와 `Journals / Conferences` 드롭다운 (3-1)
  - `index.html`의 Publications 하이라이트 섹션 (3-4)
  - `js/main.js`의 미리보기 모달 계획 · `PUBLICATIONS` 데이터 스키마
  - `assets/pubs/` 폴더 (논문 PDF·썸네일 보관용)
- 되살릴 일이 생기면 이 문서의 git 이력(또는 이전 버전)에서 3-6 원문을 참고한다.
### 3-7. Support 페이지 상세 (`support.html`)

**목적** — 랩 구성원의 **정보 수정요청 창구**. 예: 구성원 A가 학회에서 수상 → members.html 프로필에 경력을 추가하고 싶음 → 이 페이지에 요청 게시글을 남김. (요청 이후 실제 사이트 반영은 담당자가 수행)

**메뉴 동작** — **드롭다운 없는 단일 페이지 메뉴.** 헤더 `Support`를 클릭하면 바로 정보 수정요청 화면이 열린다. (기존 `Contact Us` 항목은 `contact.html`로 통합 — 2026-07-08 결정)

**레이아웃** — 다른 페이지(3-3 / 3-5)의 왼쪽 상단 제목 배치와 달리, **제목을 중앙 상단에 배치**한다.

```
[ 목록 상태 ]                            [ 작성 상태 ]
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│     Request Information Update        │  │     Request Information Update        │
│                             [Write]   │  │  ┌────────────────────────────────┐  │
│  ┌────────────────────────────────┐  │  │  │ ←                              │  │
│  │  번호│제목│요청자│작성일│처리상태  │  │→ │  │   (뒤로가기)                    │  │
│  │  ─────────────────────────────  │  │  │  │   Title  [____________]        │  │
│  │   3 │ ... │ ... │ ... │ 대기    │  │  │  │   Author [____________]        │  │
│  │   2 │ ... │ ... │ ... │ 반영완료 │  │← │  │   Content [__________]        │  │
│  └────────────────────────────────┘  │  │  │                     [Submit]   │  │
└──────────────────────────────────────┘  │  └────────────────────────────────┘  │
                                          └──────────────────────────────────────┘
```

**Request Information Update (본문 — 목록 상태)**
- 정보 수정요청 게시글 목록. Dashboard의 `.board-table` 마크업 재사용 (색상은 5-1 팔레트로 교체).
- **표 컬럼 (확정, 2026-07-09)** — `번호 | 제목 | 요청자 | 작성일 | 처리상태`
  - 화면 표기는 영문: `No. | Title | Requester | Date | Status`
  - `처리상태(Status)`는 **뱃지**로 표시 — `Pending`(대기) / `Done`(반영완료) 2종. Dashboard의 `.badge` 패턴 재사용.
- **오른쪽 상단에 `Write` 버튼.**

**Write 동작 — 같은 페이지 내 상태 전환 (확정, 2026-07-09)**
- `Write`를 눌러도 **별도 페이지로 이동하지 않는다.** Support 화면을 유지한 채 **테이블 자리에 작성 블록이 대신 표시**된다. (목록 블록 `display:none` ↔ 작성 블록 `display:block` 토글)
- 작성 블록 **왼쪽 상단에 뒤로가기 화살표(`←`)** 를 둔다. 누르면 작성 내용을 버리고 목록 상태로 돌아온다. (작성 도중 목록으로 복귀하는 용도)
- 페이지 제목 `Request Information Update`와 헤더/푸터는 두 상태에서 **그대로 유지**된다.
- 작성 블록 입력 항목: `Title` · `Requester` · `Content` (+ `Submit` 버튼).

**Submit 등록 동작 — 구현 완료 (2026-07-12, `initSupportBoard()`)**

- `Submit`을 누르면 **글이 실제로 목록 표에 등록되고, 새로고침해도 남는다.** 저장소는 **브라우저 `localStorage`** (키: `support-requests-v1`).
- 동작: 입력 검증(빈 값·공백 차단) → `localStorage`에 append → 표 맨 위에 최신순으로 렌더 → 폼 초기화 → 목록 상태로 자동 복귀.
- 번호는 HTML 고정 3건의 최대 번호(`3`)에서 이어 붙인다. 새 글의 상태 뱃지는 항상 `Pending`.
- HTML의 **고정 3건(더미)은 표에 그대로 두고**, 등록한 글만 `data-support-post` 속성으로 구분해 지웠다 다시 그린다.
- ⚠️ **사용자 입력은 반드시 `textContent`로만 넣는다.** `innerHTML`을 쓰면 제목에 친 `<img src=x onerror=…>` 같은 태그가 실제로 실행된다(XSS). `buildSupportRow()`가 `createElement` + `textContent`로만 조립하는 이유다. 이 페이지를 고칠 때 절대 `innerHTML`로 바꾸지 말 것.

**실제 접수 — Google Form 전송 ✅ 연결 완료 (2026-07-12, 실제 제출 확인)**

- 폼: `Request information Update` — `1FAIpQLScW7BVOeJPbFl3mv2VA9iPSlSY5NkMRqZxBokGQL08RSVUSFg`
- 질문 5개 / entry ID (`js/main.js`의 `SUPPORT_FORM`에 반영 완료):

| 질문 | entry ID | 값의 출처 |
|------|----------|-----------|
| Title | `entry.1045781291` | 사용자 입력 |
| Requester | `entry.2005620554` | 사용자 입력 |
| Content | `entry.485142794` | 사용자 입력 |
| Date | `entry.1065046570` | **자동** — 오늘 날짜 |
| Status | `entry.1166974658` | **자동** — 항상 `Pending` |

**⚠️ 폼 설정 3가지가 반드시 이 상태여야 한다** (하나라도 어긋나면 전송이 실패하는데, CORS 때문에 화면에는 "등록됨"으로 보인다):

1. **이메일 주소 수집 = "수집 안 함"** — "응답자 입력"이면 필수 이메일 칸이 생겨 400. 로그인 요구 옵션이면 401.
2. **"응답 횟수 1회로 제한" = 꺼짐** — 켜면 구글 로그인을 강제해 401.
3. **어떤 질문에도 "응답 확인(Response validation)"을 걸지 말 것** — 실제로 `Title`에 이메일 검증이 걸려 있어 400이 났다. 제목은 평범한 문장이라 이메일 형식을 통과할 수 없다.

> 연결이 깨졌는지 확인하려면 `viewform` 페이지의 `FB_PUBLIC_LOAD_DATA_`를 파싱해 질문·entry ID·검증규칙을 덤프하면 된다. 폼을 수정한 뒤에는 반드시 다시 확인할 것.

---

**(기록) 아래는 배선 당시의 설명 — 설정 방법 참고용**

- 방식 확정: **사이트의 다크 톤 폼을 그대로 쓰고, Submit 시 값만 Google Form 으로 몰래 POST 한다.** (iframe 삽입 방식은 흰 배경 구글 폼이 남색 사이트에서 튀어 채택하지 않았다.)
- `js/main.js` 상단의 **`SUPPORT_FORM` 상수 3개만 채우면 즉시 작동**한다. 비어 있으면 전송을 건너뛰고 localStorage 에만 저장하며 콘솔에 경고를 남긴다 (현재 상태).

```js
const SUPPORT_FORM = {
    action: "https://docs.google.com/forms/d/e/<FORM_ID>/formResponse",
    fields: { title: "entry.___", requester: "entry.___", content: "entry.___" }
};
```

**설정값 얻는 법** (Google 계정 로그인이 필요하므로 **사람이 직접** 해야 한다. Claude 는 못 한다)

1. Google Forms 에서 폼을 만든다. 질문 3개: `Title` · `Requester` · `Content` (전부 단답/장문, 필수).
2. 폼을 **링크가 있는 사람은 응답 가능**으로 공개한다 (로그인 요구 끄기 — 안 끄면 전송이 조용히 실패한다).
3. 미리보기(`…/viewform`) 페이지에서 **페이지 소스 보기** → `entry.` 로 검색 → 질문 3개의 숫자 ID를 찾는다.
4. 주소의 `/viewform` 을 **`/formResponse`** 로 바꿔 `action` 에 넣는다.

**⚠️ 이 방식의 한계 (알고 쓸 것)**

- **전송 성공을 코드가 확인할 수 없다.** 구글이 CORS 를 막아 `no-cors` 로 보내므로 응답을 읽지 못한다. 폼 ID·entry ID 가 틀려도 화면에는 "등록됨"으로 보인다 → **설정 후 반드시 실제로 한 건 넣어보고 구글 스프레드시트에 들어오는지 눈으로 확인할 것.**
- localStorage 저장은 **그대로 유지**한다. 목록 표에 자기 글이 보이는 건 이 로컬 사본 덕분이며, 담당자에게 보이는 실체는 **구글 폼 응답 시트** 쪽이다. 둘은 별개다.
- 다른 사람이 남긴 요청은 목록 표에 보이지 않는다 (각자 브라우저에만 있으므로). 담당자는 스프레드시트를 봐야 한다.
- 스팸 방지 장치가 없다. 공개 사이트이므로 누구나 폼에 값을 넣을 수 있다.
- 상태 전환은 `js/main.js`에서 `.is-active` 계열 클래스 토글로 처리 (3-1 탭 토글과 같은 방식). 이 전환은 **해시로 관리하지 않는다** — 탭이 아니라 일시적 화면 상태이기 때문.

### 3-8. News 페이지 상세 (`news.html`)

**메뉴 동작** — `News` hover 시 `News / Notices` 드롭다운. **헤더 `News`를 직접 클릭하면 기본으로 `News` 탭이 열린다.** 드롭다운에서 항목을 고르면 해당 탭으로 이동. (공통 규칙 3-1 참고)

**레이아웃** — Members(3-3)·Research(3-5)와 동일: **왼쪽 상단에 선택된 탭 이름 하나**(`News` 또는 `Notices`)만 큰 제목으로 표시하고, 그 아래에 게시글 목록을 배치.

**News 탭 (기본) — 카테고리 필터 + 클릭형 카드 리스트로 변경 (2026-07-11)**

- ⚠️ **`.board-table` 게시판 표를 폐기하고 카드 리스트로 바꿨다.** (Notices 탭도 이후 같은 카드형으로 통일 완료)
- **카테고리 필터 바** — 탭 제목 아래에 `All · Award · Paper · Event` 버튼 4개를 둔다.
  - **`All`이 기본**이며 전체 항목을 **날짜 내림차순**으로 보여준다. News 탭에 처음 들어오면 항상 `All` 상태다.
  - 나머지 버튼을 누르면 해당 카테고리 카드만 남는다. 구현: `js/main.js`의 `initNewsFilter()`가 버튼 `data-filter`와 카드 `data-category`를 비교해 `.is-hidden`을 토글한다. (해시는 쓰지 않는다 — News/Notices 탭 해시와 별개인 2차 상태)
  - 클래스: 바 `.news-filter`, 버튼 `.news-filter__btn`(활성 `.is-active`).
- **각 항목 = 클릭 시 개별 상세 페이지로 이동하는 카드** (UNIST VIP Lab news 방식 — `vip.unist.ac.kr/category/news/`. 그쪽도 항목마다 고유 URL 페이지로 이동한다). 원문 외부 링크가 아니라 **사이트 안의 상세 페이지**로 간다.
  - ⚠️ **상세를 news.html 안에 넣지 않는다.** 뉴스가 늘어도 `news.html`은 목록만 유지하도록, **상세는 뉴스 1건당 파일 1개(`news-*.html`)로 분리**한다 (예: `news-its-award.html`). news.html 카드는 `<a class="news-card" href="news-its-award.html">`이고 **같은 탭**으로 이동한다.
  - 카드 구성: **카테고리 뱃지 + 작성일 + 제목 + 요약**(`__meta`·`__date`·`__title`·`__summary`).
  - **상세 페이지 구조** — 다른 페이지와 동일한 공통 헤더/푸터(경로가 같도록 **루트에 둔다**, 폴더 금지) + `<a class="news-back" href="news.html">← Back to News</a>` + `<article class="news-detail">`(뱃지·날짜 `.news-card__meta` + 제목 `.news-detail__title` + 사진 `.news-detail__img`(선택) + 본문 `<p>`). 헤더의 News 메뉴에 `active`.
  - **뉴스 추가 절차**: ① `news-*.html` 파일 하나 생성(상세 페이지 템플릿 복사) ② `news.html` 목록에 `<a class="news-card" data-category="…" href="news-*.html">` 카드 한 줄 추가. JS 수정 불필요.
- **실제 반영된 항목 (2026-07-11)** — 4건 모두 실제 내용이며 더미가 아니다.
  - `news-its-award.html` — Award. "Big Data Applications students take part in the Korea ITS Society Conference" (2026-04-29). 본문 3문단 + 컨퍼런스 사진(`assets/img/69f1c0e622e929614787.jpg`).
  - `news-event.html` — Event. "The 15th APTE 2026" (2026-07-06).
  - `news-mobility-workshop.html` — Event. "Korea Mobility Society 2026 Spring Conference & Future Mobility Workshop" (2026-06-18).
  - `news-paper.html` — Paper. "Assessment of Drought Vulnerability due to Climate Change in Gangwon State" (2024).

**Notices 탭**
- **랩실 공지사항**. **News 탭과 동일한 카드 리스트 형식으로 전환 완료 (2026-07-11).** `.news-list` + `.news-card` 재사용. 단 Notices에는 카테고리 필터 바를 두지 않는다.
- 현재 게시글은 더미 1건(`TODO(dummy)`)이며 카드 `href="#"` 상태 — 상세 페이지가 아직 없다. 실제 공지를 넣을 때 News와 같은 절차(상세 파일 1개 + 카드 1줄)를 따른다.
- ⚠️ 이 전환으로 **`.board-table`은 이제 `support.html`에서만 쓰인다** (5-1 표 참고).

**분류(Category) 뱃지 값** — Dashboard의 학사/장학/취업 분류는 쓰지 않는다. 랩 사이트용:
- `Award` · `Paper` · `Event` (3종). 필터의 `All`은 뱃지가 아니라 "전체 보기" 상태다.

> 실제 게시글이 없으면 **더미 데이터**로 채우고 5-2의 고정 주석으로 표시한다.

### 3-9. Contact 페이지 상세 (`contact.html`)

**메뉴 동작** — 드롭다운 없는 단일 페이지 메뉴. (공통 규칙 3-1 참고)

**레이아웃** — UNIST 3D Vision & Robotics Lab의 Contact 페이지 방식 참고. **제목 `Contact us`를 중앙 상단에 배치** (Support와 동일한 중앙 배치).

```
┌──────────────────────────────────────┐
│             Contact us                │ ← 제목: 중앙 상단
│  ┌────────────────────────────────┐  │
│  │        Google 지도              │  │ ← 연구실 위치에 pin 표시
│  │            📍                   │  │
│  └────────────────────────────────┘  │
│  Contact Info                         │
│  Address: Hannam University ... (공통) │
│  [ Lab 1 ]  호실 · E-mail · TEL       │
│  [ Lab 2 ]  호실 · E-mail · TEL       │
│  [ Lab 3 ]  호실 · E-mail · TEL       │
└──────────────────────────────────────┘
```

**섹션 구성 (위 → 아래)**

1. **제목** — `Contact us` (중앙 상단).
2. **Google 지도** — Google Maps API로 삽입, **연구실이 위치한 곳에 pin**을 꽂아 위치 표시.
3. **Contact Info** — 지도 아래.
   - **`Address:`로 시작** — 연구실이 위치한 주소.
   - 이어서 **연구실 3개 각각의 연락 블록**: 연구실 번호(호실) → `E-mail:` → `TEL.` 순.
   - 즉, 참고 사이트의 contact 블록이 **총 3개 있는 구성** (Lab 1 / Lab 2 / Lab 3).

**지도 — 삽입 완료 (2026-07-11)**

- **iframe embed 방식으로 확정**했다 (API 키 불필요). Maps JavaScript API는 쓰지 않는다.
- `.map-embed` 안에 아래 iframe이 들어가 있다. 좌표는 plus code `9C4C+J66 Daejeon`.
  ```html
  <iframe src="https://www.google.com/maps?q=9C4C%2BJ66+Daejeon&output=embed" …></iframe>
  ```
- ⚠️ **다크 톤 스타일링은 불가** — iframe embed는 지도 색을 바꿀 수 없다. 사이트 남색 테마와 톤이 다른 점은 감수한다. 꼭 필요해지면 Maps JavaScript API(키 필요)로 전환해야 한다.
- 실제 주소·호실·전화·이메일 값은 **미정 — 페이지를 구성하며 채워 넣는다.** 그때까지 **더미 데이터** + 5-2 고정 주석. 주소도 영문 표기.

---

## 4. 디자인 원칙 

- **톤**: 학술적이고 깔끔하게. 여백을 넉넉히, 색은 절제해서 사용. 주로 어두운 계열 사용(짙은 남색, 그레이 색상 위주)
- **색상 (갱신, 2026-07-11)**: **모든 페이지 공통으로 — 배경은 남색, 포인트는 딥 레드(와인/피색) + 흰색.**
  - 딥 레드 = 브랜드 강조 (제목 밑줄 · 뱃지 · active · 버튼 · hover)
  - 흰색 = 고대비 강조 (핵심 텍스트 · 주요 하이라이트)
  - 기존 "파란색" 포인트는 폐기했다. 사이트 어디에도 파란 포인트를 쓰지 않는다.
  - ⚠️ **변수명은 `--purple`이지만 값은 자주색이 아니라 딥 레드다.** 2026-07-09에 자주색(`#a34fc9`)으로 정했다가 딥 레드(`#7d1420`)로 바꿨는데, 전 페이지가 이미 이 변수명을 참조하고 있어 **이름은 그대로 두었다.** 이름만 보고 자주색으로 착각하지 말 것.
  - ⚠️ **채움용과 글자용을 반드시 구분한다** (5-1 팔레트).
    - `--purple`(`#7d1420`)은 **배경·채움·테두리 전용**이다. 남색 배경 위 글자색으로 쓰면 대비가 약 2.4:1까지 떨어져 읽히지 않는다 (WCAG 최소 4.5:1 미달).
    - 남색 배경 위 **글자에 포인트색을 줄 때는 반드시 `--purple-text`(`#de4b59`)** 를 쓴다. 대비 약 5:1.
    - 실제로 2026-07-11 index 미리보기 카드 라벨(`.card__lab`)에 `--purple`을 잘못 써서 가시성 문제가 났고 `--purple-text`로 고쳤다. 같은 실수를 반복하지 말 것.
- **배경**: **그라디언트·배경이미지 사용하지 않음.** **모든 페이지 공통** — 본문(body) 배경은 밝은 남색 단색, 헤더는 그보다 짙은 남색으로 통일한다.
- **타이포**: 제목/본문 구분이 뚜렷하게. 가독성 우선.
  - **폰트 (갱신, 2026-07-11)** — **self-host 웹폰트 `Polestar Unica77 TT`를 본문 기본 폰트로 사용**한다. `body { font-family: "Polestar Unica77 TT", sans-serif; }` — 맨 뒤 제네릭 `sans-serif`는 폰트 로딩 실패 시 폴백.
    - 폰트 파일은 `assets/fonts/unica77.woff2`(우선) · `unica77.woff`(폴백)로 **사이트에 직접 포함**한다. 외부 CDN에 의존하지 않는다. `@font-face`는 `style.css` **0번 구획**에 두고 `font-display: swap`.
    - ⚠️ **라이선스 주의** — 이 폰트는 상용 서체(Lineto Unica77 기반)이며 파일은 `onlinewebfonts.com`에서 받았다. **웹 배포 라이선스가 확보된 것이 아니므로 저작권 리스크가 있다.** 사용자가 리스크를 인지하고 self-host를 선택했다(2026-07-11). 문제 시 무료 대체(Inter/Manrope 등 OFL)로 교체.
    - ⚠️ **`"Polestar Unica77 TT"`처럼 이름 폰트에는 따옴표를 쓰고, 맨 뒤 제네릭 `sans-serif`에는 따옴표를 치지 않는다.** 제네릭에 따옴표를 치면 폰트명으로 취급돼 무시되고, 제네릭을 빼면 폰트 로딩 실패 시 Windows에서 serif(Times)로 떨어진다.
    - 폼 요소(`button` · `input` · `textarea` · `select`)는 body 폰트를 상속하지 않으므로 Reset 구획에서 `font-family: inherit`를 명시한다 → 웹폰트도 함께 상속된다.
    - **이전 방침(폐기)**: `font-family: sans-serif` 제네릭 키워드만 사용(웹폰트 미로드) — 2026-07-10 확정이었으나 2026-07-11 self-host 웹폰트 도입으로 대체.
- **반응형**: **데스크톱(PC) 동작 우선.** 모바일에서 깨지지 않는 수준까지만 (`max-width` + flex/grid).
  - **수치 확정 (2026-07-10, To Do 2 완료)** — 모든 페이지에 동일하게 적용하며 `:root` 변수로 관리한다.
    - 컨테이너 최대폭 `--container: 1080px`
    - 헤더 높이 `--header-h: 64px`
    - breakpoint **1개만** 사용: `@media (max-width: 820px)`
- **일관성**: 카드·뱃지·버튼 등 공통 요소는 재사용 가능한 CSS 클래스로.

---

## 5. 코딩 규칙 (Claude 작업 시)

- HTML5 표준 · `lang="en"` · `<meta charset="utf-8">` · viewport 메타 포함.
- 클래스명은 의미 기반 소문자-하이픈 (예: `site-header`, `card-grid`, `member-card`).
- CSS는 `css/style.css` 한 파일에 공통 관리 (페이지별 별도 CSS는 꼭 필요할 때만).
- JavaScript는 `js/main.js`에 두고, 기능 단위 함수로 분리. 인라인 `onclick`보다 `addEventListener` 사용.
- 이미지·아이콘 등 자원은 `assets/`에 정리.
- 실제 없는 데이터는 **샘플/더미 데이터**로 채우고 5-2의 고정 주석으로 표시.

### 5-1. `style.css` 구성 (구현 반영본)

> ✅ **초안대로 구현되었다** (2026-07-10). 아래 10개 구획 순서·클래스명·팔레트가 실제 `css/style.css`(573줄)와 일치한다.
> 구현하며 추가된 변수: `--purple-dark`(hover·active용) · `--container` · `--header-h`.

**작성 순서** — Dashboard `style.css` 방식 계승 (`/* ---------- N. 제목 ---------- */` 한국어 구획 주석, `:root → 공통 → 컴포넌트 → 페이지별 → 반응형` 흐름):

1. `:root` 색상·공통 변수
2. Reset & Base (`* box-sizing`, `body`, `a`)
3. 공통 레이아웃 (`.container`, `.section`)
4. 헤더 + GNB + **드롭다운** (공통)
5. 페이지 제목 (`.page-title` 좌상단 기본 / `.page-title--center` 중앙 modifier — Support용)
6. 탭 패널 표시/숨김 (`.tab-panel` / `.is-active`)
7. **공통 컴포넌트** (카드·프로필행·표·뱃지·버튼·랩그룹)
8. 페이지 전용 (hero 등 최소)
9. 푸터 (공통)
10. 반응형 (`@media`)

**색상 팔레트 (갱신, 2026-07-11)** — 배경 남색 + 포인트 딥 레드 + 카테고리 3색. `css/style.css` 1번 구획의 실제 값:

```css
:root {
    /* 배경 — 남색 계열 */
    --navy-deep:   #0d1b33;               /* 헤더·푸터 (짙은 남색) */
    --navy-bg:     #1b3059;               /* 본문 배경 (밝은 남색, 전 페이지 공통) */
    --surface:     rgba(255,255,255,.06); /* 카드·박스 표면 (배경보다 살짝 밝게) */
    --line:        rgba(255,255,255,.14); /* 구분선·테두리 */

    /* 글자 */
    --text:        #eef2f9;               /* 기본 글자 (밝은색) */
    --text-muted:  #aab6cc;               /* 보조 글자 */

    /* 포인트 — 딥 레드 + 흰색. ⚠️ 변수명은 purple 이지만 값은 자주가 아니라 딥 레드다 */
    --purple:      #7d1420;               /* 채움 전용 — 박스·배경·테두리. 글자색으로 쓰지 말 것 */
    --purple-dark: #5c0e17;               /* hover·active — 더 짙은 레드 */
    --purple-text: #de4b59;               /* 글자 전용 — 남색 배경 위에서 읽히도록 밝게 */
    --point-white: #ffffff;               /* 포인트 — 흰색 (고대비 강조) */

    /* 카테고리 색 — News 뱃지 · 필터 버튼 공용 */
    --cat-award:   #f2c94c;               /* 노랑(골드) */
    --cat-paper:   #4fd18b;               /* 초록(민트) */
    --cat-event:   #f87171;               /* 빨강(코랄) */

    --container:   1080px;                /* 컨테이너 최대폭 (4장) */
    --header-h:    64px;                  /* 헤더 높이 */
}
```
> **역할(배경=남색 / 포인트=딥 레드+흰색)은 확정**이며 바뀌지 않는다. 톤을 조정하더라도 이 변수만 고치면 전 페이지에 반영된다.
>
> **`--purple` vs `--purple-text` 사용 규칙 (중요)**
> - `color:` → **`--purple-text`** 를 쓴다. `--purple`은 너무 어두워 남색 배경 위에서 읽히지 않는다.
> - `background:` · `border-color:` · `fill` → **`--purple`** 을 쓴다.
> - 현재 `--purple`을 쓰는 곳은 전부 `border-color`(제목 밑줄 · active 테두리) 4곳뿐이며, 텍스트에 쓰는 곳은 없다. 이 상태를 유지한다.

**⚠️ Dashboard CSS 이식 시 주의 — 색은 절대 가져오지 않는다**

Dashboard `style.css`는 **밝은 테마**다 (`--bg-gray: #f5f7fa`, `--text: #222`, 메인색 파랑 `#1a4fd6`, 뱃지 = 학사/장학/취업). Lab site는 어두운 남색 + 자주색이라 색 체계가 정반대다.

- 가져오는 것: **마크업 구조와 레이아웃 규칙**만 (`.board-table` 셀 정렬·`.badge` 형태·카드 그리드 등).
- 가져오지 않는 것: **모든 색상값**. 색은 위 `:root` 변수로 **전부 새로 지정**한다.
- 뱃지 **분류 값도 새로 정의**한다 — News/Notices는 `Award / Paper / Event`(3-8), Support는 `Pending / Done` 상태 뱃지(3-7).

**공용 컴포넌트 (핵심 — 페이지별 CSS 최소화)** — 같은 배치가 여러 페이지에서 반복되므로 페이지별이 아닌 공용 클래스로 만든다:

| 클래스 | 쓰이는 곳 |
|--------|-----------|
| `.card` / `.card-grid` / `.card__lab` | index의 Research/Project 미리보기 카드 3장 (3-4). `.card__lab`은 출처 라벨 — 글자이므로 `--purple-text` 사용 |
| `.profile-item` (이미지+제목+설명 행) | **members + research 공용** (3-3/3-5에서 배치를 통일) |
| `.profile-item__thumb--wide` | research/project 대표 이미지 전용 modifier (280×175 · 중앙 크롭). 기본 thumb는 인물용(180×220 · 상단 25% 크롭)이라 가로형 이미지를 넣으면 가운데만 잘린다 |
| `.board-table` + `.badge` | **support 전용** 표 (Dashboard 표 구조 이식). news·notices는 카드형으로 전환돼 더 이상 쓰지 않는다 (3-8) |
| `.news-list` + `.news-card` | **news · notices 공용** 카드 리스트 (뱃지·날짜·제목·요약) |
| `.btn-write` / `.more-link` / `.btn-lab-info` | support Write 버튼, index 미리보기 링크, Members 랩 홈페이지 버튼 |
| `.lab-group` | Students 연구실 3그룹 box/line 구분 |
| `.back-arrow` | support 작성 블록 좌상단 뒤로가기 (3-7) |

**드롭다운/탭 동작**
- **드롭다운(hover)은 CSS만으로** 구현 (`.has-dropdown:hover .dropdown { display:block }`). **PC hover 기준** — 모바일/터치 대응은 보류(3-1).
- **탭 전환은 `js/main.js`가 `.is-active` 토글**로 처리하며, 현재 탭은 **URL 해시**와 동기화한다 (3-1).
- Support의 목록↔작성 전환(3-7), Research의 `Read more` 아코디언(3-5)도 같은 클래스 토글 방식. 단 **해시는 쓰지 않는다.**

### 5-2. 더미 데이터 주석 규칙 (고정 문자열)

미확정 값은 아래 **고정 문자열**로 표시한다. 나중에 `grep`(또는 에디터 전체검색) 한 번으로 남은 자리를 전부 찾기 위함이다.

```html
<!-- TODO(dummy): 실제 값 필요 -->
```
```css
/* TODO(dummy): 실제 값 필요 */
```
```js
// TODO(dummy): 실제 값 필요
```

- 문자열 `TODO(dummy)` 는 **철자·괄호까지 그대로** 쓴다. 변형 금지 (`TODO:` `FIXME` `더미` 등 사용하지 않음).
- 남은 자리 확인: `grep -rn "TODO(dummy)" .`
- 실제 값으로 교체할 때 해당 주석도 함께 지운다.

---

## 6. 작업 순서 (To Do)

**진행 현황 (최종 갱신: 2026-07-11)** — **골격은 전부 완성**됐다. 7개 페이지 + 뉴스 상세 4개 + `style.css`(843줄) + `main.js`(106줄). 남은 일은 사실상 **더미 → 실제 데이터 교체(To Do 11)** 하나뿐이다.

- [x] 1. 전체 설계 확정 — 사이트맵 · 파일구조 · 메뉴 (본 문서)
- [x] 2. 공통 골격 — 헤더/푸터 + `style.css` 기본 틀 (컨테이너 `1080px` · breakpoint `820px` 확정 → 4장 갱신 완료)
- [x] 3. `index.html` 메인 페이지 — 본문 섹션(Hero·About·Research / Project) 배치 완료
- [x] 4. `members.html` 구성원 — Professor/Students 탭 + `.lab-group` 3그룹 완료
- [x] 5. `research.html` 연구분야 — Research + Project를 한 페이지에 세로로 합침(드롭다운·탭 폐지, 2026-07-11) + `Read more` 아코디언
- [x] 6. ~~`publications.html` 논문~~ — **폐지·삭제 (2026-07-10, 3-6).** `Lab Info` 버튼으로 대체.
- [x] 7. `news.html` 소식(News) · 공지(Notices) — News 탭 = 카테고리 필터 + 카드 → 개별 상세 페이지. 상세는 파일 분리라 news.html은 목록만 유지. **Notices 탭도 카드형으로 통일 완료** (2026-07-11). 뉴스 상세 4건은 실제 내용 반영 완료 (3-8)
- [x] 8. `contact.html` 연락처 — 제목·Contact Info 3블록 + **Google 지도 iframe 삽입 완료** (2026-07-11, 3-9). 주소·호실 값은 아직 더미
- [x] 9. `support.html` 정보 수정요청 — 목록/작성 블록 + `Write`·`←` 버튼 + `Pending/Done` 뱃지 완료
- [x] 10. JavaScript 동적 기능 — `js/main.js`. **5개 기능 전부 완료.**
      - [x] 해시 기반 탭 전환 (`activateTabFromHash`, `hashchange` 대응, 연도 앵커 해시 무시 처리)
      - [x] `Read more` 아코디언 (`initReadMore`, `aria-expanded` 토글)
      - [x] Support 목록↔작성 전환 (`initSupportToggle`)
      - [x] **Support 게시글 등록** (`initSupportBoard`, localStorage · 2026-07-12). ⚠️ 담당자에게 전달되지 않는 로컬 저장이다 — 3-7의 한계 참고
      - [x] News 카테고리 필터 (`initNewsFilter`, `data-filter`↔`data-category` 비교 후 `.is-hidden` 토글)
      - [x] ~~Publications 미리보기 모달~~ — 폐지 (3-6). `main.js`에서 제거.
- [ ] 11. 마무리 점검 — **`TODO(dummy)` 18곳 남음** (2026-07-11 실측)
      `members 6 · research 4 · index 3 · contact 2 · support 2 · news 1` (`main.js`·`css`에는 없음)
      확인 명령: `grep -rn "TODO(dummy)" . --include="*.html" --include="*.css" --include="*.js"`
      - research 4곳은 전부 텍스트다 — 이미지는 5장 모두 채워졌다 (3-5).
      - ⚠️ 별도 항목: **index.html의 About 본문이 국문**이라 영문 규칙(1장) 위반. `TODO(dummy)`로 세지 않으므로 여기 적어 둔다.

**다음에 할 일 (우선순위 순)**

1. **랩 홈페이지 URL 3개 확보** → `members.html`의 `Lab Info` 버튼 `href` 채우기. 지금은 비어 있어 클릭해도 아무 데도 가지 않는다 — 눈에 띄는 유일한 기능 결손이다.
2. **연구실 3개의 정식 영문명 확정** → `Lab 1/2/3` 임시 표기가 members·index·contact 3개 페이지에 걸쳐 있어, 하나 정하면 여러 자리가 한 번에 해결된다.
3. `research.html` 실제 연구 주제·프로젝트 내용 (5곳으로 가장 큰 덩어리)
4. 학생 명단 · Contact 주소/호실 — 실제 값이 있어야 채울 수 있다
5. 전부 채운 뒤 To Do 11 점검 (`grep`으로 잔여 0 확인)

> 각 페이지를 만들면서 실제 정보(교수 정보·연구실 이름·연락처 등)를 채워 넣고, 확정된 값은 본 문서에도 반영한다.
> 표기: `[x]` 완료 · `[~]` 골격만 완료(잔여 작업 명시) · `[ ]` 미착수.

---

## 7. 미정 항목 (구현하며 채워 넣는다)

아래 값들은 **지금 묻지 않는다.** 해당 페이지를 만드는 단계에서 결정해 채워 넣고, 그때까지는 **더미 데이터 + `TODO(dummy)` 주석**(5-2)으로 둔다.

| 항목 | 상태 (2026-07-11) |
|------|------|
| 각 연구실(Lab 1~3) 정식 이름 | **미정.** 현재 전 페이지에서 `Lab 1 / Lab 2 / Lab 3` 임시 표기 사용 |
| 교수 5명의 직함·연구분야·TEL·E-mail | ✅ **반영 완료** (2026-07-10, 3-3 표) |
| 교수 프로필 사진 | ✅ **반영 완료** — `assets/img/` 5장 |
| 교수 경력(수상·이력) | **미정.** `members.html`에 항목 자체를 아직 두지 않음 |
| 학생 명단 (대학원생·학부연구생) | **미정.** `members.html` Students 탭에 그룹별 더미 |
| 랩 홈페이지 URL 3개 (`Lab Info` 링크) | **미정.** `members.html`에 `TODO(dummy)` 자리표시자 |
| 로고·연구 이미지 등 자원 | **일부.** 로고 `assets/AIDS logo.png` · 교수 사진 `assets/img/` 5장 확보 |
| Contact — 주소 · 연구실별 호실/전화/이메일 | **미정.** 더미 값. (지도 embed는 ✅ 완료 — 3-9) |
| ~~컨테이너 최대폭 · 반응형 breakpoint~~ | ✅ **확정** — `1080px` / `max-width: 820px` (4장) |
| ~~폰트 스택~~ | ✅ **갱신 (2026-07-11)** — self-host 웹폰트 `Polestar Unica77 TT` + `sans-serif` 폴백 (4장). ⚠️ 상용폰트 라이선스 리스크 |

**※ 확정된 사항**

- 소속: 한남대학교 AI데이터사이언스학과 / 연구실 구성: **교수 5명 · 연구실 3개** (2026-07-10 갱신)
  - Lab 1 = 박영호 / Lab 2 = 박민주·고은정·심지섭 / Lab 3 = 한소율 (김명준 교수 제외)
- **색: 배경 = 남색, 포인트 = 딥 레드(`#7d1420`) + 흰색** (파란색·자주색 폐기). ⚠️ 변수명만 `--purple`로 남아 있다. 글자에는 `--purple` 대신 **`--purple-text`(`#de4b59`)** 를 쓴다 (4장·5-1)
- **정식명칭 (2026-07-11 확정)**: **`HNU AI DataScience Labs`** (또는 짧게 `AI DataScience`) — `DataScience` **붙여쓰기**, `&`·`and`로 잇지 않는다. 헤더 로고·hero·`<title>`·푸터 회사명에 사용. 저작권 줄은 HNU 없이 `AI DataScience Labs`. 단, 학과 공식 영문명 **`Department of AI Data Science`**(띄어쓰기)는 예외로 유지.
- **언어: 화면 텍스트 전부 영문** (국문 병기 없음)
- 기본 문서: `index.html` · 졸업생(Alumni) 미제작 · 탭 상태 = URL 해시 · PC 우선(모바일 드롭다운 보류)
- Support 컬럼 `번호|제목|요청자|작성일|처리상태`, Write = 같은 화면 내 작성 블록 전환
- Research `Read more` = 인라인 아코디언 확장
- **레이아웃 수치**: 컨테이너 `1080px` · 헤더 높이 `64px` · breakpoint `820px` 1개
- **폰트**: self-host 웹폰트 `Polestar Unica77 TT`(`assets/fonts/`) + `sans-serif` 폴백 (2026-07-11 갱신). ⚠️ 상용폰트 무단배포 라이선스 리스크는 사용자가 인지하고 감수
- **로고 경로**: `assets/AIDS logo.png` — HTML에서는 `assets/AIDS%20logo.png`로 인코딩 (계획서의 `logo.svg` 아님)
- **미리보기 링크 문구**: 전 페이지 `See more →`로 통일 (한글 `더보기 +` 폐기 — 전부 영문 규칙)
