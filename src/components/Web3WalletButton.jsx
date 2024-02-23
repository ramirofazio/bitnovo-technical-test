import { Button, Image } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

export const Web3WalletButton = ({
  address,
  amount,
  setWeb3PaymentInProcess,
}) => {
  const { data: hash, isPending, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayOrder = () => {
    sendTransaction({ to: address, value: parseEther(String(amount)) });
  };

  useEffect(() => {
    setWeb3PaymentInProcess(isConfirming || isPending);
    console.log(hash);
  }, [isConfirming || isPending]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const ready = mounted !== "loading";
        const connected = ready && account && chain;

        return (
          <section className={`${!connected && "icons"}`}>
            {(() => {
              if (isPending || isConfirming) {
                return (
                  <div className="grid place-items-center p-3 text-center gap-4">
                    <p className="font-bold">El pago se esta procesando...</p>
                    <Image
                      src="/metamask.png"
                      alt="metamask"
                      width={60}
                      height={60}
                      className="animate-spinner-ease-spin"
                    />
                  </div>
                );
              }

              if (!connected) {
                return (
                  <Image
                    src="/metamask.png"
                    alt="metamask"
                    width={120}
                    height={120}
                    className="drop-shadow-2xl"
                    onClick={openConnectModal}
                  />
                );
              }

              return (
                <div className="grid place-items-center gap-3">
                  <p className="font-bold">
                    ~{Number(account.balanceFormatted).toFixed(4)}{" "}
                    {account.balanceSymbol}
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={openAccountModal}
                      isIconOnly
                      className="bg-blue-500 text-white"
                    >
                      <i className="ri-logout-circle-line text-lg" />
                    </Button>
                    <Button
                      onClick={handlePayOrder}
                      isIconOnly
                      className="bg-blue-500 text-white"
                    >
                      <i className="ri-send-plane-2-line text-lg" />
                    </Button>
                  </div>
                </div>
              );
            })()}
          </section>
        );
      }}
    </ConnectButton.Custom>
  );
};
