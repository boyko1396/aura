#include <commonMain>
#include <chank>



uniform sampler2D particles;

varying vec2 vUv;


vec4 col = vec4(1.0);
vec4 colP;
vec3 colB;

void main(){

    vec2 uv = vUv;
    
    colP = vec4(texture2D(particles, uv).rgb, 1.0);
    //colB = fastBlur(particles, uv, uResolution, vec2(2.0));



    //col = colP+vec4(colB, 1.0);
    col = colP;




    //col.a *= step(0.001, col.a);
    if (col.a < 0.001) {
        col.a = 0.0;
    }

    col = clamp(col, 0.0, 1.0);





    fragColor = vec4(col.rgba);

}