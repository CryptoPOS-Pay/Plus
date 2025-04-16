
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      document.getElementById('wallet-status').innerText = '📦 Wallet connecté : ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);
      return walletAddress;
    } catch (error) {
      alert('Connexion MetaMask refusée');
      return null;
    }
  } else {
    alert('Veuillez installer MetaMask');
    return null;
  }
}

async function sendPayment() {
  const recipient = document.getElementById('merchant-address').value;
  const amount = document.getElementById('crypto-amount').innerText.replace('≈ ', '').split(' ')[0];

  const wallet = await connectWallet();
  if (!wallet) return;

  const valueInWei = window.ethers.utils.parseEther(amount);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  try {
    const tx = await signer.sendTransaction({
      to: recipient,
      value: valueInWei
    });
    await tx.wait();
    alert('✅ Paiement effectué avec succès');
  } catch (err) {
    console.error(err);
    alert('❌ Paiement échoué');
  }
}
