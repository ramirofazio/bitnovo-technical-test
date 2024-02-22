import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

export const checkValidCurrency = (amount, min_amount, max_amount) => {
  if (
    Number(amount) >= Number(min_amount) &&
    Number(amount) <= Number(max_amount)
  ) {
    return true;
  } else {
    return false;
  }
};

export default function SelectCurrenciesModal({
  isOpen,
  onOpenChange,
  currencies,
  payInfo,
  setPayInfo,
}) {
  const [thisCurrencies, setThisCurrencies] = useState([]);

  const handleSearch = useDebouncedCallback(({ target: { value } }) => {
    const searchCurrencies = currencies.filter(
      ({ name, min_amount, max_amount }) => {
        if (
          checkValidCurrency(
            payInfo.expected_output_amount,
            min_amount,
            max_amount
          )
        ) {
          return name.toLowerCase().includes(value.toLowerCase());
        }
      }
    );

    setThisCurrencies(searchCurrencies);
  }, 200);

  useEffect(() => {
    const validCurrencies = currencies.filter((coin) => {
      if (
        checkValidCurrency(
          payInfo.expected_output_amount,
          coin.min_amount,
          coin.max_amount
        )
      ) {
        return coin;
      }
    });

    setThisCurrencies(validCurrencies);
  }, [isOpen, currencies]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      backdrop="transparent"
      hideCloseButton
      className="min-h-[70vh]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between">
              <h1>Seleccionar criptomoneda</h1>
              <i
                className="ri-close-line text-2xl font-thin icons"
                onClick={onClose}
              />
            </ModalHeader>
            <ModalBody>
              <section className="relative flex items-center">
                <i className="ri-search-line text-xl text-gray-400 absolute left-4" />
                <input
                  placeholder="Buscar"
                  className="w-full pl-10"
                  onChange={(event) => handleSearch(event)}
                />
              </section>
              <section className="py-4 gap-2 grid place-items-start">
                {!thisCurrencies.length && (
                  <>
                    <i className="ri-error-warning-line mx-auto text-3xl text-red-500" />
                    <p className="text-sm text-center mx-20">
                      No se ha encontrado ninguna criptomoneda que coincida con
                      los parámetros seleccionados.
                    </p>
                  </>
                )}
                {thisCurrencies.map(({ name, symbol, image }) => (
                  <article
                    key={symbol}
                    className="w-full p-2 rounded-md gap-3 h-18 flex items-center justify-between hover:bg-gray-200 transition hover:cursor-pointer"
                    onClick={() => {
                      setPayInfo({ ...payInfo, input_currency: symbol });
                      onClose();
                    }}
                  >
                    <div className="flex gap-3">
                      <img src={image} alt={name} className="w-10 h-10" />
                      <div className="flex flex-col">
                        <strong className="text-sm tracking-wide font-semibold">
                          {name}
                        </strong>
                        <p className="text-gray-400">{symbol}</p>
                      </div>
                    </div>
                    <i
                      className={`ri-${
                        payInfo.input_currency === symbol
                          ? "checkbox-circle-fill !text-blue-500"
                          : "arrow-right-s-line"
                      } text-xl text-gray-400 font-thin`}
                    />
                  </article>
                ))}
              </section>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
