(function ($) {

// use modernizr to check for canvas etc

    var colorApollonius    = "#ccc",
        colorPerpendicular = "#fcc",
        colorPoint         = "#aca",
        strokeWidth        = 1,
        canvas             = document.getElementById('canvasApollonius'),
        context            = canvas.getContext('2d'),
        centerX,
        centerY,
        radius             = 70,
        arcSpan            = 7,
        i,
        k,
        point,
        points,
        circle,
        circles,
        x_a,
        y_a,
        x_b,
        y_b,
        mouseX,
        mouseY;

    var apollonius = {
        init: function () {
            canvas.width  = $(window).width();
            canvas.height = $(window).height();
            centerX       = Math.round(0.8 * canvas.width);
            centerY       = Math.round(0.8 * canvas.height);
            mouseX        = mouseX === undefined ? Math.round(0.8 * canvas.width) : mouseX;
            mouseY        = mouseY === undefined ? Math.round(0.2 * canvas.width) : mouseY;
        },

        drawPoints: function () {

            var points = [
              { x: x_a,    y: y_a},
              { x: x_b,    y: y_b},
              { x: mouseX, y: mouseY}
            ];

            for (i = points.length - 1; i >= 0; i--) {
              point = points[i];

              context.beginPath();
              context.arc(centerX + 10 * point.x, centerY + 10 * point.y, 3, 0, 2 * Math.PI, false);
              context.fillStyle = colorPoint;
              context.fill();
              context.lineWidth = 1;
              context.strokeStyle = colorPoint;
              context.stroke();
            }
        },

        run: function () {
            var t = 0;
            setInterval(function () {
                x_a =  5 * Math.cos(t);
                y_a =  5 * Math.sin(t);
                x_b = -5 * Math.cos(t);
                y_b = -5 * Math.sin(t);

                this.drawPicture(mouseX, mouseY);

                t += 0.001;
            }.bind(this), 20);
        },

        calculateApolloniusCircle: function(k, inverse) {
            var x,
                y,
                r,
                X,
                Y,
                R;

            x = (k * k * x_b - x_a) / (k * k - 1);
            y = (k * k * y_b - y_a) / (k * k - 1);
            r = Math.sqrt( Math.pow((x_a - k * k * x_b) / (k * k - 1), 2) + Math.pow((y_a - k * k * y_b) / (k * k - 1), 2) - x_a * x_a - y_a * y_a + k * k * x_b * x_b + k * k * y_b * y_b);

            X = centerX + 10 * x;
            Y = centerY + 10 * y;
            R = 10 * r;

            return {x: X, y: Y, r: R};
        },

        calculateApolloniusCircleThroughPoint: function(x, y) {
            var xp_a = centerX + 10 * x_a;
            var yp_a = centerY + 10 * y_a;
            var xp_b = centerX + 10 * x_b;
            var yp_b = centerY + 10 * y_b;

            var distance_a = Math.sqrt(Math.pow((x - xp_a), 2) + Math.pow((y - yp_a), 2));
            var distance_b = Math.sqrt(Math.pow((x - xp_b), 2) + Math.pow((y - yp_b), 2));
            var k = distance_a / distance_b;
            var k_inverse = distance_b / distance_a;

            if (k <= 1) {
                return this.calculateApolloniusCircle(k, false);
            } else {
                // calculateApolloniusCircle(k_inverse, true);
                return this.calculateApolloniusCircle(k, false);
            }
        },

        drawPerpendicularCircleThroughPoint: function(x_c, y_c) {
            var x,
                y,
                r,
                X,
                Y,
                R;

            x_c = (x_c - centerX) / 10;
            y_c = (y_c - centerY) / 10;

            x = 0.5 * (y_b - y_c + (x_a * x_a - x_c * x_c) / (y_c - y_a) - (x_a * x_a - x_b * x_b) / (y_b - y_a)) / ( (x_a - x_c) / (y_c - y_a) - (x_a - x_b) / (y_b - y_a) );
            y = (x - 0.5 * (x_a + x_c)) * (x_a - x_c) / (y_c - y_a) + 0.5 * (y_a + y_c);
            r = Math.sqrt(Math.pow(x - x_a, 2) + Math.pow(y - y_a, 2));

            X = centerX + 10 * x;
            Y = centerY + 10 * y;
            R = 10 * r;

            context.beginPath();
            context.arc(X, Y, R, 0, 6.3, false);
            context.lineWidth = strokeWidth;
            context.strokeStyle = colorPerpendicular;
            context.stroke();
        },

        drawPicture: function (intersectionX, intersectionY) {
            var c;

            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawPoints();
            this.drawPerpendicularCircleThroughPoint(intersectionX, intersectionY);

            // context.beginPath();
            // context.arc(c.x, c.y, c.r, 0, 6.3, false);
            // context.lineWidth = strokeWidth;
            // context.strokeStyle = colorPerpendicular;
            // context.stroke();

            c = this.calculateApolloniusCircleThroughPoint(intersectionX, intersectionY);

            context.beginPath();
            context.arc(c.x, c.y, c.r, 0, 6.3, false);
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