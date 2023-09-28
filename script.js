// 방명록 폼
const userNameInput = document.querySelector(".user-name");
const passwordInput = document.querySelector(".password");
const commentInput = document.querySelector(".comments");
const submitBtn = document.querySelector(".form-submit");

// 작성된 방명록
const boardContainer = document.querySelector(".board-contents-section");

// 비밀번호 확인 Modal
const checkPasswordForm = document.querySelector(".check-password-form");
const checkPasswordInput = document.querySelector(".delete-password-input");
const cancelDeleteBtn = document.querySelector(".delete-cancel");
const checkPasswordBtn = document.querySelector(".delete");

// 내용 수정 Modal
const editCommentsForm = document.querySelector(".edit-comments-form");
const editCommentsInput = document.querySelector(".edit-comments");
const cancelEditCommentsBtn = document.querySelector(".edit-cancel");
const editCommentsBtn = document.querySelector(".edit");

// 나의 소개
const showMainCard1 = document.querySelector("#card-1");
const showMainCard2 = document.querySelector("#card-2");
const showMainCard3 = document.querySelector("#card-3");

const mbti = document.querySelector(".hidden-mbti");
const mbtiImg = document.querySelector(".mbti-img");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  Timestamp,
  doc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGo9aPb92fMqIzSwfgzDcSCZj0G1clmsc",
  authDomain: "album-6d914.firebaseapp.com",
  projectId: "album-6d914",
  storageBucket: "album-6d914.appspot.com",
  messagingSenderId: "391931630805",
  appId: "1:391931630805:web:cac08bab0ca4b958ce7e5c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ! 게시물 등록하기
submitBtn.addEventListener("click", async function (e) {
  // * Default 이벤트 제거
  e.preventDefault();

  // * Input 값 가져오기
  let getUserName = userNameInput.value;
  let getComments = commentInput.value;
  let getDate = Timestamp.fromDate(new Date());
  let getPassword = passwordInput.value;

  // * 가져온 Input 값 firestore에 저장하기
  let doc = {
    userName: getUserName,
    comments: getComments,
    date: getDate.toDate(),
    password: getPassword,
  };
  await addDoc(collection(db, "miniProject"), doc);

  // * Reload browser
  window.location.reload();
});

// ! 게시물 데이터 가져오기
let docs = await getDocs(collection(db, "miniProject"));
docs.forEach((doc) => {
  let data = doc.data();
  let comments = data.comments;
  let userName = data.userName;
  let createdDate = data.date;
  let password = data.password;

  // * 새로운 element 요소 추가하기
  const div = document.createElement("div");
  const usernameData = document.createElement("p");
  const commentsData = document.createElement("p");
  const dateData = document.createElement("p");
  const deleteBtn = document.createElement("div");
  const editBtn = document.createElement("div");

  // * element 요소에 class name 추가하기
  div.classList.add("board-data-container");
  usernameData.classList.add("user-name-data");
  commentsData.classList.add("comments-data");
  dateData.classList.add("created-date-data");
  deleteBtn.classList.add("delete-btn");
  editBtn.classList.add("edit-btn");

  // * div container 안에 username과 comments 내용 넣기
  boardContainer.append(div);
  div.append(usernameData);
  div.append(commentsData);
  div.append(deleteBtn);
  div.append(dateData);
  div.append(editBtn);

  // * html 요소 안에 텍스트 넣기
  deleteBtn.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
  editBtn.innerHTML = `<span class="material-symbols-outlined">edit</span>`;
  usernameData.innerText = `${userName}`;
  commentsData.innerText = `${comments}`;
  dateData.innerText = createdDate.toDate();

  deleteBtn.addEventListener("click", function () {
    // * delete 버튼 클릭 했을때 document id# 가져오기
    const docId = doc.id;
    // * 각 코멘트 delete 버튼에 modal 추가하기
    deleteDocItem(docId);
  });
});

// ! Document 삭제하기 function
function deleteDocItem(id) {
  // * document의 정확한 path 가져오기
  const docRef = doc(db, "miniProject", id);

  // * deleteDoc 함수 이용해서 document 삭제하기

  deleteDoc(docRef)
    .then(() => {
      // * document 삭제 후 페이지 리로드 시켜서 데이터 업데이트 시키기
      window.location.reload();
      checkPasswordForm.classList.remove("modal");
      console.log("deleted");
    })
    .catch((err) => {
      console.log("error");
    });
}

// * mbti 이미지
mbti.addEventListener("mouseover", function () {
  mbtiImg.classList.remove("hidden");
  mbti.classList.add("hidden");
});

mbti.addEventListener("mouseleave", function () {
  mbtiImg.classList.add("hidden");
  mbti.classList.remove("hidden");
});

function showMyPersonalities() {}

// * 소개 보여주기
showMainCard1.addEventListener("click", showMyPersonalities);
