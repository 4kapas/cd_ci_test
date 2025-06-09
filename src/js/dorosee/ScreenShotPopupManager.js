export class ScreenShotPopupManager {
    constructor(data) {
        let { PotreeDoroseeMain, isExpress } = data;
        this.isExpress = isExpress;
        this.pre = this.isExpress ? "" : `/img/icons`;
        this.PotreeDoroseeMain = PotreeDoroseeMain;
        this.PointCloudManager = PotreeDoroseeMain.PointCloudManager;
        this.GeoCoderManager = PotreeDoroseeMain.GeoCoderManager;
        this.values = {
            "img": '',
            "title": 'untitled',
            "address": '',
            "coord": '',
            "area": '',
            "content": '',
        }
        this.HTMLContent = `
        <!-- <div class="screenShot_popup"> -->
            <div class="close_frame">
                <img src="${this.pre}/close_ico.svg" alt="" />
            </div>
            <div class="img_frame">
                <img src="" alt="" />
            </div>
            <div class="text_frame">
                <span>주제 :</span>
                <input id="titleInput" type="text" placeholder="사용자 설정" />
            </div>
            <div class="text_frame">
                <span>주소 :</span>
                <input id="addressInput" type="text" placeholder="자동 입력" readonly />
            </div>
            <div class="text_frame">
                <span>면적 :</span>
                <input id="areaInput" type="text" placeholder="자동 입력" readonly />
            </div>
            <div class="text_frame align_start">
                <span>내용 : </span>
                <textarea id="contentArea"></textarea>
            </div>
            <div class="btn_frame">
                <button id="PDFDownloadBtn" class="screenBtn">PDF 내려받기</button>
                <button id="imgDownloadBtn" class="screenBtn">이미지 내려받기</button>
            </div>
	    <!-- </div> -->
        `
        this.init();
    }

    async init() {
        await this.addHTML();
        await this.addEvents();
    }

    async addEvents() {
        document.querySelector("#PDFDownloadBtn").addEventListener("click", this.downloadPDF.bind(this));
        document.querySelector("#imgDownloadBtn").addEventListener("click", this.downloadImg.bind(this));
        document.querySelector("#titleInput").addEventListener("change", () => {
            this.values.title = document.querySelector("#titleInput").value;
        })
        return;
    }

    async addHTML() {
        try {
            let $div = document.createElement("div");
            $div.setAttribute("class", 'screenShot_popup');
            $div.setAttribute("id", 'screenShot_popup');
            $div.innerHTML = this.HTMLContent;
            document.body.appendChild($div);

            // document.body.appendChild($div);
            // $($div).load("./dorosee/component/screenShotPopup.html");
            return;
        }
        catch (e) {
            console.error(e);
        }
    }

    setValues2HTML() {
        document.querySelector(".img_frame img").src = this.values.img;
        // document.querySelector(".text_frame #titleInput").value = '';
        // document.querySelector(".text_frame #addressInput").value = '';
        // document.querySelector(".text_frame #areaInput").value = '';
        // document.querySelector(".text_frame #contentArea").value = '';
    }

    setImg(value) {
        this.values.img = value;
        document.querySelector(".img_frame img").src = this.values.img;
    }

    setArea() {
        if (document.querySelector("#measurement_area")) {
            this.values.area = document.querySelector("#measurement_area").innerText
        }

        document.querySelector("#areaInput").value = this.values.area + "m^2";
    }

    async setAddress() {
        if (!document.querySelector("#centerX")) return;
        let Center = {
            x: Number(document.querySelector("#centerX").innerText),
            y: Number(document.querySelector("#centerY").innerText),
            z: Number(document.querySelector("#centerZ").innerText)
        }

        let pointcloudProjection = this.PointCloudManager.pointcloudProjection;
        console.log("pointcloudProjection", pointcloudProjection);
        let wgsProjection = "+proj=longlat +datum=WGS84 +no_defs";

        var coord = proj4(pointcloudProjection, wgsProjection, [Center.x, Center.y]);
        // coord = [lng, lat]
        this.values.coord = coord;
        console.log("coord", coord);
        let results = await this.GeoCoderManager.geocodeLatLng(coord[1], coord[0])
        this.values.address = results[0]["formatted_address"];
        document.querySelector("#addressInput").value = `${this.values.address}(lng : ${coord[0].toFixed(3)}, lat : ${coord[1].toFixed(3)})`;
    }

    // async makeHTML2PDF() {
    //     window.jsPDF = window.jspdf.jsPDF;
    //     let doc = new jsPDF();
    //     console.log("doc",doc);

    //     doc.text("Hello world!",10,10);
    //     // doc.fromHTML($('.screenShot_popup').html(), 15, 15, {
    //     //     'width':170
    //     // })
    //     doc.save('sample.pdf');
    // }
    downloadImg() {
        html2canvas(document.querySelector('#screenShot_popup'))
            .then(async (canvas) => {
                var a = document.createElement('a');
                let canvasDataURL = canvas.toDataURL("image/png")
                a.href = canvasDataURL;
                a.download = `${this.values.title}.png`;
                a.click();
                a.remove();
            });
    }

    downloadPDF() {
        window.jsPDF = window.jspdf.jsPDF;
        let doc = new jsPDF('p', 'mm');
        html2canvas(document.querySelector('#screenShot_popup'))
            .then(async (canvas) => {
                //  var a = document.createElement('a'); 
                let imgData = canvas.toDataURL("image/png");
                // 이미지 가로 길이 (mm) A4 기준 210mm
                let imgWidth = 190;
                let pageHeight = imgWidth * 1.414;
                let imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let margin = 10;
                let position = 0;
                // 첫 페이지 출력
                doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // 한 페이지 이상일 경우 루프 돌면서 출력
                while (heightLeft >= 20) {			// 35
                    position = heightLeft - imgHeight;
                    position = position - 20;		// -25

                    doc.addPage();
                    doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // 파일 저장
                doc.save(`${this.values.title}.pdf`);
            });
    }
}