document.addEventListener("DOMContentLoaded", () => {
  fetch("tasas.json")
    .then(res => res.json())
    .then(data => {
      const bsToUsd = data.dolar;//precios de las divisas (doalar)
      const bsToEur = data.euro;//euros
      const copToUsd = data.dolarcol;// dolar (peso colombiano)

      const euroCop = (bsToEur / bsToUsd) * copToUsd;

      // Mostrar tasas
      document.getElementById("dolarBs").textContent = bsToUsd.toFixed(2) + " Bs.";
      document.getElementById("euroBs").textContent = bsToEur.toFixed(2) + " Bs.";
      document.getElementById("dolarCop").textContent = copToUsd.toFixed(2) + " Col$.";
      document.getElementById("euroCop").textContent = euroCop.toFixed(2) + " Col$.";

      // Inputs
      const [bsInput, usdInput, eurInput, copInput] = document.querySelectorAll("input");

      const sanitize = val => val.replace(",", ".").trim();
      const isValid = val => /^-?\d+(\.\d+)?$/.test(val);

      function convert(from, value) {
        if (!isValid(value)) return;
        const num = parseFloat(sanitize(value));
        let bs, usd, eur, cop;

        switch (from) {
          case "bs":
            bs = num;
            usd = bs / bsToUsd;
            eur = bs / bsToEur;
            cop = usd * copToUsd;
            break;
          case "usd":
            usd = num;
            bs = usd * bsToUsd;
            eur = bs / bsToEur;
            cop = usd * copToUsd;
            break;
          case "eur":
            eur = num;
            bs = eur * bsToEur;
            usd = bs / bsToUsd;
            cop = usd * copToUsd;
            break;
          case "cop":
            cop = num;
            usd = cop / copToUsd;
            bs = usd * bsToUsd;
            eur = bs / bsToEur;
            break;
        }

        bsInput.value = bs.toFixed(2);
        usdInput.value = usd.toFixed(2);
        eurInput.value = eur.toFixed(2);
        copInput.value = cop.toFixed(2);
      }

      // Asignar eventos dinámicamente
      bsInput.addEventListener("input", () => convert("bs", bsInput.value));
      usdInput.addEventListener("input", () => convert("usd", usdInput.value));
      eurInput.addEventListener("input", () => convert("eur", eurInput.value));
      copInput.addEventListener("input", () => convert("cop", copInput.value));
    });
});
