import { getTimeFromISO } from "@/utils";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function OrderResume({ thisOrderInfo, currencies }) {
  const [currencyImage, setCurrencyImage] = useState("");

  useEffect(() => {
    const { image } = currencies.find((c) => {
      if (c.symbol === thisOrderInfo.currency_id) {
        return c;
      }
    });

    setCurrencyImage(image);
  }, []);

  return (
    <article className="row-span-3 w-full gap-4 grid">
      <h1 className="font-bold">Resumen del pedido</h1>
      <section className="rounded-md bg-slate-100 grid shadow-sm gap-4 p-6 min-w-[30vw] text-sm font-semibold">
        <div className="flex justify-between">
          <h2>Importe</h2>
          <h2>
            {thisOrderInfo.fiat_amount} {thisOrderInfo.fiat}
          </h2>
        </div>
        <Divider />
        <div className="flex justify-between">
          <h2>Moneda seleccionada:</h2>
          <h2 className="flex items-center text-sm gap-2">
            <img loading="lazy" src={currencyImage} className="w-5 h-5" />
            {thisOrderInfo.currency_id.split("_")[0]}
          </h2>
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <h2>Comercio:</h2>
          <h2>
            <i className="ri-verified-badge-fill text-lg text-cyan-400" />{" "}
            {thisOrderInfo.merchant_device}
          </h2>
        </div>
        <div className="flex justify-between">
          <h2>Fecha:</h2>
          <h2>{getTimeFromISO(thisOrderInfo.created_at)}</h2>
        </div>
        <Divider />
        <div className="flex justify-between">
          <h2>Concepto</h2>
          <h2>{thisOrderInfo.notes}</h2>
        </div>
      </section>
    </article>
  );
}
