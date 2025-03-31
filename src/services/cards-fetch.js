import { apiConfig } from "./api-config.js";

export async function cardsFetch(id) {
  try {
    const response = await fetch(`${apiConfig.baseURL}/clients`);

    const responseData = await response.json();

    const cardSelected = responseData.filter((card) => card.id === id);
    console.log("Cartao do cliente: ", cardSelected[0]);
    return cardSelected[0];
  } catch (error) {
    console.log(error);
    alert("Não foi possível buscar os agendamentos do dia selecionado.");
  }
}
