# ICM App — Controle de Cultos

Aplicação web para controle de contagem de EBD, Cultos e Eventos, com histórico salvo no Firebase Realtime Database.

## Estrutura

```
docs/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js           ← inicialização, abas, salvar, toasts
│   ├── contadores.js     ← estado e lógica dos contadores
│   ├── firebase.js       ← conexão com o Firebase
│   └── historico.js      ← histórico em tempo real
└── img/
    ├── logo_icm.png
    └── icon_icm.png
```

## Como rodar localmente

É uma aplicação estática (HTML/CSS/JS puro, sem build). Basta servir a pasta `docs/` com qualquer servidor local, por exemplo:

```bash
cd docs
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080` no navegador.

## Publicar (GitHub Pages)

A pasta `docs/` já está pronta para o GitHub Pages: em **Settings → Pages**, selecione a branch principal e a pasta `/docs` como origem.
