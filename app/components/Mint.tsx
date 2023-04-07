import { CONTRACT_ADDRESS } from "@/config/contract";
import metadata from "@/metadata/nft.json";
import {
  ThirdwebNftMedia,
  Web3Button,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { useState } from "react";

export default function Mint() {
  const [mintStatus, setMintStatus] = useState<boolean>(false);
  const address = useAddress();

  // Get the NFT collection using its contract address
  const nftCollection = useContract(
    CONTRACT_ADDRESS,
    "nft-collection"
  ).contract;

  const { data: ownedNFTs, isLoading } = useOwnedNFTs(nftCollection, address);

  return (
    <div>
      <h1>You won an NFT prize!</h1>
      <div className="my-2 flex justify-center">
        {!isLoading ? (
          <div>
            {ownedNFTs?.map((nft) => (
              <div key={nft.metadata.id.toString()}>
                <div className="card w-full h-48 bg-neutral text-neutral-content">
                  <figure>
                    <ThirdwebNftMedia metadata={nft.metadata} />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{nft.metadata.name}</h2>
                    <p>{nft.metadata.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {/* Here's where we put the next section (the mint button) */}
      </div>
      <Web3Button
        isDisabled={mintStatus || ownedNFTs!.length > 0}
        contractAddress={CONTRACT_ADDRESS}
        action={(contract) => {
          contract.erc721.mint(metadata);
        }}
        onSuccess={(result) => setMintStatus(true)}
        theme="dark"
      >
        {mintStatus || ownedNFTs!.length > 0 ? `Minted!` : `Claim your NFT!`}
      </Web3Button>
    </div>
  );
}