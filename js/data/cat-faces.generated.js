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
      "id": "cat-faces-bernardo",
      "name": "Bernardo",
      "runtimePath": "img/Cat faces/Bernardo.png",
      "revision": 3
    },
    {
      "id": "cat-faces-cannelle-3",
      "name": "Cannelle",
      "runtimePath": "img/Cat faces/cannelle-3.png",
      "revision": 3
    },
    {
      "id": "cat-faces-jimmy",
      "name": "Jimmy",
      "runtimePath": "img/Cat faces/jimmy.png",
      "revision": 2
    },
    {
      "id": "cat-faces-luna-v2",
      "name": "Luna",
      "runtimePath": "img/Cat faces/luna-v2.png",
      "revision": 3
    },
    {
      "id": "cat-faces-mochi-v2",
      "name": "Mochi",
      "runtimePath": "img/Cat faces/mochi-v2.png",
      "revision": 3
    },
    {
      "id": "cat-faces-naya",
      "name": "Naya",
      "runtimePath": "img/Cat faces/naya.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-1",
      "name": "Random Cat 1",
      "runtimePath": "img/Cat faces/random-cat-1.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-2",
      "name": "Random Cat 2",
      "runtimePath": "img/Cat faces/random-cat-2.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-3",
      "name": "Random Cat 3",
      "runtimePath": "img/Cat faces/random-cat-3.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-4",
      "name": "Random Cat 4",
      "runtimePath": "img/Cat faces/random-cat-4.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-5",
      "name": "Random Cat 5",
      "runtimePath": "img/Cat faces/random-cat-5.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-6",
      "name": "Random Cat 6",
      "runtimePath": "img/Cat faces/random-cat-6.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-7",
      "name": "Random Cat 7",
      "runtimePath": "img/Cat faces/random-cat-7.png",
      "revision": 1
    },
    {
      "id": "cat-faces-the-greatest-incrementor",
      "name": "The Greatest Incrementor",
      "runtimePath": "img/Cat faces/the-greatest-incrementor.png",
      "revision": 1
    }
  ],
  "randomCats": [
    {
      "id": "cat-faces-random-cat-1",
      "name": "Random Cat 1",
      "runtimePath": "img/Cat faces/random-cat-1.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-2",
      "name": "Random Cat 2",
      "runtimePath": "img/Cat faces/random-cat-2.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-3",
      "name": "Random Cat 3",
      "runtimePath": "img/Cat faces/random-cat-3.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-4",
      "name": "Random Cat 4",
      "runtimePath": "img/Cat faces/random-cat-4.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-5",
      "name": "Random Cat 5",
      "runtimePath": "img/Cat faces/random-cat-5.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-6",
      "name": "Random Cat 6",
      "runtimePath": "img/Cat faces/random-cat-6.png",
      "revision": 1
    },
    {
      "id": "cat-faces-random-cat-7",
      "name": "Random Cat 7",
      "runtimePath": "img/Cat faces/random-cat-7.png",
      "revision": 1
    }
  ],
  "framingByPath": {
    "img/Cat faces/Alternative Kitty face 1_Final.png": {
      "width": 131,
      "height": 106,
      "bounds": [
        0,
        0,
        131,
        106
      ]
    },
    "img/Cat faces/Alternative Kitty face 2_Final.png": {
      "width": 132,
      "height": 110,
      "bounds": [
        0,
        0,
        131,
        110
      ]
    },
    "img/Cat faces/Alternative Kitty face 3_Final.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        26,
        43,
        230,
        213
      ]
    },
    "img/Cat faces/Alternative Kitty face 4_Final.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        26,
        40,
        230,
        216
      ]
    },
    "img/Cat faces/Bernardo.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        26,
        26,
        230,
        230
      ]
    },
    "img/Cat faces/cannelle-3.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        26,
        36,
        230,
        219
      ]
    },
    "img/Cat faces/jimmy.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        34,
        26,
        222,
        230
      ]
    },
    "img/Cat faces/luna-v2.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        29,
        26,
        228,
        230
      ]
    },
    "img/Cat faces/Luna_Final.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        31,
        26,
        225,
        230
      ]
    },
    "img/Cat faces/mochi-v2.png": {
      "width": 1024,
      "height": 1024,
      "bounds": [
        189,
        185,
        853,
        788
      ]
    },
    "img/Cat faces/Mochi_Final.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        27,
        40,
        230,
        216
      ]
    },
    "img/Cat faces/naya.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        27,
        30,
        230,
        226
      ]
    },
    "img/Cat faces/Presets/cat-faces-bernardo/angry.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        26,
        26,
        230,
        230
      ]
    },
    "img/Cat faces/Presets/cat-faces-bernardo/happy.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        26,
        26,
        230,
        230
      ]
    },
    "img/Cat faces/Presets/cat-faces-bernardo/sleepy.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        26,
        26,
        230,
        230
      ]
    },
    "img/Cat faces/Presets/cat-faces-luna-v2/shocked.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        29,
        26,
        228,
        230
      ]
    },
    "img/Cat faces/Presets/cat-faces-luna-v2/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        29,
        26,
        228,
        230
      ]
    },
    "img/Cat faces/Presets/cat-faces-luna/amused.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        31,
        26,
        225,
        230
      ]
    },
    "img/Cat faces/Presets/cat-faces-mochi-v2/angry.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        47,
        45,
        215,
        199
      ]
    },
    "img/Cat faces/Presets/cat-faces-mochi-v2/shocked.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        47,
        45,
        215,
        199
      ]
    },
    "img/Cat faces/Presets/cat-faces-mochi-v2/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        47,
        45,
        215,
        199
      ]
    },
    "img/Cat faces/Presets/cat-faces-mochi/angry.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        27,
        40,
        230,
        216
      ]
    },
    "img/Cat faces/Presets/cat-faces-mochi/chewing-catnip.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        27,
        40,
        230,
        216
      ]
    },
    "img/Cat faces/Presets/cat-faces-mochi/surprised.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        27,
        40,
        230,
        223
      ]
    },
    "img/Cat faces/Presets/cat-faces-random-cat-1/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        35,
        230,
        221
      ]
    },
    "img/Cat faces/Presets/cat-faces-random-cat-2/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        35,
        230,
        221
      ]
    },
    "img/Cat faces/Presets/cat-faces-random-cat-3/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        33,
        230,
        222
      ]
    },
    "img/Cat faces/Presets/cat-faces-random-cat-4/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        36,
        230,
        220
      ]
    },
    "img/Cat faces/Presets/cat-faces-random-cat-5/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        33,
        230,
        223
      ]
    },
    "img/Cat faces/Presets/cat-faces-random-cat-6/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        36,
        230,
        220
      ]
    },
    "img/Cat faces/Presets/cat-faces-random-cat-7/sleep.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        33,
        230,
        222
      ]
    },
    "img/Cat faces/Presets/cat-faces-the-greatest-incrementor/amused-mockery.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        33,
        26,
        224,
        230
      ]
    },
    "img/Cat faces/Presets/cat-faces-the-greatest-incrementor/laugh-exit.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        33,
        26,
        224,
        230
      ]
    },
    "img/Cat faces/random-cat-1.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        35,
        230,
        221
      ]
    },
    "img/Cat faces/random-cat-2.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        35,
        230,
        221
      ]
    },
    "img/Cat faces/random-cat-3.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        33,
        230,
        222
      ]
    },
    "img/Cat faces/random-cat-4.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        36,
        230,
        220
      ]
    },
    "img/Cat faces/random-cat-5.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        33,
        230,
        223
      ]
    },
    "img/Cat faces/random-cat-6.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        36,
        230,
        220
      ]
    },
    "img/Cat faces/random-cat-7.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        28,
        33,
        230,
        222
      ]
    },
    "img/Cat faces/the-greatest-incrementor-amused.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        33,
        26,
        224,
        230
      ]
    },
    "img/Cat faces/the-greatest-incrementor-laugh.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        33,
        26,
        224,
        230
      ]
    },
    "img/Cat faces/the-greatest-incrementor.png": {
      "width": 256,
      "height": 256,
      "bounds": [
        33,
        26,
        224,
        230
      ]
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
