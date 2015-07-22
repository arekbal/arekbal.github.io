/// <reference path="../../typings/knockout/knockout.d.ts"/>
/// <reference path="../../typings/threejs/three.d.ts"/>

declare var screenfull:any

module my
{
	export class BaseGame
	{
		private _renderer = new THREE.WebGLRenderer()
		
		get renderer() : THREE.WebGLRenderer
		{
			return this._renderer		
		}
		
		get domElement() : HTMLCanvasElement
		{
			return this._renderer.domElement
		}
				
		protected init()
		{			
		}	
		
		protected update()
		{		
		}	
				
		protected draw()
		{			
		}
		
		private lastAnimationFrame = 0
				
		start()
		{	
			this._renderer.setClearColor(0x446688)
			
			this.init()
			
			this.lastAnimationFrame = requestAnimationFrame(this.render.bind(this))
		}
		
		stop()
		{
			cancelAnimationFrame(this.lastAnimationFrame)
		}

		private render()
		{			
			this.update()
			this.draw()
			this.lastAnimationFrame = requestAnimationFrame(this.render.bind(this))
		}
	}
	
	export class Game extends BaseGame
	{			
		scene: THREE.Scene
		camera: THREE.Camera
		
		matWires = new THREE.MeshBasicMaterial({wireframe: true})
		
		matColor = new THREE.MeshBasicMaterial({color: 0x335588})
		matRedColor = new THREE.MeshBasicMaterial({color: 0x770000})
				
		matGreenColor = new THREE.MeshBasicMaterial({color: 0x33AA22})
		
		matPhong = new THREE.MeshPhongMaterial({ })
		
		geoPlane = new THREE.PlaneBufferGeometry(100, 100)		
		meshPlane = new THREE.Mesh(this.geoPlane, this.matRedColor)
		
		geoBox = new THREE.BoxGeometry(70, 56, 94)
		meshBox = new THREE.Mesh(this.geoBox, this.matPhong)
		
		light: THREE.PointLight

		init()
		{
			this.scene = new THREE.Scene()
		  this.renderer.setSize(window.innerWidth, window.innerHeight)
			
			this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
			this.camera.position.z = 300					
			this.scene.add(this.camera)	
			
			this.light = new THREE.PointLight( 0xffffff, 1, 100 );	
			this.light.position.set( 15, 50, 37 );
			this.scene.add(this.light);
			
			this.scene.add(this.meshPlane)
			
			this.scene.add(this.meshBox)
		}
		
		update()
		{
			this.meshBox.rotateX(0.02)
			this.meshBox.rotateY(0.031)
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
}

//(<any>ko).punches.enableAll()

//ko.applyBindings({ name:'testing punches' })

window.onload = function()
{
	var game = new my.Game()
	
	//document.body.innerHTML = ""
	document.body.appendChild(game.domElement)
	
	game.start()	
	
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



