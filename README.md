# ICM App — Controle de Cultos

App React Native (Expo) para Android e iOS.

## Estrutura

```
app/
├── App.js
├── package.json
├── assets/
│   └── logo_icm.png        ← coloque a logo aqui
└── src/
    ├── config/
    │   └── firebase.js     ← conexão Firebase
    ├── services/
    │   └── registroService.js  ← salvar/excluir/ouvir
    ├── hooks/
    │   ├── useContador.js
    │   └── useCultoAtual.js
    ├── components/
    │   ├── ContadorCard.js
    │   ├── BotaoSalvar.js
    │   └── TotalBox.js
    └── screens/
        ├── EBDScreen.js
        ├── CultoScreen.js
        ├── EventoScreen.js
        └── HistoricoScreen.js
```

## Como rodar

```bash
cd app
npm install
npx expo start
```

Leia o QR Code com o app Expo Go no celular.

## Build para Android/iOS

```bash
npx eas build --platform android
npx eas build --platform ios
```
