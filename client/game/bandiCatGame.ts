/// <reference path="../../typings/threejs/three.d.ts"/>

/// <reference path="../domix/interactive/model.ts" />
/// <reference path="../domix/interactive/app.ts" />


declare var screenfull:any

module game
{
	class Meshes
	{
		private static matPhong = new THREE.MeshPhongMaterial({ color: 0xccddbb })
		static getHero() : THREE.Mesh
		{	
			var geoBox = new THREE.BoxGeometry(70, 56, 94)
			
			return new THREE.Mesh(geoBox, Meshes.matPhong)
		}
	}
	
  export class BandiCatGame extends domix.interactive.App
	{			
		scene: THREE.Scene
		camera: THREE.Camera
		
		matWires = new THREE.MeshBasicMaterial({wireframe: true})
		
		matColor = new THREE.MeshBasicMaterial({color: 0x335588})
		matRedColor = new THREE.MeshBasicMaterial({color: 0x770000})
				
		matGreenColor = new THREE.MeshBasicMaterial({color: 0x33AA22})
		
		geoPlane = new THREE.PlaneBufferGeometry(100, 100)		
		meshPlane = new THREE.Mesh(this.geoPlane, this.matRedColor)
		
		//geoBox = new THREE.BoxGeometry(70, 56, 94)
		//meshBox = new THREE.Mesh(this.geoBox, this.matPhong)
		
		light: THREE.PointLight
		
		meshHero = Meshes.getHero()

		init()
		{
			this.scene = new THREE.Scene()
		  this.renderer.setSize(window.innerWidth, window.innerHeight)
			
			this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
			this.camera.position.z = 300					
			this.scene.add(this.camera)
			
			this.light = new THREE.PointLight( 0xffffff, 1, 100 )	
			this.light.position.set( 15, 50, 37 )
			this.scene.add(this.light)
			
			this.scene.add(this.meshPlane)
			
			this.scene.add(this.meshHero)
		}
		
		update()
		{
			this.meshHero.rotateX(0.02)
			this.meshHero.rotateY(0.031)
			this.meshPlane.rotateZ(0.04)
			this.meshPlane.position.x += 0.2
			
			//var a = new THREE.Euler( 0, 1, 1.57, 'XYZ' );
			//this.meshPlane.applyMatrix()
		}
		
		draw()
		{
			this.renderer.clearColor()
			
		  this.renderer.render(this.scene, this.camera)
		}
	}
//(<any>ko).punches.enableAll()

//ko.applyBindings({ name:'testing punches' })

window.onload = function()
{
	var g = new game.BandiCatGame()
	
	//document.body.innerHTML = ""
	document.body.appendChild(g.domElement)
	
	g.start()
	
//	renderer.domElement.addEventListener(('click'), ()=> 
//		screenfull.request( renderer.domElement))
	

// add it to the WebGL scene
	//scene.add(planeMesh);
	
	// var boxGeo = new THREE.BoxGeometry(.8, .5, .3)
	// 
	// var cube = new THREE.Mesh(geometry, matColor) 
	// scene.add(cube)
	// 
	// camera.position.z = 300

	//var cssRenderer = new (<any>THREE).CSS3DRenderer()
	//cssRenderer.setSize( window.innerWidth, window.innerHeight )
	//cssRenderer.domElement.style.position = 'absolute'
	//cssRenderer.domElement.style.top = 0
	
	// function render() {
	// 	requestAnimationFrame(render)
	// 	
	// 	this.renderer.clearColor()
	// 	this.renderer.render(scene, camera)
	// }
	// render();
}




}