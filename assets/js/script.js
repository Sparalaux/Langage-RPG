import question_guerrier from "./quest_guerrier.js";
import question_pretre from "./quest_pretre.js";
import question_mage from "./quest_mage.js";
import question_voleur from "./quest_voleur.js";
import question_dompteur from "./quest_dompteur.js";
import question_samourai from "./quest_samourai.js";

let pv_joueur = 20;
let atq_joueur = 5;
let potion = 2;
let tour = 1;
const tourMax = 10;
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
    case "dompteur":
      afficherQuestionAleatoire(question_dompteur);
      break;
    case "samourai":
      afficherQuestionAleatoire(question_samourai);
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
        <p>⚔️ Tour : ${tour} / ${tourMax}</p>
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

    // vérifier si quelqu’un est mort
    const fini = verifierFinDeJeu(listeQuestions);

    // si la partie continue → prochaine question
    if (!fini) {
      afficherQuestionAleatoire(listeQuestions);
    }

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


function verifierFinDeJeu(listeQuestions) {

  // JOUEUR MORT
  if (pv_joueur <= 0) {
    jeu.innerHTML = `
      <div class="question-container">
        <h1>💀 Défaite...</h1>
        <p>Vous avez été vaincu au tour ${tour}.</p>
        <button id="btn-rejouer">Rejouer</button>
      </div>
    `;

    document.querySelector("#btn-rejouer").addEventListener("click", () => {
      resetGame();
      lancerQuestion();
    });

    return true;
  }

  // ENNEMI MORT
  if (pv_ennemie <= 0) {

    // dernier ennemi battu
    if (tour >= tourMax) {
      jeu.innerHTML = `
        <div class="question-container">
          <h1>🏆 Victoire Finale !</h1>
          <p>Vous avez vaincu les ${tourMax} ennemis !</p>
          <button id="btn-rejouer">Rejouer</button>
        </div>
      `;

      document.querySelector("#btn-rejouer").addEventListener("click", () => {
        location.reload();
      });

      return true;
    }

    // sinon prochain tour
    tour++;
    pv_ennemie = 20 + 2; // difficulté progressive

    alert(`Ennemi vaincu ! ⚔️\nUn nouvel ennemi apparaît (Tour ${tour})`);

    return false;
  }

  return false;
}


function resetGame() {
  pv_joueur = 20;
  pv_ennemie = 20;
  potion = 2;
  tour = 1;
}
