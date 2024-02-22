import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrencies, getOrderInfo } from "@/api";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button, Divider } from "@nextui-org/react";
import { getTimeFromISO } from "@/utils";
import Image from "next/image";
import { CopyIcon } from "@/components";
import QRCode from "react-qr-code";

export default function PaymentGateway({ orderInfo, currencies, payment_uri }) {
  const router = useRouter();

  const [thisOrderInfo, setThisOrderInfo] = useState(orderInfo);
  const [selectedBtn, setSelectedBtn] = useState("qr");
  const [currencyImage, setCurrencyImage] = useState("");
  const [socket, setSocket] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);

  useEffect(() => {
    if (orderInfo.status === "EX" || orderInfo.status === "OC") {
      router.replace("/timeout");
    }
  }, [orderInfo]);

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
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        if (data.status === "CO" || data.status === "AC") {
          router.replace("/success");
        }
        if (data.status === "IA") {
          setThisOrderInfo(data);
          toast.info(
            `Monto insuficiente, por favor completa el pago. Montos recibidos: ${
              data.confirmed_amount
            } ${data.currency_id.split("_")[0]} `
          );
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };
    }

    const calculateExpiration = () => {
      const currentTime = new Date().getTime();
      const expiration = new Date(orderInfo.expired_time).getTime();
      const remainingTime = expiration - currentTime;
      setExpirationTime(Math.max(remainingTime, 0));
    };

    calculateExpiration();

    setInterval(calculateExpiration, 1000);

    return () => {
      clearInterval();
      if (socket) {
        socket.close();
      }
    };
  }, [router.query.payment_id]);

  useEffect(() => {
    if (expirationTime === 0) {
      router.replace("/timeout");
    }
  }, [expirationTime]);

  return (
    <motion.main
      key="payment-section"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.4 }}
      className="grid xl:grid-cols-2 xl:grid-rows-3 gap-10 p-4 place-items-start"
    >
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

      <article className="row-span-3 w-full gap-4 grid">
        <h1 className="font-bold">Realizar el pago</h1>
        <section className="rounded-md  grid gap-6 p-4 min-w-[30vw] shadow-center place-items-center">
          <div className="mx-auto gap-1 flex items-center">
            <i
              className={`ri-timer-line text-xl ${
                expirationTime < 180000 && "text-red-500 animate-bounce"
              }`}
            />
            <p
              className={`text-xs font-bold ${
                expirationTime < 180000 && "text-red-500"
              }`}
            >
              {formatTime(expirationTime)}
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
                  <QRCode size={120} value={payment_uri} />
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
                {parseFloat(
                  thisOrderInfo.crypto_amount - thisOrderInfo.confirmed_amount
                ).toFixed(4)}{" "}
                {thisOrderInfo.currency_id.split("_")[0]}
              </strong>
              <CopyIcon copyValue={thisOrderInfo.crypto_amount} />
            </p>
            <p className="gap-2 flex items-center">
              {thisOrderInfo.address}
              <CopyIcon copyValue={thisOrderInfo.address} />
            </p>
            {thisOrderInfo.tag_memo && (
              <p className="gap-2 flex items-center">
                <i className="ri-information-fill  text-yellow-400 text-lg " />
                Etiqueta de destino: {thisOrderInfo.tag_memo}
                <CopyIcon copyValue={thisOrderInfo.tag_memo} />
              </p>
            )}
          </div>
        </section>
      </article>
    </motion.main>
  );
}

export async function getServerSideProps(context) {
  const { payment_id, payment_uri } = context.query;
  const orderInfo = await getOrderInfo(payment_id);
  const currencies = await getCurrencies();

  return { props: { orderInfo, currencies, payment_uri } };
}

const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
