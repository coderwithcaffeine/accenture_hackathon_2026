/**
 * Simulation module for Digital Twin Vehicle Assembly Line
 */

// Seedable PRNG (Mulberry32)
function createPRNG(seed = 42) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller transform for standard normal distribution N(0, 1)
function createGaussianPRNG(randomFunc) {
  let haveNext = false;
  let nextVal = 0;
  return function normal(mean = 0, std = 1) {
    if (haveNext) {
      haveNext = false;
      return mean + std * nextVal;
    }
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = randomFunc();
    while (u2 === 0) u2 = randomFunc();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    nextVal = z1;
    haveNext = true;
    return mean + std * z0;
  };
}

export function simulateUnits(stations, nUnits = 600, seed = 42) {
  const random = createPRNG(seed);
  const normal = createGaussianPRNG(random);

  const units = [];

  for (let u = 1; u <= nUnits; u++) {
    let seededDefect = false;
    let defectOriginStation = null;
    const unitStationsData = {};

    for (const st of stations) {
      // Calculate cycle time with noise
      let ct = normal(st.base_cycle_time, st.cycle_time_std);

      // Apply wear drift if applicable
      if (st.wear_drift && u > st.wear_drift.start_unit) {
        ct += st.wear_drift.rate * (u - st.wear_drift.start_unit);
      }
      ct = Math.max(10, ct); // Ensure reasonable positive bound

      if (st.sensor_tier === 'checklist_only') {
        unitStationsData[st.id] = {
          cycle_time: Number(ct.toFixed(1)),
          pass: true
        };
      } else {
        // Full sensor tier: cycle_time, vibration, temperature, torque
        let vib = normal(0.40, 0.05);
        let temp = normal(22.0, 1.0);
        let torque = normal(118.0, 3.0);

        // Seeded defect injection
        if (st.defect_origin_prob > 0 && !seededDefect) {
          if (random() < st.defect_origin_prob) {
            seededDefect = true;
            defectOriginStation = st.id;

            // Perturb torque & vibration by 3 to 5 sigma with noise
            const sigmaShift = 3.5 + random() * 1.5; // 3.5 - 5.0 sigma
            const shiftDirection = random() > 0.5 ? 1 : -1;
            
            torque += shiftDirection * sigmaShift * 3.0 + normal(0, 0.5);
            vib += shiftDirection * (sigmaShift * 0.05) + normal(0, 0.01);
          }
        }

        unitStationsData[st.id] = {
          cycle_time: Number(ct.toFixed(1)),
          vibration: Number(Math.max(0.01, vib).toFixed(2)),
          temperature: Number(temp.toFixed(1)),
          torque: Number(torque.toFixed(1))
        };
      }
    }

    units.push({
      unit_id: u,
      stations: unitStationsData,
      seeded_defect: seededDefect,
      defect_origin_station: defectOriginStation
    });
  }

  return units;
}
