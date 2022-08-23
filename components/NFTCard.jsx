import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const NFTCard = ({ title, media, id, contract }) => (
  <article className="flex flex-col bg-gray-200 py-6">
    <img
      src={media[0].gateway}
      style={{ background: "gray", width: "250px", height: "250px" }}
    />
    <header>{title}</header>
    <div>{id.tokenId.substr(id.tokenId.length - 4)}</div>
    <CopyToClipboard text={contract.address}>
      <div
        className="cursor-pointer flex justify-center"
        title="copy to clipboard"
      >
        {`${contract.address.substr(0, 5)}...${contract.address.substr(
          contract.address.length - 4
        )}`}
        <div className="ml-4 w-4 h-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M384 112v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h80c0-35.29 28.71-64 64-64s64 28.71 64 64h80c26.51 0 48 21.49 48 48zM192 40c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24m96 114v-20a6 6 0 0 0-6-6H102a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z" />
          </svg>
        </div>
      </div>
    </CopyToClipboard>
    <a
      target="_blank"
      href={`https://etherscan.io/address/${contract.address}`}
      className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      View on etherscan
    </a>
  </article>
);
