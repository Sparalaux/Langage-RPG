import { question_guerrier } from "../../questions/quest_guerrier.js";
import { question_pretre } from "../../questions/quest_pretre.js";
import { question_mage } from "../../questions/quest_mage.js";
import { question_voleur } from "../../questions/quest_voleur.js";
import { question_dompteur } from "../../questions/quest_dompteur.js";
import { question_samourai } from "../../questions/quest_samourai.js";
import { question_archer } from "../../questions/quest_archer.js";
import { question_barde } from "../../questions/quest_barde.js";
import { question_moine } from "../../questions/quest_moine.js";
import { question_herboriste } from "../../questions/quest_herboriste.js";

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
let atq_boss = 5;

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
  samourai: "assets/image/joueur/samourai.png",
  archer: "assets/image/joueur/archer.png",
  barde: "assets/image/joueur/barde.png",
  moine: "assets/image/joueur/moine.png",
  herboriste: "assets/image/joueur/herboriste.png"
};

const avantages = {
  guerrier: "Bandit",
  pretre: "Zombie",
  mage: "Démon",
  voleur: "Chevalier",
  dompteur: "Orc",
  samourai: "Oni"
};

/* ============================
   ENNEMIS POSSIBLES
============================ */

const ennemis = [
  { nom: "Bandit", image: "assets/image/bandit/bandit.png" },
  { nom: "Chevalier", image: "assets/image/chevalier/chevalier.png" },
  { nom: "Démon", image: "assets/image/demon/demon.png" },
  { nom: "Oni", image: "assets/image/oni/oni.png" },
  { nom: "Orc", image: "assets/image/orc/orc.png" },
  { nom: "Zombie", image: "assets/image/zombie/zombie.png" }
];

let ennemiActuel = null;

const boss = [
  { nom: "Roi Demon", image: "assets/image/boss/RoiDemon.png", pv: 50 },
  { nom: "Dragon", image: "assets/image/boss/Dragon.png", pv: 60 },
];

let bossActuel = null;
let estBoss = false;
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

  if (tour === tourMax) {
    genererNouveauBoss();
  } else {
    genererNouvelEnnemi();
    estBoss = false;
  }

  switch (classeChoisie) {
    case "guerrier": afficherQuestionAleatoire(question_guerrier); break;
    case "mage": afficherQuestionAleatoire(question_mage); break;
    case "voleur": afficherQuestionAleatoire(question_voleur); break;
    case "pretre": afficherQuestionAleatoire(question_pretre); break;
    case "dompteur": afficherQuestionAleatoire(question_dompteur); break;
    case "samourai": afficherQuestionAleatoire(question_samourai); break;
    case "archer": afficherQuestionAleatoire(question_archer); break;
    case "barde": afficherQuestionAleatoire(question_barde); break;
    case "moine": afficherQuestionAleatoire(question_moine); break;
    case "herboriste": afficherQuestionAleatoire(question_herboriste); break;
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

function genererNouveauBoss() {
  const index = Math.floor(Math.random() * boss.length);
  bossActuel = boss[index];
  pv_ennemie = bossActuel.pv; // le boss utilise pv_ennemie
  atq_ennemie = atq_boss;
  estBoss = true;
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
          <img src="${estBoss ? bossActuel.image : ennemiActuel.image}" 
          alt="${estBoss ? bossActuel.nom : ennemiActuel.nom}">

          <p>${estBoss ? bossActuel.nom : ennemiActuel.nom}</p>
        </div>
      </div>

      <div class="statistiques">
        <p>⚔️ Tour : ${tour} / ${tourMax}</p>
        <p>🧝 Joueur : ${pv_joueur} PV | Potions : ${potion}</p>
        <p>👹 ${estBoss ? "BOSS" : "Ennemi"} : ${pv_ennemie} PV</p>
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

    let degats = atq_joueur;

    // Vérifie si la classe a un avantage
    const nomEnnemi = estBoss ? bossActuel.nom : ennemiActuel.nom;

    if (avantages[classeChoisie] === nomEnnemi) {
      degats += 3;
    }

    pv_ennemie -= degats;

    if (degats > atq_joueur) {
      messageBox.innerHTML = `🔥 Avantage ! -${degats} PV`;
      messageBox.className = "message-combat success message-heal";
    } else {
      messageBox.innerHTML = `⚔️ Coup réussi ! -${degats} PV`;
      messageBox.className = "message-combat success message-heal";
    }

  } else {

    pv_joueur -= atq_ennemie;

    updateDangerEffect(pv_joueur, 20)

    messageBox.innerHTML = `💀 Erreur ! -${atq_ennemie} PV`;
    messageBox.className = "message-combat error message-damage";
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
    flashScreen("heal");
  } else {
    alert("Vous n'avez plus de potion");
  }

}

function flashScreen(type) {

  const overlay = document.getElementById("damage-overlay");

  overlay.classList.remove("flash-damage", "flash-heal");

  // force le restart animation
  void overlay.offsetWidth;

  if (type === "damage") {
    overlay.classList.add("flash-damage");
  }

  if (type === "heal") {
    overlay.classList.add("flash-heal");
  }
}

function updateDangerEffect(pvJoueur, pvMax) {

  const overlay = document.getElementById("damage-overlay")

  const ratio = pvJoueur / pvMax

  const danger = 1 - ratio

  if (ratio < 0.25) {
  overlay.classList.add("low-hp")
} else {
  overlay.classList.remove("low-hp")
}

  overlay.style.setProperty("--danger-level", danger)

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

    // Si c'était le boss → victoire finale
    if (estBoss) {

      jeu.innerHTML = `
      <div class="question-container">
        <h1>🔥 BOSS VAINCU ! 🔥</h1>
        <h2>🏆 Victoire Finale !</h2>
        <button id="btn-rejouer">Rejouer</button>
      </div>
    `;

      document.querySelector("#btn-rejouer").addEventListener("click", () => {
        location.reload();
      });

      return true;
    }

    // Sinon ennemi normal
    tour++;
    alert(`Ennemi vaincu ! ⚔️\nUn nouvel ennemi apparaît (Tour ${tour})`);

    if (tour === tourMax) {
      genererNouveauBoss();
    } else {
      genererNouvelEnnemi();
    }
  }

  return false;
}
