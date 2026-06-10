/* ============================================================
   $BUYBACK — dados em tempo real via DexScreener
   (cobre pools da Meteora; sem chave de API)
   ============================================================ */

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

  // ---------- aplica config estatica na pagina ----------

  function applyConfig() {
    document.title = cfg.tokenTicker + " — Live Filing";
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

  // ---------- dados ao vivo ----------

  let chartLoaded = false;
  let lastPrice = null;

  function pickPair(pairs) {
    if (!pairs || !pairs.length) return null;
    const solana = pairs.filter((p) => p.chainId === "solana");
    const pool = solana.length ? solana : pairs;
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
      void el.parentElement.offsetWidth; // reinicia a animacao
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
          "nenhum pool encontrado para este token ainda — verifique o endereco no config.js";
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
        "atualizado " + new Date().toLocaleTimeString();

      if (cfg.showChart && !chartLoaded && pair.pairAddress) {
        $("chart-frame").src =
          "https://dexscreener.com/" + pair.chainId + "/" + pair.pairAddress +
          "?embed=1&theme=light&trades=0&info=0";
        chartLoaded = true;
      }
    } catch (err) {
      $("board-status").textContent = "erro ao buscar dados: " + err.message;
    }
  }

  applyConfig();
  refresh();
  setInterval(refresh, cfg.refreshMs);
})();
