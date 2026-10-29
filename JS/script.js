// Photo fallback if the image fails to load
let photo = document.getElementById("photo");

if (photo) {
    photo.addEventListener("error", function () {
        let fallback = document.createElement("div");

        fallback.className = "photo-fallback";
        fallback.textContent = "DM";

        photo.replaceWith(fallback);
    });
}

// Dark / light toggle (remembers choice)
let themeBtn = document.getElementById("theme-btn");

try {
    if (localStorage.getItem("resume-theme") === "dark") {
        document.body.classList.add("dark");
    }
} catch (e) { /* storage unavailable */ }

themeBtn.addEventListener("click", function () {
    let isDark = document.body.classList.toggle("dark");
    try {
        localStorage.setItem("resume-theme", isDark ? "dark" : "light");
    } catch (e) { /* ignore */ }
});

// Featured projects filter (by technology)
(function () {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card");
    const empty = document.getElementById("project-empty");

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const filter = btn.getAttribute("data-filter");
            let shown = 0;

            buttons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active"); 

            cards.forEach(function (card) {
                const techs = card.getAttribute("data-tech").split(" ");
                const match = filter === "all" || techs.includes(filter);
                card.hidden = !match;
                if (match) { shown++; }
            });

            if (empty) empty.hidden = shown !== 0;
        });
    });
})();

// Copy buttons for contact info
(function () {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            let target = document.querySelector(btn.getAttribute("data-copy"));
            if (!target) { return; }
            let text = target.getAttribute("href") && target.getAttribute("href").indexOf("http") === 0
                ? target.getAttribute("href")
                : target.textContent.trim();

            function done() {
                let old = btn.textContent;
                btn.textContent = "Copied!";
                btn.classList.add("copied");
                setTimeout(function () {
                    btn.textContent = old;
                    btn.classList.remove("copied");
                }, 1200);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done, done);
            } else {
                let ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand("copy"); } catch (e) { /* ignore */ }
                document.body.removeChild(ta);
                done();
            }
        });
    });
})();

// Fade-in on scroll for each section
(function () {
    let items = document.querySelectorAll(".block, .side-section, .name-block");
    items.forEach(function (el) { el.classList.add("reveal"); });

    if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("visible"); });
        return;
    }

    let observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    items.forEach(function (el) { observer.observe(el); });
})();
