(() => {
  let selectedIndex = -1; // 초기화, 초기값은 -1;
  let time ;
  const listItems = document.querySelectorAll('.list_item');
  const mainContents = document.querySelectorAll('main > div');
  const listContainer = document.querySelector('.list_container');
  const announcer = document.querySelector('#announcer');
  const turnMainBtn = document.querySelector('.turn_main');
  const Bgms = [new Audio('bgm/Confirm.mp3'), new Audio('bgm/select.mp3'), new Audio('bgm/background.mp3')];
  const Head = document.querySelector("header");

// 버튼 생성 클래스
class Button {
  constructor(text, onClick, backgroundColor, gradientValue, padding, position, top, right, fontWeight, targetTagId) {
    this.text = text;
    this.onClick = onClick;
    this.backgroundColor = backgroundColor;
    this.gradientValue = gradientValue;
    this.padding = padding;
    this.position = position;
    this.top = top;
    this.right = right;
    this.targetTagId = targetTagId;
    this.fontWeight = fontWeight;
    this.button = null;
  }

  render() {
    this.button = document.createElement("button");
    this.button.textContent = this.text;
    this.button.style.backgroundColor = this.backgroundColor;
    this.button.style.backgroundImage = this.gradientValue;
    this.button.style.padding = this.padding;
    this.button.style.position = this.position;
    this.button.style.top = this.top;
    this.button.style.right = this.right;
    this.button.style.fontWeight = this.fontWeight;
    this.button.addEventListener("click", this.onClick);
    this.button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        this.onClick();
      }
    });

    const targetTag = document.getElementById(this.targetTagId);
    if (targetTag) {
      targetTag.appendChild(this.button);
    } else {
      document.body.appendChild(this.button);
    }
  }
}

// 페이지 이동 버튼
const pageLinkButton = new Button(" ", () => {
  Bgms[0].play();
  const currentUrl = window.location.href;
  if (currentUrl.includes("index.html")) {
    window.location.href = "sub_page_1.html";
  } else if (currentUrl.includes("sub_page_1.html")) {
    window.location.href = "index.html";
  }
}, " ", "linear-gradient(to top, #4A564A, #00cc00)", "10px", "absolute", "bold", "0px", "0px", "hyper_portal");

// 현재 페이지 URL에 따라 버튼 텍스트 변경
const currentUrl = window.location.href;
if (currentUrl.includes("sub_page_1.html")) {
  pageLinkButton.text = "수업 내용 페이지";
}else{
  pageLinkButton.text = "참고 자료 페이지";

}

pageLinkButton.render();

  
  // 배경음OFF 버튼
  const myButton = new Button("배경음OFF", () => {
    Bgms[2].pause();
    Bgms.pop();
  }, "#f00", "10px",  "fixed", "bold", "main_container");

  if (window.innerWidth < 500) {
    myButton.render();
  }

  const select = (index, sendFocus = true) => { // 항목을 선택하는 함수
    selectedIndex = index; // 첫번째 인자인 index를 클로저 전역변수인 selectedIndex에 담음
    if (sendFocus) {
      listItems[index]?.focus(); // sendFocus가 true면 물리적인 키보드 초점을 보냄
    }
    listItems.forEach((_, i) => {
      _.classList.toggle('focusing', i === selectedIndex);
      _.tabIndex = i === index ? 0 : -1; // i가 index와 같은 항목에 tabindex를 0, 아닌 항목에 -1 적용
    });
  };

  select(0, false);

  listItems.forEach((item, index) => { // 항목마다 이벤트 등록
    item.addEventListener('click', () => {
      Bgms[0].play();
      mainContents[index].classList.add('show_content');
      turnMainBtn.classList.add('show_btn');
      listContainer.classList.add('list_container_hid');
      announceForSR('콘텐츠 표시 됨'); // 수정된 부분: announceForSR 함수 호출
    });

    item.addEventListener('mouseover', () => {
      select(index);
    }); // 마우스를 항목에 올리면 해당 항목을 선택함.

    item.addEventListener('keydown', (event) => {
      const key = event.key; // key값을 가져옴
      const lastIndex = listItems.length - 1; // 원소의 마지막 값주소

      switch (key) { // key 조건에 따라 다음을 실행
        case "ArrowUp":
          Bgms[1].play();
          Bgms[1].currentTime = 0;
          select(selectedIndex > 0 ? selectedIndex - 1 : lastIndex); // 0보다 선택된 인덱스가 크면 1을 빼고, 많거나 같으면 마지막 인덱스로 설정
           break;
        case 'ArrowDown':
          Bgms[1].play();
          Bgms[1].currentTime = 0;
          select(selectedIndex < lastIndex ? selectedIndex + 1 : 0); // 선택된 인덱스가 마지막 인덱스보다 작으면 1을 더하고, 그렇지 않으면 0으로 설정
          break;
        case 'Enter':
        case ' ': 
          Bgms[0].play();
          Bgms[0].currentTime = 0;
          mainContents[index].classList.toggle('show_content');
          turnMainBtn.classList.add('show_btn');
          listContainer.classList.toggle('list_container_hid');
          announceForSR('페이지 열렸는데?');// 함수 호출
          break;
      }
    });
  });

  //모바일환경 일 때
  const windowWidth = window.innerWidth;
  const pElements = document.querySelectorAll('div[id^="main_contents_"] p');
  const h1Elements = document.querySelectorAll('body h1');
  

  if (windowWidth <= 500) {
    Bgms[2].play();
    pElements.forEach((p) => {
      p.setAttribute('tabindex', '0');
    });
    h1Elements.forEach((h1) => {
      h1.setAttribute('tabindex', '0');
    });
  } else {
    pElements.forEach((p) => {
      p.removeAttribute('tabindex');
    });
    h1Elements.forEach((h1) => {
      h1.removeAttribute('tabindex');
    });
  };


  //표콘텐츠 관련
  const btnLists = document.querySelectorAll('.btn_list>div');
  const tableBox = document.querySelectorAll('.table_box');
  
  btnLists.forEach((item, index) => {
    item.addEventListener('click', () => {
      toggleShowTable(index);
    });
  
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleShowTable(index);
      }
    });
  });

  function toggleShowTable(index) {
    Bgms[0].play();
    Bgms[0].currentTime = 0;
    if (!tableBox[index].classList.contains('show_table')) {
      tableBox[index].classList.add('show_table');
      tableBox[index].focus();
      for (let i = 0; i < tableBox.length; i++) {
        if (i !== index && tableBox[i].classList.contains('show_table')) {
          tableBox[i].classList.remove('show_table');
        }
      announceForSR('수업내용 표시 됨');
      }
    }
  }
     

 //메인화면으로 이동
 const turnMainButton = document.querySelector('.turn_main');//'처음으로' 버튼

 turnMainButton.addEventListener('click', () => {
  Bgms[0].play();
  Bgms[0].currentTime = 0;
  tableBox.forEach((BoX) => {
    if(BoX.classList.contains('show_table')){
    BoX.classList.remove('show_table');}
  });
    mainContents.forEach((content) => {
      content.classList.remove('show_content');
    });
    listContainer.classList.remove('list_container_hid');
    turnMainBtn.classList.remove('show_btn');
    announceForSR('메인화면임');
 });

 // 상태를 음성으로 알리는 함수
 function announceForSR(message) {
    announcer.textContent = message;
    time = setTimeout(() => {
      clearTimeout(time);
      announcer.textContent = ""; 
    }, 1000);
  };

  document.addEventListener("mousemove", () => {
    Bgms[2].play();
  });
  
  document.addEventListener("keydown", (event) => {
    if (event.key === 'Tab') {
      Bgms[2].play();
    }else if(event.key === 'Escape'){
      Bgms[2].pause();
      Bgms.pop();
    }
  });

  

})();