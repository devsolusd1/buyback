// ============================================================
//  CONFIGURACAO DO TOKEN — edite apenas este arquivo
// ============================================================
//  Depois de criar o token na Meteora, cole aqui o endereco
//  (mint address) do token. O resto do site se atualiza sozinho.
// ============================================================

window.SITE_CONFIG = {
  // Endereco (mint) do token na Solana.
  tokenAddress: "AWJCTuS8ECskSu4e6HDUmgzX7HhzVRNvRdvHKj4NiGGA",

  // Identidade do token
  tokenName: "BUYBACK",
  tokenTicker: "$BUYBACK",
  tagline: "Five companies walked into a data center. One token walked out.",

  // DEX preferido ao escolher o pool com dados (meteora, raydium, orca...)
  // Se nao houver pool nesse DEX, usa o pool com maior liquidez.
  preferredDex: "meteora",

  // Links dos botoes (deixe "" para esconder o botao)
  links: {
    buy: "https://jup.ag/swap/SOL-AWJCTuS8ECskSu4e6HDUmgzX7HhzVRNvRdvHKj4NiGGA",
  },

  // ----------------------------------------------------------
  // TOKENS-HOMENAGEM — um token para cada acao do consorcio.
  // Cole o CA de cada um em "address" quando lancar.
  // "ticker" e o nome exibido no card (troque quando definir).
  // ----------------------------------------------------------
  tributes: [
    { id: "nvidia", company: "NVIDIA", ticker: "TBA", address: "" },
    { id: "intel",  company: "Intel",  ticker: "TBA", address: "" },
    { id: "google", company: "Google", ticker: "TBA", address: "" },
    { id: "grok",   company: "Grok",   ticker: "TBA", address: "" },
    { id: "amd",    company: "AMD",    ticker: "TBA", address: "" },
  ],

  // Intervalo de atualizacao dos dados (em milissegundos)
  refreshMs: 10000,

  // Mostrar o grafico embutido da DexScreener
  showChart: true,
};
