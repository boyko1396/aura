#include <commonMain>
#include <chank>


varying vec3 vPos;
varying float vDepth;
varying float vSpeed;
varying float vVertID;

vec3 col = vec3(1.0);
float alpha = 1.0;

void main(){
    float radius = 1.0;
    float d = distance(gl_PointCoord, vec2(0.5));
    float c = 1.0-smoothstep(-radius, radius, d);
    c = pow(c, 3.0);


    //! BLUM
    //alpha = c*0.08;
    //alpha -= (vSpeed)*0.003;

    //! PARTICLE CENTER
    //if (d < 1.0) 
    {
        alpha = 0.05;
        alpha -= (vSpeed)*0.02;
    }



    //! INSIDE SHADOW
    if (vDepth > INSIDE_SHERE_SIZE) {
        alpha = 0.0;
    }


    //! COLOR
    //col = vec3(0.0, 0.4, 0.8)*0.5+0.1+vSpeed*0.1;
    //col = mix(vec3(0.3, 0.6, 1.0), vec3(1.5), vSpeed*0.15);
    //col = vec3(0.4, 0.6, 1.0)+vSpeed*0.1;

    col = vec3(0.0, 0.4, 0.8)*0.5+0.2+vSpeed*0.1;
    col.g += sin(vSpeed*5.0)*0.05;

    //alpha *= step(0.001, alpha);
    if (alpha < 0.001) {
        alpha = 0.0;
    }

    col = clamp(col, 0.0, 1.0);

    fragColor = vec4(col, alpha);
}