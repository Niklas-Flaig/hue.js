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

function DECtoHEX(decNum) {
  let hex = [0];

  for (let x = 0; x < decNum; x++) {
    hex[hex.length - 1]++;

    for (let y = hex.length; y > 0; y--) {
      if (hex[y - 1] >= 16) {
        hex[y - 1] = 0;

        if (y - 1 === 0) {
          hex.splice(0, 0, 0);
          y++;
        }

        hex[y - 2]++;
      }
    }
  }

  let hexText = "";

  hex.forEach(digit => {
    if (digit < 10) {
      hexText += digit;
    } else {
      switch (digit) {
        case 10: hexText += "A";
          break;
        case 11: hexText += "B";
          break;
        case 12: hexText += "C";
          break;
        case 13: hexText += "D";
          break;
        case 14: hexText += "E";
          break;
        case 15: hexText += "F";
          break;
      }
    }
  });

  return hexText;
}

function HEXtoDEC(hexNum) {
  let hex = hexNum.split("");

  for (let x = 0; x < hex.length; x++) {
    switch (hex[x]) {
      case "A": hex[x] = 10;
        break;
      case "B": hex[x] = 11;
        break;
      case "C": hex[x] = 12;
        break;
      case "D": hex[x] = 13;
        break;
      case "E": hex[x] = 14;
        break;
      case "F": hex[x] = 15;
        break;
      default: hex[x] = parseInt(hex[x]);
    }
  }

  let decNum = 0;

  for (let x = 0; x < hex.length; x++) {
    decNum += hex[x] * Math.pow(16, hex.length - (x + 1));
  }

  return decNum;
}

function toDecimal(numbers, system = 2) {
  let res = 0;
  for (let x = 0; x < numbers.length; x++) {
    if (numbers[x] === 1) res += Math.pow(system, numbers.length - (x + 1));
  }
  return res;
}


function map(value, minStart, maxStart, minGoal, maxGoal) {
  return (value - minStart) / (maxStart - minStart) * (maxGoal - minGoal) + minGoal;
}

const colorMath = {
  darknessGradient: (brightness) => {
    if (brightness === undefined) brightness = 1;
    return `linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, ${map(brightness, 1, 254, 0.13, 0)}) 3.67%,
      rgba(0, 0, 0, ${map(brightness, 1, 254, 0.28, 0)}) 11.11%,
      rgba(0, 0, 0, ${map(brightness, 1, 254, 0.42, 0.04)}) 22.22%,
      rgba(0, 0, 0, ${map(brightness, 1, 254, 0.52, 0.08)}) 33.33%,
      rgba(0, 0, 0, ${map(brightness, 1, 254, 0.61, 0.16)}) 50%,
      rgba(0, 0, 0, ${map(brightness, 1, 254, 0.66, 0.24)}) 66.67%,
      rgba(0, 0, 0, ${map(brightness, 1, 254, 0.70, 0.45)}) 100%
    )`;
  },
  RGBmaxSaturation: (val) => {
    let maxVal = Math.max(val.r, val.g, val.b);

    return {
      r: map(val.r, 0, maxVal, 0, 255),
      g: map(val.g, 0, maxVal, 0, 255),
      b: map(val.b, 0, maxVal, 0, 255)
    };
  },
  RGBtoHEX: (val) => {
    let color = [
      DECtoHEX(val.r),
      DECtoHEX(val.g),
      DECtoHEX(val.b),
    ];
    console.log(val);
    console.log(color);

    let text = "";

    for (let x = 0; x < color.length; x++) {
      if (color[x].length !== 2) color[x] = "0" + color[x];
      text += color[x];
    }

    return text;
  },
  HEXtoRGB: (val) => {
    let hexText = val.split("");
    return {
      r: HEXtoDEC(hexText[0] + hexText[1]),
      g: HEXtoDEC(hexText[2] + hexText[3]),
      b: HEXtoDEC(hexText[4] + hexText[5])
    };
  },
  HSVtoRGB: (val) => {
    // transforms a hsv-value to a rgb-value
    let sat = map(val.sat, 0, 254, 0, 1);
    let bri = map(val.bri, 0, 254, 0, 1);
    let chrome = sat * bri;
    let hue = map(val.hue, 0, 65535, 0, 360);
  
    let x = chrome * (1 - Math.abs(((hue/60.0) % 2 ) - 1));
    let m = bri - chrome;
    let r, g, b;
    if (hue >= 0 && hue < 60) {
      r = chrome;
      g = x;
      b = 0;
    }
    else if (hue >= 60 && hue < 120) {
      r = x;
      g = chrome;
      b = 0;
    }
    else if (hue >= 120 && hue < 180) {
      r = 0;
      g = chrome;
      b = x;
    }
    else if (hue >= 180 && hue < 240) {
      r = 0; 
      g = x;
      b = chrome;
    }
    else if (hue >= 240 && hue < 300) {
      r = x;
      g = 0;
      b = chrome;
    }
    else {
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

    if (hue < 0) hue += 360;

    hue = Math.round(map(hue, 0, 360, 0, 65535));

  
    if (chromeMax === 0) {
      sat = 0;
    } else {
      sat = Math.round((chromeMax - chromeMin) / chromeMax * 254);
    }
  
    bri = chromeMax * 254;
  
    console.log({hue: hue, sat: sat, bri: bri});
    return {hue: hue, sat: sat, bri: bri};
  },
  XYtoRGB: (cPoint, bri = 255) => {
    const rPoint = {x: 0.6915, y: 0.3083};
    const gPoint = {x: 0.2581, y: 0.6338};
    const bPoint = {x: 0.1534, y: 0.0544};
    const wPoint = {x: 0.3116, y: 0.3277};
  
    let color = {
      r: 0,
      g: 0,
      b: 0
    };

    //! The saturation of 0 means maximal saturation uffff
    let saturation = 0;
  
    if (geometry.points.match(cPoint, wPoint)) { // when the color is white
      // its a greyTone
      color.r = 1;
      color.g = 1;
      color.b = 1;
      saturation = 1;
      
    } else {
      // get the crossing point of the white-color line and the traiingle sides
      let brPoint = geometry.lines.crossingPoint([bPoint, rPoint], [cPoint, wPoint]);
      let rgPoint = geometry.lines.crossingPoint([rPoint, gPoint], [cPoint, wPoint]);
      let gbPoint = geometry.lines.crossingPoint([gPoint, bPoint], [cPoint, wPoint]);
  
      // 1. checks if its a number
      // 2. checks if the crossingPoint of a line with is inside the line from blue to red (if not, then the colour isnt in this Part of the triangle)
      // 3. if the cPoint is either between the wPoint and the brPoint (inside the triangle) or outside of the triangle, but more near to the brPoint
      if (!isNaN(brPoint.x + brPoint.y) && geometry.points.inBetweenAB(brPoint, bPoint, rPoint) && (geometry.points.inBetweenAB(cPoint, wPoint, brPoint) || geometry.points.afterAB(cPoint, wPoint, brPoint))) {
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

        saturation = geometry.points.procentualDistance(cPoint, brPoint, wPoint);

      } else if (!isNaN(rgPoint.x + rgPoint.y) && geometry.points.inBetweenAB(rgPoint, rPoint, gPoint) && (geometry.points.inBetweenAB(cPoint, wPoint, rgPoint) || geometry.points.afterAB(cPoint, wPoint, rgPoint))) {
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
        
        // datermine the saturation
        saturation = geometry.points.procentualDistance(cPoint, rgPoint, wPoint);

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

        saturation = geometry.points.procentualDistance(cPoint, gbPoint, wPoint);

      } else {
        console.log("AnotherColorError?");
      }

    }
    // apply saturation and brigthness to the color
    color.r = map(saturation, 0, 1, color.r, 1) * bri;
    color.g = map(saturation, 0, 1, color.g, 1) * bri;
    color.b = map(saturation, 0, 1, color.b, 1) * bri;

    return color;
  },
  sortRGBvalues: (colors) => {
    // sorts the rgb values to create smoother gradients
    let newColors = [];
    
    colors.forEach(color => {
      // convert rgb to hsv
      color.degree = colorMath.RGBtoHSV(color).hue + 0;
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


// the pre-set values are the lowest it can get to acces the bridge lag-free
function throttle(callback, time = 600, inactiveTime = 300) {
  this.gotInput = true;

  if (!this.executing) inner();

  function inner () {
    this.executing = true;

    this.timeOutID = setTimeout(() => {

      callback();
      this.executing = false;
      
      // if the function got called, while this timeout was active repeat repeat this function
      /* this part isnt really neccessary, because of the clearTimeout below, wich
         would delete this timeout when there is no Input*/
      if (this.gotInput) this.gotInput = false; inner();
    }, Math.max(time, 500));
  }

  // kill preivious inactiveTimeOut
  clearTimeout(this.inactiveTimeOutID);
  this.inactiveTimeOutID = setTimeout(() => {
    // if there is no calling of this function (till this timeout resolves)
    // it doesnt get killed and can resolve: it will kill the main-Timeout and call the callback imediately
    clearTimeout(this.timeOutID);
    callback();
    this.executing = false;
  }, Math.max(inactiveTime, 300)); // this minValue has to be smaller than the upper
}
