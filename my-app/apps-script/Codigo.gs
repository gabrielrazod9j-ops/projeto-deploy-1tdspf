const NOME_ABA = "produtos";
const CABECALHO = ["id", "nome", "preco", "descricao", "avatar"];

function obterAba() {
  const arquivo = SpreadsheetApp.getActiveSpreadsheet();
  let aba = arquivo.getSheetByName(NOME_ABA);
  if (!aba) {
    aba = arquivo.insertSheet(NOME_ABA);
    aba.appendRow(CABECALHO);
  }
  return aba;
}

function responder(dados) {
  return ContentService
    .createTextOutput(JSON.stringify(dados))
    .setMimeType(ContentService.MimeType.JSON);
}

function linhaParaProduto(linha) {
  return {
    id: String(linha[0]),
    nome: String(linha[1]),
    preco: Number(linha[2]) || 0,
    descricao: String(linha[3] || ""),
    avatar: String(linha[4] || "")
  };
}

function localizarLinha(aba, id) {
  const valores = aba.getDataRange().getValues();
  for (let i = 1; i < valores.length; i++) {
    if (String(valores[i][0]) === String(id)) return i + 1;
  }
  return -1;
}

function doGet(e) {
  try {
    const aba = obterAba();
    const produtos = aba.getDataRange().getValues()
      .slice(1)
      .filter(function (l) { return l[0] !== ""; })
      .map(linhaParaProduto);

    const id = e && e.parameter ? e.parameter.id : "";
    if (id) {
      const produto = produtos.find(function (p) { return p.id === String(id); });
      if (!produto) return responder({ status: "error", message: "Produto não encontrado." });
      return responder({ status: "success", data: produto });
    }
    return responder({ status: "success", data: produtos });
  } catch (erro) {
    return responder({ status: "error", message: String(erro) });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responder({ status: "error", message: "Corpo da requisição vazio." });
    }
    const corpo = JSON.parse(e.postData.contents);
    const acao = String(corpo.action || "POST").toUpperCase();
    const aba = obterAba();
    if (acao === "POST") return cadastrarProduto(aba, corpo);
    if (acao === "PUT") return atualizarProduto(aba, corpo);
    if (acao === "DELETE") return excluirProduto(aba, corpo);
    return responder({ status: "error", message: "Ação não suportada." });
  } catch (erro) {
    return responder({ status: "error", message: String(erro) });
  }
}

function montarProduto(id, corpo) {
  return {
    id: id,
    nome: String(corpo.nome || "").trim(),
    preco: Number(corpo.preco) || 0,
    descricao: String(corpo.descricao || "").trim(),
    avatar: String(corpo.avatar || "").trim()
  };
}

function cadastrarProduto(aba, corpo) {
  const id = corpo.id ? String(corpo.id) : "prod_" + new Date().getTime();
  const produto = montarProduto(id, corpo);
  if (!produto.nome) return responder({ status: "error", message: "O nome é obrigatório." });
  aba.appendRow([produto.id, produto.nome, produto.preco, produto.descricao, produto.avatar]);
  return responder({ status: "success", message: "Produto cadastrado com sucesso.", data: produto });
}

function atualizarProduto(aba, corpo) {
  const id = String(corpo.id || "");
  const linha = localizarLinha(aba, id);
  if (linha === -1) return responder({ status: "error", message: "Produto não encontrado para atualização." });
  const produto = montarProduto(id, corpo);
  aba.getRange(linha, 1, 1, 5).setValues([[produto.id, produto.nome, produto.preco, produto.descricao, produto.avatar]]);
  return responder({ status: "success", message: "Produto atualizado com sucesso.", data: produto });
}

function excluirProduto(aba, corpo) {
  const id = String(corpo.id || "");
  const linha = localizarLinha(aba, id);
  if (linha === -1) return responder({ status: "error", message: "Produto não encontrado para exclusão." });
  aba.deleteRow(linha);
  return responder({ status: "success", message: "Produto excluído com sucesso.", data: { id: id } });
}

// OPCIONAL: rode esta função uma vez no editor para preencher a planilha com os 4 produtos do db.json
function popularExemplo() {
  const aba = obterAba();
  if (aba.getLastRow() > 1) return;
  const q = function (n) { return "?w=300&auto=format&fit=crop&q=80"; };
  aba.getRange(1, 1, 1, 5).setValues([CABECALHO]);
  aba.getRange(2, 1, 4, 5).setValues([
    ["1", "Headset Gamer Sem Fio", 299.9, "Áudio espacial 7.1, microfone com cancelamento de ruído e bateria de até 20 horas.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" + q()],
    ["2", "Teclado Mecânico RGB", 550, "Switches vermelhos táteis, layout compacto 60% e iluminação RGB customizável.", "https://images.unsplash.com/photo-1587829741301-dc798b83add3" + q()],
    ["3", "Smartwatch Fitness Branco", 189.5, "Monitoramento de frequência cardíaca, contador de passos e resistência à água 5ATM.", "https://images.unsplash.com/photo-1523275335684-37898b6baf30" + q()],
    ["5", "Mochila Notebook", 159.9, "Compartimento acolchoado até 15.6 polegadas, tecido impermeável e entrada USB externa.", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" + q()]
  ]);
}
