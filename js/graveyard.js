// DETECT INCOMPATIBLE BROWSERS AND DEVICES

$(document).ready(function() {

// ADJUST THE TIME OF THE TWEET TO CLIENT'S LOCAL TIMEZONE
    function adjust_to_users_timezone (time) {
        var new_time = time * 1000 + utc_offset * 60000; // convert to miliseconds, get
        var new_date = new Date(new_time)
        return new_date.toLocaleString()
    }

    $.getJSON('../data/tweets.json', function(json, textStatus) {
        console.log(textStatus)

        var myJSONString = JSON.stringify(json);
        var myEscapedJSONString = myJSONString.replace(/\\n/g, "\\n")
                                              .replace(/\\'/g, "\\'")
                                              .replace(/\\"/g, '\\"')

        var tweetArray = $.parseJSON(myEscapedJSONString);

        var num_tweets = tweetArray.length;

        console.log(num_tweets);
        console.log(tweetArray)

        run_graveyard(num_tweets, tweetArray);

        });
});

function run_graveyard(num_tweets, tweetArray) {

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    // CONSTANTS AND VARIABLE DECLARATIONS
    var PI_2 = Math.PI / 2;
    var NUM_ROWS = 3;
    var ROW_SPACE_WIDTH = 30;
    var BACKGROUND_COLOR = 0x000000;
    var FOG_COLOR = 0x431a43;
    var CAMERA_HEIGHT = 20;

    var ul, user, name, time;
    var candle, flowers, item;
    var date = new Date();
    var utc_offset = date.getTimezoneOffset();

    var plane, texture;
    var worldWidth = 256, worldDepth = 256,
    worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;


    // INIT SCENE, CAMERA, CLOCK AND RENDERER
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 5000);
    var clock = new THREE.Clock();

    var renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true });
    renderer.setClearColor( FOG_COLOR, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    document.body.appendChild(renderer.domElement);


    // SET THE CAMERA POSITION AND DIRECTION
    camera.setLens(60)
    camera.position.setY(CAMERA_HEIGHT);
    camera.position.setZ(100);
    scene.add( camera );


    // CONTROLS
    var controls = new MyControls( camera );


    // SET UP THE TERRAIN
    var geometry = new THREE.PlaneGeometry( 10000, 10000, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var texture = new THREE.MeshBasicMaterial( 0xfbfbfb )
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
    scene.fog = new THREE.Fog( 0x431a43, 200, 450 );


    // MODELS
    var loader = new THREE.OBJLoader();
    loader.load( 'static/models/candle.obj', function (obj) {
        obj.scale.set(.1, .1, .1);
        candle = obj;
    });

    loader.load( 'static/models/plants1.obj', function (obj) {
        obj.scale.set(.01, .01, .01);
        flowers = obj;
    });

    // SKYBOX
    sky_texture = new THREE.ImageUtils.loadTexture( 'static/images/sky.jpg' );
    sky_texture.wrapS = THREE.RepeatWrapping;
    sky_texture.wrapT = THREE.RepeatWrapping;
    sky_texture.repeat.set( 10, 1 );
    sky_texture.needsUpdate = true;

    sky_material = new THREE.MeshLambertMaterial(
        { map: sky_texture,
          fog: false } );

    var sky_geometry = new THREE.PlaneGeometry( 1000, 500);
    sky = new THREE.Mesh( sky_geometry, sky_material );
    sky.position.z = camera.position.z - 1000;
    sky.rotation.set(0, 0, 0);
    camera.add( sky )
    sky.rotation.set(0, 0, 0);



    // ADD GRAVES AND TEXT

    var POSITION_X;
    var POSITION_Z = 0;
    var graveArray = Array(num_tweets);
    var ripArray = Array(num_tweets);
    var nameArray = Array(num_tweets);
    var userArray = Array(num_tweets);
    var timeArray = Array(num_tweets);

    var parameters = {
        size: .5,
        height: .1,
        font: "helvetiker",
        curveSegments: 3,
        style: 'normal',
        weight: 'normal',
        bevelEnabled : false
      };


    var geometry = new THREE.BoxGeometry( 10, 30, 10);
    var RIPgeometry = new THREE.TextGeometry( '# R I P', parameters );

    var grave_material = new THREE.MeshPhongMaterial( { color: 0x000000, shininess: 80 } );
    var text_material = new THREE.MeshLambertMaterial( { color: 0xebb98d } )

    for( var i = num_tweets-1, j = 0; i >= 0; i--, j++) {

        if (j / NUM_ROWS == 1) {
            NUM_ROWS += 4
            POSITION_Z -= 100;
            j = 0;
        }

        POSITION_X = j % NUM_ROWS * ROW_SPACE_WIDTH - (NUM_ROWS * ROW_SPACE_WIDTH) / 2;

        graveArray[i] = new THREE.Mesh( geometry, grave_material);
        graveArray[i].position.x = POSITION_X;
        graveArray[i].position.z = POSITION_Z;
        graveArray[i].position.y = 10;
        graveArray[i].castShadow = true;
        graveArray[i].receiveShadow = true;

        ripArray[i] = new THREE.Mesh(RIPgeometry, text_material);
        ripArray[i].position.x = POSITION_X - 3;
        ripArray[i].position.z = POSITION_Z + 5;
        ripArray[i].position.y = 20;
        ripArray[i].receiveShadow = true;
        ripArray[i].castShadow = false;

        var name_geometry = new THREE.TextGeometry(tweetArray[i][3], parameters);
        nameArray[i] = new THREE.Mesh(name_geometry, text_material);
        nameArray[i].position.x = POSITION_X - 3;
        nameArray[i].position.z = POSITION_Z + 5;
        nameArray[i].position.y = 19;
        nameArray[i].name = tweetArray[i].name;
        nameArray[i].castShadow = true;
        nameArray[i].receiveShadow = false;

        var user_geometry = new THREE.TextGeometry('@' + tweetArray[i][1], parameters);
        userArray[i] = new THREE.Mesh(user_geometry, text_material);
        userArray[i].position.x = POSITION_X - 3;
        userArray[i].position.z = POSITION_Z + 5;
        userArray[i].position.y = 16;
        userArray[i].name = tweetArray[i].user;
        userArray[i].castShadow = true;
        userArray[i].receiveShadow = false;

        var adjusted_time = adjust_to_users_timezone(tweetArray[i][2])
        var time_geometry = new THREE.TextGeometry(adjusted_time, parameters);
        timeArray[i] = new THREE.Mesh(time_geometry, text_material);
        timeArray[i].position.x = POSITION_X - 3;
        timeArray[i].position.z = POSITION_Z + 5;
        timeArray[i].position.y = 15;
        timeArray[i].name = tweetArray[i].time;
        timeArray[i].castShadow = true;
        timeArray[i].receiveShadow = false;
    }


    // ADJUST THE TIME OF THE TWEET TO CLIENT'S LOCAL TIMEZONE
    function adjust_to_users_timezone (time) {
        var new_time = time * 1000 + utc_offset * 60000; // convert to miliseconds, get
        var new_date = new Date(new_time)
        return new_date.toLocaleString()
    }


    // DEAL WITH WINDOW RESIZING
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize()
    };


    // PLACE THE ITEM (CANDLE OR FLOWERS)
    function placeItem( event ) {
        scene.add( item.clone() );
    };
    function cancelPlacing( ) {
        document.removeEventListener( 'click', placeItem, false)
    }


    // FIND DISTANCE TO EACH GRAVE
    function checkZones() {
        checkOuterZone();
        checkInnerZone();
    };
    function checkInnerZone() {
        for( var i = 0; i < num_tweets; i++ ){
            if (camera.position.distanceTo(graveArray[i].position) < 450) {
                scene.add( graveArray[i]);
                scene.add( ripArray[i] );
                scene.add( userArray[i] );
                scene.add( nameArray[i] );
                scene.add( timeArray[i] );
            }
        }
    };
    function checkOuterZone() {
      for( var i = 0; i < num_tweets; i++ ){
            if (camera.position.distanceTo(graveArray[i].position) > 451) {
                scene.remove( graveArray[i]);
                scene.remove( ripArray[i] );
                scene.remove( userArray[i] );
                scene.remove( nameArray[i] );
                scene.remove( timeArray[i] );
            }
        }
    };


    function FollowCursor( event ) {
        var mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
        var mouseY = -( event.clientY / window.innerHeight ) * 2 + 1;

        var vector = new THREE.Vector3( mouseX, mouseY, camera.near );

        // Convert the [-1, 1] screen coordinate into a world coordinate on the near plane
        var projector = new THREE.Projector();
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        // See if the ray from the camera into the world hits one of our meshes
        var intersects = raycaster.intersectObject( plane );
        lastIntersects = intersects;

        // Toggle rotation bool for meshes that we clicked
        if ( intersects.length > 0 ) {

            item.position.copy( intersects[ 0 ].point );
        }
    };


    function onChoosingCandle (event) {
        scene.remove(item)
        item = candle;
        scene.add(item);
        document.addEventListener( 'mousemove', FollowCursor, false );
        event.stopPropagation();
        document.removeEventListener('click', onChoosingFlowers, false);
        document.addEventListener( 'click', placeItem, false);

    };

    function onChoosingFlowers (event) {
        scene.remove(item)
        item = flowers;
        scene.add(item);
        document.addEventListener( 'mousemove', FollowCursor, false );
        event.stopPropagation();
        document.removeEventListener('click', onChoosingCandle, false);
        document.addEventListener( 'click', placeItem, false);
    };


    function animate(){
        requestAnimationFrame( animate );
        controls.update(clock.getDelta());
        renderer.render(scene, camera);
    };


    function getInput (event) {
        if (event.type == 'keyup') {
            if (event.keyCode == 13) {
                findAndGoToGrave(event);
            }
        } else if (event.type == 'click') {
            findAndGoToGrave(event);
        }
    }


    function findAndGoToGrave(event) {
        var search = document.getElementById('field').value;
        for ( var i = nameArray.length-1; i >=  0; i--) {
            if (nameArray[i].name == search) {
                var new_camera_position = nameArray[i].position.clone();
                new_camera_position.setZ(nameArray[i].position.z + 75);
                new_camera_position.setY(CAMERA_HEIGHT)
                camera.position = new_camera_position;
                camera.lookAt(nameArray[i].position)
                break;

            }
        }
    }


    function generateHeight( width, height ) {
        var size = width * height;
        data = new Uint8Array( size );
        perlin = new ImprovedNoise();
        quality = 1;
        z = Math.random();

        for ( var j = 0; j < 4; j ++ ) {
            for ( var i = 0; i < size; i ++ ) {
                var x = i % width, y = ~~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
            }
            quality *= 5;
        }
        return data;
    }

    checkZones();

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'readystatechange', checkZones, false);
    document.addEventListener( 'keydown', checkZones, false);
    document.addEventListener('click', FollowCursor, false);
    document.addEventListener('change', function () { render(); });

    var field = document.getElementById('field');
    var button = document.getElementById('button');
    field.addEventListener('keyup', getInput, false);
    button.addEventListener('click', getInput, false);

    var candle_element = document.getElementById('candle')
    var flowers_element = document.getElementById('flowers')
    var menu = document.getElementById('menu')
    menu.addEventListener( 'hover', cancelPlacing, false);
    candle_element.addEventListener('click', onChoosingCandle, false);
    flowers_element.addEventListener('click', onChoosingFlowers, false);

    animate();

}
