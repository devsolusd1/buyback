# $BUYBACK — Landing Page com Dados em Tempo Real

Site estático no estilo "paródia de documento da SEC" (inspirado em nvidiaintelgooglegrokamd.fun), com dados ao vivo do token puxados da API pública da DexScreener — que indexa os pools da Meteora na Solana.

## Como funciona

- [index.html](index.html) — estrutura da página (header, painel de dados, gráfico, "exhibits" de paródia)
- [styles.css](styles.css) — visual de documento financeiro (papel, serifa, monoespaçada)
- [app.js](app.js) — busca os dados na DexScreener a cada 10s e atualiza o painel
- [config.js](config.js) — **único arquivo que você precisa editar**

Os dados exibidos (preço, market cap, volume 24h, liquidez, variação 24h, transações) vêm de
`https://api.dexscreener.com/latest/dex/tokens/<endereco>` — sem chave de API. O site escolhe
automaticamente o pool da **Meteora** (configurável em `preferredDex`); se não houver, usa o pool
com maior liquidez. O gráfico é o embed oficial da DexScreener para o pool escolhido.

## Quando criar o token na Meteora

1. Copie o **mint address** do token.
2. Em [config.js](config.js), troque:
   - `tokenAddress` → endereço do seu token
   - `tokenName`, `tokenTicker`, `tagline` → identidade do projeto
   - `links.buy` → ex.: `https://jup.ag/swap/SOL-<endereco>`
3. Pronto — o painel e o gráfico passam a mostrar o seu token.

> Obs.: a DexScreener indexa pools novos em poucos minutos após a primeira liquidez/trade.

## Rodar localmente

```
python -m http.server 8765
```

e abra http://localhost:8765

## Deploy (grátis)

É um site 100% estático — basta arrastar a pasta para [Netlify Drop](https://app.netlify.com/drop),
ou usar Vercel / GitHub Pages / Cloudflare Pages. Nenhum backend necessário.
