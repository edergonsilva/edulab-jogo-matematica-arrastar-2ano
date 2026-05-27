# Arrasta Matemática — 2º Ano (.edugame)

Jogo educativo de **Matemática para o 2º ano** em formato **arrastar e soltar**, com:

- adição
- subtração
- dezenas e unidades
- apoio visual com material dourado

## O que o jogo faz

- Gera **20 questões por sessão**.
- Mistura desafios com:
  - **termo faltando** (ex.: `2 + ? = 4`, `8 - ? = 5`)
  - **resultado faltando** (ex.: `5 - 3 = ?`)
- Em cada questão há **4 opções** (1 correta e 3 distratores plausíveis).
- Exibe progresso (`Questão X de 20`), feedback de acerto/erro e resumo final.
- Inclui painel visual de **material dourado** (dezenas/unidades) + laboratório interativo para montagem livre.

## Estrutura do pacote

```text
.
├── manifest.json
├── index.html
├── assets/
│   ├── game.js
│   ├── styles.css
│   └── thumbnail.svg
├── scripts/
│   └── package-edugame.sh
└── README.md
```

## Rodar localmente

Use qualquer servidor estático. Exemplo com Python:

```bash
cd /tmp/workspace/edergonsilva/edulab-jogo-matematica-arrastar-2ano
python3 -m http.server 8080
```

Abra no navegador:

- `http://localhost:8080/index.html`

## Gerar pacote `.edugame`

```bash
cd /tmp/workspace/edergonsilva/edulab-jogo-matematica-arrastar-2ano
./scripts/package-edugame.sh
```

Saída padrão:

- `arrasta-matematica-2ano-v1.edugame`

Para definir outro nome de arquivo:

```bash
./scripts/package-edugame.sh meu-jogo.edugame
```

## Eventos `window.postMessage` emitidos

O jogo emite os eventos abaixo para integração com a plataforma EduLab Games:

- `game_started`
- `question_answered`
- `score_updated`
- `game_finished`

Exemplo de payload:

```json
{
  "source": "edulab-game",
  "type": "question_answered",
  "payload": {
    "index": 3,
    "correct": true,
    "answer": 7,
    "expected": 7,
    "operation": "+"
  },
  "timestamp": "2026-01-01T12:00:00.000Z"
}
```

## Manual rápido para PDF

Você pode converter este README em PDF para distribuição interna (por exemplo com navegador: Imprimir > Salvar como PDF).
