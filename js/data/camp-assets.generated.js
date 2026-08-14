(function(root) {
  "use strict";
  const CatInc = root.CatInc = root.CatInc || {};
  CatInc.data = CatInc.data || {};
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function(key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  CatInc.data.campAssets = deepFreeze({
  "schemaVersion": 1,
  "stickers": {
    "schemaVersion": 1,
    "colors": [
      {
        "id": "kraft",
        "name": "Kraft",
        "hex": "#C48A57"
      },
      {
        "id": "sky-blue",
        "name": "Sky blue",
        "hex": "#6D9CC8"
      },
      {
        "id": "rose",
        "name": "Rose",
        "hex": "#C96B82"
      },
      {
        "id": "cream",
        "name": "Cream",
        "hex": "#F1D58C"
      }
    ],
    "items": [
      {
        "id": "storage-stacked-boxes",
        "name": "Stacked boxes",
        "description": "A compact monochrome stack of storage boxes.",
        "category": "storage",
        "artworkPath": "tools/camp_asset_studio/library/stickers/storage-stacked-boxes.png",
        "runtimePath": "img/Buildings/Camp Runtime/Stickers/storage-stacked-boxes.png",
        "colorIds": [
          "kraft",
          "sky-blue",
          "cream"
        ],
        "defaultColorId": "kraft",
        "maskDataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAEl0lEQVR4nOzbsW6NYQCH8bc0IgaDgQtgEBGrhNjF7B5sFrvJxKW4AImZwcwkcQFispKoV7q2p3X4Tnv6/H7J/wZO+z3nzde35waQdW4AWQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYbuDv3Vn7uHc3bn7c9cGJ+nr3Lu5D3Nv5j4Njm1ncFwX5l7MPRtOTqfVr7mXc8/nfg6OJADHc3Pu9dztwTb4OPd47vNgJQE42sWxf6y8PtgmX+Zuzf0YHOr84Civ5h4Nts2VuUtzbweHcgJY7d7Yf8Hkc9pOe3MP5t4PDuRl1mpPh4d/m/352T0ZHMqfAVe7Mdh2foYr+HZb7fvc5cE2+zZ3dXAgAVhtb3AW+D0/hHcAECYAECYAECYAECYAECYAECYAECYAEOYq8Ga4iLIeF7EW5gQAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYTtj8+7MPZy7O3d/7tqArq9z7+Y+zL2Z+zQ2aJMBuDD3Yu7ZcPKAg/yaezn3fO7n2IBNBeDm3Ou52wM4yse5x3Ofx8I2EYCLY/9Yc30Ax/Vl7tbcj7Gg82N5r+YeDeBvXJm7NPd2LGjpE8C9sf+C4yReNsK225t7MPd+LGTpl3FPh4cf1vXn2XkyFrQ7lnVjAP9i0Wdo6W/n73OXB7Cub3NXx0KWDsDeAP7VYs+pCzkQJgAQJgAQJgAQJgAQJgAQJgAQJgAQtvRV4P/F/xOs539dxPL5r+fUX4RzAoAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCw3bEd9gYnyed/RjkBQJgAQJgAQJgAQJgAQJgAQJgAQJgAQNjOWJ5LJLC+RZ9RJwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAI28RFIOCUcgKAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsN8AAAD//8kUEMkAAAAGSURBVAMAtOM3kgHQjgYAAAAASUVORK5CYII="
      },
      {
        "id": "general-heart",
        "name": "Heart",
        "description": "A simple monochrome heart for eligible general surfaces.",
        "category": "general",
        "artworkPath": "tools/camp_asset_studio/library/stickers/general-heart.png",
        "runtimePath": "img/Buildings/Camp Runtime/Stickers/general-heart.png",
        "colorIds": [
          "rose",
          "cream",
          "sky-blue"
        ],
        "defaultColorId": "rose",
        "maskDataUri": "data:image/png;base64,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"
      },
      {
        "id": "jobs-briefcase-paw",
        "name": "Briefcase Paw",
        "description": "A compact work briefcase marked with a centered Cat paw.",
        "category": "jobs",
        "artworkPath": "tools/camp_asset_studio/library/stickers/jobs-briefcase-paw.png",
        "runtimePath": "img/Buildings/Camp Runtime/Stickers/jobs-briefcase-paw.png",
        "colorIds": [
          "kraft",
          "sky-blue",
          "cream"
        ],
        "defaultColorId": "sky-blue",
        "maskDataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAbWklEQVR42u2dedAlVXmHn3PvnWEdZB0YIMAIzrCqaNwKrREBYVhcIq4kQRLQiiWVmKBVblUaJKlUKhVDUnGLwWKLJgHBiBuKLIKKGlRAGBCGGRiBEZARRmC+293545yT70zTd+vu795efk9V19zvzr3dt0+f8573vOddQAghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIscAYNcFU27oL9IP3dgaOBF4GHALsDyxx7/fdd3pAB0iC7yVAlDp3krpe4r5LcK705/zfJuP86f4RB3/7152M76R/T/j6UeBJ4B7gLuAW4MfAE8F3e+7eEnUZ0RS6wettgTcAFwHrXEdv83EvcAGwOhBY6TYTotazPsD2wNnAnRmDoO+OyB1xQw9/f/5+0+3wU+CMoM0kBERtCdXjNwB3BB3dD4JYGsD/t0UUvHczcHQgRLVUFbVU+ZcAnws69lyqo+vIFgb+7/MGCFQhKj/4VwA/C1R8DfzJBIFvryuBnSQERJ0G/2HAhmDW16DOd2xx//4Q2ENCQNRhzf9cDf4FEQI/dppAR0JAUFFr/xLgVg3+BRMCVzDvKyDDYMn706JYO0bAp4Hj3eBfpGYptX3ngEOBzcD33HtyFhKVEaKnaOZf0CN2xtQtwAtSPhZCzEz1N1gnn3sDZxcN2IU5/BbhNTIIiirgXVffm+qgOhZeCByjZayoggawDTawRbP/dI4519ZflxYgqrD2P1mz/0zsAXNYZysJAcrxVxf5ODXomEVIeww2MRionwpjzkvkll+nqB+LWbKNM/4lBdX/qIUzeFyCHeBbEgDlGLHE5JpTjE3isdx1xrydMHbffQq4FGvhXpdydElmlMAlGXJNMyAZyLC+thJ4HXDiGOcfR3N9IdY78LcDkqIIsaCC848L7v37mf8mJ0zawmrgoYLaj9cgXigtQBrArFhR4Ls+rdZ64CTgN1jvwZjmp6D7urOdXMO8R5/J0X5d4CBsIpFOw9tOAqCC7FpQve4An3CDfzHWy60NLMa6814KnO7W9L0c7Vf0GWgtqybIPXhhPkQ1z/e72ASZX3Wz31yL2i9yfe/SEvqhBIAEwMzYPqdxzguQ+4K1cJsMWH4NfzfwTEbW40m1CSEBUNuZsM2W677W7RIAdR/Aan9mWpdCAkQdUIVV9AyEBED9Op9RR1YfVuPVl1izV+2fgQSAEMx2O3XW55AAEDNpv0RLqFKXUUICoHYzmNAzkABQ52tlR040gCUAhFRZtZsEgNRPIVA04FhGo7TxKJ7yQPbX75Q8g7VlNgufX1KCN2ZWn5jGPXQytiRrtazp1aSzdCrmO98vacDGLdUivAv1XEl+AMkMoimTIRNPty7P11R8eWJS/vaLgedhE3Esd6+7wN7AtkGMvckwMpnUv52M98LZadD3wlRWhwHPKZDa6nfAbUE0XJwxM5oSNRqzQOnFJpnNk6CNFwNH5NSk/Hk2AA8UjChMxhwXSRDK/SA2j8Nm4GFsZOMdwC+xYd6hMEiq6rBkqO6M7wf+zsBx2DxyR2EzwMjwI6rKA8D3ga9gcz08HgiCymkEpqJFNgEOBt4FvNXN8MPCaM2MtZQy1rBJSy34nQVUxadpBM6qVbgBuBj4DLA2o4+LjI6wD/Appx6HaaDnXMPFKoyhg+oXMQ0LxWwCPgnsGQgBabEZW5FnARszykCpY+mocwUj//cDwDu0Df9sa+luwGUa+DpaIgg+C+xQheKmZsZbkH231r/SWfb7Uo8EzQ5d9rsIPwLehq0sNTO7gJmxse8w4GpgWc7U0ELUkTlsDYj12B2uu2YlBMwMy2o9D7gWa+GPVOdd0L6EqD1sGbjXOE1g6sVNzAwGf+LW/D8ADtTgFxIC/AJ4BdaBaKquxJ0Z+X9f7AZ/X4Nf0O5YnD5wKHBhUCh26lb4aa77Pwi8O1gHCUHLt8G9ENiE9SLsTksLMFNe9x+MLeTYK8mLTgklBA1Ia+a3Cp/BGsZ9efi4aQLgKqxPf9F1f1SFPVQhgrV8p6D67sfEl7Dbg1PZFTBTVP1XYa3+RQZ/nCFx7wceS0XSDYuxTzKi48yASLNJ27Lq2kgyIhbfFIgqTEacZ1T7DHsGScZvMiPuL8kZLTnumDHALthdLJPKS9Ep0L87wCuBG5sSN+Ab46rAyy+PN1XoW30d1m34COY9qoSYNjsChwPvA24e0FcnOfzYuKJpGu7KwL03LtAwtwOr1e9ERTkVW/E5rxDw4+NpbL6LxvDxArN/KBV3CrSKsgyJQhSNYu0F/XBv4IYCQsD393NoUMDPT9xNRTnV/iuDBpa7sKDiKfa2B64v2Oeva0qjrGA+tn8S9d833K3AdiUm4RRiGr41y7Bpw6IJhYAfI48D+zahQU7LKQl98o9XactP1FQTOD3nUsALgdfTAFfglzB5+ufI/bavufWU0igJapb1uANcAqwJ8gEyYcXjFU0QACty+Bz4z35mBvnehaAEfwvv4ntJgdoVK5sgAJblbDzvF51o9hfUM/kHwLdyLGH9hLdXEwTALhNqAH6pcB/wqEpwiZqXjVsL/Danp+iyJgmASRvu/iB9khB15THgoQknMhPUxKi9AIhyCoDN6juCZhgE85Ytm2tjdWA5/Aga5i3YrWqwXkd1C4WgteXn5VknBJX3Kqy1ADBVlX5CUJ+qWbUVABrIQpA705CWAEJQf0NgO1WMAjcvI6Bo++DvtXkJoKWD0BJA24BC0PZ4AgkAIbR8aJcA0BJAaCBrF0AI0cZdACGkOUgDEALFAkgACCEkAIQQigUQQkgDEAIZASUAhEBGQG0DCiFkAxBCaAkghJYAEgBCCNkAhBA1sgFIcIi2q/LaBRAC7edLAxBCgkNGQDG4o3SmJDSneS0tHSQAxJCB2AvKTsfu3/D9Ol5LTBEV4KS2JaMi5rPGLgV2Ah4HHgne7+aozjzqWrtiy1ZvBh4u+VpS5SUA5EE45oDcCTgdeCPwAmAJ8FtgDfAV4AJgo9Py4pyd1rhr7Q2cBpwMHOKu/RRwG/Cf7lpPSgiU1peTQNuqPY+l1MZRR9/9e/m0CiTWsFjkauCeEe34K+DdwVLP5Jyx/gr49Yhr3QUcp+eV2YZd4E7XTtGYY8B/7vYmNMSjOQXAl9WhMgf/O4K2mnPtFQdH5N73n/lU8H0zgZFvEXDRiGv1g2v1nTaiZ/ZsAbCmzQLgMQmA0gb/S9yAi4J2GtaJtrjX/zpmW5rgM5e4724Z49n53/I74NBAiEgA2GX2XTkFwK0SABIABDPy/6baaNQRB0Lg7WO0p/+/DweDPxnz8JrAdRIApQmAn0sASAB4Q+3bJhz8YWeKsBb73QPjXpaQMW4G3xKo+5Ncy/+21+rZ1UMAyA+AWtSHM8B7clqF/S7AUuAcd47ugA6bAOc6bSPP9pXvwO/UYytlNytRaTCp/jGwD/D7BVTrjmvPM7F7+P3U4O64WWc5dqsvKXAdA7wauy0ZyUmo0P3H0gDUeQAOA7YLtIG8gmQ3YFWGeu77wZuAxQUGrhc0ewHPVR+TK7AoRwA8v4QZwavnxw6ZaU4oadYywEoFdSkfQKVjoWvE/iUJEwMcnhr0xr3eHuvlV7Rf+Oe2sx6bBIConjaxN9YyHafe3wvYRc2kJYACKKrHPSW25x5YX35SW4LLnJ0hKdj2Jtj+FdIARAncW+LzGuQHEJXcp+7TUk4CQBoAhX0AwPqSxyWtzR8Dngje89d4ABviawrabQw2/uOeaW1lyQ9AAqCua3Iz5oC6JwgoiQt2pvuwnn7pZ/+bQDAUEVgJcLM7X2eMTmwa/qyNBIB2AcL27gUDI0m9l9UGXayf/X8HFvsi24A/Sz17/xs2A78sKGR8h79kRP/qpjIMJan3hByBGicAukEIbYx1uFmceq+T8Ux8J7gAeHrMWXWYl95VGe3rr/m1AksA//s3YBOSmAy7Qid438cNbOMGfvheV1pAcwSAJPq8q+1+wIeAbzuVfo17/bdYV18fZ99NdYIusBa4NDhXHuecNcD1GYMzDkKAn8opZPw1znNLifQ5usESYRXwj8BN2ECZXzih8T7sLkXUICGQtN0Q2vZoQP/73xu0xaDQ3S8CBwxw1TXAvsxn54kmiNLzYb1/wuBUcP5656fCeycJBb4xWM6YAfkMvjviXPcDpzbg2ZeREOQmCYB6dwL/2z+ekVknCtTeuaB9HgJeNcRf/5jg8/0JBv+3RwQT+f/bzQ3CcYXAXPC7D8jQLL2w+UO3hEmCrEVZ7eDP+56aP/8ywoG/R4tTgl3hGs+vEat+dAYM/lODgRKNOZieAF40ZDC9JTjXXEbsvhcOW4LMMruNYXH3v/koZxQMf3fW+f3vfQB4ccaA9a/fHnxvbsz8BQnw0gFCoFOD/rDI/bttYFxtpQDIqwF8qQFbfLu4mTGe4OH7+1+HjeHvDBACrwHuGLCUCP/+pjvPuDafUF2/ZcS5E+Bq5iP/sgb/K5wginK0wQ0NyS50Z1UFQK/CqtMhwNmBVbozwDI6LIVyMuT/TUbnSlKusElGCK5JGb3861uAHwR59fpu5tvTve5NsGzoO4Ph+dhMQOHA6ru/r3Gz7mnYRKFHAs9x13/czfr/BlyYCgkehTfA/cgN3rOAP8KGJG/vPvNrtz69kK2zN0ep5CKLgc+72XASw543GL7SCaKbU89/ldOQwnaNB+wgmRGvowGGumREH0lvpYbtZ4LflQQxFqaNO2GTagB1PT4YCFXfMa4aU+0dNgu+ZIAanP57qRMCL3JCJ0uo+s7czVBZuxlJQkJ+D3i5O/+uGbaDrInlXTkMiunl0MeCc/rz/nPD+5IXSte3vTBIHYpMREHud4LZqIeNic+rwnrpf5abjbOua4KZd6M70gMzTmklyZiZgdPfu98dWXv66Rk3crP/XxbILuSF0YtTMzLYgiT9CTWrWRuDjSoD5atHV5eHuy71/l7YVF4UyK4DcCKwwwA//SQozWVSS5dwORMHKvI+wEHYsOAD3HXWusF9t7NZ9FOqeDjgkxHegt5P4eVOAMYFBcDyQOD1gmVQT+XtVBuwSixK/b2NmwUp4DyUuAH7fOD7I5yAwrWpSa3JD3X2iBOBFcCOA86xyc2u38T6JNydEgTxBAP3xEBQdEruo0aBRCgcuOLunk9g6+VRgi/4igk6fjdYPh0FXOYMlB9x6/cdg12JfrAXnzgj4lHAX2NjBv7dGf+iCVR532lXFgz08ed5OKOvqt/KFZiqBWyk03ZtpHhMvP/evhPMlhF2z/9z2G2kP3CaSOgrkDYEdgP13guG7YAznP3hI4EW0B2zPfYu+Pz9va/L6KvLNHSbnxOwbmravhkW+p+XEF03rjdczw3cl2K3I89MWZR7YxQJNYFgSAJBcC7wHSfkohFLR98e25bUvlkG0JVaAmgJUDWyrNXfKiHePcEG6Iwz+E/D+tofFOT+z2uBNilBsMrZIY4aYX3313qm4D13sQ5E3wg0i8j12cNb0n/lB0B99mzXu9ky7Ji7u/uPc96/P/fqIZqAH4gfyPhemYffl38y+D29Ib/nAor5QMTA14P29G16oBMubehT17ZdAMQ1Ofz++tEpNRrmA4Hmctx7gs2ss9uA9bS/xgdTA2ehOqa/z2ewVv4sIeCF1Ftz1jIM2+roVAIRsN6heZ2LJACkASzoA/t8yjegg7W635tjMPgOfvGA2d8PiHOCz8dTutcYG9l3fIYQ8EJqCfDghDEAYfTiJan79hrAzQUEy0IdoYYXjxE/IQEwZqPOBUd/gY4odaT/f27I6znXYZ9xrx8NjIEm6LxHB1F10QT3HgEvTJ0L5n0O3jvlwZ/uoJuDUmO9DC3gLwKNYRKhtwa7JdlJ3fvqhrsAT10ATGOL7jfYKjHj5pv3rrVXY2PCe4HxxwwJ2jE5M9iajAq5ccrrzqSMMmFuviS1Tt2A9QEwgTErcirxf7j3+0OMc1EwiD4A/H3Kqccb/N7hZsloDOs+C7T92cEGHr0a6zfQC4yPJkgzdrwb3N0Bhrs4cJ9ejy0vviblypxg4xH2dkI3Du67n3KeSgYkJEkHKyUD4h/iIdWTyfiOyQhM89faDvgvNzGM6xTlP3eda1uFA9MMj8vjXQdPUokx5jJU2nMzVH9/njcG2sQsl1b9IIvPganf64XAEuCrAzS7tM3iO8y7/jYpL2DejEDfbXM+gMucFFwUzK51OBixl78U+Ae3Ps568DcwX6QzKw/AMU6ljitiV/HP65duhk4LAc/7sTEHWee4Hfiz4POdEX4KdegH/ncuxrpUV1IAmCkJgF1yLAEux5ar7tYkKpAxHXr8veyK9R1Y6da764GfYuP4GaD2vxibB2CnEnzsy8T7BdzuVNZHMtR3sEFNRwIvwAZLPeDu+ScpNT5uiGu4d8C6A+ubMekS4NpgJ6SVGgANTRHdneD/u0FAz8YF3Ocvy0/gpiDYqMP43oxNTQXeq7IGoMpAzCzPgclIzNFJGZC8FrDcGdP2CIx+VbRz9LFZhK7ARkOGAUSD7rk7oIZAmypAodqA7SPJ2HaMM+Lq98R6xO1fg3z5XggcgzXidjLyFEQZ27BJyyJFJQAURDTW+nFHbFqxlcxvHVKDHY854PXApwOhZVTiSwJAjDf4/XO5CGv469csecsiJwTOxFZC6jdwjd+IiazK+QDaOmP4df/fAW9wA6mOmZv8cuA8dx9tFgKVHQNVzgeQtHTw94GTsfvm/RqnbTOBUfMCrI9A3EKt07RdAxCTrft3Bj4VWNBNzRPOxKl7UrFYJQSRcBoyWD6K9RuPGtIGfklzEvC6hlX+1RJAa/lSy4cfgHWJjRs4SHyRj25GtSWhWbbVNgD/HP4UGz3WtAHiMxUfCRxXoFhI21T5RJ6A7cBX0nlLg5c/3hX8nZp3pQGIZ8+OL8Pm/2+qpdw7Ax2LDQ6LtAyQABDzg2BV1b3GStrl2A1b6Uj9T3UBRNA+R7Rg6eP9/pfLQCwNQMzP+AbYr0Uaz4F67HIFluawddKIpS2aFZdq6LVnF0BLADEo8SlyBJIG0OZtwCTIavtwiwTmJs3ksgFIc9g6lfVDLRoMa6UEaReAuiZRWCAN6WdBTjga7PNgmE98quWhNIDWewL6QXDtGAlDm7DceRS4s6VCXgJAAmCgpvNDbA3Bpg4Mb/j7BrZaVFcagASAbADz24BPY3PomYYKAC/Qz0fbeRIA4lmzowE+i60t2G2YEPDpwC7DVvfttnArUAJAS4ChM0QHuz12dqAFJCWePx5Q/TirWnKZ146chvMw8OepSkGa/VuQEESMP1C6wJexWYF6Qf2/vLaFfuBq3MkoypF1dINUZFFQqanIzP80tjryhgYvcWq5dOipjSspBD7hXv9NMJDMiByBYfXdXqpY6RPAfdgqtQ+613NsXbVnJ2AfbKDOQcBzUzsScaoktxmhbRj3Ox5xg/+6lqr+rQ94ylsb8HKaWTOOMffLAVaztX9AEszsg0pshxV3PwmcCCxj8rz+hwJnAJe6mTurft3ciN9xpRMktDgP4CJs5WSVB5cAyCUEtsFm0bna2QgGtdsT2K3ETwAvHdBu4ywBspaFO2OTen7WaRHPDPkdG4CLsYk/aPEzLEMAXNPmJUCi5QBdN9i+4A6voh+MLRRqsCW212J9CDZkPN8kWHNHExa09G7Kj2NLlF3lzrm/O54H7O7Ou9519DWBr3+npcE/QuXBSy8n3plAqJddT8D/hnGfRVfPTRqAKLeKMEMMcGn7wEL+BpM6Bm03iq2fDVWt3yZQldmmdGiBHIGEqFg/VjCQBIAQEgDaBRBCAkAIeQNKAGgJIIQEgBAoqEcCQDYAISQAhBASAEIICQAhhHYBhBASAEIg/wHtAgihgdzw0mDSAIRocXVgIWi5I5DSggshwdFODUA2AEFDkrjEVR2f0xAAW3J+b1v1HdEAtinQl7c0QQA8MuGM7jWG/YLqNLIjCGpq+V8K7DmhNuzHyvomCIAnczbc/swXtJAAEHVNBbYfsJj5akmTsKkJAuBXORouAnYAjgry0wtRNwGQACcXSOi6oQkC4I4cRj3/2dOVhVbUdPDHwHbAW3KMNf/Zu5vQGG9msqIIYXGEPvByVCBE1ItF7t+z2brYzTiHL6DzO2zlpdpzELB5wupAYaP9xDVoR0sBQX1qOu4HPOomsnjCiS/BFoXtNUUd+n4OSRh+/qJUiSohqHChnR2xhVrzaL5zTmCc36SG+XBwc0mOBkmAC4LB72vPaXdAVKV2o++buwPX5pzwQoFxXJOilFYAvwhU+Emv23fS9Ubg/U6jCO9hVDHMpMD9JjnaLhmjzZMB50oyLMnD/p7k95spuq6aEp/BsHY1FfLwOwn4J+DAoLrzpOc0WOv/CuCpJq2J/qeAVEx/7zLgdcw7WAgxK/YF3gZ8c0BfzaPtnjut2p1mSgIgwu7pfy+nZAwlZGgIfBxbenkDtgx5J2OWMANm3WGzskm9NkMKZGbNbGbIrJ4E/2cyzmeG7CknA37LpLNtnm3VZEB7Jhn3awKj7zjtEX4mGaJJmDG0u2SEVlVkxvfaZoz18NsHa+TeIdUenQKFXzcBhwAbg+1EmhJ2fEUBW0BaG4gKnkOHjrKOfoFZPz37f2ialbvNFAVA4tY1fnujU8L1w1lGzkJiFq6+ZVT/9ZrtvcARwNNNdIDzav857sa2aObQoYM4mP2PmbbTW3cGQuBG4EjgUKc2yblHtJk+1tHtY9it7p5b3jYyWaFXl5YAPwAODrb4hGgbc27wXw68KRj8SZOzlXor6nKsw8R+EgKixYP/BuCEWa37OzNyoOgCa4HXAuvc4O+rTwjakefPD/7rgVOwgT8zMWTPav3tfQHWAKuAnwdCQNZ8QYPzAyZu8F/mZv5NgVbcqspAXgisc0Lgi04IGAkC0cBZvx9EtJ4HnIp19e00xdmnDCF0FvBgRmSUtot01PGIUk5vtwHHBv1ewWxsHdAD1r//X9y6KO1pJe8/HVXf0/eDPuyrG4GPYsOEqVJIu6mgs5DfAz0Em1HlzdgQy6y1FBl+9UJMs2hHkjGJedYBXwA+4zTbdB+XABiiDfhG2sMZS07Apgc7QM5DoqI8jXXnvREb/fpd5rNid1MTlwTAGLYBk5KWO2B9pQ/H5kvzkVg7YiOzsjQCMyLO3gyIumOMiLRkguywZETOJSNi58fNJzBsljIDIgYZ857MmLOgybjHeMi9miH73maCaMgy8h5k/f5RWavvc/e3AZu//1Z33OWWAARBPZGM2kIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCtJb/A6zZsAjV+Uy4AAAAAElFTkSuQmCC"
      }
    ]
  },
  "assets": {
    "cardboardBox": {
      "assetId": "cardboard-box",
      "runtimeId": "cardboardBox",
      "name": "Cardboard Box",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 6,
          "revisions": {
            "5": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 5,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/down.png",
                "right": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/right.png",
                "up": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/up.png",
                "left": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/left.png"
              },
              "stickerCategory": "general",
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 78,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 24,
                  "right": 320,
                  "bottom": 329
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 71,
                  "right": 310,
                  "bottom": 329
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 23,
                  "right": 320,
                  "bottom": 329
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            },
            "6": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/left.png"
              },
              "stickerCategory": "general",
              "stickerSlot": {
                "id": "front-surface",
                "enabled": true,
                "mode": "pitched-roof",
                "category": "general",
                "anchors": {
                  "down": {
                    "auto": "right",
                    "left": {
                      "x": 0.5,
                      "y": 0.2756,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.569245,
                          "y": 0.293262
                        },
                        {
                          "x": 0.430755,
                          "y": 0.293262
                        },
                        {
                          "x": 0.432854,
                          "y": 0.258494
                        },
                        {
                          "x": 0.567146,
                          "y": 0.258494
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.65,
                      "y": 0.52,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.5778,
                          "y": 0.449096
                        },
                        {
                          "x": 0.721431,
                          "y": 0.449096
                        },
                        {
                          "x": 0.722571,
                          "y": 0.591269
                        },
                        {
                          "x": 0.578201,
                          "y": 0.591269
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "right",
                    "left": {
                      "x": 0.322,
                      "y": 0.4042,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.382283,
                          "y": 0.328045
                        },
                        {
                          "x": 0.379713,
                          "y": 0.432183
                        },
                        {
                          "x": 0.261259,
                          "y": 0.480982
                        },
                        {
                          "x": 0.266293,
                          "y": 0.377177
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.6579,
                      "y": 0.2913,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.60102,
                          "y": 0.316726
                        },
                        {
                          "x": 0.598903,
                          "y": 0.217016
                        },
                        {
                          "x": 0.712926,
                          "y": 0.266638
                        },
                        {
                          "x": 0.717423,
                          "y": 0.366089
                        }
                      ],
                      "visible": true
                    }
                  },
                  "up": {
                    "auto": "left",
                    "left": {
                      "x": 0.5,
                      "y": 0.54,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.428185,
                          "y": 0.469045
                        },
                        {
                          "x": 0.571815,
                          "y": 0.469045
                        },
                        {
                          "x": 0.572185,
                          "y": 0.61132
                        },
                        {
                          "x": 0.427815,
                          "y": 0.61132
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.3572,
                      "y": 0.2805,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.424598,
                          "y": 0.298341
                        },
                        {
                          "x": 0.285393,
                          "y": 0.298341
                        },
                        {
                          "x": 0.291933,
                          "y": 0.263245
                        },
                        {
                          "x": 0.426895,
                          "y": 0.263245
                        }
                      ],
                      "visible": true
                    }
                  },
                  "left": {
                    "auto": "left",
                    "left": {
                      "x": 0.678,
                      "y": 0.4042,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.620287,
                          "y": 0.432183
                        },
                        {
                          "x": 0.617717,
                          "y": 0.328045
                        },
                        {
                          "x": 0.733707,
                          "y": 0.377177
                        },
                        {
                          "x": 0.738741,
                          "y": 0.480982
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.3348,
                      "y": 0.5082,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.396583,
                          "y": 0.429676
                        },
                        {
                          "x": 0.394266,
                          "y": 0.538803
                        },
                        {
                          "x": 0.272571,
                          "y": 0.587392
                        },
                        {
                          "x": 0.277486,
                          "y": 0.47868
                        }
                      ],
                      "visible": true
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.31,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "general-heart",
                "defaultColorId": "rose"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 311,
                  "bottom": 330
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "catStatueV2": {
      "assetId": "cat-statue-v2",
      "runtimeId": "catStatueV2",
      "name": "Cat Statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "cat-statue-v2",
              "runtimeId": "catStatueV2",
              "name": "Cat Statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 120,
                  "right": 410,
                  "bottom": 412
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 101,
                  "top": 115,
                  "right": 331,
                  "bottom": 420
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 17,
                  "top": 56,
                  "right": 333,
                  "bottom": 412
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 90,
                  "top": 18,
                  "right": 319,
                  "bottom": 420
                }
              }
            }
          }
        }
      }
    },
    "catchen": {
      "assetId": "catchen",
      "runtimeId": "catchen",
      "name": "Catchen",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 82,
                  "top": 67,
                  "right": 517,
                  "bottom": 522
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 78,
                  "top": 82,
                  "right": 533,
                  "bottom": 517
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 83,
                  "top": 78,
                  "right": 518,
                  "bottom": 533
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 67,
                  "top": 83,
                  "right": 522,
                  "bottom": 518
                }
              }
            },
            "4": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 69,
                  "top": 23,
                  "right": 572,
                  "bottom": 299
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 107,
                  "right": 271,
                  "bottom": 562
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 68,
                  "top": 47,
                  "right": 571,
                  "bottom": 299
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 93,
                  "right": 271,
                  "bottom": 563
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        },
        "2": {
          "liveRevision": 6,
          "revisions": {
            "1": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 1,
              "status": "approved",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 14,
                  "top": 0,
                  "right": 774,
                  "bottom": 270
                },
                "right": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 19,
                  "top": 127,
                  "right": 251,
                  "bottom": 765
                },
                "up": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 40,
                  "top": 22,
                  "right": 797,
                  "bottom": 270
                },
                "left": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 27,
                  "top": 88,
                  "right": 242,
                  "bottom": 789
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 2,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 3
                  }
                ]
              }
            },
            "6": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 6,
              "status": "live",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 14,
                  "top": 0,
                  "right": 774,
                  "bottom": 270
                },
                "right": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 19,
                  "top": 127,
                  "right": 251,
                  "bottom": 765
                },
                "up": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 40,
                  "top": 22,
                  "right": 797,
                  "bottom": 270
                },
                "left": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 27,
                  "top": 88,
                  "right": 242,
                  "bottom": 789
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 2,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 3
                  }
                ]
              }
            }
          }
        }
      }
    },
    "junkFlowerBush": {
      "assetId": "junk-flower-bush",
      "runtimeId": "junkFlowerBush",
      "name": "Flowering Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-flower-bush",
              "runtimeId": "junkFlowerBush",
              "name": "Flowering Bush",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                }
              },
              "gameplay": {
                "clearDurationSeconds": 1800,
                "minCatLevel": 2,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "junkGreenBush": {
      "assetId": "junk-green-bush",
      "runtimeId": "junkGreenBush",
      "name": "Green Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-green-bush",
              "runtimeId": "junkGreenBush",
              "name": "Green Bush",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                }
              },
              "gameplay": {
                "clearDurationSeconds": 1200,
                "minCatLevel": 0,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "jobCenter": {
      "assetId": "job-center",
      "runtimeId": "jobCenter",
      "name": "Job Center",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 7,
          "revisions": {
            "6": {
              "assetId": "job-center",
              "runtimeId": "jobCenter",
              "name": "Job Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "retired",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/down.png",
                "right": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/right.png",
                "up": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/up.png",
                "left": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/left.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "surface",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.33
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.33
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 0.9,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "sky-blue"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 960,
                  "left": 36,
                  "top": 73,
                  "right": 605,
                  "bottom": 786
                },
                "right": {
                  "canvasWidth": 960,
                  "canvasHeight": 640,
                  "left": 118,
                  "top": 56,
                  "right": 845,
                  "bottom": 548
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 960,
                  "left": 42,
                  "top": 74,
                  "right": 597,
                  "bottom": 781
                },
                "left": {
                  "canvasWidth": 960,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 57,
                  "right": 841,
                  "bottom": 548
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "7": {
              "assetId": "job-center",
              "runtimeId": "jobCenter",
              "name": "Job Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 7,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/down.png",
                "right": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/right.png",
                "up": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/up.png",
                "left": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/left.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "pitched-roof",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "right",
                    "left": {
                      "x": 0.5,
                      "y": 0.2336,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.56591,
                          "y": 0.188019
                        },
                        {
                          "x": 0.43409,
                          "y": 0.188019
                        },
                        {
                          "x": 0.435649,
                          "y": 0.278129
                        },
                        {
                          "x": 0.564351,
                          "y": 0.278129
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.73,
                      "y": 0.74,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.66012,
                          "y": 0.696318
                        },
                        {
                          "x": 0.806051,
                          "y": 0.696318
                        },
                        {
                          "x": 0.798054,
                          "y": 0.782541
                        },
                        {
                          "x": 0.655936,
                          "y": 0.782541
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "left",
                    "left": {
                      "x": 0.1748,
                      "y": 0.4694,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.174156,
                          "y": 0.372751
                        },
                        {
                          "x": 0.167118,
                          "y": 0.477259
                        },
                        {
                          "x": 0.175472,
                          "y": 0.56557
                        },
                        {
                          "x": 0.182165,
                          "y": 0.461809
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.8137,
                      "y": 0.3184,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.820844,
                          "y": 0.322545
                        },
                        {
                          "x": 0.814281,
                          "y": 0.2246
                        },
                        {
                          "x": 0.806802,
                          "y": 0.314357
                        },
                        {
                          "x": 0.813054,
                          "y": 0.411752
                        }
                      ],
                      "visible": false
                    }
                  },
                  "up": {
                    "auto": "left",
                    "left": {
                      "x": 0.5,
                      "y": 0.73,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.427034,
                          "y": 0.686184
                        },
                        {
                          "x": 0.572966,
                          "y": 0.686184
                        },
                        {
                          "x": 0.571059,
                          "y": 0.772671
                        },
                        {
                          "x": 0.428941,
                          "y": 0.772671
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.2919,
                      "y": 0.244,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.35532,
                          "y": 0.198554
                        },
                        {
                          "x": 0.223461,
                          "y": 0.198554
                        },
                        {
                          "x": 0.230006,
                          "y": 0.28844
                        },
                        {
                          "x": 0.358745,
                          "y": 0.28844
                        }
                      ],
                      "visible": false
                    }
                  },
                  "left": {
                    "auto": "left",
                    "left": {
                      "x": 0.8252,
                      "y": 0.4694,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.832882,
                          "y": 0.477259
                        },
                        {
                          "x": 0.825844,
                          "y": 0.372751
                        },
                        {
                          "x": 0.817835,
                          "y": 0.461809
                        },
                        {
                          "x": 0.824528,
                          "y": 0.56557
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.1645,
                      "y": 0.6521,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.163746,
                          "y": 0.552505
                        },
                        {
                          "x": 0.156223,
                          "y": 0.664787
                        },
                        {
                          "x": 0.165152,
                          "y": 0.751315
                        },
                        {
                          "x": 0.172294,
                          "y": 0.640042
                        }
                      ],
                      "visible": false
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.46,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "kraft"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 44,
                  "top": 0,
                  "right": 598,
                  "bottom": 545
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 70,
                  "top": 55,
                  "right": 575,
                  "bottom": 548
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 49,
                  "top": 0,
                  "right": 591,
                  "bottom": 542
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 66,
                  "top": 55,
                  "right": 570,
                  "bottom": 548
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        }
      }
    },
    "laboratory": {
      "assetId": "laboratory",
      "runtimeId": "laboratory",
      "name": "Laboratory",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "laboratory",
              "runtimeId": "laboratory",
              "name": "Laboratory",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Laboratory_Final.png",
                "right": "img/Buildings/Laboratory_Final.png",
                "up": "img/Buildings/Laboratory_Final.png",
                "left": "img/Buildings/Laboratory_Final.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "surface",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 0.8,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "sky-blue"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                },
                "right": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                },
                "up": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                },
                "left": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "marketStall": {
      "assetId": "market-stall",
      "runtimeId": "marketStall",
      "name": "Market Stall",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "1": {
              "assetId": "market-stall",
              "runtimeId": "marketStall",
              "name": "Market Stall",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 44,
                  "right": 556,
                  "bottom": 552
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 20,
                  "right": 538,
                  "bottom": 578
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 41,
                  "right": 556,
                  "bottom": 566
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 104,
                  "top": 19,
                  "right": 526,
                  "bottom": 578
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "2": {
              "assetId": "market-stall",
              "runtimeId": "marketStall",
              "name": "Market Stall",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "approved",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 44,
                  "right": 556,
                  "bottom": 575
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 20,
                  "right": 538,
                  "bottom": 578
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 41,
                  "right": 556,
                  "bottom": 566
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 104,
                  "top": 19,
                  "right": 526,
                  "bottom": 578
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "4": {
              "assetId": "market-stall",
              "runtimeId": "marketStall",
              "name": "Market Stall",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 44,
                  "right": 556,
                  "bottom": 575
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 20,
                  "right": 538,
                  "bottom": 578
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 41,
                  "right": 556,
                  "bottom": 566
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 104,
                  "top": 19,
                  "right": 526,
                  "bottom": 578
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        }
      }
    },
    "operationTable": {
      "assetId": "operation-table",
      "runtimeId": "operationTable",
      "name": "Operation Table",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 8,
          "revisions": {
            "1": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 63,
                  "top": 23,
                  "right": 578,
                  "bottom": 313
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 38,
                  "top": 97,
                  "right": 281,
                  "bottom": 565
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 62,
                  "top": 24,
                  "right": 577,
                  "bottom": 313
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 38,
                  "top": 97,
                  "right": 281,
                  "bottom": 566
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "4": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "5": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 5,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "6": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "8": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 8,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/down.png",
                "right": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/right.png",
                "up": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/up.png",
                "left": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        }
      }
    },
    "pawsonry": {
      "assetId": "pawsonry",
      "runtimeId": "pawsonry",
      "name": "Pawsonry",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 65,
                  "right": 524,
                  "bottom": 529
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 71,
                  "top": 76,
                  "right": 535,
                  "bottom": 524
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 71,
                  "right": 524,
                  "bottom": 535
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 65,
                  "top": 76,
                  "right": 529,
                  "bottom": 524
                }
              }
            },
            "4": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 77,
                  "top": 153,
                  "right": 596,
                  "bottom": 507
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 126,
                  "right": 481,
                  "bottom": 542
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 179,
                  "right": 559,
                  "bottom": 605
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 142,
                  "top": 121,
                  "right": 600,
                  "bottom": 593
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "junkPebblePile": {
      "assetId": "junk-pebble-pile",
      "runtimeId": "junkPebblePile",
      "name": "Pile of Pebbles",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-pebble-pile",
              "runtimeId": "junkPebblePile",
              "name": "Pile of Pebbles",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                }
              },
              "gameplay": {
                "clearDurationSeconds": 600,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "junkStoneBlockPile": {
      "assetId": "junk-stone-block-pile",
      "runtimeId": "junkStoneBlockPile",
      "name": "Pile of Stone Blocks",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-stone-block-pile",
              "runtimeId": "junkStoneBlockPile",
              "name": "Pile of Stone Blocks",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                }
              },
              "gameplay": {
                "clearDurationSeconds": 4800,
                "minCatLevel": 5,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "sawmill": {
      "assetId": "sawmill",
      "runtimeId": "sawmill",
      "name": "Sawmill",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "2": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 82,
                  "top": 49,
                  "right": 525,
                  "bottom": 331
                },
                "right": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 69,
                  "top": 82,
                  "right": 351,
                  "bottom": 525
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 75,
                  "top": 69,
                  "right": 518,
                  "bottom": 351
                },
                "left": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 49,
                  "top": 75,
                  "right": 331,
                  "bottom": 518
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            },
            "3": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 63,
                  "top": 11,
                  "right": 578,
                  "bottom": 302
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 105,
                  "right": 270,
                  "bottom": 569
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 62,
                  "top": 50,
                  "right": 577,
                  "bottom": 301
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 49,
                  "top": 70,
                  "right": 271,
                  "bottom": 569
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        },
        "2": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 0,
                  "right": 580,
                  "bottom": 310
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 46,
                  "top": 23,
                  "right": 266,
                  "bottom": 579
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 1,
                  "right": 579,
                  "bottom": 310
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 97,
                  "right": 272,
                  "bottom": 579
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "smallCatStatue": {
      "assetId": "small-cat-statue",
      "runtimeId": "smallCatStatue",
      "name": "Small cat statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "small-cat-statue",
              "runtimeId": "smallCatStatue",
              "name": "Small cat statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 102,
                  "top": 70,
                  "right": 334,
                  "bottom": 395
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 96,
                  "top": 19,
                  "right": 348,
                  "bottom": 395
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 28,
                  "right": 325,
                  "bottom": 395
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 71,
                  "top": 51,
                  "right": 319,
                  "bottom": 395
                }
              }
            }
          }
        }
      }
    },
    "storage": {
      "assetId": "small-storage-shed",
      "runtimeId": "storage",
      "name": "Small Storage Shed",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "small-storage-shed",
              "runtimeId": "storage",
              "name": "Small Storage Shed",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/left.png"
              },
              "stickerCategory": "storage",
              "stickerSlot": {
                "id": "front-surface",
                "enabled": true,
                "mode": "surface",
                "category": "storage",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 1.5,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "storage-stacked-boxes",
                "defaultColorId": "kraft"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 30,
                  "top": 6,
                  "right": 331,
                  "bottom": 339
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 30,
                  "top": 0,
                  "right": 321,
                  "bottom": 353
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 33,
                  "top": 0,
                  "right": 326,
                  "bottom": 352
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 0,
                  "right": 329,
                  "bottom": 354
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "junkTallGrass": {
      "assetId": "junk-tall-grass",
      "runtimeId": "junkTallGrass",
      "name": "Tall Green Grass",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-tall-grass",
              "runtimeId": "junkTallGrass",
              "name": "Tall Green Grass",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                }
              },
              "gameplay": {
                "clearDurationSeconds": 360,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            },
            "2": {
              "assetId": "junk-tall-grass",
              "runtimeId": "junkTallGrass",
              "name": "Tall Green Grass",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                }
              },
              "gameplay": {
                "clearDurationSeconds": 360,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            },
            "3": {
              "assetId": "junk-tall-grass",
              "runtimeId": "junkTallGrass",
              "name": "Tall Green Grass",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                }
              },
              "gameplay": {
                "clearDurationSeconds": 360,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "junkThornBush": {
      "assetId": "junk-thorn-bush",
      "runtimeId": "junkThornBush",
      "name": "Thorny Bramble Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-thorn-bush",
              "runtimeId": "junkThornBush",
              "name": "Thorny Bramble Bush",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                }
              },
              "gameplay": {
                "clearDurationSeconds": 2400,
                "minCatLevel": 4,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "trainingCenter": {
      "assetId": "training-center",
      "runtimeId": "trainingCenter",
      "name": "Training Center",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "training-center",
              "runtimeId": "trainingCenter",
              "name": "Training Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 3,
              "height": 4,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/left.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "surface",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.43
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.6,
                      "y": 0.5
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.57
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.4,
                      "y": 0.5
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 0.8,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "sky-blue"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 450,
                  "canvasHeight": 600,
                  "left": 60,
                  "top": 38,
                  "right": 390,
                  "bottom": 536
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 450,
                  "left": 64,
                  "top": 60,
                  "right": 562,
                  "bottom": 390
                },
                "up": {
                  "canvasWidth": 450,
                  "canvasHeight": 600,
                  "left": 60,
                  "top": 64,
                  "right": 390,
                  "bottom": 562
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 450,
                  "left": 38,
                  "top": 60,
                  "right": 536,
                  "bottom": 390
                }
              }
            }
          }
        }
      }
    },
    "woodCathouse": {
      "assetId": "wood-cathouse",
      "runtimeId": "woodCathouse",
      "name": "Wood Cathouse",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "wood-cathouse",
              "runtimeId": "woodCathouse",
              "name": "Wood Cathouse",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 588,
                  "bottom": 313
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 313,
                  "bottom": 572
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 587,
                  "bottom": 312
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 314,
                  "bottom": 567
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "west",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": -1,
                        "y": 0
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  "environmentAssets": {},
  "edgeAssets": {
    "campBoundaryFence": {
      "assetId": "camp-boundary-fence",
      "runtimeId": "campBoundaryFence",
      "name": "Camp Boundary Fence",
      "category": "fence",
      "placeable": false,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "1": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 84,
                  "right": 186,
                  "bottom": 561
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 84,
                  "top": 75,
                  "right": 557,
                  "bottom": 233
                },
                "up": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 88,
                  "right": 185,
                  "bottom": 564
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 83,
                  "top": 71,
                  "right": 558,
                  "bottom": 233
                }
              }
            },
            "2": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 89,
                  "right": 320,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 91,
                  "right": 318,
                  "bottom": 305
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 89,
                  "right": 318,
                  "bottom": 309
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 92,
                  "right": 318,
                  "bottom": 308
                }
              },
              "edgeSprites": {
                "horizontalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalA.png",
                "horizontalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalB.png",
                "verticalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalA.png",
                "verticalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalB.png",
                "post": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 125,
                  "right": 360,
                  "bottom": 212
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 129,
                  "right": 360,
                  "bottom": 209
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 91,
                  "right": 204,
                  "bottom": 248
                }
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/assembled-preview.png"
            },
            "3": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 93,
                  "right": 319,
                  "bottom": 250
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 94,
                  "right": 321,
                  "bottom": 249
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 42,
                  "top": 93,
                  "right": 320,
                  "bottom": 253
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 95,
                  "right": 318,
                  "bottom": 252
                }
              },
              "edgeSprites": {
                "horizontalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalA.png",
                "horizontalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalB.png",
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalB.png",
                "post": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 128,
                  "right": 360,
                  "bottom": 215
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 132,
                  "right": 360,
                  "bottom": 212
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 157,
                  "top": 0,
                  "right": 204,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 203,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 94,
                  "right": 204,
                  "bottom": 251
                }
              },
              "edgeForegroundSprites": {
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalB.png"
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-3/assembled-preview.png"
            }
          }
        }
      },
      "runtimeRole": "camp-fence",
      "placementMode": "edge"
    }
  },
  "reviewAssets": {
    "basicTrail": {
      "assetId": "basic-trail",
      "runtimeId": "basicTrail",
      "name": "Basic Trail",
      "category": "path",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "basic-trail",
              "runtimeId": "basicTrail",
              "name": "Basic Trail",
              "category": "path",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Paths/Basic Trail_Camp_TopDown_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 0,
                  "top": 0,
                  "right": 256,
                  "bottom": 256
                }
              }
            }
          }
        }
      }
    },
    "campBoundaryFence": {
      "assetId": "camp-boundary-fence",
      "runtimeId": "campBoundaryFence",
      "name": "Camp Boundary Fence",
      "category": "fence",
      "placeable": false,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "1": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 84,
                  "right": 186,
                  "bottom": 561
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 84,
                  "top": 75,
                  "right": 557,
                  "bottom": 233
                },
                "up": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 134,
                  "top": 88,
                  "right": 185,
                  "bottom": 564
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 83,
                  "top": 71,
                  "right": 558,
                  "bottom": 233
                }
              }
            },
            "2": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 89,
                  "right": 320,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 91,
                  "right": 318,
                  "bottom": 305
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 89,
                  "right": 318,
                  "bottom": 309
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 92,
                  "right": 318,
                  "bottom": 308
                }
              },
              "edgeSprites": {
                "horizontalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalA.png",
                "horizontalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-horizontalB.png",
                "verticalA": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalA.png",
                "verticalB": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-verticalB.png",
                "post": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 125,
                  "right": 360,
                  "bottom": 212
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 129,
                  "right": 360,
                  "bottom": 209
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 205,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 91,
                  "right": 204,
                  "bottom": 248
                }
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-2/assembled-preview.png"
            },
            "3": {
              "assetId": "camp-boundary-fence",
              "runtimeId": "campBoundaryFence",
              "name": "Camp Boundary Fence",
              "category": "fence",
              "placeable": false,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 41,
                  "top": 93,
                  "right": 319,
                  "bottom": 250
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 94,
                  "right": 321,
                  "bottom": 249
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 42,
                  "top": 93,
                  "right": 320,
                  "bottom": 253
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 95,
                  "right": 318,
                  "bottom": 252
                }
              },
              "edgeSprites": {
                "horizontalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalA.png",
                "horizontalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-horizontalB.png",
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-verticalB.png",
                "post": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-post.png"
              },
              "edgeSpriteBounds": {
                "horizontalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 128,
                  "right": 360,
                  "bottom": 215
                },
                "horizontalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 0,
                  "top": 132,
                  "right": 360,
                  "bottom": 212
                },
                "verticalA": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 157,
                  "top": 0,
                  "right": 204,
                  "bottom": 360
                },
                "verticalB": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 155,
                  "top": 0,
                  "right": 203,
                  "bottom": 360
                },
                "post": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 158,
                  "top": 94,
                  "right": 204,
                  "bottom": 251
                }
              },
              "edgeForegroundSprites": {
                "verticalA": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalA.png",
                "verticalB": "img/Buildings/Camp Runtime/camp-boundary-fence/tier-1/revision-3/edge-foreground-verticalB.png"
              },
              "assembledPreview": "tools/camp_asset_studio/library/assets/camp-boundary-fence/tier-1/revision-3/assembled-preview.png"
            }
          }
        }
      },
      "runtimeRole": "camp-fence",
      "placementMode": "edge"
    },
    "cardboardBox": {
      "assetId": "cardboard-box",
      "runtimeId": "cardboardBox",
      "name": "Cardboard Box",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 6,
          "revisions": {
            "5": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 5,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/down.png",
                "right": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/right.png",
                "up": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/up.png",
                "left": "tools/camp_asset_studio/library/assets/cardboard-box/tier-1/revision-5/left.png"
              },
              "stickerCategory": "general",
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 78,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 24,
                  "right": 320,
                  "bottom": 329
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 50,
                  "top": 71,
                  "right": 310,
                  "bottom": 329
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 40,
                  "top": 23,
                  "right": 320,
                  "bottom": 329
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            },
            "6": {
              "assetId": "cardboard-box",
              "runtimeId": "cardboardBox",
              "name": "Cardboard Box",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/cardboard-box/tier-1/revision-6/left.png"
              },
              "stickerCategory": "general",
              "stickerSlot": {
                "id": "front-surface",
                "enabled": true,
                "mode": "pitched-roof",
                "category": "general",
                "anchors": {
                  "down": {
                    "auto": "right",
                    "left": {
                      "x": 0.5,
                      "y": 0.2756,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.569245,
                          "y": 0.293262
                        },
                        {
                          "x": 0.430755,
                          "y": 0.293262
                        },
                        {
                          "x": 0.432854,
                          "y": 0.258494
                        },
                        {
                          "x": 0.567146,
                          "y": 0.258494
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.65,
                      "y": 0.52,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.5778,
                          "y": 0.449096
                        },
                        {
                          "x": 0.721431,
                          "y": 0.449096
                        },
                        {
                          "x": 0.722571,
                          "y": 0.591269
                        },
                        {
                          "x": 0.578201,
                          "y": 0.591269
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "right",
                    "left": {
                      "x": 0.322,
                      "y": 0.4042,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.382283,
                          "y": 0.328045
                        },
                        {
                          "x": 0.379713,
                          "y": 0.432183
                        },
                        {
                          "x": 0.261259,
                          "y": 0.480982
                        },
                        {
                          "x": 0.266293,
                          "y": 0.377177
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.6579,
                      "y": 0.2913,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.60102,
                          "y": 0.316726
                        },
                        {
                          "x": 0.598903,
                          "y": 0.217016
                        },
                        {
                          "x": 0.712926,
                          "y": 0.266638
                        },
                        {
                          "x": 0.717423,
                          "y": 0.366089
                        }
                      ],
                      "visible": true
                    }
                  },
                  "up": {
                    "auto": "left",
                    "left": {
                      "x": 0.5,
                      "y": 0.54,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.428185,
                          "y": 0.469045
                        },
                        {
                          "x": 0.571815,
                          "y": 0.469045
                        },
                        {
                          "x": 0.572185,
                          "y": 0.61132
                        },
                        {
                          "x": 0.427815,
                          "y": 0.61132
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.3572,
                      "y": 0.2805,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.424598,
                          "y": 0.298341
                        },
                        {
                          "x": 0.285393,
                          "y": 0.298341
                        },
                        {
                          "x": 0.291933,
                          "y": 0.263245
                        },
                        {
                          "x": 0.426895,
                          "y": 0.263245
                        }
                      ],
                      "visible": true
                    }
                  },
                  "left": {
                    "auto": "left",
                    "left": {
                      "x": 0.678,
                      "y": 0.4042,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.620287,
                          "y": 0.432183
                        },
                        {
                          "x": 0.617717,
                          "y": 0.328045
                        },
                        {
                          "x": 0.733707,
                          "y": 0.377177
                        },
                        {
                          "x": 0.738741,
                          "y": 0.480982
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.3348,
                      "y": 0.5082,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.396583,
                          "y": 0.429676
                        },
                        {
                          "x": 0.394266,
                          "y": 0.538803
                        },
                        {
                          "x": 0.272571,
                          "y": 0.587392
                        },
                        {
                          "x": 0.277486,
                          "y": 0.47868
                        }
                      ],
                      "visible": true
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.31,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "general-heart",
                "defaultColorId": "rose"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 310,
                  "bottom": 333
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 38,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 49,
                  "top": 77,
                  "right": 311,
                  "bottom": 330
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 23,
                  "right": 321,
                  "bottom": 330
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "catStatueV2": {
      "assetId": "cat-statue-v2",
      "runtimeId": "catStatueV2",
      "name": "Cat Statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "cat-statue-v2",
              "runtimeId": "catStatueV2",
              "name": "Cat Statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/cat-statue-v2/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 120,
                  "right": 410,
                  "bottom": 412
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 101,
                  "top": 115,
                  "right": 331,
                  "bottom": 420
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 17,
                  "top": 56,
                  "right": 333,
                  "bottom": 412
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 90,
                  "top": 18,
                  "right": 319,
                  "bottom": 420
                }
              }
            }
          }
        }
      }
    },
    "catchen": {
      "assetId": "catchen",
      "runtimeId": "catchen",
      "name": "Catchen",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/catchen/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 82,
                  "top": 67,
                  "right": 517,
                  "bottom": 522
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 78,
                  "top": 82,
                  "right": 533,
                  "bottom": 517
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 83,
                  "top": 78,
                  "right": 518,
                  "bottom": 533
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 67,
                  "top": 83,
                  "right": 522,
                  "bottom": 518
                }
              }
            },
            "4": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 69,
                  "top": 23,
                  "right": 572,
                  "bottom": 299
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 107,
                  "right": 271,
                  "bottom": 562
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 68,
                  "top": 47,
                  "right": 571,
                  "bottom": 299
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 93,
                  "right": 271,
                  "bottom": 563
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        },
        "2": {
          "liveRevision": 6,
          "revisions": {
            "1": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 1,
              "status": "approved",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/catchen/tier-2/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 14,
                  "top": 0,
                  "right": 774,
                  "bottom": 270
                },
                "right": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 19,
                  "top": 127,
                  "right": 251,
                  "bottom": 765
                },
                "up": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 40,
                  "top": 22,
                  "right": 797,
                  "bottom": 270
                },
                "left": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 27,
                  "top": 88,
                  "right": 242,
                  "bottom": 789
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 2,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 3
                  }
                ]
              }
            },
            "6": {
              "assetId": "catchen",
              "runtimeId": "catchen",
              "name": "Catchen",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 6,
              "status": "live",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/down.png",
                "right": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/right.png",
                "up": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/up.png",
                "left": "img/Buildings/Camp Runtime/catchen/tier-2/revision-6/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 14,
                  "top": 0,
                  "right": 774,
                  "bottom": 270
                },
                "right": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 19,
                  "top": 127,
                  "right": 251,
                  "bottom": 765
                },
                "up": {
                  "canvasWidth": 810,
                  "canvasHeight": 270,
                  "left": 40,
                  "top": 22,
                  "right": 797,
                  "bottom": 270
                },
                "left": {
                  "canvasWidth": 270,
                  "canvasHeight": 810,
                  "left": 27,
                  "top": 88,
                  "right": 242,
                  "bottom": 789
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 2,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 3
                  }
                ]
              }
            }
          }
        }
      }
    },
    "junkFlowerBush": {
      "assetId": "junk-flower-bush",
      "runtimeId": "junkFlowerBush",
      "name": "Flowering Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-flower-bush",
              "runtimeId": "junkFlowerBush",
              "name": "Flowering Bush",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Flower Bush_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 31,
                  "right": 491,
                  "bottom": 224
                }
              },
              "gameplay": {
                "clearDurationSeconds": 1800,
                "minCatLevel": 2,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "tree": {
      "assetId": "garden-tree",
      "runtimeId": "tree",
      "name": "Garden Tree",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "garden-tree",
              "runtimeId": "tree",
              "name": "Garden Tree",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png",
                "up": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png",
                "left": "tools/camp_asset_studio/library/assets/garden-tree/tier-1/revision-1/down.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                },
                "right": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                },
                "up": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                },
                "left": {
                  "canvasWidth": 400,
                  "canvasHeight": 400,
                  "left": 72,
                  "top": 64,
                  "right": 331,
                  "bottom": 331
                }
              }
            }
          }
        }
      }
    },
    "junkGreenBush": {
      "assetId": "junk-green-bush",
      "runtimeId": "junkGreenBush",
      "name": "Green Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-green-bush",
              "runtimeId": "junkGreenBush",
              "name": "Green Bush",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Green Bush_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 21,
                  "right": 491,
                  "bottom": 235
                }
              },
              "gameplay": {
                "clearDurationSeconds": 1200,
                "minCatLevel": 0,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "jobCenter": {
      "assetId": "job-center",
      "runtimeId": "jobCenter",
      "name": "Job Center",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 7,
          "revisions": {
            "6": {
              "assetId": "job-center",
              "runtimeId": "jobCenter",
              "name": "Job Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "retired",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/down.png",
                "right": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/right.png",
                "up": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/up.png",
                "left": "tools/camp_asset_studio/library/assets/job-center/tier-1/revision-6/left.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "surface",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.33
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.33
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 0.9,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "sky-blue"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 960,
                  "left": 36,
                  "top": 73,
                  "right": 605,
                  "bottom": 786
                },
                "right": {
                  "canvasWidth": 960,
                  "canvasHeight": 640,
                  "left": 118,
                  "top": 56,
                  "right": 845,
                  "bottom": 548
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 960,
                  "left": 42,
                  "top": 74,
                  "right": 597,
                  "bottom": 781
                },
                "left": {
                  "canvasWidth": 960,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 57,
                  "right": 841,
                  "bottom": 548
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "7": {
              "assetId": "job-center",
              "runtimeId": "jobCenter",
              "name": "Job Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 7,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/down.png",
                "right": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/right.png",
                "up": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/up.png",
                "left": "img/Buildings/Camp Runtime/job-center/tier-1/revision-7/left.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "pitched-roof",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "right",
                    "left": {
                      "x": 0.5,
                      "y": 0.2336,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.56591,
                          "y": 0.188019
                        },
                        {
                          "x": 0.43409,
                          "y": 0.188019
                        },
                        {
                          "x": 0.435649,
                          "y": 0.278129
                        },
                        {
                          "x": 0.564351,
                          "y": 0.278129
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.73,
                      "y": 0.74,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.66012,
                          "y": 0.696318
                        },
                        {
                          "x": 0.806051,
                          "y": 0.696318
                        },
                        {
                          "x": 0.798054,
                          "y": 0.782541
                        },
                        {
                          "x": 0.655936,
                          "y": 0.782541
                        }
                      ],
                      "visible": true
                    }
                  },
                  "right": {
                    "auto": "left",
                    "left": {
                      "x": 0.1748,
                      "y": 0.4694,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.174156,
                          "y": 0.372751
                        },
                        {
                          "x": 0.167118,
                          "y": 0.477259
                        },
                        {
                          "x": 0.175472,
                          "y": 0.56557
                        },
                        {
                          "x": 0.182165,
                          "y": 0.461809
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.8137,
                      "y": 0.3184,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.820844,
                          "y": 0.322545
                        },
                        {
                          "x": 0.814281,
                          "y": 0.2246
                        },
                        {
                          "x": 0.806802,
                          "y": 0.314357
                        },
                        {
                          "x": 0.813054,
                          "y": 0.411752
                        }
                      ],
                      "visible": false
                    }
                  },
                  "up": {
                    "auto": "left",
                    "left": {
                      "x": 0.5,
                      "y": 0.73,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.427034,
                          "y": 0.686184
                        },
                        {
                          "x": 0.572966,
                          "y": 0.686184
                        },
                        {
                          "x": 0.571059,
                          "y": 0.772671
                        },
                        {
                          "x": 0.428941,
                          "y": 0.772671
                        }
                      ],
                      "visible": true
                    },
                    "right": {
                      "x": 0.2919,
                      "y": 0.244,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.35532,
                          "y": 0.198554
                        },
                        {
                          "x": 0.223461,
                          "y": 0.198554
                        },
                        {
                          "x": 0.230006,
                          "y": 0.28844
                        },
                        {
                          "x": 0.358745,
                          "y": 0.28844
                        }
                      ],
                      "visible": false
                    }
                  },
                  "left": {
                    "auto": "left",
                    "left": {
                      "x": 0.8252,
                      "y": 0.4694,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.832882,
                          "y": 0.477259
                        },
                        {
                          "x": 0.825844,
                          "y": 0.372751
                        },
                        {
                          "x": 0.817835,
                          "y": 0.461809
                        },
                        {
                          "x": 0.824528,
                          "y": 0.56557
                        }
                      ],
                      "visible": false
                    },
                    "right": {
                      "x": 0.1645,
                      "y": 0.6521,
                      "rotation": 0.0,
                      "quad": [
                        {
                          "x": 0.163746,
                          "y": 0.552505
                        },
                        {
                          "x": 0.156223,
                          "y": 0.664787
                        },
                        {
                          "x": 0.165152,
                          "y": 0.751315
                        },
                        {
                          "x": 0.172294,
                          "y": 0.640042
                        }
                      ],
                      "visible": false
                    }
                  }
                },
                "anchorReview": true,
                "required": false,
                "baseSticker": false,
                "defaultScale": 1.46,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "kraft"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 44,
                  "top": 0,
                  "right": 598,
                  "bottom": 545
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 70,
                  "top": 55,
                  "right": 575,
                  "bottom": 548
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 49,
                  "top": 0,
                  "right": 591,
                  "bottom": 542
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 66,
                  "top": 55,
                  "right": 570,
                  "bottom": 548
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        }
      }
    },
    "laboratory": {
      "assetId": "laboratory",
      "runtimeId": "laboratory",
      "name": "Laboratory",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "laboratory",
              "runtimeId": "laboratory",
              "name": "Laboratory",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 3,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Laboratory_Final.png",
                "right": "img/Buildings/Laboratory_Final.png",
                "up": "img/Buildings/Laboratory_Final.png",
                "left": "img/Buildings/Laboratory_Final.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "surface",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.38
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 0.8,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "sky-blue"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                },
                "right": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                },
                "up": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                },
                "left": {
                  "canvasWidth": 205,
                  "canvasHeight": 144,
                  "left": 0,
                  "top": 0,
                  "right": 205,
                  "bottom": 144
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "main-access",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "marketStall": {
      "assetId": "market-stall",
      "runtimeId": "marketStall",
      "name": "Market Stall",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "1": {
              "assetId": "market-stall",
              "runtimeId": "marketStall",
              "name": "Market Stall",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 44,
                  "right": 556,
                  "bottom": 552
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 20,
                  "right": 538,
                  "bottom": 578
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 41,
                  "right": 556,
                  "bottom": 566
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 104,
                  "top": 19,
                  "right": 526,
                  "bottom": 578
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "2": {
              "assetId": "market-stall",
              "runtimeId": "marketStall",
              "name": "Market Stall",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "approved",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/market-stall/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 44,
                  "right": 556,
                  "bottom": 575
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 20,
                  "right": 538,
                  "bottom": 578
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 41,
                  "right": 556,
                  "bottom": 566
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 104,
                  "top": 19,
                  "right": 526,
                  "bottom": 578
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "4": {
              "assetId": "market-stall",
              "runtimeId": "marketStall",
              "name": "Market Stall",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/market-stall/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 44,
                  "right": 556,
                  "bottom": 575
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 116,
                  "top": 20,
                  "right": 538,
                  "bottom": 578
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 85,
                  "top": 41,
                  "right": 556,
                  "bottom": 566
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 104,
                  "top": 19,
                  "right": 526,
                  "bottom": 578
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        }
      }
    },
    "operationTable": {
      "assetId": "operation-table",
      "runtimeId": "operationTable",
      "name": "Operation Table",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 8,
          "revisions": {
            "1": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 63,
                  "top": 23,
                  "right": 578,
                  "bottom": 313
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 38,
                  "top": 97,
                  "right": 281,
                  "bottom": 565
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 62,
                  "top": 24,
                  "right": 577,
                  "bottom": 313
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 38,
                  "top": 97,
                  "right": 281,
                  "bottom": 566
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "4": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "5": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 5,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-5/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "6": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 6,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/down.png",
                "right": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/right.png",
                "up": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/up.png",
                "left": "tools/camp_asset_studio/library/assets/operation-table/tier-1/revision-6/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            },
            "8": {
              "assetId": "operation-table",
              "runtimeId": "operationTable",
              "name": "Operation Table",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 8,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/down.png",
                "right": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/right.png",
                "up": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/up.png",
                "left": "img/Buildings/Camp Runtime/operation-table/tier-1/revision-8/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 15,
                  "right": 580,
                  "bottom": 306
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 15,
                  "right": 579,
                  "bottom": 306
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 81,
                  "right": 284,
                  "bottom": 564
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 1,
                        "y": 1
                      },
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 2
                  }
                ]
              }
            }
          }
        }
      }
    },
    "pawsonry": {
      "assetId": "pawsonry",
      "runtimeId": "pawsonry",
      "name": "Pawsonry",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 4,
          "revisions": {
            "3": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 3,
              "height": 3,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/down.png",
                "right": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/right.png",
                "up": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/up.png",
                "left": "tools/camp_asset_studio/library/assets/pawsonry/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 65,
                  "right": 524,
                  "bottom": 529
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 71,
                  "top": 76,
                  "right": 535,
                  "bottom": 524
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 76,
                  "top": 71,
                  "right": 524,
                  "bottom": 535
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 600,
                  "left": 65,
                  "top": 76,
                  "right": 529,
                  "bottom": 524
                }
              }
            },
            "4": {
              "assetId": "pawsonry",
              "runtimeId": "pawsonry",
              "name": "Pawsonry",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 4,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/down.png",
                "right": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/right.png",
                "up": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/up.png",
                "left": "img/Buildings/Camp Runtime/pawsonry/tier-1/revision-4/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 77,
                  "top": 153,
                  "right": 596,
                  "bottom": 507
                },
                "right": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 35,
                  "top": 126,
                  "right": 481,
                  "bottom": 542
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 179,
                  "right": 559,
                  "bottom": 605
                },
                "left": {
                  "canvasWidth": 640,
                  "canvasHeight": 640,
                  "left": 142,
                  "top": 121,
                  "right": 600,
                  "bottom": 593
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 2
                      },
                      {
                        "x": 1,
                        "y": 2
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "junkPebblePile": {
      "assetId": "junk-pebble-pile",
      "runtimeId": "junkPebblePile",
      "name": "Pile of Pebbles",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-pebble-pile",
              "runtimeId": "junkPebblePile",
              "name": "Pile of Pebbles",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Pebble Pile_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 10,
                  "top": 11,
                  "right": 246,
                  "bottom": 245
                }
              },
              "gameplay": {
                "clearDurationSeconds": 600,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "junkStoneBlockPile": {
      "assetId": "junk-stone-block-pile",
      "runtimeId": "junkStoneBlockPile",
      "name": "Pile of Stone Blocks",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-stone-block-pile",
              "runtimeId": "junkStoneBlockPile",
              "name": "Pile of Stone Blocks",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 2,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Stone Block Pile_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 512,
                  "left": 24,
                  "top": 20,
                  "right": 488,
                  "bottom": 491
                }
              },
              "gameplay": {
                "clearDurationSeconds": 4800,
                "minCatLevel": 5,
                "requiredCats": 2
              }
            }
          }
        }
      }
    },
    "sawmill": {
      "assetId": "sawmill",
      "runtimeId": "sawmill",
      "name": "Sawmill",
      "category": "production-building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 3,
          "revisions": {
            "2": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-1/revision-2/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 82,
                  "top": 49,
                  "right": 525,
                  "bottom": 331
                },
                "right": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 69,
                  "top": 82,
                  "right": 351,
                  "bottom": 525
                },
                "up": {
                  "canvasWidth": 600,
                  "canvasHeight": 400,
                  "left": 75,
                  "top": 69,
                  "right": 518,
                  "bottom": 351
                },
                "left": {
                  "canvasWidth": 400,
                  "canvasHeight": 600,
                  "left": 49,
                  "top": 75,
                  "right": 331,
                  "bottom": 518
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            },
            "3": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/down.png",
                "right": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/right.png",
                "up": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/up.png",
                "left": "img/Buildings/Camp Runtime/sawmill/tier-1/revision-3/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 63,
                  "top": 11,
                  "right": 578,
                  "bottom": 302
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 48,
                  "top": 105,
                  "right": 270,
                  "bottom": 569
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 62,
                  "top": 50,
                  "right": 577,
                  "bottom": 301
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 49,
                  "top": 70,
                  "right": 271,
                  "bottom": 569
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        },
        "2": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "sawmill",
              "runtimeId": "sawmill",
              "name": "Sawmill",
              "category": "production-building",
              "placeable": true,
              "tier": 2,
              "revision": 1,
              "status": "approved",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/sawmill/tier-2/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 61,
                  "top": 0,
                  "right": 580,
                  "bottom": 310
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 46,
                  "top": 23,
                  "right": 266,
                  "bottom": 579
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 60,
                  "top": 1,
                  "right": 579,
                  "bottom": 310
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 53,
                  "top": 97,
                  "right": 272,
                  "bottom": 579
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "any-cell-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      },
                      {
                        "x": 1,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "smallCatStatue": {
      "assetId": "small-cat-statue",
      "runtimeId": "smallCatStatue",
      "name": "Small cat statue",
      "category": "decoration",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": null,
          "revisions": {
            "1": {
              "assetId": "small-cat-statue",
              "runtimeId": "smallCatStatue",
              "name": "Small cat statue",
              "category": "decoration",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/down.png",
                "right": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/right.png",
                "up": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/up.png",
                "left": "tools/camp_asset_studio/library/assets/small-cat-statue/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 102,
                  "top": 70,
                  "right": 334,
                  "bottom": 395
                },
                "right": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 96,
                  "top": 19,
                  "right": 348,
                  "bottom": 395
                },
                "up": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 88,
                  "top": 28,
                  "right": 325,
                  "bottom": 395
                },
                "left": {
                  "canvasWidth": 420,
                  "canvasHeight": 420,
                  "left": 71,
                  "top": 51,
                  "right": 319,
                  "bottom": 395
                }
              }
            }
          }
        }
      }
    },
    "storage": {
      "assetId": "small-storage-shed",
      "runtimeId": "storage",
      "name": "Small Storage Shed",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "small-storage-shed",
              "runtimeId": "storage",
              "name": "Small Storage Shed",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/small-storage-shed/tier-1/revision-1/left.png"
              },
              "stickerCategory": "storage",
              "stickerSlot": {
                "id": "front-surface",
                "enabled": true,
                "mode": "surface",
                "category": "storage",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.3
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 1.5,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "storage-stacked-boxes",
                "defaultColorId": "kraft"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 30,
                  "top": 6,
                  "right": 331,
                  "bottom": 339
                },
                "right": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 30,
                  "top": 0,
                  "right": 321,
                  "bottom": 353
                },
                "up": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 33,
                  "top": 0,
                  "right": 326,
                  "bottom": 352
                },
                "left": {
                  "canvasWidth": 360,
                  "canvasHeight": 360,
                  "left": 39,
                  "top": 0,
                  "right": 329,
                  "bottom": 354
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "south",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": 0,
                        "y": 1
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "junkTallGrass": {
      "assetId": "junk-tall-grass",
      "runtimeId": "junkTallGrass",
      "name": "Tall Green Grass",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-tall-grass",
              "runtimeId": "junkTallGrass",
              "name": "Tall Green Grass",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                }
              },
              "gameplay": {
                "clearDurationSeconds": 360,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            },
            "2": {
              "assetId": "junk-tall-grass",
              "runtimeId": "junkTallGrass",
              "name": "Tall Green Grass",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 2,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                }
              },
              "gameplay": {
                "clearDurationSeconds": 360,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            },
            "3": {
              "assetId": "junk-tall-grass",
              "runtimeId": "junkTallGrass",
              "name": "Tall Green Grass",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 3,
              "status": "retired",
              "width": 1,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Tall Grass_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "right": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "up": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                },
                "left": {
                  "canvasWidth": 256,
                  "canvasHeight": 256,
                  "left": 11,
                  "top": 10,
                  "right": 245,
                  "bottom": 246
                }
              },
              "gameplay": {
                "clearDurationSeconds": 360,
                "minCatLevel": 0,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "junkThornBush": {
      "assetId": "junk-thorn-bush",
      "runtimeId": "junkThornBush",
      "name": "Thorny Bramble Bush",
      "category": "junk",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "junk-thorn-bush",
              "runtimeId": "junkThornBush",
              "name": "Thorny Bramble Bush",
              "category": "junk",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "right": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "up": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png",
                "left": "img/Maps/Camp Runtime/Obstacles/Thorn Bush_Camp_Obstacle_Watercolor_Game_v1.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                },
                "right": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                },
                "up": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                },
                "left": {
                  "canvasWidth": 512,
                  "canvasHeight": 256,
                  "left": 20,
                  "top": 30,
                  "right": 491,
                  "bottom": 225
                }
              },
              "gameplay": {
                "clearDurationSeconds": 2400,
                "minCatLevel": 4,
                "requiredCats": 1
              }
            }
          }
        }
      }
    },
    "trainingCenter": {
      "assetId": "training-center",
      "runtimeId": "trainingCenter",
      "name": "Training Center",
      "category": "building",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "training-center",
              "runtimeId": "trainingCenter",
              "name": "Training Center",
              "category": "building",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 3,
              "height": 4,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/training-center/tier-1/revision-1/left.png"
              },
              "stickerCategory": "jobs",
              "stickerSlot": {
                "id": "jobs-emblem",
                "enabled": true,
                "mode": "surface",
                "category": "jobs",
                "anchors": {
                  "down": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.43
                    }
                  },
                  "right": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.6,
                      "y": 0.5
                    }
                  },
                  "up": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.5,
                      "y": 0.57
                    }
                  },
                  "left": {
                    "auto": "surface",
                    "surface": {
                      "x": 0.4,
                      "y": 0.5
                    }
                  }
                },
                "anchorReview": true,
                "required": true,
                "baseSticker": true,
                "defaultScale": 0.8,
                "defaultAnchorChoice": "auto",
                "defaultStickerId": "jobs-briefcase-paw",
                "defaultColorId": "sky-blue"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 450,
                  "canvasHeight": 600,
                  "left": 60,
                  "top": 38,
                  "right": 390,
                  "bottom": 536
                },
                "right": {
                  "canvasWidth": 600,
                  "canvasHeight": 450,
                  "left": 64,
                  "top": 60,
                  "right": 562,
                  "bottom": 390
                },
                "up": {
                  "canvasWidth": 450,
                  "canvasHeight": 600,
                  "left": 60,
                  "top": 64,
                  "right": 390,
                  "bottom": 562
                },
                "left": {
                  "canvasWidth": 600,
                  "canvasHeight": 450,
                  "left": 38,
                  "top": 60,
                  "right": 536,
                  "bottom": 390
                }
              }
            }
          }
        }
      }
    },
    "woodCathouse": {
      "assetId": "wood-cathouse",
      "runtimeId": "woodCathouse",
      "name": "Wood Cathouse",
      "category": "house",
      "placeable": true,
      "tiers": {
        "1": {
          "liveRevision": 1,
          "revisions": {
            "1": {
              "assetId": "wood-cathouse",
              "runtimeId": "woodCathouse",
              "name": "Wood Cathouse",
              "category": "house",
              "placeable": true,
              "tier": 1,
              "revision": 1,
              "status": "live",
              "width": 2,
              "height": 1,
              "sprites": {
                "down": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/down.png",
                "right": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/right.png",
                "up": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/up.png",
                "left": "img/Buildings/Camp Runtime/wood-cathouse/tier-1/revision-1/left.png"
              },
              "spriteBounds": {
                "down": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 588,
                  "bottom": 313
                },
                "right": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 313,
                  "bottom": 572
                },
                "up": {
                  "canvasWidth": 640,
                  "canvasHeight": 320,
                  "left": 52,
                  "top": 22,
                  "right": 587,
                  "bottom": 312
                },
                "left": {
                  "canvasWidth": 320,
                  "canvasHeight": 640,
                  "left": 6,
                  "top": 33,
                  "right": 314,
                  "bottom": 567
                }
              },
              "access": {
                "activationPolicy": "all-ports-reachable",
                "ports": [
                  {
                    "id": "access-1",
                    "side": "west",
                    "cellPolicy": "all-cells-reachable",
                    "approachCells": [
                      {
                        "x": -1,
                        "y": 0
                      }
                    ],
                    "minimumReachableCells": 1
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
});
})(typeof window !== "undefined" ? window : globalThis);
