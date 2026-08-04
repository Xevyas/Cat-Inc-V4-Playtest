(function(root) {
  "use strict";

  const CatInc = root.CatInc = root.CatInc || {};

  function entier(value) {
    const nombre = Number(value);
    return Number.isFinite(nombre) ? Math.trunc(nombre) : NaN;
  }

  function normaliserRotation(value) {
    const angle = entier(value);
    if (!Number.isFinite(angle)) return 0;
    return ((angle % 360) + 360) % 360;
  }

  function cleCellule(x, y) {
    return entier(x) + ":" + entier(y);
  }

  function celluleDansGrille(x, y, width, height) {
    return Number.isInteger(x)
      && Number.isInteger(y)
      && x >= 0
      && y >= 0
      && x < width
      && y < height;
  }

  function dimensionsType(type, rotation) {
    const angle = type && type.rotatable ? normaliserRotation(rotation) : 0;
    const permute = angle === 90 || angle === 270;
    return {
      width: permute ? type.height : type.width,
      height: permute ? type.width : type.height,
      rotation: angle
    };
  }

  // Camp rotations are counter-clockwise in screen coordinates:
  // the base south-facing entrance points east at +90 degrees.
  function tournerCelluleLocale(cellule, width, height, rotation) {
    const x = entier(cellule && cellule.x);
    const y = entier(cellule && cellule.y);
    const angle = normaliserRotation(rotation);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    if (angle === 90) return { x: y, y: width - 1 - x };
    if (angle === 180) return { x: width - 1 - x, y: height - 1 - y };
    if (angle === 270) return { x: height - 1 - y, y: x };
    return { x: x, y: y };
  }

  function cellulesRectangleItem(item, type) {
    if (!item || !type) return [];
    const x = entier(item.x);
    const y = entier(item.y);
    const dimensions = dimensionsType(type, item.rotation);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
    const cellules = [];
    for (let dy = 0; dy < dimensions.height; dy += 1) {
      for (let dx = 0; dx < dimensions.width; dx += 1) {
        cellules.push({ x: x + dx, y: y + dy });
      }
    }
    return cellules;
  }

  function portsItem(item, type) {
    const access = type && type.access;
    const ports = access && Array.isArray(access.ports) ? access.ports : [];
    const itemX = entier(item && item.x);
    const itemY = entier(item && item.y);
    if (!Number.isFinite(itemX) || !Number.isFinite(itemY)) return [];
    return ports.map(function(port) {
      const approche = Array.isArray(port.approachCells) ? port.approachCells : [];
      const cellules = approche.map(function(cellule) {
        const tournee = tournerCelluleLocale(
          cellule,
          type.width,
          type.height,
          item.rotation
        );
        return tournee ? { x: itemX + tournee.x, y: itemY + tournee.y } : null;
      }).filter(Boolean);
      const politiqueCellules = port.cellPolicy || access.cellPolicy;
      const toutesLesCellulesRequises = politiqueCellules === "all-cells-reachable";
      const minimum = toutesLesCellulesRequises
        ? Math.max(1, cellules.length)
        : Math.max(
            1,
            Math.min(cellules.length || 1, entier(port.minimumReachableCells) || 1)
          );
      return {
        id: port.id || "entrance",
        cells: cellules,
        minimumReachableCells: minimum
      };
    });
  }

  function cellulesAtteignables(cellulesPraticables, origines, width, height) {
    const atteignables = new Set();
    const file = [];
    (Array.isArray(origines) ? origines : []).forEach(function(cellule) {
      const x = entier(cellule && cellule.x);
      const y = entier(cellule && cellule.y);
      const cle = cleCellule(x, y);
      if (
        !celluleDansGrille(x, y, width, height)
        || !cellulesPraticables.has(cle)
        || atteignables.has(cle)
      ) return;
      atteignables.add(cle);
      file.push({ x: x, y: y });
    });

    for (let index = 0; index < file.length; index += 1) {
      const cellule = file[index];
      [
        { x: cellule.x, y: cellule.y - 1 },
        { x: cellule.x + 1, y: cellule.y },
        { x: cellule.x, y: cellule.y + 1 },
        { x: cellule.x - 1, y: cellule.y }
      ].forEach(function(voisine) {
        if (!celluleDansGrille(voisine.x, voisine.y, width, height)) return;
        const cle = cleCellule(voisine.x, voisine.y);
        if (!cellulesPraticables.has(cle) || atteignables.has(cle)) return;
        atteignables.add(cle);
        file.push(voisine);
      });
    }
    return atteignables;
  }

  function evaluerConnexions(options) {
    const config = options && typeof options === "object" ? options : {};
    const width = Math.max(1, entier(config.gridWidth) || 1);
    const height = Math.max(1, entier(config.gridHeight) || 1);
    const layout = Array.isArray(config.layout) ? config.layout : [];
    const itemTypes = config.itemTypes && typeof config.itemTypes === "object"
      ? config.itemTypes
      : {};
    const praticables = new Set(Array.isArray(config.walkableCellKeys)
      ? config.walkableCellKeys
      : []);

    layout.forEach(function(item) {
      const type = item && itemTypes[item.type];
      if (!type || type.blocksMovement === false) return;
      cellulesRectangleItem(item, type).forEach(function(cellule) {
        praticables.delete(cleCellule(cellule.x, cellule.y));
      });
    });

    const atteignables = cellulesAtteignables(
      praticables,
      config.originCells,
      width,
      height
    );
    const byItem = {};

    layout.forEach(function(item) {
      const type = item && itemTypes[item.type];
      if (!item || !item.uid || !type || !type.access) return;
      const ports = portsItem(item, type).map(function(port) {
        const cellulesLibres = port.cells.filter(function(cellule) {
          return celluleDansGrille(cellule.x, cellule.y, width, height)
            && praticables.has(cleCellule(cellule.x, cellule.y));
        });
        const cellulesAtteignablesPort = cellulesLibres.filter(function(cellule) {
          return atteignables.has(cleCellule(cellule.x, cellule.y));
        });
        return {
          id: port.id,
          cells: port.cells,
          clearCells: cellulesLibres,
          reachableCells: cellulesAtteignablesPort,
          minimumReachableCells: port.minimumReachableCells,
          clear: cellulesLibres.length >= port.minimumReachableCells,
          active: cellulesAtteignablesPort.length >= port.minimumReachableCells
        };
      });

      const access = type.access;
      const portsActifs = ports.filter(function(port) { return port.active; }).length;
      let portsRequis = 1;
      if (access.activationPolicy === "all-ports-reachable") {
        portsRequis = ports.length;
      } else if (access.activationPolicy === "minimum-reachable") {
        portsRequis = Math.max(1, entier(access.minimumReachablePorts) || 1);
      }
      const active = ports.length > 0 && portsActifs >= portsRequis;
      const entreeLibre = ports.some(function(port) { return port.clear; });
      byItem[item.uid] = {
        active: active,
        reason: active
          ? ""
          : (entreeLibre
            ? "Its entrance is not connected to the camp."
            : "Its entrance is blocked."),
        ports: ports
      };
    });

    return {
      reachableCellKeys: Array.from(atteignables),
      byItem: byItem
    };
  }

  CatInc.campConnectivity = Object.freeze({
    normaliserRotation: normaliserRotation,
    tournerCelluleLocale: tournerCelluleLocale,
    dimensionsType: dimensionsType,
    portsItem: portsItem,
    evaluerConnexions: evaluerConnexions
  });
})(typeof window !== "undefined" ? window : globalThis);
