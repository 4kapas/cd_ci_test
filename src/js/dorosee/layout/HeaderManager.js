export class HeaderManager {
    constructor(isExpress) {
        this.isExpress = isExpress;
        this.pre = this.isExpress ? "" : `/img/icons`;
    }

    init() {
        this.text = `
            <div class="nav_top_bar"></div>
            <div class="title">의사결정지원시스템</div>
            <div class="nav_btn_wrapper">
                <div style="display:flex;">
                    <button class="top_icon_wrapper" id="toggleSidebar" style="display:none;">
                        <img src="${this.pre}/hamburger.svg" class="top_icon" style="width:34px;" />
                    </button>

                    <!-- <button class="canvas2 top_icon_wrapper" style="margin-left: 2px;">
                        <img src="${this.pre}/3d.svg" class="top_icon" style="width:34px;" />
                    </button> -->

                    <button class="top_icon_wrapper" id="toggleReport">
                        <img src="${this.pre}/report.svg" class="top_icon" />
                    </button>

                    <button class="cm_btn00 top_icon_wrapper" tabindex="-1">
                        <label for="fileUploadSelect" class="load_file" style="cursor:pointer"><img class="top_icon"
                                src="${this.pre}/json_get.svg" /></label>
                        <input id="fileUploadSelect" type="file" tabindex="-1" value="" style="display: none" />
                    </button>

                    <button class="cm_btn00 top_icon_wrapper" tabindex="-1">
                        <label for="ShapefileUploadSelect" class="load_file" style="cursor:pointer">
                            <img class="top_icon" src="${this.pre}/shape_get.svg" />
                        </label>
                        <input id="ShapefileUploadSelect" type="file" tabindex="-1" value="" style="display: none"
                            multiple="multiple" />
                    </button>

                    <div id="scene_export_dorosee" style="display:flex; cursor: pointer;"></div>
                    <button class="top_icon_wrapper" id="captureCanvas">
                        <img src="${this.pre}/screenshot.svg" class="top_icon" />
                    </button>

                    <button class="top_icon_wrapper" id="shapeToggleBtn">
                        <img src="${this.pre}//shape.svg" class="top_icon" />
                    </button>
                    <!-- <div id="shpBtn">shapeBtn</div> -->

                    <div class="shapeContainer">
                        <label for="range-input">Select a value:</label>
                        <input type="range" id="shapeZRange" name="range-input" min="0" max="100" value="50" step="1">
                        <p id="shapeZRangeP"></p>
                    </div>


                </div>
                <div style="height: 100%; margin-right:15px; display:none;" id="testIconDiv"></div>
            </div>
        `
        document.querySelector("#header").innerHTML = this.text;

        // document.body.insertBefore($div,document.body.firstChild);
    }
}