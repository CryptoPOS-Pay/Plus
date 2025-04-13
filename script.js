async function pay() {
  const status = document.getElementById("status");
  const amount = document.getElementById("ethAmount").value;
  const to = document.getElementById("merchantAddress").value;

  if (!window.ethereum) {
    status.textContent = "Veuillez installer Metamask.";
    return;
  }

  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: to,
      value: ethers.utils.parseEther(amount)
    });
    status.textContent = "Transaction envoyée : " + tx.hash;
  } catch (err) {
    status.textContent = "Erreur: " + err.message;
  }
}

document.getElementById("ethAmount").addEventListener("input", convert);

async function convert() {
  const eth = document.getElementById("ethAmount").value;
  const display = document.getElementById("converted");
  const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,chf,eur");
  const data = await res.json();
  const { usd, chf, eur } = data.ethereum;

  const locale = navigator.language;
  let currency = "eur", value = eth * eur;
  if (locale.includes("en")) { currency = "usd"; value = eth * usd; }
  else if (locale.includes("de") || locale.includes("fr-CH")) { currency = "chf"; value = eth * chf; }

  display.textContent = `≈ ${value.toFixed(2)} ${currency.toUpperCase()}`;
}

window.onload = convert;
