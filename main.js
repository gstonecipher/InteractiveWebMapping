require([
  "esri/views/MapView",
  "esri/WebMap",
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/widgets/BasemapToggle",
  "esri/widgets/ScaleBar"
  ], (
		MapView,
		WebMap,
		FeatureLayer,
    Graphic,
		SimpleRenderer,
    UniqueValueRenderer,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    CSVLayer,
		Legend,
    BasemapToggle,
    ScaleBar
		) => {

        // modal code from w3 https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
        // modal use inspired by David Grolling's app
        // set up modal - welcome info upon opening
        var modal = document.getElementById("welcome");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };

        // create webmap object and set initial satellite basemap
        const webmap = new WebMap({
					basemap: "satellite",
				});

        // create 2D map view, zoomed to NH-37
        const view = new MapView({
          map: webmap,
          container: "viewDiv",
          center: [93.353397, 26.583813],
          zoom: 11,
          padding: {
            top: 40
          }
        });

        // create basemap toggle for gray map
        var toggle = new BasemapToggle({
          view: view,
          nextBasemap: "gray-vector"
        });

        // create scale bar
        var sbar = new ScaleBar({
          view: view,
          style: "line",
          unit: "non-metric"
        });

        //create template for pop-ups
        var template = {
          title: "{Species}",
          content: "Scientific Name: <i>{ScientificName}</i> </br> Species Category: {SpeciesCategory} <br />Status: {AnimalStatus} <br />Season: {Season} <br /> Date: {Date}",
          fieldInfos: [{
            fieldName: "Date",
            format: {
              dateFormat: "short-date" // set date format - don't show time
            }
          }]
        };

        // create all symbols
        const roadSym = new SimpleLineSymbol({
          color: "black",
          style: "solid",
          width: 2,
        })

        const parkSym = new SimpleFillSymbol({
          color: [93, 166, 126,.8],
          outline: null
        });

        ptSize = "8px" //make it easy to change all symbols at once

        //set unique symbols for each species type
        const birdSym = new SimpleMarkerSymbol({
          color: "#1b9e77",
          style: "circle",
          size: ptSize,
          outline: {
            width: .5
          }
        });

        const herpSym = new SimpleMarkerSymbol({
          color: "#d95f02",
          style: "circle",
          size: ptSize,
          outline: {
            width: .5
          }
        });

        const mesoSym = new SimpleMarkerSymbol({
          color: "#7570b3",
          style: "circle",
          size: ptSize,
          outline: {
            width: .5
          }
        });

        const otherSym = new SimpleMarkerSymbol({
          color: "#e7298a",
          style: "circle",
          size: ptSize,
          outline: {
            width: .5
          }
        });

        const primateSym = new SimpleMarkerSymbol({
          color: "#66a61e",
          style: "circle",
          size: ptSize,
          outline: {
            width: .5
          }
        });

        const ungSym = new SimpleMarkerSymbol({
          color: "#e6ab02",
          style: "circle",
          size: ptSize,
          outline: {
            width: .5
          }
        });

        // create all renderers
        // create roads renderer
        const roadRenderer = new SimpleRenderer({
          symbol: roadSym
        });

        // create species renderer
        const speciesRenderer = new UniqueValueRenderer({
          field: "SpeciesCategory",
          legendOptions:{
            title: "Species Category" // set title above color scale
          },
          uniqueValueInfos: [
            {
              value: "Bird",
              symbol: birdSym,
              label: "Bird" // label in legend
            },
            {
              value: "Herptile",
              symbol: herpSym,
              label: "Herptile" // label in legend
            },
            {
              value: "Mesocarnivore",
              symbol: mesoSym,
              label: "Meso-Carnivore" // label in legend
            },
            {
              value: "Other Mammal",
              symbol: otherSym,
              label: "Other Mammal" // label in legend
            },
            {
              value: "Primate",
              symbol: primateSym,
              label: "Primate" // label in legend
            },
            {
              value: "Ungulate",
              symbol: ungSym,
              label: "Ungulate" // label in legend
            },
          ]
        });

        // create parks renderer
        const parkRenderer = new SimpleRenderer({
          symbol: parkSym
        })

        // set label symbol for parks
        labelSymbol = {
          type: "text", // autocast as new TextSymbol()
          color: "gray",
          text: "KARBI-ANGLONG DISTRICT", //only applies to graphic
          haloColor: "white",
          haloSize: 1,
          font: { //autocast as new Font()
            family: "sans-serif",
            size: 10,
            weight: "bold"
          },
        }

        // set label parameters for parks
        const parksLabel = { //autocast as new labelClass()
          symbol: labelSymbol,
          labelPlacement: "always-horizontal",
          labelExpressionInfo: {
              expression: "upper($feature.NAME)"
            }
        };

        // create dummy point so that label shows up closer to road
        const karbiPoint = {
          type: "point", //autocasts as point
          latitude: 26.517187,
          longitude: 93.410373
        };

        // create graphic for dummy point
        var karbiPointGraphic = new Graphic({
          geometry: karbiPoint,
          symbol: labelSymbol
        });

        // add road feature
        const assamRoad = new FeatureLayer({
          url: "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/AssamRoad/FeatureServer",
          renderer: roadRenderer
        });

        // add karbi anglong hills feature
        const karbiPoly = new FeatureLayer({
          url: "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Karbianglong_district_bnd/FeatureServer",
          renderer: parkRenderer,
          maxScale: 0,
        });

        const kazirangaPoly = new FeatureLayer({
          url: "https://services9.arcgis.com/6EuFgO4fLTqfNOhu/arcgis/rest/services/Kazaranga_NP/FeatureServer",
          renderer: parkRenderer,
          labelingInfo: [parksLabel],
          maxScale: 0,
        });

        // pull in CSV layer with x,y values
        var speciesData = new CSVLayer({
          url: "https://pennstate.maps.arcgis.com/sharing/rest/content/items/fad5ca06e8974ee0a24a6bc2c7fc789f/data",
          delimiter: ",",
          latitudeField: "Latitude",
          longitudeField: "Longitude",
          objectIDField: "ObjectID",
          orderBy:[{ //show most recent points on top
            field: "Date",
            order: "descending"
          }],
          outFields: ["*"],
          popupEnabled: true,
          popupTemplate: template,
          renderer: speciesRenderer, // visualization
          timeInfo: {
            startField: "Date"
          },
        });

        //set default for all checkboxes- checked
        var season1On = true;
        var season2On = true;
        var status1On = true;
        var status2On = true;
        var status3On = true;
        var species1On = true;
        var species2On = true;
        var species3On = true;
        var species4On = true;
        var species5On = true;
        var species6On = true;

        //set up event listeners for every checkbox
        document.getElementById("season1").addEventListener("change", function(event){
          season1On = event.target.checked; //update value
        });

        document.getElementById("season2").addEventListener("change", function(event){
          season2On = event.target.checked;
        });

        document.getElementById("status1").addEventListener("change", function(event){
          status1On = event.target.checked;
        });

        document.getElementById("status2").addEventListener("change", function(event){
          status2On = event.target.checked;
        });

        document.getElementById("status3").addEventListener("change", function(event){
          status3On = event.target.checked;
        });

        document.getElementById("species1").addEventListener("change", function(event){
          species1On = event.target.checked;
        });

        document.getElementById("species2").addEventListener("change", function(event){
          species2On = event.target.checked;
        });

        document.getElementById("species3").addEventListener("change", function(event){
          species3On = event.target.checked;
        });

        document.getElementById("species4").addEventListener("change", function(event){
          species4On = event.target.checked;
        });

        document.getElementById("species5").addEventListener("change", function(event){
          species5On = event.target.checked;
        });

        document.getElementById("species6").addEventListener("change", function(event){
          species6On = event.target.checked;
        });

        // set up function to filter the data based on which boxes are checked
        document.getElementById("filterBtn").addEventListener("click", function(event) {

          //define variables outside of if statements
          var seasonArray = [];
          var whereSeason;
          var statusArray = [];
          var whereStatus;
          var speciesArray = [];
          var whereSpecies;

          var fullWhereClause;

          //set up Season where clause based on checkboxes
          if (season1On){
            seasonArray.push(document.getElementById("season1").value)
          };

          if (season2On){
            seasonArray.push(document.getElementById("season2").value)
          };

          // create where clause for season
          whereSeason = seasonArray.join(' OR ')

          //set up Status where clause based on checkboxes
          if (status1On){
            statusArray.push(document.getElementById("status1").value)
          };

          if (status2On){
            statusArray.push(document.getElementById("status2").value)
          };

          if (status3On){
            statusArray.push(document.getElementById("status3").value)
          };

          // create where clause for status
          whereStatus = statusArray.join(' OR ')

          // set up Species where clause based on checkboxes
          if (species1On){
            speciesArray.push(document.getElementById("species1").value)
          };

          if (species2On){
            speciesArray.push(document.getElementById("species2").value)
          };

          if (species3On){
            speciesArray.push(document.getElementById("species3").value)
          };

          if (species4On){
            speciesArray.push(document.getElementById("species4").value)
          };

          if (species5On){
            speciesArray.push(document.getElementById("species5").value)
          };

          if (species6On){
            speciesArray.push(document.getElementById("species6").value)
          };

          // create where clause for species
          whereSpecies = speciesArray.join(' OR ')

          // join where clauses together
          fullWhereClause = '(' + whereSeason + ') AND (' + whereStatus + ') AND (' + whereSpecies + ')';

          // set definition expression to filter data
          speciesData.definitionExpression =  fullWhereClause;

          // error handling if result will give no data
          if (whereSeason.length == 0 || whereStatus.length == 0 || whereSpecies.length == 0){
            alert("Make sure that at least one item in each category is checked")
          };
        }); //end of filter function

        // set up toggle between different vizualitions

        // set up event for Show Data Button on click
        document.getElementById("dataBtn").addEventListener("click", function(event) {
          // make button turn gray
          document.getElementById("dataBtn").classList.add("active");

          // turn other buttons white
          //classList.remove does not throw error if element doesn't exist
          // keeps code cleaner than if statements
          document.getElementById("clusterBtn").classList.remove("active")
          document.getElementById("heatmapBtn").classList.remove("active")

          // update vizualition
          speciesData.featureReduction = null; // get rid of clusters
          speciesData.renderer = speciesRenderer; // reset renderer
        }); //end of data function

        // set up event for Show Heatmap Button on click
        document.getElementById("heatmapBtn").addEventListener("click", function(event) {
          document.getElementById("heatmapBtn").classList.add("active");
          document.getElementById("clusterBtn").classList.remove("active");
          document.getElementById("dataBtn").classList.remove("active");

          // update visualization
          speciesData.featureReduction = null; //get rid of clusters
          // set new renderer
          speciesData.renderer = {
            type: "heatmap",
            colorStops: [
              { ratio: 0, color: "rgba(255, 255, 255, 0)" },
              { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
              { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
              { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
              { ratio: 1, color: "rgba(255, 0, 0, 1)" }
            ],  //white-yellow-orange-red color ramp
            minPixelIntensity: 0,
            maxPixelIntensity: 20, //20+ observations will be red
            blurRadius: 5,
          };
        }); //end of heatmap function

        // set up event for Show Clusters Button on click
        document.getElementById("clusterBtn").addEventListener("click", function(event) {
          document.getElementById("clusterBtn").classList.add("active");
          document.getElementById("dataBtn").classList.remove("active");
          document.getElementById("heatmapBtn").classList.remove("active");

          // update renderer to clear heatmap if needed
          speciesData.renderer = speciesRenderer;

          // have to use v 4.16 for this to work with the labels
          // use featureReduction to create clusters
          speciesData.featureReduction = {
              type: "cluster",
              clusterMinSize: "14px", // big enough to contain label
              clusterMaxSize: "60px",
              clusterRadius: "60",  // how close points need to be to cluster
              popupTemplate: {
                content: "This cluster represents {cluster_count} animals."
              },
              labelingInfo: [{
                //deconflictionStrategy: "none",
                labelExpressionInfo: { //show number of observations in cluster
                  expression: "$feature.cluster_count"
                },
                symbol: {
                  type: "text",
                  color: "black",
                  font: {
                    weight: "bold",
                    family: "Noto Sans",
                    size: "12px"
                  }
                },
              labelPlacement: "center-center",
              }],
              labelsVisible: true
          };
        }); //end of clusters function

        // add all layers to map
        webmap.addMany([kazirangaPoly, karbiPoly, assamRoad, speciesData])

        // add Karbi label to map
        view.graphics.add(karbiPointGraphic)

        // create legend
        var legend = new Legend({
          view: view,
          layerInfos: [
          {
            layer: speciesData,
            title: "Legend"
          }],
          style: {
            type: "card",
            layout: "stack"
          }
        });

      //add all widgets to map
  		view.ui.add([
        {
          component: toggle, // add basemap toggle
          position: "top-left",
          index: 1 // add below slider
        },
        {
          component: legend,
          position: "bottom-left",
          index: 1
        },
        {
          component: sbar,
          position: "bottom-left",
          index: 1
        },
      ]);
});
