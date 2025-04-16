
const eurInput = document.getElementById("amount-eur");
const cryptoSelect = document.getElementById("crypto-select");
const convertedDisplay = document.getElementById("converted-amount");
const merchantAddress = document.getElementById("merchant-address");
const payButton = document.getElementById("pay-button");
const deviseSelect = document.getElementById("devise-select");
const connectStatus = document.getElementById("connect-status");
const langFR = document.getElementById("lang-fr");
const langEN = document.getElementById("lang-en");

const platformAddress = "0xFb8586Fad7Ad58A7A6fc9793A7aEBc3CE95b554f";

let selectedCurrency = "eur";
let translations = {
    fr: {
        title: "Paiement avec CryptoPOS",
        amount: "Montant en",
        crypto: "Crypto",
        merchant: "Adresse du commerçant",
        send: "Envoyer",
        secure: "Paiement 100 % sécurisé via la blockchain 🔒",
        connect: "Connectez votre portefeuille pour procéder au paiement"
    },
    en: {
        title: "Payment with CryptoPOS",
        amount: "Amount in",
        crypto: "Cryptocurrency",
        merchant: "Merchant address",
        send: "Send",
        secure: "100% secure payment via blockchain 🔒",
        connect: "Connect your wallet to proceed with payment"
    }
};

let currentLang = "fr";

function updateTexts() {
    document.querySelector("h2").innerText = translations[currentLang].title;
    document.querySelector("label[for='amount-eur']").innerText = `${translations[currentLang].amount} ${deviseSelect.value.toUpperCase()}`;
    document.querySelector("label[for='crypto-select']").innerText = translations[currentLang].crypto;
    document.querySelector("label[for='merchant-address']").innerText = translations[currentLang].merchant;
    payButton.innerText = translations[currentLang].send;
    document.querySelector(".secure").innerText = translations[currentLang].secure;
    connectStatus.innerText = translations[currentLang].connect;
}

langFR.onclick = () => { currentLang = "fr"; updateTexts(); };
langEN.onclick = () => { currentLang = "en"; updateTexts(); };

const priceApi = {
    ETH: 'ethereum',
    USDT: 'tether',
    USDC: 'usd-coin',
    DAI: 'dai',
    MATIC: 'matic-network',
    BNB: 'binancecoin'
};

async function updateConversion() {
    const value = parseFloat(eurInput.value);
    const crypto = cryptoSelect.value;
    const vs = deviseSelect.value;
    if (!value || value <= 0) {
        convertedDisplay.textContent = "≈ 0.000 " + crypto;
        return;
    }
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${priceApi[crypto]}&vs_currencies=${vs}`);
        const data = await res.json();
        const rate = data[priceApi[crypto]][vs];
        const converted = (value / rate).toFixed(6);
        convertedDisplay.textContent = `≈ ${converted} ${crypto}`;
        return converted;
    } catch (e) {
        convertedDisplay.textContent = "Erreur de conversion";
        return null;
    }
}

eurInput.addEventListener("input", updateConversion);
cryptoSelect.addEventListener("change", updateConversion);
deviseSelect.addEventListener("change", () => {
    updateTexts();
    updateConversion();
});
window.addEventListener("load", () => {
    updateTexts();
    updateConversion();
    connectMetaMask();
});

async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            connectStatus.textContent = `💼 Wallet connecté : ${accounts[0].slice(0,6)}...${accounts[0].slice(-4)}`;
        } catch (error) {
            connectStatus.textContent = "❌ Connexion refusée";
        }
    } else {
        connectStatus.textContent = "❌ MetaMask non détecté";
    }
}

payButton.addEventListener("click", async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const amountCrypto = await updateConversion();
    const crypto = cryptoSelect.value;

    if (!amountCrypto || crypto !== "ETH") {
        alert("Pour ce test, seul ETH est activé pour les paiements.");
        return;
    }

    const amount = ethers.utils.parseEther(amountCrypto);
    const amount5 = amount.mul(5).div(100);
    const amount95 = amount.sub(amount5);

    try {
        await signer.sendTransaction({
            to: merchantAddress.value,
            value: amount95
        });

        await signer.sendTransaction({
            to: platformAddress,
            value: amount5
        });

        alert("✅ Paiement envoyé avec succès !");
    } catch (err) {
        console.error(err);
        alert("❌ Paiement échoué");
    }
});
