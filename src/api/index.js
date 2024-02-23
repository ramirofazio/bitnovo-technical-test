import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: { "x-device-id": process.env.NEXT_PUBLIC_DEVICE_ID },
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
