(() => {
  HTMLAudioElement.prototype.rewindAndPlay = function () { this.pause(); this.currentTime = 0; this.play();}
  
  let selectedIndex = -1; // 초기화, 초기값은 -1;
  let time ;
  const listItems = document.querySelectorAll('.list_item');
  const mainContents = document.querySelectorAll('main > div');
  const listContainer = document.querySelector('.list_container');
  const announcer = document.querySelector('#announcer');
  const turnMainBtn = document.querySelector('.turn_main');
  const sounds = {
    confirm:new Audio('bgm/Confirm.mp3'), 
    select:new Audio('bgm/select.mp3'),
    background:new Audio('bgm/background.mp3'),
    back:new Audio('bgm/back.mp3')
  };
  const Head = document.querySelector("header");

// 버튼 생성 클래스
class Button {
  /** 
   * @param {string} text
   * @param {(e?:MouseEvent)=>void} onClick
   * @param {CSSStyleDeclaration?} style
   */ 
  constructor(text, onClick, style = {}) {
    this.button = document.createElement('button');
    this.onClick = onClick;
    this.text = text;
    this.style = style;
    
  }
  /** @param {string} parentElementSelector 버튼을 렌더링할 부모 요소 셀렉터 string을 전달 */
  render(parentElementSelector = "body") {
    this.button.addEventListener("click", this.onClick);
    this.button.addEventListener("keydown", (event) => {
      if (/^(\ |Enter)$/.test(event.key)) {
        this.onClick();
      }
    });

    document.querySelector(parentElementSelector).append(this.button);
  }
  
  
  /** @return {CSSStyleDeclaration} 버튼 인라인 스타일 객체를 가져옴 */
  get style(){ return this.button.style; }
  
  /** @param {CSSStyleDeclaration?} style 버튼 인라인 스타일을 객체 형태로 여러 프로퍼티를 설정함. 기존 스타일을 없애지 않고 전달받은 객체 프로퍼티만 바꿈. */ 
  set style(style){ 
    Object.assign(this.style, style);
  }

  /** @param {string} text */
  set text(text){
    this.button.textContent = text;
  }
  /** @return {string} */
  get text() {
    this.button.textContent;
  }
}

// 페이지 이동 버튼
const pageLinkButton = new Button(" ",() => {
  sounds.confirm.rewindAndPlay();
  const currentUrl = window.location.href;
  // 현재 페이지 URL에 따라 이동할 페이지 URL을 결정합니다.
  const targetUrl = currentUrl.includes("index.html") ? "sub_page_1.html" : "index.html";

  // 이동할 페이지 URL을 window.location.href에 설정합니다.
  window.location.href = targetUrl;
},
{backgroundColor:"transparent", backgroundImage:"linear-gradient(to top, #4A564A, #00cc00)",
padding:"10px", position:"absolute", fontWeight:"bold", right:"0px", top:"0px"}
);

// 현재 페이지 URL에 따라 버튼 텍스트 변경
const currentUrl = window.location.href;
// 현재 페이지 URL에 따라 버튼 텍스트를 설정합니다.
pageLinkButton.text = currentUrl.includes("sub_page_1.html") ? "수업 내용 페이지" : "참고 자료 페이지";

pageLinkButton.render("#hyper_portal");
  
  // 배경음OFF 버튼
  const myButton = new Button("", () => {
    sounds.background.pause();
    delete sounds.background;
  }, {backgroundColor:"#f00", padding:"10px", fontWeight:"bold"});

  // 아이콘 요소 생성
const icon = document.createElement('i');
icon.className = "fas fa-stop";
icon.setAttribute('aria-label', '배경음 끄기');

// 아이콘 추가
myButton.button.prepend(icon);


  //해당 조건일 때 버튼 표시
  if (window.innerWidth < 500) {
    myButton.render("#main_container");
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
      sounds.confirm.play();
      mainContents[index].classList.add('show_content');
      turnMainBtn.classList.add('show_btn');
      listContainer.classList.add('list_container_hid');
      announceForSR('콘텐츠 표시 됨'); // 수정된 부분: announceForSR 함수 호출
    });

    item.addEventListener('mouseover', () => {
      select(index);
      sounds.select.rewindAndPlay();
    }); // 마우스를 항목에 올리면 해당 항목을 선택함.

    item.addEventListener('keydown', (event) => {
      const key = event.key; // key값을 가져옴
      const lastIndex = listItems.length - 1; // 원소의 마지막 값주소

      switch (key) { // key 조건에 따라 다음을 실행
        case "ArrowUp":
          sounds.select.play();
          sounds.select.currentTime = 0;
          select(selectedIndex > 0 ? selectedIndex - 1 : lastIndex); // 0보다 선택된 인덱스가 크면 1을 빼고, 많거나 같으면 마지막 인덱스로 설정
           break;
        case 'ArrowDown':
          sounds.select.play();
          sounds.select.currentTime = 0;
          select(selectedIndex < lastIndex ? selectedIndex + 1 : 0); // 선택된 인덱스가 마지막 인덱스보다 작으면 1을 더하고, 그렇지 않으면 0으로 설정
          break;
        case 'Enter':
        case ' ': 
          sounds.confirm.play();
          sounds.confirm.currentTime = 0;
          mainContents[index].classList.toggle('show_content');
          turnMainBtn.classList.add('show_btn');
          listContainer.classList.toggle('list_container_hid');
          announceForSR('아 페이지 열렸다고!');// 함수 호출
          break;
      }
    });
  });

  //모바일환경 일 때
  const windowWidth = window.innerWidth;
  

  if (windowWidth <= 950) {
    sounds.background.play();
  }


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
    sounds.confirm.play();

    sounds.confirm.currentTime = 0;
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
  sounds.confirm.rewindAndPlay();
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
    document.querySelector(".focusing").focus();
    sounds.back.rewindAndPlay();
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
    sounds.background.play();
  });

  document.addEventListener("focusin",(evt)=>{
    if(evt.isTrusted){
      sounds.select.rewindAndPlay();
    }
  })
  
  document.addEventListener("keydown", (event) => {
    if(event.key === 'ArrowLeft'){
      turnMainBtn.click();
    } else if(event.key === "Tab"){
      sounds.background.play();
    } else if(event.key === 'Escape'){
      sounds.background.pause();
      delete sounds.background;
    }
  });
  
announceForSR("목록에서 위아래 방향키 로 선택하고 맘에 들면 엔터나 눌러 보던지");
})();