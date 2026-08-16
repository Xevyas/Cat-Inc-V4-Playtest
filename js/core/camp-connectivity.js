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

  function dimensionsType(type, rotation, tier) {
    const footprint = resoudreEmpreinteType(type, tier || type && type.tier);
    const angle = type && type.rotatable ? normaliserRotation(rotation) : 0;
    const permute = angle === 90 || angle === 270;
    return {
      width: permute ? footprint.height : footprint.width,
      height: permute ? footprint.width : footprint.height,
      rotation: angle
    };
  }

  function resoudreEmpreinteType(type, tier) {
    if (!type) return { width: 0, height: 0, occupiedCells: [] };
    const tierFootprint = type.tierFootprints && type.tierFootprints[String(tier || 1)];
    const source = tierFootprint || type;
    const width = Math.max(1, entier(source.width) || 1);
    const height = Math.max(1, entier(source.height) || 1);
    const explicit = Array.isArray(source.occupiedCells) ? source.occupiedCells : null;
    const occupiedCells = explicit || Array.from({ length: width * height }, function(_, index) {
      return { x: index % width, y: Math.floor(index / width) };
    });
    return { width: width, height: height, occupiedCells: occupiedCells };
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

  function tournerCote(side, rotation) {
    const sides = ["north", "east", "south", "west"];
    const index = sides.indexOf(side);
    if (index < 0) return side;
    return sides[(index - normaliserRotation(rotation) / 90 + 4) % 4];
  }

  function cellulesOccupeesItem(item, type, requestedTier) {
    if (!item || !type) return [];
    const x = entier(item.x);
    const y = entier(item.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
    const footprint = resoudreEmpreinteType(type, requestedTier || item.tier || 1);
    return footprint.occupiedCells.map(function(cellule) {
      const tournee = tournerCelluleLocale(cellule, footprint.width, footprint.height, item.rotation);
      return { x: x + tournee.x, y: y + tournee.y };
    });
  }

  function cellulesReserveesItem(item, type) {
    const current = cellulesOccupeesItem(item, type, item.tier || 1);
    if (!Number.isInteger(item && item.upgradeTargetTier)) return current;
    const uniques = new Map(current.map(function(cell) { return [cleCellule(cell.x, cell.y), cell]; }));
    cellulesOccupeesItem(item, type, item.upgradeTargetTier).forEach(function(cell) {
      uniques.set(cleCellule(cell.x, cell.y), cell);
    });
    return Array.from(uniques.values());
  }

  function resoudreAccesType(type, tier) {
    if (!type) return null;
    const key = String(tier || 1);
    if (type.tierAccess && Object.prototype.hasOwnProperty.call(type.tierAccess, key)) {
      return type.tierAccess[key] || null;
    }
    return type.access || null;
  }

  function portsItem(item, type) {
    const access = resoudreAccesType(type, item && item.tier || 1);
    const ports = access && Array.isArray(access.ports) ? access.ports : [];
    const itemX = entier(item && item.x);
    const itemY = entier(item && item.y);
    if (!Number.isFinite(itemX) || !Number.isFinite(itemY)) return [];
    return ports.map(function(port) {
      const approche = Array.isArray(port.approachCells) ? port.approachCells : [];
      const cellules = approche.map(function(cellule) {
        const tournee = tournerCelluleLocale(
          cellule,
          resoudreEmpreinteType(type, item.tier || 1).width,
          resoudreEmpreinteType(type, item.tier || 1).height,
          item.rotation
        );
        return tournee ? Object.assign({
          x: itemX + tournee.x,
          y: itemY + tournee.y
        }, cellule.side ? {side: tournerCote(cellule.side, item.rotation)} : {}) : null;
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
    const praticablesInitiales = new Set(Array.isArray(config.walkableCellKeys)
      ? config.walkableCellKeys
      : []);
    const praticables = new Set(praticablesInitiales);

    layout.forEach(function(item) {
      const type = item && itemTypes[item.type];
      if (!type || type.blocksMovement === false) return;
      cellulesReserveesItem(item, type).forEach(function(cellule) {
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
      const access = resoudreAccesType(type, item && item.tier || 1);
      if (!item || !item.uid || !type || !access) return;
      const portsSource = portsItem(item, type);
      let praticablesItem = praticables;
      let atteignablesItem = atteignables;
      if (Number.isInteger(item.upgradeTargetTier) && portsSource.length) {
        const cellulesCourantes = new Set(cellulesOccupeesItem(item, type, item.tier || 1)
          .map(function(cellule) { return cleCellule(cellule.x, cellule.y); }));
        const cellulesAcces = new Set(portsSource.flatMap(function(port) {
          return port.cells.map(function(cellule) { return cleCellule(cellule.x, cellule.y); });
        }));
        const accesAutoReserve = cellulesOccupeesItem(item, type, item.upgradeTargetTier)
          .filter(function(cellule) {
            const cle = cleCellule(cellule.x, cellule.y);
            if (cellulesCourantes.has(cle) || !cellulesAcces.has(cle) || !praticablesInitiales.has(cle)) return false;
            return !layout.some(function(autre) {
              const autreType = autre && itemTypes[autre.type];
              return autre !== item && autreType && autreType.blocksMovement !== false
                && cellulesReserveesItem(autre, autreType).some(function(occupee) {
                  return cleCellule(occupee.x, occupee.y) === cle;
                });
            });
          });
        if (accesAutoReserve.length) {
          praticablesItem = new Set(praticables);
          accesAutoReserve.forEach(function(cellule) {
            praticablesItem.add(cleCellule(cellule.x, cellule.y));
          });
          atteignablesItem = cellulesAtteignables(
            praticablesItem,
            config.originCells,
            width,
            height
          );
        }
      }
      const ports = portsSource.map(function(port) {
        const cellulesLibres = port.cells.filter(function(cellule) {
          return celluleDansGrille(cellule.x, cellule.y, width, height)
            && praticablesItem.has(cleCellule(cellule.x, cellule.y));
        });
        const cellulesAtteignablesPort = cellulesLibres.filter(function(cellule) {
          return atteignablesItem.has(cleCellule(cellule.x, cellule.y));
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

      const portsActifs = ports.filter(function(port) { return port.active; }).length;
      const portsLibres = ports.filter(function(port) { return port.clear; }).length;
      let portsRequis = 1;
      if (access.activationPolicy === "all-ports-reachable") {
        portsRequis = ports.length;
      } else if (access.activationPolicy === "minimum-reachable") {
        portsRequis = Math.max(1, entier(access.minimumReachablePorts) || 1);
      }
      const active = ports.length > 0 && portsActifs >= portsRequis;
      const clear = ports.length > 0 && portsLibres >= portsRequis;
      byItem[item.uid] = {
        active: active,
        clear: clear,
        reason: active
          ? ""
          : (clear
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
    tournerCote: tournerCote,
    dimensionsType: dimensionsType,
    resoudreEmpreinteType: resoudreEmpreinteType,
    resoudreAccesType: resoudreAccesType,
    cellulesOccupeesItem: cellulesOccupeesItem,
    cellulesReserveesItem: cellulesReserveesItem,
    portsItem: portsItem,
    evaluerConnexions: evaluerConnexions
  });
})(typeof window !== "undefined" ? window : globalThis);
