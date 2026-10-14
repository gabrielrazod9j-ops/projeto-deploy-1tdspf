import { useState } from "react";
import { useNavigate } from "react-router";
import { enviar } from "../../services/api";
import type { TipoProduto } from "../../types/types";

export default function CadastrarProdutos() {
  // Para alterar o título da página:
  document.title = "Cadastrar Produtos";

  const navigate = useNavigate();

  const [produto, setProduto] = useState<TipoProduto>({ id: "", nome: "", preco: 0, descricao: "", avatar: "" });

  const handleCadastro = async () => {
    if (!produto.nome.trim()) {
      alert("O nome é obrigatório.");
      return;
    }
    try {
      await enviar("POST", produto);
      alert("Produto cadastrado com sucesso!");
      navigate("/produtos");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar o produto.");
    }
  };

  return (
    <main>
      <h2>Cadastrar Produtos</h2>
      <div>
        <form>
          <fieldset>
            <legend>Dados do produto:</legend>
            <div>
              <label htmlFor="nome">Nome do produto </label>
              <input type="text" name="nome" id="nome" value={produto.nome} onChange={(e) => setProduto({ ...produto, nome: e.target.value })} />
            </div>
            <div>
              <label htmlFor="preco">Preço do produto </label>
              <input type="number" step={0.1} name="preco" id="preco" value={produto.preco} onChange={(e) => setProduto({ ...produto, preco: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label htmlFor="descricao">Descrição do produto </label>
              <input type="text" name="descricao" id="descricao" value={produto.descricao} onChange={(e) => setProduto({ ...produto, descricao: e.target.value })} />
            </div>
            <div>
              <label htmlFor="avatar">URL da imagem do produto </label>
              <input type="url" name="avatar" id="avatar" value={produto.avatar} onChange={(e) => setProduto({ ...produto, avatar: e.target.value })} />
            </div>
            {produto.avatar && (
              <figure>
                <img src={produto.avatar} alt={produto.nome} width={100} />
              </figure>
            )}
            <div>
              <button type="button" onClick={() => handleCadastro()}>CADASTRAR</button>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  );
}
