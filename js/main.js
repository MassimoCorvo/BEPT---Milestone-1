const form = document.querySelector("form");
const nameForm = document.getElementById("inputNome");
const cognomeForm = document.getElementById("inputCognome");
const job = document.getElementById("lavoro");
const email = document.getElementById("inputEmail");
const codiciSconto = ["YHDNU32", "JANJC63", "PWKCN25", "SJDPO96", "POCIE24"];
const codiciScontoLength = codiciSconto.length;
const codiceInput = document.getElementById("codicePromozionale");
const formContainer = document.querySelector(".form-container");
const errorMsg = document.querySelector(".errorMessages");
let errorMessageContainer;
const checkPrivacy = document.getElementById("privacyCheck");

//Bonus
const jobsArray = [{ job: "Backend Development", pricePerHour: 20.50 },
{ job: "Frontend Development", pricePerHour: 15.30 },
{ job: "Project Analysis", pricePerHour: 33.60 }, { job: "Prova", pricePerHour: 10 }, { job: "Non deve essere aggiunto", pricePerHour: 0 }, { job: "Deve essere aggiunto", pricePerHour: 15.5 }];

//Crea le opzioni della select
createSelectOptions();

//Event Submit
form.addEventListener("submit", function (event) {

   //Reset error message
   resetError();

   //Reset price
   resetPrice();

   event.preventDefault();

   if (validateName(nameForm.value) && validateName(cognomeForm.value) && validateSelect(job.value) && validateEmail(email.value) && checkPrivacy.checked) {
      let tariffaOraria;

      /* if (job.value === "backend")
         tariffaOraria = 20.50;

      else if (job.value === "frontend")
         tariffaOraria = 15.30;

      else if (job.value === "analysis") tariffaOraria = 33.6;

       */

      tariffaOraria = calcoloTariffaOraria(job.value);
      let discount = checkDiscount(codiceInput.value);
      let price = tariffaOraria * 10 * (1 - discount);

      printPrice(price);

   }

   else {
      printError(validateName(nameForm.value), validateName(cognomeForm.value), validateSelect(job.value), validateEmail(email.value), checkPrivacy.checked);
   }

});


//FUNCTIONS

/**
 * Funzione che verifica se il nome o il cognome è valido. Restituisce un valore booleano.
 * @param {string} name
 * @returns {boolean}
 */
function validateName(name) {

   let isValid = true;

   //Verifico che sia lunga almeno due caratteri
   if (name.length < 2)
      return false;

   //Creo una stringa senza spazi a partire da name (essa non sostituisce name)
   const nameWithoutSpace = name.replaceAll(" ", "");

   //Stringa senza spazi all'inizio e alla fine
   const nameAfterTrim = name.trim();

   //Per prima cosa verifico che la stringa non sia vuota
   if (nameWithoutSpace === "") {
      isValid = false;
      return isValid;
   }

   //No spazi all'inizio o alla fine
   if (name !== nameAfterTrim)
      return false;

   //Poi verifico che non ci siano spazi multipli consecutivi
   if (name.includes("  "))
      return false;

   //Verifico che la stringa senza spazi non abbia numeri
   if (nameWithoutSpace.match(/\d+/))
      return false;

   //Se tutti i test sono superati restituisco isValid, che in questo caso sarà true
   return isValid;
}


/**
 * Funzione che verifica se il form select è compilato correttamente. Restituisce un valore booleano.
 * @param {string} selectValue
 * @returns {boolean}
 */
function validateSelect(selectValue) {

   /* if (selectValue === "backend" || selectValue === "frontend" || selectValue === "analysis") {
      return isValid;
   }
   else {
      isValid = false;
      return isValid;
   } */

   for (let i = 0; i < jobsArray.length; i++) {

      if ( selectValue === jobsArray[i].job )
         return true;

   }

   return false;

}

/**
 * Verifica se l'email è valida
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {

   if (email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/))
      return true;
   else return false;

}


/**
 * Genera messaggi in caso di errata compilazione form
 * @param {boolean} firstNameValid
 * @param {boolean} lastNameValid
 * @param {boolean} jobValid
 */
function printError(firstNameValid, lastNameValid, jobValid, emailValid, privacyChecked) {

   const arrayError = [];

   if (!firstNameValid)
      { arrayError.push("Nome non valido");
        nameForm.classList.add("error-input");
      }
   if (!lastNameValid)
      {arrayError.push("Cognome non valido");
   cognomeForm.classList.add("error-input");}
   if (!jobValid)
      {arrayError.push("Inserisci tipo di lavoro");
   job.classList.add("error-input");}
   if (!emailValid)
      {arrayError.push("Email non valida");
   email.classList.add("error-input");}
   if (!privacyChecked)
      {arrayError.push("E' necessario accettare la privacy policy");
       checkPrivacy.classList.add("error-input");
      }

   if (arrayError.length > 0) {
      //Create error container
      errorMessageContainer = document.createElement("div");
      errorMessageContainer.classList.add("error-container", "d-flex", "align-items-center");
      const before = document.getElementById("formId");
      formContainer.insertBefore(errorMessageContainer, before);

      //Create icon
      const iconError = document.createElement("span");
      iconError.classList.add("fs-2");
      iconError.innerHTML = "&#9888;";
      errorMessageContainer.appendChild(iconError);

      //Errors list
      const listError = document.createElement("ul");
      errorMessageContainer.appendChild(listError);
      listError.classList.add("my-0");

      //Per ogni errore aggiunge un elemento della lista
      for (let i = 0; i < arrayError.length; i++) {
         listError.innerHTML += "<li>" + arrayError[i] + "</li>";
      }

      //Scroll the element with id="content" into the visible area of the browser window  
      //false -> bottom of the visible area  true-> top  default = top
      //Da rivedere!!!
      document.querySelector(".error-container").scrollIntoView(false);
   }

}

/**
 * Elimina il messaggio di errore, nel caso sia presente
 */
function resetError() {

   if (errorMessageContainer !== null && errorMessageContainer !== undefined) {
      errorMessageContainer.remove();

      /*nameForm.classList.remove("error-input");
      cognomeForm.classList.remove("error-input");
      job.classList.remove("error-input");
      email.classList.remove("error-input");
      checkPrivacy.classList.remove("error-input"); */

      let elements = document.querySelectorAll(".error-input");

      for( let i = 0; i < elements.length; i++){

         elements[i].classList.remove("error-input");

      }

   }

}


/**
 * Calcola lo sconto e verifica se sia stato inserito uno sconto non valido
 * @param {string} codiceSconto
 * @returns {number}
 */
function checkDiscount(codiceSconto) {
   //const codiceNoSpazi = codiceSconto.replaceAll(" ","");
   let discount = 0;

   //Verifico che il campo non sia vuoto
   if (codiceSconto !== "") {
      let discountValid = false;
      for (let i = 0; i < codiciScontoLength; i++) {

         if (codiciSconto[i] === codiceSconto) {

            discount = 0.25;
            discountValid = true;

         }

      }

      if (!discountValid) {
         printDiscountNotValid();
      }

   }

   return discount;


}


/**
 * Stampa su schermo un messaggio nel caso che il codice sconto inserito non sia valido
 */
function printDiscountNotValid() {

   alert("Codice sconto non valido, non verranno applicati sconti.");

}

function printPrice(price) {

   //Divido la parte intera da i decimali
   const priceString = price.toFixed(2);

   const arrayPrice = priceString.split(".");

   let parteIntera = arrayPrice[0];
   let decimali = arrayPrice[1];

   /*let dotFound = false;
   for (let i = 0; i < priceString.length; i++) {

      if (priceString[i] !== "." && !dotFound) {
         parteIntera += priceString[i];
      }
      else if (priceString[i] === ".")
         dotFound = true;
      else {

         decimali += priceString[i];

      }

   } */

   document.getElementById("parte-intera").innerText = parteIntera;
   document.getElementById("decimali").innerText = "," + decimali;

}

function resetPrice() {

   document.getElementById("parte-intera").innerText = "0";
   document.getElementById("decimali").innerText = "," + "00";

}

//Bonus
function createSelectOptions() {

   for (let i = 0; i < jobsArray.length; i++) {
      //Verifico che il prezzo non sia un falsy value
      if (jobsArray[i].pricePerHour) {
         const selectChoice = document.createElement("option");
         selectChoice.setAttribute("value", jobsArray[i].job);
         selectChoice.innerHTML = jobsArray[i].job;
         job.appendChild(selectChoice);
      }

   }

}

//Bonus
function calcoloTariffaOraria(valueSelect) {

   let index = 0;
   let tariffaOraria;

   for (let i = 0; i < jobsArray.length; i++) {

      if (valueSelect === jobsArray[i].job) {

         index = i;
         break;

      }
   }

   tariffaOraria = jobsArray[index].pricePerHour;
   return tariffaOraria;

} 