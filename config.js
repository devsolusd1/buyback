// ============================================================
//  CONFIGURACAO DO TOKEN — edite apenas este arquivo
// ============================================================
//  Depois de criar o token na Meteora, cole aqui o endereco
//  (mint address) do token. O resto do site se atualiza sozinho.
// ============================================================

window.SITE_CONFIG = {
  // Endereco (mint) do token na Solana.
  tokenAddress: "4QFGofjhC6M8pPUAwQBkQZK2bR9rqMdqCr71rTb6iGGA",

  // Identidade do token
  tokenName: "BUYBACK",
  tokenTicker: "$BUYBACK",
  tagline: "Five companies walked into a data center. One token walked out.",

  // DEX preferido ao escolher o pool com dados (meteora, raydium, orca...)
  // Se nao houver pool nesse DEX, usa o pool com maior liquidez.
  preferredDex: "meteora",

  // Links dos botoes (deixe "" para esconder o botao)
  links: {
    buy: "https://jup.ag/swap/SOL-4QFGofjhC6M8pPUAwQBkQZK2bR9rqMdqCr71rTb6iGGA",
  },

  // ----------------------------------------------------------
  // TOKENS-HOMENAGEM — um token para cada acao do consorcio.
  // Cole o CA de cada um em "address" quando lancar.
  // "ticker" e o nome exibido no card (troque quando definir).
  // ----------------------------------------------------------
  tributes: [
    { id: "nvidia", company: "NVIDIA", ticker: "TBA", address: "E5MFjRQf8Zd86FAcjnxs9JEh6qWGEfhr2juLxrM7AMa" },
    { id: "intel",  company: "Intel",  ticker: "TBA", address: "VTwqVfiWtqCQGzsbkFAZMCt8WaLdmb99CegteRCwkka" },
    { id: "google", company: "Google", ticker: "TBA", address: "8hnWfipR9KJxKJ69YVQH3XfShbpDGsREaVzzAvmN7ja" },
    { id: "grok",   company: "Grok",   ticker: "TBA", address: "v81r12vSgm2NKUxr3ajvqtgYbVDyPt1PR6w3sarAYFa" },
    { id: "amd",    company: "AMD",    ticker: "TBA", address: "Ss2nYT69uU5vx7gGaoXuTKgNQY9Wqvq9st1PfRj2ADa" },
  ],

  // Intervalo de atualizacao dos dados (em milissegundos)
  refreshMs: 10000,

  // Mostrar o grafico embutido da DexScreener
  showChart: true,
};
