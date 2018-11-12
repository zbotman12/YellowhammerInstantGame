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
var targetRoute;
var routeTileCount = 0;
var numTilesInRoute = 0;
var flowSpeed = 0.5;
var timer = flowSpeed;
var rotated = true;
var tileSize = 64;
var currentWaterPosition;
var lerp = true;
var waterTile;
var waterScaleConstant;

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
            type: cc.Sprite,
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

        //Sort Horizontal Routes left To right
        for(var i = 0; i < horizontalRoutes.length; i++)
        {
            for(var j = 0; j < horizontalRoutes[i].length; j++)
            {
                for(var k = j; k < horizontalRoutes[i].length; k++)
                {
                    if(horizontalRoutes[i][j].x > horizontalRoutes[i][k].x)
                    {
                        var temp =  horizontalRoutes[i][j];
                        horizontalRoutes[i][j] = horizontalRoutes[i][k];
                        horizontalRoutes[i][k] = temp;
                    }
                }
                
            }
        }

        //Sort Vertical Routes top to bottom
        for(var i = 0; i < verticalRoutes.length; i++)
        {
            for(var j = 0; j < verticalRoutes[i].length; j++)
            {
                for(var k = j; k < verticalRoutes[i].length; k++)
                {
                    if(verticalRoutes[i][j].y > verticalRoutes[i][k].y)
                    {
                        var temp =  verticalRoutes[i][j];
                        verticalRoutes[i][j] = verticalRoutes[i][k];
                        verticalRoutes[i][k] = temp;
                    }
                }
                
            }
        }
        currentWaterPosition = startPosition;
        waterTile = this.lineGraphics.node;

        started = true;
    },

    update(dt)
    {
        if(!started)
        {
            return;
        }

        //We rotated the puzzle
        if(rotated)
        {
            targetRoute = new Array();
            cc.log("currentWaterPosition: " + currentWaterPosition.x + ", " + currentWaterPosition.y);
           switch(rotation)
            {
                case 0:
                {
                    //Check if this tile is at the start of any vertical routes
                    for(var i = 0; i < verticalRoutes.length; i++)
                    {
                        for(var j = 0; j < verticalRoutes[i].length; j++)
                        {
                            if( verticalRoutes[i][0].x == currentWaterPosition.x &&
                                verticalRoutes[i][0].y == currentWaterPosition.y)
                            {
                                targetRoute = verticalRoutes[i];
                            //    for(var k = j; k < verticalRoutes[i].length - j; k++)
                            //    {
                            //        targetRoute[k-j] = verticalRoutes[i][k];
                            //    }
                            }
                        }
                    }
                }
                break;
                case 1:
                {
                    //Check if this tile is at the start of any horizontal routes
                    for(var i = 0; i < horizontalRoutes.length; i++)
                    {
                        for(var j = 0; j < horizontalRoutes[i].length; j++)
                        {
                            if( horizontalRoutes[i][0].x == currentWaterPosition.x &&
                                horizontalRoutes[i][0].y == currentWaterPosition.y)
                            {
                                targetRoute = horizontalRoutes[i];
                            //    for(var k = j; k < horizontalRoutes[i].length - j; k++)
                            //    {
                            //        targetRoute[k-j] = horizontalRoutes[i][k];
                            //    }
                            }
                        }
                    }
                }break;
                case 2:
                {
                    for(var i = 0; i < verticalRoutes.length; i++)
                    {
                        for(var j = 0; j < verticalRoutes[i].length; j++)
                        {
                            if( verticalRoutes[i][verticalRoutes[i].length - 1].x == currentWaterPosition.x &&
                                verticalRoutes[i][verticalRoutes[i].length - 1].y == currentWaterPosition.y)
                            {
                                targetRoute = verticalRoutes[i].reverse();
                                //for(var k = j; k >= 0; k--)
                                //{
                                //    targetRoute[j - k] = verticalRoutes[i][k];
                                //}
                            }
                        }
                    }

                }break;
                case 3:
                {
                    for(var i = 0; i < horizontalRoutes.length; i++)
                    {
                        for(var j = 0; j < horizontalRoutes[i].length; j++)
                        {
                            if( horizontalRoutes[i][horizontalRoutes[i].length - 1].x == currentWaterPosition.x &&
                                horizontalRoutes[i][horizontalRoutes[i].length - 1].y == currentWaterPosition.y)
                            {
                                targetRoute = horizontalRoutes[i].reverse();
                            }
                        }
                    }
                }
            }
            rotated = false;
            lerp = true;
        }

        if(lerp)
        {
           timer = timer + dt;
           if(timer >= flowSpeed)
           {
                timer = 0;
                waterTile.setScale(cc.Vec2.ONE);
                waterTile = cc.instantiate(this.lineGraphics.node);
                if(routeTileCount == targetRoute.length)
                {
                    //currentWaterPosition.x = targetRoute[targetRoute.length - 1].x;
                    //currentWaterPosition.y = targetRoute[targetRoute.length - 1].y;
                    routeTileCount = 0;
                    lerp = false;
                }else
                {
                    cc.log("targetRouteStartPosition: " + targetRoute[0].x + " " + targetRoute[0].y );
                    var tilePosition = this.pathLayer.getPositionAt(targetRoute[0].x, targetRoute[0].y);
                    tilePosition.y -= this.node.height / 2;
                    tilePosition.x -= this.node.width / 2;
                    tilePosition.y += tileSize;
                    //spawn a new tile.
                    //waterTile = cc.instantiate(this.lineGraphics.node);
                    waterTile.parent = this.node;
                    waterTile.setScale(0,0);
                    
                    switch(rotation)
                    {
                        case 0:{
                            waterTile.setPosition(tilePosition.x,tilePosition.y - routeTileCount * tileSize);
                            waterScaleConstant = new cc.Vec2(1,0);
                        }break;
                        case 1:{ 
                            waterTile.setPosition(tilePosition.x + routeTileCount * tileSize, tilePosition.y);
                            waterScaleConstant = new cc.Vec2(0,1);
                        }break;
                        case 2:{
                            waterTile.setPosition(tilePosition.x,tilePosition.y + (routeTileCount - 1) * tileSize);
                            waterScaleConstant = new cc.Vec2(1,0);
                            waterTile.anchorY = 0;
                            }break;
                        case 3:{
                            waterTile.setPosition(tilePosition.x - (routeTileCount - 1) * tileSize - 1, tilePosition.y);
                            waterScaleConstant = new cc.Vec2(0,1);
                            waterTile.anchorX = 1;
                        }break;
                    }
                    currentWaterPosition = new cc.Vec2(targetRoute[routeTileCount].x, targetRoute[routeTileCount].y);
                    routeTileCount++;
                }
            }else
            {
                waterTile.setScale(waterScaleConstant);
                if(waterTile.scaleY == 0)
                {
                        waterTile.scaleY = timer/flowSpeed;
                }else
                {
                        waterTile.scaleX = timer/flowSpeed;
                }
            }
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

    RotateLeft()
    {
        if(rotation == 0)
        {
            rotation = 3;
        }else
        {
            rotation--;
        }
        cc.log(rotation);
        rotated = true;
    },

    RotateRight()
    {
        if(rotation == 3)
        {
            rotation = 0;
        }else
        {
            rotation++;
        }
        cc.log(rotation);
        rotated = true;
    }
});
