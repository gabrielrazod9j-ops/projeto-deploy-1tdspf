export const API_URL = import.meta.env.VITE_API_URL as string;

type Resposta<T> = { status: "success" | "error"; message?: string; data: T };

async function tratar<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
  const resultado: Resposta<T> = await response.json();
  if (resultado.status === "error") throw new Error(resultado.message);
  return resultado.data;
}

export async function listar<T>(): Promise<T> {
  return tratar<T>(await fetch(API_URL));
}

export async function buscar<T>(id: string): Promise<T> {
  return tratar<T>(await fetch(`${API_URL}?id=${encodeURIComponent(id)}`));
}

// Create / Update / Delete: sempre POST, com o campo "action" (limitação do Apps Script)
export async function enviar<T>(action: "POST" | "PUT" | "DELETE", corpo: object): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...corpo }),
  });
  return tratar<T>(response);
}
