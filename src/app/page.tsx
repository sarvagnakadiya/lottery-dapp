/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import contractABI from "@/Lottery.json";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useWriteContract } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { holesky } from "@wagmi/core/chains";
import { config } from "@/app/hooks/config";
import { getContract } from "viem";
import md5 from "crypto-js/md5";

const contractAddress = "0x8C4dbEdce540F7663b8BeB4a0d7EB40c123B0663";

const client = getPublicClient(config, {
  chainId: holesky.id,
});

export default function Home() {
  const [participants, setParticipants] = useState([]);
  const { writeContractAsync } = useWriteContract();
  const { address, isConnected } = useAccount();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showingWinners, setShowingWinners] = useState(false);

  // Handle participate button click
  const handleParticipate = async () => {
    setIsParticipating(true);
    console.log("hello");
    console.log(address);
    try {
      console.log("hehe");
      const tx = await writeContractAsync({
        address: contractAddress,
        account: address,
        abi: contractABI.abi,
        functionName: "participate",
        value: BigInt("15000000000000"),
      });
      console.log(tx);
      const receipt = await client.waitForTransactionReceipt({ hash: tx });
      console.log(receipt);

      if (receipt) {
        setIsParticipating(false);
        window.location.reload();
      }
    } catch (error) {
      console.log("Error participating:", error);
    } finally {
      setIsParticipating(false);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const contract = getContract({
          address: contractAddress,
          abi: contractABI.abi,
          client: client,
        });
        let data = await contract.read.getParticipants();
        console.log(data);
        if (Array.isArray(data) && data.length === 0) {
          console.log("no participants found, winners shown");
          data = await contract.read.getWinners();
          setShowingWinners(true);
        } else {
          setShowingWinners(false);
        }
        setParticipants(data as any);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
          Lottery DApp
        </h1>
        <p className="text-xl font-medium text-center text-gray-700 mb-6">
          Participate in the lottery by staking just 0.000015 ETH!
        </p>
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {!isLoading && (
          <>
            <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {showingWinners ? "Previous Lottery Winners" : "Participants"}
              </h2>
              {participants.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {participants.map((participant, index) => (
                    <li
                      key={index}
                      className="text-gray-600 bg-white p-2 rounded-lg shadow-sm flex items-center"
                    >
                      <img
                        src={`https://www.gravatar.com/avatar/${md5(
                          participant
                        ).toString()}?d=identicon`}
                        alt={`Avatar of ${participant}`}
                        className="w-10 h-10 mr-4 rounded-full"
                      />
                      {participant}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No participants found.</p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => handleParticipate()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {isParticipating ? "Participating..." : "Participate"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
