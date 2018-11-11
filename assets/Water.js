var horizontalRoutes = new Array();
var horRouteIndex = -1;
var verticalRoutes = new Array();
var vertRouteIndex = -1;

var horizontalActive = 0;
var verticalActive = 0;

var startPosition;
var goalPosition;

var rotation = 0;

var started = false;
var timer = 0;
var targetRoutes;
var routeTileCount = 0;
var numTilesInRoute = 0;
var flowSpeed = 2.0;
var rotated = true;
var tileSize = 64;
var currentWaterPosition;
var lerp = true;

cc.Class({
    extends: cc.Component,

    properties: {
        pathLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        startLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        goalLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        lineGraphics: {
            default: null,
            type: cc.Graphics,
        },
    },

    start () {
        for(var i = 0; i < 12; i++)
        {
            for(var j = 0; j < 12; j++)
            {
                if( this.startLayer.getTileGIDAt(i,j))
                {
                    startPosition = new cc.Vec2(i, j);
                }
            }
        }

        this.findRoutes(startPosition);
        for(var i = 0; i < horizontalRoutes.length; i++)
        {
            cc.log("HORIZONTAL ROUTE " + i + ": ");
            for(var j = 0; j < horizontalRoutes[i].length; j++)
            {
                cc.log("    " + horizontalRoutes[i][j].x + " " + horizontalRoutes[i][j].y);
            }
        }

        for(var i = 0; i < verticalRoutes.length; i++)
        {
            cc.log("VERTICAL ROUTE " + i + ": ");
            for(var j = 0; j < verticalRoutes[i].length; j++)
            {
                cc.log("    " + verticalRoutes[i][j].x + " " + verticalRoutes[i][j].y);
            }
        }

        //Need to sort vertical routes by the y value
        //and horizontal routes by the x value.


        currentWaterPosition = startPosition;
        started = true;
    },

    update(dt)
    {
        cc.log("CALLING UPDATE");
        timer = timer + dt;
        cc.log("timer: " + timer);
        if(!started)
        {
            return;
        }

        //We rotated the puzzle
        if(rotated)
        {
            targetRoutes = new Array();
            var targetRouteCount = 0;
           switch(rotation)
            {
                case 0:
                {
                    //Check if this tile is at the start of any vertical routes
                    for(var i = 0; i < verticalRoutes.length; i++)
                    {
                        for(var j = 0; j < verticalRoutes[i].length; j++)
                        {
                            if( verticalRoutes[i][j].x == currentWaterPosition.x &&
                                verticalRoutes[i][j].y == currentWaterPosition.y)
                            {
                                var targetRoute = new Array();
                                for(var k = j; k < verticalRoutes[i].length - j; k++)
                                {
                                    targetRoute[k-j] = verticalRoutes[i][k];
                                }
                                targetRoutes[targetRouteCount] = targetRoute;
                                targetRouteCount++;
                            }
                        }
                    }
                }
                break;
                case 90:
                {
                    //Check if this tile is at the start of any horizontal routes

                }break;
                case 180:
                {
                    //Check if this tile is at the end of any horizontal routes

                }break;
                case 270:
                {
                    //Check if this tile is at the end of any vertical routes

                }
            }
            rotated = false;
            lerp = true;
        }

        if(lerp)
        {
        for(var i = 0; i < targetRoutes.length; i++)
        {
            cc.log("WE GOT HERE");
            var startPos = this.pathLayer.getPositionAt(targetRoutes[0][0].x, targetRoutes[0][0].y);
            cc.log("WE GOT HERE2");
            //Everything is from the BOTTOM MIDDLE WHAT THE FUCK
            startPos.y += tileSize;
            startPos.y -= this.node.height / 2;
            startPos.x -= this.node.width / 2;
            cc.log("WE GOT HERE3");

            this.lineGraphics.clear(false);
            cc.log("WE GOT HERE4");
            switch(rotation)
            {
                case 0:
                {
                    this.lineGraphics.roundRect(startPos.x, startPos.y, 64, -tileSize * 5 * (timer / flowSpeed), 0);
               }break;
                case 90:
                {
                    this.lineGraphics.roundRect(startPos.x, startPos.y, tileSize * targetRoutes[i].length * (timer / flowSpeed), 64, 0);
                }break;
                case 180:
                {
                    this.lineGraphics.roundRect(startPos.x, startPos.y, 64, tileSize * targetRoutes[i].length * (timer / flowSpeed), 0);
                }break;
                case 270:
               {
                    this.lineGraphics.roundRect(startPos.x, startPos.y, -tileSize * targetRoutes[i].length * (timer / flowSpeed), 64, 0);
                }
            }

       }
        this.lineGraphics.fill();
        this.lineGraphics.stroke();
        }

        if(timer > flowSpeed)
        {
            timer = 0;
            lerp = false;
        }

    },

    findRoutes(routeStartPosition)
    {
        var processStack = [];
        processStack.push(routeStartPosition);
        while(true)
        {
            routeStartPosition = processStack.pop();
            var noHor = false;
            if( routeStartPosition.x - 1 >= 0 && this.pathLayer.getTileGIDAt(routeStartPosition.x - 1,routeStartPosition.y) != 0)
            {
                if(horizontalActive == 0)
                {
                    horRouteIndex = horRouteIndex + 1;
                    horizontalRoutes[horRouteIndex] = new Array();
                    horizontalActive = 1;
                    horizontalRoutes[horRouteIndex].push(routeStartPosition);
                }
                var tile = new cc.Vec2(routeStartPosition.x - 1,routeStartPosition.y);
                var alreadyInList = false;
                for(var i = 0; i <horizontalRoutes[horRouteIndex].length; i++)
                {
                    if(horizontalRoutes[horRouteIndex][i].x == tile.x &&
                        horizontalRoutes[horRouteIndex][i].y == tile.y)
                        {
                            alreadyInList = true;
                        }
                }
                if(!alreadyInList)
                {
                    horizontalRoutes[horRouteIndex].push(tile);
                    processStack.push(tile);
                }    
            }else
            {
                noHor = true;
            }
            if(routeStartPosition.x + 1 < 12 && this.pathLayer.getTileGIDAt(routeStartPosition.x + 1,routeStartPosition.y) != 0)
            {
                if(horizontalActive == 0)
                {
                    horRouteIndex = horRouteIndex + 1;
                    horizontalRoutes[horRouteIndex] = new Array();
                    horizontalActive = 1;
                    horizontalRoutes[horRouteIndex].push(routeStartPosition);
                }
                var tile = new cc.Vec2(routeStartPosition.x + 1,routeStartPosition.y);
                var alreadyInList = false;
                for(var i = 0; i <horizontalRoutes[horRouteIndex].length; i++)
                {
                    if(horizontalRoutes[horRouteIndex][i].x == tile.x &&
                        horizontalRoutes[horRouteIndex][i].y == tile.y)
                        {
                            alreadyInList = true;
                        }
                }
                if(!alreadyInList)
                {
                    horizontalRoutes[horRouteIndex].push(tile);
                    processStack.push(tile);
                } 
            }else if(noHor)
            {
                //There are no horizontal tiles either way, so we need to stop the horizontal stuff
                horizontalActive = 0;
            }     

            var noVert = false;
            if( routeStartPosition.y - 1 >= 0 && this.pathLayer.getTileGIDAt(routeStartPosition.x,routeStartPosition.y - 1) != 0)
            {
                if(verticalActive == 0)
                {
                    vertRouteIndex = vertRouteIndex + 1;
                    verticalRoutes[vertRouteIndex] = new Array();
                    verticalActive = 1;
                    verticalRoutes[vertRouteIndex].push(routeStartPosition);
                }
                var tile = new cc.Vec2(routeStartPosition.x,routeStartPosition.y - 1);
                var alreadyInList = false;
                for(var i = 0; i <verticalRoutes[vertRouteIndex].length; i++)
                {
                    if(verticalRoutes[vertRouteIndex][i].x == tile.x &&
                        verticalRoutes[vertRouteIndex][i].y == tile.y)
                        {
                            alreadyInList = true;
                        }
                }
                if(!alreadyInList)
                {
                    verticalRoutes[vertRouteIndex].push(tile);
                    processStack.push(tile);
                }
            }else
            {
                noVert = true;
            }
            if(routeStartPosition.y + 1 < 12 && this.pathLayer.getTileGIDAt(routeStartPosition.x,routeStartPosition.y + 1) != 0)
            {
                if(verticalActive == 0)
                {
                    vertRouteIndex = vertRouteIndex + 1;
                    verticalRoutes[vertRouteIndex] = new Array();
                    verticalActive = 1;
                    verticalRoutes[vertRouteIndex].push(routeStartPosition);
                }
                var tile = new cc.Vec2(routeStartPosition.x,routeStartPosition.y + 1);
                var alreadyInList = false;
                for(var i = 0; i <verticalRoutes[vertRouteIndex].length; i++)
                {
                    if(verticalRoutes[vertRouteIndex][i].x == tile.x &&
                        verticalRoutes[vertRouteIndex][i].y == tile.y)
                        {
                            alreadyInList = true;
                        }
                }
                if(!alreadyInList)
                {
                    verticalRoutes[vertRouteIndex].push(tile);
                    processStack.push(tile);
                }
            }else if(noVert)
            {
                //There are no vertical tiles either way, so we need to stop the vertical stuff
                verticalActive = 0;
            }

            if(processStack.length == 0)
            {
                //All done!
                break;
            }
        }
    },
});
