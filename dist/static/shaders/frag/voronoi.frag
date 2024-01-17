#include <commonMain>
#include <chank>



#define ANIMATE

in vec2 vUv;

vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

/*
vec2 hash2( vec2 p )
{
	// texture based white noise
	return textureLod( iChannel0, (p+0.5)/256.0, 0.0 ).xy;
	
    // procedural white noise	
	//return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}*/

vec3 voronoiNormal( in vec2 x )
{
    vec2 ip = floor(x);
    vec2 fp = fract(x);

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
	vec2 mg, mr;

    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 g = vec2(float(i),float(j));
		vec2 o = rand2( ip + g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( uTime + 6.2831*o );
        #endif	
        vec2 r = g + o - fp;
        float d = dot(r,r);

        if( d<md )
        {
            md = d;
            mr = r;
            mg = g;
        }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = mg + vec2(float(i),float(j));
		vec2 o = rand2( ip + g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( uTime + 6.2831*o );
        #endif	
        vec2 r = g + o - fp;

        if( dot(mr-r,mr-r)>0.00001 )
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }

    return vec3( mr, md );
}

void main(){
    vec2 uv = vUv;

    //uv = (uv-0.5)*vec2(PI*2.0, PI);
    //col.rgb = voronoiNormal(uv*3.0);


    col.rgb = voronoiNormal(uv*15.0);

    fragColor = vec4(col.rgba);
}