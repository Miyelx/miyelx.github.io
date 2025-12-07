document.addEventListener("DOMContentLoaded", function () {
  //precios nuevos
  const bsToUsd = 257.9287;//precios de las divisas (doalar)
  const bsToEur = 300.50756979;//euros
  const copToUsd = 3830.02;// dolar (peso colombiano)
  //precios anteriores
  const bstousd = 254.87;
  const bstoeur = 297.38;
  const coptousd = 3757.92;

  const euroCop = (bsToEur / bsToUsd) * copToUsd;//calcular euro en base al precio del dolar para pesos
  const eurocop = (bstoeur / bstousd) * coptousd;//calcular euro en base al precio del dolar para pesos(precio anterior)
  
  const aumentodolar= (bsToUsd - bstousd) / bstousd * 100;
  const aumentoeuro= (bsToEur - bstoeur) / bstoeur * 100;
  const aumentodolarcop= (copToUsd - coptousd) / coptousd * 100;
  const aumentoeurocop= ( euroCop- eurocop) / eurocop * 100;
    
  // Venezuela
  document.getElementById("dolarBs").textContent = bsToUsd.toFixed(2) + " Bs." + "\n" + "(anterior)" + bstousd.toFixed(2) + " Bs.";//datos enviados al index.html 📈️ 📉️
  document.getElementById("euroBs").textContent = bsToEur.toFixed(2) + " Bs." + "\n" + "(anterior)" + bstoeur.toFixed(2) + " Bs.";
  // Colombia
  document.getElementById("dolarCop").textContent = copToUsd.toFixed(2) + " Col$." + "\n" + "(anterior)" + coptousd.toFixed(2) + " Col$";
  document.getElementById("euroCop").textContent = euroCop.toFixed(2) + " Col$." + "\n" + "(anterior)" + coptoeur.toFixed(2) + "Col$";

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
