function run_graveyard(num_tweets, tweetArray) {

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    // CONSTANTS AND VARIABLE DECLARATIONS
    var PI_2 = Math.PI / 2;
    var NUM_ROWS = 3;
    var ROW_SPACE_WIDTH = 30;
    var BACKGROUND_COLOR = 0xa6a6a6;
    var FOG_COLOR = 0xa6a6a6;
    var CAMERA_HEIGHT = 20;
    var worldWidth = 256, worldDepth = 256;

    // INIT SCENE, CAMERA, CLOCK AND RENDERER
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 450);
    var clock = new THREE.Clock();

    var renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true });
    renderer.setClearColor( FOG_COLOR, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // POSTPROCESSING
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
    dotScreenEffect.uniforms.scale.value = 8;
    composer.addPass( dotScreenEffect );
    dotScreenEffect.renderToScreen = true;

    document.body.appendChild(renderer.domElement);

    // SET THE CAMERA POSITION AND DIRECTION
    camera.setLens(60);
    camera.position.setY(CAMERA_HEIGHT);
    camera.position.setZ(0);
    scene.add( camera );

    // CONTROLS
    var controls = new MyControls( camera );


    // SET UP THE TERRAIN
    var geometry = new THREE.PlaneGeometry( 10000, 10000, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var texture = new THREE.MeshBasicMaterial( 0xfbfbfb );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var plane = new THREE.Mesh( geometry, texture );
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

    // PARAMETERS FOR THE GRAVE
    var grave_geometry = new THREE.BoxGeometry( 15, 30, 3);
    var grave_material = new THREE.MeshPhongMaterial( { color: 0x000000, shininess: 80 } );

    var engraving_geometry = new THREE.PlaneGeometry(10, 20);
    // ADD GRAVES AND TEXT

    function Grave(x, z, user, name, time) {

        var grave = new THREE.Mesh( grave_geometry, grave_material );
        grave.position.x = x;
        grave.position.y = 10;
        grave.position.z = z;

        // create a canvas element
        var canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 1000;

        var context = canvas.getContext('2d');
        context.font = "Bold 50px Arial";
        context.fillStyle = "rgba(235,185,141,1)";

        context.fillText('#RIP', 40, 40);
        context.fillText(name, 40, 100);
        context.fillText(user, 40, 400);
        context.fillText(time, 40, 500);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
        material.transparent = true;

        var engraving = new THREE.Mesh(engraving_geometry, material);

        grave.add( engraving );
        engraving.position.z += 1.6;

        scene.add(grave);

    }

    var grave1 = Grave( 0, -30, '@twitterbot', 'Kanye', '12:51:01');


    // DEAL WITH WINDOW RESIZING
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
    }


    function animate(){
        requestAnimationFrame( animate );
        controls.update(clock.getDelta());
        composer.render(scene, camera);
    }


    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener('change', function () { animate(); });

    animate();

}
