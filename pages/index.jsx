import { useState } from "react";
import Head from "next/head";
import { NFTCard } from "../components/NFTCard";

const apiKey = process.env.NEXT_PUBLIC_NFT_API_KEY;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`;

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [isFetchByCollection, setIsFetchByCollection] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [pageKey, setPageKey] = useState("");
  const isDisabled = !collectionAddress && !walletAddress;

  const loadMoreFromCollection = async () => {
    await fetchByCollection(true);
  };

  const loadMoreFromWallet = async () => {
    await fetchFromWallet(true);
  };

  const fetchByCollection = async (fromToken = false) => {
    const requestOptions = {
      method: "GET",
    };
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection/`;
    const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${"true"}${
      fromToken ? `&startToken=${nextPageToken}` : ""
    }`;

    const result = await fetch(fetchURL, requestOptions).then((data) =>
      data.json()
    );
    const { nfts = [], nextToken = "" } = result || {};

    setNFTs(fromToken ? [...NFTs, ...nfts] : nfts);
    setNextPageToken(nextToken);
  };

  const fetchFromWallet = async (fromPageKey = false) => {
    const requestOptions = {
      method: "GET",
    };
    const fetchWalletURL =
      !collectionAddress &&
      walletAddress &&
      `${baseURL}?owner=${walletAddress}${
        fromPageKey ? `&pageKey=${pageKey}` : ""
      }`;

    const fetchWithCollectionURL =
      collectionAddress &&
      walletAddress &&
      `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}${
        fromPageKey ? `&pageKey=${pageKey}` : ""
      }`;

    const fetchURL = fetchWalletURL || fetchWithCollectionURL;
    if (!fetchURL) {
      return;
    }
    const nfts = await fetch(fetchURL, requestOptions).then((data) =>
      data.json()
    );
    const { ownedNfts = [], pageKey: newPagekey = "" } = nfts || {};
    setNFTs(fromPageKey ? [...NFTs, ...ownedNfts] : ownedNfts);
    setPageKey(newPagekey);
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFetchByCollection && collectionAddress) {
      fetchByCollection();
      return;
    }
    fetchFromWallet();
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>NFT gallery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center text-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <label>
            Wallet address
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              maxLength={150}
              onChange={(e) => setWalletAddress(e.currentTarget.value)}
              value={walletAddress}
            />
          </label>
          <label>
            Collection address
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              maxLength={150}
              onChange={(e) => setCollectionAddress(e.currentTarget.value)}
              value={collectionAddress}
            />
          </label>
          <label>
            <input
              type="checkbox"
              name="byCollection"
              onChange={(e) => {
                setIsFetchByCollection(e.currentTarget.checked);
              }}
            />
            Fetch by collection
          </label>

          <button
            type="submit"
            disabled={isDisabled}
            className={`${
              isDisabled
                ? "bg-gray-300 hover:bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
            } text-white font-bold py-2 px-4 rounded `}
          >
            Let's go!
          </button>
        </form>
        <pre>sample address</pre>
        <code>wallet address: 0x9e076aCE1Fe609535a0396a0b45BFA8F948E14b7</code>
        <code>
          collection address: 0x1000b3bdc7faebb1ffff9ceb65e54b6360c2d99d
        </code>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          {NFTs.map((NFTData) => (
            <NFTCard key={NFTData.metadata.tokenID} {...NFTData} />
          ))}
        </div>

        {(nextPageToken || pageKey) && (
          <button
            onClick={
              nextPageToken ? loadMoreFromCollection : loadMoreFromWallet
            }
            className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold my-2 py-2 px-4 rounded"
          >
            Load More...
          </button>
        )}
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://github.com/jupadev/RTW3-NFT-collection"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github Repository
        </a>
      </footer>
    </div>
  );
};

export default Home;
