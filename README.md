# MailScope – Email Template Tester

Ferramenta de análise e pré-visualização de templates de email HTML, construída com **React 19 + TypeScript + Vite 6**.

Testa compatibilidade contra 8 clients de email (Outlook Classic, Outlook New, Gmail Web, Apple Mail, Yahoo Mail, iOS Mail, Gmail Android, Samsung Mail), detecta problemas de acessibilidade e oferece análise profunda via IA (Claude).

---

## Funcionalidades

- **Pré-visualização** com simulação de viewport por client/dispositivo
- **Análise estática** de 15+ regras (flexbox, grid, inline styles, table layout, media queries, etc.)
- **Score de compatibilidade** por device (0–100)
- **Painel de todos os devices** com scores simultâneos
- **Análise IA** via Claude API: compatibilidade cross-client, WCAG, AmpScript, boas práticas
- **Suporte a AmpScript**: blocos `%%[...]%%` detectados e neutralizados no preview
- **Drag & drop** de arquivos `.html`/`.htm`

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 18+ |
| npm / pnpm / yarn | qualquer recente |

---

## Instalação e uso

### 1. Instale as dependências

```bash
cd mailscope
npm install
```

### 2. Configure a chave da API (opcional – só para Análise IA)

```bash
cp .env.example .env
```

Edite `.env` e preencha sua chave:

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> Obtenha uma chave em [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).  
> Sem a chave, todas as funcionalidades de análise estática e preview funcionam normalmente. Apenas a aba **Análise IA** requer a chave.

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## Como usar o app

1. **Carregue um template** arrastando um arquivo `.html` para a área central, ou clique em **↑ Upload HTML** / **↑ Selecionar arquivo .html**.
2. **Escolha o client** na barra lateral esquerda (Desktop ou Mobile).
3. **Aba Preview**: visualize o template simulando o viewport do client selecionado. Ajuste o zoom (40%–100%).
4. **Aba Issues**: veja o score de compatibilidade e a lista de problemas críticos, avisos e itens aprovados, com sugestões de correção.
5. **Aba Análise IA**: clique em **▶ Executar Análise IA** para obter um relatório detalhado gerado pelo Claude.
6. **Painel direito**: compare os scores de todos os 8 devices ao mesmo tempo. Clique em qualquer device para ir direto à aba Issues dele.

---

## Build para produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`. Para servir localmente:

```bash
npm run preview
```

---

## Estrutura do projeto

```
mailscope/
├── index.html                  # Entry point HTML
├── vite.config.ts              # Configuração do Vite
├── tsconfig.json               # Referências TypeScript
├── tsconfig.app.json           # Config do código fonte
├── tsconfig.node.json          # Config do vite.config.ts
├── .env.example                # Template de variáveis de ambiente
└── src/
    ├── main.tsx                # Bootstrap React
    ├── App.tsx                 # Componente raiz (estado global, layout)
    ├── index.css               # Estilos globais + animações
    ├── types/
    │   └── index.ts            # Interfaces TypeScript (Device, Issue, AIReport…)
    ├── data/
    │   └── devices.ts          # Definições dos 8 clients de email
    ├── utils/
    │   ├── analyzeHTML.ts      # Motor de análise estática
    │   └── stripAmpScript.ts   # Sanitização de AmpScript para preview
    └── components/
        ├── ScoreRing.tsx       # SVG de score circular
        ├── IssueRow.tsx        # Linha de issue/warning/info
        ├── AISection.tsx       # Seção do relatório de IA
        ├── EmptyState.tsx      # Tela inicial com drag & drop
        ├── DeviceSidebar.tsx   # Barra lateral de seleção de device
        ├── PreviewTab.tsx      # Aba de preview via iframe
        ├── IssuesTab.tsx       # Aba de issues com score
        ├── AITab.tsx           # Aba de análise por IA
        └── DeviceStatsPanel.tsx # Painel direito com todos os devices
```

---

## Variáveis de ambiente

| Variável | Obrigatório | Descrição |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Não* | Chave da API Anthropic para Análise IA |

*Necessária somente para usar a funcionalidade **Análise IA**.

> **Segurança**: a chave é enviada diretamente do browser para a API da Anthropic. Não use em produção pública sem um proxy/backend intermediário.

---

## Adicionando novos clients de email

Edite [src/data/devices.ts](src/data/devices.ts) e adicione um novo objeto ao array `DEVICES`:

```ts
{
  id: "meu_client",
  label: "Meu Client",
  icon: "📮",
  group: "desktop",        // "desktop" | "mobile"
  viewportW: 600,
  maxWidth: 600,
  minFontSize: 12,
  engine: "webkit",
  rules: {
    requireInlineStyles: true,
    maxFileKB: 500,
    // ... outras regras
  },
  color: "#ff6600",
}
```

As regras disponíveis estão tipadas em [src/types/index.ts](src/types/index.ts) (`DeviceRules`).

---

## Adicionando novas regras de análise

Edite [src/utils/analyzeHTML.ts](src/utils/analyzeHTML.ts). Cada regra segue o padrão:

```ts
if (device.rules.minhaRegra && /* condição no HTML */) {
  issues.push({ code: "MEU_CODIGO", msg: "Mensagem", fix: "Como corrigir." });
  // ou warnings.push(...) para avisos não críticos
  // ou info.push(...) para itens aprovados
}
```

Depois adicione `minhaRegra?: boolean` à interface `DeviceRules` em `src/types/index.ts`.

---

## Licença

MIT
