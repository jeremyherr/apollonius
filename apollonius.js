(function ($) {

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

// use modernizr to check for canvas etc

    var colorApollonius    = "#ccc",
        colorPerpendicular = "#fcc",
        colorPoint         = "#aca",
        strokeWidth        = 1,
        canvas             = document.getElementById('canvasApollonius'),
        context            = canvas.getContext('2d'),
        originX,
        originY,
        focus1X,
        focus1Y,
        focus2X,
        focus2Y,
        mouseX,
        mouseY;

    var apollonius = {
        init: function () {
            canvas.width  = $(window).width();
            canvas.height = $(window).height();
            originX       = Math.round(0.8 * canvas.width);
            originY       = Math.round(0.8 * canvas.height);
            mouseX        = mouseX === undefined ? Math.round(0.8 * canvas.width) : mouseX;
            mouseY        = mouseY === undefined ? Math.round(0.2 * canvas.width) : mouseY;
        },

        drawPoints: function () {
            var i,
                point,
                points = [
              { x: focus1X, y: focus1Y},
              { x: focus2X, y: focus2Y},
              { x: mouseX,  y: mouseY}
            ];

            for (i = points.length - 1; i >= 0; i--) {
              point = points[i];

              context.beginPath();
              context.arc(originX + point.x, originY + point.y, 3, 0, 6.2832);
              context.fillStyle = colorPoint;
              context.fill();
              context.lineWidth = 1;
              context.strokeStyle = colorPoint;
              context.stroke();
            }
        },

        run: function () {
            var t = 0.001;
            window.setInterval(function () {
                focus1X =  50 * Math.cos(t);
                focus1Y =  50 * Math.sin(t);
                focus2X = -50 * Math.cos(t);
                focus2Y = -50 * Math.sin(t);

                this.drawPicture(mouseX, mouseY);

                t += 0.001;
            }.bind(this), 15);
        },

        calculateApolloniusCircle: function(k) {
            var x,
                y,
                r,
                kk = k * k,
                kkMinus1 = kk - 1;

            x = (kk * focus2X - focus1X) / kkMinus1;
            y = (kk * focus2Y - focus1Y) / kkMinus1;
            r = distance(x, y, mouseX - originX, mouseY - originY);

            return {x: originX + x, y: originY + y, r: r};
        },

        calculateApolloniusCircleThroughPoint: function(x, y) {
            var xp_a = originX + focus1X;
            var yp_a = originY + focus1Y;
            var xp_b = originX + focus2X;
            var yp_b = originY + focus2Y;

            var distance_a = distance(x, y, xp_a, yp_a);
            var distance_b = distance(x, y, xp_b, yp_b);
            var k = distance_a / distance_b;

            return this.calculateApolloniusCircle(k);
        },

        calculatePerpendicularCircleThroughPoint: function(x_c, y_c) {
            var x,
                y,
                r;

            x_c = (x_c - originX);
            y_c = (y_c - originY);

            x = 0.5 * (focus2Y - y_c + (focus1X * focus1X - x_c * x_c) / (y_c - focus1Y) - (focus1X * focus1X - focus2X * focus2X) / (focus2Y - focus1Y)) / ( (focus1X - x_c) / (y_c - focus1Y) - (focus1X - focus2X) / (focus2Y - focus1Y) );
            y = (x - 0.5 * (focus1X + x_c)) * (focus1X - x_c) / (y_c - focus1Y) + 0.5 * (focus1Y + y_c);
            r = distance(x, y, focus1X, focus1Y);

            return {x: originX + x, y: originY + y, r: r};
        },

        drawPicture: function (intersectionX, intersectionY) {
            var c;

            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawPoints();
            c = this.calculatePerpendicularCircleThroughPoint(intersectionX, intersectionY);

            context.beginPath();
            context.arc(c.x, c.y, c.r, 0, 6.2832);
            context.lineWidth = strokeWidth;
            context.strokeStyle = colorPerpendicular;
            context.stroke();

            c = this.calculateApolloniusCircleThroughPoint(intersectionX, intersectionY);

            context.beginPath();
            context.arc(c.x, c.y, c.r, 0, 6.2832);
            context.lineWidth = strokeWidth;
            context.strokeStyle = colorApollonius;
            context.stroke();
        }
    };

    $("#canvasApollonius").mousemove(function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
        apollonius.drawPicture(mouseX, mouseY);
    });

    $(window).resize(function () {
        apollonius.init();
    });

    apollonius.init();
    apollonius.run();
})($);