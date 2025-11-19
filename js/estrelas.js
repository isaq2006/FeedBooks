// Sistema de estrelas do formulário
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll('#rating span');
  const nivelInput = document.getElementById('nivel');

  stars.forEach(star => {
    star.addEventListener('click', function () {
      const val = parseInt(this.dataset.value);

      nivelInput.value = val;

      atualizarEstrelas(val);
    });

    // Efeito hover
    star.addEventListener('mouseover', function () {
      atualizarEstrelas(this.dataset.value);
    });

    // Ao sair do bloco, volta para o valor salvo
    star.addEventListener('mouseout', function () {
      atualizarEstrelas(nivelInput.value);
    });
  });

  function atualizarEstrelas(valor) {
    stars.forEach(s => {
      const sVal = parseInt(s.dataset.value);
      if (sVal <= valor) s.classList.add('filled');
      else s.classList.remove('filled');
    });
  }
});
