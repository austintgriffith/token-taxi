import React from "react";
import DAIABI from "./daiabi";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Address, AddressInput, InputBase } from "~~/components/scaffold-eth";

const DAIADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const Home: NextPage = () => {
  //get account from useAccount from wagmi-sdk
  const { address } = useAccount();

  const { data: daiBalance, isLoading } = useContractRead({
    address: DAIADDRESS,
    abi: DAIABI,
    functionName: "balanceOf",
    args: [address],
  });

  const [toAddress, setToAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const { config } = usePrepareContractWrite({
    address: DAIADDRESS,
    abi: DAIABI,
    functionName: "transfer",
    args: [toAddress, ethers.utils.parseEther(amount || "0")],
  });
  const { writeAsync: doTransfer } = useContractWrite(config);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <Address address={address} />
        {isLoading ? (
          <div className="flex items-center justify-center flex-col">Loading...</div>
        ) : (
          <div className="flex items-center justify-center flex-col">
            <div className="stats shadow mt-8">
              <div className="stat">
                <div className="stat-value">{ethers.utils.formatEther(daiBalance || "0")}</div>
                <div className="stat-desc">DAI</div>
              </div>
            </div>

            <div className="card w-full bg-base-100 shadow-xl mt-8">
              <div className="card-body">
                <h2 className="card-title">Transfer</h2>
                <div className="p-8">
                  <AddressInput
                    value={toAddress}
                    placeholder="To Address"
                    onChange={v => {
                      setToAddress(v);
                    }}
                  />
                  <div className="mt-4">
                    <InputBase
                      placeholder="Amount"
                      value={amount}
                      onChange={v => {
                        //if (v) {
                        try {
                          if (!v) setAmount("");
                          else {
                            const parsed = parseFloat(v);
                            console.log("parsed", parsed);
                          }
                        } catch (e) {
                          console.log(e);
                        }
                        //}

                        setAmount(v);
                      }}
                    />
                  </div>
                </div>
                <div className="card-actions justify-end">
                  {amount && toAddress ? (
                    <button className="btn btn-primary" onClick={doTransfer}>
                      Send
                    </button>
                  ) : (
                    <button disabled={true} className="btn btn-primary">
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
