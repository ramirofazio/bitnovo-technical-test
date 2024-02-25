import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CreatePay } from "@/api";
import SelectCurrenciesModal, {
  checkValidCurrency,
} from "./SelectCurrenciesModal";
import SelectCurrenciesButton from "./SelectCurrencyButton";
import { useDisclosure, Button, Tooltip } from "@nextui-org/react";
import { toast } from "sonner";

export function CreatePayForm({ currencies }) {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [payInfo, setPayInfo] = useState({
    expected_output_amount: "",
    input_currency: "",
    notes: "",
  });

  useEffect(() => {
    //? Valido cuando cambia el monto y esta seleccionada una criptomoneda que el
    //? monto no exceda los limites de la criptomoneda seleccionada
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

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await CreatePay({
        ...payInfo,
        //? Convierto el monto a `Number` para que lo acepte la API
        expected_output_amount: Number(payInfo.expected_output_amount),
      });

      if (res.status === 200) {
        router.push(
          `/payment/${res.data.identifier}?payment_uri=${res.data.payment_uri}`
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setPayInfo({
      ...payInfo,
      [name]: value,
    });
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
      <form
        className="flex flex-col min-w-[30vw] gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label>Importe a pagar</label>
          <input
            placeholder="Añade importe a pagar"
            name="expected_output_amount"
            value={payInfo.expected_output_amount}
            type="number"
            onChange={handleOnChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>
            Seleccione moneda{" "}
            <Tooltip
              content="Seleccione la criptomoneda con la cual vas a hacer el pago."
              offset={7}
              placement="right"
            >
              <i className="ri-error-warning-line text-gray-400 icons" />
            </Tooltip>
          </label>
          <SelectCurrenciesButton
            payInfo={payInfo}
            currencies={currencies}
            onOpen={onOpen}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Concepto</label>
          <input
            placeholder="Añade descripción del pago"
            maxLength={40}
            name="notes"
            value={payInfo.notes}
            onChange={handleOnChange}
          />
        </div>
        <Button
          type="submit"
          isLoading={loading}
          className="custom-btn mt-2 py-3"
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
