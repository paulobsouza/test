document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#cadastro-form");
  const nomeInput = document.querySelector("#nome");
  const dataNascimentoInput = document.querySelector("#data_nascimento");
  const telefoneInput = document.querySelector("#telefone");
  const emailInput = document.querySelector("#email");
  const filtroInput = document.querySelector("#filtro-nome");
  const tabelaBody = document.querySelector("#lista-pessoas-body");

  const STORAGE_KEY = "cadastroPessoas";

  const pessoaFactory = (nome, dataNascimento, telefone, email) => {
    return {
      id: Date.now(),
      nome,
      dataNascimento,
      telefone,
      email,
    };
  };

  const getPessoas = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  };

  const salvarPessoas = (pessoas) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pessoas));
  };

    /**
        @param {string} filtro 
    */
  const renderizarTabela = (filtro = "") => {
    tabelaBody.innerHTML = "";
    const pessoas = getPessoas();

    const pessoasFiltradas = pessoas.filter((p) =>
      p.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    if (pessoasFiltradas.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "Nenhuma pessoa cadastrada ou encontrada.";
      td.style.textAlign = "center";
      tr.appendChild(td);
      tabelaBody.appendChild(tr);
      return;
    }

    pessoasFiltradas.forEach((pessoa) => {
      const tr = document.createElement("tr");

      const dataFormatada = new Date(pessoa.dataNascimento).toLocaleDateString(
        "pt-BR",
        { timeZone: "UTC" }
      );

      tr.innerHTML = `
                <td>${pessoa.nome}</td>
                <td>${dataFormatada}</td>
                <td>${pessoa.telefone}</td>
                <td>${pessoa.email}</td>
                <td>
                    <button class="btn-delete" data-id="${pessoa.id}">Deletar</button>
                </td>
            `;
      tabelaBody.appendChild(tr);
    });
  };

  const adicionarPessoa = () => {
    const nome = nomeInput.value.trim();
    const dataNascimento = dataNascimentoInput.value;
    const telefone = telefoneInput.value.trim();
    const email = emailInput.value.trim();

    if (!nome || !dataNascimento || !telefone || !email) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novaPessoa = pessoaFactory(nome, dataNascimento, telefone, email);

    const pessoas = getPessoas();
    pessoas.push(novaPessoa);
    salvarPessoas(pessoas);

    renderizarTabela();
    form.reset();
  };

    /**
        @param {number} id 
    */
  const deletarPessoa = (id) => {
    if (!confirm("Tem certeza que deseja deletar este registro?")) {
      return;
    }

    let pessoas = getPessoas();

    pessoas = pessoas.filter((p) => p.id !== id);
    salvarPessoas(pessoas);

    renderizarTabela(filtroInput.value);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    adicionarPessoa();
  });

  filtroInput.addEventListener("input", () => {
    renderizarTabela(filtroInput.value);
  });

  tabelaBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const idParaDeletar = Number(e.target.dataset.id);
      deletarPessoa(idParaDeletar);
    }
  });

  renderizarTabela();
});
