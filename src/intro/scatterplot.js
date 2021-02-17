import * as d3 from "d3";


scatterplot()
function scatterplot(){

	//Tomo el ancho del contenedor y el alto al 50%
	var margin={top:40,bottom:30,left:70,right:30}
	var ancho=parseInt(document.getElementById("scatterplot").clientWidth)-margin.left-margin.right
	var alto=ancho*.9-margin.top-margin.bottom;
	//Creamos el SVG
	var svg1=d3.select("#scatterplot")
		.append("svg")
		.attr("width",ancho+margin.left+margin.right)
		.attr("height",alto+margin.top+margin.bottom)

	var svg_defs=svg1.append("defs")
	var linearGradient=svg_defs.append("linearGradient")
		.attr("id","degradado")
		.attr("x1","0%")
		.attr("y1","0%")
		.attr("x2","100%")
		.attr("y2","0%")
	linearGradient.append("stop")
		.attr("offset","0%")
		.attr("style","stop-color:#66D7D1;stop-opacity:1")
	linearGradient.append("stop")
		.attr("offset","100%")
		.attr("style","stop-color:#FC7753;stop-opacity:1")


	var svg=svg1.append("g")
		.attr("transform","translate("+margin.left+","+margin.top+")")
	//Formato de tiempo
	var parseDate = d3.timeParse("%Y-%m-%d");

	//Escalas
	var escalaX=d3.scaleTime()
		.range([ 0, ancho ]);

	var escalaY=d3.scaleLinear()
		.range([alto,0])

	//Abrimos datos
	d3.csv("../../BaseEstadosPositivosyDefunciones.csv").then(function(ladata){
		//Ajustamos formatos
		ladata.forEach(function(d){
			d.fecha=parseDate(d.Fecha)
			d.Positivos=+d.Positivos
			d.Defunciones=+d.Defunciones
		})
		//Filtramos
		var data=ladata.filter(d=>d.Estado=="Ciudad de México");

		//Configuramos escalas
		escalaX.domain(d3.extent(data.map(d=>d.fecha)))
		escalaY.domain(d3.extent(data.map(d=>d.Positivos)))

		//Agregamos puntos
		var circulos=svg.selectAll("circulos")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx",d=>escalaX(d.fecha))
			.attr("cy",d=>escalaY(d.Positivos))
			.attr("r",d=>Math.sqrt(d.Defunciones))
			.style("fill","url(#degradado)")
		var ejeX=svg.append("g")
			.attr("transform", "translate(0," + alto + ")")
			.call(d3.axisBottom(escalaX).tickFormat(d3.timeFormat("%d-%m-%Y")))
			.attr("class","ejex")
		var ejeY=svg.append("g")
			.call(d3.axisLeft(escalaY).ticks(5))
			.attr("class","ejey")
		ejeX.selectAll("path").style("stroke-opacity","0")
		ejeY.selectAll("path").style("stroke-opacity","0")

window.onresize = reescalado;
	 	function reescalado(){

	 		ancho=parseInt(document.getElementById("scatterplot").clientWidth)-margin.left-margin.right
			alto=ancho*.9-margin.top-margin.bottom;

			svg1.attr("width",ancho+margin.left+margin.right)
				.attr("height",alto+margin.top+margin.bottom)
	 		escalaX.range([ 0, ancho ]);
			escalaY.range([alto,0])
			ejeX.attr("transform", "translate(0," + alto + ")")
				.call(d3.axisBottom(escalaX).tickFormat(d3.timeFormat("%d-%m-%Y")))
			ejeY.call(d3.axisLeft(escalaY).ticks(5))

			circulos.attr("cx",d=>escalaX(d.fecha))
			.attr("cy",d=>escalaY(d.Positivos))
			console.log("reescalando")

	 	}

	})

}