import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  return (
    <AnimatePresence>
      <motion.section
        key="timeout-section"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.4 }}
        className="shadow-center  rounded-md flex flex-col items-center justify-start p-6 gap-4 py-10 w-[30vw]"
      >
        <div className="grid place-content-center rounded-full p-4 bg-red-300 w-14 h-14">
          <i className="ri-close-fill text-3xl font-bold text-red-600" />
        </div>
        <h1 className="font-bold text-xl">¡Pago cancelado!</h1>
        <p className="w-[70%] font-semibold text-gray-400 text-center">
          Lorem ipsum dolor sit amet consectetur. Laoreet blandit auctor et
          varius dolor elit facilisi enim. Nulla ut ut eu nunc.
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
      </motion.section>
    </AnimatePresence>
  );
}
