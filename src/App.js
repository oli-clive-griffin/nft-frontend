import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import nftService from "./service";
import miningGif from "./assets/mining.gif"

const TWITTER_HANDLE = 'oli_c_g';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

var parser = new DOMParser();

const App = () => {
  const [mining, setMining] = useState(false);

  const [numMinted, setNumMinted] = useState();

  const [currentAccount, setCurrentAccount] = useState("");

  const [svg, setSvg] = useState();

  const [url, setUrl] = useState();
  
  const listenerCallback = (newNumMinted, newSvg, url) => {
    setSvg(newSvg);
    setNumMinted(newNumMinted);
    setUrl(url);
  };  
  
  const handleClickMint = async () => {
    setMining(true);
    await nftService.askContractToMintNft();
    setMining(false);
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log('asdf')
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);

      nftService.setupEventListener(listenerCallback);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]); 

      nftService.setupEventListener(listenerCallback);
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const fetchNumNFTsMinted = async () => {
      const num = await nftService.getNumMinted();
      setNumMinted(num);
    };
    void fetchNumNFTsMinted();
  }, [])

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Self Improovers</p>
          <p className="sub-text">
            {numMinted}/100 minted
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={handleClickMint} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
          <div style={{height: 100}} />
          {mining && <img src={miningGif} width={100} height={100}/>}
        </div>
        {svg && (
          <>
            <p className="sub-text">Your self improover:</p>
            <a
              className="footer-text"
              href={url}
              target="_blank"
              rel="noreferrer"
            >View on Opensea</a>
            <img src={`data:image/svg+xml;base64,${svg}`} height={300} width={300}/>
          </>
        )}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
