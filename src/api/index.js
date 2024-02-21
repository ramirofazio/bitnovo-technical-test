const BASE_HEADERS = { "x-device-id": process.env.DEVICE_ID };

export async function getCurrencies() {
  const res = await fetch(`${process.env.BASE_API_URL}/currencies`, {
    headers: BASE_HEADERS,
  });
  const currencies = await res.json();
  return currencies;
}
