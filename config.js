// ============================================================
//  CONFIGURACAO DO TOKEN — edite apenas este arquivo
// ============================================================
//  Depois de criar o token na Meteora, cole aqui o endereco
//  (mint address) do token. O resto do site se atualiza sozinho.
// ============================================================

window.SITE_CONFIG = {
  // Endereco (mint) do token na Solana.
  // DEMO: BONK — troque pelo endereco do seu token quando criar na Meteora.
  tokenAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",

  // Identidade do token
  tokenName: "BUYBACK",
  tokenTicker: "$BUYBACK",
  tagline: "Five companies walked into a data center. One token walked out.",

  // DEX preferido ao escolher o pool com dados (meteora, raydium, orca...)
  // Se nao houver pool nesse DEX, usa o pool com maior liquidez.
  preferredDex: "meteora",

  // Links dos botoes (deixe "" para esconder o botao)
  links: {
    buy: "https://jup.ag/swap/SOL-DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  },

  // Intervalo de atualizacao dos dados (em milissegundos)
  refreshMs: 10000,

  // Mostrar o grafico embutido da DexScreener
  showChart: true,
};
