const { onRequest } = require("firebase-functions/v2/https");
const fetch = require("node-fetch");

// ─── RTDB REST API (cross-project — uses public security rules) ──────
const RTDB_BASE =
    "https://xeze-org-default-rtdb.asia-southeast1.firebasedatabase.app";

// ─── Theme definitions ───────────────────────────────────────────────
const themes = {
    // ── Classic Dark Themes ──
    dark: { bg1: "#1a1a2e", bg2: "#16213e", text: "#fff", accent: "#64ffda", label: "#8b949e", border: "", title: "// PROBLEM SOLVER //" },
    midnight: { bg1: "#0f0f23", bg2: "#1a1a3e", text: "#fff", accent: "#ffd700", label: "#8b949e", border: "", title: "// PROBLEM SOLVER //" },
    ocean: { bg1: "#0a192f", bg2: "#112240", text: "#fff", accent: "#64ffda", label: "#8b949e", border: "", title: "// PROBLEM SOLVER //" },

    // ── Vibrant Themes ──
    neon: { bg1: "#1a1a1a", bg2: "#2d1b4e", text: "#ff00ff", accent: "#64ffda", label: "#8b949e", border: "#ff00ff", title: ":: NEON SOLVER ::" },
    cyberpunk: { bg1: "#0a0a0a", bg2: "#1a0a2e", text: "#00ffff", accent: "#ff0080", label: "#00ffff", border: "#ff0080", title: "// CYBER SOLVER //" },
    hacker: { bg1: "#000000", bg2: "#0d0d0d", text: "#00ff00", accent: "#00ff00", label: "#00ff00", border: "#00ff00", font: "Courier New, monospace", title: "&gt; HACK_SOLVER.exe" },

    // ── True Black / AMOLED ──
    amoled: { bg1: "#000000", bg2: "#000000", text: "#ffffff", accent: "#bb86fc", label: "#666666", border: "", title: "// PROBLEM SOLVER //" },
    noir: { bg1: "#000000", bg2: "#0a0a0a", text: "#e0e0e0", accent: "#ff4444", label: "#555555", border: "#1a1a1a", title: "// NOIR SOLVER //" },

    // ── Transparent (for GitHub dark + light mode) ──
    transparent: { bg1: "transparent", bg2: "transparent", text: "#c9d1d9", accent: "#58a6ff", label: "#8b949e", border: "#30363d", title: "// PROBLEM SOLVER //", transparent: true },
    transparentdark: { bg1: "transparent", bg2: "transparent", text: "#ffffff", accent: "#64ffda", label: "#8b949e", border: "#30363d", title: "// PROBLEM SOLVER //", transparent: true },

    // ── Anime / Kawaii ──
    anime: { bg1: "#1a0533", bg2: "#2d0b4e", text: "#ff69b4", accent: "#ff1493", label: "#da70d6", border: "#ff69b4", title: "~ kawaii solver ~" },
    sakura: { bg1: "#2d1025", bg2: "#3d1535", text: "#ffb7c5", accent: "#ff69b4", label: "#d4a0b0", border: "#ff69b4", title: ":: sakura solver ::" },
    dragonball: { bg1: "#1a0a00", bg2: "#2d1500", text: "#ff8c00", accent: "#ffd700", label: "#cc7000", border: "#ff8c00", title: "// SAIYAN SOLVER //" },

    // ── Developer IDE Themes ──
    dracula: { bg1: "#282a36", bg2: "#1e1f29", text: "#f8f8f2", accent: "#bd93f9", label: "#6272a4", border: "", title: "// PROBLEM SOLVER //" },
    monokai: { bg1: "#272822", bg2: "#1e1f1c", text: "#f8f8f2", accent: "#a6e22e", label: "#75715e", border: "", title: "// PROBLEM SOLVER //" },
    nord: { bg1: "#2e3440", bg2: "#3b4252", text: "#eceff4", accent: "#88c0d0", label: "#4c566a", border: "", title: "// PROBLEM SOLVER //" },
    tokyonight: { bg1: "#1a1b26", bg2: "#16161e", text: "#c0caf5", accent: "#7aa2f7", label: "#565f89", border: "", title: "// PROBLEM SOLVER //" },
    catppuccin: { bg1: "#1e1e2e", bg2: "#181825", text: "#cdd6f4", accent: "#cba6f7", label: "#585b70", border: "", title: "// PROBLEM SOLVER //" },
    rosepine: { bg1: "#191724", bg2: "#1f1d2e", text: "#e0def4", accent: "#c4a7e7", label: "#6e6a86", border: "", title: "// PROBLEM SOLVER //" },
    gruvbox: { bg1: "#282828", bg2: "#1d2021", text: "#ebdbb2", accent: "#fabd2f", label: "#665c54", border: "", title: "// PROBLEM SOLVER //" },
    solarized: { bg1: "#002b36", bg2: "#073642", text: "#839496", accent: "#b58900", label: "#586e75", border: "", title: "// PROBLEM SOLVER //" },
    onedark: { bg1: "#282c34", bg2: "#21252b", text: "#abb2bf", accent: "#61afef", label: "#5c6370", border: "", title: "// PROBLEM SOLVER //" },

    // ── Professional / Corporate ──
    professional: { bg1: "#1b2838", bg2: "#1e3045", text: "#e8eaed", accent: "#4fc3f7", label: "#90a4ae", border: "", title: "GitHub Analytics" },
    executive: { bg1: "#1a1a2e", bg2: "#0f0f1e", text: "#d4af37", accent: "#d4af37", label: "#8b7e6a", border: "#d4af37", title: "PERFORMANCE METRICS" },
    minimal: { bg1: "#ffffff", bg2: "#f5f5f5", text: "#333333", accent: "#0066cc", label: "#666666", border: "#e0e0e0", title: "GitHub Stats" },

    // ── Gradient / Artsy ──
    sunset: { bg1: "#1a0533", bg2: "#2d0b15", text: "#fff", accent: "#ff6b6b", label: "#e09090", border: "", title: "// PROBLEM SOLVER //" },
    aurora: { bg1: "#0a1628", bg2: "#0f2d3d", text: "#fff", accent: "#00e5ff", label: "#4dd0e1", border: "", title: "// PROBLEM SOLVER //" },
    fire: { bg1: "#1a0000", bg2: "#2d0a00", text: "#ff4500", accent: "#ff6347", label: "#cc3700", border: "#ff4500", title: "// FIRE SOLVER //" },
    forest: { bg1: "#0a1f0a", bg2: "#0d2b0d", text: "#90ee90", accent: "#32cd32", label: "#6b8e6b", border: "", title: "// PROBLEM SOLVER //" },
    galaxy: { bg1: "#0b0020", bg2: "#1a0040", text: "#e0c3fc", accent: "#a855f7", label: "#8b7fc7", border: "#a855f7", title: ":: GALAXY SOLVER ::" },
    ice: { bg1: "#0a1929", bg2: "#0d2137", text: "#e0f7fa", accent: "#00bcd4", label: "#4dd0e1", border: "", title: "// PROBLEM SOLVER //" },
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ─── RTDB helpers (REST API — no Admin SDK needed) ───────────────────
async function rtdbGet(path) {
    const res = await fetch(`${RTDB_BASE}/${path}.json`);
    if (!res.ok) return null;
    return res.json();
}

async function rtdbSet(path, data) {
    await fetch(`${RTDB_BASE}/${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

// ─── Track profile view via REST ─────────────────────────────────────
async function trackProfileView(username) {
    try {
        const current = await rtdbGet(`profile-views/${username}`);
        const newVal = (current || 0) + 1;
        await rtdbSet(`profile-views/${username}`, newVal);
        return newVal;
    } catch (error) {
        console.error("Error tracking view:", error);
        return 0;
    }
}

// ─── Fetch GitHub data (with RTDB cache via REST) ────────────────────
async function getGitHubData(username) {
    try {
        const cached = await rtdbGet(`card-cache/${username}`);
        if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return { total: cached.total, stars: cached.stars };
        }
    } catch (error) {
        console.error("Cache read error:", error);
    }

    const data = await fetchGitHubData(username);

    rtdbSet(`card-cache/${username}`, {
        total: data.total,
        stars: data.stars,
        timestamp: Date.now(),
    }).catch((err) => console.error("Cache write error:", err));

    return data;
}

// ─── Helper: fetch all pages of repos ────────────────────────────────
async function fetchAllRepos(url, headers) {
    let allRepos = [];
    let page = 1;
    while (true) {
        const sep = url.includes("?") ? "&" : "?";
        const res = await fetch(`${url}${sep}per_page=100&page=${page}`, { headers });
        if (!res.ok) break;
        const repos = await res.json();
        if (!Array.isArray(repos) || repos.length === 0) break;
        allRepos = allRepos.concat(repos);
        if (repos.length < 100) break; // last page
        page++;
    }
    return allRepos;
}

// ─── Fetch fresh data from GitHub APIs ───────────────────────────────
async function fetchGitHubData(username) {
    const headers = { "User-Agent": "github-x-card" };

    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userRes.ok) throw new Error("User not found");

    // Contributions (all-time)
    const contribRes = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}`
    );
    const contribData = await contribRes.json();
    const totalContributions = Object.values(contribData.total || {}).reduce(
        (sum, val) => sum + val,
        0
    );

    // Personal repos stars
    const personalRepos = await fetchAllRepos(
        `https://api.github.com/users/${username}/repos`,
        headers
    );
    let totalStars = personalRepos.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0), 0
    );

    // Organization repos stars
    try {
        const orgsRes = await fetch(
            `https://api.github.com/users/${username}/orgs`,
            { headers }
        );
        if (orgsRes.ok) {
            const orgs = await orgsRes.json();
            if (Array.isArray(orgs) && orgs.length > 0) {
                // Fetch all org repos in parallel
                const orgRepoResults = await Promise.all(
                    orgs.map((org) =>
                        fetchAllRepos(
                            `https://api.github.com/orgs/${org.login}/repos`,
                            headers
                        )
                    )
                );
                for (const orgRepos of orgRepoResults) {
                    totalStars += orgRepos.reduce(
                        (sum, repo) => sum + (repo.stargazers_count || 0), 0
                    );
                }
            }
        }
    } catch (err) {
        console.error("Error fetching org repos:", err);
    }

    return { total: totalContributions, stars: totalStars };
}

// ─── Generate Standard SVG (400x180) ─────────────────────────────────
function generateStandardSVG(data, theme) {
    const t = themes[theme] || themes.dark;
    const fontFamily = t.font || "Arial, sans-serif";
    const borderAttr = t.border ? `stroke="${t.border}" stroke-width="1"` : "";

    const bgFill = t.transparent
        ? `fill="none"`
        : `fill="url(#grad)"`;

    const gradientDefs = t.transparent
        ? ""
        : `<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${t.bg2};stop-opacity:1" />
    </linearGradient>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDefs}</defs>
  <rect width="400" height="180" rx="12" ${bgFill} ${borderAttr}/>
  <text x="200" y="35" font-family="${fontFamily}" font-size="14" font-weight="600" fill="${t.accent}" text-anchor="middle" letter-spacing="1">${t.title}</text>
  <text x="120" y="85" font-family="${fontFamily}" font-size="28" font-weight="bold" fill="${t.text}" text-anchor="middle">${data.total.toLocaleString()}</text>
  <text x="120" y="105" font-family="${fontFamily}" font-size="11" fill="${t.label}" text-anchor="middle">CONTRIBUTIONS</text>
  <text x="280" y="85" font-family="${fontFamily}" font-size="28" font-weight="bold" fill="${t.text}" text-anchor="middle">${data.stars.toLocaleString()}</text>
  <text x="280" y="105" font-family="${fontFamily}" font-size="11" fill="${t.label}" text-anchor="middle">TOTAL STARS</text>
  <line x1="50" y1="125" x2="350" y2="125" stroke="${t.border || 'rgba(255,255,255,0.1)'}" stroke-width="1"/>
  <text x="200" y="155" font-family="${fontFamily}" font-size="13" font-weight="600" fill="${t.accent}" text-anchor="middle">${data.views.toLocaleString()} Profile Views</text>
</svg>`;
}

// ─── Generate Compact SVG (350x120) ──────────────────────────────────
function generateCompactSVG(data, theme) {
    const t = themes[theme] || themes.dark;
    const fontFamily = t.font || "Arial, sans-serif";
    const borderAttr = t.border ? `stroke="${t.border}" stroke-width="1"` : "";

    const bgFill = t.transparent ? `fill="none"` : `fill="url(#grad)"`;
    const gradientDefs = t.transparent ? ""
        : `<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${t.bg2};stop-opacity:1" />
    </linearGradient>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="350" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDefs}</defs>
  <rect width="350" height="120" rx="10" ${bgFill} ${borderAttr}/>
  <text x="175" y="25" font-family="${fontFamily}" font-size="11" font-weight="600" fill="${t.accent}" text-anchor="middle" letter-spacing="1">${t.title}</text>
  <text x="80" y="62" font-family="${fontFamily}" font-size="22" font-weight="bold" fill="${t.text}" text-anchor="middle">${data.total.toLocaleString()}</text>
  <text x="80" y="78" font-family="${fontFamily}" font-size="9" fill="${t.label}" text-anchor="middle">CONTRIBUTIONS</text>
  <text x="175" y="62" font-family="${fontFamily}" font-size="22" font-weight="bold" fill="${t.text}" text-anchor="middle">${data.stars.toLocaleString()}</text>
  <text x="175" y="78" font-family="${fontFamily}" font-size="9" fill="${t.label}" text-anchor="middle">STARS</text>
  <text x="270" y="62" font-family="${fontFamily}" font-size="22" font-weight="bold" fill="${t.text}" text-anchor="middle">${data.views.toLocaleString()}</text>
  <text x="270" y="78" font-family="${fontFamily}" font-size="9" fill="${t.label}" text-anchor="middle">VIEWS</text>
  <line x1="30" y1="90" x2="320" y2="90" stroke="${t.border || 'rgba(255,255,255,0.08)'}" stroke-width="1"/>
  <text x="175" y="110" font-family="${fontFamily}" font-size="10" fill="${t.label}" text-anchor="middle">github.com/${data.username}</text>
</svg>`;
}

// ─── Generate Minimal SVG (400x80 — single row) ─────────────────────
function generateMinimalSVG(data, theme) {
    const t = themes[theme] || themes.dark;
    const fontFamily = t.font || "Arial, sans-serif";
    const borderAttr = t.border ? `stroke="${t.border}" stroke-width="1"` : "";

    const bgFill = t.transparent ? `fill="none"` : `fill="url(#grad)"`;
    const gradientDefs = t.transparent ? ""
        : `<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${t.bg1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${t.bg2};stop-opacity:1" />
    </linearGradient>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="480" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDefs}</defs>
  <rect width="480" height="60" rx="8" ${bgFill} ${borderAttr}/>
  <text x="20" y="36" font-family="${fontFamily}" font-size="13" font-weight="bold" fill="${t.accent}">${data.username}</text>
  <text x="170" y="36" font-family="${fontFamily}" font-size="13" fill="${t.text}">${data.total.toLocaleString()} commits</text>
  <text x="300" y="36" font-family="${fontFamily}" font-size="13" fill="${t.text}">${data.stars.toLocaleString()} stars</text>
  <text x="390" y="36" font-family="${fontFamily}" font-size="13" fill="${t.label}">${data.views.toLocaleString()} views</text>
</svg>`;
}

// ─── Error SVG ───────────────────────────────────────────────────────
function errorSVG(message) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="100" rx="12" fill="#1a1a2e"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="14" fill="#ff6b6b" text-anchor="middle">${message}</text>
</svg>`;
}

// ─── 2nd Gen Cloud Function ──────────────────────────────────────────
// URL: /card/{username}/{theme}?layout=standard|compact|minimal
exports.card = onRequest(
    {
        region: "asia-south1",
        memory: "256MiB",
        timeoutSeconds: 15,
        concurrency: 80,
    },
    async (req, res) => {
        res.set("Access-Control-Allow-Origin", "*");

        // Parse path: /username/theme
        const pathParts = req.path.replace(/^\/+|\/+$/g, "").split("/");
        const username = pathParts[0];
        const theme = pathParts[1] || "dark";
        const layout = req.query.layout || "standard";

        // Return available themes list
        if (username === "themes") {
            res.set("Content-Type", "application/json");
            res.set("Cache-Control", "public, max-age=86400");
            return res.status(200).json({
                themes: Object.keys(themes),
                layouts: ["standard", "compact", "minimal"],
            });
        }

        if (!username) {
            res.set("Content-Type", "image/svg+xml");
            res.set("Cache-Control", "no-cache");
            return res.status(400).send(errorSVG("Missing username"));
        }

        if (!themes[theme]) {
            res.set("Content-Type", "image/svg+xml");
            res.set("Cache-Control", "no-cache");
            return res.status(400).send(
                errorSVG(`Unknown theme: ${theme}. Visit /card/themes for list`)
            );
        }

        try {
            const githubData = await getGitHubData(username);
            const views = await trackProfileView(username);

            const cardData = {
                total: githubData.total,
                stars: githubData.stars,
                views,
                username,
            };

            let svg;
            switch (layout) {
                case "compact":
                    svg = generateCompactSVG(cardData, theme);
                    break;
                case "minimal":
                    svg = generateMinimalSVG(cardData, theme);
                    break;
                default:
                    svg = generateStandardSVG(cardData, theme);
            }

            res.set("Content-Type", "image/svg+xml");
            res.set("Cache-Control", "public, max-age=1800, s-maxage=1800");
            return res.status(200).send(svg);
        } catch (error) {
            console.error("Card generation error:", error);
            res.set("Content-Type", "image/svg+xml");
            res.set("Cache-Control", "no-cache");
            return res.status(200).send(errorSVG(`Error: ${error.message}`));
        }
    }
);
