document.addEventListener("DOMContentLoaded", function () {
  //precios nuevos
  fetch("tasas.json")
    .then(response => response.json())
    .then(data => {
    const bsToUsd = data.actual.dolar;//precios de las divisas (doalar)
    const bsToEur = data.actual.euro;//euros
    const copToUsd = data.actual.dolarcol;// dolar (peso colombiano)
    const dolar_anterior = data.anterior.dolar_anterior;
    const euro_anterior = data.anterior.dolar_anterior;
  
  const euroCop = (bsToEur / bsToUsd) * copToUsd;//calcular euro en base al precio del dolar para pesos 
  // Venezuela
  document.getElementById("dolarBs").textContent = bsToUsd.toFixed(2) + " Bs.";
  document.getElementById("euroBs").textContent = bsToEur.toFixed(2) + " Bs.";
      document.getElementById("dolarBs").textContent = dolar_anterior.toFixed(2) + " Bs.";
      document.getElementById("euroBs").textContent = euro_anterior.toFixed(2) + " Bs.";
      
  // Colombia
  document.getElementById("dolarCop").textContent = copToUsd.toFixed(2) + " Col$.";
  document.getElementById("euroCop").textContent = euroCop.toFixed(2) + " Col$.";

  // Inputs
  const bsInput = document.querySelectorAll("input")[0];
  const usdInput = document.querySelectorAll("input")[1];
  const eurInput = document.querySelectorAll("input")[2];
  const copInput = document.querySelectorAll("input")[3];

  function sanitize(value) {
    return value.replace(",", ".").trim();
  }

  function isValidNumber(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
  }

  function convertFromBs() {
    const raw = sanitize(bsInput.value);
    if (!isValidNumber(raw)) return;
    const bs = parseFloat(raw);
    const usd = bs / bsToUsd;
    const eur = bs / bsToEur;
    const cop = usd * copToUsd;
    usdInput.value = usd.toFixed(2);
    eurInput.value = eur.toFixed(2);
    copInput.value = cop.toFixed(2);
  }

  function convertFromUsd() {
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
    const raw = sanitize(eurInput.value);
    if (!isValidNumber(raw)) return;
    const eur = parseFloat(raw);
    const bs = eur * bsToEur;
    const usd = bs / bsToUsd;
    const cop = usd * copToUsd;
    bsInput.value = bs.toFixed(2);
    usdInput.value = usd.toFixed(2);
    copInput.value = cop.toFixed(2);
  }

  function convertFromCop() {
    const raw = sanitize(copInput.value);
    if (!isValidNumber(raw)) return;
    const cop = parseFloat(raw);
    const usd = cop / copToUsd;
    const bs = usd * bsToUsd;
    const eur = bs / bsToEur;
    bsInput.value = bs.toFixed(2);
    usdInput.value = usd.toFixed(2);
    eurInput.value = eur.toFixed(2);
  }

  // Asignar eventos
  bsInput.addEventListener("input", convertFromBs);
  usdInput.addEventListener("input", convertFromUsd);
  eurInput.addEventListener("input", convertFromEur);
  copInput.addEventListener("input", convertFromCop);
  });
});
