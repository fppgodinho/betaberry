angular.module('betaberry.darkhounds.net').factory('serviceRemote', ["serviceValidator",
    function(serviceValidator)                                                  {
        var service         = {};
        var _gridSize       = 5;
        
        function _createRequest()                                               {
            return {response:{data: null, error: null}};
        }

        var _betMockup      = null;
        var _puzzleMockup   = null;
        var _playedCells    = [];
        var _sessionMockup  = null;
        service.login       = function(email, password, callback)               {
            // TODO: Do the actual http request to the server API
            //
            var request            = _createRequest();
            if (!serviceValidator.checkEmail(email)) request.response.error = {code:'invallidEmail', msg:'Invalid Email'};
            else if (!serviceValidator.checkPassword(password)) request.response.error = {code:'invallidPassword', msg:'Invalid Password'};
            else if (_sessionMockup) request.response.error = {code:'sessionNotClosed', msg:'Session Not Closed'};
            else                                                                {
                _sessionMockup          = {name: "Jhon", lastName:"Doe", credits:1000};
                request.response.data   = {name: "Jhon", lastName:"Doe", credits:1000};
            }
            //
            _resetBetAndPuzzle();
            //
            if (callback && typeof callback === "function") callback(request.response);
            //
            return request;
        };
        
        function _resetBetAndPuzzle()                                           {
            _betMockup          = null;
            _puzzleMockup       = null;
            _playedCells.length = 0;
        }
        
        service.logout      = function(callback)                                {
            // TODO: Do the actual http request to the server API
            //
            var request            = _createRequest();
            if (!_sessionMockup) request.response.error  = {code:'sessionNotOpened', msg:'Session Not Opened'};
            else                                                                {
                _sessionMockup          = null;
                request.response.data   = {};
            }
            //
            _resetBetAndPuzzle();
            //
            if (callback && typeof callback === "function") callback(request.response);
            //
            return request;
        };
        
        service.bet         = function(amount, level, callback)                 {
            // TODO: Do an actual server API request

            var request            = _createRequest();
            if (!_sessionMockup) request.response.error = {code: "sessionClosed", msg: "Session closed"};
            else if (_betMockup) request.response.error = {code: "betOpened", msg: "Bet Already opened"};
            else if (!amount || isNaN(amount) || amount < 1) request.response.error = {code: "betInvalidAmount", msg: "Invalid bet amount"};
            else if (amount > _sessionMockup.credits) request.response.error = {code: "betToHigh", msg: "Bet is to high"};
            else if (!level || isNaN(level) || level < 1 || level > 4) request.response.error = {code: "betInvalidLevel", msg: "Bet has an invalid level"};
            else                                                                {
                _puzzleMockup           = _createPuzzle();
                _betMockup              =
                request.response.data   = {amount: amount, level: level};
            }
            
            if (callback && typeof callback === "function") callback(request.response);
            //
            return request;
        };
        
        var _honey      = 1;
        var _berries    = 2;
        var _traps      = 1;
        var _bees       = 2;
        function _createPuzzle()                                                {
            var cellPool    = _createGrid(_gridSize, null, true);
            var tokens  = {
                honney:     _drawCells(cellPool, _honey),
                berries:    _drawCells(cellPool, _berries),
                traps:      _drawCells(cellPool, _traps),
                bees:       _drawCells(cellPool, _bees)
            };

            var puzzle      = _createGrid(_gridSize, "");
            _setCellsToType(puzzle, tokens.honney,  "honey");
            _setCellsToType(puzzle, tokens.berries, "berry");
            _setCellsToType(puzzle, tokens.traps,   "trap");
            _setCellsToType(puzzle, tokens.bees,    "bee");
            
            console.log("Puzzle", puzzle);
            
            return puzzle;
        }
        
        function _createGrid(size, defaultValue, autoFill)                      {
            var table = [];
            for (var i = 0; i < size; i++)                                      {
                table[i] = [];
                for (var j = 0; j < size; j++) table[i][j] = autoFill?j:defaultValue;
            }
            return table;
        }
        
        function _drawCells(grid, count)                                        {
            var cells   = [];
            for (var i = 0; i < count; i++) cells.push(_drawCell(grid));
            return cells;
        }
        
        function _drawCell(grid)                                                {
            var rowID       = Math.round(Math.random() * (grid.length - 1));
            var cellID      = Math.round(Math.random() * (grid[rowID].length - 1));
            var cell        = [rowID, grid[rowID].splice(cellID, 1)[0]];
            if (!grid[rowID].length) grid.splice(rowID, 1);
            //
            return cell;
        }
        
        function _setCellsToType(grid, cells, type)                             {
            for (var id in cells) grid[cells[id][0]][cells[id][1]] = type;
        }

        service.play        = function(cell, callback)                          {
            // TODO: Do the actual http request to the server API
            //
            var request                 = _createRequest();
            if (!_sessionMockup)    request.response.error = {code: "sessionClosed", msg: "Session Closed"};
            else if (!_betMockup)   request.response.error = {code: "betClosed", msg: "No Bet Opened"};
            else if (_checkPlayedCell(_playedCells, cell)) request.response.error = {code: "slotAlreadyPlayed", msg: "The played slot was already played"};
            if (!request.response.error)                                        {
                var token                   = _puzzleMockup[cell[0]][cell[1]];
                cell.push(token);
                cell.push(_getDanger(cell[0], cell[1], _puzzleMockup));
                _playedCells.push(cell);

                request.response.data       = {
                    closed: (_playedCells.length >= _betMockup.level || token == "trap" || token == "bee"),
                    slots: _playedCells.slice()
                };

                if (request.response.data.closed)                               {
                    var gain                        = _endGame(_playedCells, _betMockup);
                    //
                    _sessionMockup.credits          = _sessionMockup.credits + gain;
                    if (_sessionMockup.credits < 0) _sessionMockup.credits = 0;
                    //
                    request.response.data.gain      = gain;
                    request.response.data.credits   = _sessionMockup.credits;
                    request.response.data.puzzle    = _parsePuzzle(_puzzleMockup);
                    //
                    _resetBetAndPuzzle();
                }
            }

            if (callback && typeof callback === "function") callback(request.response);
            
            return request;
        };
        
        function _checkPlayedCell(cells, cell)                                  {
            for (var i in cells)
                if (cells[i][0] == cell[0] && cells[i][1] == cell[1])
                    return true;
            //
            return false;
        }
        
        function _parsePuzzle(puzzle)                                           {
            var parsed = [];
            
            for (var i in puzzle)
                for (var j in puzzle[i])
                    parsed.push([i*1, j*1, puzzle[i][j]]);

            return parsed;
        }

        function _endGame(cells, bet)                                           {
            var bee     = false;
            var trap    = false;
            var bonus   = 0;
            for (var i in cells) switch (cells[i][2])                           {
                case 'trap':    trap    = true; break;
                case 'bee':     bee     = true; break;
                case 'honey':   bonus   += 3; break;
                case 'berry':   bonus   += 2; break;
                default: break;
            }
            if (!bonus && (trap || bee)) bonus = 1;
            var gain = (((trap?-3:(bee?-2:1)) * bonus * bet.amount) * bet.level) - bet.amount;
            
            return gain;
        }

        function _getDanger(row, col, puzzle)                                   {
            var tokens  = [];
            tokens.push((row <= 0 || col <= 0)?null:puzzle[row-1][col-1]);
            tokens.push((row <= 0)?null:puzzle[row-1][col]);
            tokens.push((row <= 0 || col >= _gridSize-1)?null:puzzle[row-1][col+1]);
            tokens.push((col <= 0)?null:puzzle[row][col-1]);
            tokens.push((col >= _gridSize-1)?null:puzzle[row][col+1]);
            tokens.push((row >= _gridSize-1 || col <= 0)?null:puzzle[row+1][col-1]);
            tokens.push((row >= _gridSize-1)?null:puzzle[row+1][col]);
            tokens.push((row >= _gridSize-1 || col >= _gridSize-1)?null:puzzle[row+1][col+1]);
            
            var danger  = 0;
            for (var i in tokens) if (tokens[i])
                danger += _tokenToDanger(tokens[i]);

            return danger;
        }
        
        function _tokenToDanger(token)                                          {
            switch (token)                                                      {
                case "bee":     return 1;
                case "trap":    return 1;
                case "berry":   return -1;
                case "honey":   return -1;
                default:        return 0;
            }
        }
        
        
        return service;
    }
]);
