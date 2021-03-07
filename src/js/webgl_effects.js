	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			var container;
			var clock;
			var camera, scene, renderer;
			var mesh, lightMesh, geometry;
			var spheres = [];
			var directionalLight, pointLight;
			var mixer;
			var mouseX = 0;
			var mouseY = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			init();
			animate();
			function init() {
				container = document.createElement( 'div' );
				document.body.appendChild( container );
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.z = 5000;
				camera.position.y=-2000;
				scene = new THREE.Scene();
				clock = new THREE.Clock();
				var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
				dirLight.position.set( 0, -1, 0 ).normalize();
				scene.add( dirLight );
				dirLight.color.setHSL( 0.1, 0.7, 0.5 );
				// Function to add the lens flare light 
				var textureLoader = new THREE.TextureLoader();
				var textureFlare0 = textureLoader.load( "textures/lensflare/lensflare0.png" );
				var textureFlare2 = textureLoader.load( "textures/lensflare/lensflare2.png" );
				var textureFlare3 = textureLoader.load( "textures/lensflare/lensflare3.png" );
				addLight( 0.55, 0.9, 0.5, 3500, 8000, -8000 );
				//	addLight( 0.08, 0.8, 0.5,    0, 0, -1000 );
				//	addLight( 0.995, 0.5, 0.9, 5000, 5000, -1000 );
				function addLight( h, s, l, x, y, z ) {
					var light = new THREE.PointLight( 0xffffff, 1.5, -8000 );
					light.color.setHSL( h, s, l );
					light.position.set( x, y, z );
					scene.add( light );
					var flareColor = new THREE.Color( 0xffffff );
					flareColor.setHSL( h, s, l + 0.5 );
					var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );
					lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
					lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
					lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
					lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
					lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
					lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
					lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
					lensFlare.customUpdateCallback = lensFlareUpdateCallback;
					lensFlare.position.copy( light.position );
					scene.add( lensFlare );
				}
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};
				var onError = function ( xhr ) {console.log('Error triggered loading lensflare');};
				var ambient = new THREE.AmbientLight( 0x444444 );
				scene.add( ambient );

				/* Add the world obj*/
				var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setPath( 'models/obj/' );
				mtlLoader.load( 'earth.mtl', function( materials ) {
					materials.preload();
					var objLoader = new THREE.OBJLoader();
					objLoader.setMaterials( materials );
					objLoader.setPath( 'models/obj/' );
					objLoader.load( 'earth.obj', function ( object ) {
						object.position.y = - 95;
						object.scale.x=3000;
						object.scale.y=3000;
						object.scale.z=3000;
						scene.add( object );
					}, onProgress, onError );
				});

				/* Add skull obeject*/
				var loader = new THREE.ColladaLoader();
				//loader.options.convertUpAxis = true;
				loader.load( "./models/collada/skeleton/plotting.dae", function ( collada ) {
					var object = collada.scene;
					mixer = new THREE.AnimationMixer( object );
					object.traverse( function ( child ) {
						if ( child instanceof THREE.SkinnedMesh ) {
							var clip = THREE.AnimationClip.parseAnimation( child.geometry.animation, child.geometry.bones );
							mixer.clipAction( clip, child ).play();
						}
					} );
					 	object.scale.x = 2000;
					 object.scale.y = 2000;
					 object.scale.z = 2000;
					 object.position.y = - 200;
					 object.position.x = -100;
					 object.position.z = -1400;
					scene.add( object );
				} );

				//load the skybox
				scene.background = new THREE.CubeTextureLoader()
					.setPath( 'textures/skyboxes/ame_nebula/' )
					.load( [ 'purplenebula_ft.png', 'purplenebula_bk.png', 'purplenebula_up.png', 'purplenebula_dn.png', 'purplenebula_rt.png', 'purplenebula_lf.png' ] );
				var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );
				//var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: scene.background } );

				// Have floating spheres with skybox relfection
				var path = "textures/skyboxes/nec_hell";
				var format = '.jpg';
				var urls = [
						path + 'hell_ft' + format, path + 'hell_bk' + format,
						path + 'hell_up' + format, path + 'hell_dn' + format,
						path + 'hell_rt' + format, path + 'hell_lf' + format
					];
				var reflectionCube = new THREE.CubeTextureLoader().load( urls );
				var material = new THREE.MeshStandardMaterial( {
						envMap: reflectionCube,
						metalness:1,
						 

					} );
				for ( var i = 0; i < 50; i ++ ) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = Math.random() * 10000 - 5000;
					mesh.position.y = Math.random() * 10000 - 5000;
					mesh.position.z = Math.random() * 10000 - 5000;
					mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
					scene.add( mesh );
					spheres.push( mesh );
				}

				//Create the renderer
				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				window.addEventListener( 'resize', onWindowResize, false );

				/*Add product cubes */
    			var geometry = new THREE.BoxBufferGeometry( 1000, 1000, 1000 );
				var material = new THREE.MeshBasicMaterial( {map:THREE.ImageUtils.loadTexture('textures/ernest.jpg')} );
				cube = new THREE.Mesh( geometry, material );
				cube.rotation.x=100;
				scene.add( cube );
				var material2 = new THREE.MeshBasicMaterial( {map:THREE.ImageUtils.loadTexture('textures/final1.png')} );
				cube2 = new THREE.Mesh( geometry, material2 );
				cube2.rotation.x=100;
				cube2.position.x=650;
				scene.add( cube2 );
				console.log('End of the init function and product cubes generated');
			} /* End of init function*/

			function lensFlareUpdateCallback( object ) {
				var f, fl = object.lensFlares.length;
				var flare;
				var vecX = -object.positionScreen.x * 2;
				var vecY = -object.positionScreen.y * 2;
				//Loop through the number of lengs flares
				for( f = 0; f < fl; f++ ) {
					flare = object.lensFlares[ f ];
					flare.x = object.positionScreen.x + vecX * flare.distance;
					flare.y = object.positionScreen.y + vecY * flare.distance;
					flare.rotation = 0;
				}
				object.lensFlares[ 2 ].y += 0.025;
				object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
			}

			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			function onDocumentMouseMove( event ) {
				//Camera control on mouse move events
				mouseX = ( event.clientX - windowHalfX ) * 10;
				mouseY = ( event.clientY - windowHalfY ) * 10;
			}
			function animate() {
				requestAnimationFrame( animate );
				render();
			}
			function render() {
				var timer = 0.0001 * Date.now();
				//Move the spheres around the screen
				for ( var i = 0, il = spheres.length; i < il; i ++ ) {
					var sphere = spheres[ i ];
					sphere.position.x = 5000 * Math.cos( timer + i );
					sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );
				}
				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;
				camera.lookAt( scene.position );
				var delta = clock.getDelta();
				if ( mixer !== undefined ) {
					mixer.update( delta );
				}
				renderer.render( scene, camera );
			}
