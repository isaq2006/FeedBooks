let livros = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis" },
  { id: 2, titulo: "O Alienista", autor: "Machado de Assis" },
  { id: 3, titulo: "Capitães da Areia", autor: "Jorge Amado" }
];

let feedbacks = [
  { livro_id: 1, usuario: "Ana", nivel: 5, comentario: "Um clássico com reflexões profundas." },
  { livro_id: 1, usuario: "Pedro", nivel: 4, comentario: "Excelente leitura, mas um pouco densa." },
  { livro_id: 2, usuario: "Maria", nivel: 3, comentario: "Interessante, mas esperava mais do final." },
  { livro_id: 2, usuario: "Lucas", nivel: 2, comentario: "Demora pra engrenar, mas tem bons momentos." },
  { livro_id: 3, usuario: "João", nivel: 5, comentario: "Uma história emocionante e crítica." },
  { livro_id: 3, usuario: "Clara", nivel: 1, comentario: "Não me conectei com os personagens." }
];

const niveis = ["Muito ruim", "Ruim", "Mediano", "Bom", "Muito bom"];

function salvarDados() {
  localStorage.setItem('livros', JSON.stringify(livros));
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

function carregarDados() {
  const livrosSalvos = JSON.parse(localStorage.getItem('livros'));
  const feedbacksSalvos = JSON.parse(localStorage.getItem('feedbacks'));
  if (livrosSalvos) livros = livrosSalvos;
  if (feedbacksSalvos) feedbacks = feedbacksSalvos;
}
carregarDados();

function calcularMedia(idLivro) {
  const fbs = feedbacks.filter(f => f.livro_id === idLivro);
  if (fbs.length === 0) return "Sem avaliações";
  const media = fbs.reduce((acc, f) => acc + f.nivel, 0) / fbs.length;
  return niveis[Math.round(media) - 1];
}

function renderizarLivros(lista = livros) {
  const container = document.getElementById('listaLivros');
  if (!container) return;
  container.innerHTML = '';
  lista.forEach(livro => {
    const div = document.createElement('div');
    div.className = 'livro';
    div.innerHTML = `
      <h3 onclick="toggleFeedback(${livro.id})">${livro.titulo}</h3>
      <p><strong>Autor:</strong> ${livro.autor}</p>
      <p><strong>Média:</strong> ${calcularMedia(livro.id)}</p>
      <div id="feedbacks-${livro.id}" class="feedback-container"></div>
    `;
    container.appendChild(div);
  });
}

function toggleFeedback(idLivro) {
  const fbContainer = document.getElementById(`feedbacks-${idLivro}`);
  const estaAberto = fbContainer.style.display === 'block';
  document.querySelectorAll('.feedback-container').forEach(div => div.style.display = 'none');
  if (estaAberto) return;

  const fbs = feedbacks.filter(f => f.livro_id === idLivro);
  if (fbs.length === 0) {
    fbContainer.innerHTML = '<p>Sem avaliações disponíveis.</p>';
  } else {
    let html = '<div class="filter-bar"><select onchange="filtrarFeedbacks(this.value, ' + idLivro + ')"><option value="">Filtrar</option><option value="desc">Melhor ao pior</option><option value="asc">Pior ao melhor</option></select></div>';
    fbs.forEach(fb => {
      html += `<div class='feedback'><strong>${fb.usuario}</strong> — ${niveis[fb.nivel - 1]}<br>${fb.comentario}</div>`;
    });
    fbContainer.innerHTML = html;
  }
  fbContainer.style.display = 'block';
}

function filtrarFeedbacks(ordem, idLivro) {
  const fbs = feedbacks.filter(f => f.livro_id === idLivro);
  if (ordem === 'asc') fbs.sort((a, b) => a.nivel - b.nivel);
  else if (ordem === 'desc') fbs.sort((a, b) => b.nivel - a.nivel);
  const fbContainer = document.getElementById(`feedbacks-${idLivro}`);
  let html = '<div class="filter-bar"><select onchange="filtrarFeedbacks(this.value, ' + idLivro + ')"><option value="">Filtrar</option><option value="desc">Melhor ao pior</option><option value="asc">Pior ao melhor</option></select></div>';
  fbs.forEach(fb => {
    html += `<div class='feedback'><strong>${fb.usuario}</strong> — ${niveis[fb.nivel - 1]}<br>${fb.comentario}</div>`;
  });
  fbContainer.innerHTML = html;
}

function filtrarLivros() {
  const termo = document.getElementById('searchInput').value.toLowerCase();
  const filtrados = livros.filter(l => l.titulo.toLowerCase().includes(termo));
  renderizarLivros(filtrados);
}

renderizarLivros();

// ------------------- NOVO: FORMULÁRIO DE COMENTÁRIOS -------------------

// Renderiza os comentários do usuário na seção "Meus Comentários"
function renderizarMeusComentarios(usuario) {
  const container = document.getElementById('listaComentarios');
  if (!container) return;
  container.innerHTML = '';

  const meusFbs = feedbacks.filter(fb => fb.usuario.toLowerCase() === usuario.toLowerCase());
  if (meusFbs.length === 0) {
    container.innerHTML = '<p>Você ainda não fez comentários.</p>';
    return;
  }

  meusFbs.forEach(fb => {
    const livro = livros.find(l => l.id == fb.livro_id);
    container.innerHTML += `
      <div class="feedback">
        <strong>${livro ? livro.titulo : 'Livro não encontrado'}</strong> — ${niveis[fb.nivel - 1]}<br>
        ${fb.comentario}
      </div>
    `;
  });
}

// Captura o submit do formulário
if (document.getElementById('formComentario')) {
  document.getElementById('formComentario').addEventListener('submit', function(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    const nivel = parseInt(document.getElementById('nivel').value);

    if (!titulo || !autor || !usuario || !comentario || !nivel) return;

    // Verifica se o livro já existe
    let livro = livros.find(l => l.titulo.toLowerCase() === titulo.toLowerCase() && l.autor.toLowerCase() === autor.toLowerCase());
    if (!livro) {
      // Adiciona novo livro
      livro = { id: livros.length ? Math.max(...livros.map(l => l.id)) + 1 : 1, titulo, autor };
      livros.push(livro);
      salvarDados();
    }

    // Adiciona o comentário
    feedbacks.push({ livro_id: livro.id, usuario, nivel, comentario });
    salvarDados();

    // Limpa o formulário
    this.reset();

    // Atualiza a lista de comentários do usuário
    renderizarMeusComentarios(usuario);

    alert('Comentário salvo com sucesso!');
  });
}

