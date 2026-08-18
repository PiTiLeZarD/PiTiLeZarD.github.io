/* Legend entries surface as you scroll down the sheet. */
(function () {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    var targets = document.querySelectorAll(".entry");
    if (!targets.length) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-in");
                observer.unobserve(entry.target);
            });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    targets.forEach(function (el) {
        el.classList.add("reveal");
        observer.observe(el);
    });
})();
