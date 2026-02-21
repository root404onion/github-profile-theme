// ─── Configuration ──────────────────────────────────────────────────
const CARD_BASE = "https://asia-south1-astralelite.cloudfunctions.net/card";

// Theme data with colors for preview dots
const THEME_DATA = {
    "Classic Dark": {
        dark: { accent: "#64ffda", bg: "#1a1a2e" },
        midnight: { accent: "#ffd700", bg: "#0f0f23" },
        ocean: { accent: "#64ffda", bg: "#0a192f" },
    },
    "Vibrant": {
        neon: { accent: "#ff00ff", bg: "#1a1a1a" },
        cyberpunk: { accent: "#ff0080", bg: "#0a0a0a" },
        hacker: { accent: "#00ff00", bg: "#000000" },
    },
    "True Black / AMOLED": {
        amoled: { accent: "#bb86fc", bg: "#000000" },
        noir: { accent: "#ff4444", bg: "#000000" },
    },
    "Transparent": {
        transparent: { accent: "#58a6ff", bg: "transparent" },
        transparentdark: { accent: "#64ffda", bg: "transparent" },
    },
    "Anime": {
        anime: { accent: "#ff1493", bg: "#1a0533" },
        sakura: { accent: "#ff69b4", bg: "#2d1025" },
        dragonball: { accent: "#ffd700", bg: "#1a0a00" },
    },
    "Developer IDE": {
        dracula: { accent: "#bd93f9", bg: "#282a36" },
        monokai: { accent: "#a6e22e", bg: "#272822" },
        nord: { accent: "#88c0d0", bg: "#2e3440" },
        tokyonight: { accent: "#7aa2f7", bg: "#1a1b26" },
        catppuccin: { accent: "#cba6f7", bg: "#1e1e2e" },
        rosepine: { accent: "#c4a7e7", bg: "#191724" },
        gruvbox: { accent: "#fabd2f", bg: "#282828" },
        solarized: { accent: "#b58900", bg: "#002b36" },
        onedark: { accent: "#61afef", bg: "#282c34" },
    },
    "Professional": {
        professional: { accent: "#4fc3f7", bg: "#1b2838" },
        executive: { accent: "#d4af37", bg: "#1a1a2e" },
        minimal: { accent: "#0066cc", bg: "#ffffff" },
    },
    "Gradient / Artsy": {
        sunset: { accent: "#ff6b6b", bg: "#1a0533" },
        aurora: { accent: "#00e5ff", bg: "#0a1628" },
        fire: { accent: "#ff4500", bg: "#1a0000" },
        forest: { accent: "#32cd32", bg: "#0a1f0a" },
        galaxy: { accent: "#a855f7", bg: "#0b0020" },
        ice: { accent: "#00bcd4", bg: "#0a1929" },
    },
};

// ─── State ──────────────────────────────────────────────────────────
let currentTheme = "dark";
let currentLayout = "standard";
let currentTab = "markdown";
let currentUsername = "";

// ─── Init ───────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    renderThemeButtons();
    renderShowcase();
    document.getElementById("themeCount").textContent = `(${countThemes()})`;

    // Enter key to generate
    document.getElementById("username").addEventListener("keydown", (e) => {
        if (e.key === "Enter") generateCard();
    });
});

function countThemes() {
    return Object.values(THEME_DATA).reduce((sum, cat) => sum + Object.keys(cat).length, 0);
}

// ─── Render theme category buttons ──────────────────────────────────
function renderThemeButtons() {
    const container = document.getElementById("themeCategories");
    container.innerHTML = "";

    for (const [category, themes] of Object.entries(THEME_DATA)) {
        const section = document.createElement("div");

        const title = document.createElement("div");
        title.className = "theme-category-title";
        title.textContent = category;
        section.appendChild(title);

        const row = document.createElement("div");
        row.className = "theme-row";

        for (const [name, colors] of Object.entries(themes)) {
            const btn = document.createElement("button");
            btn.className = `theme-btn${name === currentTheme ? " active" : ""}`;
            btn.dataset.theme = name;
            btn.onclick = () => selectTheme(name, btn);

            const dot = document.createElement("span");
            dot.className = "theme-dot";
            if (colors.bg === "transparent") {
                dot.style.background = `conic-gradient(#444 25%, #222 25%, #222 50%, #444 50%, #444 75%, #222 75%)`;
                dot.style.backgroundSize = "4px 4px";
            } else {
                dot.style.background = `linear-gradient(135deg, ${colors.bg}, ${colors.accent})`;
            }

            btn.appendChild(dot);
            btn.appendChild(document.createTextNode(name));
            row.appendChild(btn);
        }

        section.appendChild(row);
        container.appendChild(section);
    }
}

// ─── Theme selection ────────────────────────────────────────────────
function selectTheme(theme, btn) {
    currentTheme = theme;
    document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (currentUsername) updatePreview();
}

// ─── Layout selection ───────────────────────────────────────────────
function selectLayout(layout, btn) {
    currentLayout = layout;
    document.querySelectorAll(".layout-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (currentUsername) updatePreview();
}

// ─── Generate card ──────────────────────────────────────────────────
function generateCard() {
    const input = document.getElementById("username").value.trim();
    if (!input) {
        document.getElementById("username").focus();
        return;
    }
    currentUsername = input;
    updatePreview();
    document.getElementById("previewSection").style.display = "block";
    document.getElementById("previewSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─── Update preview ─────────────────────────────────────────────────
function updatePreview() {
    const url = getCardUrl(currentUsername, currentTheme, currentLayout);
    const preview = document.getElementById("previewCard");
    preview.replaceChildren();
    const img = document.createElement("img");
    img.src = url;
    img.alt = "GitHub Stats Card";
    img.loading = "lazy";
    preview.appendChild(img);
    updateEmbedCode();
}

// ─── Build card URL ─────────────────────────────────────────────────
function getCardUrl(username, theme, layout) {
    let url = `${CARD_BASE}/${username}/${theme}`;
    if (layout !== "standard") url += `?layout=${layout}`;
    return url;
}

// ─── Embed code tabs ────────────────────────────────────────────────
function switchTab(tab, btn) {
    currentTab = tab;
    document.querySelectorAll(".embed-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateEmbedCode();
}

function updateEmbedCode() {
    const url = getCardUrl(currentUsername, currentTheme, currentLayout);
    const codeEl = document.getElementById("embedCode");

    switch (currentTab) {
        case "markdown":
            codeEl.textContent = `![GitHub Stats](${url})`;
            break;
        case "html":
            const w = currentLayout === "compact" ? 350 : currentLayout === "minimal" ? 480 : 400;
            codeEl.textContent = `<img src="${url}" alt="GitHub Stats" width="${w}" />`;
            break;
        case "url":
            codeEl.textContent = url;
            break;
    }
}

// ─── Copy to clipboard ─────────────────────────────────────────────
async function copyCode() {
    const code = document.getElementById("embedCode").textContent;
    try {
        await navigator.clipboard.writeText(code);
        const btn = document.querySelector(".copy-btn");
        btn.classList.add("copied");
        btn.querySelector("span").textContent = "Copied!";
        setTimeout(() => {
            btn.classList.remove("copied");
            btn.querySelector("span").textContent = "Copy";
        }, 2000);
    } catch (err) {
        console.error("Copy failed:", err);
    }
}

// ─── Showcase grid (all themes preview) ─────────────────────────────
function renderShowcase() {
    const grid = document.getElementById("showcaseGrid");
    grid.innerHTML = "";
    const demoUser = "root404onion";

    for (const [category, themes] of Object.entries(THEME_DATA)) {
        for (const [name] of Object.entries(themes)) {
            const url = getCardUrl(demoUser, name, "standard");

            const item = document.createElement("div");
            item.className = "showcase-item";
            item.onclick = () => {
                currentTheme = name;
                document.getElementById("username").value = document.getElementById("username").value || demoUser;
                currentUsername = document.getElementById("username").value || demoUser;
                renderThemeButtons(); // re-render to update active state
                generateCard();
            };

            item.innerHTML = `
                <img src="${url}" alt="${name} theme" loading="lazy">
                <div class="showcase-item-label">
                    <span>${name}</span>
                    <span>${category}</span>
                </div>
            `;

            grid.appendChild(item);
        }
    }
}
