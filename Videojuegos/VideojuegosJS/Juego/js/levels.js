/*
 * String variables with the layout of the levels
 * https://eloquentjavascript.net/16_game.html
 *
 * Gilberto Echeverria
 * 2025-01-22
 */

"use strict";

let GAME_LEVELS = {
main: `
*&&&&&&&&&&&123&&&&&&&&&&&:
#.........................#
#.........................#
#..................C......#
#..................C......#
#..................C......#
<.......@.................7
=.........................8
>.........................9
#.........................#
#.........................#
#.........................#
#.........................#
#.........................#
/&&&&&&&&&&&456&&&&&&&&&&&$
`,
robotRoom: `
*&&&&&&&&&&&&&&&&&&&&&&&&&:
#.........................#
#.........................#
#.....R...................#
#.........................#
#....R....................#
#.........................<
#.........................=
#.........................>
#.....R...................#
#.........................#
#.....R...................#
#.........................#
#.........................#
/&&&&&&&&&&&&&&&&&&&&&&&&&$
`,
dronRoom: `
*&&&&&&&&&&&456&&&&&&&&&&&:
#.........................#
#.........................#
#.....D...................#
#.........................#
#....R....................#
#.........................#
#.........................#
#.........................#
#.....D...................#
#.........................#
#.....D...................#
#.........................#
#.........................#
/&&&&&&&&&&&&&&&&&&&&&&&&&$
`,
puzzleRoom: `
*&&&&&&&&&&&&&&&&&&&&&&&&&:
#.........................#
#.........................#
#.....................R...#
#.........................#
#.........................#
7......................R..#
8.....................p...#
9.........................#
#......................D..#
#.........................#
#......................D..#
#.........................#
#.........................#
/&&&&&&&&&&&&&&&&&&&&&&&&&$
`,
};

if (typeof module != "undefined" && module.exports && (typeof window == "undefined" || window.exports != exports))
  module.exports = GAME_LEVELS;
if (typeof global != "undefined" && !global.GAME_LEVELS)
  global.GAME_LEVELS = GAME_LEVELS;
