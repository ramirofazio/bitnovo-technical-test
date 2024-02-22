import { useEffect, useState } from "react";
import { useDisclosure, Button } from "@nextui-org/react";
import { toast } from "sonner";
import SelectCurrenciesModal, {
  checkValidCurrency,
} from "./SelectCurrenciesModal";
import { CreatePay } from "@/api";
import { useRouter } from "next/router";

export function CreatePayForm({ currencies }) {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [payInfo, setPayInfo] = useState({
    expected_output_amount: "",
    input_currency: "",
    notes: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await CreatePay({
        ...payInfo,
        expected_output_amount: Number(payInfo.expected_output_amount),
      });

      if (res.status === 200) {
        toast.success("Pago creado con exito");
        router.push(`/payment/${res.data.identifier}`);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (payInfo.input_currency) {
      const { min_amount, max_amount } = currencies.find(
        ({ symbol }) => symbol === payInfo.input_currency
      );

      if (
        !checkValidCurrency(
          payInfo.expected_output_amount,
          min_amount,
          max_amount
        )
      ) {
        setPayInfo({ ...payInfo, input_currency: "" });
        toast.warning(
          "El importe excede los limites de la criptomoneda seleccionada"
        );
      }
    }
  }, [payInfo.expected_output_amount]);

  return (
    <>
      <SelectCurrenciesModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        currencies={currencies}
        payInfo={payInfo}
        setPayInfo={setPayInfo}
      />
      <form className="flex flex-col w-[30vw] gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label>Importe a pagar</label>
          <input
            placeholder="Añade importe a pagar"
            type="number"
            onChange={(event) =>
              setPayInfo({
                ...payInfo,
                expected_output_amount: event.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>
            Seleccione moneda{" "}
            <i
              className="ri-error-warning-line text-gray-400 icons"
              onClick={() =>
                toast.info("Primero seleccione un importe a pagar.")
              }
            />
          </label>
          <button
            className={`${
              !payInfo.expected_output_amount && "pointer-events-none"
            } border-2 border-gray-200 flex items-center justify-between group`}
            onClick={(event) => {
              event.preventDefault();
              onOpen();
            }}
            disabled={!payInfo.expected_output_amount}
          >
            <div className="flex items-center gap-2">
              <img
                src={
                  currencies.find(
                    (coin) => coin.symbol === payInfo.input_currency
                  )?.image
                }
                alt="first-currency-image"
                className={`w-6 group-hover:opacity-50 transition ${
                  payInfo.input_currency ? "flex" : "hidden"
                }`}
              />
              <p className="text-gray-400 text-xs  group-hover:opacity-50 transition">
                {payInfo.input_currency || "Añade Moneda para el pago"}
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
              setPayInfo({ ...payInfo, notes: event.target.value })
            }
          />
        </div>
        <Button
          type="submit"
          isLoading={loading}
          className="bg-blue-600 mt-2 py-3 rounded-md text-white"
          isDisabled={
            !payInfo.expected_output_amount ||
            !payInfo.notes ||
            !payInfo.input_currency
          }
        >
          Continuar
        </Button>
      </form>
    </>
  );
}
