#include <commonMain>
#include <chank>



varying float vVertID;
varying vec3 vPos;
varying vec2 vUV;
varying vec3 vNormal;
varying float vDepth;
varying vec3 vAngle;


varying float vAngleSpeed;
varying float vLoadValue;
varying float vPostLoad;

vec3 col = vec3(0.0);
float alpha = 1.0;


void main(){

    vec3 pos = vPos;
    vec3 angle = vAngle;

    alpha = 0.05;
    alpha -= (vAngleSpeed)*(3.0-sin(vDepth))*0.015;
    

        //! STATE LOADING 
/*
        float openAngle = vLoadValue * 180.0;
        vec2 rotUV = rotate2D(pos.xy, -90.0 + openAngle);
        float angleL = atan(rotUV.y, rotUV.x);
        bool dist = length(pos.xy) < 2.0;

        if (abs(angleL) > (openAngle / 180.0 * PI) && dist) {
            alpha = 0.0;
        }
        alpha -= (1.19-length(pos.xy))*(0.2-vPostLoad*0.2);
    */
    


    //! LIGHT
    //alpha += 0.03*(dot(normalize(vNormal), (vec3(-1.0, 1.0, 1.0))));



    //! INSIDE SHADOW
    if (vDepth > INSIDE_SHERE_SIZE) {
        alpha = 0.0;
    }


    //! COLOR
    //col = mix(vec3(0.3, 0.6, 1.0), vec3(1.5), vAngleSpeed*0.15);
    //col = vec3(0.4, 0.6, 1.0)+vAngleSpeed*0.1;
    //col = vec3(0.0, 0.4, 0.8)*0.5+0.2+vAngleSpeed*0.1;
    col = vec3(0.0, 0.3, 0.8)+0.3+vAngleSpeed*0.1;
    col.g += cos(vAngleSpeed*10.0)*0.05;


    alpha *= 2.0;


    //col.rgb = normalize(vec3(vAngle));


    if (alpha < 0.001) {
        alpha = 0.0;
    }



    col = clamp(col, 0.0, 1.0);
    alpha = clamp(alpha, 0.0, 1.0);

    fragColor = vec4(col, alpha);
}