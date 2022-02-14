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