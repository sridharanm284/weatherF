// calculations.ts

const Pi = 3.14159265358979;

const Radians = (x: number): number => {
  return (Pi * x) / 180;
};

const arccos = (x: number): number => {
  return Math.atan(-x / Math.sqrt(-x * x + 1)) + Pi / 2;
};

const arcsin = (x: number): number => {
  return Pi / 2 - arccos(x);
};

export const Bearing = (
  Lat1: number,
  Lon1: number,
  Lat2: number,
  Lon2: number
): number => {
  if (Lon1 === Lon2) {
    return Lat1 < Lat2 ? 0 : 180;
  } else {
    const dd = Posdist(Lat1, -Lon1, Lat2, -Lon2);
    const arad = arccos(
      (Math.sin(Radians(Lat2)) -
        Math.sin(Radians(Lat1)) * Math.cos(Radians(dd / 60))) /
        (Math.sin(Radians(dd / 60)) * Math.cos(Radians(Lat1)))
    );
    let bearing = (arad * 180) / Pi;
    if (Math.sin(Radians(Lon2 - Lon1)) < 0) {
      bearing = 360 - bearing;
    }
    return bearing;
  }
};

export const Posdist = (
  Lat1: number,
  Lon1: number,
  Lat2: number,
  Lon2: number
): number => {
  if (Lat1 === Lat2 && Lon1 === Lon2) {
    return 0;
  } else {
    const Rlat1 = Radians(Lat1);
    const Rlat2 = Radians(Lat2);
    const Rlon = Radians(Lon2 - Lon1);
    return (
      60 *
      (180 / Pi) *
      arccos(
        Math.sin(Rlat1) * Math.sin(Rlat2) +
          Math.cos(Rlat1) * Math.cos(Rlat2) * Math.cos(Rlon)
      )
    );
  }
};

export const NewPosLat = (
  Lat1: number,
  Lon1: number,
  Bearing: number,
  distance: number
): number => {
  if (Bearing === 0 || Bearing === 180 || Bearing === 360) {
    return Bearing === 180 ? Lat1 - distance / 60 : Lat1 + distance / 60;
  } else {
    const a = Radians(90 - Lat1);
    const b = (Pi * distance) / (60 * 180);
    const CAngle = Radians(Bearing);
    const APlusB =
      2 *
      Math.atan(
        Math.cos((a - b) / 2) / (Math.cos((a + b) / 2) * Math.tan(CAngle / 2))
      );
    const AMinusB =
      2 *
      Math.atan(
        Math.sin((a - b) / 2) / (Math.sin((a + b) / 2) * Math.tan(CAngle / 2))
      );
    const BAngle = (APlusB - AMinusB) / 2;
    let newPosLat =
      Lat1 < 0
        ? (180 * arcsin(Math.sin(b) * Math.sin(CAngle) / Math.sin(BAngle))) /
            Pi -
          90
        : Math.abs(
            (180 * arcsin(Math.sin(b) * Math.sin(CAngle) / Math.sin(BAngle))) /
              Pi -
              90
          );
    if (newPosLat > 90) {
      newPosLat -= 90;
    } else if (newPosLat < -90) {
      newPosLat = -(newPosLat + 180);
    }
    return newPosLat;
  }
};

export const NewPosLon = (
  Lat1: number,
  Lon1: number,
  Bearing: number,
  distance: number
): number => {
  const a = Radians(90 - Lat1);
  const b = (Pi * distance) / (60 * 180);
  const CAngle = Radians(Bearing);
  const APlusB =
    2 *
    Math.atan(
      Math.cos((a - b) / 2) / (Math.cos((a + b) / 2) * Math.tan(CAngle / 2))
    );
  const AMinusB =
    2 *
    Math.atan(
      Math.sin((a - b) / 2) / (Math.sin((a + b) / 2) * Math.tan(CAngle / 2))
    );
  const BAngle = (APlusB - AMinusB) / 2;
  let newPosLon = Lon1 + (BAngle * 180) / Pi;
  if (newPosLon > 180) {
    newPosLon -= 360;
  } else if (newPosLon < -180) {
    newPosLon += 360;
  }
  return newPosLon;
};

export const RetDist = (
  Height: number,
  RadPerReticle: number,
  Reticles: number
): number => {
  const x = Math.sqrt((2 * 6366 * Height) / 1000 + Math.pow(Height / 1000, 2));
  if (Reticles === 0) {
    return x / 1.852;
  } else {
    const Angle = Math.atan(x / 6366);
    return (
      (1 / 1.852) *
      ((6366 + Height / 1000) *
        Math.sin(Angle + Reticles * RadPerReticle) -
        Math.sqrt(
          6366 * 6366 -
            Math.pow(
              (6366 + Height / 1000) *
                Math.cos(Angle + Reticles * RadPerReticle),
              2
            )
        ))
    );
  }
};

export const RetDist7x50 = (Height: number, Reticles: number): number => {
  const RadPerReticle = 0.00497;
  return RetDist(Height, RadPerReticle, Reticles);
};

export const RetDistBE = (Height: number, Reticles: number): number => {
  const RadPerReticle = 0.00136;
  return RetDist(Height, RadPerReticle, Reticles);
};

export const MinSecToDeg = (MinSec: number): number => {
  const xMinSec = Math.abs(MinSec);
  return (
    Math.sign(MinSec) *
    (Math.floor(xMinSec) +
      Math.floor((xMinSec - Math.floor(xMinSec)) * 100 + 0.00001) / 60 +
      100 *
        (xMinSec * 100 -
          Math.floor(xMinSec * 100 + 0.00001)) /
        3600)
  );
};

export const DegToMinSec = (DecDeg: number): number => {
  const xDecDeg = Math.abs(DecDeg);
  const Ideg = Math.floor(xDecDeg);
  const Decim = xDecDeg - Ideg;
  const imin = Math.floor(Decim * 60);
  const isec = Math.floor((Decim * 60 - imin) * 60 + 0.5);
  return Math.sign(DecDeg) * (Ideg + imin / 100 + isec / 10000);
};

export const DegToMinTen = (DecDeg: number): number => {
  const xDecDeg = Math.abs(DecDeg);
  const Ideg = Math.floor(xDecDeg);
  const Decim = xDecDeg - Ideg;
  const imin = Decim * 0.6;
  return Math.sign(DecDeg) * (Ideg + imin);
};

export const MinTenToDeg = (MinTen: number): number => {
  const xMinTen = Math.abs(MinTen);
  return (
    Math.sign(MinTen) *
    (Math.floor(xMinTen) +
      Math.floor((xMinTen - Math.floor(xMinTen)) * 100 + 0.00001) / 60 +
      100 *
        (xMinTen * 100 -
          Math.floor(xMinTen * 100 + 0.00001)) /
        6000)
  );
};

export const ClinoDist = (Altitude: number, Angle: number): number => {
  return Altitude * Math.tan(Radians(90 - Angle));
};

export const ClinoArcDist = (Altitude: number, Angle: number): string | number => {
  const EarthRadius = 3440;
  const Height = Altitude / 1852;
  const Alpha = Math.sqrt(2 * Height * EarthRadius + Height * Height) / EarthRadius;
  if (Radians(Angle) < Alpha) {
    return "Beyond horizon";
  } else {
    return (
      EarthRadius *
      (Radians(Angle) -
        arccos(
          ((EarthRadius + Height) * Math.cos(Radians(Angle))) / EarthRadius
        ))
    );
  }
};
