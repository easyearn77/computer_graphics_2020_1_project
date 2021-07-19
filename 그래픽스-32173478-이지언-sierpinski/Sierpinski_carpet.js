//필요한 전역변수 설정
var canvas;
var gl; //for setup

var points = [];//나눠진 사각형들의 vertex값 저장

var NumTimesToSubdivide = 5; //몇번 나누기를 실행할 것인지

var bufferId;


//실행하면 바로 시작되는 init함수 (like main)
window.onload=function init()
{
    //html의 canvas를 사용하기위해 연결
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    // First, initialize the corners of our Carpet with four points.
    var vertices = [
        vec2( -1, 1 ),
        vec2(  1,  1 ),
        vec2(  1, -1 ),
        vec2(  -1,  -1 )
    ];

    //사각형을 9분할해서 가운데 사각형을 빼는 함수(NumTimesToSubdivide만큼 divide)
    divideRectangle( vertices[0], vertices[1], vertices[2],vertices[3],NumTimesToSubdivide);

    //
    //webgl설정
    //

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW ); 

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    render();
};

function rectangle( a, b, c, d )
{
    points.push( a, b, c , a,d,c );
}//삼각형 두개로 사각형을 만들 것이므로 point 6개 push

function divideRectangle( a, b, c, d, count )
{

    // check for end of recursion
    
    if ( count == 0 ) {
        rectangle( a, b, c ,d );
    }
    else {
        //사각형 9개로 나눴을 때 각 꼭짓점 계산
        var ab1 = mix( a, b, 1/3 );
        var ab2 = mix(a,b,2/3);
        var bc1 = mix(b,c,1/3);
        var bc2 = mix(b,c,2/3);
        var cd1 = mix(c,d,1/3);
        var cd2 = mix(c,d,2/3);
        var da1 = mix(d,a,1/3);
        var da2 = mix(d,a,2/3);
        var ac1 = mix(a,c,1/3);
        var ac2 = mix(a,c,2/3);
        var bd1 = mix(b,d,1/3);
        var bd2 = mix(b,d,2/3);

        --count;

        // 8 new rectangle
        
        divideRectangle(a,ab1,ac1,da2,count);
        divideRectangle(ab1,ab2,bd1,ac1,count);
        divideRectangle(ab2,b,bc1,bd1,count);
        divideRectangle(da2,ac1,bd2,da1,count);
        divideRectangle(bd1,bc1,bc2,ac2,count);
        divideRectangle(da1,bd2,cd2,d,count);
        divideRectangle(bd2,ac2,cd1,cd2,count);
        divideRectangle(ac2,bc2,c,cd1,count);
    }
}

function render()
{
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));//버퍼에 꼭짓점 data 저장
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.TRIANGLES,0,points.length);//primitives를 삼각형으로 지정.
    
}



