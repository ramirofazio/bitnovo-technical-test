import { CreatePayForm } from "@/components";
import { getCurrencies } from "@/api";
import AnimatedContainer from "@/components/layouts/AnimatedContainer";

export default function Page({ currencies }) {
  return (
    <AnimatedContainer className="shadow-center rounded-md flex flex-col items-center justify-start p-8 gap-4 w-fit">
      <h1 className="font-bold text-2xl">Crear pago</h1>
      <CreatePayForm currencies={currencies} />
    </AnimatedContainer>
  );
}

export async function getServerSideProps() {
  const currencies = await getCurrencies();

  return { props: { currencies } };
}
