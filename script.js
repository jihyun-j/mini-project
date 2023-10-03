// Firebase setting
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  Timestamp,
  doc,
  orderBy,
  query,
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
const ref = collection(db, "miniProject");

// ! 방명록 제출 event
const userNameInput = document.querySelector(".user-name");
const passwordInput = document.querySelector(".password");
const commentInput = document.querySelector(".comments");
const submitBtn = document.querySelector(".form-submit");

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

// ! 작성된 방명록 출력하기
const boardContainer = document.querySelector(".board-contents-section");

async function getComments() {
  // let docs = await getDocs(collection(db, "miniProject"));
  const dataList = await getDocs(query(ref, orderBy("date", "desc")));
  addComment(dataList);
}

// ! 제출한 방명록 추가하기
function addComment(docs) {
  docs.forEach((doc) => {
    let data = doc.data();
    let comments = data.comments;
    let userName = data.userName;
    let createdDate = data.date;

    // * 새로운 container element 추가하기
    const div = document.createElement("div");

    // * container element에 class name 추가하기
    div.classList.add("board-data-container");

    // * container에 들어갈 내용 template
    div.innerHTML = ` 
    <p class="user-name-data">${userName}</p>
    <p class="comments-data">${comments}</p>
    <p class="created-date-data">${createdDate}</p>
    <button class="material-symbols-outlined delete-btn" value=${doc.id}>delete</button>
    <button class="material-symbols-outlined edit-btn" value=${doc.id}>edit</button>
    `;

    // * container에 template 넣기
    boardContainer.append(div);
  });

  deleteComments();
  editComments();
}

// **************************** 수정 및 삭제 **************************** //
const checkPasswordForm = document.querySelector(".check-password-form");
const checkPasswordInput = document.querySelector(".delete-password-input");
const cancelDeleteBtn = document.querySelector(".delete-cancel");
const checkPasswordBtn = document.querySelector(".delete");
const message = document.querySelector(".password-message");

let currentCommentId = "";

// card delete button에 event 추가하기
function deleteComments() {
  document.querySelectorAll(".delete-btn").forEach((button) =>
    button.addEventListener("click", function (e) {
      openModal(checkPasswordForm);
      currentCommentId = e.target.value;
    })
  );
}

// modal cancel button에 event 추가하기
cancelDeleteBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeModal(checkPasswordForm);
});

// modal delete button에 event 추가하기
checkPasswordBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  const getData = doc(db, "miniProject", currentCommentId);
  const getDelDoc = await getDoc(getData);
  const password = getDelDoc.data().password;
  console.log(password);

  if (checkPasswordInput.value === "") {
    message.innerText = "비밀번호를 입력해주세요";
    checkPasswordInput.value = "";
  } else if (password !== checkPasswordInput.value) {
    message.innerText = "비밀번호를 다시 입력해주세요";
    checkPasswordInput.value = "";
  } else if (password === checkPasswordInput.value) {
    console.log("삭제되었습니다");
    checkPasswordInput.value = "";
    deleteDoc(getData)
      .then(() => {
        // * document 삭제 후 페이지 리로드 시켜서 데이터 업데이트 시키기
        window.location.reload();
        console.log("deleted");
      })
      .catch((err) => {
        console.log("error");
      });
  }
});

// 내용 수정 Modal
const editCommentsForm = document.querySelector(".edit-comments-form");
const editCommentsInput = document.querySelector(".edit-comments");
const cancelEditCommentsBtn = document.querySelector(".edit-cancel");
const editCommentsBtn = document.querySelector(".edit");

// card delete button에 event 추가하기
function editComments() {
  document.querySelectorAll(".edit-btn").forEach((button) =>
    button.addEventListener("click", function (e) {
      openModal(editCommentsForm);
      currentCommentId = e.target.value;
    })
  );
}

// editCommentsBtn.addEventListener("click");

// 나의 소개
const showMainCard1 = document.querySelector("#card-1");
const showMainCard2 = document.querySelector("#card-2");
const showMainCard3 = document.querySelector("#card-3");

const mbti = document.querySelector(".hidden-mbti");
const mbtiImg = document.querySelector(".mbti-img");

// ************************* Modal ************************* //
function openModal(modal) {
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
}

getComments();
