
document.getElementById("sendButton").addEventListener("click", async () => {
  const merchant = document.getElementById("merchantAddress").value;
  const fiatAmount = parseFloat(document.getElementById("fiatAmount").value);
  const crypto = document.getElementById("cryptoSelect").value;
  const status = document.getElementById("status");

  if (!window.ethereum) {
    alert("Installez MetaMask !");
    return;
  }

  const rates = {
    ethereum: 2000,
    polygon: 1,
    bnb: 300,
    dai: 1,
    usdc: 1
  };

  const value = fiatAmount / rates[crypto];

  try {
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' });

    const tx = {
      from: account,
      to: merchant,
      value: (value * 1e18).toString(16),
    };

    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });

    status.innerHTML = '✅ <a href="https://sepolia.etherscan.io/tx/' + txHash + '" target="_blank">Voir la transaction</a>';
  } catch (err) {
    status.textContent = "❌ Erreur : " + err.message;
  }
});
