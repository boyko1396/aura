#include <commonMain>
#include <chank>


uniform sampler2D voronoi;

in float vVertID;
in vec3 vPos;
in vec2 vUV;
in vec3 vNormal;
in float vDepth;
in vec3 vAngle;


in float vAngleSpeed;
in float vLoadValue;
in float vPostLoad;

vec3 col = vec3(1.0);
float alpha = 1.0;
vec3 voronoiN( in vec2 x )
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

        o = 0.5 + 0.5*sin( uTime + 6.2831*o );

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

        o = 0.5 + 0.5*sin( uTime + 6.2831*o );

        vec2 r = g + o - fp;

        if( dot(mr-r,mr-r)>0.00001 )
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }

    return vec3( mr, md );
}

float glow(vec2 r) {
    return pow(0.3 / length(r), 1.3); // change magic constants here
}
vec3 glow_corrected(vec3 base_col, vec2 r) {
    float g = glow(r) - glow(vec2(1,0)); // bound correction
    return 1. - exp(-g * base_col); //col correction
}

void main(){


    //! LIGHT
    //alpha += 0.03*(dot(normalize(vNormal), (vec3(-1.0, 1.0, 1.0))));



    //! INSIDE SHADOW
    if (vDepth > INSIDE_SHERE_SIZE) {
        alpha = 0.0;
    }


    vec2 pointcoord = gl_PointCoord;
    vec2 r = 2.*pointcoord - 1.;
    vec3 base_col = vec3(0.2, 0.5, 1.0);
    float d = length(r);

    col = glow_corrected(base_col, r);



    alpha = d*0.2;
    if (d < 0.2) 
    {
        alpha = 1.0;
        //alpha -= (vSpeed)*0.05;
        //alpha -= (vSpeed)*((vDepth))*0.02;
        alpha -= (vAngleSpeed)*(6.0-sin(vDepth))*0.01;
    }




    //col.rgb = normalize(vec3(vAngle));


    if (alpha < 0.001) {
        alpha = 0.0;
    }



    col = clamp(col, 0.0, 1.0);
    alpha = clamp(alpha, 0.0, 1.0);

    fragColor = vec4(col, alpha);
}