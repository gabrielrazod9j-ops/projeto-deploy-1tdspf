import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { buscar, enviar } from "../../services/api";
import type { TipoProduto } from "../../types/types";

export default function EditarProdutos() {
  // Para alterar o título da página:
  document.title = "Editar Produtos";

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [produto, setProduto] = useState<TipoProduto>({ id: "", nome: "", preco: 0, descricao: "", avatar: "" });

  useEffect(() => {

    const carregaProduto = async () => {

      try {
        const data = await buscar<TipoProduto>(id!);
        setProduto(data);

      } catch (error) {
        console.error(error);
      }
    };

    carregaProduto();

  }, [id]);

  const handleUpdate = async () => {
    try {

      await enviar("PUT", produto);

      //SUCESSO
      alert("Produto atualizado com sucesso!");
      //REDIRECT
      navigate("/produtos");

    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o produto.");
    }
  }

  return (
    <main>
      <h2>Editar Produtos</h2>
      <h1>{id}</h1>
      <h1>{id}</h1>
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
              <label htmlFor="avatar">Avatar do produto </label>
              <figure>
                <img src={produto.avatar} alt={produto.nome} />
              </figure>
            </div>
            <div>
              <button type="button" onClick={() => handleUpdate()}>ATUALIZAR</button>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  );
}
