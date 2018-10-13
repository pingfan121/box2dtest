
let mouseX,mouseY,isMouseDown,mouseJoint,mousePVec,selectedBody;

let laserSegment=null;

let affectedByLaser=new Array();
let entryPoint=new Array();

class MouseEvent2
{
    constructor()
    {
        canvas.addEventListener("mousedown", this.mouseDown.bind(this), true);
        canvas.addEventListener("mouseup", this.mouseUp.bind(this), true);
        canvas.addEventListener("mousemove", this.mouseMove.bind(this), true);
    }

     mouseDown(e){
        mouseX = e.offsetX / drawScale;
        mouseY = e.offsetY / drawScale;
        
        isMouseDown = true;

        laserSegment=new b2Segment();
        laserSegment.p1=new b2Vec2(mouseX,mouseY);
    };
    mouseMove(e){
        mouseX = e.offsetX / drawScale;
        mouseY = e.offsetY / drawScale;
         
        if(isMouseDown==true)
        {
            laserSegment.p2=new b2Vec2(mouseX,mouseY);

            console.log("1111");
        }
        
    };
    mouseUp(e)
    {
        isMouseDown=false;

        mouseX = e.offsetX / drawScale;
        mouseY = e.offsetY / drawScale;

        laserSegment.p2=new b2Vec2(mouseX,mouseY);

        affectedByLaser.length=0;
        entryPoint.length=0;

        world.RayCast(this.laserFired2.bind(this),laserSegment.p1,laserSegment.p2);
        world.RayCast(this.laserFired.bind(this),laserSegment.p2,laserSegment.p1);
    };

    update()
    {

       if (laserSegment!=null && laserSegment.p1 !=null && laserSegment.p2!=null )
        {
            ctx.beginPath();
            ctx.moveTo(laserSegment.p1.x*drawScale,laserSegment.p1.y*drawScale);
            ctx.lineTo(laserSegment.p2.x*drawScale,laserSegment.p2.y*drawScale);
            ctx.stroke();

        }
    };

    laserFired2(fixture,point,normal,fraction)
    {
       let affectedBody=fixture.GetBody();
       let fixtureIndex=affectedByLaser.indexOf(affectedBody);

       if (fixtureIndex==-1)
        {
               affectedByLaser.push(affectedBody);
               entryPoint.push(point);
       }

       return 0;
    }

    laserFired(fixture,point,normal,fraction)
     {
        let affectedBody=fixture.GetBody();
        let affectedPolygon=fixture.GetShape();
        let fixtureIndex=affectedByLaser.indexOf(affectedBody);

        if (fixtureIndex!=-1)
         {
                var rayCenter=new b2Vec2((point.x+entryPoint[fixtureIndex].x)/2,(point.y+entryPoint[fixtureIndex].y)/2);
                var rayAngle=Math.atan2(entryPoint[fixtureIndex].y-point.y,entryPoint[fixtureIndex].x-point.x);
                var polyVertices=affectedPolygon.GetVertices();
                var newPolyVertices1=new Array();
                var newPolyVertices2=new Array();
                var currentPoly=0;
                var cutPlaced1=false;
                var cutPlaced2=false;

                for (var i=0; i<polyVertices.length; i++) {
                        var worldPoint=affectedBody.GetWorldPoint(polyVertices[i]);
                        var cutAngle=Math.atan2(worldPoint.y-rayCenter.y,worldPoint.x-rayCenter.x)-rayAngle;
                        if (cutAngle<Math.PI*-1) {
                                cutAngle+=2*Math.PI;
                        }
                        if (cutAngle>0&&cutAngle<=Math.PI) {
                                if (currentPoly==2) {
                                        cutPlaced1=true;
                                        newPolyVertices1.push(point);
                                        newPolyVertices1.push(entryPoint[fixtureIndex]);
                                }
                                newPolyVertices1.push(worldPoint);
                                currentPoly=1;
                        } else {
                                if (currentPoly==1) {
                                        cutPlaced2=true;
                                        newPolyVertices2.push(entryPoint[fixtureIndex]);
                                        newPolyVertices2.push(point);
                                }
                                newPolyVertices2.push(worldPoint);
                                currentPoly=2;

                        }
                }
                if (! cutPlaced1) {
                        newPolyVertices1.push(point);
                        newPolyVertices1.push(entryPoint[fixtureIndex]);
                }
                if (! cutPlaced2) {
                        newPolyVertices2.push(entryPoint[fixtureIndex]);
                        newPolyVertices2.push(point);
                }
                this.createSlice(newPolyVertices1,newPolyVertices1.length,affectedBody);
                this.createSlice(newPolyVertices2,newPolyVertices2.length,affectedBody);
                world.DestroyBody(affectedBody);
        }
        return 1;
    };
    drawCircle(origin)
     {
       // canvas.graphics.lineStyle(2,color);
       // canvas.graphics.drawCircle(origin.x*worldScale,origin.y*worldScale,5);

        ctx.beginPath();
        ctx.arc(origin.x*drawScale,origin.y*drawScale,5,0,2*Math.PI);
        ctx.stroke();
    };

    createSlice(vertices,numVertices,oldbody)
     {
        var centre=this.findCentroid(vertices,vertices.length);
        for (var i=0; i<numVertices; i++) {
                vertices[i].Subtract(centre);
        }
        var sliceBody= new b2BodyDef();
        sliceBody.position.Set(centre.x, centre.y);
        sliceBody.type=b2Body.b2_dynamicBody;
        var slicePoly = new b2PolygonShape();
        slicePoly.SetAsVector(vertices,numVertices);
        var sliceFixture = new b2FixtureDef();
        sliceFixture.shape=slicePoly;
        sliceFixture.density=1;
        var worldSlice=world.CreateBody(sliceBody);
        worldSlice.CreateFixture(sliceFixture);
        for (i=0; i<numVertices; i++) {
                vertices[i].Add(centre);
        }
        if(oldbody.update!=null)
        {
                worldSlice.update=oldbody.update;
                worldSlice.centerpoint=worldSlice.GetLocalPoint(oldbody.GetWorldPoint(oldbody.centerpoint));

                worldSlice.lastangle=oldbody.GetAngle()+oldbody.lastangle;
        }
       
    }

    findCentroid(vs, count) 
    {
        var c = new b2Vec2();
        var area=0.0;
        var p1X=0.0;
        var p1Y=0.0;
        var inv3=1.0/3.0;
        for (var i = 0; i < count; ++i) {
                var p2=vs[i];
                var p3=i+1<count?vs[i+1]:vs[0];
                var e1X=p2.x-p1X;
                var e1Y=p2.y-p1Y;
                var e2X=p3.x-p1X;
                var e2Y=p3.y-p1Y;
                var D = (e1X * e2Y - e1Y * e2X);
                var triangleArea=0.5*D;
                area+=triangleArea;
                c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
                c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
        }
        c.x*=1.0/area;
        c.y*=1.0/area;
        return c;
    }

    getlastcenter(p1,p2)
    {

        // let a =180/Math.PI * angle;

        // let x0= (p1.x - p2.x)*Math.cos(a) - (p1.y - p2.y)*Math.sin(a) + p2.x ;

        // let y0= (p1.x - p2.x)*Math.sin(a) + (p1.y - p2.y)*Math.cos(a) + p2.y ;
        
        // return new b2Vec2(x0,y0);

    let x=Math.abs(p1.x-p2.x);
    let y=Math.abs(p1.y-p2.y);
    let z=Math.sqrt(x*x+y*y);
      return Math.asin(y/z)
    }

   
}