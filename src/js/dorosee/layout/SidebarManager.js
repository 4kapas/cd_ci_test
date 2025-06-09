export class SidebarManager {
    constructor() {}

    init() {
		return;
        this.text = `
		<div class="sidebar_top_wrapper">
			<div class="search_wrap">
				<button class="input" id="search_address" readonly>
					주소를 입력해주세요
				</button>
				<button class="search_btn" onclick="execDaumPostcode()">
					검색
				</button>
			</div>


			<!-- SCENE -->
			<!--
			<h3 id="menu_scene_dorosee"><span data-i18n="tb.scene_opt" style="display:none;"></span></h3>
			<div class="pv-menu-list" style="overflow-y: auto; width: 100%;">

				<div id="scene_export"></div>

				<div class="divider"><span>Objects</span></div>

				<div id="scene_objects"></div>

				<div class="divider"><span>Properties</span></div>

				<div id="scene_object_properties"></div>

				<div class="divider"><span>Background</span></div>

				<li>
					<selectgroup id="background_options">
						<option id="background_options_skybox" value="skybox">Skybox</option>
						<option id="background_options_gradient" value="gradient">Gradient</option>
						<option id="background_options_black" value="black">Black</option>
						<option id="background_options_white" value="white">White</option>
						<option id="background_options_none" value="null">None</option>
					</selectgroup>
				</li>
				

				<div class="divider"><span>Clipping</span></div>

				<li id="clipping_tools"></li>

				<li>
					<selectgroup id="cliptask_options">
						<option id="cliptask_options_none" value="NONE">None</option>
						<option id="cliptask_options_highlight" value="HIGHLIGHT">Highlight</option>
						<option id="cliptask_options_show_inside" value="SHOW_INSIDE">Inside</option>
						<option id="cliptask_options_show_outside" value="SHOW_OUTSIDE">Outside</option>
					</selectgroup>
				</li>

				<li>
					<selectgroup id="clipmethod_options">
						<option id="clipmethod_options_any" value="INSIDE_ANY">Inside Any</option>
						<option id="clipmethod_options_all" value="INSIDE_ALL">Inside All</option>
					</selectgroup>
				</li>
				<div class="divider"><span>Navigation</span></div>
				<li id="navigation"></li>

				<li><span data-i18n="appearance.move_speed"></span>: <span id="lblMoveSpeed"></span>
					<div id="sldMoveSpeed"></div>
				</li>
			</div>
			-->
		</div>
		<textarea readonly id="polygonValueArea">
		</textarea>
        `

        document.querySelector("#sidebar").innerHTML = this.text;
        
    }
}