/**
* Target with smoothstep by possum (https://www.shadertoy.com/view/Xsl3RX)
* Converted and enhanced for use with Phaser by Max Fierke
*/
Phaser.Filter.Hypnosis = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 };

    //  The fragment shader source
    this.fragmentSrc = [

        "precision mediump float;",
        "uniform vec2      resolution;",
        "uniform float     time;",
        "uniform float     alpha;",
        "uniform sampler2D uSampler;",

        "const float rings = 5.0;",
        "const float velocity=4.;",
        "const float b = 0.003;",

        "void main(void) {",
            "vec2 position = gl_FragCoord.xy / resolution.xy;",
            "float aspect = resolution.x / resolution.y;",
            "position.x *= aspect;",
            "float dist = distance(position, vec2(aspect * 0.5, 0.5));",
            "float offset = time * velocity;",
            "float conv = rings * 4.;",
            "float v = dist*conv-offset;",
            "float ringr = floor(v);",
            "float color = smoothstep(-b, b, abs(dist- (ringr + float(fract(v) > 0.5) + offset) / conv));",
            "if(mod(ringr,2.)==1.) color = 1.-color;",
            "gl_FragColor = vec4(color, color, color, 0.1);",
        "}"
    ];

};

Phaser.Filter.Hypnosis.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Hypnosis.prototype.constructor = Phaser.Filter.Hypnosis;

Phaser.Filter.Hypnosis.prototype.init = function (width, height, alpha) {
    this.setResolution(width, height);

    if (typeof alpha !== 'undefined') {
        this.uniforms.alpha.value = alpha;
    }
}

Object.defineProperty(Phaser.Filter.Hypnosis.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});