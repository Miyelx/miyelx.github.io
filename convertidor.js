document.addEventListener("DOMContentLoaded", function () {
  //precios 
  fetch("tasas.json")
    .then(response => response.json())
    .then(data => {
     const bsToUsd = data.bs$;
     const bsToEur = data.bseur;
     const copToUsd = data.cop$;  
  
  const euroCop = (bsToEur / bsToUsd) * copToUsd;//calcular euro en base al precio del dolar para pesos 
  // Venezuela
  document.getElementById("dolarBs").textContent = bsToUsd.toFixed(2) + " Bs.";
  document.getElementById("euroBs").textContent = bsToEur.toFixed(2) + " Bs.";
  document.getElementById("fecha-venezuela").textContent = "Fecha: " + data.fechaBCV;
  // Colombia
  document.getElementById("dolarCop").textContent = copToUsd.toFixed(2) + " Col$.";
  document.getElementById("euroCop").textContent = euroCop.toFixed(2) + " Col$.";
  document.getElementById("fecha-colombia").textContent = "Fecha: " + data.fechaBRC;   

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
    usdInput.value = (bs/bsToUsd).toFixed(2);
    eurInput.value = (bs/bsToEur).toFixed(2);
    copInput.value = ((bs/bsToUsd)*copToUsd).toFixed(2);
  }

  function convertFromUsd() {
    const raw = sanitize(usdInput.value);
    if (!isValidNumber(raw)) return;
    const usd = parseFloat(raw);
    bsInput.value = (usd*bsToUsd).toFixed(2);
    eurInput.value = ((usd*bsToUsd)/bsToEur).toFixed(2);
    copInput.value = (usd*copToUsd).toFixed(2);
  }

  function convertFromEur() {
    const raw = sanitize(eurInput.value);
    if (!isValidNumber(raw)) return;
    const eur = parseFloat(raw);
    bsInput.value = (eur*bsToEur).toFixed(2);
    usdInput.value = (eur*(bsToUsd/bsToEur)).toFixed(2);
    copInput.value = (((bsToEur / bsToUsd) * copToUsd)*eur).toFixed(2);
                      
  }

  function convertFromCop() {
    const raw = sanitize(copInput.value);
    if (!isValidNumber(raw)) return;
    const cop = parseFloat(raw);
    bsInput.value = ((cop/copToUsd)*bsToUsd).toFixed(2);
    usdInput.value = (cop/copToUsd).toFixed(2);
    eurInput.value = (cop/((bsToEur / bsToUsd)*copToUsd)).toFixed(2);
  }

  // Asignar eventos
  bsInput.addEventListener("input", convertFromBs);
  usdInput.addEventListener("input", convertFromUsd);
  eurInput.addEventListener("input", convertFromEur);
  copInput.addEventListener("input", convertFromCop);
  });
});
