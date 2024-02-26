import Image from "next/image";

export default function SelectCurrenciesButton({
  onOpen,
  currencies,
  payInfo,
}) {
  return (
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
        <Image
          src={
            currencies.find(({ symbol }) => symbol === payInfo.input_currency)
              ?.image
          }
          alt="first-currency-image"
          width={25}
          height={25}
          className={`group-hover:opacity-50 transition ${
            payInfo.input_currency ? "flex" : "hidden"
          }`}
        />
        <p className="text-gray-400 text-xs  group-hover:opacity-50 transition">
          {payInfo.input_currency || "Añade Moneda para el pago"}
        </p>
      </div>
      <i className="ri-arrow-down-s-line text-lg text-gray-400  group-hover:opacity-50 transition" />
    </button>
  );
}
