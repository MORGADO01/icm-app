// Eventos especiais usam o mesmo caminho 'historico' no Realtime Database.
// Para salvar um evento, use salvarRegistro() de cultoService.js com tipo: 'Evento'.
// Este arquivo pode ser expandido futuramente para uma coleção separada se necessário.
export { salvarRegistro, excluirRegistro, ouvirHistorico } from './cultoService';
