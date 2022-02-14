const geometry = {
  points: {
    // helpermethods for points
    match: (pointA, pointB) => {
      // checks if two Points share the same Position
      if (pointA.x === pointB.x && pointA.y === pointB.y) {
        return true;
      } else {
        return false;
      }
    },
    inBetweenAB: (pointM, pointA, pointB) => {
      // checks if a Point (M) lays inbetweenAB two other Points (A & B)
      const distanceAB = Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
      const distanceMA = Math.sqrt(Math.pow(pointM.x - pointA.x, 2) + Math.pow(pointM.y - pointA.y, 2));
      const distanceMB = Math.sqrt(Math.pow(pointM.x - pointB.x, 2) + Math.pow(pointM.y - pointB.y, 2));

      if (distanceMA <= distanceAB && distanceMB <= distanceAB) {
        return true;
      } else {
        return false;
      }
    },
    afterAB: (pointM, pointA, pointB) => {
      // if pointM comes after pointB return true
      const distanceAB = Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
      const distanceMA = Math.sqrt(Math.pow(pointM.x - pointA.x, 2) + Math.pow(pointM.y - pointA.y, 2));
      const distanceMB = Math.sqrt(Math.pow(pointM.x - pointB.x, 2) + Math.pow(pointM.y - pointB.y, 2));


      if (distanceMA >= distanceAB && distanceMB <= distanceMA) {
        return true;
      } else {
        return false;
      }
    },
    middlePoint: (pointA, pointB) => {
      // returns the point that lays between A & B
      return {
        x: (pointA.x + pointB.x) / 2,
        y: (pointA.y + pointB.y) / 2
      };
    },
    procentualDistance: (pointM, pointA, pointB) => {
      // returns the distance of pointM to pointA to a value from 0 to 1 (1 is distance of A & B)
      const distanceMax = Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
      const distanceMA = Math.sqrt(Math.pow(pointA.x - pointM.x, 2) + Math.pow(pointA.y - pointM.y, 2));

      return map(distanceMA, 0, distanceMax, 0, 1);
    },
  },
  lines: {
    // helpermethods for lines
    crossingPoint: (lineA, lineB) => {
      // returns the crossing Point of two lines
      let crossingPoint = {};
      
      lineA.m = (lineA[0].y - lineA[1].y) / (lineA[0].x - lineA[1].x);
      lineA.p = lineA[0].y - (lineA.m * lineA[0].x);

      lineB.m = (lineB[0].y - lineB[1].y) / (lineB[0].x - lineB[1].x);
      lineB.p = lineB[0].y - (lineB.m * lineB[0].x);


      crossingPoint.x = (lineB.p - lineA.p) / (lineA.m - lineB.m);
      crossingPoint.y = lineA.m * crossingPoint.x + lineA.p;

      return crossingPoint;
    },
  }
};

function map(value, minStart, maxStart, minGoal, maxGoal) {
  return (value - minStart) / (maxStart - minStart) * (maxGoal - minGoal) + minGoal;
}

const colorMath = {
  HSVtoRGB: (val) => {
    // transforms a hsv-value to a rgb-value
    let sat = map(val.sat, 0, 254, 0, 1);
    let bri = map(val.bri, 0, 254, 0, 1);
    let chrome = sat*bri;
    let hue = map(val.hue, 0, 65535, 0, 360);
  
    let x = chrome * (1 - Math.abs(((hue/60.0) % 2 ) - 1));
    let m = bri - chrome;
    let r, g, b;
    if(hue >= 0 && hue < 60){
      r = chrome;
      g = x;
      b = 0;
    }
    else if(hue >= 60 && hue < 120){
      r = x;
      g = chrome;
      b = 0;
    }
    else if(hue >= 120 && hue < 180){
      r = 0;
      g = chrome;
      b = x;
    }
    else if(hue >= 180 && hue < 240){
      r = 0; 
      g = x;
      b = chrome;
    }
    else if(hue >= 240 && hue < 300){
      r = x;
      g = 0;
      b = chrome;
    }
    else{
      r = chrome;
      g = 0;
      b = x;
    }
  
    let red = (r + m) * 255;
    let green = (g + m) * 255;
    let blue = (b + m) * 255;
  
    return {r: red, g: green, b: blue};
  },
  RGBtoHSV: (val) => {
    // transforms a rgb-Value to a hsv-Value
    let r = val.r / 255;
    let g = val.g / 255;
    let b = val.b / 255;
    let chromeMax = Math.max(r, g, b);
    let chromeMin = Math.min(r, g, b);
  
    let hue, sat, bri;
  
    if (chromeMax === chromeMin) { // a grey value
      hue = 0;
    } else if (r === chromeMax) { // a mainly red value
      hue = 60 * ((g - b) / (chromeMax - chromeMin));
    } else if (g === chromeMax) { // a mainly green value
      hue = 60 * ((b - r) / (chromeMax - chromeMin) + 2);
    } else if (b === chromeMax) { // a mainly blue value
      hue = 60 * ((r - g) / (chromeMax - chromeMin) + 4);
    }
  
    if (chromeMax === 0) {
      sat = 0;
    } else {
      sat = (chromeMax - chromeMin) / chromeMax;
    }
  
    bri = chrome;
  
    return {hue: hue, sat: sat, bri: bri};
  },
  XYtoRGB: (cPoint) => {
    const rPoint = {x: 0.6915, y: 0.3038};
    const gPoint = {x: 0.17, y: 0.7};
    const bPoint = {x: 0.1532, y: 0.0475};
    const wPoint = {x: 0.3127, y: 0.329};
  
    let color = {
      r: 0,
      g: 0,
      b: 0
    };
  
    if (geometry.points.match(cPoint, wPoint)) { // when the color is white
      // its a greyTone
    } else {
      // get the crossing point of the white-color line and the traiingle sides
      let brPoint = geometry.lines.crossingPoint([bPoint, rPoint], [cPoint, wPoint]);
      let rgPoint = geometry.lines.crossingPoint([rPoint, gPoint], [cPoint, wPoint]);
      let gbPoint = geometry.lines.crossingPoint([gPoint, bPoint], [cPoint, wPoint]);
  
      // 1. checks if its a number
      // 2. checks if the crossingPoint of a line with is inside the line from blue to red (if not, then the colour isnt in this Part of the triangle)
      // 3. if the cPoint is either between the wPoint and the brPoint (inside the triangle) or outside of the triangle, but more near to the brPoint
      if (!isNaN(brPoint.x + brPoint.y) && geometry.points.inBetweenAB(brPoint, bPoint, rPoint) && (geometry.points.inBetweenAB(cPoint, wPoint, brPoint) || geometry.points.afterAB(cPoint, wPoint, brPoint))) {
        console.log("1");
        if (geometry.points.inBetweenAB(brPoint, geometry.points.middlePoint(bPoint, rPoint), rPoint)) {
          // the crossing point sits on the more-red half of the blueRed line
          color.r = 1;
          color.g = 0;
          color.b = geometry.points.procentualDistance(brPoint, rPoint, geometry.points.middlePoint(bPoint, rPoint));
  
        } else if (geometry.points.inBetweenAB(brPoint, geometry.points.middlePoint(bPoint, rPoint), bPoint)) {
          // the crossing point sits on the more-blue half of the blueRed line
          color.r = geometry.points.procentualDistance(brPoint, bPoint, geometry.points.middlePoint(bPoint, rPoint));
          color.g = 0;
          color.b = 1;
  
        } else if (geometry.points.match(brPoint, geometry.points.middlePoint(bPoint, rPoint))) {
          // the crossingPoint sits right between blue and red
          color.r = 1;
          color.g = 0;
          color.b = 1;
  
        } else {
          console.log("you still forgot some cases in color determination");
        }
      } else if (!isNaN(rgPoint.x + rgPoint.y) && geometry.points.inBetweenAB(rgPoint, rPoint, gPoint) && (geometry.points.inBetweenAB(cPoint, wPoint, rgPoint) || geometry.points.afterAB(cPoint, wPoint, rgPoint))) {
        console.log("2");
        if (geometry.points.inBetweenAB(rgPoint, geometry.points.middlePoint(rPoint, gPoint), gPoint)) {
          // the crossing point sits on the more-green half of the redGreen line
          color.r = geometry.points.procentualDistance(rgPoint, gPoint, geometry.points.middlePoint(rPoint, gPoint));
          color.g = 1;
          color.b = 0;
          
        } else if (geometry.points.inBetweenAB(rgPoint, geometry.points.middlePoint(rPoint, gPoint), rPoint)) {
          // the crossing point sits on the more-red half of the redGreen line
          color.r = 1;
          color.g = geometry.points.procentualDistance(rgPoint, rPoint, geometry.points.middlePoint(rPoint, gPoint));
          color.b = 0;
  
        } else if (geometry.points.match(rgPoint, geometry.points.middlePoint(rPoint, gPoint))) {
          // the crossingPoint sits right between red and green
          color.r = 1;
          color.g = 1;
          color.b = 0;
        } else {
          console.log("you still forgot some cases in color determination");
        }
      } else if (!isNaN(gbPoint.x + gbPoint.y) && geometry.points.inBetweenAB(gbPoint, gPoint, bPoint) && (geometry.points.inBetweenAB(cPoint, wPoint, gbPoint) || geometry.points.afterAB(cPoint, wPoint, gbPoint))) {
        if (geometry.points.inBetweenAB(gbPoint, geometry.points.middlePoint(gPoint, bPoint), bPoint)) {
          // the crossing point sits on the more-blue half of the greenBlue line
          color.r = 0;
          color.g = geometry.points.procentualDistance(gbPoint, bPoint, geometry.points.middlePoint(gPoint, bPoint));
          color.b = 1;
          
        } else if (geometry.points.inBetweenAB(gbPoint, geometry.points.middlePoint(gPoint, bPoint), gPoint)) {
          // the crossing point sits on the more-green half of the greenBlue line
          color.r = 0;
          color.g = 1;
          color.b = geometry.points.procentualDistance(gbPoint, gPoint, geometry.points.middlePoint(gPoint, bPoint));
  
        } else if (geometry.points.match(gbPoint, geometry.points.middlePoint(gPoint, bPoint))) {
          // the crossingPoint sits right between blue and red
          color.r = 0;
          color.g = 1;
          color.b = 1;
        } else {
          console.log("you still forgot some cases in color determination");
        }
      } else {
        console.log("AnotherColorError?");
      }
    }
  },
  sortRGBvalues: (colors) => {
    // sorts the rgb values to create smoother gradients
    let newColors = [];
    
    colors.forEach(color => {
      // convert rgb to hsv
      color.degree = RGBtoHSV(color).hue + 0;
      // green has to be the degree startpoint
  
      let added = false;
      
      for (let a = 0; a < newColors.length; a++) {
        const existingColor = newColors[a];
        // check if the color.hue got higher than an existing one, put it in front of it
        if (color.degree < existingColor.degree) {
          newColors.splice(a, 0, color);
          added = true;
          break;
        }
      }
      if (!added) newColors.push(color);
    });
  
    return newColors;
  },
};