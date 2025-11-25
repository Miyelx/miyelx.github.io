document.addEventListener("DOMContentLoaded", function () {
  fetch("tasas.json")
    .then(res => res.json())
    .then(data => {
      // Venezuela
      document.getElementById("dolarBs").textContent = data.bsToUsd.toFixed(2);
      document.getElementById("euroBs").textContent = data.bsToEur.toFixed(2);

      // Colombia
      document.getElementById("dolarCop").textContent = data.copToUsd.toFixed(2);
      // Euro en COP = (bsToEur / bsToUsd) * copToUsd
      const euroCop = (data.bsToEur / data.bsToUsd) * data.copToUsd;
      document.getElementById("euroCop").textContent = euroCop.toFixed(2);
    })
    .catch(error => {
      console.error("Error al cargar tasas.json:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const bsInput = document.querySelectorAll("input")[0];
  const usdInput = document.querySelectorAll("input")[1];
  const eurInput = document.querySelectorAll("input")[2];
  const copInput = document.querySelectorAll("input")[3]; // nuevo input para COP

  let bsToUsd = null;
  let bsToEur = null;
  let copToUsd = null;

  function sanitize(value) {
    return value.replace(",", ".").trim();
  }

  function isValidNumber(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
  }

  function convertFromBs() {
    if (bsToUsd === null || bsToEur === null || copToUsd === null) return;
    const raw = sanitize(bsInput.value);
    if (!isValidNumber(raw)) return;
    const bs = parseFloat(raw);
    const usd = bs / bsToUsd;
    const eur = bs / bsToEur;
    const cop = usd * copToUsd; // COP a través del USD
    usdInput.value = usd.toFixed(2);
    eurInput.value = eur.toFixed(2);
    copInput.value = cop.toFixed(2);
  }

  function convertFromUsd() {
    if (bsToUsd === null || bsToEur === null || copToUsd === null) return;
    const raw = sanitize(usdInput.value);
    if (!isValidNumber(raw)) return;
    const usd = parseFloat(raw);
    const bs = usd * bsToUsd;
    const eur = bs / bsToEur;
    const cop = usd * copToUsd;
    bsInput.value = bs.toFixed(2);
    eurInput.value = eur.toFixed(2);
    copInput.value = cop.toFixed(2);
  }

  function convertFromEur() {
    if (bsToUsd === null || bsToEur === null || copToUsd === null) return;
    const raw = sanitize(eurInput.value);
    if (!isValidNumber(raw)) return;
    const eur = parseFloat(raw);
    const bs = eur * bsToEur;
    const usd = bs / bsToUsd;
    const cop = usd.toFixed(5) * copToUsd;
    bsInput.value = bs.toFixed(2);
    usdInput.value = usd.toFixed(2);
    copInput.value = cop.toFixed(2);
  }

  function convertFromCop() {
    if (bsToUsd === null || bsToEur === null || copToUsd === null) return;
    const raw = sanitize(copInput.value);
    if (!isValidNumber(raw)) return;
    const cop = parseFloat(raw);
    const usd = cop / copToUsd; // convertir COP → USD
    const bs = usd * bsToUsd;
    const eur = bs / bsToEur;
    bsInput.value = bs.toFixed(2);
    usdInput.value = usd.toFixed(2);
    eurInput.value = eur.toFixed(2);
  }

  fetch('tasas.json')
    .then(res => res.json())
    .then(data => {
      bsToUsd = data.bsToUsd;
      bsToEur = data.bsToEur;
      copToUsd = data.copToUsd;

      bsInput.addEventListener("input", convertFromBs);
      usdInput.addEventListener("input", convertFromUsd);
      eurInput.addEventListener("input", convertFromEur);
      copInput.addEventListener("input", convertFromCop);
    })
    .catch(error => {
      console.error("Error al obtener tasas:", error);
    });
});
