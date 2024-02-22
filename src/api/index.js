import axios from "axios";

const API = axios.create({
  baseURL: "https://payments.pre-bnvo.com/api/v1",
  headers: { "x-device-id": "5a796ad0-a4c0-4902-aa4c-40a25c888546" },
});

export async function getCurrencies() {
  const res = (await API.get("/currencies")).data;
  return res;
}

export async function CreatePay({ currency, concept, amount }) {
  const cleanData = {
    input_currency: currency,
    notes: concept,
    expected_output_amount: Number(amount),
  };

  await API.post("/orders/", cleanData).data;

  //! ESTO ANDA
}
