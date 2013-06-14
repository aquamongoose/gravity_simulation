var canvas, context;
var runbutton;
var WIDTH = 1200, HEIGHT = 600;
var planets = [];
var stopbutton, keep_running;
var G = 20;
var scale = 1;

function Planet(x, y, dy, dx, m) {
    this.x = x;
    this.y = y;
    this.r = 4*Math.pow(m, 0.6);
    this.dy = dy;
    this.dx = dx;
    this.m = m;
    this.draw = function() {
        context.beginPath();
        context.arc(this.x/scale, this.y/scale, this.r/scale, 0, 2*Math.PI, false);
        context.closePath();
        context.fill();
    }
    this.move = function() {
        this.x += this.dx;
        this.y += this.dy;
    }
    this.addGravityFrom = function(that) {
        var dist = Math.sqrt(Math.pow(that.x-this.x, 2) + Math.pow(that.y-this.y, 2));
        var acc = G*that.m/Math.pow(dist, 2);
        var cx = acc*Math.abs(that.x-this.x)/dist;
        var cy = acc*Math.abs(that.y-this.y)/dist;

        if (that.x < this.x)
            this.dx -= cx;
        else
            this.dx += cx;

        if (that.y < this.y)
            this.dy -= cy;
        else
            this.dy += cy;
    }
}

function loop() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i=0; i<planets.length; i++) {
        for (var j=0; j<planets.length; j++)
        {
            if (j == i) continue;
            planets[i].addGravityFrom(planets[j]);
        }
    }
    var xmin = WIDTH, ymin = HEIGHT;
    for (var i=0; i<planets.length; i++) {
        planets[i].move();
        planets[i].draw();
        if (planets[i].x < xmin)
            xmin = planets[i].x;
        if (planets[i].y < ymin)
            ymin = planets[i].y;
    }
    /*
    xmin -= 60;
    ymin -= 60;
    var xmax = 0, ymax = 0;
    for (var i=0; i<planets.length; i++) {
        planets[i].x -= xmin;
        planets[i].y -= ymin;
        if (planets[i].x > xmax)
            xmax = planets[i].x;
        if (planets[i].y > ymax)
            ymax = planets[i].y;
    }
    scale = ymax/HEIGHT;
    if (xmax/WIDTH > scale)
        scale = xmax/WIDTH;
    */
    if (keep_running)
        setTimeout(loop, 10);
}

function run()
{
    if (keep_running) return;
    keep_running = true;
    loop();
}

function handleCanvasClick(event) {
    event = event || window.event;
    var x = event.pageX-canvas.offsetLeft;
    var y = event.pageY-canvas.offsetTop;
    var p = new Planet(x, y, 0, 0, prompt("Mass:"));
    p.draw();
    planets.push(p);
}

function init() {
    runbutton = document.getElementById("run_button");
    stopbutton = document.getElementById("stop_button");
    canvas = document.getElementById("main_canvas");
    context = canvas.getContext("2d");
    canvas.addEventListener("click", handleCanvasClick, false);
    runbutton.addEventListener("click", run, false);
    stopbutton.addEventListener("click", function() {
        keep_running = false;
        planets = [];
        scale = 1;
    }, false);
}
