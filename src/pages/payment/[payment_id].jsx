import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrencies, getOrderInfo } from "@/api";
import { toast } from "sonner";
import AnimatedContainer from "@/components/layouts/AnimatedContainer";
import OrderResume from "@/components/OrderResume";
import Payment from "@/components/Payment";

export default function Page({ orderInfo, currencies, payment_uri }) {
  const router = useRouter();

  const [thisOrderInfo, setThisOrderInfo] = useState(orderInfo);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (thisOrderInfo) {
      if (thisOrderInfo.status === "EX" || thisOrderInfo.status === "OC") {
        router.replace("/timeout");
      }
    }
  }, [thisOrderInfo]);

  console.log(thisOrderInfo);

  useEffect(() => {
    if (router.query.payment_id) {
      const socket = new WebSocket(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/${router.query.payment_id}`
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

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [router.query.payment_id]);

  return (
    <AnimatedContainer className="grid xl:grid-cols-2 xl:grid-rows-3 gap-10 p-4 place-items-start">
      <OrderResume thisOrderInfo={thisOrderInfo} currencies={currencies} />
      <Payment thisOrderInfo={thisOrderInfo} payment_uri={payment_uri} />
    </AnimatedContainer>
  );
}

export async function getServerSideProps(context) {
  const { payment_id, payment_uri } = context.query;
  const orderInfo = await getOrderInfo(payment_id);
  const currencies = await getCurrencies();

  return { props: { orderInfo, currencies, payment_uri } };
}
