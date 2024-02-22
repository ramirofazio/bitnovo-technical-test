import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrencies, getOrderInfo } from "@/api";
import { AnimatePresence, motion } from "framer-motion";
import { sectionVariants } from "@/styles/framerConstants";
import { toast } from "sonner";
import { Button, ButtonGroup, Divider } from "@nextui-org/react";
import { getExpirationTime, getTimeFromISO } from "@/utils";
import Image from "next/image";
import { CopyIcon } from "@/components";

export default function PaymentGateway({ orderInfo, currencies }) {
  const router = useRouter();

  const [selectedBtn, setSelectedBtn] = useState("qr");
  const [currencyImage, setCurrencyImage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const { image } = currencies.find((c) => {
      if (c.symbol === orderInfo.currency_id) {
        return c;
      }
    });

    setCurrencyImage(image);

    if (router.query.payment_id) {
      const socket = new WebSocket(
        `wss://payments.pre-bnvo.com/ws/${router.query.payment_id}`
      );

      socket.onopen = () => {
        setSocket(socket);
        toast.info("WebSocket connected");
      };

      socket.onmessage = (event) => {
        //! Ver como handlear el evento del socket
        const data = JSON.parse(event.data);
        toast.info("WebSocket message received:", JSON.stringify(data));
      };

      socket.onclose = () => {
        toast.info("WebSocket disconnected");
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [router.query.payment_id]);

  return (
    <motion.main
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="grid xl:grid-cols-2 xl:grid-rows-3 gap-10 p-4 place-items-start"
    >
      <article className="row-span-3 w-full gap-4 grid">
        <h1 className="font-bold">Resumen del pedido</h1>
        <section className="rounded-md bg-slate-100 grid shadow-sm gap-4 p-6 min-w-[30vw] text-sm font-semibold">
          <div className="flex justify-between">
            <h2>Importe</h2>
            <h2>
              {orderInfo.fiat_amount} {orderInfo.fiat}
            </h2>
          </div>
          <Divider />
          <div className="flex justify-between">
            <h2>Moneda seleccionada:</h2>
            <h2 className="flex items-center text-sm gap-2">
              <img loading="lazy" src={currencyImage} className="w-5 h-5" />
              {orderInfo.currency_id.split("_")[0]}
            </h2>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h2>Comercio:</h2>
            <h2>
              <i className="ri-verified-badge-fill text-lg text-cyan-400" />{" "}
              {orderInfo.merchant_device}
            </h2>
          </div>
          <div className="flex justify-between">
            <h2>Fecha:</h2>
            <h2>{getTimeFromISO(orderInfo.created_at)}</h2>
          </div>
          <Divider />
          <div className="flex justify-between">
            <h2>Concepto</h2>
            <h2>{orderInfo.notes}</h2>
          </div>
        </section>
      </article>

      <article className="row-span-3 w-full gap-4 grid">
        <h1 className="font-bold">Realizar el pago</h1>
        <section className="rounded-md  grid gap-6 p-4 min-w-[30vw] shadow-center place-items-center">
          <div className="mx-auto gap-1 flex items-center">
            <i className="ri-timer-line text-xl" />
            <p className="text-xs font-bold">
              {/* //! HACER LOGICA PARA QUE VAYA CONTANDO */}
              {"05:08" || getExpirationTime(orderInfo.expired_time)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className={`rounded-full h-8 ${
                selectedBtn === "qr" ? "bg-blue-600 text-white" : "bg-slate-100"
              }`}
              onClick={() => setSelectedBtn("qr")}
            >
              Smart QR
            </Button>
            <Button
              className={`rounded-full h-8 ${
                selectedBtn === "web3"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100"
              }`}
              onClick={() => setSelectedBtn("web3")}
            >
              Web 3
            </Button>
          </div>

          <div className="shadow-center relative overflow-hidden p-4 rounded-xl h-40 w-40 grid place-content-center">
            <AnimatePresence>
              {selectedBtn === "qr" && (
                <motion.div
                  key="qr"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute flex items-center justify-center inset-0"
                >
                  <Image
                    src="/mock-qr.png"
                    alt="mock-qr"
                    width={120}
                    height={120}
                  />
                </motion.div>
              )}
              {selectedBtn === "web3" && (
                <motion.div
                  key="web3"
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute flex items-center justify-center inset-0"
                >
                  <Image
                    src="/metamask.png"
                    alt="metamask"
                    width={120}
                    height={120}
                    className="drop-shadow-2xl icons"
                    onClick={() => toast.info("Abrir metamask ...")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid place-items-center gap-1">
            <p className="gap-2 flex items-center">
              Enviar
              <strong>
                {parseFloat(orderInfo.crypto_amount).toFixed(2)}{" "}
                {orderInfo.currency_id.split("_")[0]}
              </strong>
              <CopyIcon
                copyValue={`${parseFloat(orderInfo.crypto_amount).toFixed(2)} ${
                  orderInfo.currency_id.split("_")[0]
                }`}
              />
            </p>
            <p className="gap-2 flex items-center">
              {orderInfo.address}
              <CopyIcon copyValue={orderInfo.address} />
            </p>
            <p className="gap-2 flex items-center">
              <i className="ri-information-fill  text-yellow-400 text-lg " />
              Etiqueta de destino: {orderInfo.tag_memo || 2557164061}
              <CopyIcon copyValue={orderInfo.tag_memo} />
            </p>
          </div>
        </section>
      </article>
    </motion.main>
  );
}

export async function getServerSideProps(context) {
  const { payment_id } = context.query;
  const orderInfo = await getOrderInfo(payment_id);
  const currencies = await getCurrencies();

  return { props: { orderInfo, currencies } };
}
