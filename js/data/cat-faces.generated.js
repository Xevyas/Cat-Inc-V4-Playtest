(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  CatInc.data.liveCatFaces = deepFreeze({
  "schemaVersion": 1,
  "items": [
    {
      "id": "cat-faces-alternative-kitty-face-1",
      "name": "Alternative Kitty face 1",
      "runtimePath": "img/Cat faces/Alternative Kitty face 1_Final.png",
      "revision": 1,
      "alternative": true
    },
    {
      "id": "cat-faces-alternative-kitty-face-2",
      "name": "Alternative Kitty face 2",
      "runtimePath": "img/Cat faces/Alternative Kitty face 2_Final.png",
      "revision": 1,
      "alternative": true
    },
    {
      "id": "cat-faces-alternative-kitty-face-3",
      "name": "Alternative Kitty face 3",
      "runtimePath": "img/Cat faces/Alternative Kitty face 3_Final.png",
      "revision": 2,
      "alternative": true
    },
    {
      "id": "cat-faces-alternative-kitty-face-4",
      "name": "Alternative Kitty face 4",
      "runtimePath": "img/Cat faces/Alternative Kitty face 4_Final.png",
      "revision": 1,
      "alternative": true
    },
    {
      "id": "cat-faces-bernardo",
      "name": "Bernardo",
      "runtimePath": "img/Cat faces/Bernardo.png",
      "revision": 3,
      "alternative": false
    },
    {
      "id": "cat-faces-cannelle-3",
      "name": "Cannelle",
      "runtimePath": "img/Cat faces/cannelle-3.png",
      "revision": 1,
      "alternative": false
    },
    {
      "id": "cat-faces-luna",
      "name": "Luna",
      "runtimePath": "img/Cat faces/Luna_Final.png",
      "revision": 5,
      "alternative": false
    },
    {
      "id": "cat-faces-mochi",
      "name": "Mochi",
      "runtimePath": "img/Cat faces/Mochi_Final.png",
      "revision": 5,
      "alternative": false
    },
    {
      "id": "cat-faces-the-greatest-incrementor",
      "name": "The Greatest Incrementor",
      "runtimePath": "img/Cat faces/the-greatest-incrementor.png",
      "revision": 1,
      "alternative": false
    }
  ],
  "alternatives": [
    {
      "id": "cat-faces-alternative-kitty-face-1",
      "name": "Alternative Kitty face 1",
      "runtimePath": "img/Cat faces/Alternative Kitty face 1_Final.png",
      "revision": 1,
      "alternative": true
    },
    {
      "id": "cat-faces-alternative-kitty-face-2",
      "name": "Alternative Kitty face 2",
      "runtimePath": "img/Cat faces/Alternative Kitty face 2_Final.png",
      "revision": 1,
      "alternative": true
    },
    {
      "id": "cat-faces-alternative-kitty-face-3",
      "name": "Alternative Kitty face 3",
      "runtimePath": "img/Cat faces/Alternative Kitty face 3_Final.png",
      "revision": 2,
      "alternative": true
    },
    {
      "id": "cat-faces-alternative-kitty-face-4",
      "name": "Alternative Kitty face 4",
      "runtimePath": "img/Cat faces/Alternative Kitty face 4_Final.png",
      "revision": 1,
      "alternative": true
    }
  ]
});
})(typeof window !== "undefined" ? window : globalThis);
