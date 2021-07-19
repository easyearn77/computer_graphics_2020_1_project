let scene = new THREE.Scene();
scene.background=new THREE.Color('#DEFEFF');
let camera;
let objLoader; // OBJLoader 객체를 넣을 변수를 선언합니다.
let mtlLoader; // MTLLoader 객체를 넣을 변수를 선언합니다.
let loader; // OBJLoader를 넣을 변수를 선언합니다.
let renderer = new THREE.WebGLRenderer({
    antialias: true
});


addLight();
makefloor();
initThree();
loadMTLLoader('building_04.mtl');
animate();

/**
 * Light를 추가하는 함수
 *
 * @method addDirectionalLight
 */
function addLight() {
var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1);
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2);
scene.add( directionalLight );

var ambientLight = new THREE.AmbientLight(0x0f0f0f,1.5);
scene.add(ambientLight);

var light = new THREE.SpotLight(0xffffff, 0.5);
light.position.set(50,0,200);
scene.add(light);
}

//make floor
function makefloor(){
    var texture = new THREE.TextureLoader().load( './floor2.gif');
    var floorGeometry=new THREE.PlaneGeometry(50,50,1);
    var floorMaterial = new THREE.MeshPhongMaterial({
        map:texture,
        shininess:4,
        ambient: 0x050505
    });

    var floor = new THREE.Mesh(floorGeometry,floorMaterial);
    floor.rotation.x=-0.5*Math.PI;
    floor.receiveShadow=true;
    floor.position.y=-1;
    scene.add(floor);
}

/**
 * Material 파일을 로드하는 함수
 *
 * @method loadMTLLoader
 */
function loadMTLLoader(url) {
    var mtlLoader = new THREE.MTLLoader();

    // MTLLoader Material 파일을 사용할 전역 경로를 설정합니다.
    mtlLoader.setPath('./');

    // 로드할 Material 파일 명을 입력합니다.
    mtlLoader.load(url, function (materials) {
        // 로드 완료되었을때 호출하는 함수
        materials.preload();

        loadOBJLoader(materials);
    }, function (xhr) {
        // 로드되는 동안 호출되는 함수
        console.log('MTLLoader: ', xhr.loaded / xhr.total * 100, '% loaded');
    }, function (error) {
        // 로드가 실패했을때 호출하는 함수
        console.error('MTLLoader 로드 중 오류가 발생하였습니다.', error);
        alert('MTLLoader 로드 중 오류가 발생하였습니다.');
    });
}

/**
 * .obj 파일의 모델을 로드하는 함수
 *
 * @method loadObjLoader
 * @param {Object} materials MTLLoader에서 로드한 Materials 값
 */
function loadOBJLoader(materials) {
    loader = new THREE.OBJLoader();

    // MTLLoader에서 로드한 materials 파일을 설정합니다.
    loader.setMaterials(materials);

    // OBJLoader OBJ 파일을 사용할 전역 경로를 설정합니다.
    loader.setPath('./');

    // 로드할 OBJ 파일 명을 입력합니다.
    loader.load('building_04.obj', function (object) {
        // 모델 로드가 완료되었을때 호출되는 함수
        object.position.x = 0;
        object.position.y = 0;
        object.position.z = 0;
        scene.add(object);
        object.traverse((o)=>{
            if(o.isMesh){
                o.castSadow=true;
                o.receiveShadow=true;
            }
        });
    }, function (xhr) {
        // 모델이 로드되는 동안 호출되는 함수
        console.log('OBJLoader: ', xhr.loaded / xhr.total * 100, '% loaded');
    }, function (error) {
        // 모델 로드가 실패했을 때 호출하는 함수
        alert('모델을 로드 중 오류가 발생하였습니다.');
    });
}


/**
 * Threejs 초기화 함수
 *
 * @method initThree
 */
function initThree() {
    // 브라우저가 WebGL을 지원하는지 체크
    if (WEBGL.isWebGLAvailable()) {
        console.log('이 브라우저는 WEBGL을 지원합니다.');
    } else {
        console.log('이 브라우저는 WEBGL을 지원하지 않습니다.');
    }

    renderer.setSize(700, 500);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    let axes = new THREE.AxisHelper(10);
    scene.add(axes);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 5;
    camera.position.y = 3;
    camera.position.z = 10;

    controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.target.set(0,0,0);
    controls.addEventListener('change',renderer.render);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.minDistance = 5;
    controls.maxDistance = 100;
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    controls.update();
}


document.getElementById("wall_white/blue").onclick=function(){
    initThree();
    loadMTLLoader('building_white_blue.mtl');
    animate();
}

document.getElementById("wall_grey/black").onclick=function(){
    initThree();
    loadMTLLoader('building_grey_black.mtl');
    animate();
}

document.getElementById("wall_pattern1").onclick=function(){
    initThree();
    loadMTLLoader('pattern1.mtl');
    animate();
}

document.getElementById("wall_pattern2").onclick=function(){
    initThree();
    loadMTLLoader('pattern2.mtl');
    animate();
}

//설문지 작성 페이지로 이동
document.getElementById("send").onclick=function(){
    location.href='https://forms.gle/85cyTb2KF8KcmgUf9';
}

