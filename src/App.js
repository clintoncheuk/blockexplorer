import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.scss";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  let lastRequest;
  const [address, setAddress] = useState("");
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const delaySetAddress = (value) => {
    if (lastRequest) {
      window.clearTimeout(lastRequest);
    }
    lastRequest = setTimeout(() => {
      setAddress(value);
    }, 500);
  };

  const viewInOpensea = (nft) => {
    window.open(
      `https://opensea.io/assets/ethereum/${nft.contract.address}/${nft.tokenId}`,
      "_blank"
    );
  };

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      alchemy.nft
        .getNftsForOwner(address, { excludeFilters: "SPAM" })
        .then((result) => setNFTs(result.ownedNfts))
        .catch((e) => setNFTs([]))
        .finally(() => setIsLoading(false));
    }
  }, [address]);

  return (
    <div className="App">
      <div className="header">
        <h1>NFTs Explorer</h1>
        <input
          type="text"
          onChange={(e) => delaySetAddress(e.target.value)}
          placeholder="ETH Address / ENS"
          autoFocus={true}
        />
      </div>

      <div className="container">
        {nfts
          .filter((x) => x.media[0] && x.media[0].thumbnail)
          .map((x) => {
            return (
              <div
                key={`${x.contract.address}_${x.tokenId}`}
                className="nft"
                onClick={() => viewInOpensea(x)}
              >
                <img src={x.media[0].thumbnail}></img>
                <div className="name">{x.title}</div>
                <div className="description">{x.description}</div>
              </div>
            );
          })}

        {!isLoading && address && nfts.length === 0 && (
          <div className="message">No NFT found for this address!</div>
        )}

        {isLoading && <div className="message">Loading...</div>}
      </div>
    </div>
  );
}

export default App;
