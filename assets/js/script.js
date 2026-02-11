import {
  question_guerrier,
  question_mage,
  question_voleur,
  question_pretre
} from "./question.js";

let pv_joueur = 20;
let atq_joueur = 5;
let potion = 2;
let tour = 0;
let pv_ennemie = 20;
let atq_ennemie = 2;


const jeu = document.querySelector("#jeu");
const bouton_jouer = document.querySelector("#bouton_jouer");
const choix_classe = document.querySelector("#classe");

bouton_jouer.addEventListener("click", () => {
  lancerQuestion();
});

function lancerQuestion() {
  switch (choix_classe.value) {
    case "guerrier":
      afficherQuestionAleatoire(question_guerrier);
      break;
    case "mage":
      afficherQuestionAleatoire(question_mage);
      break;
    case "voleur":
      afficherQuestionAleatoire(question_voleur);
      break;
    case "pretre":
      afficherQuestionAleatoire(question_pretre);
      break;
  }
}

function afficherQuestionAleatoire(listeQuestions) {
  const indexAleatoire = Math.floor(Math.random() * listeQuestions.length);
  const question = listeQuestions[indexAleatoire];

  // Mélange les réponses
  const reponsesMelangees = melangerReponses(question.answers);

  // HTML propre avec PV et potion
  jeu.innerHTML = `
    <div class="question-container">
      <div class="statistiques">
        <p>🧝 Joueur : ${pv_joueur} PV | Potions : ${potion}</p>
        <p>👹 Ennemi : ${pv_ennemie} PV</p>
      </div>

      <h2 class="question-texte">${question.question}</h2>

      <div class="reponses">
        ${reponsesMelangees.map((rep, index) => `
          <button class="btn-reponse" data-index="${index}">
            ${rep.text}
          </button>
        `).join("")}
      </div>

      <button id="btn-potion" class="btn-potion">💊 Utiliser une potion</button>
    </div>
  `;

  // Brancher les clics pour les réponses
  const boutons = document.querySelectorAll(".btn-reponse");
  boutons.forEach((bouton, index) => {
    bouton.addEventListener("click", () => {
      verifierReponse(reponsesMelangees[index]);
      afficherQuestionAleatoire(listeQuestions);
    });
  });

  // Brancher le bouton potion
  const boutonPotion = document.querySelector("#btn-potion");
  boutonPotion.addEventListener("click", () => {
    usePotion();
    // Réafficher la même question pour mettre à jour les PV et potion
    afficherQuestionAleatoire(listeQuestions);
  });
}

function verifierReponse(reponse) {
  if (reponse.correct) {
    alert("Bonne réponse ⚔️");
    pv_ennemie -= atq_joueur
  } else {
    alert("Mauvaise réponse 💀");
    pv_joueur -= atq_ennemie
  }
}

// utilitaire de mélange
function melangerReponses(reponses) {
  return [...reponses].sort(() => Math.random() - 0.5);
}

function usePotion(){
  if (potion>0){
    pv_joueur+=10
    if (pv_joueur>20){
      pv_joueur = 20
    }
    potion-=1
  } else{
    alert("vous n'avez plus de potion")
  }
}
