export class GeoCoderManager {
  constructor() {
    this.geocoder = null;
    this.initialize();
  }
  //  geocoder 초기셋팅
  initialize() {
    this.geocoder = new google.maps.Geocoder();
  }
  // 검색 정의
  async codeAddress(address, viewer, callback) {
    const qweqwe = await this.geocoder.geocode(
      { address: address },
      (results, status) => {
        if (status == "OK") {
          // map.setCenter(results[0].geometry.location);

          // const _address = document.querySelector("#search_address");
          // _address.innerText = address;
          const position = results[0].geometry.location;

          const mapPosition = window.toScene.forward([
            position.lng(),
            position.lat(),
          ]);

          // console.log("map position", mapPosition);
          // console.log("map position", mapPosition[0]);

          viewer.scene.view.setView(
            [mapPosition[0], mapPosition[1], 10000],
            [mapPosition[0], mapPosition[1], 15]
          );

          // console.log(new google.maps.Map(), "ggg");
          // const map = new google.maps.Map(
          //   document.getElementById("potree_render_area")
          // );

          // new google.maps.Marker({
          //   position: position,
          //   map: map,
          // });
          // console.log(marker,'sss')
          callback(true);
        } else {
          callback(false);
          // alert("검색 결과가 없습니다.");
        }
      }
    );
    // execDaumPostcode(address);
  }

  writePanomaraView(location) {
    console.log("lat", location.lat());
    console.log("lng", location.lng());
    console.log("lng type", typeof location.lng());
    const fenway = { lat: location.lat(), lng: location.lng() };

    const panorama = new google.maps.StreetViewPanorama(
      document.querySelector(".street_map"),
      {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10,
        },
      }
    );
  }
  // 주소 팝업
  execDaumPostcode(viewer) {
    new daum.Postcode({
      oncomplete: (data) => {
        console.log(data);
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        var addr = ""; // 주소 변수
        var extraAddr = ""; // 참고항목 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === "R") {
          // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if (data.userSelectedType === "R") {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
          // 조합된 참고항목을 해당 필드에 넣는다.
          // document.getElementById("sample6_extraAddress").value = extraAddr;

          console.log("extraAddress", extraAddr);
        } else {
          // document.getElementById("sample6_extraAddress").value = '';
          console.log("extraAddress", "");
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        // document.getElementById('sample6_postcode').value = data.zonecode;
        // document.getElementById("sample6_address").value = addr;
        // 커서를 상세주소 필드로 이동한다.
        // document.getElementById("sample6_detailAddress").focus();
        console.log("data zoneCode", data.zonecode);
        console.log("addr", addr);
        this.codeAddress(addr, viewer);
      },
    });
  }
  // 극좌표 가져오기
  geocodeLatLng(lat, lng) {
    const latlng = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: latlng }, (results, status) => {
        if (status == "OK") {
          console.log("results", results);
          // alert(results);
          resolve(results);
        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    });
  }
}
