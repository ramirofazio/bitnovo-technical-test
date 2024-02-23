import { Button, Image } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";
import { useSendTransaction } from "wagmi";

export const WalletConnectBtn = ({ address, amount }) => {
  const { data: hash, sendTransaction } = useSendTransaction();

  const handlePayOrder = () => {
    sendTransaction({ to: address, value: parseEther(String(amount)) });
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const ready = mounted !== "loading";
        const connected = ready && account && chain;

        return (
          <div className={`${!connected && "icons"}`}>
            {(() => {
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
                <section className="grid place-items-center gap-3">
                  {hash}
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
                </section>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
