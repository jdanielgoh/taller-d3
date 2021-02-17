import * as d3 from "d3";

barras2();



function barras2(){
	//Tomo el ancho del contenedor y el alto al 50%
	var margin={top:40,bottom:30,left:70,right:30}
	var ancho=parseInt(document.getElementById("barras-2").clientWidth)-margin.left-margin.right
	var alto=ancho*.5-margin.top-margin.bottom;
	//Creamos el SVG
	var svg=d3.select("#barras-2")
		.append("svg")
		.attr("width",ancho+margin.left+margin.right)
		.attr("height",alto+margin.top+margin.bottom)
		.append("g")
		.attr("transform","translate("+margin.left+","+margin.top+")")
	//Ire creando  funciones que me ayudaran a reescalar los datos, 
	//Mas adelante les atribuire más especificaciones
	//Formato temporal
	var parseDate = d3.timeParse("%Y-%m-%d");

	//Escalas
	var escalaX=d3.scaleTime()
		.range([ 0, ancho ]);

	var escalaY=d3.scaleLinear()
		.range([alto,0])

	var escalaRangeBand=d3.scaleBand()
        .range([0,ancho])
        .padding(.2)

	//Cargamos un csv
	d3.csv("../../BaseEstadosPositivosyDefunciones.csv").then(function(ladata){
		//Transformamos time a formato temporal
		ladata.forEach(function(d){
			d.fecha=parseDate(d.Fecha)
			d.Positivos=+d.Positivos
			d.Defunciones=+d.Defunciones
		})

		var data=ladata.filter(d=>d.Estado=="Ciudad de México");
		console.log(data)
		//Ajustamos dominios de escalas
		escalaX.domain(d3.extent(data.map(d=>d.fecha)))
		escalaY.domain(d3.extent(data.map(d=>d.Positivos)))
		
		escalaRangeBand.domain(data.sort((a,b)=>a.fecha-b.fecha).map(d=>d.fecha))

		//Agregamos los ejes 

		var ejeX=svg.append("g")
			.attr("transform", "translate(0," + alto + ")")
			.call(d3.axisBottom(escalaX).tickFormat(d3.timeFormat("%d-%m-%Y")))
			.attr("class","ejex")
		var ejeY=svg.append("g")
			.call(d3.axisLeft(escalaY).ticks(5))
			.attr("class","ejey")
		//Creamos las barras de positivos

		var barras =svg.selectAll(".barras")
			.data(data)
			.enter()
			.append("rect")
			.attr("x",function(d){
				return escalaRangeBand(d.fecha)
			})
			.attr("y",function(d){return escalaY(d.Positivos)})
			.attr("height",function(d){
				return escalaY(0)-escalaY(d.Positivos)
			})
			.attr("width",escalaRangeBand.bandwidth())
			.style("fill","#017a8c")

		//Creamos una linea con d3.line
		var linea=svg.selectAll(".linea")
			.data([data])
			.enter()
			.append("path")
			.attr("d",function(d){
				
				return d3.line()
					.x(function(dd){return escalaX(dd.fecha)})
					.y(function(dd){return escalaY(+dd.Positivos)})
					(d)
			})
			.attr("class","linea")
			.style("stroke-width","1.5px")
			.style("fill","none")
			.style("stroke","#018c52")
		
		/// Explorando transiciones y eventos:
		svg.on("click",function(event,dd){
			//barras.transition().duration(1000).style("fill","#c48600")
			//barras.transition().delay((d,i)=>10*i).duration(10).style("fill","#c48600")
			

			/*
			//escalaY.domain(d3.extent(data.map(d=>d.Defunciones)))
			//ejeY.transition().duration(1000).call(d3.axisLeft(escalaY).ticks(5))
			barras.transition()
				.duration(1000)
				.attr("y",function(d){return escalaY(d.Defunciones)})
				.attr("height",function(d){return escalaY(0)-escalaY(d.Defunciones)})
				.style("fill","black")
			linea.transition()
				.duration(1000)
				.attr("d",function(d){
					return d3.line()
						.x(function(dd){return escalaX(dd.fecha)})
						.y(function(dd){return escalaY(+dd.Defunciones)})
						(d)
				})
			
			*/


		})


		
		





	})
	




}
