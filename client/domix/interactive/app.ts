/// <reference path="../../../typings/threejs/three.d.ts"/>

module domix.interactive
{
	export enum KeyboardEventType
	{
		Down,
		Up,
		Press
	}
	
	export interface KeyboardEventQueueEntry
	{
		time: number
		type: KeyboardEventType
		event: KeyboardEvent				
	}
	
	export enum MouseEventType
	{
		Down,
		Up,
		Move
	}
	
	
	export interface MouseEventQueueEntry
	{
		time: number
		type: MouseEventType
		event: MouseEvent				
	}
	
	
	export class App
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
		
		now() : number
		{
			return window.performance.now()
		}
				
		protected init()
		{	
			var self = this	
			this._renderer.domElement.addEventListener('blur', ev=>{ self.onBlur()})
			this._renderer.domElement.addEventListener('focus', ev=>{ self.onFocus()})
			this._renderer.domElement.addEventListener('keypress', ev=>{ self.onKeyPress(ev)})
			this._renderer.domElement.addEventListener('keydown', ev=>{ self.onKeyDown(ev)})
			this._renderer.domElement.addEventListener('keyup', ev=>{ self.onKeyUp(ev)})
			
			this._renderer.domElement.addEventListener('mousemove', ev=>{ self.onMouseMove(ev)})
			this._renderer.domElement.addEventListener('mousedown', ev=>{ self.onMouseDown(ev)})
			this._renderer.domElement.addEventListener('mouseup', ev=>{ self.onMouseUp(ev)})
			
			this._renderer.domElement.addEventListener('resize', ev=>{ self.onResize(ev)})
		}
		
		protected onResize(ev:Event)
		{			
		}
		
		protected lastKeyEvents:KeyboardEventQueueEntry[] = [] 
				
		protected onKey(type:KeyboardEventType, ev: KeyboardEvent)
		{				
				this.lastKeyEvents.push({ time: this.now(), type: type, event: ev })
		}
		
		protected lastMouseEvents: MouseEventQueueEntry[] = [] 
		
		protected onMouse(type:MouseEventType, ev: MouseEvent)
		{		
				this.lastMouseEvents.push({ time: this.now(), type: type, event: ev })	
		}
		
		protected onKeyPress(ev: KeyboardEvent)
		{		
			this.onKey(KeyboardEventType.Press, ev)	
		}
		
		protected onKeyDown(ev: KeyboardEvent)
		{	
			this.onKey(KeyboardEventType.Down, ev)		
		}
		
	  protected onKeyUp(ev: KeyboardEvent)
		{		
			this.onKey(KeyboardEventType.Up, ev)	
		}
		
		protected onMouseMove(ev: MouseEvent)
		{		
			this.onMouse(MouseEventType.Move, ev)	
		}
		
	  protected onMouseDown(ev: MouseEvent)
		{	
			this.onMouse(MouseEventType.Down, ev)		
		}
		
		protected onMouseUp(ev: MouseEvent)
		{			
			this.onMouse(MouseEventType.Up, ev)	
		}	
		
		protected onBlur()
		{			
		}	
		
		protected onFocus()
		{			
		}
		
		protected update()
		{		
		}
				
		protected draw()
		{			
		}
		
		protected onDestroy()
		{
		}
		
		destroy()
		{
			this.onDestroy()
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
			this.lastAnimationFrame = 0
		}

		private render()
		{			
			this.update()
			
			while(this.lastKeyEvents.length)
				this.lastKeyEvents.pop()
				
			while(this.lastMouseEvents.length)
				this.lastMouseEvents.pop()
					
			this.draw()
			
			this.lastAnimationFrame = requestAnimationFrame(this.render.bind(this))
		}
	}
}
