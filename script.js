
document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const cryptoSelect = document.getElementById("crypto");
    const convertedDiv = document.getElementById("converted");
    const lang = navigator.language.startsWith("en") ? "en" : "fr";

    const texts = {
        fr: {
            title: "Paiement avec CryptoPOS",
            labelAmount: "Montant en EUR / CHF / USD",
            labelCrypto: "Crypto",
            connectMsg: "Connectez votre portefeuille pour procéder au paiement",
            browserMsg: "Navigateur recommandé :",
            secureMsg: "🛡 Paiement 100 % sécurisé via la blockchain"
        },
        en: {
            title: "Payment with CryptoPOS",
            labelAmount: "Amount in EUR / CHF / USD",
            labelCrypto: "Crypto",
            connectMsg: "Connect your wallet to proceed with the payment",
            browserMsg: "Recommended browser:",
            secureMsg: "🛡 100% secure payment via blockchain"
        }
    };

    // Translation
    document.getElementById("title").innerText = texts[lang].title;
    document.getElementById("label-amount").innerText = texts[lang].labelAmount;
    document.getElementById("label-crypto").innerText = texts[lang].labelCrypto;
    document.getElementById("connect-msg").innerText = texts[lang].connectMsg;
    document.getElementById("browser-msg").innerText = texts[lang].browserMsg;
    document.getElementById("secure-msg").innerText = texts[lang].secureMsg;

    // Update crypto conversion
    async function updateConversion() {
        const amount = parseFloat(amountInput.value);
        const crypto = cryptoSelect.value;
        if (!amount || isNaN(amount)) {
            convertedDiv.innerText = "";
            return;
        }
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=eur`);
            const data = await res.json();
            const price = data[crypto].eur;
            const result = (amount / price).toFixed(6);
            convertedDiv.innerText = `≈ ${result} ${crypto.toUpperCase()}`;
        } catch (e) {
            convertedDiv.innerText = "Erreur de conversion.";
        }
    }

    amountInput.addEventListener("input", updateConversion);
    cryptoSelect.addEventListener("change", updateConversion);
});
