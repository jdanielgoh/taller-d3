import * as d3 from "d3";

barras1();



function barras1(){

	var lista=[2,24,15,30,14,22,42];
	
	var ancho=parseInt(document.getElementById("barras-1").clientWidth)

	var svg=d3.select("#barras-1")
		.append("svg")
		.attr("width",ancho)
		.attr("height","100")


	var barras=svg.selectAll("rectangulos")
		.data(lista)
		.enter()
		.append("rect")
		.attr("x",function(d,i){
			return i*20
		})
		.attr("y","0")
		.attr("height",function(d,i){
			return d
		})
		.attr("width",10)
		/*.style("fill","#c94949")
		.style("fill-opacity",function(d,i){
			return i/10
		})*/
	
}
