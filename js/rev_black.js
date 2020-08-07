function KeyboardInputManager() {
    this.events = {};
    if (window.navigator.msPointerEnabled) {
        this.eventTouchstart = "MSPointerDown";
        this.eventTouchmove = "MSPointerMove";
        this.eventTouchend = "MSPointerUp"
    } else {
        this.eventTouchstart = "touchstart";
        this.eventTouchmove = "touchmove";
        this.eventTouchend = "touchend"
    }
    this.listen()
}
function HTMLActuator() {
    this.tileContainer = document.querySelector(".tile-container");
    this.scoreContainer = document.querySelector(".score-container");
    this.bestContainer = document.querySelector(".best-container");
    this.messageContainer = document.querySelector(".game-message");
    this.sharingContainer = document.querySelector(".score-sharing");
    this.score = 0
}
function Grid(e, t) {
    this.size = e;
    this.cells = t ? this.fromState(t) : this.empty()
}
function Tile(e, t) {
    this.x = e.x;
    this.y = e.y;
    this.value = t || 2;
    this.previousPosition = null;
    this.mergedFrom = null
}
function LocalStorageManager() {
    this.bestScoreKey = "bestScore";
    this.gameStateKey = "gameState";
    this.notice1ClosedKey = "notice1Closed";
    var e = this.localStorageSupported();
    this.storage = e ? window.localStorage : window.fakeStorage
}
function GameManager(e, t, n, r) {
    this.size = e;
    this.inputManager = new t;
    this.storageManager = new r;
    this.actuator = new n;
    this.startTiles = 2;
    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
    this.setup()
}
Function.prototype.bind = Function.prototype.bind || function(e) {
    var t = this;
    return function(n) {
        if (!(n instanceof Array)) {
            n = [n]
        }
        t.apply(e, n)
    }
};
(function() {
    function i(e) {
        this.el = e;
        var n = e.className.replace(/^\s+|\s+$/g, "").split(/\s+/);
        for (var r = 0; r < n.length; r++) {
            t.call(this, n[r])
        }
    }
    function s(e, t, n) {
        if (Object.defineProperty) {
            Object.defineProperty(e, t, {
                get: n
            })
        } else {
            e.__defineGetter__(t, n)
        }
    }
    if (typeof window.Element === "undefined" || "classList" in document.documentElement) {
        return
    }
    var e = Array.prototype,
        t = e.push,
        n = e.splice,
        r = e.join;
    i.prototype = {
        add: function(e) {
            if (this.contains(e))
                return;
            t.call(this, e);
            this.el.className = this.toString()
        },
        contains: function(e) {
            return this.el.className.indexOf(e) != -1
        },
        item: function(e) {
            return this[e] || null
        },
        remove: function(e) {
            if (!this.contains(e))
                return;
            for (var t = 0; t < this.length; t++) {
                if (this[t] == e)
                    break
            }
            n.call(this, t, 1);
            this.el.className = this.toString()
        },
        toString: function() {
            return r.call(this, " ")
        },
        toggle: function(e) {
            if (!this.contains(e)) {
                this.add(e)
            } else {
                this.remove(e)
            }
            return this.contains(e)
        }
    };
    window.DOMTokenList = i;
    s(HTMLElement.prototype, "classList", function() {
        return new i(this)
    })
})();
(function() {
    var e = 0;
    var t = ["webkit", "moz"];
    for (var n = 0; n < t.length && !window.requestAnimationFrame; ++n) {
        window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"]
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(t) {
            var n = (new Date).getTime();
            var r = Math.max(0, 16 - (n - e));
            var i = window.setTimeout(function() {
                t(n + r)
            }, r);
            e = n + r;
            return i
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(e) {
            clearTimeout(e)
        }
    }
})();
KeyboardInputManager.prototype.on = function(e, t) {
    if (!this.events[e]) {
        this.events[e] = []
    }
    this.events[e].push(t)
};
KeyboardInputManager.prototype.emit = function(e, t) {
    var n = this.events[e];
    if (n) {
        n.forEach(function(e) {
            e(t)
        })
    }
};
KeyboardInputManager.prototype.listen = function() {
    var e = this;
    var t = {
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
    document.addEventListener("keydown", function(n) {
        var r = n.altKey || n.ctrlKey || n.metaKey || n.shiftKey;
        var i = t[n.which];
        if (!r) {
            if (i !== undefined) {
                n.preventDefault();
                e.emit("move", i)
            }
        }
        if (!r && n.which === 82) {
            e.restart.call(e, n)
        }
    });
    this.bindButtonPress(".retry-button", this.restart);
    this.bindButtonPress(".restart-button", this.restart);
    this.bindButtonPress(".keep-playing-button", this.keepPlaying);
    var n,
        r;
    var i = document.getElementsByClassName("game-container")[0];
    i.addEventListener(this.eventTouchstart, function(e) {
        if (!window.navigator.msPointerEnabled && e.touches.length > 1 || e.targetTouches > 1) {
            return
        }
        if (window.navigator.msPointerEnabled) {
            n = e.pageX;
            r = e.pageY
        } else {
            n = e.touches[0].clientX;
            r = e.touches[0].clientY
        }
        e.preventDefault()
    });
    i.addEventListener(this.eventTouchmove, function(e) {
        e.preventDefault()
    });
    i.addEventListener(this.eventTouchend, function(t) {
        if (!window.navigator.msPointerEnabled && t.touches.length > 0 || t.targetTouches > 0) {
            return
        }
        var i,
            s;
        if (window.navigator.msPointerEnabled) {
            i = t.pageX;
            s = t.pageY
        } else {
            i = t.changedTouches[0].clientX;
            s = t.changedTouches[0].clientY
        }
        var o = i - n;
        var u = Math.abs(o);
        var a = s - r;
        var f = Math.abs(a);
        if (Math.max(u, f) > 10) {
            e.emit("move", u > f ? o > 0 ? 1 : 3 : a > 0 ? 2 : 0)
        }
    })
};
KeyboardInputManager.prototype.restart = function(e) {
    e.preventDefault();
    this.emit("restart")
};
KeyboardInputManager.prototype.keepPlaying = function(e) {
    e.preventDefault();
    this.emit("keepPlaying")
};
KeyboardInputManager.prototype.bindButtonPress = function(e, t) {
    var n = document.querySelector(e);
    n.addEventListener("click", t.bind(this));
    n.addEventListener(this.eventTouchend, t.bind(this))
};
HTMLActuator.prototype.actuate = function(e, t) {
    var n = this;
    window.requestAnimationFrame(function() {
        n.clearContainer(n.tileContainer);
        e.cells.forEach(function(e) {
            e.forEach(function(e) {
                if (e) {
                    n.addTile(e)
                }
            })
        });
        n.updateScore(t.score);
        n.updateBestScore(t.bestScore);
        if (t.terminated) {
            if (t.over) {
                n.message(false)
            } else if (t.won) {
                n.message(true)
            }
        }
    })
};
HTMLActuator.prototype.continue = function() {
    if (typeof ga !== "undefined") {
        ga("send", "event", "game", "restart")
    }
    this.clearMessage()
};
HTMLActuator.prototype.clearContainer = function(e) {
    while (e.firstChild) {
        e.removeChild(e.firstChild)
    }
};
HTMLActuator.prototype.addTile = function(e) {
    var t = this;
    var n = document.createElement("div");
    var r = document.createElement("div");
    var i = e.previousPosition || {
        x: e.x,
        y: e.y
    };
    var s = this.positionClass(i);
    var o = ["tile", "tile-" + e.value, s];
    if (e.value > 1024)
        o.push("tile-super");
    this.applyClasses(n, o);
    r.classList.add("tile-inner");
    r.textContent = e.value;
    if (e.previousPosition) {
        window.requestAnimationFrame(function() {
            o[2] = t.positionClass({
                x: e.x,
                y: e.y
            });
            t.applyClasses(n, o)
        })
    } else if (e.mergedFrom) {
        o.push("tile-merged");
        this.applyClasses(n, o);
        e.mergedFrom.forEach(function(e) {
            t.addTile(e)
        })
    } else {
        o.push("tile-new");
        this.applyClasses(n, o)
    }
    n.appendChild(r);
    this.tileContainer.appendChild(n)
};
HTMLActuator.prototype.applyClasses = function(e, t) {
    e.setAttribute("class", t.join(" "))
};
HTMLActuator.prototype.normalizePosition = function(e) {
    return {
        x: e.x + 1,
        y: e.y + 1
    }
};
HTMLActuator.prototype.positionClass = function(e) {
    e = this.normalizePosition(e);
    return "tile-position-" + e.x + "-" + e.y
};
HTMLActuator.prototype.updateScore = function(e) {
    this.clearContainer(this.scoreContainer);
    var t = e - this.score;
    this.score = e;
    if (this.score < 1000) {
        this.scoreContainer.textContent = this.score;
    } else {
        this.scoreContainer.textContent = Math.round(this.score / 100) / 10 + "k";
    }
    if (t > 0) {
        var n = document.createElement("div");
        n.classList.add("score-addition");
        n.textContent = "+" + t;
        this.scoreContainer.appendChild(n)
    }
};
HTMLActuator.prototype.updateBestScore = function(e) {
    if (e < 1000) {
        this.bestContainer.textContent = e;
    } else {
        this.bestContainer.textContent = Math.round(e / 100) / 10 + "k";
    }
};
HTMLActuator.prototype.message = function(e) {
    var t = e ? "game-won" : "game-over";
    var n = e ? "You win!" : "Game over!";
    var r;
    if (typeof ga !== "undefined") {
        ga("send", "event", "game", "end", t, this.score)
    }
    this.messageContainer.classList.add(t);
    this.messageContainer.getElementsByTagName("p")[0].textContent = n;
    this.clearContainer(this.sharingContainer);
};
HTMLActuator.prototype.clearMessage = function() {
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over")
};
Grid.prototype.empty = function() {
    var e = [];
    for (var t = 0; t < this.size; t++) {
        var n = e[t] = [];
        for (var r = 0; r < this.size; r++) {
            n.push(null)
        }
    }
    return e
};
Grid.prototype.fromState = function(e) {
    var t = [];
    for (var n = 0; n < this.size; n++) {
        var r = t[n] = [];
        for (var i = 0; i < this.size; i++) {
            var s = e[n][i];
            r.push(s ? new Tile(s.position, s.value) : null)
        }
    }
    return t
};
Grid.prototype.randomAvailableCell = function() {
    var e = this.availableCells();
    if (e.length) {
        return e[Math.floor(Math.random() * e.length)]
    }
};
Grid.prototype.availableCells = function() {
    var e = [];
    this.eachCell(function(t, n, r) {
        if (!r) {
            e.push({
                x: t,
                y: n
            })
        }
    });
    return e
};
Grid.prototype.eachCell = function(e) {
    for (var t = 0; t < this.size; t++) {
        for (var n = 0; n < this.size; n++) {
            e(t, n, this.cells[t][n])
        }
    }
};
Grid.prototype.cellsAvailable = function() {
    return !!this.availableCells().length
};
Grid.prototype.cellAvailable = function(e) {
    return !this.cellOccupied(e)
};
Grid.prototype.cellOccupied = function(e) {
    return !!this.cellContent(e)
};
Grid.prototype.cellContent = function(e) {
    if (this.withinBounds(e)) {
        return this.cells[e.x][e.y]
    } else {
        return null
    }
};
Grid.prototype.insertTile = function(e) {
    this.cells[e.x][e.y] = e
};
Grid.prototype.removeTile = function(e) {
    this.cells[e.x][e.y] = null
};
Grid.prototype.withinBounds = function(e) {
    return e.x >= 0 && e.x < this.size && e.y >= 0 && e.y < this.size
};
Grid.prototype.serialize = function() {
    var e = [];
    for (var t = 0; t < this.size; t++) {
        var n = e[t] = [];
        for (var r = 0; r < this.size; r++) {
            n.push(this.cells[t][r] ? this.cells[t][r].serialize() : null)
        }
    }
    return {
        size: this.size,
        cells: e
    }
};
Tile.prototype.savePosition = function() {
    this.previousPosition = {
        x: this.x,
        y: this.y
    }
};
Tile.prototype.updatePosition = function(e) {
    this.x = e.x;
    this.y = e.y
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
    setItem: function(e, t) {
        return this._data[e] = String(t)
    },
    getItem: function(e) {
        return this._data.hasOwnProperty(e) ? this._data[e] : undefined
    },
    removeItem: function(e) {
        return delete this._data[e]
    },
    clear: function() {
        return this._data = {}
    }
};
LocalStorageManager.prototype.localStorageSupported = function() {
    var e = "test";
    var t = window.localStorage;
    try {
        t.setItem(e, "1");
        t.removeItem(e);
        return true
    } catch (n) {
        return false
    }
};
LocalStorageManager.prototype.getBestScore = function() {
    return this.storage.getItem(this.bestScoreKey) || 0
};
LocalStorageManager.prototype.setBestScore = function(e) {
    this.storage.setItem(this.bestScoreKey, e)
};
LocalStorageManager.prototype.getGameState = function() {
    var e = this.storage.getItem(this.gameStateKey);
    return e ? JSON.parse(e) : null
};
LocalStorageManager.prototype.setGameState = function(e) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(e))
};
LocalStorageManager.prototype.clearGameState = function() {
    this.storage.removeItem(this.gameStateKey)
};
LocalStorageManager.prototype.setnotice1Closed = function(e) {
    this.storage.setItem(this.notice1ClosedKey, JSON.stringify(e))
};
LocalStorageManager.prototype.getnotice1Closed = function() {
    return JSON.parse(this.storage.getItem(this.notice1ClosedKey) || "false")
};
GameManager.prototype.restart = function() {
    this.storageManager.clearGameState();
    this.actuator.continue();
    this.setup()
};
GameManager.prototype.keepPlaying = function() {
    this.keepPlaying = true;
    this.actuator.continue()
};
GameManager.prototype.isGameTerminated = function() {
    if (this.over || this.won && !this.keepPlaying) {
        return true
    } else {
        return false
    }
};
GameManager.prototype.setup = function() {
    var e = this.storageManager.getGameState();
    if (e) {
        this.grid = new Grid(e.grid.size, e.grid.cells);
        this.score = e.score;
        this.over = e.over;
        this.won = e.won;
        this.keepPlaying = e.keepPlaying
    } else {
        this.grid = new Grid(this.size);
        this.score = 0;
        this.over = false;
        this.won = false;
        this.keepPlaying = false;
        this.addStartTiles()
    }
    this.actuate()
};
GameManager.prototype.addStartTiles = function() {
    for (var e = 0; e < this.startTiles; e++) {
        this.addRandomTile()
    }
};
GameManager.prototype.addRandomTile = function() {
    if (this.grid.cellsAvailable()) {
        var e = Math.random() < .01 ? 4096 : 2048;
        var t = new Tile(this.grid.randomAvailableCell(), e);
        this.grid.insertTile(t)
    }
};
GameManager.prototype.actuate = function() {
    if (this.storageManager.getBestScore() < this.score) {
        this.storageManager.setBestScore(this.score)
    }
    if (this.over) {
        this.storageManager.clearGameState()
    } else {
        this.storageManager.setGameState(this.serialize())
    }
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
    this.grid.eachCell(function(e, t, n) {
        if (n) {
            n.mergedFrom = null;
            n.savePosition()
        }
    })
};
GameManager.prototype.moveTile = function(e, t) {
    this.grid.cells[e.x][e.y] = null;
    this.grid.cells[t.x][t.y] = e;
    e.updatePosition(t)
};
GameManager.prototype.move = function(e) {
    var t = this;
    if (this.isGameTerminated())
        return;
    var n,
        r;
    var i = this.getVector(e);
    var s = this.buildTraversals(i);
    var o = false;
    this.prepareTiles();
    s.x.forEach(function(e) {
        s.y.forEach(function(s) {
            n = {
                x: e,
                y: s
            };
            r = t.grid.cellContent(n);
            if (r) {
                var u = t.findFarthestPosition(n, i);
                var a = t.grid.cellContent(u.next);
                if (a && a.value === r.value && !a.mergedFrom) {
                    var f = new Tile(u.next, r.value / 2);
                    f.mergedFrom = [r, a];
                    t.grid.insertTile(f);
                    t.grid.removeTile(r);
                    r.updatePosition(u.next);
                    t.score += f.value;
                    external_score = t.score;
                    if (f.value === 1)
                        t.won = true
                } else {
                    t.moveTile(r, u.farthest)
                }
                if (!t.positionsEqual(n, r)) {
                    o = true
                }
            }
        })
    });
    if (o) {
        this.addRandomTile();
        if (!this.movesAvailable()) {
            this.over = true
        }
        this.actuate()
    }
};
GameManager.prototype.getVector = function(e) {
    var t = {
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
    };
    return t[e]
};
GameManager.prototype.buildTraversals = function(e) {
    var t = {
        x: [],
        y: []
    };
    for (var n = 0; n < this.size; n++) {
        t.x.push(n);
        t.y.push(n)
    }
    if (e.x === 1)
        t.x = t.x.reverse();
    if (e.y === 1)
        t.y = t.y.reverse();
    return t
};
GameManager.prototype.findFarthestPosition = function(e, t) {
    var n;
    do {
        n = e;
        e = {
            x: n.x + t.x,
            y: n.y + t.y
        }
    } while (this.grid.withinBounds(e) && this.grid.cellAvailable(e));
    return {
        farthest: n,
        next: e
    }
};
GameManager.prototype.movesAvailable = function() {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable()
};
GameManager.prototype.tileMatchesAvailable = function() {
    var e = this;
    var t;
    for (var n = 0; n < this.size; n++) {
        for (var r = 0; r < this.size; r++) {
            t = this.grid.cellContent({
                x: n,
                y: r
            });
            if (t) {
                for (var i = 0; i < 4; i++) {
                    var s = e.getVector(i);
                    var o = {
                        x: n + s.x,
                        y: r + s.y
                    };
                    var u = e.grid.cellContent(o);
                    if (u && u.value === t.value) {
                        return true
                    }
                }
            }
        }
    }
    return false
};
GameManager.prototype.positionsEqual = function(e, t) {
    return e.x === t.x && e.y === t.y
};
window.requestAnimationFrame(function() {
    new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
    var e = new LocalStorageManager;
    var t = document.querySelector(".notice-close-button");
    var n = document.querySelector(".app-notice");
    if (e.getnotice1Closed()) {
        n.parentNode.removeChild(n)
    } else {
        t.addEventListener("click", function() {
            n.parentNode.removeChild(n);
            e.setnotice1Closed(true);
            ga("send", "event", "notice", "closed")
        })
    }
})

