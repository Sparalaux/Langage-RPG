import {
  question_guerrier,
  question_mage,
  question_voleur,
  question_pretre
} from "./question.js";

let pv_joueur = 20;
let atq_joueur = 5;

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

  // HTML propre
  jeu.innerHTML = `
    <div class="question-container">
      <h2 class="question-texte">${question.question}</h2>
      <div class="reponses">
        ${reponsesMelangees.map((rep, index) => `
          <button class="btn-reponse" data-index="${index}">
            ${rep.text}
          </button>
        `).join("")}
      </div>
    </div>
  `;

  // Brancher les clics
  const boutons = document.querySelectorAll(".btn-reponse");
  boutons.forEach((bouton, index) => {
    bouton.addEventListener("click", () => {
      verifierReponse(reponsesMelangees[index]);
    });
  });
}

function verifierReponse(reponse) {
  if (reponse.correct) {
    console.log("Bonne réponse ⚔️");
    // ici : dégâts à l'ennemi
  } else {
    console.log("Mauvaise réponse 💀");
    // ici : dégâts au joueur
  }
}

// utilitaire de mélange
function melangerReponses(reponses) {
  return [...reponses].sort(() => Math.random() - 0.5);
}
