// Importando o módulo 'express' e atribuindo-o à constante 'app'
const app = require('express')();
// Importando o módulo 'http' e criando um servidor com ele, atribuindo-o à constante 'http'
const http = require('http').createServer(app);
// Importando o módulo 'socket.io' e passando o servidor 'http' como parâmetro, atribuindo-o à constante 'io'
const io = require('socket.io')(http);

// Rota para a página inicial
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// Evento para quando o cliente se conecta ao servidor via Socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado');
  
  // Evento personalizado para quando o usuário entra no chat
  // O cliente envia esse evento somente quando envia a primeira mensagem
  socket.on('user joined', (nome) => {
    // Salvando o nome do usuário no socket para usar no disconnect
    socket.nome = nome;
    
    // Emite para todos os usuários que alguém entrou no chat
    io.emit('user joined', nome);
    
  });

  // Evento para quando o cliente envia uma mensagem via Socket.io
  socket.on('chat message', (data) => {
    // Salvando o nome no socket caso ainda não tenha sido salvo
    if (!socket.nome) socket.nome = data.nome;

    // Envia a mensagem para todos os conectados
    io.emit('chat message', data);
  });

  // Evento para quando o cliente se desconecta do servidor via Socket.io
  socket.on('disconnect', () => {

    // Verifica se o socket possui nome salvo antes de avisar a saída
    if (socket.nome) {
      
      // Emite para todos os usuários que alguém saiu do chat
      io.emit('user left', socket.nome);
    }
  });
});

// Inicia o servidor na porta 3000
http.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000 - Link http://localhost:3000`);
});

//npm install socket http express