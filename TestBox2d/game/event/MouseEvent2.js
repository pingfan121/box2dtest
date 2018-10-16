
let mouseX,mouseY,isMouseDown,mouseJoint,mousePVec,selectedBody;

let laserSegment=null;

let affectedByLaser=new Array();
let affectedByLaser2=new Array();
let entryPoint=new Array();

let selectbody=null;

let inflag=false;

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
        affectedByLaser2.length=0;
        entryPoint.length=0;

        selectbody=null;
        inflag=false;

        world.RayCast(this.laserFired2.bind(this),laserSegment.p1,laserSegment.p2);
        world.RayCast(this.laserFired3.bind(this),laserSegment.p2,laserSegment.p1);

        if(inflag==true)
        {
                this.laserFired4();
        }

       
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

       if (selectbody==null)
        {
               selectbody=affectedBody;
               affectedByLaser.push(fixture);
               entryPoint.push(point);
       }
       else if(affectedBody == selectbody)
       {
                affectedByLaser.push(fixture);
                entryPoint.push(point);
       }

       return 1;
    }

    laserFired3(fixture,point,normal,fraction)
    {
       let affectedBody=fixture.GetBody();
      

       if (selectbody==null)
       {
            return 0;
       }
       else if(affectedBody == selectbody)
       {
        let fixtureIndex=affectedByLaser.indexOf(fixture);

        if(fixtureIndex!=-1)
        {
                let object=new Object();

                object.fixture=fixture;

                object.startpoint=entryPoint[fixtureIndex];
                object.endpoint=point;

                affectedByLaser2.push(object);

                inflag=true;
        }
       }

       return 1;
    }

    laserFired4()
     {

        console.log("怎么回事111");
        if(selectbody==null)
        {
                return;
        }

        console.log("怎么回事222");
        
        let affectedBody=selectbody;

        let new1=new Array();
        let new2=new Array();


        //没有被切割的纹理
        let fixarr=new Array();


        for( let fix=selectbody.GetFixtureList();fix != null;fix=fix.GetNext())
        {
                let flag=false;

                affectedByLaser2.forEach(data => {
                        if(data.fixture==fix)
                        {  
                                flag=true;
                                return false;
                        }
                });

                if(flag==false)
                {
                        fixarr.push(fix);
                }
        }


        






        affectedByLaser2.forEach(data => {
                
                let affectedPolygon=data.fixture.GetShape();

                let point=data.endpoint;
                let entryPoint=data.startpoint;
        
             
                let rayCenter=new b2Vec2((point.x+entryPoint.x)/2,(point.y+entryPoint.y)/2);
                let rayAngle=Math.atan2(entryPoint.y-point.y,entryPoint.x-point.x);
                let polyVertices=affectedPolygon.GetVertices();
                let newPolyVertices1=new Array();
                let newPolyVertices2=new Array();
                let currentPoly=0;
                let cutPlaced1=false;
                let cutPlaced2=false;

                for (let i=0; i<polyVertices.length; i++) {
                        let worldPoint=affectedBody.GetWorldPoint(polyVertices[i]);
                        let cutAngle=Math.atan2(worldPoint.y-rayCenter.y,worldPoint.x-rayCenter.x)-rayAngle;
                        if (cutAngle<Math.PI*-1) {
                                cutAngle+=2*Math.PI;
                        }
                        if (cutAngle>0&&cutAngle<=Math.PI) {
                                if (currentPoly==2) {
                                        cutPlaced1=true;
                                        newPolyVertices1.push(point);
                                        newPolyVertices1.push(entryPoint);
                                }
                                newPolyVertices1.push(worldPoint);
                                currentPoly=1;
                        } else {
                                if (currentPoly==1) {
                                        cutPlaced2=true;
                                        newPolyVertices2.push(entryPoint);
                                        newPolyVertices2.push(point);
                                }
                                newPolyVertices2.push(worldPoint);
                                currentPoly=2;

                        }
                }
                if (! cutPlaced1) {
                        newPolyVertices1.push(point);
                        newPolyVertices1.push(entryPoint);
                }
                if (! cutPlaced2) {
                        newPolyVertices2.push(entryPoint);
                        newPolyVertices2.push(point);
                }

                new1.push(newPolyVertices1);
                new2.push(newPolyVertices2);

        });

        //找出没有被切割的纹理
        //------------------------------

        // let i=0;
        // while(i<fixarr.length)
        // {
        //         let ps1=fixarr[i].GetShape().GetVertices();

        //         for(let k=0;k<ps1.length;k++)
        //         {
        //            let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
   
        //            if(this.haveItem2(new1,worldPoint)==true && this.haveItem2(new2,worldPoint)==false)
        //            {
        //                    let worlds=new Array();
   
        //                    ps1.forEach(element => {
        //                            let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
        //                            worlds.push(worldPoint);
        //                    });
   
        //                    new1.push(worlds);
        //                    fixarr.splice(i, 1); 
        //                    i=0;
        //                    break;
        //            }
        //            else if(this.haveItem2(new2,worldPoint)==true && this.haveItem2(new1,worldPoint)==false)
        //            {
        //                    let worlds=new Array();
   
        //                    ps1.forEach(element => {
        //                            let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
        //                            worlds.push(worldPoint);
        //                    });
        //                    new2.push(worlds);
        //                    fixarr.splice(i, 1); 
        //                    i=0;
        //                    break;
        //            }
        //            else
        //            {
        //                    i++;
        //            }
        //         }
        // }

        this.tttt(fixarr,new1,new2,affectedBody);

        //-------------------------------


        this.createSlice2(new1,affectedBody);
        this.createSlice2(new2,affectedBody);
        world.DestroyBody(affectedBody);
    };


    tttt(fixarr,new1,new2,affectedBody)
    {
        for(let i=0;i<fixarr.length;i++)
        {
                let ps1=fixarr[i].GetShape().GetVertices();

                let flag=false;

                for(let k=0;k<ps1.length;k++)
                {
                   let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
   
                   if(haveItem2(new1,worldPoint)==true && haveItem2(new2,worldPoint)==false)
                   {
                           let worlds=new Array();
   
                           ps1.forEach(element => {
                                   let worldPoint=affectedBody.GetWorldPoint(element);
                                   worlds.push(worldPoint);
                           });
   
                           new1.push(worlds);
                           fixarr.splice(i, 1); 
                           flag=true;
                           break;
                   }
                   else if(haveItem2(new2,worldPoint)==true && haveItem2(new1,worldPoint)==false)
                   {
                           let worlds=new Array();
   
                           ps1.forEach(element => {
                                   let worldPoint=affectedBody.GetWorldPoint(element);
                                   worlds.push(worldPoint);
                           });
                           new2.push(worlds);
                           fixarr.splice(i, 1); 
                           flag=true;
                           break;
                   }
                }

                if(flag==true)
                {
                   this.tttt(fixarr,new1,new2,affectedBody);
                   return ;
                }
        }
    }

    drawCircle(origin)
     {
       // canvas.graphics.lineStyle(2,color);
       // canvas.graphics.drawCircle(origin.x*worldScale,origin.y*worldScale,5);

        ctx.beginPath();
        ctx.arc(origin.x*drawScale,origin.y*drawScale,5,0,2*Math.PI);
        ctx.stroke();
    };

    createSlice2(fixtures,oldbody)
     {
        let fix= oldbody.GetFixtureList();

        var sliceFixture = new b2FixtureDef();
        sliceFixture.density= fix.GetDensity();
        sliceFixture.friction= fix.GetFriction();
        sliceFixture.restitution=fix.GetRestitution();

        var sliceBody= new b2BodyDef();
     //   sliceBody.position.Set(centre.x, centre.y);
        sliceBody.type=b2Body.b2_dynamicBody;


        let worldSlice=world.CreateBody(sliceBody);





        //找到中心点

        let temppoints=new Array();

        fixtures.forEach(element => {
               
                element.forEach(item => {
                        if(haveItem(temppoints,item)==false)
                        {
                                temppoints.push(item);
                        }
                });
                
        });

        //顺时针排序
        arrangeClockwise(temppoints);

        let centre=findCentroid(temppoints,temppoints.length);

        worldSlice.SetPosition(centre);

        fixtures.forEach(item => {
                

                let vertices=item;
                let numVertices=item.length;

                for (let i=0; i<numVertices; i++) {
                        vertices[i].Subtract(centre);
                }
              
                let slicePoly = new b2PolygonShape();
                slicePoly.SetAsVector(vertices,numVertices);
                sliceFixture.shape=slicePoly;
                worldSlice.CreateFixture(sliceFixture);

                for (i=0; i<numVertices; i++) {
                        vertices[i].Add(centre);
                }
        });

      
       
        worldSlice.allpoints=temppoints;

        if(oldbody.update!=null)
        {
                worldSlice.update=oldbody.update;
                worldSlice.centerpoint=worldSlice.GetLocalPoint(oldbody.GetWorldPoint(oldbody.centerpoint));

                worldSlice.lastangle=oldbody.GetAngle()+oldbody.lastangle;
        }
       
    }

   

   
}