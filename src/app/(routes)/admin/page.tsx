"use client";
import { useEffect, useState } from "react";
import contractABI from "@/Lottery.json";
import { useAccount, useWriteContract } from "wagmi";
import { getContract } from "viem";
import { CONTRACT_ADDRESS } from "@/app/constants";
import { initializeClient } from "@/app/utils/publicClient";

const client = initializeClient();

export default function Home() {
  const { writeContractAsync } = useWriteContract();
  const { address, isConnected } = useAccount();
  const [inputNumber, setInputNumber] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);

  // Fetch participants and count them
  useEffect(() => {
    const getDetails = async () => {
      try {
        const contract = getContract({
          address: CONTRACT_ADDRESS,
          abi: contractABI.abi,
          client: client,
        });
        let data = await contract.read.getParticipants();
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

  // Count participants
  const participantCount = participants.length;

  // Handle participate button click
  const handleDeclareWinner = async () => {
    if (!isConnected) {
      alert("Please connect your account to participate.");
      return;
    }

    console.log("hello");
    if (!inputNumber) {
      alert("Please enter the number of winners.");
      return;
    }
    if (parseInt(inputNumber) > participantCount) {
      alert("Number of winners cannot exceed the number of participants.");
      return;
    }
    try {
      setIsParticipating(true);
      console.log("hehe");
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        account: address,
        abi: contractABI.abi,
        functionName: "pickWinners",
        args: [inputNumber],
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Lottery DApp Admin Page
        </h1>
        <p className="text-xl font-medium text-center text-gray-700 mb-6">
          Declare winners by entering the number of winners.
        </p>
        {isLoading && (
          <p className="text-center text-gray-500">Loading participants...</p>
        )}

        {!isLoading && (
          <>
            <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Participants ({participantCount})
              </h2>
              {participants.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {participants.map((participant, index) => (
                    <li
                      key={index}
                      className="text-gray-600 bg-white p-2 rounded-lg shadow-sm"
                    >
                      {participant}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No participants found.</p>
              )}
              <div className="mt-4 flex items-center justify-center">
                <input
                  type="number"
                  className="border border-gray-300 rounded px-3 py-2 w-40 text-gray-800"
                  placeholder="No of winners"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value)}
                  max={participantCount}
                />
                <button
                  onClick={() => handleDeclareWinner()}
                  className="ml-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isParticipating ? "Declaring..." : "Declare"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
