(function () {
  const cfg = window.SITE_CONFIG;

  const $ = (id) => document.getElementById(id);

  const fmtUsd = (n, opts = {}) => {
    if (n == null || isNaN(n)) return "—";
    const num = Number(n);
    if (opts.compact && Math.abs(num) >= 1000) {
      return "$" + Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(num);
    }
    if (num > 0 && num < 1) {
      const decimals = Math.max(4, 2 - Math.floor(Math.log10(num)) + 1);
      return "$" + num.toFixed(Math.min(decimals, 12));
    }
    return "$" + Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num);
  };

  const fmtPct = (n) => {
    if (n == null || isNaN(n)) return "—";
    const v = Number(n);
    return (v > 0 ? "+" : "") + v.toFixed(2) + "%";
  };

  function applyConfig() {
    document.title = cfg.tokenTicker;
    $("ticker-top").textContent = cfg.tokenTicker;
    $("token-name").textContent = cfg.tokenTicker;
    $("tagline").textContent = cfg.tagline;
    $("contract").textContent = "CA: " + cfg.tokenAddress;
    $("filing-date").textContent = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    const links = [
      ["btn-buy", cfg.links.buy],
    ];
    for (const [id, url] of links) {
      const el = $(id);
      if (url) el.href = url;
      else el.style.display = "none";
    }

    $("contract").addEventListener("click", () => {
      navigator.clipboard.writeText(cfg.tokenAddress).then(() => toast("contract copied"));
    });
  }

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1800);
  }

  const wordmarks = {
    nvidia: '<span class="wordmark wm-nvidia">NVIDIA</span>',
    intel: '<span class="wordmark wm-intel">intel</span>',
    google: '<span class="wordmark wm-google"><i>G</i><i>o</i><i>o</i><i>g</i><i>l</i><i>e</i></span>',
    grok: '<span class="wordmark wm-grok">Grok</span>',
    amd: '<span class="wordmark wm-amd">AMD</span>',
  };

  function renderTributes() {
    const grid = $("tribute-grid");
    if (!grid) return;
    grid.innerHTML = "";
    for (const t of cfg.tributes || []) {
      const card = document.createElement("div");
      card.className = "tribute-card co-" + t.id;
      const hasCa = !!t.address;
      card.innerHTML =
        '<div class="t-head">' + (wordmarks[t.id] || t.company) +
        '<span class="t-ticker">' + t.ticker + "</span></div>" +
        '<div class="t-ca" data-addr="' + (t.address || "") + '" title="click to copy">' +
        (hasCa ? "CA: " + t.address : "CA: TBA — launching soon") + "</div>" +
        '<div class="t-stats">' +
        '<div class="t-stat"><span class="label">Price</span><span class="value" id="t-' + t.id + '-price">—</span></div>' +
        '<div class="t-stat"><span class="label">MCap</span><span class="value" id="t-' + t.id + '-mcap">—</span></div>' +
        '<div class="t-stat"><span class="label">24h</span><span class="value" id="t-' + t.id + '-change">—</span></div>' +
        "</div>" +
        (hasCa
          ? '<a class="t-buy" href="https://jup.ag/swap/SOL-' + t.address + '" target="_blank" rel="noopener">Buy</a>'
          : '<span class="t-buy disabled">Soon</span>');
      grid.appendChild(card);

      if (hasCa) {
        card.querySelector(".t-ca").addEventListener("click", () => {
          navigator.clipboard.writeText(t.address).then(() => toast(t.company + " contract copied"));
        });
      }
    }
  }

  async function refreshTributes() {
    const withCa = (cfg.tributes || []).filter((t) => t.address);
    if (!withCa.length) return;
    try {
      const res = await fetch(
        "https://api.dexscreener.com/latest/dex/tokens/" +
          withCa.map((t) => t.address).join(",")
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      for (const t of withCa) {
        const pairs = (data.pairs || []).filter(
          (p) => p.baseToken?.address === t.address
        );
        const pair = pickPair(pairs);
        if (!pair) continue;
        $("t-" + t.id + "-price").textContent = fmtUsd(Number(pair.priceUsd));
        $("t-" + t.id + "-mcap").textContent = fmtUsd(pair.marketCap ?? pair.fdv, { compact: true });
        const ch = pair.priceChange?.h24;
        const chEl = $("t-" + t.id + "-change");
        chEl.textContent = fmtPct(ch);
        chEl.classList.remove("up", "down");
        if (ch > 0) chEl.classList.add("up");
        if (ch < 0) chEl.classList.add("down");
      }
    } catch (err) {}
  }

  let chartLoaded = false;
  let lastPrice = null;

  const MAJOR_QUOTES = ["SOL", "WSOL", "USDC", "USDT"];

  function pickPair(pairs) {
    if (!pairs || !pairs.length) return null;
    const solana = pairs.filter((p) => p.chainId === "solana");
    let pool = solana.length ? solana : pairs;
    const majors = pool.filter((p) =>
      MAJOR_QUOTES.includes((p.quoteToken?.symbol || "").toUpperCase())
    );
    if (majors.length) pool = majors;
    const preferred = pool.filter((p) => p.dexId === cfg.preferredDex);
    const candidates = preferred.length ? preferred : pool;
    return candidates.sort(
      (a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )[0];
  }

  function setValue(id, text, cls) {
    const el = $(id);
    if (el.textContent !== text) {
      el.textContent = text;
      el.parentElement.classList.remove("flash");
      void el.parentElement.offsetWidth;
      el.parentElement.classList.add("flash");
    }
    el.classList.remove("up", "down");
    if (cls) el.classList.add(cls);
  }

  async function refresh() {
    try {
      const res = await fetch(
        "https://api.dexscreener.com/latest/dex/tokens/" + cfg.tokenAddress
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const pair = pickPair(data.pairs);
      if (!pair) {
        $("board-status").textContent =
          "no pool found for this token yet — check the address in config.js";
        return;
      }

      const price = Number(pair.priceUsd);
      const dir = lastPrice == null ? null : price > lastPrice ? "up" : price < lastPrice ? "down" : null;
      lastPrice = price;

      setValue("v-price", fmtUsd(price), dir);
      setValue("v-mcap", fmtUsd(pair.marketCap ?? pair.fdv, { compact: true }));
      setValue("v-vol", fmtUsd(pair.volume?.h24, { compact: true }));
      setValue("v-liq", fmtUsd(pair.liquidity?.usd, { compact: true }));

      const ch = pair.priceChange?.h24;
      setValue("v-change", fmtPct(ch), ch > 0 ? "up" : ch < 0 ? "down" : null);
      setValue("v-txns", String((pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0)));

      $("board-status").textContent =
        "pool: " + pair.dexId + " · " + pair.baseToken.symbol + "/" + pair.quoteToken.symbol;
      $("board-updated").textContent =
        "updated " + new Date().toLocaleTimeString();

      if (cfg.showChart && !chartLoaded && pair.pairAddress) {
        $("chart-frame").src =
          "https://dexscreener.com/" + pair.chainId + "/" + pair.pairAddress +
          "?embed=1&theme=light&trades=0&info=0";
        chartLoaded = true;
      }
    } catch (err) {
      $("board-status").textContent = "data fetch error: " + err.message;
    }
  }

  applyConfig();
  renderTributes();
  refresh();
  refreshTributes();
  setInterval(() => {
    refresh();
    refreshTributes();
  }, cfg.refreshMs);
})();
