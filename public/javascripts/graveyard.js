function run_graveyard(num_tweets, tweetArray) {

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    // CONSTANTS AND VARIABLE DECLARATIONS
    var PI_2 = Math.PI / 2;
    var NUM_ROWS = 3;
    var ROW_SPACE_WIDTH = 30;
    var BACKGROUND_COLOR = 0xa6a6a6;
    var FOG_COLOR = 0xa6a6a6;
    var CAMERA_HEIGHT = 20;

    var ul, user, name, time;

    var plane;
    var worldWidth = 256, worldDepth = 256,
    worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;


    // INIT SCENE, CAMERA, CLOCK AND RENDERER
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 450);
    var clock = new THREE.Clock();

    var renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true });
    renderer.setClearColor( FOG_COLOR, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
    dotScreenEffect.uniforms[ 'scale' ].value = 8;
    composer.addPass( dotScreenEffect );
    dotScreenEffect.renderToScreen = true;

    document.body.appendChild(renderer.domElement);


    // SET THE CAMERA POSITION AND DIRECTION
    camera.setLens(60);
    camera.position.setY(CAMERA_HEIGHT);
    camera.position.setZ(100);
    scene.add( camera );


    // CONTROLS
    var controls = new MyControls( camera );


    // SET UP THE TERRAIN
    var geometry = new THREE.PlaneGeometry( 10000, 10000, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var texture = new THREE.MeshBasicMaterial( 0xfbfbfb );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // texture.needsUpdate = true;

    plane = new THREE.Mesh( geometry, texture );
    plane.receiveShadow = true;
    scene.add( plane );


    // LIGHTS

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.475 );
    directionalLight.position.set( 100, 100, -100 );
    scene.add( directionalLight );

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.25 );
    hemiLight.color.setHSL( 0.6, 1, 0.75 );
    hemiLight.groundColor.setHSL( 0.1, 0.8, 0.7 );
    hemiLight.position.y = 500;
    scene.add( hemiLight );


    // FOG
    scene.fog = new THREE.Fog( FOG_COLOR, 200, 450 );

    // ADD GRAVES AND TEXT

    var POSITION_X;
    var POSITION_Z = 0;
    var graveArray = Array(num_tweets);

    var grave_geometry = new THREE.BoxGeometry( 10, 30, 10);
    var grave_material = new THREE.MeshPhongMaterial( { color: 0x000000, shininess: 80 } );

    for( var i = num_tweets-1, j = 0; i >= 0; i--, j++) {

        if (j / NUM_ROWS == 1) {
            NUM_ROWS += 4;
            POSITION_Z -= 100;
            j = 0;
        }

        POSITION_X = j % NUM_ROWS * ROW_SPACE_WIDTH - (NUM_ROWS * ROW_SPACE_WIDTH) / 2;

        graveArray[i] = new THREE.Mesh( grave_geometry, grave_material);
        graveArray[i].position.x = POSITION_X;
        graveArray[i].position.z = POSITION_Z;
        graveArray[i].position.y = 10;

        // create a canvas element
        var canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 1000;

        var context = canvas.getContext('2d');
        context.font = "Bold 50px Arial";
        context.fillStyle = "rgba(235,185,141,1)";

        context.fillText('#RIP', 40, 40);
        context.fillText(tweetArray[i].name, 40, 100);
        context.fillText(tweetArray[i].user, 40, 400);
        context.fillText(tweetArray[i].time, 40, 500);

        // canvas contents will be used for a texture
        var texture1 = new THREE.Texture(canvas);
        texture1.needsUpdate = true;

        var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
        material1.transparent = true;

        var mesh1 = new THREE.Mesh(
            new THREE.PlaneGeometry(canvas.width/50, canvas.height/50),
            material1
          );

        graveArray[i].add( mesh1 );
        mesh1.position.z += 6;
        scene.add(graveArray[i]);

    }


    // DEAL WITH WINDOW RESIZING
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
    }


    // FIND DISTANCE TO EACH GRAVE
    function checkZones() {
        checkOuterZone();
        checkInnerZone();
    }


    function checkInnerZone() {
        for( var i = 0; i < num_tweets; i++ ){
            if (camera.position.z < graveArray[i].position.z) {
                continue;
            }

            if (camera.position.distanceTo(graveArray[i].position) < 450) {
                scene.add( graveArray[i]);
            }
        }
    }


    function checkOuterZone() {
      for( var i = 0; i < num_tweets; i++ ){
            if (camera.position.z < graveArray[i].position.z) {
                scene.remove( graveArray[i]);
            }

            if (camera.position.distanceTo(graveArray[i].position) > 451) {
                scene.remove( graveArray[i]);
            }
        }
    }


    function animate(){
        requestAnimationFrame( animate );
        controls.update(clock.getDelta());
        composer.render(scene, camera);
    }


    window.addEventListener( 'resize', onWindowResize, false );
    // document.addEventListener( 'readystatechange', checkZones, false);
    document.addEventListener( 'keydown', checkZones, false);
    document.addEventListener('change', function () { animate(); });

    animate();

}
