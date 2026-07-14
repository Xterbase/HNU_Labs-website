/* ============================================================
   AI DataScience Labs — 공통 스크립트
   CLAUDE.md 3-1 (해시 탭) · 3-5 (Read more) · 3-7 (Support 전환) 참고
   ============================================================ */

/* ---------- 1. 탭 전환 (URL 해시 기반) ----------
   news.html#notices 처럼 해시로 탭을 지정한다.
   해시가 없거나 모르는 값이면 첫 번째 패널(기본 탭)을 연다.
   덕분에 새로고침·즐겨찾기·뒤로가기에서 같은 탭이 유지된다. */
function activateTabFromHash(isInitial) {
    const panels = document.querySelectorAll(".tab-panel");
    if (panels.length === 0) return;

    const wanted = location.hash.slice(1);
    const target = wanted ? document.getElementById(wanted) : null;
    const isTab = target && target.classList.contains("tab-panel");

    if (!isTab) {
        // 탭이 아닌 해시(문서 내 앵커 링크 등)는 무시한다.
        // 첫 로드일 때만 기본 탭(첫 패널)을 연다.
        if (!isInitial) return;
        panels[0].classList.add("is-active");
        return;
    }

    panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel === target);
    });
}

/* ---------- 2. Read more 아코디언 (research) ----------
   상세 페이지를 만들지 않고 그 자리에서 본문을 펼친다. */
function initReadMore() {
    document.querySelectorAll(".readmore-toggle").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const body = document.getElementById(btn.getAttribute("aria-controls"));
            if (!body) return;

            const open = body.classList.toggle("is-open");
            btn.setAttribute("aria-expanded", String(open));
            btn.textContent = open ? "Read less ←" : "Read more →";
        });
    });
}

/* ---------- 3. Support 목록 ↔ 작성 블록 전환 ----------
   페이지 이동 없이 같은 화면에서 블록만 바꾼다. 해시는 쓰지 않는다. */
function initSupportToggle() {
    const list = document.getElementById("support-list");
    const write = document.getElementById("support-write");
    if (!list || !write) return;

    function show(block) {
        list.classList.toggle("is-active", block === list);
        write.classList.toggle("is-active", block === write);
    }

    document.querySelectorAll("[data-support-open-write]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            show(write);
        });
    });

    document.querySelectorAll("[data-support-back]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            show(list);   // 작성 중이던 내용은 버리고 목록으로 복귀
        });
    });
}

/* ---------- 3-2. Support 게시글 등록 (support.html) ----------
   ⚠️ 서버·DB 가 없는 정적 사이트라 localStorage 에만 저장한다.
      = 글은 작성한 사람의 브라우저에만 남고 담당자에게 전달되지 않는다.
        다른 기기·다른 브라우저·시크릿창에서는 보이지 않는다.
      실제 접수 창구로 쓰려면 서버(또는 Google Form 등 외부 폼)가 필요하다.

   HTML 의 고정 3건은 그대로 두고, 등록한 글을 tbody 맨 위에 최신순으로 얹는다. */
const SUPPORT_KEY = "support-requests-v1";

/* Google Form 접수 설정 — 값이 다 차면 Submit 이 실제 담당자(응답 시트)에게 전달된다.
   entry ID 는 폼 viewform 페이지의 FB_PUBLIC_LOAD_DATA_ 에서 뽑았다 (CLAUDE.md 3-7).
   date·status 는 사용자가 치지 않는다 — 사이트가 자동으로 채워 보낸다. */
const SUPPORT_FORM = {
    // …/viewform 이 아니라 …/formResponse 로 끝나야 한다
    action: "https://docs.google.com/forms/d/e/1FAIpQLScW7BVOeJPbFl3mv2VA9iPSlSY5NkMRqZxBokGQL08RSVUSFg/formResponse",
    fields: {
        title: "entry.1045781291",
        requester: "entry.2005620554",
        content: "entry.485142794",
        date: "entry.1065046570",       // 자동 — 오늘 날짜
        status: "entry.1166974658"      // 자동 — 항상 "Pending"
    }
};

function isSupportFormConfigured() {
    const f = SUPPORT_FORM.fields;
    return Boolean(SUPPORT_FORM.action && f.title && f.requester && f.content);
}

/* Google Form 으로 전송한다.
   ⚠️ no-cors 라 응답을 읽을 수 없다 — 성공 여부를 코드가 확인할 방법이 없다(구글 정책).
      따라서 전송과 별개로 localStorage 에도 남겨, 최소한 작성자는 자기 글을 다시 볼 수 있게 한다. */
function sendToSupportForm(post) {
    if (!isSupportFormConfigured()) {
        console.warn("[support] Google Form 미설정 — 로컬에만 저장했다. main.js 의 SUPPORT_FORM 을 채울 것.");
        return;
    }

    const f = SUPPORT_FORM.fields;
    const body = new FormData();
    body.append(f.title, post.title);
    body.append(f.requester, post.requester);
    body.append(f.content, post.content);
    // 사용자가 치지 않는 값 — 화면의 표에 넣는 것과 같은 값을 그대로 보낸다
    if (f.date) body.append(f.date, post.date);
    if (f.status) body.append(f.status, post.status);

    fetch(SUPPORT_FORM.action, { method: "POST", mode: "no-cors", body: body })
        .catch(function () {
            // 네트워크 자체가 끊긴 경우. 글은 이미 로컬에 있으므로 화면은 그대로 둔다.
            console.warn("[support] Google Form 전송 실패 — 네트워크를 확인할 것.");
        });
}

function loadSupportPosts() {
    try {
        const raw = localStorage.getItem(SUPPORT_KEY);
        const posts = raw ? JSON.parse(raw) : [];
        return Array.isArray(posts) ? posts : [];
    } catch (e) {
        // 저장값이 깨졌거나 localStorage 를 못 쓰는 환경(시크릿창 등)
        return [];
    }
}

function saveSupportPosts(posts) {
    try {
        localStorage.setItem(SUPPORT_KEY, JSON.stringify(posts));
        return true;
    } catch (e) {
        return false;
    }
}

/* 사용자가 친 값은 textContent 로만 넣는다 — innerHTML 로 넣으면 입력한 태그가 그대로 실행된다 */
function buildSupportRow(post) {
    const tr = document.createElement("tr");

    const no = document.createElement("td");
    no.className = "col-no";
    no.textContent = post.no;

    const title = document.createElement("td");
    title.className = "col-title";
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = post.title;      // 상세 페이지는 아직 없다
    title.appendChild(link);

    const requester = document.createElement("td");
    requester.className = "col-writer";
    requester.textContent = post.requester;

    const date = document.createElement("td");
    date.className = "col-date";
    date.textContent = post.date;

    const status = document.createElement("td");
    status.className = "col-status";
    const badge = document.createElement("span");
    badge.className = "badge badge-pending";
    badge.textContent = "Pending";      // 새 글은 항상 대기 상태
    status.appendChild(badge);

    [no, title, requester, date, status].forEach(function (td) {
        tr.appendChild(td);
    });
    return tr;
}

function initSupportBoard() {
    const tbody = document.getElementById("support-tbody");
    const form = document.getElementById("support-form");
    if (!tbody || !form) return;

    // 고정 행의 가장 큰 번호 — 새 글 번호는 여기서 이어 붙인다
    const staticMaxNo = Array.from(tbody.querySelectorAll(".col-no"))
        .reduce(function (max, td) {
            return Math.max(max, parseInt(td.textContent, 10) || 0);
        }, 0);

    // 저장된 글만 지웠다 다시 그린다 (HTML 의 고정 행은 건드리지 않는다)
    function render(posts) {
        tbody.querySelectorAll("[data-support-post]").forEach(function (tr) {
            tr.remove();
        });
        // 배열 뒤쪽이 최신 — 차례로 맨 위에 꽂으면 최신글이 최상단에 온다
        posts.forEach(function (post) {
            const tr = buildSupportRow(post);
            tr.setAttribute("data-support-post", "");
            tbody.prepend(tr);
        });
    }

    render(loadSupportPosts());

    form.addEventListener("submit", function (e) {
        e.preventDefault();               // 정적 사이트 — 폼을 서버로 보내지 않는다

        const posts = loadSupportPosts();
        const title = form.elements.title.value.trim();
        const requester = form.elements.requester.value.trim();
        const content = form.elements.content.value.trim();
        if (!title || !requester || !content) return;   // required 가 먼저 막지만 공백만 친 경우 대비

        const post = {
            no: staticMaxNo + posts.length + 1,
            title: title,
            requester: requester,
            content: content,             // 목록에는 안 쓴다 (상세 페이지가 아직 없다)
            date: new Date().toISOString().slice(0, 10),   // YYYY-MM-DD
            status: "Pending"
        };
        posts.push(post);

        // 담당자에게 전달 — 이게 실제 접수다. 로컬 저장은 작성자 본인 확인용일 뿐이다.
        sendToSupportForm(post);

        // 로컬 저장에 실패해도 전송은 이미 끝났으므로 등록 자체를 막지는 않는다
        saveSupportPosts(posts);

        render(posts);
        form.reset();

        // 목록으로 돌아가 방금 등록한 글을 보여준다
        document.getElementById("support-list").classList.add("is-active");
        document.getElementById("support-write").classList.remove("is-active");
    });
}

/* ---------- 4. News 카테고리 필터 (news.html) ----------
   All(기본)·Award·Paper·Event 버튼으로 .news-card 를 걸러낸다.
   All 이면 전부, 나머지는 data-category 가 일치하는 카드만 보여준다. */
function initNewsFilter() {
    const bar = document.querySelector(".news-filter");
    if (!bar) return;
    // News 탭 카드만 대상 — Notices 탭도 .news-card 를 쓰므로 범위를 #news 로 한정한다
    const cards = document.querySelectorAll("#news .news-card");

    bar.addEventListener("click", function (e) {
        const btn = e.target.closest(".news-filter__btn");
        if (!btn) return;

        const filter = btn.getAttribute("data-filter");
        bar.querySelectorAll(".news-filter__btn").forEach(function (b) {
            b.classList.toggle("is-active", b === btn);
        });
        cards.forEach(function (card) {
            const show = filter === "all" || card.getAttribute("data-category") === filter;
            card.classList.toggle("is-hidden", !show);
        });
    });
}

/* ---------- 5. 초기화 ---------- */
document.addEventListener("DOMContentLoaded", function () {
    activateTabFromHash(true);
    initReadMore();
    initSupportToggle();
    initSupportBoard();
    initNewsFilter();
});

// 같은 페이지에서 드롭다운 항목을 고르면 해시만 바뀌므로 재실행이 필요하다
window.addEventListener("hashchange", function () {
    activateTabFromHash(false);
});
