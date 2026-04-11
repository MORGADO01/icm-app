# ICM App — Controle de Cultos

Projeto React Native (Expo) com Firebase.

## Estrutura de pastas

```
icm-app/
├── app.json
├── package.json
├── App.js                          ← entrada do app
│
├── src/
│   ├── config/
│   │   └── firebase.js             ← configuração do Firebase
│   │
│   ├── services/
│   │   ├── cultoService.js         ← salvar/buscar cultos
│   │   └── eventoService.js        ← salvar/buscar eventos
│   │
│   ├── hooks/
│   │   ├── useContador.js          ← lógica dos contadores +/-
│   │   └── useCultoAtual.js        ← detecta culto do dia/hora
│   │
│   ├── screens/
│   │   ├── EBDScreen.js
│   │   ├── CultoScreen.js
│   │   ├── EventoScreen.js
│   │   └── HistoricoScreen.js
│   │
│   └── components/
│       ├── ContadorCard.js         ← card reutilizável com +/-
│       ├── BotaoSalvar.js
│       └── Header.js
```

## Instalação

```bash
npx create-expo-app icm-app
cd icm-app
npm install firebase
```

## Configuração do Firebase
Preencha src/config/firebase.js com suas credenciais do console Firebase.
