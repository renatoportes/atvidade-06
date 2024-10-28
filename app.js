const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Configuração de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'meu_segredo_seguro',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware de autenticação
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// Rota de login
app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Nome de usuário" required />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username } = req.body;

  if (username) {
    req.session.user = username;
    res.redirect('/protected');
  } else {
    res.send('Por favor, insira um nome de usuário.');
  }
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('Erro ao fazer logout.');
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Rota protegida
app.get('/protected', isAuthenticated, (req, res) => {
  res.send(`Bem-vindo(a), ${req.session.user}! Esta é uma página protegida.`);
});

// Página inicial
app.get('/', (req, res) => {
  res.send('<a href="/login">Login</a> | <a href="/protected">Página Protegida</a> | <a href="/logout">Logout</a>');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
