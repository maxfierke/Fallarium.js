/**
* Psychedelix by TomoAlien (https://www.shadertoy.com/view/MdsXDM)
* Converted and enhanced for use with Phaser by Max Fierke
*/
Phaser.Filter.Psychedelix = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 };

    //  The fragment shader source
    this.fragmentSrc = [
        "precision mediump float;",
        "uniform vec2      resolution;",
        "uniform float     time;",
        "uniform float     alpha;",
        "uniform sampler2D uSampler;",

        "void main(void) {",
            "vec2 uv = gl_FragCoord.xy / resolution.xy;",
            "vec2 pos = (uv.xy-0.5);",
            "vec2 cir = ((pos.xy*pos.xy+sin(uv.x*18.0+time)/25.0*sin(uv.y*7.0+time*1.5)/1.0)+uv.x*sin(time)/16.0+uv.y*sin(time*1.2)/16.0);",
            "float circles = (sqrt(abs(cir.x+cir.y*0.5)*25.0)*5.0);",
            "vec4 displace = vec4(sin(circles*1.25+2.0), abs(sin(circles*1.0-1.0)-sin(circles)), abs(sin(circles)*1.0), alpha);",
            "vec4 frame = texture2D(uSampler, uv + vec2(cir));",
            "vec4 final = mix(frame, displace, 0.0);",
            "gl_FragColor = final;",
        "}"
    ];

};

Phaser.Filter.Psychedelix.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Psychedelix.prototype.constructor = Phaser.Filter.Psychedelix;

Phaser.Filter.Psychedelix.prototype.init = function (width, height, alpha) {
    this.setResolution(width, height);

    if (typeof alpha !== 'undefined') {
        this.uniforms.alpha.value = alpha;
    }
}

Object.defineProperty(Phaser.Filter.Psychedelix.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});
