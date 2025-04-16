const eurInput = document.getElementById("amount-eur");
const cryptoSelect = document.getElementById("crypto-select");
const convertedDisplay = document.getElementById("converted-amount");

const priceApi = {
    ETH: 'ethereum',
    USDT: 'tether',
    USDC: 'usd-coin',
    DAI: 'dai',
    MATIC: 'matic-network',
    BNB: 'binancecoin'
};

async function updateConversion() {
    const eur = parseFloat(eurInput.value);
    const crypto = cryptoSelect.value;
    if (!eur || eur <= 0) {
        convertedDisplay.textContent = "≈ 0.000 " + crypto;
        return;
    }
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${priceApi[crypto]}&vs_currencies=eur`);
        const data = await res.json();
        const rate = data[priceApi[crypto]].eur;
        const converted = (eur / rate).toFixed(6);
        convertedDisplay.textContent = `≈ ${converted} ${crypto}`;
    } catch (e) {
        convertedDisplay.textContent = "Erreur de conversion";
    }
}

eurInput.addEventListener("input", updateConversion);
cryptoSelect.addEventListener("change", updateConversion);
window.addEventListener("load", updateConversion);