/*Aggiungiamo la componente js di interazione con l’utente.
Quando l’utente fa click sul bottone submit del form, il sito deve calcolare l’ammontare del
preventivo per le ore di lavoro richieste.
Il prezzo finale è dato dal numero di ore per prezzo orario. Supponiamo per semplicità che
ogni progetto richieda lo stesso numero di ore di lavoro (es: 10 ore).
Il prezzo orario per una commissione varia in questo modo:
● se la commissione riguarda lo sviluppo backend il prezzo orario è di 20.50€/l’ora
● se la commissione riguarda lo sviluppo frontend il prezzo orario è di 15.30€/l’ora
● se la commissione riguarda l’analisi progettuale il prezzo orario è di 33.60€/l’ora
L’utente potrebbe decidere di utilizzare un codice promozionale tra i seguenti: YHDNU32,
JANJC63, PWKCN25, SJDPO96, POCIE24.
Se l’utente inserisce un codice promozionale valido, ha diritto ad uno sconto del 25% sul
prezzo finale. Se il codice inserito non è valido, il sito deve informare l’utente che il codice
non è valido e il prezzo finale viene calcolato senza applicare sconti.
Il risultato del calcolo del prezzo finale deve essere visualizzato in “forma umana” (con 2
decimali e il simbolo dell’euro). */

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

console.log(isNaN(0));
//Event Submit
form.addEventListener("submit", function (event) {
   //Reset error message
   resetError();

   event.preventDefault();

   if (validateName(nameForm.value) && validateName(cognomeForm.value) && validateSelect(job.value) && validateEmail( email.value)) {
      let tariffaOraria;

      if (job.value === "backend")
         tariffaOraria = 20.50;

      else if (job.value === "frontend")
         tariffaOraria = 15.30;

      else if (job.value === "analysis") tariffaOraria = 33.6;

      let discount = false;

      for (let i = 0; i < codiciScontoLength; i++) {

         if (codiciSconto[i] === codiceInput.value)
            discount = true;

      }

      let price = tariffaOraria * 10;

      if (discount)
         price *= (1 - 0.25);


      document.getElementById("price").innerText = price.toFixed(2);

      //Troncare la stringa price e stamparla con i decimali in grigio
   }

   else {
      printError(validateName(nameForm.value), validateName(cognomeForm.value), validateSelect(job.value), validateEmail(email.value));
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

   //Creo una stringa senza spazi a partire da name, ma essa non sostituisce name
   const nameWithoutSpace = name.replaceAll(" ", "");

   //Per prima cosa verifico che la stringa non sia vuota
   if (nameWithoutSpace === "") {
      isValid = false;
      return isValid;
   }

   //Poi verifico che non ci siano spazi consecutivi
   for(let i = 0 ; i < name.length; i++){
      let j = i + 1;

      if( name[i] === " " && j < name.length ){

         if( name[j] === " " )
         {  
            isValid = false;
            return isValid;
         }
      
      //Se non ci sono spazi consecutivi non eseguo nulla
      }


   }

   //Verifico che la stringa senza spazi non abbia numeri
   for (let i = 0; i < nameWithoutSpace.length; i++) {

      //Number: an empty string (like "") converts to 0
      if ( isNaN(Number(nameWithoutSpace[i])) === false ) {
         isValid = false;
         return isValid;
      }
   }
   
   //Se tutti i test sono superati restituisco isValid, che in questo caso sarà true
   return isValid;
}


/**
 * Funzione che verifica se il form select è compilato correttamente. Restituisce un valore booleano.
 * @param {string} selectValue
 * @returns {boolean}
 */
function validateSelect(selectValue) {
   let isValid = true;

   if (selectValue === "backend" || selectValue === "frontend" || selectValue === "analysis") {
      return isValid;
   }
   else {
      isValid = false;
      return isValid;
   }

}
 
/**
 * Verifica se l'email è valida
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail ( email ){
   
   if(email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/))
      return true;
   else return false;

}


/**
 * Genera messaggi in caso di errata compilazione form
 * @param {boolean} firstNameValid
 * @param {boolean} lastNameValid
 * @param {boolean} jobValid
 */
function printError(firstNameValid, lastNameValid, jobValid, emailValid) {

   const arrayError = [];

   if (!firstNameValid)
      arrayError.push("Nome non valido");
   if (!lastNameValid)
      arrayError.push("Cognome non valido");
   if (!jobValid)
      arrayError.push("Inserisci tipo di lavoro");
   if(!emailValid)
      arrayError.push("Email non valida");

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
      //false -> bottom of the visible area
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
   }

}