
from qgis.core import QgsProject, QgsFeature, QgsGeometry, QgsPoint, QgsVectorLayer

multi_line_layer = QgsProject.instance().mapLayersByName('Line')[0]
polygon_layer = QgsProject.instance().mapLayersByName('polygon')[0]

polygonz_layer = QgsVectorLayer("Polygon?crs=epsg:4326", "Polygon Layer", "memory")
dp = polygonz_layer.dataProvider()

for poly_feat in polygon_layer.getFeatures():
    new_geom = QgsGeometry()
    rings = []

    for ring in poly_feat.geometry().asPolygon():
        points = []
        for pt in ring:
            line_feat = next(multi_line_layer.getFeatures())
            z_value = line_feat.geometry().constGet().vertexAt(0).z()
            points.append(QgsPoint(pt.x(), pt.y(), z_value))
        rings.append(points)
    new_geom = QgsGeometry.fromPolygonXY([rings[0]])
    new_feat = QgsFeature()
    new_feat.setGeometry(new_geom)
    new_feat.setAttributes(poly_feat.attributes())
    dp.addFeature(new_feat)

polygonz_layer.updateExtents()
QgsProject.instance().addMapLayer(polygonz_layer)