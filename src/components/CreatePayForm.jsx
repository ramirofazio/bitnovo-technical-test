import { useState } from "react";
import { useDisclosure, Button } from "@nextui-org/react";
import { toast } from "sonner";
import SelectCurrenciesModal from "./SelectCurrenciesModal";

export function CreatePayForm({ currencies }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [payInfo, setPayInfo] = useState({
    amount: "",
    currency: currencies[0].name,
    concept: "",
  });

  const handleSelectCurrencies = (event) => {
    event.preventDefault();
    onOpen();
  };

  return (
    <>
      <SelectCurrenciesModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        currencies={currencies}
        payInfo={payInfo}
        setPayInfo={setPayInfo}
      />
      <form className="flex flex-col w-[30vw] gap-4">
        <div className="flex flex-col gap-2">
          <label>Importe a pagar</label>
          <input
            placeholder="Añade importe a pagar"
            type="number"
            onChange={(event) =>
              setPayInfo({ ...payInfo, amount: event.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>
            Seleccione moneda{" "}
            <i
              className="ri-error-warning-line text-gray-400 icons"
              onClick={() =>
                toast.info(
                  "Seleccione la criptomoneda que quiera para crear el pago"
                )
              }
            />
          </label>
          <button
            className="border-2 border-gray-200 flex items-center justify-between group"
            onClick={handleSelectCurrencies}
          >
            <div className="flex items-center gap-2">
              <img
                src={currencies.find((c) => c.name === payInfo.currency).image}
                alt="first-currency-image"
                className="w-6 group-hover:opacity-50 transition"
              />
              <p className="text-black text-xs  group-hover:opacity-50 transition">
                {payInfo.currency}
              </p>
            </div>
            <i className="ri-arrow-down-s-line text-lg text-gray-400  group-hover:opacity-50 transition" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label>Concepto</label>
          <input
            placeholder="Añade descripción del pago"
            onChange={(event) =>
              setPayInfo({ ...payInfo, concept: event.target.value })
            }
          />
        </div>
        <Button
          className="bg-blue-600 mt-2 py-3 rounded-md text-white"
          isDisabled={!payInfo.amount || !payInfo.concept} //todo Poner validacion de ZOD libreria
        >
          Continuar
        </Button>
      </form>
    </>
  );
}
