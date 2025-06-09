// import { boxArray, showList } from "./object.js";
let count = 0;
class EventManager {
  constructor() {
  }
  addEvents() {
    // document.querySelector('#addPointCloudButton').addEventListener('click', () => {
    // 	PCM.addPointCloud();
    // });

    // document.querySelector('#addPointCloudAllButton').addEventListener('click', () => {
    // 	PCM.addPointCloudAll();
    // });

    // document.querySelector('#deletePointCloudAllButton').addEventListener('click', () => {
    // 	PCM.deletePointCloudAll();
    // });
    // document.querySelector('#deletePointCloudButton').addEventListener('click', () => {
    // 	PCM.deletePointCloud();
    // });

    //왼쪽 사이드바의 visible 클릭 이벤트
    return;

    document
      .querySelector("#toggleSidebar")
      .addEventListener("click", function () {
        const target = document.getElementById("sidebar");

        if (target.classList.contains("disappear")) {
          target.classList.remove("disappear");
          target.classList.add("appear");
        } else if (target.classList.contains("appear")) {
          target.classList.add("disappear");
          target.classList.remove("appear");
          // setTimeout(function(){ target.classList.remove('appear')},1001);
        }
      });

    return;
    document.querySelector("#iterView").addEventListener("click", function () {
      let newArray = boxArray.filter((number) => {
        if (number.line.visible) {
          return number;
        }
      });
      if (newArray.length == 0) {
        return;
      }
      newArray[count].select();
      count++;
      if (count >= newArray.length) {
        count = 0;
      }
    });

    document
      .querySelector("#lookupButton")
      .addEventListener("click", function () {
        showList();
        count = 0;
      });
  }

  addKeyEvent() {
    document.addEventListener("keydown", this.onKeyDown); //or however you are calling your method
  }

  async onKeyDown(event) {
    event.preventDefault();
    var KeyID = event.keyCode;

    switch (KeyID) {
      case 9: // tab 큐브 선택 및 뷰 전환
        let newArray = boxArray.filter((number) => {
          if (number.line.visible) {
            return number;
          }
        });
        if (newArray.length == 0) {
          return;
        }
        let box = newArray[count].select();
        count++;
        if (count >= newArray.length) {
          count = 0;
        }
        break;

      case 9: // tab 큐브 선택 및 뷰 전환
        break;
    }
  }
}

export { EventManager };
