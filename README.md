# EduLab Jogo Matemática Arrastar 2º Ano

Jogo educativo em formato `.edugame` para crianças do 2º ano resolverem contas de adição e subtração com apoio de **material dourado realmente manipulável**.

## O que o jogo oferece

- 20 contas por sessão
- operações aleatórias adequadas ao 2º ano
- 4 alternativas por questão
- arrastar a resposta correta para a lacuna
- feedback visual de acerto e erro
- progresso da sessão e resumo final
- área de material dourado com:
  - banco de unidades e dezenas
  - criação de novas peças por arraste
  - movimentação livre na mesa
  - reorganização ilimitada
  - contador de dezenas, unidades e total
  - botão para limpar a área
- emissão de eventos com `window.postMessage`

## Arquivos principais

- `/tmp/workspace/edergonsilva/edulab-jogo-matematica-arrastar-2ano/index.html`
- `/tmp/workspace/edergonsilva/edulab-jogo-matematica-arrastar-2ano/manifest.json`
- `/tmp/workspace/edergonsilva/edulab-jogo-matematica-arrastar-2ano/scripts/package-edugame.sh`

## Como visualizar localmente

Você pode abrir o arquivo `index.html` diretamente no navegador ou servir a pasta com um servidor simples:

```bash
cd /tmp/workspace/edergonsilva/edulab-jogo-matematica-arrastar-2ano
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Como gerar o pacote `.edugame`

```bash
cd /tmp/workspace/edergonsilva/edulab-jogo-matematica-arrastar-2ano
./scripts/package-edugame.sh
```

O arquivo gerado ficará em `dist/arrasta-matematica-2ano.edugame`.
