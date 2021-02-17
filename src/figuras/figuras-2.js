import * as d3 from "d3";

visualizacionPaths()


function visualizacionPaths(){
	var margin={top:40,bottom:40,left:40,right:40}
	var ancho=parseInt(document.getElementById("figuras-2").clientWidth)-margin.left-margin.right
	var alto=ancho*.9-margin.top-margin.bottom;



	//Creamos el SVG
	var svg=d3.select("#figuras-2")
		.append("svg")
		.attr("width",ancho+margin.left+margin.right)
		.attr("height",alto+margin.top+margin.bottom)
		.append("g")
		.attr("transform","translate("+margin.left+","+margin.top+")")

	//Formato de tiempo
	var parseDate = d3.timeParse("%Y-%m-%d");
	var monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio","julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
	d3.csv("../../hopkinsDefunciones_paravis2.csv").then(function(data){
		//Preparación de bases de datos
		let paises=data.columns.slice(2);

		data.forEach(function(d){
			d.fech=parseDate(d.time)
			for(var i= 0 ; i<paises.length;i++){
				d[paises[i]]=+d[paises[i]]
			}
		})
		data.forEach(function(d){

			d.totoD=d3.sum(Object.values(d).slice(2,-1).map(function(dd){return dd}))
		})
		//Creo diccionario de colores aleatorios
		var dict_cats={};
		for(var i= 0 ; i<paises.length;i++){
			dict_cats[paises[i]]=`rgb(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)})`
			}

		var keys = Object.keys(dict_cats)

		//creando escalas
	    var escalaX = d3.scaleTime()
	    	.domain(d3.extent(data, function(d) { return d.fech; }))
	    	.range([ 0, ancho ]);
	    var escalaY = d3.scaleLinear()
		    .domain([0,d3.max(data.map(d=>d.totoD))])
		    .range([ alto, 0 ]);


	  	
		//AGregando ejes  
	    svg.append("g")
    		.call(d3.axisLeft(escalaY)).attr("class","ejey eje");
    	svg.append("g")
	    	.attr("transform", "translate(0," + alto+ ")")
	    	.call(d3.axisBottom(escalaX).tickFormat(d3.timeFormat("%d-%m-%Y"))).attr("class","ejex eje").selectAll("text")	
	        .style("text-anchor", "end")
	       	.attr("dx", "-.8em")
	        .attr("dy", ".15em")
	        .attr("transform", "rotate(-65)")
	  	

	  	

		  //Escala ordinal
		var color = d3.scaleOrdinal()
		    .domain(keys)
		    .range(Object.values(dict_cats));

		  //Apilando la data
		var stackedData = d3.stack()
		    .offset(d3.stackOffsetNone)
		    .keys(keys)
		    (data)

		//Aqui me invento un pedazo de codigo para reordenar los datos de las franjas, manteniendo siempre
		// los anchos (deltas)

		for(var i = 0 ; i<data.length; i ++ ){
			var dictsStack=[];
			for (var cats=0; cats<stackedData.length;cats++){
				dictsStack[cats]={
					"cat":cats,
					"intervalo":stackedData[cats][i],
					"delta":stackedData[cats][i][1]-stackedData[cats][i][0]
				}
			}
			let eff=dictsStack.sort((a,b)=>d3.ascending(a.delta,b.delta))
			let contador_apilador=0;
			for (var cats=0; cats<stackedData.length;cats++){
				dictsStack[cats].intervalo=[contador_apilador,contador_apilador+dictsStack[cats].delta];
				stackedData[dictsStack[cats].cat][i][0]=contador_apilador
				stackedData[dictsStack[cats].cat][i][1]=contador_apilador+dictsStack[cats].delta
				contador_apilador+=dictsStack[cats].delta;
			}
		}

		//Defino de la misma manera la funcion que creara los paths
	    

	    var area = d3.area()
		    .x(function(d) { return escalaX(d.data.fech)})
		    .y0(function(d) { return escalaY(d[0]) })
		    .y1(function(d){ return escalaY(d[1])})
		    .curve(d3.curveCatmullRom)
		    //.curve(d3.curveLinear)

		//Agregamos paths
	  	svg
		    .selectAll("mylayers")
		    .data(stackedData)
		    .enter()
		    .append("path")
		    .attr("class", "myArea")
		    .style("fill-opacity",".9")
		    .style("fill", function(d) {return dict_cats[d.key]; })
		    .attr("d", area)
		    .on("mouseover",function(event,d){
		    	console.log(d.key)
		    	
		    	svg.selectAll("path.myArea")
		    		.style("fill-opacity",".1")

		    	d3.select(this)
		    		.style("fill-opacity","1")
		    })
		    .on("mouseout",function(event,d){
		    	svg.selectAll("path.myArea")
		    		.style("fill-opacity",".9")

		    })
	

	})

}