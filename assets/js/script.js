import {
  question_guerrier,
  question_mage,
  question_voleur,
  question_pretre
} from "./question.js";

bouton_jouer = document.querySelector("#bouton_jouer")

bouton_jouer.addEventListener("click", ()=>{
    test_question()
})

function test_question(){
    console.log(question_guerrier[0])
}