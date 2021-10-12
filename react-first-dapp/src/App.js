import logo from './logo.svg';
import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

// contract address and update it when deployed
const greeterAddr = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState('')

  // request access to the MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // read the current greeting value of smart contract
  async function fetchGreeting() {
    // check if metamask is connected
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddr, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  }

  // update the greeting value
  async function setGreeting() {
    if (!greeting) return

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddr, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()

    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange = {e => setGreetingValue(
            e.target.value
          )}
          placeholder = "Set greeting"
          value = {greeting}
        />
      </header>
    </div>
  );
}

export default App;
