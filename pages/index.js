import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }
  const [transactionDetails, setTransactionDetails] = useState({
    time: "",
    type: "",
    amount: 0,
  });

  const [convertedUSD, setConvertedUSD] = useState(0);
  const [convertedINR, setConvertedINR] = useState(0);

  const convertToUSD = async () => {
    if (atm) {
      try {
        console.log("Calling cvt2INR function");
        const convertedAmount = await atm.cvt2USD();
        console.log("Converted Amount:", convertedAmount.toNumber());
        setConvertedUSD(convertedAmount.toNumber());
      } catch (error) {
        console.error("Error converting to USD:", error);
      }
    }
  };
  
  const convertToINR = async () => {
    if (atm) {
      try {
        console.log("Calling cvt2INR function");
        const convertedAmount = await atm.cvt2INR();
        console.log("Converted Amount:", convertedAmount.toNumber());
        setConvertedINR(convertedAmount.toNumber());
      } catch (error) {
        console.error("Error converting to INR:", error);
      }
    }
  };
  


  const deposit = async () => {
    if (atm && transactionAmount > 0) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
      setTransactionDetails({
        time: new Date().toLocaleString(),
        type: "Deposit",
        amount: transactionAmount,
      });
    }
  };
  

  
  const withdraw = async () => {
    if (atm && transactionAmount > 0) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
      setTransactionDetails({
        time: new Date().toLocaleString(),
        type: "Withdrawal",
        amount: transactionAmount,
      });
    }
  };

  const withdraw2 = async () => {
    if (atm && transactionAmount > 0) {
      let tx = await atm.withdraw(transactionAmount);
      await tx.wait();
      getBalance();
      setTransactionDetails({
        time: new Date().toLocaleString(),
        type: "Withdrawal",
        amount: transactionAmount,
      });
    }
  };
  const deposit2 = async () => {
    if (atm && transactionAmount > 0) {
      let tx = await atm.deposit(transactionAmount);
      await tx.wait();
      getBalance();
      setTransactionDetails({
        time: new Date().toLocaleString(),
        type: "Deposit",
        amount: transactionAmount,
      });
    }
  };
  
  
  
const [transactionAmount, setTransactionAmount] = useState(0);

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <br />
        <button onClick={deposit2}>Deposit amt of ETH</button>
        <button onClick={withdraw2}>Withdraw amt of ETH</button>
        
      <input
        type="number"
        placeholder="Enter amount"
        value={transactionAmount}
        onChange={(e) => setTransactionAmount(e.target.value)}
      />
      <button onClick={convertToUSD}>Convert to USD</button>
      <button onClick={convertToINR}>Convert to INR</button>
      <p>Converted Amount (USD): {convertedUSD}</p>
      <p>Converted Amount (INR): {convertedINR}</p>
      <p>Transaction Time: {transactionDetails.time}</p>
      <p>Transaction Type: {transactionDetails.type}</p>
      <p>Transaction Amount: {transactionDetails.amount} ETH</p>
      </div>
      
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align:left;
          background-image: url('https://images.pexels.com/photos/373883/pexels-photo-373883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
          background-size: cover;
          background-position: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          
        }
       
      `}</style>
    </main>
  )
}

