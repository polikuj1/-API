// 登入、註冊畫面切換
const signUpButton = document.querySelector('.loginPagesignup-btn');
const loginPage = document.querySelector('.loginPage');
const signupPage = document.querySelector('.signUpPage');
const signUpPage_loginButton = document.querySelector('.signUpPagelogin-btn');
const todoList = document.querySelector('.todoList');
const footer = document.querySelector('.footer');
const noTodo =document.querySelector('.noTodo');
const bigList = document.querySelector('.list');

signUpButton.addEventListener('click',pageChange);
signUpPage_loginButton.addEventListener('click',pageChange)

function pageChange(e) {
  e.preventDefault;
  loginPage.classList.toggle('change-page');
  signupPage.classList.toggle('change-page');
}
//網址
let apiUrl = 'https://todoo.5xcamp.us';
//授權
let token = '';
//資料
let data = [];

//註冊功能
const email = document.querySelector('.email');
const nickname = document.querySelector('.nickname');
const password = document.querySelector('.password');
const checkPassword = document.querySelector('.check-password');
const signUpPage_signup_btn = document.querySelector('.signUpPagesignup-btn');
const emailIsError = document.querySelector('.warn-2');

let signUpContent = {
  "user": {
    "email": '',
    "nickname": '',
    "password": ''
  }
};

  //連接api
function signUp(data) {
  axios.post(`${apiUrl}/users`,data)
  .then((res) => {
    axios.defaults.headers.common['Authorization'] = res.headers.authorization;
    loginPage.classList.toggle('change-page');
    signupPage.classList.toggle('change-page');
    alert(`註冊成功，請重新登入`);
  })
  .catch((err)=> alert(err.response.data.error[0]));
  email.value = '';
  nickname.value = '';
  password.value = '';
  checkPassword.value = '';
}

  //監聽點擊註冊按鈕，組物件，發送資料請求
signUpPage_signup_btn.addEventListener('click',function() {
  if (email.value === '' || password.value === '' || nickname.value === '' || checkPassword.value === '') {
    alert(`請完整填寫用戶資料`);
    return ;
  }
  //密碼不能低於六位數
  let pswLength = password.value.length;
  if ( pswLength < 6) return alert('密碼不能小於六位數');
  let signUpContent = {
    "user": {
      "email": email.value.trim(),
      "nickname": nickname.value.trim(),
      "password": password.value.trim()
    }
  };
  //確認兩次密碼是否一致
  if (password.value.trim() !== checkPassword.value.trim()) return alert(`兩次密碼輸入不一樣`);
  //傳送資料
  signUp(signUpContent);
})



//登入頁面的登入功能
const loginPage_loginButton = document.querySelector('.loginPagelogin-btn');
const loginPage_email = document.querySelector('#email');
const loginPage_password = document.querySelector('#password');
const whosTodo = document.querySelector('.right-bar p');

let loginContent = {
  "user": {
    "email": '',
    "password": ''
  }
};

  //傳送api資料
function login(data) {
  axios.post(`${apiUrl}/users/sign_in`,data)
  .then((res)=>{
    // console.log(res);
    axios.defaults.headers.common['Authorization'] = res.headers.authorization;
    // token = res.headers.authorization;
    loginPage.classList.toggle('change-page');
    todoList.classList.toggle('change-page');
    //改寫某某的代辦
    whosTodo.textContent = `${res.data.nickname}的代辦`;
    getTodo();
  })
  .catch((err)=> alert(err.response.data.message))
}


  //登入成功後，跟伺服器要清單的資料

function getTodo() {
  axios.get(`${apiUrl}/todos`)
  .then((res)=> {
    console.log(res);
    data = res.data.todos;
    // if (data.length === 0 ) {
    //   noTodo.innerHTML = `<p>目前尚無代辦事項</p>
    //   <img src="img/empty 1.png" alt="">`;
    //   bigList.classList.toggle('hide');
    // } else {
    //   if (bigList.classList.contains('hide')) {
    //     bigList.classList.remove('hide');
    //   } else {
    //     return;
    //   }
      // noTodo.innerHTML = '';
      render(data);//185行
      calList();
    })
  .catch(err=> console.log(err.response))
}

    //計算待完成的項目
const unfinished = document.querySelector('.item-num') 
function calList() {
  let listSum = data.filter(item=>item.completed_at === null);
  unfinished.textContent = `${listSum.length}個待完成項目`;
}
    

  //監聽登入按鈕
loginPage_loginButton.addEventListener('click',()=>{
  if (loginPage_email.value === '' || loginPage_password.value === '') return alert('請輸入信箱和密碼');
  let loginContent = {
    "user": {
      "email": loginPage_email.value.trim(),
      "password": loginPage_password.value.trim()
    }
  };
  loginPage_email.value = '';
  loginPage_password.value = '';
  login(loginContent);
})


//登出功能
const logout = document.querySelector('.log-out');

function logoutTodo() {
  axios.delete(`${apiUrl}/users/sign_out`)
  .then((res) => {
    todoList.classList.toggle('change-page');
    loginPage.classList.toggle('change-page');
    alert(res.data.message);
  })
  .catch((err) => console.log(err.response))
}

logout.addEventListener('click',logoutTodo);




//清單
const addBtn = document.querySelector('.add-box a');
const list = document.querySelector('.todowhat');
const listInput = document.querySelector('.add-box input');
const labelCheckbox = document.querySelector('checkbox');
const clearFinished = document.querySelector('.clearFinished')

//渲染畫面
function render(data) {
  //判斷目前所在的狀態欄，再渲染
  if (tabLi[0].classList.contains('active')) {
    newData = data;
  } else if (tabLi[1].classList.contains('active')) {
    newData = data.filter(item=>item.completed_at === null);
  } else if (tabLi[2].classList.contains('active')) {
    newData = data.filter(item=>item.completed_at !== null);
  } else {
    newData = data;
  }
  let str = '';
  let checkbox = '';
  newData.forEach((item,index) => {
    if (item.completed_at  != null) {
      checkbox = 'checked';
    } else {
      checkbox = '';
    }
    str += `<li data-id='${item.id}'>
    <label class="checkbox" >
      <input type="checkbox" ${checkbox}/>
      <span>${item.content}</span>
      <a href="#" class="delete"><img src="img/Vector.png" alt="X">X</img></a>
    </label>
    </li>`;
  })
  list.innerHTML = str;
}


 //監聽新增代辦事項的按鈕
addBtn.addEventListener('click',(e)=>{
  e.preventDefault;
  addNewList();
});
function addNewList() {
  console.log(data);
  //輸入不能為空白
  if (listInput.value.trim() === '') return alert('請輸入代辦事項');
  //傳送新增內容到伺服器
  axios.post(`${apiUrl}/todos`,{
    "todo": {
      "content": listInput.value.trim(),
      "checkbox": ''
    }
  })
  .then((res) => {
    //新增成功後，再次戳伺服器取得現在所有的清單內容，去渲染
    console.log(res);
    getTodo();//113行
    listInput.value = '';
    //只要新增項目後，將狀態欄跳轉至全部
    tabLi.forEach((item)=> {
      item.classList.remove('active');
    })
    tabLi[0].classList.add('active');
  })
  .catch(err => console.log(err.response))
}




  //監聽是否點到刪除按鈕，並刪除指定的內容
list.addEventListener('click',(e)=> {
   //取得目前點擊到的清單id
  let id = e.target.closest('li').dataset.id;
  console.log(id);
  if (e.target.nodeName === 'IMG') {
    // 傳送刪除請求到伺服器，在重新取得最新資料，然後渲染
    axios.delete(`${apiUrl}/todos/${id}`)
    .then((res) => {
      getTodo();
    })
    .catch((err) => {
      console.log(err.response);
    })
  } else if (e.target.nodeName === 'LABEL'|| e.target.nodeName === 'INPUT' ||e.target.nodeName === 'SPAN') {
    //將點到的項目，更改completed_at狀態
    axios.patch(`${apiUrl}/todos/${id}/toggle`,{})
    .then((res)=> {
      console.log(res);
      getTodo();
    })
    .catch(err=> console.log(err.response))
  }
})



//tab狀態欄
const tab = document.querySelector('.tab');
const tabLi = document.querySelectorAll('.tab li');

tab.addEventListener('click',function(e) {
  tabLi.forEach((item)=> {
    item.classList.remove('active');
  })
  if (e.target.textContent === '全部') {
      tabLi[0].classList.add('active');
      getTodo();
  } else if (e.target.textContent === '待完成') {
      tabLi[1].classList.add('active');
      let newData = [];
      newData = data.filter((item)=> {
        return item.completed_at === null;
      })
      render(newData);
  } else if (e.target.textContent === '已完成') {
      tabLi[2].classList.add('active');
      let newData = [];
      newData = data.filter((item)=> {
        return item.completed_at !== null;
      })
      render(newData);
  }
})


//清除已完成項目
clearFinished.addEventListener('click',(e)=>{
  if (confirm('確定要刪除已完成的項目嗎') === true) {
    data.forEach((item)=>{
      if (item.completed_at !== null) {
        axios.delete(`${apiUrl}/todos/${item.id}`)
        .then((res)=> {
          console.log(res);
          getTodo();
        })
        .catch(err=>console.log(err.response))
      }
    })
  }
})


//按下enter也能新增
listInput.addEventListener('keyup',(e)=>{
  e.preventDefault;
  if (e.key === 'Enter') {
    addNewList();//205行
  }
});
