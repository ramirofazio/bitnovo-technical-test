import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

export default function SelectCurrenciesModal({
  isOpen,
  onOpenChange,
  currencies,
  payInfo,
  setPayInfo,
}) {
  const [thisCurrencies, setThisCurrencies] = useState(currencies);

  const handleClick = (currencyName, onClose) => {
    setPayInfo({ ...payInfo, currency: currencyName });
    toast.success(`${currencyName} seleccionado`);
    onClose();
  };

  const handleSearch = useDebouncedCallback((event) => {
    let searchCurrencies = currencies.filter((c) =>
      c.name.toLowerCase().includes(event.target.value.toLowerCase())
    );

    if (!searchCurrencies.length) {
      searchCurrencies = currencies;
      toast.error(
        "No se ha encontrado ninguna criptomoneda que coincida con los parámetros de búsqueda"
      );
    }

    setThisCurrencies(searchCurrencies);
  }, 200);

  useEffect(() => {
    if (!isOpen) {
      setThisCurrencies(currencies);
    }
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
                {thisCurrencies.map(({ name, symbol, image }) => (
                  <article
                    key={symbol}
                    className="w-full p-2 rounded-md gap-3 h-18 flex items-center justify-between hover:bg-gray-200 transition hover:cursor-pointer"
                    onClick={() => handleClick(name, onClose)}
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
                        payInfo.currency === name
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
