

import {MeasurePanel} from "./MeasurePanel.js";

export class AreaPanel extends MeasurePanel{
	constructor(viewer, measurement, propertiesPanel){
		super(viewer, measurement, propertiesPanel);

		let removeIconPath = Potree.resourcePath + '/icons/remove.svg';
		this.elContent = $(`
			<div class="measurement_content selectable">
				<span class="coordinates_table_container"></span>
				<br>
				<span style="font-weight: bold">Area: </span>
				<span id="measurement_area"></span>
				<br>
				<span style="font-weight: bold">Center: </span>
				<br>
				<span id="measurement_area_center"></span>
				<!-- ACTIONS -->
				<div style="display: flex; margin-top: 12px">
					<span></span>
					<span style="flex-grow: 1"></span>
					<img name="remove" class="button-icon" src="${removeIconPath}" style="width: 16px; height: 16px"/>
				</div>
			</div>
		`);


		this.elRemove = this.elContent.find("img[name=remove]");
		this.elRemove.click( () => {
			this.viewer.scene.removeMeasurement(measurement);
		});

		this.propertiesPanel.addVolatileListener(measurement, "marker_added", this._update);
		this.propertiesPanel.addVolatileListener(measurement, "marker_removed", this._update);
		this.propertiesPanel.addVolatileListener(measurement, "marker_moved", this._update);

		this.update();
	}

	getCenter() {
		let x = 0;
		let y = 0;
		let z = 0;

		for(let point of this.measurement.points){
			let position = point.position;
			x += position.x;
			y += position.y;
			z += position.z;

		}

		x /= this.measurement.points.length;
		y /= this.measurement.points.length;
		z /= this.measurement.points.length;

		let center = {
			x:x,
			y:y,
			z:z
		}

		return center;
	}

	update(){
		let elCoordiantesContainer = this.elContent.find('.coordinates_table_container');
		elCoordiantesContainer.empty();
		elCoordiantesContainer.append(this.createCoordinatesTable(this.measurement.points.map(p => p.position)));

		let elArea = this.elContent.find(`#measurement_area`);
		elArea.html(this.measurement.getArea().toFixed(3));
		
		let elCenter = this.elContent.find(`#measurement_area_center`);
		let center = this.getCenter();
		elCenter.html(`
		<span> x : </span><span id="centerX">${center.x}</span> <br>
		<span> y : </span><span id="centerY">${center.y}</span> <br>
		<span> z : </span><span id="centerZ">${center.z}</span> <br>
		`);
	}
};