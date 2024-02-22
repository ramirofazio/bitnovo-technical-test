import axios from "axios";

const API = axios.create({
  baseURL: "https://payments.pre-bnvo.com/api/v1",
  headers: { "x-device-id": "5a796ad0-a4c0-4902-aa4c-40a25c888546" },
});

export async function getCurrencies() {
  const res = await API.get("/currencies");
  return res.data;
}

export async function CreatePay(formData) {
  return await API.post("/orders/", formData);
}

export async function getOrderInfo(id) {
  const res = await API.get(`/orders/info/${id}`);
  return res.data[0];
}
