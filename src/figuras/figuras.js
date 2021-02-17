import * as d3 from "d3";

visualizacionPaths()


function visualizacionPaths(){
	var margin={top:40,bottom:40,left:40,right:40}
	var ancho=parseInt(document.getElementById("figuras-3").clientWidth)-margin.left-margin.right
	var alto=ancho*.9-margin.top-margin.bottom;
var rmin=ancho*.2
    var rmax=ancho*.45

	//Creamos el SVG y trasladamos pero al centro
	var svg=d3.select("#figuras-3")
		.append("svg")
		.attr("width",ancho+margin.left+margin.right)
		.attr("height",alto+margin.top+margin.bottom)
		.append("g")
		.attr("transform","translate("+ancho*.5+","+alto*.5+")")

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

		//Lista de paises 
		var keys = Object.keys(dict_cats)

		//En lugar de escalas x y y, asigno a la fecha un ángulo y a la cantidad un radio

		var angScale=d3.scaleLinear()
	    	.domain(d3.extent(data, function(d) { return d.fech; }))
	    	.range([ -Math.PI*.5, .5*Math.PI ]);
	    var radScale=d3.scaleLinear()
	    	.domain([0,d3.max(data.map(d=>d.totoD))])
	    	.range([ rmin,rmax]);

	    //Esto es solo para agregar ejes de meses

	   	svg.selectAll("lins")
	   		.data(data.filter(d=>d.fech.getDate()==1))
	   		.enter()
	   		.append("line")
	   		.attr("x1",d=>rmin*Math.cos(angScale(d.fech)))
	   		.attr("x2",d=>rmax*Math.cos(angScale(d.fech)))
	   		.attr("y1",d=>rmin*Math.sin(angScale(d.fech)))
	   		.attr("y2",d=>rmax*Math.sin(angScale(d.fech)))
	   		.style("stroke","gray")
	   	svg.selectAll("texs")
	   		.data(data.filter(d=>d.fech.getDate()==1))
	   		.enter()
	   		.append("text")
	   		.attr("x",d=>rmax*Math.cos(angScale(d.fech)))
	   		.attr("y",d=>rmax*Math.sin(angScale(d.fech)))
	   		.text(d=>(d.fech.getMonth()+1)+"-"+(1900+d.fech.getYear()))

	  	
 		// Puedo agregar el eje radial
	    svg.append("g")
    	.call(d3.axisLeft(radScale)).attr("class","ejex eje");

	  	

		  // Escala Ordinal
		var color = d3.scaleOrdinal()
		    .domain(keys)
		    .range(Object.values(dict_cats));

		  //Apilando la data 
		var stackedData = d3.stack()
		    .offset(d3.stackOffsetNone)
		    .keys(keys)
		    (data)

		//LA misma función que hice que ordenara los paths    
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
	    

		//LA función que creara los paths ahora toma x0 y x1 y uso unas entidades trigonometricas para 
		//Asignar los puntos
	    var area = d3.area()
		    .x0(function(d) { return radScale(d[0])*Math.cos(angScale(d.data.fech)); })
		    .x1(function(d){ return radScale(d[1])*Math.cos(angScale(d.data.fech))})
		    .y0(function(d) { return radScale(d[0])*Math.sin(angScale(d.data.fech)); })
		    .y1(function(d){ return radScale(d[1])*Math.sin(angScale(d.data.fech))})
		    .curve(d3.curveCatmullRom)
		    //.curve(d3.curveLinear)


	  	svg
		    .selectAll("mylayers")
		    .data(stackedData)
		    .enter()
		    .append("path")
		    .attr("class", "myArea")
		    .style("fill-opacity",".9")
		    .style("fill", function(d) { return dict_cats[d.key]; })
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