#include <commonMain>
#include <chank>


uniform sampler2D voronoi;

in vec3 vPos;
in vec2 vUV;
in vec3 vNormal;
in float vDepth;
in float vSpeed;
in float vVertID;
in vec3 vAngle;

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

void main(){
    /*float radius = 1.0;
    float d = distance(gl_PointCoord, vec2(0.5));
    float c = 1.0-smoothstep(-radius, radius, d);
    c = pow(c, 3.0);*/


    alpha = 0.0;
    //if (d < 1.0) 
    {
        alpha = 0.05;
        //alpha -= (vSpeed)*0.05;
        //alpha -= (vSpeed)*((vDepth))*0.02;
        alpha -= (vSpeed)*(6.0-sin(vDepth))*0.01;
    }

    //! LIGHT
    //alpha += 0.03*(dot(normalize(vNormal), (vec3(-1.0, 1.0, 1.0))));



    //! INSIDE SHADOW
    if (vDepth > INSIDE_SHERE_SIZE) {
        alpha = 0.0;
    }


    //! COLOR
    col = mix(vec3(0.3, 0.6, 1.0), vec3(1.5), vSpeed*0.15);
    //col = vec3(0.4, 0.6, 1.0)+vSpeed*0.1;
    //col = vec3(0.0, 0.4, 0.8)*0.5+0.2+vSpeed*0.1;
    //col = vec3(0.0, 0.3, 0.8)+0.3+vSpeed*0.1;
    col.g += cos(vSpeed*10.0)*0.05;

    alpha *= 4.0;


    vec2 p = gl_PointCoord;
    vec3 c = voronoiN((p+rand2(vPos.xy+vAngle.xy)));//texture(voronoi, p).rgb;

	float dd = length( c.xy );
    float a = 0.1;
    col.rgb *= (1.0-smoothstep( a, a*2.0, dd));




    //col.rgb = normalize(vec3(vAngle));


    if (alpha < 0.001) {
        alpha = 0.0;
    }



    col = clamp(col, 0.0, 1.0);
    alpha = clamp(alpha, 0.0, 1.0);

    fragColor = vec4(col, alpha);
}