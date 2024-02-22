import { Suspense } from "react";
import { CreatePayForm } from "@/components";
import { getCurrencies } from "@/api";
import { motion } from "framer-motion";
import { sectionVariants } from "@/styles/framerConstants";

export async function getServerSideProps() {
  const currencies = await getCurrencies();

  return { props: { currencies } };
}

export default function Home({ currencies }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="shadow-center  rounded-md flex flex-col items-center justify-start p-8 gap-4 w-fit"
    >
      <h1 className="font-bold text-2xl">Crear pago</h1>
      {/*//todo ver de poner suspense con fallback */}
      <CreatePayForm currencies={currencies} />
    </motion.section>
  );
}
