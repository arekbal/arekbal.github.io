/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CSS3DObject = function ( element ) {

	THREE.Object3D.call( this );

	this.element = element;
	this.element.style.position = 'absolute';

	this.addEventListener( 'removed', function ( event ) {

		if ( this.element.parentNode !== null ) {

			this.element.parentNode.removeChild( this.element );

		}

	} );

};

THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.CSS3DObject.prototype.constructor = THREE.CSS3DObject;

THREE.CSS3DSprite = function ( element ) {

	THREE.CSS3DObject.call( this, element );

};

THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );
THREE.CSS3DSprite.prototype.constructor = THREE.CSS3DSprite;

//

THREE.CSS3DRenderer = function () {

	console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();
	
	var cache = {
		camera: { fov: 0, style: '' },
		objects: {}
	};

	var domElement = document.createElement( 'div' );
	domElement.style.overflow = 'hidden';

	domElement.style.WebkitTransformStyle = 'preserve-3d';
	domElement.style.MozTransformStyle = 'preserve-3d';
	domElement.style.oTransformStyle = 'preserve-3d';
	domElement.style.transformStyle = 'preserve-3d';

	this.domElement = domElement;

	var cameraElement = document.createElement( 'div' );

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.MozTransformStyle = 'preserve-3d';
	cameraElement.style.oTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	domElement.appendChild( cameraElement );

	this.setClearColor = function () {

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	var epsilon = function ( value ) {

		return Math.abs( value ) < 0.000001 ? 0 : value;

	};

	var getCameraCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( - elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( - elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var getObjectCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'translate3d(-50%,-50%,0) matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( - elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( - elements[ 6 ] ) + ',' +
			epsilon( - elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS3DObject ) {

			var style;

			if ( object instanceof THREE.CSS3DSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix( matrix );

			} else {

				style = getObjectCSSMatrix( object.matrixWorld );

			}

			var element = object.element;
			var cachedStyle = cache.objects[ object.id ];

			if ( cachedStyle === undefined || cachedStyle !== style ) {

				element.style.WebkitTransform = style;
				element.style.MozTransform = style;
				element.style.oTransform = style;
				element.style.transform = style;

				cache.objects[ object.id ] = style;

			}

			if ( element.parentNode !== cameraElement ) {

				cameraElement.appendChild( element );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	};

	this.render = function ( scene, camera ) {

		var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

		if ( cache.camera.fov !== fov ) {

			domElement.style.WebkitPerspective = fov + "px";
			domElement.style.MozPerspective = fov + "px";
			domElement.style.oPerspective = fov + "px";
			domElement.style.perspective = fov + "px";

			cache.camera.fov = fov;

		}

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
			" translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

		if ( cache.camera.style !== style ) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.MozTransform = style;
			cameraElement.style.oTransform = style;
			cameraElement.style.transform = style;
			
			cache.camera.style = style;

		}

		renderObject( scene, camera );

	};

};
/*!
* screenfull
* v2.0.0 - 2014-12-22
* (c) Sindre Sorhus; MIT License
*/
!function(){"use strict";var a="undefined"!=typeof module&&module.exports,b="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,c=function(){for(var a,b,c=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],d=0,e=c.length,f={};e>d;d++)if(a=c[d],a&&a[1]in document){for(d=0,b=a.length;b>d;d++)f[c[0][d]]=a[d];return f}return!1}(),d={request:function(a){var d=c.requestFullscreen;a=a||document.documentElement,/5\.1[\.\d]* Safari/.test(navigator.userAgent)?a[d]():a[d](b&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){document[c.exitFullscreen]()},toggle:function(a){this.isFullscreen?this.exit():this.request(a)},raw:c};return c?(Object.defineProperties(d,{isFullscreen:{get:function(){return!!document[c.fullscreenElement]}},element:{enumerable:!0,get:function(){return document[c.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return!!document[c.fullscreenEnabled]}}}),void(a?module.exports=d:window.screenfull=d)):void(a?module.exports=!1:window.screenfull=!1)}();
/// <reference path="../../typings/knockout/knockout.d.ts"/>
/// <reference path="../../typings/threejs/three.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var my;
(function (my) {
    var BaseGame = (function () {
        function BaseGame() {
            this._renderer = new THREE.WebGLRenderer();
            this.lastAnimationFrame = 0;
        }
        Object.defineProperty(BaseGame.prototype, "renderer", {
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGame.prototype, "domElement", {
            get: function () {
                return this._renderer.domElement;
            },
            enumerable: true,
            configurable: true
        });
        BaseGame.prototype.init = function () {
        };
        BaseGame.prototype.update = function () {
        };
        BaseGame.prototype.draw = function () {
        };
        BaseGame.prototype.start = function () {
            this._renderer.setClearColor(0x446688);
            this.init();
            this.lastAnimationFrame = requestAnimationFrame(this.render.bind(this));
        };
        BaseGame.prototype.stop = function () {
            cancelAnimationFrame(this.lastAnimationFrame);
        };
        BaseGame.prototype.render = function () {
            this.update();
            this.draw();
            this.lastAnimationFrame = requestAnimationFrame(this.render.bind(this));
        };
        return BaseGame;
    })();
    my.BaseGame = BaseGame;
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.apply(this, arguments);
            this.matWires = new THREE.MeshBasicMaterial({ wireframe: true });
            this.matColor = new THREE.MeshBasicMaterial({ color: 0x335588 });
            this.matRedColor = new THREE.MeshBasicMaterial({ color: 0x770000 });
            this.matGreenColor = new THREE.MeshBasicMaterial({ color: 0x33AA22 });
            this.matPhong = new THREE.MeshPhongMaterial({});
            this.geoPlane = new THREE.PlaneBufferGeometry(100, 100);
            this.meshPlane = new THREE.Mesh(this.geoPlane, this.matRedColor);
            this.geoBox = new THREE.BoxGeometry(70, 56, 94);
            this.meshBox = new THREE.Mesh(this.geoBox, this.matPhong);
        }
        Game.prototype.init = function () {
            this.scene = new THREE.Scene();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 300;
            this.scene.add(this.camera);
            this.light = new THREE.PointLight(0xffffff, 1, 100);
            this.light.position.set(15, 50, 37);
            this.scene.add(this.light);
            this.scene.add(this.meshPlane);
            this.scene.add(this.meshBox);
        };
        Game.prototype.update = function () {
            this.meshBox.rotateX(0.02);
            this.meshBox.rotateY(0.031);
            this.meshPlane.rotateZ(0.04);
            this.meshPlane.position.x += 0.2;
            //var a = new THREE.Euler( 0, 1, 1.57, 'XYZ' );
            //this.meshPlane.applyMatrix()
        };
        Game.prototype.draw = function () {
            this.renderer.clearColor();
            this.renderer.render(this.scene, this.camera);
        };
        return Game;
    })(BaseGame);
    my.Game = Game;
})(my || (my = {}));
//(<any>ko).punches.enableAll()
//ko.applyBindings({ name:'testing punches' })
window.onload = function () {
    var game = new my.Game();
    //document.body.innerHTML = ""
    document.body.appendChild(game.domElement);
    game.start();
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
};
