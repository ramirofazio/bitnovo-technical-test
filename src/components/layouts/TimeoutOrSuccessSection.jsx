import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";
import AnimatedContainer from "@/components/layouts/AnimatedContainer";

export default function TimeoutOrSuccessSection({ isSuccess }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  return (
    <AnimatedContainer className="shadow-center  rounded-md flex flex-col items-center justify-start p-6 gap-4 py-10 w-[30vw]">
      <div
        className={`grid place-content-center rounded-full p-4 ${
          isSuccess ? "bg-green-300" : "bg-red-300"
        } w-14 h-14`}
      >
        <i
          className={`${
            isSuccess ? "ri-check-fill" : "ri-close-fill"
          } text-3xl font-bold ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        />
      </div>
      <h1 className="font-bold text-xl">
        ¡Pago {isSuccess ? "completado" : "cancelado"}!
      </h1>
      <p className="w-[70%] font-semibold text-gray-400 text-center">
        Lorem ipsum dolor sit amet consectetur. Laoreet blandit auctor et varius
        dolor elit facilisi enim. Nulla ut ut eu nunc.
      </p>
      <Button
        className="bg-blue-700 mt-6 py-6 rounded-md text-white"
        isLoading={loading}
        onClick={() => {
          setLoading(true);
          router.replace("/");
        }}
      >
        Crear nuevo pago
      </Button>
    </AnimatedContainer>
  );
}
