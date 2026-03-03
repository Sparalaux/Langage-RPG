import {question_guerrier} from "../../questions/quest_guerrier.js";
import {question_pretre} from "../../questions/quest_pretre.js";
import {question_mage} from "../../questions/quest_mage.js";
import {question_voleur} from "../../questions/quest_voleur.js";
import {question_dompteur} from "../../questions/quest_dompteur.js";
import {question_samourai} from "../../questions/quest_samourai.js";

/* ============================
   VARIABLES JEU
============================ */

let pv_joueur = 20;
let atq_joueur = 5;
let potion = 2;
let tour = 1;
const tourMax = 10;
let pv_ennemie;
let atq_ennemie = 2;

const jeu = document.querySelector("#jeu");
const bouton_jouer = document.querySelector("#bouton_jouer");

let classeChoisie = null;

/* ============================
   IMAGES DES CLASSES
============================ */

const imagesClasses = {
  guerrier: "assets/image/joueur/guerrier.png",
  mage: "assets/image/joueur/mage.png",
  voleur: "assets/image/joueur/voleur.png",
  pretre: "assets/image/joueur/pretre.png",
  dompteur: "assets/image/joueur/dompteur.png",
  samourai: "assets/image/joueur/samourai.png"
};

/* ============================
   ENNEMIS POSSIBLES
============================ */

const ennemis = [
  { nom: "bandit", image: "assets/image/bandit/bandit.png"},
  { nom: "Orc", image: "assets/image/chevalier.png"},
  { nom: "Démon", image: "assets/image/demon/demon.png"},
  { nom: "Oni", image: "assets/image/oni/oni.png"},
  { nom: "Orc", image: "assets/image/orc/orc.png"},
  { nom: "Zombie", image: "assets/image/zombie/zombie.png"}
];

let ennemiActuel = null;

/* ============================
   SELECTION CLASSE
============================ */

document.querySelectorAll(".classe-card").forEach(card => {

  card.addEventListener("click", () => {

    document.querySelectorAll(".classe-card")
      .forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");

    classeChoisie = card.dataset.classe;
  });

});

/* ============================
   LANCER JEU
============================ */

bouton_jouer.addEventListener("click", () => {
  lancerQuestion();
});

function lancerQuestion() {

  if (!classeChoisie) {
    alert("Choisis une classe !");
    return;
  }

  genererNouvelEnnemi();

  switch (classeChoisie) {
    case "guerrier": afficherQuestionAleatoire(question_guerrier); break;
    case "mage": afficherQuestionAleatoire(question_mage); break;
    case "voleur": afficherQuestionAleatoire(question_voleur); break;
    case "pretre": afficherQuestionAleatoire(question_pretre); break;
    case "dompteur": afficherQuestionAleatoire(question_dompteur); break;
    case "samourai": afficherQuestionAleatoire(question_samourai); break;
  }
}

/* ============================
   GENERER ENNEMI
============================ */

function genererNouvelEnnemi() {
  const index = Math.floor(Math.random() * ennemis.length);
  ennemiActuel = ennemis[index];
  pv_ennemie = 20; // difficulté progressive
}

/* ============================
   AFFICHAGE QUESTION
============================ */

function afficherQuestionAleatoire(listeQuestions) {

  const indexAleatoire = Math.floor(Math.random() * listeQuestions.length);
  const question = listeQuestions[indexAleatoire];
  const reponsesMelangees = melangerReponses(question.answers);

  jeu.innerHTML = `
    <div class="question-container">

      <div class="combat-visual">
        <div class="perso">
          <img src="${imagesClasses[classeChoisie]}" alt="${classeChoisie}">
          <p>${classeChoisie.toUpperCase()}</p>
        </div>

        <div class="vs">⚔️</div>

        <div class="ennemi">
          <img src="${ennemiActuel.image}" alt="${ennemiActuel.nom}">
          <p>${ennemiActuel.nom}</p>
        </div>
      </div>

      <div class="statistiques">
        <p>⚔️ Tour : ${tour} / ${tourMax}</p>
        <p>🧝 Joueur : ${pv_joueur} PV | Potions : ${potion}</p>
        <p>👹 Ennemi : ${pv_ennemie} PV</p>
      </div>

      <h2 class="question-texte">${question.question}</h2>

      <div id="message-combat" class="message-combat"></div>

      <div class="reponses">
        ${reponsesMelangees.map((rep, index) => `
          <button class="btn-reponse">${rep.text}</button>
        `).join("")}
      </div>

      <button id="btn-potion" class="btn-potion">💊 Utiliser une potion</button>

    </div>
  `;

  document.querySelectorAll(".btn-reponse").forEach((bouton, index) => {

  bouton.addEventListener("click", () => {

  // désactive les boutons
  document.querySelectorAll(".btn-reponse")
    .forEach(btn => btn.disabled = true);

  verifierReponse(reponsesMelangees[index]);

  const fini = verifierFinDeJeu(listeQuestions);

  if (!fini) {
    setTimeout(() => {
      afficherQuestionAleatoire(listeQuestions);
    }, 1000);
  }

    });

  });

  document.querySelector("#btn-potion").addEventListener("click", () => {
    usePotion();
    afficherQuestionAleatoire(listeQuestions);
  });
}

/* ============================
   LOGIQUE COMBAT
============================ */

function verifierReponse(reponse) {

  const messageBox = document.querySelector("#message-combat");

  if (reponse.correct) {

    pv_ennemie -= atq_joueur;

    messageBox.innerHTML = `⚔️ Coup réussi ! -${atq_joueur} PV à l'ennemi`;
    messageBox.className = "message-combat success";

  } else {

    pv_joueur -= atq_ennemie;

    messageBox.innerHTML = `💀 Erreur ! -${atq_ennemie} PV`;
    messageBox.className = "message-combat error";
  }

}

function melangerReponses(reponses) {
  return [...reponses].sort(() => Math.random() - 0.5);
}

function usePotion() {

  if (potion > 0) {
    pv_joueur += 10;
    if (pv_joueur > 20) pv_joueur = 20;
    potion--;
  } else {
    alert("Vous n'avez plus de potion");
  }

}

/* ============================
   FIN DE JEU
============================ */

function verifierFinDeJeu(listeQuestions) {

  if (pv_joueur <= 0) {

    jeu.innerHTML = `
      <div class="question-container">
        <h1>💀 Défaite...</h1>
        <button id="btn-rejouer">Rejouer</button>
      </div>
    `;

    document.querySelector("#btn-rejouer").addEventListener("click", () => {
      location.reload();
    });

    return true;
  }

  if (pv_ennemie <= 0) {

    if (tour >= tourMax) {

      jeu.innerHTML = `
        <div class="question-container">
          <h1>🏆 Victoire Finale !</h1>
          <button id="btn-rejouer">Rejouer</button>
        </div>
      `;

      document.querySelector("#btn-rejouer").addEventListener("click", () => {
        location.reload();
      });

      return true;
    }

    tour++;
    alert(`Ennemi vaincu ! ⚔️\nUn nouvel ennemi apparaît (Tour ${tour})`);
    genererNouvelEnnemi();
  }

  return false;
}
