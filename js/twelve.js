/*!
 * This is an adaptation of Gabriele Cirulli's 2048:
 * http://gabrielecirulli.github.io/2048/
 *
 * You can get the sources of the adapted files here:
 * http://2048-variations.net/js/src/index.html
 *
 * Adapted and compacted by Matthieu Benéteau
 */
Function.prototype.bind = Function.prototype.bind || function(b) {
    var c = this;
    return function(a) {
        a instanceof Array || (a = [a]);
        c.apply(b, a)
    }
};
(function() {
    function c(a) {
        this.el = a;
        for (var a = a.className.replace(/^\s+|\s+$/g, "").split(/\s+/), b = 0; b < a.length; b++)
            e.call(this, a[b])
    }
    if (!(typeof window.Element === "undefined" || "classList" in document.documentElement)) {
        var d = Array.prototype,
            e = d.push,
            f = d.splice,
            g = d.join;
        c.prototype = {
            add: function(a) {
                if (!this.contains(a))
                    e.call(this, a), this.el.className = this.toString()
            },
            contains: function(a) {
                return this.el.className.indexOf(a) != -1
            },
            item: function(a) {
                return this[a] || null
            },
            remove: function(a) {
                if (this.contains(a)) {
                    for (var b =
                    0; b < this.length; b++)
                        if (this[b] == a)
                            break;
                    f.call(this, b, 1);
                    this.el.className = this.toString()
                }
            },
            toString: function() {
                return g.call(this, " ")
            },
            toggle: function(a) {
                this.contains(a) ? this.remove(a) : this.add(a);
                return this.contains(a)
            }
        };
        window.DOMTokenList = c;
        (function(a, b, c) {
            Object.defineProperty ? Object.defineProperty(a, b, {
                get: c
            }) : a.__defineGetter__(b, c)
        })(HTMLElement.prototype, "classList", function() {
            return new c(this)
        })
    }
})();
(function() {
    for (var d = 0, a = ["webkit", "moz"], b = 0; b < a.length && !window.requestAnimationFrame; ++b)
        window.requestAnimationFrame = window[a[b] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[a[b] + "CancelAnimationFrame"] || window[a[b] + "CancelRequestAnimationFrame"];
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(b) {
            var a = (new Date).getTime(),
                c = Math.max(0, 16 - (a - d)),
                e = window.setTimeout(function() {
                    b(a + c)
                }, c);
            d = a + c;
            return e
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame =
        function(a) {
            clearTimeout(a)
        }
})();
function KeyboardInputManager() {
    this.events = {};
    window.navigator.msPointerEnabled ? (this.eventTouchstart = "MSPointerDown", this.eventTouchmove = "MSPointerMove", this.eventTouchend = "MSPointerUp") : (this.eventTouchstart = "touchstart", this.eventTouchmove = "touchmove", this.eventTouchend = "touchend");
    this.listen()
}
KeyboardInputManager.prototype.on = function(b, c) {
    this.events[b] || (this.events[b] = []);
    this.events[b].push(c)
};
KeyboardInputManager.prototype.emit = function(b, c) {
    var d = this.events[b];
    d && d.forEach(function(b) {
        b(c)
    })
};
KeyboardInputManager.prototype.listen = function() {
    var b = this,
        c = {
            38: 0,
            39: 1,
            40: 2,
            37: 3,
            75: 0,
            76: 1,
            74: 2,
            72: 3,
            87: 0,
            68: 1,
            83: 2,
            65: 3
        };
    document.addEventListener("keydown", function(a) {
        var d = a.altKey || a.ctrlKey || a.metaKey || a.shiftKey,
            e = c[a.which];
        !d && e !== void 0 && (a.preventDefault(), b.emit("move", e));
        !d && a.which === 82 && b.restart.call(b, a)
    });
    this.bindButtonPress(".retry-button", this.restart);
    this.bindButtonPress(".restart-button", this.restart);
    this.bindButtonPress(".keep-playing-button", this.keepPlaying);
    var d,
        g,
        f = document.getElementsByClassName("game-container")[0];
    f.addEventListener(this.eventTouchstart, function(a) {
        if (!(!window.navigator.msPointerEnabled && a.touches.length > 1 || a.targetTouches > 1))
            window.navigator.msPointerEnabled ? (d = a.pageX, g = a.pageY) : (d = a.touches[0].clientX, g = a.touches[0].clientY), a.preventDefault()
    });
    f.addEventListener(this.eventTouchmove, function(a) {
        a.preventDefault()
    });
    f.addEventListener(this.eventTouchend, function(a) {
        if (!(!window.navigator.msPointerEnabled && a.touches.length > 0 || a.targetTouches >
        0)) {
            var c,
                e;
            window.navigator.msPointerEnabled ? (c = a.pageX, e = a.pageY) : (c = a.changedTouches[0].clientX, e = a.changedTouches[0].clientY);
            c -= d;
            a = Math.abs(c);
            e -= g;
            var f = Math.abs(e);
            Math.max(a, f) > 10 && b.emit("move", a > f ? c > 0 ? 1 : 3 : e > 0 ? 2 : 0)
        }
    })
};
KeyboardInputManager.prototype.restart = function(b) {
    b.preventDefault();
    this.emit("restart")
};
KeyboardInputManager.prototype.keepPlaying = function(b) {
    b.preventDefault();
    this.emit("keepPlaying")
};
KeyboardInputManager.prototype.bindButtonPress = function(b, c) {
    var d = document.querySelector(b);
    d.addEventListener("click", c.bind(this));
    d.addEventListener(this.eventTouchend, c.bind(this))
};
originalValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432 67108864];
kspotValues = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
twelveValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
lambdaValues = ["\u0391", "\u0392", "\u0393", "\u0394", "\u0395", "\u0396", "\u0397", "\u0398", "\u0399", "\u039a", "\u039b", "\u039c", "\u039d", "\u039e", "\u039f"];
juichiValues = ["\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u5341\u4e00", "\u5341\u4e8c", "\u5341\u4e09", "\u5341\u56db", "\u5341\u4e94"];
smileysValues = ["\ud83d\ude36", "\ud83d\ude2e", "\ud83d\ude2f", "\ud83d\ude15", "\ud83d\ude10", "\ud83d\ude09", "\ud83d\ude0a", "\ud83d\ude01", "\ud83d\ude04", "\ud83d\ude1c", "\ud83d\ude0e", "\ud83d\ude0d", "\ud83d\ude1d", "\ud83d\ude07", "\ud83d\ude08"];
clocksValues = ["\ud83d\udd50", "\ud83d\udd51", "\ud83d\udd52", "\ud83d\udd53", "\ud83d\udd54", "\ud83d\udd55", "\ud83d\udd56", "\ud83d\udd57", "\ud83d\udd58", "\ud83d\udd59", "\ud83d\udd5a", "\ud83d\udd5b", "\ud83d\udd5c", "\ud83d\udd5d", "\ud83d\udd5e"];
zodiacValues = ["\u2648", "\u2649", "\u264a", "\u264b", "\u264c", "\u264d", "\u264e", "\u264f", "\u2650", "\u2651", "\u2652", "\u2653", "\u2653\u2648", "\u2653\u2649", "\u2653\u264a"];
brailleValues = ["\u2801", "\u2803", "\u2809", "\u2819", "\u2811", "\u280b", "\u281b", "\u2813", "\u280a", "\u281a", "\u2805", "\u2807", "\u280d", "\u281d", "\u2815"];
HTMLValues = originalValues;
HTMLMsgWin = "You win!";
HTMLMsgOver = "Game over!";
function HTMLGetDisplay(a) {
    a = originalValues.indexOf(a);
    return a > -1 ? HTMLValues[a] : ""
}
function HTMLActuator() {
    this.tileContainer = document.querySelector(".tile-container");
    this.scoreContainer = document.querySelector(".score-container");
    this.bestContainer = document.querySelector(".best-container");
    this.messageContainer = document.querySelector(".game-message");
    this.score = 0
}
HTMLActuator.prototype.actuate = function(a, b) {
    var c = this;
    window.requestAnimationFrame(function() {
        c.clearContainer(c.tileContainer);
        a.cells.forEach(function(a) {
            a.forEach(function(a) {
                a && c.addTile(a)
            })
        });
        c.updateScore(b.score);
        c.updateBestScore(b.bestScore);
        b.terminated && (b.over ? c.message(!1) : b.won && c.message(!0))
    })
};
HTMLActuator.prototype.continueGame = function() {
    this.clearMessage()
};
HTMLActuator.prototype.clearContainer = function(a) {
    for (; a.firstChild;)
        a.removeChild(a.firstChild)
};
HTMLActuator.prototype.addTile = function(a) {
    var b = this,
        c = document.createElement("div"),
        e = document.createElement("div"),
        f = this.positionClass(a.previousPosition || {
            x: a.x,
            y: a.y
        }),
        d = ["tile", "tile-" + a.value, f];
    a.value >= 128 && this.messageContainer.classList.add("gspot");
    a.value > 2048 && d.push("tile-super");
    this.applyClasses(c, d);
    e.classList.add("tile-inner");
    e.textContent = HTMLGetDisplay(a.value);
    a.previousPosition ? window.requestAnimationFrame(function() {
        d[2] = b.positionClass({
            x: a.x,
            y: a.y
        });
        b.applyClasses(c, d)
    }) :
    a.mergedFrom ? (d.push("tile-merged"), this.applyClasses(c, d), a.mergedFrom.forEach(function(a) {
        b.addTile(a)
    })) : (d.push("tile-new"), this.applyClasses(c, d));
    c.appendChild(e);
    this.tileContainer.appendChild(c)
};
HTMLActuator.prototype.applyClasses = function(a, b) {
    a.setAttribute("class", b.join(" "))
};
HTMLActuator.prototype.normalizePosition = function(a) {
    return {
        x: a.x + 1,
        y: a.y + 1
    }
};
HTMLActuator.prototype.positionClass = function(a) {
    a = this.normalizePosition(a);
    return "tile-position-" + a.x + "-" + a.y
};
HTMLActuator.prototype.updateScore = function(a) {
    this.clearContainer(this.scoreContainer);
    var b = a - this.score;
    this.score = a;
    this.scoreContainer.textContent = this.score;
    if (b > 0)
        a = document.createElement("div"), a.classList.add("score-addition"), a.textContent = "+" + b, this.scoreContainer.appendChild(a)
};
HTMLActuator.prototype.updateBestScore = function(a) {
    this.bestContainer.textContent = a
};
HTMLActuator.prototype.message = function(a) {
    var b = a ? HTMLMsgWin : HTMLMsgOver;
    this.messageContainer.classList.add(a ? "game-won" : "game-over");
    this.messageContainer.getElementsByTagName("p")[0].textContent = b
};
HTMLActuator.prototype.clearMessage = function() {
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
    this.messageContainer.classList.remove("gspot")
};
function Grid(a, b) {
    this.size = a;
    this.cells = b ? this.fromState(b) : this.empty()
}
Grid.prototype.empty = function() {
    for (var a = [], b = 0; b < this.size; b++)
        for (var c = a[b] = [], d = 0; d < this.size; d++)
            c.push(null);
    return a
};
Grid.prototype.fromState = function(a) {
    for (var b = [], c = 0; c < this.size; c++)
        for (var d = b[c] = [], e = 0; e < this.size; e++) {
            var f = a[c][e];
            d.push(f ? new Tile(f.position, f.value) : null)
        }
    return b
};
Grid.prototype.randomAvailableCell = function() {
    var a = this.availableCells();
    if (a.length)
        return a[Math.floor(Math.random() * a.length)]
};
Grid.prototype.availableCells = function() {
    var a = [];
    this.eachCell(function(b, c, d) {
        d || a.push({
            x: b,
            y: c
        })
    });
    return a
};
Grid.prototype.eachCell = function(a) {
    for (var b = 0; b < this.size; b++)
        for (var c = 0; c < this.size; c++)
            a(b, c, this.cells[b][c])
};
Grid.prototype.cellsAvailable = function() {
    return !!this.availableCells().length
};
Grid.prototype.cellAvailable = function(a) {
    return !this.cellOccupied(a)
};
Grid.prototype.cellOccupied = function(a) {
    return !!this.cellContent(a)
};
Grid.prototype.cellContent = function(a) {
    return this.withinBounds(a) ? this.cells[a.x][a.y] : null
};
Grid.prototype.insertTile = function(a) {
    this.cells[a.x][a.y] = a
};
Grid.prototype.removeTile = function(a) {
    this.cells[a.x][a.y] = null
};
Grid.prototype.withinBounds = function(a) {
    return a.x >= 0 && a.x < this.size && a.y >= 0 && a.y < this.size
};
Grid.prototype.serialize = function() {
    for (var a = [], b = 0; b < this.size; b++)
        for (var c = a[b] = [], d = 0; d < this.size; d++)
            c.push(this.cells[b][d] ? this.cells[b][d].serialize() : null);
    return {
        size: this.size,
        cells: a
    }
};
function Tile(a, b) {
    this.x = a.x;
    this.y = a.y;
    this.value = b || 2;
    this.mergedFrom = this.previousPosition = null
}
Tile.prototype.savePosition = function() {
    this.previousPosition = {
        x: this.x,
        y: this.y
    }
};
Tile.prototype.updatePosition = function(a) {
    this.x = a.x;
    this.y = a.y
};
Tile.prototype.serialize = function() {
    return {
        position: {
            x: this.x,
            y: this.y
        },
        value: this.value
    }
};
window.fakeStorage = {
    _data: {},
    setItem: function(a, b) {
        return this._data[a] = String(b)
    },
    getItem: function(a) {
        return this._data.hasOwnProperty(a) ? this._data[a] : void 0
    },
    removeItem: function(a) {
        return delete this._data[a]
    },
    clear: function() {
        return this._data = {}
    }
};
function LocalStorageManager() {
    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState";
    this.storage = this.localStorageSupported() ? window.localStorage : window.fakeStorage
}
LocalStorageManager.prototype.localStorageSupported = function() {
    var a = window.localStorage;
    try {
        return a.setItem("test", "1"), a.removeItem("test"), !0
    } catch (b) {
        return !1
    }
};
LocalStorageManager.prototype.getBestScore = function() {
    return this.storage.getItem(this.bestScoreKey) || 0
};
LocalStorageManager.prototype.setBestScore = function(a) {
    this.storage.setItem(this.bestScoreKey, a)
};
LocalStorageManager.prototype.getGameState = function() {
    var a = this.storage.getItem(this.gameStateKey);
    return a ? JSON.parse(a) : null
};
LocalStorageManager.prototype.setGameState = function(a) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(a))
};
LocalStorageManager.prototype.clearGameState = function() {
    this.storage.removeItem(this.gameStateKey)
};
function GameManager(a, b, c, d) {
    this.size = a;
    this.inputManager = new b;
    this.storageManager = new d;
    this.actuator = new c;
    this.startTiles = 2;
    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
    this.setup()
}
GameManager.prototype.restart = function() {
    this.storageManager.clearGameState();
    this.actuator.continueGame();
    this.setup()
};
GameManager.prototype.keepPlaying = function() {
    this.keepPlaying = !0;
    this.actuator.continueGame()
};
GameManager.prototype.isGameTerminated = function() {
    return this.over || this.won && !this.keepPlaying ? !0 : !1
};
GameManager.prototype.setup = function() {
    var a = this.storageManager.getGameState();
    a ? (this.grid = new Grid(a.grid.size, a.grid.cells), this.score = a.score, this.over = a.over, this.won = a.won, this.keepPlaying = a.keepPlaying) : (this.grid = new Grid(this.size), this.score = 0, this.keepPlaying = this.won = this.over = !1, this.addStartTiles());
    this.actuate()
};
GameManager.prototype.addStartTiles = function() {
    for (var a = 0; a < this.startTiles; a++)
        this.addRandomTile()
};
GameManager.prototype.addRandomTile = function() {
    if (this.grid.cellsAvailable()) {
        var a = Math.random() < 0.9 ? 2 : 4;
        this.grid.insertTile(new Tile(this.grid.randomAvailableCell(), a))
    }
};
GameManager.prototype.actuate = function() {
    this.storageManager.getBestScore() < this.score && this.storageManager.setBestScore(this.score);
    this.over ? this.storageManager.clearGameState() : this.storageManager.setGameState(this.serialize());
    this.actuator.actuate(this.grid, {
        score: this.score,
        over: this.over,
        won: this.won,
        bestScore: this.storageManager.getBestScore(),
        terminated: this.isGameTerminated()
    })
};
GameManager.prototype.serialize = function() {
    return {
        grid: this.grid.serialize(),
        score: this.score,
        over: this.over,
        won: this.won,
        keepPlaying: this.keepPlaying
    }
};
GameManager.prototype.prepareTiles = function() {
    this.grid.eachCell(function(a, b, c) {
        if (c)
            c.mergedFrom = null, c.savePosition()
    })
};
GameManager.prototype.moveTile = function(a, b) {
    this.grid.cells[a.x][a.y] = null;
    this.grid.cells[b.x][b.y] = a;
    a.updatePosition(b)
};
GameManager.prototype.move = function(a) {
    var b = this;
    if (!this.isGameTerminated()) {
        var c,
            d,
            e = this.getVector(a),
            i = this.buildTraversals(e),
            j = !1;
        this.prepareTiles();
        i.x.forEach(function(a) {
            i.y.forEach(function(f) {
                c = {
                    x: a,
                    y: f
                };
                if (d = b.grid.cellContent(c)) {
                    var f = b.findFarthestPosition(c, e),
                        g = b.grid.cellContent(f.next);
                    if (g && g.value === d.value && !g.mergedFrom) {
                        var h = new Tile(f.next, d.value * 2);
                        h.mergedFrom = [d, g];
                        b.grid.insertTile(h);
                        b.grid.removeTile(d);
                        d.updatePosition(f.next);
                        b.score += h.value;
                        if (h.value === 2048)
                            b.won =
                            !0
                    } else
                        b.moveTile(d, f.farthest);
                    b.positionsEqual(c, d) || (j = !0)
                }
            })
        });
        if (j) {
            this.addRandomTile();
            if (!this.movesAvailable())
                this.over = !0;
            this.actuate()
        }
    }
};
GameManager.prototype.getVector = function(a) {
    return {
        0: {
            x: 0,
            y: -1
        },
        1: {
            x: 1,
            y: 0
        },
        2: {
            x: 0,
            y: 1
        },
        3: {
            x: -1,
            y: 0
        }
    }[a]
};
GameManager.prototype.buildTraversals = function(a) {
    for (var b = {
            x: [],
            y: []
        }, c = 0; c < this.size; c++)
        b.x.push(c), b.y.push(c);
    if (a.x === 1)
        b.x = b.x.reverse();
    if (a.y === 1)
        b.y = b.y.reverse();
    return b
};
GameManager.prototype.findFarthestPosition = function(a, b) {
    var c;
    do c = a, a = {
        x: c.x + b.x,
        y: c.y + b.y
    };
    while (this.grid.withinBounds(a) && this.grid.cellAvailable(a));
    return {
        farthest: c,
        next: a
    }
};
GameManager.prototype.movesAvailable = function() {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable()
};
GameManager.prototype.tileMatchesAvailable = function() {
    for (var a, b = 0; b < this.size; b++)
        for (var c = 0; c < this.size; c++)
            if (a = this.grid.cellContent({
                x: b,
                y: c
            }))
                for (var d = 0; d < 4; d++) {
                    var e = this.getVector(d);
                    if ((e = this.grid.cellContent({
                        x: b + e.x,
                        y: c + e.y
                    })) && e.value === a.value)
                        return !0
                }
    return !1
};
GameManager.prototype.positionsEqual = function(a, b) {
    return a.x === b.x && a.y === b.y
};
window.requestAnimationFrame(function() {
    new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager)
});

