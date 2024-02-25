import { AnimatePresence, motion } from "framer-motion";
import { Button, Tooltip } from "@nextui-org/react";
import { formatTime } from "@/utils";
import { CopyIcon } from "@/components";
import QRCode from "react-qr-code";
import { Web3WalletButton } from "@/components/Web3WalletButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Payment({ payment_uri, thisOrderInfo }) {
  const router = useRouter();

  const [selectedBtn, setSelectedBtn] = useState("qr");
  const [web3PaymentInProcess, setWeb3PaymentInProcess] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);

  useEffect(() => {
    const calculateExpiration = () => {
      const currentTime = new Date().getTime();
      const expiration = new Date(thisOrderInfo.expired_time).getTime();
      const remainingTime = expiration - currentTime;
      setExpirationTime(Math.max(remainingTime, 0));
    };

    calculateExpiration();

    setInterval(calculateExpiration, 1000);

    return () => {
      clearInterval();
    };
  }, []);

  useEffect(() => {
    if (expirationTime === 0) {
      router.replace("/timeout");
    }
  }, [expirationTime]);

  return (
    <article className="row-span-3 w-full gap-4 grid">
      <h1 className="font-bold">Realizar el pago</h1>
      <section className="rounded-xl  grid gap-6 p-4 min-w-[30vw] shadow-center place-items-center">
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
            isDisabled={web3PaymentInProcess}
            onClick={() => setSelectedBtn("qr")}
          >
            Smart QR
          </Button>
          <Tooltip
            content="Web3 solo para pagos con red Goerli."
            offset={7}
            placement="right"
            hidden={
              thisOrderInfo.currency_id === "ETH_TEST3" ||
              thisOrderInfo.currency_id === "USDC_TEST3"
                ? true
                : false
            }
          >
            <Button
              className={`rounded-full h-8 ${
                selectedBtn === "web3"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100"
              }`}
              isDisabled={web3PaymentInProcess}
              onClick={() =>
                thisOrderInfo.currency_id === "ETH_TEST3" ||
                thisOrderInfo.currency_id === "USDC_TEST3"
                  ? setSelectedBtn("web3")
                  : null
              }
            >
              Web 3
            </Button>
          </Tooltip>
        </div>

        <div className="shadow-xl relative overflow-hidden p-4 rounded-xl h-40 w-40 grid place-content-center">
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
                <Web3WalletButton
                  address={thisOrderInfo.address}
                  amount={
                    thisOrderInfo.crypto_amount - thisOrderInfo.confirmed_amount
                  }
                  setWeb3PaymentInProcess={setWeb3PaymentInProcess}
                  web3PaymentInProcess={web3PaymentInProcess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid place-items-center gap-1">
          <p className="gap-2 flex items-center">
            Enviar
            <strong>
              {thisOrderInfo.crypto_amount - thisOrderInfo.confirmed_amount}{" "}
              {thisOrderInfo.currency_id.split("_")[0]}
            </strong>
            <CopyIcon
              copyValue={
                thisOrderInfo.crypto_amount - thisOrderInfo.confirmed_amount
              }
            />
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
  );
}
