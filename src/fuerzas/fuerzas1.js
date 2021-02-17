import * as d3 from "d3";


fuerzas1();
function fuerzas1(){
	var margin={top:40,left:40,right:40,bottom:40};
	var ancho=document.getElementById("fuerzas-1").clientWidth;
	var alto=ancho-margin.top-margin.bottom;

	var svg=d3.select("#fuerzas-1")
		.append("svg").style("background","#353336")
		.attr("width",ancho+margin.left+margin.right)
		.attr("height",alto+margin.top+margin.bottom)
		.append("g")
		.attr("translate",`translate(${margin.left},${margin.top})`)
	
	var escalas_radios=.002*ancho, nodePadding = 2.

	d3.csv("../../hopkinsDefunciones_paravis.csv").then(function(ladata){
		//Preparamos los datos
		let paises=ladata.columns.slice(2);
		let data=[];
		for(var i =0;i<paises.length;i++){
			if(+ladata.slice(-1)[0][paises[i]]!=0){
				data.push({pais:paises[i],valor:+ladata.slice(-1)[0][paises[i]]})
			}
		}

		//Desde la data que voy a usar puedo asignar una variable 'radio'

		data.forEach(function(d){
			d.radio=escalas_radios*Math.sqrt(d.valor)
		})

		console.log(data)

		/*Iniciamos simulacion con forceSimulation(data) y agregamos atributos como


		 'x' y 'y' que se refieren al centro de fuerza

		'charge' se refiere a la fuerza entre las partículas... negativa es repulsión
		'collision' se refiere a la distancia a la que nuestros objetos chocan, normalmente será
			el radio que hemos asignado	mas un pequeño padding

		finalmente, cada que la simulacion de un paso, debemos llamar a un función que 
		actualice posiciones ''

	
			
		*/
		var burbujas =svg.selectAll(".circulos")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","circulos")
			.attr("r", d=>d.radio)
			.style("fill","#00ab89")
			.style("stroke","#be27e8")
			.style("stroke-width","2px")
  			.style("stroke-dasharray","3 2")

		var simulation = d3.forceSimulation(data)                    
			.force('charge', d3.forceManyBody().strength(-10))
  			.force('x', d3.forceX().x(function(d) {
			  	return ancho*.5;
			}))
		  	.force('y', d3.forceY().y(function(d) {
			  return alto*.5
			}))
		  	.force('collision', d3.forceCollide().radius(function(d) {
		    	return d.radio+nodePadding
		  	}))
		  	.on('tick', ticked1)

		
		
		function ticked1() {
			burbujas.attr("cx",d=>d.x)
				.attr("cy",d=>d.y)

		}
		/*
		var burbujas2=svg.selectAll(".gupos")
			.data(data)
			.enter()
			.append("g")
			.attr("class",".grupos")
		burbujas2.append("circle")
			.style("fill","#969696")
			.attr("r",d=>d.radio)
		burbujas2.append("text")
			.text(d=>d.pais)
			.style("text-anchor","middle")
		  	.style("dominant-baseline","middle")
		  	.style("font-family","Montserrat")
			.style("font-size","12px").style("text-align","left")
			.style("font-weight","600")
			.style("fill","gray")
		*/
		function ticked2() {
			burbuja2.attr("transform",d=>`translate(${d.x},${d.y})`)


		}

	})



}