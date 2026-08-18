/* Contour field.
 * A seeded noise surface is sampled on a grid, traced with marching squares,
 * stitched into polylines and drawn like the contours on a topographic sheet.
 * Every fifth line is an index contour: heavier, and labelled with its elevation.
 */
(function () {
    "use strict";

    var NS = "http://www.w3.org/2000/svg";
    var svg = document.getElementById("contours");
    if (!svg) return;

    var SEED = 20260818; // change this and the whole terrain changes
    var CELL = 22; // sampling grid, in px
    var SCALE = 430; // px per noise unit — bigger means wider, lazier hills
    var LEVELS = 21;
    var INDEX_EVERY = 5;
    var BASE_ELEVATION = 40;
    var ELEVATION_STEP = 20;
    var OVERSCAN = 0.22; // extra height sampled, so parallax never shows an edge

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function mulberry32(a) {
        return function () {
            a |= 0;
            a = (a + 0x6d2b79f5) | 0;
            var t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /* Sum of a few tilted sine waves: smooth, cheap, and blobby enough to read
     * as terrain once it is sliced into levels. */
    function makeField(seed) {
        var rnd = mulberry32(seed);
        var octaves = [];
        var amplitude = 1;
        var total = 0;
        for (var i = 0; i < 5; i++) {
            octaves.push({
                fx: (0.7 + rnd() * 1.1) * Math.pow(1.85, i),
                fy: (0.7 + rnd() * 1.1) * Math.pow(1.85, i),
                px: rnd() * Math.PI * 2,
                py: rnd() * Math.PI * 2,
                rot: rnd() * Math.PI,
                a: amplitude,
            });
            total += amplitude;
            amplitude *= 0.55;
        }
        return function (x, y) {
            var u = x / SCALE;
            var v = y / SCALE;
            var sum = 0;
            for (var i = 0; i < octaves.length; i++) {
                var o = octaves[i];
                var ru = u * Math.cos(o.rot) - v * Math.sin(o.rot);
                var rv = u * Math.sin(o.rot) + v * Math.cos(o.rot);
                sum += o.a * Math.sin(ru * o.fx + o.px) * Math.cos(rv * o.fy + o.py);
            }
            return sum / total;
        };
    }

    /* Marching squares. Corners a=(i,j) b=(i+1,j) c=(i+1,j+1) d=(i,j+1);
     * edges 0=top 1=right 2=bottom 3=left. */
    var CASES = {
        1: [[3, 0]],
        2: [[0, 1]],
        3: [[3, 1]],
        4: [[1, 2]],
        5: [
            [3, 2],
            [0, 1],
        ],
        6: [[0, 2]],
        7: [[3, 2]],
        8: [[2, 3]],
        9: [[2, 0]],
        10: [
            [0, 3],
            [2, 1],
        ],
        11: [[2, 1]],
        12: [[1, 3]],
        13: [[1, 0]],
        14: [[0, 3]],
    };

    function trace(values, cols, rows, level) {
        var segments = [];
        function at(i, j) {
            return values[j * (cols + 1) + i];
        }
        function point(edge, i, j) {
            var a = at(i, j),
                b = at(i + 1, j),
                c = at(i + 1, j + 1),
                d = at(i, j + 1);
            var t;
            if (edge === 0) {
                t = (level - a) / (b - a);
                return [(i + t) * CELL, j * CELL];
            }
            if (edge === 1) {
                t = (level - b) / (c - b);
                return [(i + 1) * CELL, (j + t) * CELL];
            }
            if (edge === 2) {
                t = (level - d) / (c - d);
                return [(i + t) * CELL, (j + 1) * CELL];
            }
            t = (level - a) / (d - a);
            return [i * CELL, (j + t) * CELL];
        }

        for (var j = 0; j < rows; j++) {
            for (var i = 0; i < cols; i++) {
                var code =
                    (at(i, j) > level ? 1 : 0) |
                    (at(i + 1, j) > level ? 2 : 0) |
                    (at(i + 1, j + 1) > level ? 4 : 0) |
                    (at(i, j + 1) > level ? 8 : 0);
                var pairs = CASES[code];
                if (!pairs) continue;
                for (var k = 0; k < pairs.length; k++) {
                    segments.push([point(pairs[k][0], i, j), point(pairs[k][1], i, j)]);
                }
            }
        }
        return segments;
    }

    function key(p) {
        return p[0].toFixed(2) + "," + p[1].toFixed(2);
    }

    function stitch(segments) {
        var ends = new Map();
        segments.forEach(function (seg, i) {
            seg.forEach(function (p) {
                var k = key(p);
                if (!ends.has(k)) ends.set(k, []);
                ends.get(k).push(i);
            });
        });

        var used = new Array(segments.length).fill(false);
        var lines = [];

        for (var i = 0; i < segments.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            var line = [segments[i][0], segments[i][1]];

            for (var dir = 0; dir < 2; dir++) {
                var tip = dir === 0 ? line[line.length - 1] : line[0];
                for (;;) {
                    var candidates = ends.get(key(tip)) || [];
                    var next = -1;
                    for (var c = 0; c < candidates.length; c++) {
                        if (!used[candidates[c]]) {
                            next = candidates[c];
                            break;
                        }
                    }
                    if (next < 0) break;
                    used[next] = true;
                    var seg = segments[next];
                    var far = key(seg[0]) === key(tip) ? seg[1] : seg[0];
                    if (dir === 0) line.push(far);
                    else line.unshift(far);
                    tip = far;
                }
            }
            if (line.length > 3) lines.push(line);
        }
        return lines;
    }

    /* Chaikin: rounds off the marching-squares staircase. */
    function smooth(line) {
        var closed = key(line[0]) === key(line[line.length - 1]);
        var out = closed ? [] : [line[0]];
        for (var i = 0; i < line.length - 1; i++) {
            var p = line[i],
                q = line[i + 1];
            out.push([p[0] + (q[0] - p[0]) * 0.25, p[1] + (q[1] - p[1]) * 0.25]);
            out.push([p[0] + (q[0] - p[0]) * 0.75, p[1] + (q[1] - p[1]) * 0.75]);
        }
        if (closed) out.push(out[0].slice());
        else out.push(line[line.length - 1]);
        return out;
    }

    function toPath(line) {
        var d = "M" + line[0][0].toFixed(1) + " " + line[0][1].toFixed(1);
        for (var i = 1; i < line.length; i++) {
            d += "L" + line[i][0].toFixed(1) + " " + line[i][1].toFixed(1);
        }
        return d;
    }

    var lastSize = { w: 0, h: 0 };

    function build() {
        var w = svg.clientWidth || window.innerWidth;
        var h = (svg.clientHeight || window.innerHeight) * (1 + OVERSCAN);

        var cols = Math.ceil(w / CELL) + 1;
        var rows = Math.ceil(h / CELL) + 1;
        var field = makeField(SEED);

        var values = new Float32Array((cols + 1) * (rows + 1));
        for (var j = 0; j <= rows; j++) {
            for (var i = 0; i <= cols; i++) {
                values[j * (cols + 1) + i] = field(i * CELL, j * CELL);
            }
        }

        svg.setAttribute("viewBox", "0 0 " + w + " " + Math.round(h));
        svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        var group = document.createElementNS(NS, "g");
        svg.appendChild(group);

        var paths = [];
        var labels = [];

        for (var l = 0; l < LEVELS; l++) {
            var level = -0.78 + (1.56 * l) / (LEVELS - 1);
            var isIndex = l % INDEX_EVERY === 0;
            var lines = stitch(trace(values, cols, rows, level)).map(smooth).map(smooth);

            for (var n = 0; n < lines.length; n++) {
                var path = document.createElementNS(NS, "path");
                path.setAttribute("d", toPath(lines[n]));
                if (isIndex) path.setAttribute("class", "index");
                group.appendChild(path);
                paths.push({ el: path, level: l });

                if (isIndex && labels.length < 7 && lines[n].length > 90 && n % 2 === 0) {
                    labels.push({
                        path: path,
                        text: String(BASE_ELEVATION + l * ELEVATION_STEP),
                    });
                }
            }
        }

        labels.forEach(function (label, i) {
            var len = label.path.getTotalLength();
            if (len < 400) return;
            var at = len * (0.2 + 0.12 * i);
            var p = label.path.getPointAtLength(at);
            var q = label.path.getPointAtLength(Math.min(len, at + 6));
            var angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
            if (angle > 90 || angle < -90) angle += 180;

            var text = document.createElementNS(NS, "text");
            text.setAttribute("x", p.x.toFixed(1));
            text.setAttribute("y", p.y.toFixed(1));
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("transform", "rotate(" + angle.toFixed(1) + " " + p.x.toFixed(1) + " " + p.y.toFixed(1) + ")");
            text.textContent = label.text;
            group.appendChild(text);
        });

        if (!reduced) draw(paths);
        return group;
    }

    /* Contours draw themselves in, low ground first. */
    function draw(paths) {
        paths.forEach(function (item) {
            var el = item.el;
            var len = el.getTotalLength();
            el.style.strokeDasharray = len;
            el.style.strokeDashoffset = len;
            el.style.opacity = "0";
        });

        requestAnimationFrame(function () {
            paths.forEach(function (item) {
                var el = item.el;
                var len = el.getTotalLength();
                var duration = Math.min(2.4, 0.5 + len / 1400);
                var delay = 0.12 + item.level * 0.06;
                el.style.transition =
                    "stroke-dashoffset " +
                    duration +
                    "s cubic-bezier(.25,.6,.25,1) " +
                    delay +
                    "s, opacity .4s ease " +
                    delay +
                    "s";
                el.style.strokeDashoffset = "0";
                el.style.opacity = "";
            });
        });
    }

    var group = build();
    lastSize = { w: window.innerWidth, h: window.innerHeight };

    if (!reduced) {
        var ticking = false;
        window.addEventListener(
            "scroll",
            function () {
                if (ticking || !group) return;
                ticking = true;
                requestAnimationFrame(function () {
                    var shift = Math.min(window.scrollY * 0.08, window.innerHeight * OVERSCAN);
                    group.setAttribute("transform", "translate(0 " + -shift.toFixed(1) + ")");
                    ticking = false;
                });
            },
            { passive: true },
        );
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
        // Ignore the address-bar shuffle on mobile; only real width changes matter.
        if (Math.abs(window.innerWidth - lastSize.w) < 60 && Math.abs(window.innerHeight - lastSize.h) < 200) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            lastSize = { w: window.innerWidth, h: window.innerHeight };
            group = build();
        }, 220);
    });
})();
