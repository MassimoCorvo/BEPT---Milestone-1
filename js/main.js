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
const codiciSconto = ["YHDNU32", "JANJC63", "PWKCN25", "SJDPO96", "POCIE24"];
const codiciScontoLength = codiciSconto.length;
const codiceInput = document.getElementById("codicePromozionale");
const errorMsg = document.querySelector(".errorMessages");

//const prova = prompt("Inserisci un nome");
//console.log( validateName(prova));

//Event Submit
form.addEventListener("submit", function (event) {
      //Reset error message
      errorMsg.innerHTML = "";
      document.querySelector(".errors-container").classList.add("d-none");

      event.preventDefault();
      console.log( document.getElementById("privacyCheck").value);

   if ( validateName(nameForm.value) && validateName(cognomeForm.value) && validateSelect( job.value )) {
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
      //Da rivedere
      if( validateName(nameForm.value) === false ){
         const firstNameError = document.createElement("li");
         firstNameError.innerText = "Nome non valido";
         document.querySelector(".errorMessages").appendChild(firstNameError);

      }
      if( validateName(cognomeForm.value) === false){
         const lastNameError = document.createElement("li");
         lastNameError.innerText = "Cognome non valido";
         document.querySelector(".errorMessages").appendChild(lastNameError);
      }
      if( validateSelect( job.value ) === false){
         const jobError = document.createElement("li");
         jobError.innerText = "Inserisci tipo di lavoro";
         document.querySelector(".errorMessages").appendChild(jobError);
      }

      document.querySelector(".errors-container").classList.remove("d-none");
   }

});


//FUNCTIONS
function validateName(name) {

   let isValid = true;

   if (name === "") {
      isValid = false;
      return isValid;
   }

   for (let i = 0; i < name.length; i++) {

      if (!isNaN(Number(name[i]))) {
         isValid = false;
         return isValid;
      }
   }

   return isValid;
}

function validateSelect ( selectValue ){
   let isValid = true;

   if( selectValue === "backend" || selectValue === "frontend" || selectValue === "analysis" )
   {
      return isValid;
   }
   else{
      isValid=false;
      return isValid;
   }

}

//function isChecked ()